"use client";

import { ChevronLeft, Search, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { Input } from "@/components/common/ui/Input";
import type { FindAllProductsQuery } from "@/generated/output";

type CatalogView = "categories" | "subcategories" | "products";

interface CatalogHeaderProps {
  view: CatalogView;
  pageTitle: string;
  products: FindAllProductsQuery["findAllProducts"]["data"];
  initLoading: boolean;
  search: string;
  onSearchChange: (v: string) => void;
  onBack: () => void;
}

export function CatalogHeader({
  view,
  pageTitle,
  products,
  initLoading,
  search,
  onSearchChange,
  onBack,
}: CatalogHeaderProps) {
  const t = useTranslations("catalog");

  return (
    <div className="border-border bg-background/95 sticky top-0 z-20 border-b backdrop-blur-sm">
      <div className="container mx-auto max-w-6xl space-y-3 px-4 py-3">
        <div className="flex items-center gap-2">
          {view !== "categories" && (
            <button
              onClick={onBack}
              className="bg-muted hover:bg-muted/70 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-colors"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
          )}
          <h1 className="text-foreground flex-1 truncate text-lg font-bold">
            {pageTitle}
          </h1>
          {view === "products" && !initLoading && products.length > 0 && (
            <span className="text-muted-foreground shrink-0 text-xs">
              {t("pieces", { count: products.length })}
            </span>
          )}
        </div>

        <div className="relative">
          <Search className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
          <Input
            variant="filled"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={t("searchPlaceholder")}
            className="pr-9 pl-9"
          />
          {search && (
            <button
              onClick={() => onSearchChange("")}
              className="text-muted-foreground hover:text-foreground absolute top-1/2 right-3 -translate-y-1/2 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
