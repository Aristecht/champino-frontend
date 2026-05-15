"use client";

import { useParams, useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import {
  FindProductByIdQuery,
  MediaType,
  useFindAllCategoriesQuery,
  useFindProductByIdQuery,
  useUpdateProductMutation,
} from "@/generated/output";
import {
  ProductForm,
  ProductFormSkeleton,
  type ProductFormValues,
  remoteToMediaItem,
} from "../../../../../components/features/admin/products/ProductForm";

// ── Page wrapper (handles loading) ────────────────────────────────────────────

export default function AdminProductEditPage() {
  const { id } = useParams<{ id: string }>();

  const { data, loading } = useFindProductByIdQuery({
    variables: { id },
    skip: !id,
    fetchPolicy: "network-only",
  });

  if (loading || !data?.findProductById) {
    return <ProductFormSkeleton />;
  }

  return <ProductEditForm product={data.findProductById} />;
}

// ── Form component (initialises state once from product prop) ─────────────────

type Product = NonNullable<FindProductByIdQuery["findProductById"]>;

function ProductEditForm({ product }: { product: Product }) {
  const t = useTranslations("admin");
  const router = useRouter();
  const { id } = useParams<{ id: string }>();

  const { data: categoriesData, loading: loadingCategories } =
    useFindAllCategoriesQuery();
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

  const [updateProduct, { loading: saving }] = useUpdateProductMutation({
    onCompleted: (d) => {
      toast.success(`Товар "${d.updateProduct.name}" обновлён`);
      router.push("/admin/products");
    },
    onError: (e) => toast.error(e.message || "Ошибка при сохранении товара"),
  });

  const initialImages = (product.medias ?? [])
    .filter((m) => m.mediaType === MediaType.Image)
    .map((m) => remoteToMediaItem(m.url));

  const initialVideoMedia = (product.medias ?? []).find(
    (m) => m.mediaType === MediaType.Video
  );
  const initialVideo = initialVideoMedia
    ? {
        localUrl: remoteToMediaItem(initialVideoMedia.url).localUrl,
        file: null,
        remoteUrl: initialVideoMedia.url,
        mediaId: initialVideoMedia.id,
      }
    : null;

  function handleSave(values: ProductFormValues) {
    updateProduct({
      variables: {
        id,
        data: {
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
          Редактировать товар
        </h1>
        {product.category && (
          <p className="text-muted-foreground mt-1 text-sm">
            {product.category.parent
              ? `${product.category.parent.name} / ${product.category.name}`
              : product.category.name}
          </p>
        )}
      </div>

      <ProductForm
        productId={id}
        initialValues={{
          name: product.name ?? "",
          price: String(product.price ?? ""),
          stock: String(product.stock ?? 0),
          description: product.description ?? "",
          categoryId: product.categoryId ?? "",
          discountPercent: product.discountPercent
            ? String(product.discountPercent)
            : "",
          isPublished: true,
          images: initialImages,
          video: initialVideo,
        }}
        categories={categories}
        loadingCategories={loadingCategories}
        saving={saving}
        onSave={handleSave}
      />
    </div>
  );
}
