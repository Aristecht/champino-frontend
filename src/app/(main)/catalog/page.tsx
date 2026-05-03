"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import {
  useFindAllCategoriesQuery,
  useFindAllProductsQuery,
} from "@/generated/output";
import type {
  FindAllCategoriesQuery,
  FindAllProductsQuery,
} from "@/generated/output";
import { useDebounce } from "@/hooks/useDebounce";
import { CatalogHeader } from "@/components/features/catalog/CatalogHeader";
import { CategoryPickerGrid } from "@/components/features/catalog/CategoryPickerGrid";
import { SubcategoryPicker } from "@/components/features/catalog/SubcategoryPicker";
import {
  CatalogFiltersBar,
  SORT_OPTIONS,
} from "@/components/features/catalog/CatalogFiltersBar";
import type {
  SortOption,
  ActiveFilter,
} from "@/components/features/catalog/CatalogFiltersBar";
import { CatalogProductsGrid } from "@/components/features/catalog/CatalogProductsGrid";

type Category = FindAllCategoriesQuery["findAllCategories"][number];
type ChildCat = NonNullable<Category["children"]>[number];
type Product = FindAllProductsQuery["findAllProducts"]["data"][number];
type CatalogView = "categories" | "subcategories" | "products";

const PAGE_LIMIT = 20;

