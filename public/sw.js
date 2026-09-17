// Quest Log Service Worker
const CACHE_NAME = "questai-v1";

self.addEventListener("install", (e) => {
  self.skipWaiting();
});

self.addEventListener("activate", (e) => {
  e.waitUntil(clients.claim());
});

// ---- Push notifications (server-sent, via Vercel cron or friend-request events) ----
self.addEventListener("push", (e) => {
  if (!e.data) return;
  let payload;
  try { payload = e.data.json(); }
  catch { payload = { title: "Quest Log", body: e.data.text() }; }

  const { title = "Quest Log", body = "", tag = "questai", url = "/" } = payload;

  e.waitUntil(
    self.registration.showNotification(title, {
      body,
      tag,
      icon: "/icon-192.png",
      badge: "/icon-96.png",
      data: { url },
      vibrate: [200, 100, 200],
      requireInteraction: false,
    })
  );
});

// ---- Local scheduled notifications (focus timer, rest timer) ----
// The app posts a message to schedule a notification at a specific time while
// this SW instance stays alive; used for short in-session timers, not
// long-delayed reminders (those go through server push instead).
const pendingAlarms = new Map();

self.addEventListener("message", (e) => {
  const { type, id, title, body, tag, url, fireAt } = e.data || {};

  if (type === "SCHEDULE_NOTIFICATION") {
    if (pendingAlarms.has(id)) clearTimeout(pendingAlarms.get(id));

    const delay = Math.max(0, fireAt - Date.now());
    const timer = setTimeout(() => {
      pendingAlarms.delete(id);
      self.registration.showNotification(title, {
        body,
        tag: tag || id,
        icon: "/icon-192.png",
        badge: "/icon-96.png",
        data: { url: url || "/" },
        vibrate: [200, 100, 200],
      });
    }, delay);
    pendingAlarms.set(id, timer);
  }

  if (type === "CANCEL_NOTIFICATION") {
    if (pendingAlarms.has(id)) {
      clearTimeout(pendingAlarms.get(id));
      pendingAlarms.delete(id);
    }
  }
});

// ---- Notification click ----
self.addEventListener("notificationclick", (e) => {
  e.notification.close();
  const url = e.notification.data?.url || "/";
  e.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true }).then((list) => {
      const existing = list.find((c) => c.url.includes(self.location.origin));
      if (existing) return existing.focus();
      return clients.openWindow(url);
    })
  );
});
