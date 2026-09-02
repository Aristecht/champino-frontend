import { create } from "zustand";
import type { AuthStore } from "./auth.types";

export const authStore = create<AuthStore>((set) => ({
  isAuthenticated: false,
  user: null,
  setIsAuthenticated: (value: boolean) => set({ isAuthenticated: value }),
  setUser: (user) => set({ user }),
  clearAuth: () => set({ isAuthenticated: false, user: null }),
}));
