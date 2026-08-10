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

const db = getFirestore();

export default async function handler(req, res) {
  if (req.headers["authorization"] !== `Bearer ${process.env.CRON_SECRET}`) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const subsSnap = await db.collection("pushSubscriptions").get();
  if (subsSnap.empty) {
    return res.status(404).json({ error: "No subscriptions found — have you tapped Enable reminders in the app?" });
  }

  let sent = 0;
  for (const doc of subsSnap.docs) {
    const { subscription } = doc.data();
    if (!subscription) continue;
    try {
      await webpush.sendNotification(subscription, JSON.stringify({
        title: "⚔ QuestAI test",
        body: "Notifications are working! You'll receive reminders for tasks, habits and battles.",
        tag: "push-test",
        url: "/",
      }));
      sent++;
    } catch (err) {
      console.error("Test push failed:", err.message);
    }
  }

  return res.status(200).json({ sent, message: sent > 0 ? "Test notification sent!" : "Failed to send" });
}
