import { initializeApp, getApps, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import webpush from "web-push";

if (!getApps().length) {
  initializeApp({
    credential: cert({
      projectId:   process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey:  process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    }),
  });
}

webpush.setVapidDetails(
  "mailto:" + process.env.VAPID_EMAIL,
  process.env.VAPID_PUBLIC_KEY,
  process.env.VAPID_PRIVATE_KEY
);

const db = getFirestore(undefined, "(default)");

function todayStr() {
  return new Date().toISOString().slice(0, 10);
}

async function sendPush(subscription, payload) {
  try {
    await webpush.sendNotification(subscription, JSON.stringify(payload));
    return true;
  } catch (err) {
    if (err.statusCode === 410 || err.statusCode === 404) return "expired";
    console.error("Push error:", err.message);
    return false;
  }
}

export default async function handler(req, res) {
  if (req.headers["authorization"] !== `Bearer ${process.env.CRON_SECRET}`) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const today = todayStr();
  const now = new Date();
  const utcHour = now.getUTCHours();
  const dayOfWeek = now.getUTCDay(); // 0=Sun, 1=Mon
  const dayKey = ["sun","mon","tue","wed","thu","fri","sat"][dayOfWeek];

  const isMidday   = utcHour === 11; // midday run
  const isEvening  = utcHour === 19; // evening run
  const isMonday   = dayOfWeek === 1;

  const subsSnap = await db.collection("pushSubscriptions").get();
  if (subsSnap.empty) return res.status(200).json({ sent: 0 });

  let sent = 0;
  const expiredIds = [];

  for (const doc of subsSnap.docs) {
    const { subscription, userId } = doc.data();
    if (!subscription || !userId) continue;

    const userDoc = await db.collection("questlog").doc(userId).get();
    if (!userDoc.exists) continue;
    const data = userDoc.data();

    const quests       = data.quests || [];
    const habits       = data.habits || [];
    const pendingBattle = data.pendingBattle;
    const battleState  = data.battleState;

    const notifications = [];

    // ---- HABIT REMINDER — midday and evening, every day ----
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
          url: "/",
        });
      }
      if (isEvening) {
        notifications.push({
          title: "🌿 Habits still pending",
          body: incompleteHabits.length === 1
            ? `"${incompleteHabits[0].name}" — don't end the day without it.`
            : `${incompleteHabits.length} habits still incomplete. Last chance today!`,
          tag: "habit-evening",
          url: "/",
        });
      }
    }

    // ---- OVERDUE TASKS — evening only ----
    if (isEvening) {
      const overdueToday = quests.filter(
        (q) => !q.completed && q.date === today
      );
      if (overdueToday.length > 0) {
        notifications.push({
          title: "⚔ Quests remaining!",
          body: overdueToday.length === 1
            ? `"${overdueToday[0].title}" is still incomplete.`
            : `${overdueToday.length} quests still need completing today.`,
          tag: "overdue-tasks",
          url: "/",
        });
      }
    }

    // ---- WEEKLY BATTLE — Monday midday only ----
    if (isMidday && isMonday) {
      const battleReady = pendingBattle?.length > 0 && !battleState;
      if (battleReady) {
        notifications.push({
          title: "⚔ Weekly Battle Ready!",
          body: `${pendingBattle.length} enemies await. Enter the arena.`,
          tag: "weekly-battle",
          url: "/",
        });
      }
    }

    for (const payload of notifications) {
      const result = await sendPush(subscription, payload);
      if (result === "expired") expiredIds.push(doc.id);
      else if (result) sent++;
    }
  }

  for (const id of expiredIds) {
    await db.collection("pushSubscriptions").doc(id).delete();
  }

  return res.status(200).json({ sent, expired: expiredIds.length });
}
