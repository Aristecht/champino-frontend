"use client";

import Image from "next/image";
import { ChevronRight, PawPrint } from "lucide-react";
import { storageUrl } from "@/utils/storage-url";
import type { FindAllCategoriesQuery } from "@/generated/output";

type Category = FindAllCategoriesQuery["findAllCategories"][number];
type ChildCat = NonNullable<Category["children"]>[number];

interface SubcategoryPickerProps {
  selectedParent: Category;
  onChildClick: (child: ChildCat) => void;
}

export function SubcategoryPicker({
  selectedParent,
  onChildClick,
}: SubcategoryPickerProps) {
  const parentImg = storageUrl(selectedParent.imageUrl);

  return (
    <div className="space-y-3">
      {/* Parent info card */}
      <div className="border-border/50 bg-card flex items-center gap-3 rounded-2xl border p-3">
        {parentImg && (
          <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl">
            <Image
              src={parentImg}
              alt={selectedParent.name}
              fill
              sizes="56px"
              className="object-cover"
            />
          </div>
        )}
        <div className="flex-1">
          <p className="text-foreground font-semibold">{selectedParent.name}</p>
          {selectedParent.children && (
            <p className="text-muted-foreground text-xs">
              {selectedParent.children.length} подкатегорий
            </p>
          )}
        </div>
      </div>

      {/* Subcategory list */}
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        {selectedParent.children?.map((child) => {
          const img = storageUrl(child.imageUrl);
          return (
            <button
              key={child.id}
              onClick={() => onChildClick(child)}
              className="group border-border/50 bg-card hover:border-border hover:bg-muted/40 flex items-center gap-3 rounded-xl border p-3 text-left transition-all"
            >
              {img ? (
                <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-lg">
                  <Image
                    src={img}
                    alt={child.name}
                    fill
                    sizes="44px"
                    className="object-cover"
                  />
                </div>
              ) : (
                <PawPrint className="text-primary" width={25} height={25} />
              )}
              <span className="text-foreground line-clamp-2 flex-1 text-sm leading-tight font-medium">
                {child.name}
              </span>
              <ChevronRight className="text-muted-foreground h-4 w-4 shrink-0 opacity-0 transition-opacity group-hover:opacity-100" />
            </button>
          );
        })}
      </div>
    </div>
  );
}
