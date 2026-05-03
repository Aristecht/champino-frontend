// Legacy sw.js - replaced by firebase-messaging-sw.js
self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", () => self.clients.claim());
