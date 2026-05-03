"use client";

import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { useTranslations } from "next-intl";
import { cartStore } from "@/store/cart/cart.store";
import { CartItemCard } from "@/components/features/cart/CartItemCard";
import { CartSummary } from "@/components/features/cart/CartSummary";
import { CheckoutForm } from "@/components/features/cart/CheckoutForm";

export default function CartPage() {
  const t = useTranslations("cart");
  const items = cartStore((s) => s.items);
  const removeItem = cartStore((s) => s.removeItem);
  const setQuantity = cartStore((s) => s.setQuantity);
  const clearCart = cartStore((s) => s.clearCart);

  const itemCount = items.reduce((sum, x) => sum + x.quantity, 0);
  const total = items.reduce((sum, x) => sum + x.price * x.quantity, 0);

  return (
    <div className="container mx-auto max-w-6xl px-4 py-6 sm:py-8">
      <div className="mb-5 flex items-center gap-3 sm:mb-6">
        <div className="bg-primary/10 text-primary flex h-10 w-10 items-center justify-center rounded-xl">
          <ShoppingCart className="h-5 w-5" />
        </div>
        <div>
          <h1 className="text-lg font-bold sm:text-2xl">{t("title")}</h1>
          <p className="text-muted-foreground text-xs sm:text-sm">
            {t("itemsCount", { count: itemCount })}
          </p>
        </div>
      </div>

      {items.length === 0 ? (
        <div className="bg-card border-border rounded-2xl border p-8 text-center sm:p-12">
          <p className="text-base font-semibold sm:text-lg">
            {t("emptyTitle")}
          </p>
          <p className="text-muted-foreground mt-1 text-sm">
            {t("emptyDescription")}
          </p>
          <Link
            href="/catalog"
            className="bg-primary text-primary-foreground hover:bg-primary/90 mt-4 inline-flex h-10 items-center rounded-lg px-4 text-sm font-medium transition-colors"
          >
            {t("goToCatalog")}
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_320px] lg:gap-6">
          <div className="space-y-3">
            {items.map((item) => (
              <CartItemCard
                key={item.productId}
                item={item}
                onRemove={removeItem}
                onSetQuantity={setQuantity}
              />
            ))}
          </div>

          <div className="space-y-4">
            <CartSummary
              itemCount={itemCount}
              total={total}
              onClear={clearCart}
              checkoutTrigger={<CheckoutForm items={items} />}
            />
          </div>
        </div>
      )}
    </div>
  );
}
