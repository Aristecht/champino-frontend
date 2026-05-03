import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export function GET() {
  const swContent = `
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', (event) => event.waitUntil(self.clients.claim()));

self.addEventListener('push', function(event) {
  if (!event.data) return;

  let payload;
  try {
    payload = event.data.json();
  } catch {
    return;
  }

  console.log('[SW] Raw push payload:', JSON.stringify(payload));

  const notification = payload.notification || {};
  // FCM data-only: fields can be nested under data OR flat at root level
  const data = payload.data || payload;

  const title = notification.title || data.title || 'Notification';
  const body = notification.body || data.body || '';
  const url = data.url || '/';

  event.waitUntil(
    self.registration.showNotification(title, {
      body,
      icon: '/images/logotype.png',
      badge: '/images/logotype.png',
      data: { url },
    })
  );
});

self.addEventListener('notificationclick', function(event) {
  event.notification.close();
  const url = event.notification.data?.url || '/';
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function(windowClients) {
      for (var i = 0; i < windowClients.length; i++) {
        var client = windowClients[i];
        if (client.url === url && 'focus' in client) return client.focus();
      }
      if (clients.openWindow) return clients.openWindow(url);
    })
  );
});
`.trim();

  return new NextResponse(swContent, {
    headers: {
      "Content-Type": "application/javascript",
      "Cache-Control": "no-cache, no-store, must-revalidate",
      "Service-Worker-Allowed": "/",
    },
  });
}
