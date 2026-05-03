"use client";

import { useTranslations } from "next-intl";
import { Skeleton } from "@/components/common/ui/Skeleton";
import { INPUT_CLS, type Category } from "./productFormHelpers";
import { CategoryCascadeSelect } from "./CategoryCascadeSelect";

interface ProductFormFieldsProps {
  name: string;
  setName: (v: string) => void;
  price: string;
  setPrice: (v: string) => void;
  stock: string;
  setStock: (v: string) => void;
  description: string;
  setDescription: (v: string) => void;
  categoryId: string;
  setCategoryId: (v: string) => void;
  discountPercent: string;
  setDiscountPercent: (v: string) => void;
  categories: Category[];
  loadingCategories: boolean;
}

export function ProductFormFields({
  name,
  setName,
  price,
  setPrice,
  stock,
  setStock,
  description,
  setDescription,
  categoryId,
  setCategoryId,
  discountPercent,
  setDiscountPercent,
  categories,
  loadingCategories,
}: ProductFormFieldsProps) {
  const t = useTranslations("admin");

  return (
    <div className="bg-card border-border rounded-lg border p-5">
      <h2 className="text-foreground mb-4 text-sm font-semibold">
        Основная информация
      </h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-1.5 sm:col-span-2">
          <label className="text-foreground text-sm font-medium">
            {t("name")} <span className="text-red-500">*</span>
          </label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Корм Royal Canin Adult 4 кг"
            required
            className={INPUT_CLS}
          />
        </div>

        <div className="space-y-1.5 sm:col-span-2">
          <label className="text-foreground text-sm font-medium">
            {t("category")} <span className="text-red-500">*</span>
          </label>
          {loadingCategories ? (
            <div className="flex gap-2">
              <Skeleton className="h-9 flex-1" />
              <Skeleton className="h-9 flex-1" />
            </div>
          ) : (
            <CategoryCascadeSelect
              categoryId={categoryId}
              setCategoryId={setCategoryId}
              categories={categories}
            />
          )}
        </div>

        <div className="space-y-1.5">
          <label className="text-foreground text-sm font-medium">
            {t("price")} (KZT) <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            min="0"
            step="0.01"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="999"
            required
            className={INPUT_CLS}
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-foreground text-sm font-medium">
            {t("stock")}
          </label>
          <input
            type="number"
            min="0"
            value={stock}
            onChange={(e) => setStock(e.target.value)}
            placeholder="0"
            className={INPUT_CLS}
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-foreground text-sm font-medium">
            Скидка (%)
          </label>
          <input
            type="number"
            min="0"
            max="100"
            value={discountPercent}
            onChange={(e) => setDiscountPercent(e.target.value)}
            placeholder="0"
            className={INPUT_CLS}
          />
        </div>

        <div className="space-y-1.5 sm:col-span-2">
          <label className="text-foreground text-sm font-medium">
            {t("description")}
          </label>
          <textarea
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Описание товара..."
            className={`${INPUT_CLS} resize-none`}
          />
        </div>
      </div>
    </div>
  );
}
