"use client";

import Link from "next/link";
import { ArrowRight, Minus, Plus, ShoppingCart } from "lucide-react";
import { useTranslations } from "next-intl";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/common/ui/Sheet";
import { cn } from "@/utils/tw-merge";

interface ProductInfoPanelProps {
  categoryName?: string | null;
  subCategoryName?: string | null; // Added subcategory
  productName: string;
  finalPriceText: string;
  oldPriceText?: string | null;
  outOfStock: boolean;
  stock: number;
  description?: string | null;
  inCartQty: number | null;
  isAuthenticated: boolean;
  onAdd: () => void;
  onInc: () => void;
  onDec: () => void;
}

export function ProductInfoPanel({
  categoryName,
  subCategoryName,
  productName,
  finalPriceText,
  oldPriceText,
  outOfStock,
  stock,
  description,
  inCartQty,
  isAuthenticated,
  onAdd,
  onInc,
  onDec,
}: ProductInfoPanelProps) {
  const t = useTranslations("product");
  const normalizedDescription = description?.trim() ?? "";
  const previewLimit = 220;
  const hasLongDescription = normalizedDescription.length > previewLimit;
  const descriptionPreview = hasLongDescription
    ? `${normalizedDescription.slice(0, previewLimit).trimEnd()}...`
    : normalizedDescription;

  return (
    <div className="bg-card border-border flex flex-col gap-3 rounded-2xl border p-4 shadow-sm sm:p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-baseline gap-3">
          <span className="text-foreground text-2xl font-bold">
            {finalPriceText}
          </span>
          {oldPriceText && (
            <span className="text-muted-foreground text-lg line-through">
              {oldPriceText}
            </span>
          )}
        </div>
        <p
          className={cn(
            "text-sm",
            outOfStock
              ? "text-destructive"
              : "text-green-600 dark:text-green-400"
          )}
        >
          {outOfStock ? t("outOfStock") : t("inStock", { count: stock })}
        </p>
      </div>

      <h1 className="text-foreground text-xl leading-snug font-bold sm:text-3xl">
        {productName}
      </h1>
      {categoryName && (
        <span className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
          {t("category", {
            category: subCategoryName
              ? `${categoryName} • ${subCategoryName}` // Updated to use '/' as separator
              : categoryName,
          })}
        </span>
      )}

      {normalizedDescription && (
        <div className="bg-muted rounded-2xl p-4">
          <h2 className="text-foreground mb-1.5">{t("description")}</h2>
          <div className="space-y-1 text-sm">
            <p className="text-muted-foreground leading-6 whitespace-pre-line">
              {descriptionPreview}
            </p>
            {hasLongDescription && (
              <div className="flex justify-start sm:justify-end">
                <Sheet>
                  <SheetTrigger asChild>
                    <button
                      type="button"
                      className="text-foreground hover:text-foreground/80 inline-flex w-fit items-center gap-2 rounded-xl p-1 underline transition-colors"
                    >
                      {t("openFullDescription")}
                    </button>
                  </SheetTrigger>
                  <SheetContent
                    side="right"
                    className="w-[92vw] overflow-y-auto px-4 pb-6 sm:w-full sm:max-w-md sm:px-6"
                  >
                    <SheetHeader className="mb-4 border-b pb-3 text-left">
                      <SheetTitle>{productName}</SheetTitle>
                    </SheetHeader>
                    <p className="text-muted-foreground text-sm leading-7 whitespace-pre-line sm:text-base">
                      {normalizedDescription}
                    </p>
                  </SheetContent>
                </Sheet>
              </div>
            )}
          </div>
        </div>
      )}

      {!outOfStock && (
        <div className="flex flex-wrap items-center gap-3">
          {!isAuthenticated ? (
            <Link
              href="/account/login"
              className="bg-primary text-primary-foreground hover:bg-primary/90 mt-1 flex w-full flex-1 items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold transition-colors sm:flex-none"
            >
              <ShoppingCart className="h-4 w-4" /> {t("addToCart")}
            </Link>
          ) : inCartQty === null ? (
            <button
              onClick={onAdd}
              className="bg-primary text-primary-foreground hover:bg-primary/90 mt-1 flex w-full flex-1 items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold transition-colors sm:flex-none"
            >
              <ShoppingCart className="h-4 w-4" /> {t("addToCart")}
            </button>
          ) : (
            <>
              <div className="border-border inline-flex items-center overflow-hidden rounded-xl border">
                <button
                  onClick={onDec}
                  className="hover:bg-accent flex h-10 w-10 items-center justify-center"
                  aria-label={t("decrease")}
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="w-10 text-center text-sm font-semibold">
                  {inCartQty}
                </span>
                <button
                  onClick={onInc}
                  className="hover:bg-accent flex h-10 w-10 items-center justify-center"
                  aria-label={t("increase")}
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
              <Link
                href="/cart"
                className="bg-primary text-primary-foreground hover:bg-primary/90 flex w-full flex-1 items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold whitespace-nowrap transition-colors"
              >
                {t("inCart")}
                <ArrowRight className="h-6 w-6" />
              </Link>
            </>
          )}
        </div>
      )}
    </div>
  );
}
