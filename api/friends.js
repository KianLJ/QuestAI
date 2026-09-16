import { initializeApp, getApps, cert } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore, FieldValue } from "firebase-admin/firestore";

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
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const authHeader = req.headers["authorization"] || "";
  const idToken = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;
  if (!idToken) return res.status(401).json({ error: "Missing auth token" });
  let uid;
  try {
    uid = (await getAuth().verifyIdToken(idToken)).uid;
  } catch (e) {
    return res.status(401).json({ error: "Invalid or expired auth token" });
  }

  const { action } = req.body || {};

  try {
    if (action === "accept") {
      const { requestId } = req.body;
      if (!requestId) return res.status(400).json({ error: "requestId required" });

      const reqRef = db.collection("friendRequests").doc(requestId);
      const reqSnap = await reqRef.get();
      if (!reqSnap.exists) return res.status(404).json({ error: "Request not found" });
      const request = reqSnap.data();
      if (request.toUid !== uid) return res.status(403).json({ error: "Not your request to accept" });
      if (request.status !== "pending") return res.status(400).json({ error: "Request already resolved" });

      const fromRef = db.collection("profiles").doc(request.fromUid);
      const toRef = db.collection("profiles").doc(request.toUid);

      await Promise.all([
        reqRef.update({ status: "accepted" }),
        fromRef.set({ friendUids: FieldValue.arrayUnion(request.toUid) }, { merge: true }),
        toRef.set({ friendUids: FieldValue.arrayUnion(request.fromUid) }, { merge: true }),
      ]);
      return res.status(200).json({ ok: true });
    }

    if (action === "remove") {
      const { friendUid } = req.body;
      if (!friendUid) return res.status(400).json({ error: "friendUid required" });

      const myRef = db.collection("profiles").doc(uid);
      const theirRef = db.collection("profiles").doc(friendUid);
      await Promise.all([
        myRef.set({ friendUids: FieldValue.arrayRemove(friendUid) }, { merge: true }),
        theirRef.set({ friendUids: FieldValue.arrayRemove(uid) }, { merge: true }),
      ]);
      return res.status(200).json({ ok: true });
    }

    return res.status(400).json({ error: "Unknown action" });
  } catch (err) {
    console.error("friends api error:", err);
    return res.status(500).json({ error: err.message });
  }
}
