import webpush from "web-push";

webpush.setVapidDetails(
  "mailto:" + process.env.VAPID_EMAIL,
  process.env.VAPID_PUBLIC_KEY,
  process.env.VAPID_PRIVATE_KEY
);

const PROJECT_ID = process.env.FIREBASE_PROJECT_ID;

// Get an access token using the service account credentials
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
  const resp = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!resp.ok) throw new Error(`Firestore GET failed: ${resp.status} ${await resp.text()}`);
  return resp.json();
}

function extractField(doc, field) {
  const f = doc?.fields?.[field];
  if (!f) return null;
  if (f.stringValue !== undefined) return f.stringValue;
  if (f.mapValue) return extractField(f.mapValue, field);
  if (f.nullValue !== undefined) return null;
  return null;
}

function extractMap(doc, field) {
  const f = doc?.fields?.[field];
  if (!f?.mapValue?.fields) return null;
  const fields = f.mapValue.fields;
  const result = {};
  for (const [k, v] of Object.entries(fields)) {
    if (v.stringValue !== undefined) result[k] = v.stringValue;
    else if (v.booleanValue !== undefined) result[k] = v.booleanValue;
    else if (v.mapValue) result[k] = extractMap({ fields: { [k]: v } }, k);
  }
  return result;
}

export default async function handler(req, res) {
  if (req.headers["authorization"] !== `Bearer ${process.env.CRON_SECRET}`) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const token = await getAccessToken();
    const doc = await firestoreGet(token, "storage/main");

    const subField = doc?.fields?.pushSubscription;
    if (!subField?.mapValue?.fields) {
      return res.status(404).json({ error: "No push subscription found — tap Enable reminders in the app first" });
    }

    // Reconstruct the subscription object from Firestore map
    const fields = subField.mapValue.fields;
    const endpoint = fields.endpoint?.stringValue;
    const p256dh = fields.keys?.mapValue?.fields?.p256dh?.stringValue;
    const auth = fields.keys?.mapValue?.fields?.auth?.stringValue;

    if (!endpoint || !p256dh || !auth) {
      return res.status(400).json({ error: "Incomplete subscription data", fields: Object.keys(fields) });
    }

    const subscription = { endpoint, keys: { p256dh, auth } };

    await webpush.sendNotification(subscription, JSON.stringify({
      title: "⚔ QuestAI test",
      body: "Notifications are working! Reminders for tasks, habits and battles are active.",
      tag: "push-test",
      url: "/",
    }));

    return res.status(200).json({ sent: 1, message: "Test notification sent!" });
  } catch (err) {
    console.error("push-test error:", err.message);
    return res.status(500).json({ error: err.message });
  }
}
