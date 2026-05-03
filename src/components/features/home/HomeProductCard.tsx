"use client";

import Image from "next/image";
import Link from "next/link";
import { ShoppingCart, Tag } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import type { FindAllProductsQuery } from "@/generated/output";
import { storageUrl } from "@/utils/storage-url";
import { cn } from "@/utils/tw-merge";
import { cartStore } from "@/store/cart/cart.store";
import { authStore } from "@/store/auth/auth.store";

type Product = FindAllProductsQuery["findAllProducts"]["data"][number];

interface HomeProductCardProps {
  product: Product;
}

export function HomeProductCard({ product }: HomeProductCardProps) {
  const t = useTranslations("home");
  const router = useRouter();
  const locale = useLocale();
  const isAuthenticated = authStore((s) => s.isAuthenticated);
  const addItem = cartStore((s) => s.addItem);
  const firstImage = storageUrl(product.medias?.[0]?.url ?? null);
  const hasDiscount = (product.discountPercent ?? 0) > 0;
  const outOfStock = (product.stock ?? 0) <= 0;

  return (
    <Link
      href={`/catalog/${product.id}`}
      className="bg-card border-border/60 hover:border-border group relative flex flex-col overflow-hidden rounded-2xl border transition-all duration-200 hover:shadow-md"
    >
      <div className="bg-muted relative aspect-square overflow-hidden">
        {firstImage ? (
          <Image
            src={firstImage}
            alt={product.name ?? t("productFallback")}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-4xl opacity-25">
            📦
          </div>
        )}

        {hasDiscount && (
          <span className="bg-destructive text-destructive-foreground absolute top-2 left-2 inline-flex items-center gap-1 rounded-lg px-2 py-0.5 text-[11px] font-semibold">
            <Tag className="h-3 w-3" />-{product.discountPercent}%
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-2 p-3">
        <p className="text-muted-foreground truncate text-[11px] uppercase">
          {product.category?.name ?? t("allProducts")}
        </p>
        <p className="text-foreground line-clamp-2 text-sm font-medium">
          {product.name ?? t("productFallback")}
        </p>

        <div className="mt-auto flex items-end justify-between gap-2">
          <div className="flex flex-col">
            <span className="text-foreground text-base font-bold">
              {(product.discountedPrice ?? product.price ?? 0).toLocaleString(
                locale
              )}{" "}
              ₸
            </span>
            {hasDiscount && (
              <span className="text-muted-foreground text-xs line-through">
                {(product.price ?? 0).toLocaleString(locale)} ₸
              </span>
            )}
          </div>
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              if (outOfStock) return;
              if (!isAuthenticated) {
                toast.info("Войдите в аккаунт, чтобы добавлять товары в корзину");
                router.push("/account/login");
                return;
              }
              addItem({
                productId: product.id,
                name: product.name ?? t("productFallback"),
                price: product.discountedPrice ?? product.price ?? 0,
                imageUrl: firstImage,
                stock: product.stock ?? 0,
              });
            }}
            disabled={outOfStock}
            className={cn(
              "flex h-8 w-8 items-center justify-center rounded-lg transition-transform active:scale-95",
              outOfStock || !isAuthenticated
                ? "bg-muted text-muted-foreground cursor-not-allowed"
                : "bg-primary text-primary-foreground hover:bg-primary/90"
            )}
            aria-label={t("addToCart")}
          >
            <ShoppingCart className="h-4 w-4" />
          </button>
        </div>
      </div>
    </Link>
  );
}
