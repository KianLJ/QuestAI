import { initializeApp } from "firebase/app";
import {
  getFirestore, doc, getDoc, setDoc, deleteDoc, updateDoc, onSnapshot, deleteField,
  collection, query, where, getDocs, addDoc, serverTimestamp,
} from "firebase/firestore";
import {
  getAuth, onAuthStateChanged, createUserWithEmailAndPassword, signInWithEmailAndPassword,
  signOut, sendPasswordResetEmail, updateProfile, updatePassword, reauthenticateWithCredential, EmailAuthProvider,
  deleteUser,
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

export function normalizeUsername(name) {
  return (name || "").trim().toLowerCase();
}

// Returns { available, error } rather than a plain boolean so callers can
// tell "that name is taken" apart from "the check itself failed" (e.g. the
// usernames collection's Firestore rules aren't published yet) — collapsing
// both into `false` made every username look taken whenever the read failed.
export async function checkUsernameAvailable(name) {
  const norm = normalizeUsername(name);
  if (!norm) return { available: false, error: "Choose a username." };
  try {
    const snap = await getDoc(doc(db, "usernames", norm));
    return { available: !snap.exists(), error: null };
  } catch (e) {
    const msg = e.code === "permission-denied"
      ? "Can't check usernames right now — the Firestore rules for the \"usernames\" collection may not be published yet."
      : "Couldn't check that username — try again.";
    return { available: false, error: msg };
  }
}

export function onAuthChange(callback) {
  return onAuthStateChanged(auth, callback);
}

export async function signUp(email, password, username) {
  const norm = normalizeUsername(username);
  if (!norm) return { user: null, error: "Choose a username." };
  if (!/^[a-z0-9_]{3,20}$/.test(norm)) return { user: null, error: "Usernames must be 3-20 characters: letters, numbers, underscores only." };
  const check = await checkUsernameAvailable(norm);
  if (check.error) return { user: null, error: check.error };
  if (!check.available) return { user: null, error: "That username is already taken." };

  let cred;
  try {
    cred = await createUserWithEmailAndPassword(auth, email, password);
  } catch (e) {
    return { user: null, error: friendlyAuthError(e) };
  }

  try {
    await updateProfile(cred.user, { displayName: username.trim() });
    await setDoc(doc(db, "usernames", norm), { uid: cred.user.uid, username: username.trim(), createdAt: serverTimestamp() });
    return { user: cred.user, error: null };
  } catch (e) {
    // The username was claimed by someone else in the split second between our
    // availability check and here — roll back the account so we don't leave an
    // orphaned, username-less user behind, and let them try again.
    try { await deleteUser(cred.user); } catch (_) {}
    return { user: null, error: "That username was just taken — please try another." };
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

export async function updateUsername(name) {
  const norm = normalizeUsername(name);
  if (!norm) return { error: "Choose a username." };
  if (!/^[a-z0-9_]{3,20}$/.test(norm)) return { error: "Usernames must be 3-20 characters: letters, numbers, underscores only." };

  const oldNorm = normalizeUsername(auth.currentUser.displayName);
  if (norm === oldNorm) {
    // Unchanged name, just re-save the display casing.
    try { await updateProfile(auth.currentUser, { displayName: name.trim() }); return { error: null }; }
    catch (e) { return { error: friendlyAuthError(e) }; }
  }

  const check = await checkUsernameAvailable(norm);
  if (check.error) return { error: check.error };
  if (!check.available) return { error: "That username is already taken." };

  try {
    await setDoc(doc(db, "usernames", norm), { uid: auth.currentUser.uid, username: name.trim(), createdAt: serverTimestamp() });
    if (oldNorm) { try { await deleteDoc(doc(db, "usernames", oldNorm)); } catch (_) {} }
    await updateProfile(auth.currentUser, { displayName: name.trim() });
    return { error: null };
  } catch (e) {
    return { error: friendlyAuthError(e) };
  }
}

export async function changePassword(currentPassword, newPassword) {
  try {
    const cred = EmailAuthProvider.credential(auth.currentUser.email, currentPassword);
    await reauthenticateWithCredential(auth.currentUser, cred);
    await updatePassword(auth.currentUser, newPassword);
    return { error: null };
  } catch (e) {
    return { error: friendlyAuthError(e) };
  }
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

// ---- Friends / social profile ----
// The shareable subset of a user's data lives in its own doc so Firestore
// rules can let friends read it without exposing the private `storage/{uid}`
// document. `friendUids` on this doc is never written by this mirror — only
// the /api/friends server route (via firebase-admin) touches it, since
// accepting a friend requires updating *both* users' docs at once, which a
// client can never do for someone else's doc under per-owner security rules.
export async function saveProfile(fields) {
  const uid = auth.currentUser?.uid;
  if (!uid) return;
  try {
    await setDoc(doc(db, "profiles", uid), fields, { merge: true });
  } catch (e) {
    console.error("saveProfile failed", e);
  }
}

export async function getProfile(uid) {
  try {
    const snap = await getDoc(doc(db, "profiles", uid));
    return snap.exists() ? snap.data() : null;
  } catch (e) {
    console.error("getProfile failed", e);
    return null;
  }
}

export async function sendFriendRequest(username) {
  const norm = normalizeUsername(username);
  if (!norm) return { error: "Enter a username." };
  const me = auth.currentUser;
  const targetName = await getDoc(doc(db, "usernames", norm)).catch(() => null);
  if (!targetName?.exists()) return { error: "No user with that username." };
  const toUid = targetName.data().uid;
  if (toUid === me.uid) return { error: "That's your own username." };

  const myProfile = await getProfile(me.uid);
  if (myProfile?.friendUids?.includes(toUid)) return { error: "You're already friends." };

  const existing = await getDocs(query(collection(db, "friendRequests"), where("fromUid", "==", me.uid), where("toUid", "==", toUid), where("status", "==", "pending")));
  if (!existing.empty) return { error: "Request already sent." };

  try {
    const docRef = await addDoc(collection(db, "friendRequests"), {
      fromUid: me.uid, fromUsername: me.displayName || me.email, toUid, toUsername: targetName.data().username,
      status: "pending", createdAt: serverTimestamp(),
    });
    callFriendsApi({ action: "notify_request", requestId: docRef.id }).catch(() => {});
    return { error: null };
  } catch (e) {
    return { error: "Couldn't send that request — try again." };
  }
}

export async function listFriendRequests() {
  const uid = auth.currentUser?.uid;
  if (!uid) return { incoming: [], outgoing: [] };
  const [incomingSnap, outgoingSnap] = await Promise.all([
    getDocs(query(collection(db, "friendRequests"), where("toUid", "==", uid), where("status", "==", "pending"))),
    getDocs(query(collection(db, "friendRequests"), where("fromUid", "==", uid), where("status", "==", "pending"))),
  ]);
  return {
    incoming: incomingSnap.docs.map((d) => ({ id: d.id, ...d.data() })),
    outgoing: outgoingSnap.docs.map((d) => ({ id: d.id, ...d.data() })),
  };
}

export async function declineFriendRequest(requestId) {
  try { await updateDoc(doc(db, "friendRequests", requestId), { status: "declined" }); return { error: null }; }
  catch (e) { return { error: "Couldn't decline — try again." }; }
}

export async function cancelFriendRequest(requestId) {
  try { await deleteDoc(doc(db, "friendRequests", requestId)); return { error: null }; }
  catch (e) { return { error: "Couldn't cancel — try again." }; }
}

async function callFriendsApi(body) {
  const idToken = await auth.currentUser?.getIdToken();
  const resp = await fetch("/api/friends", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${idToken}` },
    body: JSON.stringify(body),
  });
  const data = await resp.json().catch(() => ({}));
  if (!resp.ok) return { error: data.error || "Something went wrong — try again." };
  return { error: null };
}

export async function acceptFriendRequest(requestId) {
  return callFriendsApi({ action: "accept", requestId });
}

export async function removeFriend(friendUid) {
  return callFriendsApi({ action: "remove", friendUid });
}
