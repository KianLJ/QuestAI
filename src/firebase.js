import { initializeApp } from "firebase/app";
import { getFirestore, doc, getDoc, setDoc, onSnapshot, deleteField } from "firebase/firestore";

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

const DEVICE_ID = "main";
const ref = () => doc(db, "storage", DEVICE_ID);

// Tracks the timestamp of the last write this tab made, so we can ignore the
// Firestore echo of our own saves and not re-apply state we just set.
let lastLocalWriteAt = 0;
const OWN_WRITE_GRACE_MS = 3000;

export const storage = {
  get: async (key) => {
    try {
      const snap = await getDoc(ref());
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
      lastLocalWriteAt = Date.now();
      await setDoc(ref(), { [key]: value }, { merge: true });
      return { key, value, shared: false };
    } catch (e) {
      console.error("storage.set failed", e);
      return null;
    }
  },

  delete: async (key) => {
    try {
      lastLocalWriteAt = Date.now();
      await setDoc(ref(), { [key]: deleteField() }, { merge: true });
      return { key, deleted: true, shared: false };
    } catch (e) {
      console.error("storage.delete failed", e);
      return null;
    }
  },

  list: async (prefix) => {
    try {
      const snap = await getDoc(ref());
      if (!snap.exists()) return { keys: [], shared: false };
      const keys = Object.keys(snap.data()).filter(k => !prefix || k.startsWith(prefix));
      return { keys, prefix: prefix || null, shared: false };
    } catch (e) {
      return { keys: [], shared: false };
    }
  },

  // Subscribe to real-time changes from other devices.
  // Calls onChange(key, value) whenever Firestore updates from another tab/device.
  // Returns an unsubscribe function — call it on component unmount.
  subscribe: (onChange) => {
    const unsub = onSnapshot(ref(), (snap) => {
      // Skip if this is just an echo of our own recent write
      if (Date.now() - lastLocalWriteAt < OWN_WRITE_GRACE_MS) return;
      if (!snap.exists()) return;
      const data = snap.data();
      Object.entries(data).forEach(([key, value]) => {
        onChange(key, value);
      });
    });
    return unsub;
  },
};
