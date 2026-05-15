"use client";

import { useState } from "react";
import { ImageOff, Loader2, MoreHorizontal, Plus, Search } from "lucide-react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { cn } from "@/utils/tw-merge";
import { toast } from "sonner";
import {
  useFindAllProductsAdminQuery,
  useRemoveProductMutation,
  useToggleProductPublishMutation,
} from "@/generated/output";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/common/ui/DropdownMenu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/common/ui/Dialog";
import { Skeleton } from "@/components/common/ui/Skeleton";
import { useDebounce } from "@/hooks/useDebounce";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/common/ui/Pagination";
import { storageUrl } from "@/utils/storage-url";

function fmtPrice(n: number | null | undefined) {
  if (n == null) return "—";
  return new Intl.NumberFormat("ru-RU", {
    style: "currency",
    currency: "KZT",
    maximumFractionDigits: 0,
  }).format(n);
}

export default function AdminProductsPage() {
  const t = useTranslations("admin");
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteTarget, setDeleteTarget] = useState<{
    id: string;
    name: string;
  } | null>(null);

  const debouncedSearch = useDebounce(search, 400);

  function categoryLabel(
    category:
      | { name: string; parent?: { name: string } | null }
      | null
      | undefined
  ) {
    if (!category) return "—";
    return category.parent
      ? `${category.parent.name} • ${category.name}`
      : category.name;
  }

  function firstImageUrl(
    medias: Array<{ url: string; mediaType: string }> | null | undefined
  ): string | null {
    return medias?.find((m) => m.mediaType === "IMAGE")?.url ?? null;
  }

  const LIMIT = 25;
  const { data, previousData, refetch } = useFindAllProductsAdminQuery({
    variables: {
      filter: {
        limit: LIMIT,
        page: currentPage,
        search: debouncedSearch || undefined,
      },
    },
    fetchPolicy: "cache-and-network",
  });

  const displayData = data ?? previousData;

  const [removeProduct, { loading: deleting }] = useRemoveProductMutation({
    onCompleted: () => {
      toast.success(t("productDeleted"));
      setDeleteTarget(null);
      refetch();
    },
    onError: () => toast.error(t("productDeleteError")),
  });

  const [togglePublish] = useToggleProductPublishMutation({
    onCompleted: (d) => {
      toast.success(
        d.toggleProductPublish.isPublished
          ? t("published")
          : t("unpublishAction")
      );
      refetch();
    },
    onError: () => toast.error(t("noData")),
  });

  const products = displayData?.findAllProductsAdmin?.data ?? [];
  const total = displayData?.findAllProductsAdmin?.meta?.total ?? 0;
  const totalPages = displayData?.findAllProductsAdmin?.meta?.totalPages ?? 0;

  return (
    <div className="space-y-5 p-4 sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-foreground text-xl font-semibold">
            {t("products")}
          </h1>
          {displayData && (
            <p className="text-muted-foreground mt-0.5 text-sm">
              {total} {t("productsCount").toLowerCase()}
            </p>
          )}
        </div>
        <Link
          href="/admin/products/new"
          className="bg-primary text-primary-foreground hover:bg-primary/90 inline-flex items-center gap-1.5 rounded-md px-3.5 py-2 text-sm font-medium transition-colors"
        >
          <Plus className="h-4 w-4" />
          {t("addProduct")}
        </Link>
      </div>

      <div className="bg-card border-border rounded-lg border">
        <div className="border-b px-4 py-3">
          <div className="relative">
            <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
            <input
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                if (currentPage !== 1) setCurrentPage(1);
              }}
              placeholder={t("searchProducts")}
              className="border-input bg-background text-foreground placeholder:text-muted-foreground focus:ring-primary/20 w-full rounded-md border py-1.5 pr-3 pl-9 text-sm outline-none focus:ring-2 sm:max-w-xs"
            />
          </div>
        </div>

        {/* Mobile cards */}
        <div className="sm:hidden">
          {!displayData ? (
            Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className="flex items-start gap-3 border-b px-4 py-4 last:border-0"
              >
                <div className="min-w-0 flex-1 space-y-2">
                  <div className="bg-muted h-4 w-40 animate-pulse rounded" />
                  <div className="bg-muted h-3 w-28 animate-pulse rounded" />
                  <div className="bg-muted h-3 w-20 animate-pulse rounded" />
                </div>
                <div className="bg-muted h-6 w-14 animate-pulse rounded-full" />
              </div>
            ))
          ) : products.length === 0 ? (
            <div className="text-muted-foreground px-5 py-12 text-center text-sm">
              {t("noProducts")}
            </div>
          ) : (
            products.map((p) => {
              const status = p.isPublished
                ? "published"
                : p.isDraft
                  ? "draft"
                  : "inactive";
              return (
                <div
                  key={p.id}
                  className="flex items-start gap-3 border-b px-4 py-3.5 last:border-0"
                >
                  {/* Thumbnail */}
                  <div className="bg-muted mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-md border">
                    {(() => {
                      const imgUrl = firstImageUrl(p.medias);
                      const src = imgUrl ? storageUrl(imgUrl) : undefined;
                      return src ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={src}
                          alt={p.name ?? ""}
                          width={40}
                          height={40}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <ImageOff className="text-muted-foreground h-4 w-4" />
                      );
                    })()}
                  </div>
                  <div className="min-w-0 flex-1 space-y-1">
                    <p className="text-foreground leading-snug font-medium">
                      {p.name ?? "—"}
                    </p>
                    <p className="text-muted-foreground text-xs">
                      {categoryLabel(p.category)}
                    </p>
                    <div className="flex flex-wrap items-baseline gap-4">
                      <span className="text-foreground text-sm font-medium">
                        {fmtPrice(p.discountedPrice ?? p.price)}
                      </span>
                      {p.discountedPrice != null &&
                        p.discountedPrice !== p.price && (
                          <span className="text-muted-foreground text-xs line-through">
                            {fmtPrice(p.price)}
                          </span>
                        )}
                      <span
                        className={cn(
                          "text-xs font-medium tabular-nums",
                          (p.stock ?? 0) === 0
                            ? "text-red-500"
                            : "text-muted-foreground"
                        )}
                      >
                        {t("stock")}: {p.stock}
                      </span>
                    </div>
                  </div>
                  <div className="flex shrink-0 flex-col items-end gap-2">
                    <span
                      className={cn(
                        "inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium",
                        status === "published"
                          ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400"
                          : status === "draft"
                            ? "bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400"
                            : "bg-muted text-muted-foreground"
                      )}
                    >
                      {status === "published"
                        ? t("published")
                        : status === "draft"
                          ? t("draft")
                          : t("inactive")}
                    </span>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button className="hover:bg-accent flex h-7 w-7 items-center justify-center rounded-md transition-colors">
                          <MoreHorizontal className="text-muted-foreground h-4 w-4" />
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-44">
                        <DropdownMenuItem asChild>
                          <Link href={`/admin/products/${p.id}`}>
                            {t("edit")}
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() =>
                            togglePublish({ variables: { id: p.id } })
                          }
                        >
                          {p.isPublished
                            ? t("unpublishAction")
                            : t("publishAction")}
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="text-red-600 focus:text-red-600"
                          onClick={() =>
                            setDeleteTarget({ id: p.id, name: p.name ?? p.id })
                          }
                        >
                          {t("delete")}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Desktop table */}
        <div className="hidden overflow-x-auto sm:block">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-muted-foreground w-14 py-2.5 pl-5 text-left text-xs font-medium" />
                {[
                  t("name"),
                  t("category"),
                  t("price"),
                  t("stock"),
                  t("status"),
                  "",
                ].map((h) => (
                  <th
                    key={h}
                    className="text-muted-foreground px-4 py-2.5 text-left text-xs font-medium"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {!displayData ? (
                Array.from({ length: 6 }).map((_, i) => (
                  <tr key={i} className="border-b last:border-0">
                    {Array.from({ length: 7 }).map((_, j) => (
                      <td key={j} className="px-4 py-3.5 first:pl-5">
                        <Skeleton
                          className="h-4"
                          style={{ width: j === 0 ? "60%" : "40%" }}
                        />
                      </td>
                    ))}
                  </tr>
                ))
              ) : products.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="text-muted-foreground px-5 py-12 text-center text-sm"
                  >
                    {t("noProducts")}
                  </td>
                </tr>
              ) : (
                products.map((p, i) => {
                  const status = p.isPublished
                    ? "published"
                    : p.isDraft
                      ? "draft"
                      : "inactive";
                  return (
                    <tr
                      key={p.id}
                      className={cn(
                        "hover:bg-muted/30 transition-colors",
                        i < products.length - 1 && "border-b"
                      )}
                    >
                      {/* Image thumbnail */}
                      <td className="py-3.5 pr-2 pl-5">
                        <div className="bg-muted flex h-10 w-10 items-center justify-center overflow-hidden rounded-md border">
                          {(() => {
                            const imgUrl = firstImageUrl(p.medias);
                            const src = imgUrl ? storageUrl(imgUrl) : undefined;
                            return src ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img
                                src={src}
                                alt={p.name ?? ""}
                                width={40}
                                height={40}
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <ImageOff className="text-muted-foreground h-4 w-4" />
                            );
                          })()}
                        </div>
                      </td>
                      <td className="py-3.5 pr-4 pl-2">
                        <p className="text-foreground font-medium">
                          {p.name ?? "—"}
                        </p>
                        <p className="text-muted-foreground text-xs">{p.id}</p>
                      </td>
                      <td className="text-muted-foreground px-4 py-3.5 text-sm">
                        {categoryLabel(p.category)}
                      </td>
                      <td className="px-4 py-3.5">
                        <p className="text-foreground font-medium">
                          {fmtPrice(p.discountedPrice ?? p.price)}
                        </p>
                        {p.discountedPrice != null &&
                          p.discountedPrice !== p.price && (
                            <p className="text-muted-foreground text-xs line-through">
                              {fmtPrice(p.price)}
                            </p>
                          )}
                      </td>
                      <td
                        className={cn(
                          "px-4 py-3.5 font-medium tabular-nums",
                          (p.stock ?? 0) === 0
                            ? "text-red-500"
                            : "text-foreground"
                        )}
                      >
                        {p.stock}
                      </td>
                      <td className="px-4 py-3.5">
                        <span
                          className={cn(
                            "inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium",
                            status === "published"
                              ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400"
                              : status === "draft"
                                ? "bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400"
                                : "bg-muted text-muted-foreground"
                          )}
                        >
                          {status === "published"
                            ? t("published")
                            : status === "draft"
                              ? t("draft")
                              : t("inactive")}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 pr-5">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <button className="hover:bg-accent flex h-7 w-7 items-center justify-center rounded-md transition-colors">
                              <MoreHorizontal className="text-muted-foreground h-4 w-4" />
                            </button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-44">
                            <DropdownMenuItem asChild>
                              <Link href={`/admin/products/${p.id}`}>
                                {t("edit")}
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() =>
                                togglePublish({ variables: { id: p.id } })
                              }
                            >
                              {p.isPublished
                                ? t("unpublishAction")
                                : t("publishAction")}
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              className="text-red-600 focus:text-red-600"
                              onClick={() =>
                                setDeleteTarget({
                                  id: p.id,
                                  name: p.name ?? p.id,
                                })
                              }
                            >
                              {t("delete")}
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
        {totalPages > 1 && (
          <div className="border-t px-4 py-4">
            <Pagination>
              <PaginationContent>
                {currentPage > 1 && (
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      className="cursor-pointer"
                      label="Назад"
                    />
                  </PaginationItem>
                )}
                {Array.from({ length: totalPages }).map((_, i) => {
                  const page = i + 1;
                  if (
                    page === 1 ||
                    page === totalPages ||
                    (page >= currentPage - 1 && page <= currentPage + 1)
                  ) {
                    return (
                      <PaginationItem key={page}>
                        <PaginationLink
                          isActive={page === currentPage}
                          onClick={() => setCurrentPage(page)}
                          className="cursor-pointer"
                        >
                          {page}
                        </PaginationLink>
                      </PaginationItem>
                    );
                  }
                  if (page === currentPage - 2 || page === currentPage + 2) {
                    return <PaginationEllipsis key={page} />;
                  }
                  return null;
                })}
                {currentPage < totalPages && (
                  <PaginationItem>
                    <PaginationNext
                      onClick={() => setCurrentPage((p) => p + 1)}
                      className="cursor-pointer"
                      label="Вперёд"
                    />
                  </PaginationItem>
                )}
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </div>
      <Dialog
        open={!!deleteTarget}
        onOpenChange={(o) => !o && setDeleteTarget(null)}
      >
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Удалить товар</DialogTitle>
            <DialogDescription>
              Вы уверены, что хотите удалить{" "}
              <span className="text-foreground font-medium">
                «{deleteTarget?.name}»
              </span>
              ? Это действие необратимо.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-2 gap-2">
            <DialogClose asChild>
              <button className="border-border text-foreground hover:bg-muted rounded-md border px-4 py-2 text-sm transition-colors">
                Отмена
              </button>
            </DialogClose>
            <button
              onClick={() =>
                deleteTarget &&
                removeProduct({ variables: { id: deleteTarget.id } })
              }
              disabled={deleting}
              className="inline-flex items-center gap-2 rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-700 disabled:opacity-50"
            >
              {deleting && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
              Удалить
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
