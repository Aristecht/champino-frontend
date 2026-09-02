"use client";

import { useFindProfileQuery } from "@/generated/output";
import { authStore } from "@/store/auth/auth.store";
import { cartStore } from "@/store/cart/cart.store";
import { useEffect } from "react";

export function AuthInit() {
  const { data, error, loading } = useFindProfileQuery({
    fetchPolicy: "network-only",
    errorPolicy: "none",
  });

  useEffect(() => {
    if (data?.findProfile) {
      const p = data.findProfile;
      authStore.getState().setIsAuthenticated(true);
      authStore.getState().setUser({
        id: p.id,
        username: p.username,
        email: p.email,
        role: p.role ?? undefined,
      });
      cartStore.getState().restoreForUser(p.id);
    }
  }, [data]);

  // Сессия прервана — сбрасываем всё немедленно
  useEffect(() => {
    if (error) {
      authStore.getState().clearAuth();
      cartStore.getState().clearCart();
    }
  }, [error]);

  // Если запрос завершился без ошибки, но данных нет — тоже сбрасываем
  useEffect(() => {
    if (!loading && !error && !data?.findProfile) {
      authStore.getState().clearAuth();
      cartStore.getState().clearCart();
    }
  }, [loading, error, data]);

  return null;
}
