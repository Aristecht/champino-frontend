"use client";

import { ChevronDown, ChevronRight, MoreHorizontal, Tag } from "lucide-react";
import { useTranslations } from "next-intl";
import { cn } from "@/utils/tw-merge";
import { storageUrl } from "@/utils/storage-url";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/common/ui/DropdownMenu";
import { type EditTarget, type RootCat, fmtDate } from "./categoryTypes";

interface CategoryTableProps {
  loading: boolean;
  rootCats: RootCat[];
  expanded: Set<string>;
  onToggleExpand: (id: string) => void;
  onEdit: (target: EditTarget) => void;
  onDelete: (target: { id: string; name: string }) => void;
}

export function CategoryTable({
  loading,
  rootCats,
  expanded,
  onToggleExpand,
  onEdit,
  onDelete,
}: CategoryTableProps) {
  const t = useTranslations("admin");

  type Row =
    | { kind: "root"; cat: RootCat }
    | {
        kind: "sub";
        sub: NonNullable<RootCat["children"]>[0];
        parentId: string;
      };

  const rows: Row[] = [];
  rootCats.forEach((cat) => {
    rows.push({ kind: "root", cat });
    if (expanded.has(cat.id) && cat.children?.length) {
      cat.children.forEach((sub) =>
        rows.push({ kind: "sub", sub, parentId: cat.id })
      );
    }
  });

  return (
    <div className="bg-card border-border rounded-lg border">
      {/* Mobile cards */}
      <div className="sm:hidden">
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="flex items-center gap-3 border-b px-4 py-3.5 last:border-0"
            >
              <div className="bg-muted h-7 w-7 animate-pulse rounded-md" />
              <div className="min-w-0 flex-1 space-y-2">
                <div className="bg-muted h-4 w-32 animate-pulse rounded" />
                <div className="bg-muted h-3 w-24 animate-pulse rounded" />
              </div>
            </div>
          ))
        ) : rootCats.length === 0 ? (
          <div className="text-muted-foreground flex flex-col items-center px-5 py-12 text-center text-sm">
            <Tag className="mb-2 h-8 w-8 opacity-30" />
            {t("noCategoriesYet")}
          </div>
        ) : (
          rootCats.map((cat) => (
            <div key={cat.id}>
              <div className="flex items-start gap-3 border-b px-4 py-3.5 last:border-0">
                {cat.imageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={storageUrl(cat.imageUrl) ?? cat.imageUrl}
                    alt={cat.name}
                    className="mt-0.5 h-8 w-8 shrink-0 rounded-md object-cover"
                  />
                ) : (
                  <div className="bg-muted mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-md">
                    <Tag className="text-muted-foreground h-4 w-4" />
                  </div>
                )}
                <div className="min-w-0 flex-1 space-y-0.5">
                  <p className="text-foreground font-medium">{cat.name}</p>
                  <p className="text-muted-foreground font-mono text-xs">
                    {cat.slug ?? "—"}
                  </p>
                  {(cat.children?.length ?? 0) > 0 && (
                    <button
                      onClick={() => onToggleExpand(cat.id)}
                      className="text-muted-foreground hover:text-foreground text-xs transition-colors"
                    >
                      {expanded.has(cat.id) ? "▾" : "▸"} {cat.children?.length}{" "}
                      {t("subcategories").toLowerCase()}
                    </button>
                  )}
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="hover:bg-accent flex h-7 w-7 shrink-0 items-center justify-center rounded-md transition-colors">
                      <MoreHorizontal className="text-muted-foreground h-4 w-4" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-40">
                    <DropdownMenuItem
                      onClick={() =>
                        onEdit({
                          id: cat.id,
                          name: cat.name,
                          slug: cat.slug,
                          parentId: cat.parentId,
                          imageUrl: cat.imageUrl,
                          isRoot: true,
                        })
                      }
                    >
                      {t("edit")}
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className="text-red-600 focus:text-red-600"
                      onClick={() => onDelete({ id: cat.id, name: cat.name })}
                    >
                      {t("delete")}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              {expanded.has(cat.id) &&
                cat.children?.map((sub) => (
                  <div
                    key={sub.id}
                    className="bg-muted/20 flex items-start gap-3 border-b px-4 py-3 pl-12 last:border-0"
                  >
                    <div className="min-w-0 flex-1 space-y-0.5">
                      <p className="text-foreground text-sm">{sub.name}</p>
                      <p className="text-muted-foreground font-mono text-xs">
                        {sub.slug ?? "—"}
                      </p>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button className="hover:bg-accent flex h-7 w-7 shrink-0 items-center justify-center rounded-md transition-colors">
                          <MoreHorizontal className="text-muted-foreground h-4 w-4" />
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-40">
                        <DropdownMenuItem
                          onClick={() =>
                            onEdit({
                              id: sub.id,
                              name: sub.name,
                              slug: sub.slug,
                              parentId: cat.id,
                              imageUrl: null,
                              isRoot: false,
                            })
                          }
                        >
                          {t("edit")}
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="text-red-600 focus:text-red-600"
                          onClick={() =>
                            onDelete({ id: sub.id, name: sub.name })
                          }
                        >
                          {t("delete")}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                ))}
            </div>
          ))
        )}
      </div>

      {/* Desktop table */}
      <div className="hidden overflow-x-auto sm:block">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b">
              {[
                t("name"),
                t("slug"),
                t("subcategories"),
                t("createdAt"),
                "",
              ].map((h) => (
                <th
                  key={h}
                  className="text-muted-foreground px-4 py-2.5 text-left text-xs font-medium first:pl-5"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i} className="border-b last:border-0">
                  {Array.from({ length: 5 }).map((_, j) => (
                    <td key={j} className="px-4 py-3.5 first:pl-5">
                      <div
                        className="bg-muted h-4 animate-pulse rounded"
                        style={{ width: j === 0 ? "55%" : "35%" }}
                      />
                    </td>
                  ))}
                </tr>
              ))
            ) : rootCats.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="text-muted-foreground px-5 py-12 text-center text-sm"
                >
                  <Tag className="mx-auto mb-2 h-8 w-8 opacity-30" />
                  {t("noCategoriesYet")}
                </td>
              </tr>
            ) : (
              rows.map((row, ri) => {
                const isLast = ri === rows.length - 1;

                if (row.kind === "root") {
                  const { cat } = row;
                  const isExpanded = expanded.has(cat.id);
                  const childCount = cat.children?.length ?? 0;
                  return (
                    <tr
                      key={cat.id}
                      className={cn(
                        "hover:bg-muted/30 transition-colors",
                        !isLast && "border-b"
                      )}
                    >
                      <td className="py-3.5 pr-4 pl-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() =>
                              childCount > 0 && onToggleExpand(cat.id)
                            }
                            className={cn(
                              "shrink-0 transition-colors",
                              childCount > 0
                                ? "text-muted-foreground hover:text-foreground"
                                : "pointer-events-none opacity-0"
                            )}
                          >
                            {isExpanded ? (
                              <ChevronDown className="h-4 w-4" />
                            ) : (
                              <ChevronRight className="h-4 w-4" />
                            )}
                          </button>
                          {cat.imageUrl ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={storageUrl(cat.imageUrl) ?? cat.imageUrl}
                              alt={cat.name}
                              className="h-7 w-7 rounded-md object-cover"
                            />
                          ) : (
                            <div className="bg-muted flex h-7 w-7 shrink-0 items-center justify-center rounded-md">
                              <Tag className="text-muted-foreground h-3.5 w-3.5" />
                            </div>
                          )}
                          <span className="text-foreground font-medium">
                            {cat.name}
                          </span>
                        </div>
                      </td>
                      <td className="text-muted-foreground px-4 py-3.5 font-mono text-xs">
                        {cat.slug ?? "—"}
                      </td>
                      <td className="text-muted-foreground px-4 py-3.5 text-sm">
                        {childCount > 0 ? (
                          <button
                            onClick={() => onToggleExpand(cat.id)}
                            className="hover:text-foreground transition-colors"
                          >
                            <span className="bg-muted rounded px-1.5 py-0.5 text-xs">
                              {childCount}
                            </span>
                          </button>
                        ) : (
                          "—"
                        )}
                      </td>
                      <td className="text-muted-foreground px-4 py-3.5 text-xs">
                        {fmtDate(cat.createdAt)}
                      </td>
                      <td className="px-4 py-3.5 pr-5">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <button className="hover:bg-accent flex h-7 w-7 items-center justify-center rounded-md transition-colors">
                              <MoreHorizontal className="text-muted-foreground h-4 w-4" />
                            </button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-40">
                            <DropdownMenuItem
                              onClick={() =>
                                onEdit({
                                  id: cat.id,
                                  name: cat.name,
                                  slug: cat.slug,
                                  parentId: cat.parentId,
                                  imageUrl: cat.imageUrl,
                                  isRoot: true,
                                })
                              }
                            >
                              {t("edit")}
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              className="text-red-600 focus:text-red-600"
                              onClick={() =>
                                onDelete({ id: cat.id, name: cat.name })
                              }
                            >
                              {t("delete")}
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  );
                }

                const { sub, parentId } = row;
                return (
                  <tr
                    key={sub.id}
                    className={cn(
                      "bg-muted/20 hover:bg-muted/40 transition-colors",
                      !isLast && "border-b"
                    )}
                  >
                    <td className="py-3 pr-4 pl-12">
                      <div className="flex items-center gap-2">
                        {sub.imageUrl ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={storageUrl(sub.imageUrl) ?? sub.imageUrl}
                            alt={sub.name}
                            className="h-6 w-6 rounded object-cover"
                          />
                        ) : (
                          <div className="bg-muted flex h-6 w-6 shrink-0 items-center justify-center rounded">
                            <Tag className="text-muted-foreground h-3 w-3" />
                          </div>
                        )}
                        <span className="text-foreground text-sm">
                          {sub.name}
                        </span>
                      </div>
                    </td>
                    <td className="text-muted-foreground px-4 py-3 font-mono text-xs">
                      {sub.slug ?? "—"}
                    </td>
                    <td className="text-muted-foreground px-4 py-3 text-sm">
                      —
                    </td>
                    <td className="text-muted-foreground px-4 py-3 text-xs">
                      {fmtDate(sub.createdAt)}
                    </td>
                    <td className="px-4 py-3 pr-5">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button className="hover:bg-accent flex h-7 w-7 items-center justify-center rounded-md transition-colors">
                            <MoreHorizontal className="text-muted-foreground h-4 w-4" />
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-40">
                          <DropdownMenuItem
                            onClick={() =>
                              onEdit({
                                id: sub.id,
                                name: sub.name,
                                slug: sub.slug,
                                parentId,
                                imageUrl: null,
                                isRoot: false,
                              })
                            }
                          >
                            {t("edit")}
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="text-red-600 focus:text-red-600"
                            onClick={() =>
                              onDelete({ id: sub.id, name: sub.name })
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
    </div>
  );
}