export default function CatalogPage() {
  const t = useTranslations("catalog");
  const router = useRouter();
  const searchParams = useSearchParams();
  const forceRootReset = searchParams.get("root") === "1";
  const hasRouteFilters =
    searchParams.has("parentId") ||
    searchParams.has("childId") ||
    searchParams.has("q");
  const [view, setView] = useState<CatalogView>("categories");
  const [selectedParent, setSelectedParent] = useState<Category | null>(null);
  const [selectedChild, setSelectedChild] = useState<ChildCat | null>(null);
  const [search, setSearch] = useState("");
  const [sortOption, setSortOption] = useState<SortOption>(SORT_OPTIONS[0]);
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const debouncedSearch = useDebounce(search, 400);
  const debouncedMinPrice = useDebounce(minPrice, 400);
  const debouncedMaxPrice = useDebounce(maxPrice, 400);
  const [inStock, setInStock] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [isRestoringRouteState, setIsRestoringRouteState] =
    useState(hasRouteFilters);
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const restoredFromQuery = useRef(false);

  const resetCatalogState = useCallback(() => {
    setView("categories");
    setSelectedParent(null);
    setSelectedChild(null);
    setSearch("");
    setSortOption(SORT_OPTIONS[0]);
    setMinPrice("");
    setMaxPrice("");
    setInStock(false);
    setShowFilters(false);
    setProducts([]);
    setPage(1);
    setHasMore(true);
    setLoadingMore(false);
    setIsRestoringRouteState(false);
    restoredFromQuery.current = false;
  }, []);

  useEffect(() => {
    if (!forceRootReset) return;

    Promise.resolve().then(() => {
      resetCatalogState();
      router.replace("/catalog");
    });
  }, [forceRootReset, resetCatalogState, router]);

  const { data: catData, loading: catLoading } = useFindAllCategoriesQuery();
  const roots = (catData?.findAllCategories ?? []).filter((c) => !c.parentId);

  useEffect(() => {
    if (forceRootReset) {
      return;
    }

    restoredFromQuery.current = false;
    Promise.resolve().then(() => setIsRestoringRouteState(hasRouteFilters));
  }, [forceRootReset, hasRouteFilters, searchParams]);

  useEffect(() => {
    if (forceRootReset) {
      return;
    }

    if (restoredFromQuery.current || !catData?.findAllCategories?.length) {
      return;
    }
    restoredFromQuery.current = true;
    const parentId = searchParams.get("parentId");
    const childId = searchParams.get("childId");
    const q = searchParams.get("q");

    const all = catData.findAllCategories;
    let parent = parentId ? (all.find((c) => c.id === parentId) ?? null) : null;

    if (!parent && childId) {
      parent =
        all.find((c) => c.children?.some((x) => x.id === childId)) ?? null;
    }

    Promise.resolve().then(() => {
      if (q) {
        setSearch(q);
      }

      if (parent) {
        setSelectedParent(parent);
        const child = childId
          ? (parent.children?.find((x) => x.id === childId) ?? null)
          : null;

        if (child) {
          setSelectedChild(child);
          setView("products");
          setIsRestoringRouteState(false);
          return;
        }

        setView(
          parent.children && parent.children.length > 0
            ? "subcategories"
            : "products"
        );
        setIsRestoringRouteState(false);
        return;
      }

      if (q) {
        setView("products");
      }

      setIsRestoringRouteState(false);
    });
  }, [catData, forceRootReset, searchParams]);

  useEffect(() => {
    if (forceRootReset) {
      return;
    }

    if (!hasRouteFilters) {
      Promise.resolve().then(() => setIsRestoringRouteState(false));
    }
  }, [forceRootReset, hasRouteFilters]);

  const queryCategoryId: string | null =
    selectedChild?.id ??
    (selectedParent &&
    (!selectedParent.children || selectedParent.children.length === 0)
      ? selectedParent.id
      : null);

  const {
    data: queryData,
    loading: initLoading,
    fetchMore,
  } = useFindAllProductsQuery({
    variables: {
      filter: {
        page: 1,
        limit: PAGE_LIMIT,
        categoryId: queryCategoryId,
        search: debouncedSearch || undefined,
        sortBy: sortOption.sortBy,
        sortOrder: sortOption.sortOrder,
        minPrice: debouncedMinPrice ? parseFloat(debouncedMinPrice) : undefined,
        maxPrice: debouncedMaxPrice ? parseFloat(debouncedMaxPrice) : undefined,
        inStock: inStock || undefined,
      },
    },
    fetchPolicy: "network-only",
    skip: view !== "products" || isRestoringRouteState,
  });

  useEffect(() => {
    if (!debouncedSearch || view === "products") return;
    Promise.resolve().then(() => setView("products"));
  }, [debouncedSearch, view]);

  useEffect(() => {
    if (!queryData?.findAllProducts) return;
    const prods = queryData.findAllProducts.data;
    const meta = queryData.findAllProducts.meta;
    Promise.resolve().then(() => {
      setProducts(prods);
      setHasMore(meta.page < meta.totalPages);
      setPage(1);
    });
  }, [queryData]);

  const loadMore = useCallback(() => {
    if (loadingMore || !hasMore || initLoading) return;
    setLoadingMore(true);
    fetchMore({
      variables: {
        filter: {
          page: page + 1,
          limit: PAGE_LIMIT,
          categoryId: queryCategoryId,
          search: debouncedSearch || undefined,
          sortBy: sortOption.sortBy,
          sortOrder: sortOption.sortOrder,
          minPrice: debouncedMinPrice
            ? parseFloat(debouncedMinPrice)
            : undefined,
          maxPrice: debouncedMaxPrice
            ? parseFloat(debouncedMaxPrice)
            : undefined,
          inStock: inStock || undefined,
        },
      },
    })
      .then(({ data: moreData }) => {
        if (!moreData?.findAllProducts) return;
        setProducts((prev) => [...prev, ...moreData.findAllProducts.data]);
        const meta = moreData.findAllProducts.meta;
        setPage(meta.page);
        setHasMore(meta.page < meta.totalPages);
      })
      .finally(() => setLoadingMore(false));
  }, [
    loadingMore,
    hasMore,
    initLoading,
    fetchMore,
    page,
    queryCategoryId,
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
      { rootMargin: "200px" }
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [loadMore]);

  function handleCategoryClick(cat: Category) {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setSelectedParent(cat);
    setSelectedChild(null);
    setView(
      cat.children && cat.children.length > 0 ? "subcategories" : "products"
    );
  }

  function handleChildClick(child: ChildCat) {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setSelectedChild(child);
    setView("products");
  }

  function handleBack() {
    if (view === "products") {
      if (selectedParent?.children?.length) {
        Promise.resolve().then(() => {
          setView("subcategories");
          setSelectedChild(null);
        });
      } else {
        Promise.resolve().then(() => {
          setView("categories");
          setSelectedParent(null);
          setSearch("");
        });
      }
    } else if (view === "subcategories") {
      Promise.resolve().then(() => {
        setView("categories");
        setSelectedParent(null);
      });
    }
  }

  function clearAllFilters() {
    setMinPrice("");
    setMaxPrice("");
    setInStock(false);
  }

  const activeFilters: ActiveFilter[] = [];
  if (minPrice)
    activeFilters.push({
      key: "minPrice",
      label: t("chipFrom", { value: minPrice }),
      onRemove: () => setMinPrice(""),
    });
  if (maxPrice)
    activeFilters.push({
      key: "maxPrice",
      label: t("chipTo", { value: maxPrice }),
      onRemove: () => setMaxPrice(""),
    });
  if (inStock)
    activeFilters.push({
      key: "inStock",
      label: t("inStock"),
      onRemove: () => setInStock(false),
    });
  const hasActiveFilters = activeFilters.length > 0;

  const pageTitle =
    view === "categories"
      ? t("catalog")
      : view === "subcategories"
        ? (selectedParent?.name ?? t("category"))
        : (selectedChild?.name ??
          selectedParent?.name ??
          (debouncedSearch ? `«${debouncedSearch}»` : t("products")));
  const holdCatalogContent = isRestoringRouteState && hasRouteFilters;

  return (
    <div className="min-h-screen">
      <CatalogHeader
        view={view}
        pageTitle={pageTitle}
        products={products}
        initLoading={initLoading}
        search={search}
        onSearchChange={setSearch}
        onBack={handleBack}
      />

      <div className="container mx-auto max-w-6xl px-4 py-5">
        {holdCatalogContent && (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, index) => (
              <div
                key={index}
                className="bg-muted aspect-[0.8] animate-pulse rounded-2xl"
              />
            ))}
          </div>
        )}

        {!holdCatalogContent && view === "categories" && (
          <CategoryPickerGrid
            roots={roots}
            catLoading={catLoading}
            onCategoryClick={handleCategoryClick}
          />
        )}

        {!holdCatalogContent && view === "subcategories" && selectedParent && (
          <SubcategoryPicker
            selectedParent={selectedParent}
            onChildClick={handleChildClick}
          />
        )}

        {!holdCatalogContent && view === "products" && (
          <>
            <CatalogFiltersBar
              sortOption={sortOption}
              setSortOption={setSortOption}
              showFilters={showFilters}
              setShowFilters={setShowFilters}
              minPrice={minPrice}
              setMinPrice={setMinPrice}
              maxPrice={maxPrice}
              setMaxPrice={setMaxPrice}
              inStock={inStock}
              setInStock={setInStock}
              activeFilters={activeFilters}
              hasActiveFilters={hasActiveFilters}
              clearAllFilters={clearAllFilters}
            />
            <CatalogProductsGrid
              initLoading={initLoading}
              products={products}
              loadingMore={loadingMore}
              hasMore={hasMore}
              hasActiveFilters={hasActiveFilters}
              clearAllFilters={clearAllFilters}
              sentinelRef={sentinelRef}
              selectedParent={selectedParent}
              selectedChild={selectedChild}
              debouncedSearch={debouncedSearch}
              onBreadcrumbCatalog={() => {
                setView("categories");
                setSelectedParent(null);
                setSelectedChild(null);
                setSearch("");
              }}
              onBreadcrumbParent={() => {
                if (selectedParent?.children?.length) {
                  setView("subcategories");
                  setSelectedChild(null);
                } else {
                  setView("categories");
                  setSelectedParent(null);
                }
              }}
            />
          </>
        )}
      </div>
    </div>
  );
}
