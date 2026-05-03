"use client";

import { useEffect } from "react";

export function ServiceWorkerRegistrar() {
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.getRegistrations().then((regs) => {
        regs.forEach((reg) => {
          const url = reg.active?.scriptURL || reg.installing?.scriptURL || "";
          if (!url.includes("/api/firebase-messaging-sw.js")) {
            reg.unregister();
          }
        });
      });
    }
  }, []);

  return null;
}
