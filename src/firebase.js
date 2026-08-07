import { initializeApp } from "firebase/app";
import { getFirestore, doc, getDoc, setDoc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBqgGqFVA4slOJuVhdCJ5-UQSPhhj1TBZU",
  authDomain: "questai-ddf52.firebaseapp.com",
  projectId: "questai-ddf52",
  storageBucket: "questai-ddf52.firebasestorage.app",
  messagingSenderId: "965122921778",
  appId: "1:965122921778:web:7f15381300a54b2ac6332b"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

// Simple key-value storage backed by Firestore, matching the window.storage API
// the app already uses — no other code needs to change.
const DEVICE_ID = "main"; // single-user, no login needed

export const storage = {
  get: async (key) => {
    try {
      const ref = doc(db, "storage", DEVICE_ID);
      const snap = await getDoc(ref);
      if (!snap.exists()) return null;
      const val = snap.data()[key];
      if (val === undefined) return null;
      return { key, value: val, shared: false };
    } catch (e) {
      console.error("storage.get failed", e);
      return null;
    }
  },
  set: async (key, value) => {
    try {
      const ref = doc(db, "storage", DEVICE_ID);
      await setDoc(ref, { [key]: value }, { merge: true });
      return { key, value, shared: false };
    } catch (e) {
      console.error("storage.set failed", e);
      return null;
    }
  },
  delete: async (key) => {
    try {
      const { deleteField } = await import("firebase/firestore");
      const ref = doc(db, "storage", DEVICE_ID);
      await setDoc(ref, { [key]: deleteField() }, { merge: true });
      return { key, deleted: true, shared: false };
    } catch (e) {
      console.error("storage.delete failed", e);
      return null;
    }
  },
  list: async (prefix) => {
    try {
      const ref = doc(db, "storage", DEVICE_ID);
      const snap = await getDoc(ref);
      if (!snap.exists()) return { keys: [], shared: false };
      const keys = Object.keys(snap.data()).filter(k => !prefix || k.startsWith(prefix));
      return { keys, prefix: prefix || null, shared: false };
    } catch (e) {
      return { keys: [], shared: false };
    }
  }
};
