"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, Trash2 } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import type { CartItem } from "@/store/cart/cart.types";

interface CartItemCardProps {
  item: CartItem;
  onRemove: (id: string) => void;
  onSetQuantity: (id: string, qty: number) => void;
}

export function CartItemCard({
  item,
  onRemove,
  onSetQuantity,
}: CartItemCardProps) {
  const t = useTranslations("cart");
  const locale = useLocale();

  return (
    <article className="bg-card border-border rounded-2xl border p-3 sm:p-4">
      <div className="flex items-start gap-3">
        <Link
          href={`/catalog/${item.productId}`}
          className="bg-muted relative h-20 w-20 shrink-0 overflow-hidden rounded-xl sm:h-24 sm:w-24"
        >
          {item.imageUrl ? (
            <Image
              src={item.imageUrl}
              alt={item.name}
              fill
              className="object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-2xl opacity-25">
              📦
            </div>
          )}
        </Link>

        <div className="min-w-0 flex-1">
          <Link
            href={`/catalog/${item.productId}`}
            className="line-clamp-2 text-sm font-semibold sm:text-base"
          >
            {item.name}
          </Link>
          <p className="text-muted-foreground mt-1 text-xs sm:text-sm">
            {t("pricePerItem", {
              value: `${item.price.toLocaleString(locale)} ₸`,
            })}
          </p>

          <div className="mt-3 flex items-center gap-2">
            <div className="border-border inline-flex items-center rounded-lg border">
              <button
                onClick={() => onSetQuantity(item.productId, item.quantity - 1)}
                className="hover:bg-accent flex h-8 w-8 items-center justify-center"
                aria-label={t("decrease")}
              >
                <Minus className="h-3.5 w-3.5" />
              </button>
              <span className="w-9 text-center text-sm font-semibold">
                {item.quantity}
              </span>
              <button
                onClick={() => onSetQuantity(item.productId, item.quantity + 1)}
                className="hover:bg-accent flex h-8 w-8 items-center justify-center"
                aria-label={t("increase")}
              >
                <Plus className="h-3.5 w-3.5" />
              </button>
            </div>
            <button
              onClick={() => onRemove(item.productId)}
              className="text-muted-foreground hover:text-destructive hover:bg-accent flex h-8 w-8 items-center justify-center rounded-lg transition-colors"
              aria-label={t("remove")}
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="text-right">
          <p className="text-sm font-bold sm:text-base">
            {(item.price * item.quantity).toLocaleString(locale)} ₸
          </p>
        </div>
      </div>
    </article>
  );
}
