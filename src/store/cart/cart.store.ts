import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { CartStore } from "./cart.types";

export const cartStore = create(
  persist<CartStore>(
    (set) => ({
      items: [],
      addItem: (item) =>
        set((state) => {
          const idx = state.items.findIndex(
            (x) => x.productId === item.productId
          );
          if (idx === -1) {
            return { items: [...state.items, { ...item, quantity: 1 }] };
          }

          const next = [...state.items];
          const current = next[idx];
          next[idx] = {
            ...current,
            quantity: Math.min(
              current.quantity + 1,
              Math.max(current.stock, 1)
            ),
          };
          return { items: next };
        }),
      removeItem: (productId) =>
        set((state) => ({
          items: state.items.filter((x) => x.productId !== productId),
        })),
      setQuantity: (productId, quantity) =>
        set((state) => ({
          items: state.items.map((x) => {
            if (x.productId !== productId) return x;
            const safeQty = Math.min(
              Math.max(quantity, 1),
              Math.max(x.stock, 1)
            );
            return { ...x, quantity: safeQty };
          }),
        })),
      clearCart: () => set({ items: [] }),
      saveForUser: (userId: string) => {
        const items = cartStore.getState().items;
        try {
          localStorage.setItem(`cart_user_${userId}`, JSON.stringify(items));
        } catch {}
      },
      restoreForUser: (userId: string) => {
        try {
          const raw = localStorage.getItem(`cart_user_${userId}`);
          if (raw) {
            const items = JSON.parse(raw) as CartStore["items"];
            set({ items });
          }
        } catch {}
      },
    }),
    {
      name: "cart",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
