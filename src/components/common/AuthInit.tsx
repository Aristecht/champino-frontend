"use client";

import { useFindProfileQuery } from "@/generated/output";
import { authStore } from "@/store/auth/auth.store";
import { cartStore } from "@/store/cart/cart.store";
import { useEffect } from "react";

export function AuthInit() {
  const { data, error } = useFindProfileQuery({
    fetchPolicy: "network-only",
    errorPolicy: "ignore",
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

  useEffect(() => {
    if (error) {
      authStore.getState().setIsAuthenticated(false);
      authStore.getState().setUser(null);
    }
  }, [error]);

  return null;
}
