"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import {
  useFindAllCategoriesQuery,
  useCreateDraftProductMutation,
  useCreateProductMutation,
} from "@/generated/output";
import {
  ProductForm,
  type ProductFormValues,
} from "../../../../../components/features/admin/products/ProductForm";

export default function AdminProductsNewPage() {
  const t = useTranslations("admin");
  const router = useRouter();

  const [draftId, setDraftId] = useState<string | null>(null);
  const draftCreated = useRef(false);

  const { data: categoriesData, loading: loadingCategories } =
    useFindAllCategoriesQuery();

  const [createDraft, { loading: creatingDraft }] =
    useCreateDraftProductMutation({
      onCompleted: (d) => setDraftId(d.createDraftProduct.id),
      onError: () => toast.error("Не удалось инициализировать черновик"),
    });

  // Guard against React 18 StrictMode double-invocation of effects
  useEffect(() => {
    if (draftCreated.current) return;
    draftCreated.current = true;
    createDraft();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [createProduct, { loading: saving }] = useCreateProductMutation({
    onCompleted: (d) => {
      toast.success(`Товар "${d.createProduct.name}" создан`);
      router.push("/admin/products");
    },
    onError: (e) => toast.error(e.message || "Ошибка при создании товара"),
  });

  const categories = (categoriesData?.findAllCategories ?? []).flatMap(
    (root) => [
      { id: root.id, name: root.name },
      ...(root.children ?? []).map((child) => ({
        id: child.id,
        name: child.name,
        parentName: root.name,
      })),
    ]
  );

  function handleSave(values: ProductFormValues) {
    if (!draftId) return;
    createProduct({
      variables: {
        data: {
          draftId,
          name: values.name,
          price: values.price,
          stock: values.stock,
          categoryId: values.categoryId,
          description: values.description,
          discountPercent: values.discountPercent,
          isPublished: values.isPublished,
        },
      },
    });
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center gap-3">
        <Link
          href="/admin/products"
          className="text-muted-foreground hover:text-foreground flex items-center gap-1.5 text-sm transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          {t("products")}
        </Link>
      </div>

      <div>
        <h1 className="text-foreground text-xl font-semibold">
          {t("addProduct")}
        </h1>
        {creatingDraft && (
          <p className="text-muted-foreground mt-0.5 flex items-center gap-1.5 text-xs">
            <Loader2 className="h-3 w-3 animate-spin" /> Инициализация
            черновика...
          </p>
        )}
      </div>

      <ProductForm
        productId={draftId}
        categories={categories}
        loadingCategories={loadingCategories}
        saving={saving}
        onSave={handleSave}
      />
    </div>
  );
}
