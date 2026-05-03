"use client";

import Image from "next/image";
import { cn } from "@/utils/tw-merge";
import { storageUrl } from "@/utils/storage-url";
import type { FindAllCategoriesQuery } from "@/generated/output";

type Category = FindAllCategoriesQuery["findAllCategories"][number];

interface CategoryGridProps {
  categories: Category[];
  activeCategoryId: string | null;
  onSelect: (id: string | null) => void;
  loading: boolean;
}

export function CategoryGrid({
  categories,
  activeCategoryId,
  onSelect,
  loading,
}: CategoryGridProps) {
  const roots = categories.filter((c) => !c.parentId);

  if (loading && roots.length === 0) {
    return (
      <div className="flex gap-3 overflow-x-auto pb-2 [scrollbar-width:none]">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="h-24 w-20 shrink-0 animate-pulse rounded-2xl bg-muted"
          />
        ))}
      </div>
    );
  }

  const activeParent = roots.find(
    (c) =>
      c.id === activeCategoryId ||
      c.children?.some((ch) => ch.id === activeCategoryId)
  );

  return (
    <div className="space-y-3">
      {/* Root categories — horizontal scroll */}
      <div className="flex gap-2.5 overflow-x-auto pb-1 [scrollbar-width:none]">
        {/* "Все" button */}
        <button
          onClick={() => onSelect(null)}
          className={cn(
            "group flex w-20 shrink-0 flex-col items-center gap-1.5 rounded-2xl p-2.5 transition-all duration-200",
            activeCategoryId === null
              ? "bg-foreground text-background shadow-sm"
              : "bg-muted/60 hover:bg-muted text-foreground"
          )}
        >
          <div
            className={cn(
              "flex h-12 w-12 items-center justify-center rounded-xl text-xl transition-transform duration-200 group-hover:scale-105",
              activeCategoryId === null ? "bg-background/20" : "bg-background"
            )}
          >
            🛍️
          </div>
          <span className="line-clamp-2 text-center text-[11px] font-medium leading-tight">
            Все
          </span>
        </button>

        {roots.map((cat) => {
          const img = storageUrl(cat.imageUrl);
          const isActive =
            activeCategoryId === cat.id ||
            cat.children?.some((c) => c.id === activeCategoryId);

          return (
            <button
              key={cat.id}
              onClick={() => onSelect(cat.id)}
              className={cn(
                "group flex w-20 shrink-0 flex-col items-center gap-1.5 rounded-2xl p-2.5 transition-all duration-200",
                isActive
                  ? "bg-foreground text-background shadow-sm"
                  : "bg-muted/60 hover:bg-muted text-foreground"
              )}
            >
              <div className="relative h-12 w-12 overflow-hidden rounded-xl">
                {img ? (
                  <Image
                    src={img}
                    alt={cat.name}
                    fill
                    sizes="48px"
                    className="object-cover transition-transform duration-200 group-hover:scale-110"
                  />
                ) : (
                  <div
                    className={cn(
                      "flex h-full w-full items-center justify-center text-xl",
                      isActive ? "bg-background/20" : "bg-background"
                    )}
                  >
                    🏷️
                  </div>
                )}
              </div>
              <span className="line-clamp-2 text-center text-[11px] font-medium leading-tight">
                {cat.name}
              </span>
            </button>
          );
        })}
      </div>

      {/* Child chips for active parent */}
      {activeParent && activeParent.children && activeParent.children.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          <button
            onClick={() => onSelect(activeParent.id)}
            className={cn(
              "rounded-full px-3.5 py-1.5 text-xs font-medium transition-all duration-150",
              activeCategoryId === activeParent.id
                ? "bg-foreground text-background"
                : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground"
            )}
          >
            Все в «{activeParent.name}»
          </button>
          {activeParent.children.map((child) => (
            <button
              key={child.id}
              onClick={() => onSelect(child.id)}
              className={cn(
                "rounded-full px-3.5 py-1.5 text-xs font-medium transition-all duration-150",
                activeCategoryId === child.id
                  ? "bg-foreground text-background"
                  : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground"
              )}
            >
              {child.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
