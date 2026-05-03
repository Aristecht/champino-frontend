"use client";

import { useCallback } from "react";
import { gql } from "@apollo/client";
import { useMutation } from "@apollo/client/react";
import { initializeApp, getApps, getApp } from "firebase/app";
import { getMessaging, getToken, deleteToken } from "firebase/messaging";

const REGISTER_DEVICE_TOKEN = gql`
  mutation RegisterDeviceToken($data: RegisterDeviceTokenInput!) {
    registerDeviceToken(data: $data)
  }
`;

function getFirebaseMessaging() {
  const app = getApps().length
    ? getApp()
    : initializeApp({
        apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
        authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
        storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
        messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
        appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
      });
  return getMessaging(app);
}

export class PushPermissionDeniedError extends Error {
  constructor() {
    super("permission_denied");
  }
}

export function usePushNotifications() {
  const [registerToken] = useMutation(REGISTER_DEVICE_TOKEN);

  const subscribe = useCallback(async (): Promise<void> => {
    if (!("serviceWorker" in navigator) || !("Notification" in window)) {
      throw new PushPermissionDeniedError();
    }

    const permission = await Notification.requestPermission();
    if (permission !== "granted") {
      throw new PushPermissionDeniedError();
    }

    const vapidKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
    if (!vapidKey) throw new Error("VAPID key not configured");

    const messaging = getFirebaseMessaging();
    const swReg = await navigator.serviceWorker.register(
      "/api/firebase-messaging-sw.js",
      { scope: "/", type: "classic" }
    );
    // Force browser to download the latest SW version (clears stale Firebase compat SW)
    await swReg.update();
    await navigator.serviceWorker.ready;

    const fcmToken = await getToken(messaging, {
      vapidKey,
      serviceWorkerRegistration: swReg,
    });

    if (!fcmToken) throw new Error("FCM token was not returned");

    const storageKey = "fcm_registered_token";
    if (localStorage.getItem(storageKey) === fcmToken) return;

    const deviceName = navigator.userAgent.slice(0, 100) || "Web Browser";

    const result = await registerToken({
      variables: {
        data: {
          token: fcmToken,
          deviceType: "web",
          deviceName,
        },
      },
    });

    if (result.error) throw result.error;

    localStorage.setItem(storageKey, fcmToken);
  }, [registerToken]);

  const unsubscribe = useCallback(async (): Promise<void> => {
    if (!("serviceWorker" in navigator)) return;

    localStorage.removeItem("fcm_registered_token");

    try {
      const messaging = getFirebaseMessaging();
      const deleted = await deleteToken(messaging);
      if (!deleted) return;
    } catch (err) {
      console.warn("Firebase deleteToken failed (non-critical):", err);
    }

    try {
      const swReg = await navigator.serviceWorker.getRegistration(
        "/api/firebase-messaging-sw.js"
      );
      await swReg?.unregister();
    } catch (err) {
      console.warn("SW unregister failed (non-critical):", err);
    }
  }, []);

  const isSupported =
    typeof window !== "undefined" &&
    "serviceWorker" in navigator &&
    "Notification" in window;

  const currentPermission =
    typeof window !== "undefined" && "Notification" in window
      ? Notification.permission
      : "default";

  return { subscribe, unsubscribe, isSupported, currentPermission };
}
