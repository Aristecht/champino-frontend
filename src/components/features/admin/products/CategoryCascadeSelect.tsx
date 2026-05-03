"use client";

import { useState, useEffect, useRef } from "react";
import { ChevronDown, Check } from "lucide-react";
import { type Category } from "./productFormHelpers";

export interface SelectOption {
  value: string;
  label: string;
}

export interface CustomSelectProps {
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  placeholder?: string;
  disabled?: boolean;
}

export function CustomSelect({
  value,
  onChange,
  options,
  placeholder = "— Выберите —",
  disabled,
}: CustomSelectProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const selected = options.find((o) => o.value === value);

  useEffect(() => {
    function onClickOut(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onClickOut);
    return () => document.removeEventListener("mousedown", onClickOut);
  }, []);

  return (
    <div ref={ref} className="relative min-w-0 flex-1">
      <button
        type="button"
        onClick={() => !disabled && setOpen((o) => !o)}
        disabled={disabled}
        className="border-input bg-background text-foreground focus:ring-primary/20 flex w-full items-center justify-between rounded-md border px-3 py-2 text-sm transition-colors outline-none focus:ring-2 disabled:cursor-not-allowed disabled:opacity-50"
      >
        <span
          className={
            selected ? "text-foreground" : "text-muted-foreground truncate"
          }
        >
          {selected?.label ?? placeholder}
        </span>
        <ChevronDown
          className={`text-muted-foreground ml-2 h-4 w-4 shrink-0 transition-transform ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {open && (
        <div className="border-border bg-popover text-popover-foreground absolute z-50 mt-1 w-full rounded-md border shadow-lg">
          <div className="max-h-52 overflow-y-auto py-1">
            {options.length === 0 ? (
              <p className="text-muted-foreground px-3 py-2 text-sm">
                Нет вариантов
              </p>
            ) : (
              options.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => {
                    onChange(opt.value);
                    setOpen(false);
                  }}
                  className="hover:bg-accent flex w-full items-center justify-between px-3 py-2 text-left text-sm"
                >
                  <span className="truncate">{opt.label}</span>
                  {opt.value === value && (
                    <Check className="text-primary ml-2 h-3.5 w-3.5 shrink-0" />
                  )}
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ── CategoryCascadeSelect ──────────────────────────────────────────────────────

interface Props {
  categoryId: string;
  setCategoryId: (v: string) => void;
  categories: Category[];
}

export function CategoryCascadeSelect({
  categoryId,
  setCategoryId,
  categories,
}: Props) {
  const roots = categories.filter((c) => !c.parentName);

  const byParent = new Map<string, Category[]>();
  categories
    .filter((c) => c.parentName)
    .forEach((c) => {
      const key = c.parentName!;
      if (!byParent.has(key)) byParent.set(key, []);
      byParent.get(key)!.push(c);
    });

  const [selectedRootId, setSelectedRootId] = useState<string>(() =>
    deriveRootId(categoryId, roots, byParent)
  );

  useEffect(() => {
    if (roots.length === 0) return;
    setSelectedRootId(deriveRootId(categoryId, roots, byParent));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categories.length]);

  const selectedRootName = roots.find((r) => r.id === selectedRootId)?.name;
  const children = selectedRootName
    ? (byParent.get(selectedRootName) ?? [])
    : [];
  const hasChildren = children.length > 0;

  function handleRootChange(rootId: string) {
    setSelectedRootId(rootId);
    const rootName = roots.find((r) => r.id === rootId)?.name;
    const kids = rootName ? (byParent.get(rootName) ?? []) : [];
    setCategoryId(kids.length > 0 ? "" : rootId);
  }

  const rootOptions = roots.map((r) => ({ value: r.id, label: r.name }));
  const childOptions = children.map((c) => ({ value: c.id, label: c.name }));

  return (
    <div className="flex gap-2">
      <CustomSelect
        value={selectedRootId}
        onChange={handleRootChange}
        options={rootOptions}
        placeholder="— Категория —"
      />
      {hasChildren && (
        <CustomSelect
          value={categoryId}
          onChange={setCategoryId}
          options={childOptions}
          placeholder="— Подкатегория —"
        />
      )}
    </div>
  );
}

// ── helpers ────────────────────────────────────────────────────────────────────

function deriveRootId(
  categoryId: string,
  roots: Category[],
  byParent: Map<string, Category[]>
): string {
  if (!categoryId) return "";
  for (const [parentName, children] of byParent) {
    if (children.some((c) => c.id === categoryId)) {
      return roots.find((r) => r.name === parentName)?.id ?? "";
    }
  }
  return roots.find((r) => r.id === categoryId)?.id ?? "";
}
