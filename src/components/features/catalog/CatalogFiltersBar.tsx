"use client";

import { Dispatch, SetStateAction } from "react";
import { SlidersHorizontal, X, ChevronDown, ArrowUpDown } from "lucide-react";
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

export const SORT_OPTIONS = [
  { label: "Новинки", sortBy: "createdAt", sortOrder: "desc" },
  { label: "Цена: по возрастанию", sortBy: "price", sortOrder: "asc" },
  { label: "Цена: по убыванию", sortBy: "price", sortOrder: "desc" },
] as const;

export type SortOption = (typeof SORT_OPTIONS)[number];
export type ActiveFilter = { key: string; label: string; onRemove: () => void };

interface CatalogFiltersBarProps {
  sortOption: SortOption;
  setSortOption: (opt: SortOption) => void;
  showFilters: boolean;
  setShowFilters: Dispatch<SetStateAction<boolean>>;
  minPrice: string;
  setMinPrice: (v: string) => void;
  maxPrice: string;
  setMaxPrice: (v: string) => void;
  inStock: boolean;
  setInStock: Dispatch<SetStateAction<boolean>>;
  activeFilters: ActiveFilter[];
  hasActiveFilters: boolean;
  clearAllFilters: () => void;
}

export function CatalogFiltersBar({
  sortOption,
  setSortOption,
  showFilters,
  setShowFilters,
  minPrice,
  setMinPrice,
  maxPrice,
  setMaxPrice,
  inStock,
  setInStock,
  activeFilters,
  hasActiveFilters,
  clearAllFilters,
}: CatalogFiltersBarProps) {
  return (
    <div className="space-y-3">
      {/* Sort + Filters toggle */}
      <div className="flex flex-wrap items-center gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="h-9 gap-1.5">
              <ArrowUpDown className="h-3.5 w-3.5" />
              <span>{sortOption.label}</span>
              <ChevronDown className="h-3.5 w-3.5 opacity-50" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-44">
            {SORT_OPTIONS.map((opt) => (
              <DropdownMenuItem
                key={opt.label}
                onClick={() => setSortOption(opt)}
                className={cn(
                  sortOption.label === opt.label && "font-semibold"
                )}
              >
                {opt.label}
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
          Фильтры
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
            <span className="text-sm font-semibold">Фильтры</span>
            {hasActiveFilters && (
              <button
                onClick={clearAllFilters}
                className="text-muted-foreground hover:text-foreground text-xs transition-colors"
              >
                Сбросить все
              </button>
            )}
          </div>

          <div className="space-y-2">
            <p className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
              Цена, ₸
            </p>
            <div className="flex items-center gap-2">
              <Input
                variant="filled"
                inputSize="sm"
                type="number"
                placeholder="От"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                className="flex-1"
              />
              <span className="text-muted-foreground shrink-0 text-sm">—</span>
              <Input
                variant="filled"
                inputSize="sm"
                type="number"
                placeholder="До"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className="flex-1"
              />
            </div>
          </div>

          <label className="flex cursor-pointer items-center gap-3 select-none">
            <Switcher isActive={inStock} setIsActive={setInStock} />
            <span className="text-sm">Только в наличии</span>
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
  );
}
