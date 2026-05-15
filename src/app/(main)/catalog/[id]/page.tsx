"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Package } from "lucide-react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { toast } from "sonner";
import {
  Role,
  useCreateReviewMutation,
  useDeleteReviewMutation,
  useFindAllUsersQuery,
  useFindProductByIdQuery,
  useFindProfileQuery,
  useGetMyOrdersQuery,
  useGetProductReviewsQuery,
} from "@/generated/output";
import { authStore } from "@/store/auth/auth.store";
import { cartStore } from "@/store/cart/cart.store";
import { storageUrl } from "@/utils/storage-url";
import { ProductMediaGallery } from "@/components/features/catalog/product-details/ProductMediaGallery";
import { ProductReviewsSection } from "@/components/features/catalog/product-details/ProductReviewsSection";
import { Separator } from "@/components/common/ui/Separator";
import { ProductInfoPanel } from "@/components/features/catalog/product-details/ProductInfoPanel";

function fmtMoney(n: number, locale: string) {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: "KZT",
    maximumFractionDigits: 0,
  }).format(n);
}

export default function ProductPage() {
  const t = useTranslations("product");
  const locale = useLocale();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { id } = useParams<{ id: string }>();
  const isAuthenticated = authStore((s) => s.isAuthenticated);
  const [mediaIdx, setMediaIdx] = useState(0);

  const { data, loading, error } = useFindProductByIdQuery({
    variables: { id },
  });
  const { data: profileData } = useFindProfileQuery({ skip: !isAuthenticated });
  const {
    data: reviewsData,
    loading: loadingReviews,
    refetch: refetchReviews,
  } = useGetProductReviewsQuery({ variables: { productId: id } });
  const { data: myOrdersData } = useGetMyOrdersQuery({
    variables: { filter: { limit: 100, page: 1 } },
    skip: !isAuthenticated,
  });

  const role = profileData?.findProfile?.role;
  const canModerateReviews = role === Role.Admin || role === Role.Manager;
  const { data: usersData } = useFindAllUsersQuery({
    skip: !canModerateReviews,
  });
  const usernameByUserId = Object.fromEntries(
    (usersData?.findAllUser ?? []).map((u) => [u.id, u.username])
  );

  const [createReview, { loading: creatingReview }] = useCreateReviewMutation();
  const [deleteReview, { loading: deletingReview }] = useDeleteReviewMutation();

  const items = cartStore((s) => s.items);
  const addItem = cartStore((s) => s.addItem);
  const removeItem = cartStore((s) => s.removeItem);
  const setQuantity = cartStore((s) => s.setQuantity);
  const inCart = isAuthenticated
    ? (items.find((i) => i.productId === id) ?? null)
    : null;

  if (loading)
    return (
      <div className="container mx-auto max-w-5xl px-4 py-8">
        <div className="bg-muted h-64 animate-pulse rounded-2xl" />
      </div>
    );
  if (error || !data?.findProductById)
    return (
      <div className="flex flex-col items-center gap-3 py-24 text-center">
        <Package className="text-muted-foreground h-12 w-12 opacity-30" />
        <p className="text-foreground text-sm font-medium">{t("notFound")}</p>
        <Link href="/catalog" className="text-primary text-sm underline">
          {t("backToCatalog")}
        </Link>
      </div>
    );

  const p = data.findProductById;
  const hasDiscount = (p.discountPercent ?? 0) > 0;
  const finalPrice = hasDiscount
    ? (p.price ?? 0) * (1 - (p.discountPercent ?? 0) / 100)
    : (p.price ?? 0);
  const hasPurchasedProduct =
    myOrdersData?.getMyOrders?.data?.some((o) =>
      o.items.some((it) => it.product?.id === id)
    ) ?? false;

  const handleBack = () => {
    const from = searchParams.get("from");
    if (from === "catalog") {
      const params = new URLSearchParams();
      ["parentId", "childId", "q"].forEach((k) => {
        const v = searchParams.get(k);
        if (v) params.set(k, v);
      });
      const query = params.toString();
      router.push(query ? `/catalog?${query}` : "/catalog");
      return;
    }
    if (window.history.length > 1) router.back();
    else router.push("/catalog");
  };

  return (
    <div className="container mx-auto max-w-5xl px-4 py-6 sm:py-8">
      <button
        type="button"
        onClick={handleBack}
        className="text-muted-foreground hover:text-foreground mb-6 inline-flex items-center gap-1.5 text-sm transition-colors"
      >
        <ArrowLeft className="h-4 w-4" /> {t("back")}
      </button>
      <div className="grid gap-2 md:grid-cols-[1.05fr_0.95fr] md:gap-10">
        <ProductMediaGallery
          medias={p.medias ?? []}
          mediaIdx={mediaIdx}
          onMediaChange={setMediaIdx}
          productName={p.name ?? t("defaultName")}
          hasDiscount={hasDiscount}
          discountPercent={p.discountPercent ?? 0}
        />
        <ProductInfoPanel
          categoryName={p.category?.parent?.name || p.category?.name}
          subCategoryName={p.category?.parent ? p.category?.name : undefined}
          productName={p.name ?? t("defaultName")}
          finalPriceText={fmtMoney(finalPrice, locale)}
          oldPriceText={hasDiscount ? fmtMoney(p.price ?? 0, locale) : null}
          outOfStock={p.stock === 0}
          stock={p.stock}
          description={p.description}
          inCartQty={inCart?.quantity ?? null}
          isAuthenticated={isAuthenticated}
          onAdd={() => {
            if (p.stock === 0) return;
            if (!isAuthenticated) {
              toast.info("Войдите в аккаунт, чтобы добавлять товары в корзину");
              router.push("/account/login");
              return;
            }
            addItem({
              productId: p.id,
              name: p.name ?? t("defaultName"),
              price: finalPrice,
              imageUrl: storageUrl(
                (p.medias ?? []).find((m) => m.mediaType === "IMAGE")?.url ??
                  null
              ),
              stock: p.stock,
            });
            toast.success(t("addedToCart"));
          }}
          onInc={() =>
            inCart && setQuantity(p.id, Math.min(p.stock, inCart.quantity + 1))
          }
          onDec={() =>
            inCart &&
            (inCart.quantity <= 1
              ? removeItem(p.id)
              : setQuantity(p.id, inCart.quantity - 1))
          }
        />
      </div>
      <div className="my-4">
        <Separator />
      </div>
      <ProductReviewsSection
        reviews={reviewsData?.getProductReviews?.data ?? []}
        avgRating={reviewsData?.getProductReviews?.avgRating ?? 0}
        total={reviewsData?.getProductReviews?.total ?? 0}
        loading={loadingReviews}
        canWriteReview={hasPurchasedProduct}
        canModerateReviews={canModerateReviews}
        creatingReview={creatingReview}
        deletingReview={deletingReview}
        currentUserId={profileData?.findProfile?.id}
        usernameByUserId={usernameByUserId}
        onCreateReview={async ({ rating, title, text }) => {
          if (!text.trim()) return toast.error(t("reviews.enterText"));
          try {
            await createReview({
              variables: {
                data: {
                  productId: id,
                  rating,
                  title: title.trim() || undefined,
                  text: text.trim(),
                },
              },
            });
            await refetchReviews();
            toast.success(t("reviews.sent"));
          } catch {
            toast.error(t("reviews.sendError"));
          }
        }}
        onDeleteReview={async (reviewId) => {
          if (!canModerateReviews) return;
          try {
            await deleteReview({ variables: { reviewId } });
            await refetchReviews();
            toast.success(t("reviews.deleted"));
          } catch {
            toast.error(t("reviews.deleteError"));
          }
        }}
      />
    </div>
  );
}
