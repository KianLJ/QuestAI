import { initializeApp } from "firebase/app";
import { getFirestore, doc, getDoc, setDoc, onSnapshot, deleteField } from "firebase/firestore";
import {
  getAuth, onAuthStateChanged, createUserWithEmailAndPassword, signInWithEmailAndPassword,
  signOut, sendPasswordResetEmail,
} from "firebase/auth";

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
export const auth = getAuth(app);

// Each signed-in user gets their own document, keyed by their Firebase Auth uid.
const ref = () => {
  const uid = auth.currentUser?.uid;
  if (!uid) throw new Error("Not signed in");
  return doc(db, "storage", uid);
};

const AUTH_ERROR_MESSAGES = {
  "auth/email-already-in-use": "That email already has an account — try logging in instead.",
  "auth/invalid-email": "That doesn't look like a valid email address.",
  "auth/weak-password": "Password must be at least 6 characters.",
  "auth/user-not-found": "No account found with that email.",
  "auth/wrong-password": "Incorrect password.",
  "auth/invalid-credential": "Incorrect email or password.",
  "auth/too-many-requests": "Too many attempts — please wait a moment and try again.",
  "auth/configuration-not-found": "Email/Password sign-in isn't enabled for this project yet — enable it in Firebase console → Authentication → Sign-in method.",
  "auth/operation-not-allowed": "Email/Password sign-in isn't enabled for this project yet — enable it in Firebase console → Authentication → Sign-in method.",
};
function friendlyAuthError(e) {
  return AUTH_ERROR_MESSAGES[e.code] || e.message || "Something went wrong — please try again.";
}

export function onAuthChange(callback) {
  return onAuthStateChanged(auth, callback);
}

export async function signUp(email, password) {
  try {
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    return { user: cred.user, error: null };
  } catch (e) {
    return { user: null, error: friendlyAuthError(e) };
  }
}

export async function logIn(email, password) {
  try {
    const cred = await signInWithEmailAndPassword(auth, email, password);
    return { user: cred.user, error: null };
  } catch (e) {
    return { user: null, error: friendlyAuthError(e) };
  }
}

export async function logOut() {
  await signOut(auth);
}

export async function resetPassword(email) {
  try {
    await sendPasswordResetEmail(auth, email);
    return { error: null };
  } catch (e) {
    return { error: friendlyAuthError(e) };
  }
}

// Tracks the timestamp of the last write this tab made, so we can ignore the
// Firestore echo of our own saves and not re-apply state we just set.
let lastLocalWriteAt = 0;
// Own-write echoes can take several seconds to round-trip back through
// onSnapshot on a slow connection. If this window is shorter than that
// round-trip, the echo arrives after the window closes, gets misread as a
// genuine remote change, and clobbers whatever the user just did locally.
const OWN_WRITE_GRACE_MS = 5000;

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
    // onSnapshot fires immediately with the current doc on subscribe — we've
    // already loaded that same data via a one-time get(), so skip this first
    // event entirely. Otherwise, if it's delayed by network latency and
    // arrives after the caller has made local edits, it looks like a late
    // "remote update" (not caught by the own-write grace period below,
    // since it isn't an echo of a write we made) and clobbers fresh state.
    let skippedInitial = false;
    const unsub = onSnapshot(ref(), (snap) => {
      if (!skippedInitial) { skippedInitial = true; return; }
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
