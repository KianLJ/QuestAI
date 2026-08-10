import { initializeApp, getApps, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

// Initialise Firebase Admin once
if (!getApps().length) {
  initializeApp({
    credential: cert({
      projectId:   process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey:  process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    }),
  });
}

const db = getFirestore();

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();

  const { subscription, userId } = req.body || {};
  if (!userId) return res.status(400).json({ error: "userId required" });

  try {
    const ref = db.collection("pushSubscriptions").doc(userId);

    if (req.method === "DELETE") {
      await ref.delete();
      return res.status(200).json({ ok: true });
    }

    if (req.method === "POST") {
      if (!subscription) return res.status(400).json({ error: "subscription required" });
      await ref.set({ subscription, userId, updatedAt: new Date().toISOString() });
      return res.status(200).json({ ok: true });
    }

    return res.status(405).json({ error: "Method not allowed" });
  } catch (err) {
    console.error("push-subscribe error:", err);
    return res.status(500).json({ error: err.message });
  }
}
