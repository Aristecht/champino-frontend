"use client";

import Image from "next/image";
import Link from "next/link";
import { ShoppingCart, Star, Tag } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { cn } from "@/utils/tw-merge";
import { storageUrl } from "@/utils/storage-url";
import {
  useGetProductReviewsQuery,
  type FindAllProductsQuery,
} from "@/generated/output";
import { cartStore } from "@/store/cart/cart.store";
import { authStore } from "@/store/auth/auth.store";
import { pluralize } from "@/utils/pluralize";

type Product = FindAllProductsQuery["findAllProducts"]["data"][number];

interface ProductCardProps {
  product: Product;
  parentId?: string | null;
  childId?: string | null;
  searchQuery?: string | null;
}

export function ProductCard({
  product: p,
  parentId,
  childId,
  searchQuery,
}: ProductCardProps) {
  const t = useTranslations("product");
  const router = useRouter();
  const locale = useLocale();
  const isAuthenticated = authStore((s) => s.isAuthenticated);
  const firstImage = storageUrl(p.medias?.[0]?.url ?? null);
  const hasDiscount = (p.discountPercent ?? 0) > 0;
  const outOfStock = p.stock === 0;
  const addItem = cartStore((s) => s.addItem);
  const { data: reviewsData } = useGetProductReviewsQuery({
    variables: { productId: p.id },
  });
  const avgRating = reviewsData?.getProductReviews?.avgRating ?? 0;
  const reviewCount = reviewsData?.getProductReviews?.total ?? 0;

  const params = new URLSearchParams();
  if (parentId) params.set("parentId", parentId);
  if (childId) params.set("childId", childId);
  if (searchQuery) params.set("q", searchQuery);
  if (parentId || childId || searchQuery) params.set("from", "catalog");
  const href = params.toString()
    ? `/catalog/${p.id}?${params}`
    : `/catalog/${p.id}`;

  return (
    <Link
      href={href}
      className="group bg-card border-border/50 hover:border-border relative flex flex-col overflow-hidden rounded-2xl border transition-all duration-200 hover:shadow-md"
    >
      {/* Image area */}
      <div className="bg-muted relative aspect-square w-full overflow-hidden">
        {firstImage ? (
          <Image
            src={firstImage}
            alt={p.name ?? t("defaultName")}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-4xl opacity-20">
            📦
          </div>
        )}

        {/* Discount badge */}
        {hasDiscount && (
          <div className="bg-destructive text-destructive-foreground absolute top-2 left-2 flex items-center gap-0.5 rounded-lg px-2 py-0.5 text-[11px] font-bold shadow-sm">
            <Tag className="h-2.5 w-2.5" />-{p.discountPercent}%
          </div>
        )}

        {/* Out of stock overlay */}
        {outOfStock && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-[2px]">
            <span className="rounded-xl bg-white/95 px-3 py-1.5 text-xs font-semibold text-neutral-800 shadow">
              {t("outOfStock")}
            </span>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex flex-1 flex-col gap-2 p-3">
        {p.category && (
          <span className="text-muted-foreground truncate text-[10px] font-medium tracking-wide uppercase">
            {p.category.name}
          </span>
        )}
        <p className="text-foreground line-clamp-2 text-sm leading-snug font-medium">
          {p.name ?? "—"}
        </p>

        <div className="text-muted-foreground flex items-center gap-1 text-[11px]">
          <Star
            className={cn(
              "h-3.5 w-3.5",
              avgRating > 0
                ? "fill-yellow-400 text-yellow-400"
                : "text-muted-foreground/40"
            )}
          />
          <span>
            {avgRating > 0 ? avgRating.toFixed(1) : "0.0"} · {reviewCount}{" "}
            {pluralize(reviewCount, t("one"), t("few"), t("many"))}
          </span>
        </div>

        <div className="mt-auto flex items-end justify-between gap-1">
          {/* Price block */}
          <div className="flex flex-col">
            {hasDiscount ? (
              <>
                <span className="text-foreground text-base font-bold">
                  {p.discountedPrice?.toLocaleString(locale)} ₸
                </span>
                <span className="text-muted-foreground text-[11px] line-through">
                  {p.price?.toLocaleString(locale)} ₸
                </span>
              </>
            ) : (
              <span className="text-foreground text-base font-bold">
                {p.price?.toLocaleString(locale)} ₸
              </span>
            )}
          </div>

          {/* Cart button */}
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
                productId: p.id,
                name: p.name ?? t("defaultName"),
                price: p.discountedPrice ?? p.price ?? 0,
                imageUrl: firstImage,
                stock: p.stock ?? 0,
              });
            }}
            disabled={outOfStock}
            className={cn(
              "flex h-8 w-8 shrink-0 items-center justify-center rounded-xl transition-all duration-150",
              outOfStock || !isAuthenticated
                ? "bg-muted text-muted-foreground cursor-not-allowed"
                : "bg-foreground text-background hover:bg-foreground/90 hover:scale-105 active:scale-95"
            )}
          >
            <ShoppingCart className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </Link>
  );
}
