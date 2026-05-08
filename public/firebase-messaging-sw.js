self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (event) =>
  event.waitUntil(self.clients.claim())
);

self.addEventListener("push", function (event) {
  if (!event.data) return;

  let payload;
  try {
    payload = event.data.json();
  } catch {
    return;
  }

  const notification = payload.notification || {};
  const data = payload.data || payload;

  const title = notification.title || data.title || "Notification";
  const body = notification.body || data.body || "";
  const rawUrl = data.url || "/";
  const url = rawUrl.startsWith("http") ? new URL(rawUrl).pathname : rawUrl;

  event.waitUntil(
    self.registration.showNotification(title, {
      body,
      icon: "/images/logotype.png",
      badge: "/images/logotype.png",
      data: { url },
    })
  );
});

self.addEventListener("notificationclick", function (event) {
  event.notification.close();
  const rawClickUrl = event.notification.data?.url || "/";
  const pathname = rawClickUrl.startsWith("http")
    ? new URL(rawClickUrl).pathname
    : rawClickUrl;
  const fullUrl = self.location.origin + pathname;

  event.waitUntil(
    clients
      .matchAll({ type: "window", includeUncontrolled: true })
      .then(function (windowClients) {
        for (let i = 0; i < windowClients.length; i++) {
          const client = windowClients[i];
          if (client.url === fullUrl && "focus" in client)
            return client.focus();
        }
        if (clients.openWindow) return clients.openWindow(fullUrl);
      })
  );
});
