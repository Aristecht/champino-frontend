"use client";

import { Button } from "@/components/common/ui/Button";
import { useLocale, useTranslations } from "next-intl";
import type { ReactNode } from "react";

interface CartSummaryProps {
  itemCount: number;
  total: number;
  onClear: () => void;
  checkoutTrigger?: ReactNode;
}

export function CartSummary({
  itemCount,
  total,
  onClear,
  checkoutTrigger,
}: CartSummaryProps) {
  const t = useTranslations("cart");
  const locale = useLocale();

  return (
    <aside className="bg-card border-border sticky top-20 rounded-2xl border p-4 sm:p-5">
      <h2 className="text-base font-semibold">{t("yourOrder")}</h2>

      <div className="mt-4 space-y-2 text-sm">
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">{t("itemsLabel")}</span>
          <span>{itemCount}</span>
        </div>
        <div className="flex items-center justify-between text-base font-bold">
          <span>{t("total")}</span>
          <span>{total.toLocaleString(locale)} ₸</span>
        </div>
      </div>

      <div className="mt-4 space-y-2">
        {checkoutTrigger}
        <Button
          variant="outline"
          className="w-full"
          onClick={onClear}
          disabled={itemCount === 0}
        >
          {t("clearCart")}
        </Button>
      </div>
    </aside>
  );
}
