"use client";

import { useTranslations } from "next-intl";
import { cn } from "@/utils/tw-merge";
import { INPUT_CLS, SELECT_CLS, type CatForm } from "./categoryTypes";
import { ImagePicker } from "./ImagePicker";

interface CategoryFormFieldsProps {
  form: CatForm;
  rootCats: { id: string; name: string }[];
  excludeId?: string;
  onChange: (
    k: keyof CatForm
  ) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  isRoot: boolean;
  onIsRootChange?: (v: boolean) => void;
  imageVal: File | string | null;
  onImageChange: (v: File | null) => void;
}

export function CategoryFormFields({
  form,
  rootCats,
  excludeId,
  onChange,
  isRoot,
  onIsRootChange,
  imageVal,
  onImageChange,
}: CategoryFormFieldsProps) {
  const t = useTranslations("admin");

  return (
    <div className="space-y-4">
      <ImagePicker value={imageVal} onChange={onImageChange} />

      {onIsRootChange && (
        <div className="border-border flex items-center justify-between rounded-lg border px-3.5 py-3">
          <div>
            <p className="text-foreground text-sm font-medium">Подкатегория</p>
            <p className="text-muted-foreground text-xs">
              Прикрепить к родительской категории
            </p>
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={!isRoot}
            onClick={() => onIsRootChange(!isRoot)}
            className={cn(
              "focus-visible:ring-primary/50 relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full transition-colors focus-visible:ring-2 focus-visible:outline-none",
              !isRoot ? "bg-primary" : "bg-input"
            )}
          >
            <span
              className={cn(
                "inline-block h-4 w-4 rounded-full bg-white shadow-sm transition-transform",
                !isRoot ? "translate-x-6" : "translate-x-1"
              )}
            />
          </button>
        </div>
      )}

      <div className="space-y-1.5">
        <label className="text-foreground text-sm font-medium">
          {t("name")} <span className="text-red-500">*</span>
        </label>
        <input
          value={form.name}
          onChange={onChange("name")}
          placeholder="Корма для кошек"
          required
          className={INPUT_CLS}
        />
      </div>

      <div className="space-y-1.5">
        <label className="text-foreground text-sm font-medium">
          Slug{" "}
          <span className="text-muted-foreground text-xs font-normal">
            (необязательно)
          </span>
        </label>
        <input
          value={form.slug}
          onChange={onChange("slug")}
          placeholder="cat-food"
          className={INPUT_CLS}
        />
        <p className="text-muted-foreground text-xs">Только строчные буквы</p>
      </div>

      {!isRoot && (
        <div className="space-y-1.5">
          <label className="text-foreground text-sm font-medium">
            Родительская категория{" "}
            <span className="text-muted-foreground text-xs font-normal">
              (необязательно)
            </span>
          </label>
          <select
            value={form.parentId}
            onChange={onChange("parentId")}
            className={SELECT_CLS}
          >
            <option value="">— Корневая категория —</option>
            {rootCats
              .filter((c) => c.id !== excludeId)
              .map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
          </select>
        </div>
      )}
    </div>
  );
}
