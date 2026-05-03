"use client";

import Image from "next/image";
import { Skeleton } from "@/components/common/ui/Skeleton";
import { storageUrl } from "@/utils/storage-url";
import type { FindAllCategoriesQuery } from "@/generated/output";

type Category = FindAllCategoriesQuery["findAllCategories"][number];

interface CategoryPickerGridProps {
  roots: Category[];
  catLoading: boolean;
  onCategoryClick: (cat: Category) => void;
}

export function CategoryPickerGrid({
  roots,
  catLoading,
  onCategoryClick,
}: CategoryPickerGridProps) {
  if (catLoading && roots.length === 0) {
    return (
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <Skeleton key={i} className="aspect-square rounded-2xl" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
      {roots.map((cat) => {
        const img = storageUrl(cat.imageUrl);
        return (
          <button
            key={cat.id}
            onClick={() => onCategoryClick(cat)}
            className="group border-border/50 bg-card hover:border-border overflow-hidden rounded-2xl border text-left transition-all hover:shadow-md"
          >
            <div className="bg-muted relative aspect-square w-full overflow-hidden">
              {img ? (
                <Image
                  src={img}
                  alt={cat.name}
                  fill
                  sizes="(max-width: 640px) 50vw, 33vw"
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-5xl opacity-20">
                  🏷️
                </div>
              )}
            </div>
            <div className="p-2.5">
              <p className="text-foreground line-clamp-2 text-sm leading-snug font-semibold">
                {cat.name}
              </p>
              {cat.children && cat.children.length > 0 && (
                <p className="text-muted-foreground mt-0.5 text-[11px]">
                  {cat.children.length} подкатегорий
                </p>
              )}
            </div>
          </button>
        );
      })}
    </div>
  );
}
