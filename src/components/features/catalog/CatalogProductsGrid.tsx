"use client";

import { RefObject } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/common/ui/Button";
import { Skeleton } from "@/components/common/ui/Skeleton";
import { ProductCard } from "./ProductCard";
import type {
  FindAllCategoriesQuery,
  FindAllProductsQuery,
} from "@/generated/output";
import { ChevronRight, SearchAlert } from "lucide-react";

type Category = FindAllCategoriesQuery["findAllCategories"][number];
type ChildCat = NonNullable<Category["children"]>[number];
type Product = FindAllProductsQuery["findAllProducts"]["data"][number];

interface CatalogProductsGridProps {
  initLoading: boolean;
  products: Product[];
  loadingMore: boolean;
  hasMore: boolean;
  hasActiveFilters: boolean;
  clearAllFilters: () => void;
  sentinelRef: RefObject<HTMLDivElement | null>;
  selectedParent: Category | null;
  selectedChild: ChildCat | null;
  debouncedSearch: string;
  onBreadcrumbCatalog: () => void;
  onBreadcrumbParent: () => void;
}

function SkeletonGrid({ count }: { count: number }) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="space-y-2">
          <Skeleton className="aspect-square w-full rounded-xl" />
          <Skeleton className="h-4 w-3/4 rounded" />
          <Skeleton className="h-4 w-1/2 rounded" />
        </div>
      ))}
    </div>
  );
}

export function CatalogProductsGrid({
  initLoading,
  products,
  loadingMore,
  hasMore,
  hasActiveFilters,
  clearAllFilters,
  sentinelRef,
  selectedParent,
  selectedChild,
  debouncedSearch,
  onBreadcrumbCatalog,
  onBreadcrumbParent,
}: CatalogProductsGridProps) {
  const t = useTranslations("catalog");

  return (
    <div className="mt-4 space-y-4">
      {/* Breadcrumb */}
      {(selectedParent || debouncedSearch) && (
        <div className="text-muted-foreground flex flex-wrap items-center gap-1 text-xs">
          <button
            onClick={onBreadcrumbCatalog}
            className="hover:text-foreground transition-colors"
          >
            {t("catalog")}
          </button>
          {selectedParent && (
            <>
              <ChevronRight width={12} height={12} />
              <button
                onClick={onBreadcrumbParent}
                className="hover:text-foreground transition-colors"
              >
                {selectedParent.name}
              </button>
            </>
          )}
          {selectedChild && (
            <>
              <ChevronRight width={12} height={12} />
              <span className="text-foreground font-medium">
                {selectedChild.name}
              </span>
            </>
          )}
          {debouncedSearch && !selectedChild && !selectedParent && (
            <>
              <ChevronRight width={12} height={12} />
              <span className="text-foreground font-medium">
                «{debouncedSearch}»
              </span>
            </>
          )}
        </div>
      )}

      {initLoading ? (
        <SkeletonGrid count={8} />
      ) : products.length === 0 ? (
        <div className="flex flex-col items-center gap-3 py-24 text-center">
          <SearchAlert className="text-primary" height={40} width={40} />
          <p className="text-foreground font-medium">{t("notFoundTitle")}</p>
          <p className="text-muted-foreground text-sm">{t("notFoundDesc")}</p>
          {hasActiveFilters && (
            <Button variant="outline" size="sm" onClick={clearAllFilters}>
              {t("resetFilters")}
            </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {products.map((p) => (
            <ProductCard
              key={p.id}
              product={p}
              parentId={selectedParent?.id ?? null}
              childId={selectedChild?.id ?? null}
              searchQuery={debouncedSearch || null}
            />
          ))}
        </div>
      )}

      {loadingMore && <SkeletonGrid count={4} />}

      {hasMore && !initLoading && <div ref={sentinelRef} className="h-1" />}

      {!hasMore && products.length > 0 && (
        <p className="text-muted-foreground py-4 text-center text-xs">
          {t("allLoaded", { count: products.length })}
        </p>
      )}
    </div>
  );
}
