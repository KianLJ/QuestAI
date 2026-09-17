import webpush from "web-push";

webpush.setVapidDetails(
  "mailto:" + process.env.VAPID_EMAIL,
  process.env.VAPID_PUBLIC_KEY,
  process.env.VAPID_PRIVATE_KEY
);

const PROJECT_ID = process.env.FIREBASE_PROJECT_ID;
const DAY_KEYS = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];

async function getAccessToken() {
  const { createSign } = await import("crypto");
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n");
  const now = Math.floor(Date.now() / 1000);
  const header = Buffer.from(JSON.stringify({ alg: "RS256", typ: "JWT" })).toString("base64url");
  const claim = Buffer.from(JSON.stringify({
    iss: clientEmail,
    scope: "https://www.googleapis.com/auth/datastore",
    aud: "https://oauth2.googleapis.com/token",
    exp: now + 3600,
    iat: now,
  })).toString("base64url");
  const sign = createSign("RSA-SHA256");
  sign.update(`${header}.${claim}`);
  const signature = sign.sign(privateKey, "base64url");
  const jwt = `${header}.${claim}.${signature}`;
  const resp = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: `grant_type=urn:ietf:params:oauth:grant-type:jwt-bearer&assertion=${jwt}`,
  });
  const data = await resp.json();
  return data.access_token;
}

// Lists every per-user doc in the "storage" collection (one per signed-up
// user, keyed by their Firebase Auth uid), handling pagination.
async function firestoreListAll(token, collectionPath) {
  const docs = [];
  let pageToken = null;
  do {
    const url = new URL(`https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents/${collectionPath}`);
    url.searchParams.set("pageSize", "300");
    if (pageToken) url.searchParams.set("pageToken", pageToken);
    const resp = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
    if (!resp.ok) throw new Error(`Firestore LIST failed: ${resp.status} ${await resp.text()}`);
    const data = await resp.json();
    docs.push(...(data.documents || []));
    pageToken = data.nextPageToken || null;
  } while (pageToken);
  return docs;
}

function extractSubscription(doc) {
  const sub = doc?.fields?.pushSubscription?.mapValue?.fields;
  if (!sub) return null;
  const endpoint = sub.endpoint?.stringValue;
  const p256dh = sub.keys?.mapValue?.fields?.p256dh?.stringValue;
  const auth = sub.keys?.mapValue?.fields?.auth?.stringValue;
  if (!endpoint || !p256dh || !auth) return null;
  return { endpoint, keys: { p256dh, auth } };
}

function extractAppData(doc) {
  // Data is stored as a JSON string in the "quest-log-data" field
  const raw = doc?.fields?.["quest-log-data"]?.stringValue;
  if (!raw) return null;
  try { return JSON.parse(raw); }
  catch { return null; }
}

function formatDeadline(hhmm) {
  const [h, m] = hhmm.split(":").map(Number);
  const period = h >= 12 ? "PM" : "AM";
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return `${h12}:${String(m).padStart(2, "0")} ${period}`;
}

function todayStr() {
  return new Date().toISOString().slice(0, 10);
}

function buildNotifications(appData, { today, isMidday, isEvening, isMonday, dayKey }) {
  const quests          = appData.quests || [];
  const habits          = appData.habits || [];
  const pendingBattle    = appData.pendingBattle;
  const battleState      = appData.battleState;
  const workoutSchedule  = appData.workoutSchedule || {};
  const workoutPlans     = appData.workoutPlans || [];
  const workoutHistory   = appData.workoutHistory || [];

  const notifications = [];

  const incompleteHabits = habits.filter((h) => h.lastCompletedDate !== today);

  // ---- Habits — midday nudge names anything due soon, evening is a last call ----
  if (incompleteHabits.length > 0) {
    if (isMidday) {
      const withDeadlines = incompleteHabits.filter((h) => h.deadlineTime);
      const body = withDeadlines.length > 0
        ? withDeadlines.slice(0, 3).map((h) => `${h.name} (${formatDeadline(h.deadlineTime)})`).join(", ") + (incompleteHabits.length > withDeadlines.length ? ` +${incompleteHabits.length - withDeadlines.length} more` : "")
        : incompleteHabits.length === 1
          ? `"${incompleteHabits[0].name}" today.`
          : `${incompleteHabits.length} habits to complete today.`;
      notifications.push({ title: "🌿 Habit check-in", body, tag: "habit-midday" });
    }
    if (isEvening) {
      notifications.push({
        title: "🌿 Habits still pending",
        body: incompleteHabits.length === 1
          ? `"${incompleteHabits[0].name}" — don't lose your streak.`
          : `${incompleteHabits.length} habits still incomplete: ${incompleteHabits.slice(0, 3).map((h) => h.name).join(", ")}${incompleteHabits.length > 3 ? "…" : ""}`,
        tag: "habit-evening",
      });
    }
  }

  // ---- Overdue quests — evening only ----
  if (isEvening) {
    const overdueToday = quests.filter((q) => !q.completed && q.date === today);
    if (overdueToday.length > 0) {
      notifications.push({
        title: "⚔ Quests remaining!",
        body: overdueToday.length === 1
          ? `"${overdueToday[0].title}" is still incomplete.`
          : `${overdueToday.length} quests still need completing today.`,
        tag: "overdue-tasks",
      });
    }
  }

  // ---- Scheduled workout today, not yet logged — midday only ----
  if (isMidday) {
    const planId = workoutSchedule[dayKey];
    const plan = planId ? workoutPlans.find((p) => p.id === planId) : null;
    const alreadyDone = workoutHistory.some((h) => h.date === today);
    if (plan && !alreadyDone) {
      notifications.push({
        title: "💪 Workout day",
        body: `"${plan.name}" is on today's schedule — get it in when you're ready.`,
        tag: "workout-scheduled",
      });
    }
  }

  // ---- Weekly battle — Monday midday only ----
  if (isMidday && isMonday && pendingBattle?.length > 0 && !battleState) {
    notifications.push({
      title: "⚔ Weekly Battle Ready!",
      body: `${pendingBattle.length} enemies await. Enter the arena.`,
      tag: "weekly-battle",
    });
  }

  return notifications;
}

export default async function handler(req, res) {
  if (req.headers["authorization"] !== `Bearer ${process.env.CRON_SECRET}`) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const today = todayStr();
  const now = new Date();
  const utcHour = now.getUTCHours();
  const dayOfWeek = now.getUTCDay();
  const force     = req.query?.force === "1";
  const isMidday  = force || utcHour === 11;
  const isEvening = force || utcHour === 19;
  const isMonday  = force || dayOfWeek === 1;
  const dayKey    = DAY_KEYS[dayOfWeek];

  const token = await getAccessToken();
  const docs = await firestoreListAll(token, "storage");

  let sent = 0;
  let usersNotified = 0;
  for (const doc of docs) {
    const subscription = extractSubscription(doc);
    if (!subscription) continue;
    const appData = extractAppData(doc);
    if (!appData) continue;

    const notifications = buildNotifications(appData, { today, isMidday, isEvening, isMonday, dayKey });
    for (const payload of notifications) {
      try {
        await webpush.sendNotification(subscription, JSON.stringify({ ...payload, url: "/" }));
        sent++;
      } catch (err) {
        console.error("Push error:", err.message);
      }
    }
    if (notifications.length > 0) usersNotified++;
  }

  return res.status(200).json({ sent, usersNotified, usersChecked: docs.length });
}
