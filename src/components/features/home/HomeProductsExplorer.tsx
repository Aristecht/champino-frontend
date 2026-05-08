"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  Search,
  X,
  ArrowUpDown,
  ChevronDown,
  SlidersHorizontal,
} from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useDebounce } from "@/hooks/useDebounce";
import {
  useFindAllProductsQuery,
  type FindAllProductsQuery,
} from "@/generated/output";
import { Button } from "@/components/common/ui/Button";
import { Input } from "@/components/common/ui/Input";
import { Switcher } from "@/components/common/ui/Switcher";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/common/ui/DropdownMenu";
import { cn } from "@/utils/tw-merge";
import { ProductCard } from "../catalog/ProductCard";

type Product = FindAllProductsQuery["findAllProducts"]["data"][number];

const SORT_OPTIONS = [
  { labelKey: "new", sortBy: "createdAt", sortOrder: "desc" },
  { labelKey: "priceAsc", sortBy: "price", sortOrder: "asc" },
  { labelKey: "priceDesc", sortBy: "price", sortOrder: "desc" },
] as const;

type SortOption = (typeof SORT_OPTIONS)[number];

const PAGE_LIMIT = 24;

export function HomeProductsExplorer() {
  const t = useTranslations("home");
  const locale = useLocale();
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  const [search, setSearch] = useState("");
  const [sortOption, setSortOption] = useState<SortOption>(SORT_OPTIONS[0]);
  const [showFilters, setShowFilters] = useState(false);
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [inStock, setInStock] = useState(false);

  const [products, setProducts] = useState<Product[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  const debouncedSearch = useDebounce(search, 350);
  const debouncedMinPrice = useDebounce(minPrice, 400);
  const debouncedMaxPrice = useDebounce(maxPrice, 400);

  const { data, loading, fetchMore } = useFindAllProductsQuery({
    variables: {
      filter: {
        page: 1,
        limit: PAGE_LIMIT,
        search: debouncedSearch || undefined,
        sortBy: sortOption.sortBy,
        sortOrder: sortOption.sortOrder,
        minPrice: debouncedMinPrice ? Number(debouncedMinPrice) : undefined,
        maxPrice: debouncedMaxPrice ? Number(debouncedMaxPrice) : undefined,
        inStock: inStock || undefined,
      },
    },
    fetchPolicy: "network-only",
  });

  useEffect(() => {
    if (!data?.findAllProducts) return;
    const { data: firstPage, meta } = data.findAllProducts;
    Promise.resolve().then(() => {
      setProducts(firstPage);
      setPage(meta.page);
      setHasMore(meta.page < meta.totalPages);
    });
  }, [data]);

  const loadMore = useCallback(() => {
    if (!hasMore || loadingMore || loading) return;
    setLoadingMore(true);
    fetchMore({
      variables: {
        filter: {
          page: page + 1,
          limit: PAGE_LIMIT,
          search: debouncedSearch || undefined,
          sortBy: sortOption.sortBy,
          sortOrder: sortOption.sortOrder,
          minPrice: debouncedMinPrice ? Number(debouncedMinPrice) : undefined,
          maxPrice: debouncedMaxPrice ? Number(debouncedMaxPrice) : undefined,
          inStock: inStock || undefined,
        },
      },
    })
      .then(({ data: more }) => {
        if (!more?.findAllProducts) return;
        setProducts((prev) => {
          const existingIds = new Set(prev.map((p) => p.id));
          const newItems = more.findAllProducts.data.filter(
            (p) => !existingIds.has(p.id)
          );
          return [...prev, ...newItems];
        });
        const meta = more.findAllProducts.meta;
        setPage(meta.page);
        setHasMore(meta.page < meta.totalPages);
      })
      .finally(() => setLoadingMore(false));
  }, [
    hasMore,
    loadingMore,
    loading,
    fetchMore,
    page,
    debouncedSearch,
    sortOption,
    debouncedMinPrice,
    debouncedMaxPrice,
    inStock,
  ]);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) loadMore();
      },
      { rootMargin: "240px" }
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [loadMore]);

  const clearAllFilters = () => {
    setMinPrice("");
    setMaxPrice("");
    setInStock(false);
  };

  const activeFilters = [
    ...(minPrice
      ? [
          {
            key: "min",
            label: `${t("from")} ${minPrice}`,
            onRemove: () => setMinPrice(""),
          },
        ]
      : []),
    ...(maxPrice
      ? [
          {
            key: "max",
            label: `${t("to")} ${maxPrice}`,
            onRemove: () => setMaxPrice(""),
          },
        ]
      : []),
    ...(inStock
      ? [
          {
            key: "stock",
            label: t("onlyInStock"),
            onRemove: () => setInStock(false),
          },
        ]
      : []),
  ];
  const hasActiveFilters = activeFilters.length > 0;
  const showInitialLoading = loading && products.length === 0;

  return (
    <section className="mx-auto mt-6 max-w-6xl px-4 sm:px-6 lg:px-8">
      <div className="mb-4 space-y-3">
        <h2 className="text-foreground text-2xl font-bold sm:text-3xl">
          {t("productsHeading")}
        </h2>

        {/* Search */}
        <div className="relative">
          <Search className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
          <Input
            variant="filled"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t("searchPlaceholder")}
            className="pr-9 pl-9"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="text-muted-foreground hover:text-foreground absolute top-1/2 right-3 -translate-y-1/2 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-9 gap-1.5">
                <ArrowUpDown className="h-3.5 w-3.5" />
                <span>{t(`sort.${sortOption.labelKey}`)}</span>
                <ChevronDown className="h-3.5 w-3.5 opacity-50" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-44">
              {SORT_OPTIONS.map((opt) => (
                <DropdownMenuItem
                  key={opt.labelKey}
                  onClick={() => setSortOption(opt)}
                  className={cn(
                    sortOption.labelKey === opt.labelKey && "font-semibold"
                  )}
                >
                  {t(`sort.${opt.labelKey}`)}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <Button
            variant={showFilters ? "default" : "outline"}
            size="sm"
            className="ml-auto h-9 gap-1.5"
            onClick={() => setShowFilters((v) => !v)}
          >
            <SlidersHorizontal className="h-3.5 w-3.5" />
            {t("filters")}
            {hasActiveFilters && (
              <span className="bg-primary-foreground text-primary flex h-4 w-4 items-center justify-center rounded-full text-[10px] font-bold">
                {activeFilters.length}
              </span>
            )}
          </Button>
        </div>

        {/* Filter panel */}
        {showFilters && (
          <div className="border-border bg-card space-y-4 rounded-xl border p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold">{t("filters")}</span>
              {hasActiveFilters && (
                <button
                  onClick={clearAllFilters}
                  className="text-muted-foreground hover:text-foreground text-xs transition-colors"
                >
                  {t("clearAll")}
                </button>
              )}
            </div>
            <div className="space-y-2">
              <p className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
                {t("priceLabel")}
              </p>
              <div className="flex items-center gap-2">
                <Input
                  variant="filled"
                  inputSize="sm"
                  type="number"
                  placeholder={t("from")}
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  className="flex-1"
                />
                <span className="text-muted-foreground shrink-0 text-sm">
                  —
                </span>
                <Input
                  variant="filled"
                  inputSize="sm"
                  type="number"
                  placeholder={t("to")}
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  className="flex-1"
                />
              </div>
            </div>
            <label className="flex cursor-pointer items-center gap-3 select-none">
              <Switcher isActive={inStock} setIsActive={setInStock} />
              <span className="text-sm">{t("onlyInStock")}</span>
            </label>
          </div>
        )}

        {/* Active filter chips */}
        {hasActiveFilters && (
          <div className="flex flex-wrap gap-2">
            {activeFilters.map((f) => (
              <span
                key={f.key}
                className="border-border bg-muted inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium"
              >
                {f.label}
                <button
                  onClick={f.onRemove}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      {showInitialLoading ? (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="bg-card border-border h-72 animate-pulse rounded-2xl border"
            />
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="bg-card border-border text-muted-foreground rounded-2xl border p-8 text-center text-sm">
          {t("noProductsFound")}
        </div>
      ) : (
        <>
          <div className="text-muted-foreground mb-3 text-xs">
            {t("loadedProducts", {
              count: products.length.toLocaleString(locale),
            })}
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {products.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </>
      )}

      <div ref={sentinelRef} className="h-10" />
      {loadingMore && (
        <p className="text-muted-foreground pb-4 text-center text-sm">
          {t("loadingMore")}
        </p>
      )}
    </section>
  );
}
