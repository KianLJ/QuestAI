import webpush from "web-push";

webpush.setVapidDetails(
  "mailto:" + process.env.VAPID_EMAIL,
  process.env.VAPID_PUBLIC_KEY,
  process.env.VAPID_PRIVATE_KEY
);

const PROJECT_ID = process.env.FIREBASE_PROJECT_ID;

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

async function firestoreGet(token, docPath) {
  const url = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents/${docPath}`;
  const resp = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
  if (!resp.ok) throw new Error(`Firestore GET failed: ${resp.status} ${await resp.text()}`);
  return resp.json();
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

function todayStr() {
  return new Date().toISOString().slice(0, 10);
}

export default async function handler(req, res) {
  if (req.headers["authorization"] !== `Bearer ${process.env.CRON_SECRET}`) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const today = todayStr();
  const now = new Date();
  const utcHour = now.getUTCHours();
  const dayOfWeek = now.getUTCDay();
  const dayKey = ["sun","mon","tue","wed","thu","fri","sat"][dayOfWeek];
  const force     = req.query?.force === "1";
  const isMidday  = force || utcHour === 11;
  const isEvening = force || utcHour === 19;
  const isMonday  = force || dayOfWeek === 1;

  const token = await getAccessToken();
  const doc = await firestoreGet(token, "storage/main");

  const subscription = extractSubscription(doc);
  if (!subscription) return res.status(200).json({ sent: 0, reason: "no subscription" });

  const appData = extractAppData(doc);
  if (!appData) return res.status(200).json({ sent: 0, reason: "no app data" });

  const quests        = appData.quests || [];
  const habits        = appData.habits || [];
  const pendingBattle = appData.pendingBattle;
  const battleState   = appData.battleState;

  const notifications = [];

  // Debug — log first habit so we can see its structure
  if (habits.length > 0) {
    console.log("Sample habit:", JSON.stringify(habits[0]));
    console.log("Today:", today, "dayKey:", dayKey);
  }

  // ---- Habit reminder — midday and evening every day ----
  const incompleteHabits = habits.filter(
    (h) => h.days?.includes(dayKey) && !h.completedDates?.includes(today)
  );
  if (incompleteHabits.length > 0) {
    if (isMidday) {
      notifications.push({
        title: "🌿 Habit check-in",
        body: incompleteHabits.length === 1
          ? `Don't forget: "${incompleteHabits[0].name}" today.`
          : `${incompleteHabits.length} habits to complete today. You've got time!`,
        tag: "habit-midday",
      });
    }
    if (isEvening) {
      notifications.push({
        title: "🌿 Habits still pending",
        body: incompleteHabits.length === 1
          ? `"${incompleteHabits[0].name}" — don't end the day without it.`
          : `${incompleteHabits.length} habits still incomplete. Last chance today!`,
        tag: "habit-evening",
      });
    }
  }

  // ---- Overdue tasks — evening only ----
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

  // ---- Weekly battle — Monday midday only ----
  if (isMidday && isMonday && pendingBattle?.length > 0 && !battleState) {
    notifications.push({
      title: "⚔ Weekly Battle Ready!",
      body: `${pendingBattle.length} enemies await. Enter the arena.`,
      tag: "weekly-battle",
    });
  }

  let sent = 0;
  for (const payload of notifications) {
    try {
      await webpush.sendNotification(subscription, JSON.stringify({ ...payload, url: "/" }));
      sent++;
    } catch (err) {
      console.error("Push error:", err.message);
    }
  }

  return res.status(200).json({ sent, checked: { habits: incompleteHabits.length, quests: quests.filter(q => !q.completed && q.date === today).length } });
}
