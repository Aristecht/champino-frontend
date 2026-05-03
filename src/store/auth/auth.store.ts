import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { AuthStore } from "./auth.types";

export const authStore = create(
  persist<AuthStore>(
    (set) => ({
      isAuthenticated: false,
      user: null,
      setIsAuthenticated: (value: boolean) => set({ isAuthenticated: value }),
      setUser: (user) => set({ user }),
    }),
    {
      name: "auth",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) =>
        ({ isAuthenticated: state.isAuthenticated }) as AuthStore,
    }
  )
);
