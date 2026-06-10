"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { storageUrl } from "@/utils/storage-url";
import { Switcher } from "@/components/common/ui/Switcher";
import { Skeleton } from "@/components/common/ui/Skeleton";
import { ProductFormFields } from "./ProductFormFields";
import { ProductFormImages } from "./ProductFormImages";
import { ProductFormVideo } from "./ProductFormVideo";
import {
  uploadImages,
  uploadVideo,
  deleteMedia,
  type MediaItem,
  type ProductFormProps,
} from "./productFormHelpers";

// Re-export everything consumers import from this file
export {
  INPUT_CLS,
  uploadImages,
  uploadVideo,
  deleteMedia,
  remoteToMediaItem,
} from "./productFormHelpers";
export type {
  MediaItem,
  ProductFormValues,
  ProductFormProps,
} from "./productFormHelpers";

// ── Loading skeleton (re-used by the edit-page wrapper) ───────────────────────

export function ProductFormSkeleton() {
  return (
    <div className="space-y-5 p-6">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="bg-card border-border rounded-lg border p-5">
          <Skeleton className="mb-4 h-4 w-40" />
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, j) => (
              <Skeleton key={j} className="h-9 w-full" />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

// ── Shared form component ──────────────────────────────────────────────────────

export function ProductForm({
  productId,
  initialValues,
  categories,
  loadingCategories,
  saving,
  onSave,
}: ProductFormProps) {
  const t = useTranslations("admin");

  const [name, setName] = useState(initialValues?.name ?? "");
  const [price, setPrice] = useState(initialValues?.price ?? "");
  const [stock, setStock] = useState(initialValues?.stock ?? "0");
  const [description, setDescription] = useState(
    initialValues?.description ?? ""
  );
  const [categoryId, setCategoryId] = useState(initialValues?.categoryId ?? "");
  const [discountPercent, setDiscountPercent] = useState(
    initialValues?.discountPercent ?? ""
  );
  const [isPublished, setIsPublished] = useState(
    initialValues?.isPublished ?? true
  );
  const [images, setImages] = useState<MediaItem[]>(
    initialValues?.images ?? []
  );
  const [video, setVideo] = useState<MediaItem | null>(
    initialValues?.video ?? null
  );
  const [imageMediaIdsToDelete, setImageMediaIdsToDelete] = useState<string[]>(
    []
  );
  const [videoMediaIdToDelete, setVideoMediaIdToDelete] = useState<
    string | null
  >(null);
  const [submitting, setSubmitting] = useState(false);

  function addImages(files: FileList | null) {
    if (!files) return;
    const remaining = 10 - images.length;
    const toAdd = Array.from(files).slice(0, remaining);
    if (toAdd.length < files.length) toast.warning("Максимум 10 изображений");
    setImages((prev) => [
      ...prev,
      ...toAdd.map((f) => ({ localUrl: URL.createObjectURL(f), file: f })),
    ]);
  }

  function removeImage(idx: number) {
    setImages((prev) => {
      const next = [...prev];
      if (next[idx].file) URL.revokeObjectURL(next[idx].localUrl);
      // Track remote image for deletion on submit
      if (next[idx].mediaId) {
        setImageMediaIdsToDelete((ids) => [...ids, next[idx].mediaId!]);
      }
      next.splice(idx, 1);
      return next;
    });
  }

  function reorderImages(next: MediaItem[]) {
    setImages(next);
  }

  function addVideo(files: FileList | null) {
    if (!files || !files[0]) return;
    if (video?.file) URL.revokeObjectURL(video.localUrl);
    // Track remote video for deletion on submit
    if (video?.mediaId) setVideoMediaIdToDelete(video.mediaId);
    setVideo({ localUrl: URL.createObjectURL(files[0]), file: files[0] });
  }

  function removeVideo() {
    if (video?.file) URL.revokeObjectURL(video.localUrl);
    if (video?.mediaId) setVideoMediaIdToDelete(video.mediaId);
    setVideo(null);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (submitting || saving || !productId) return;
    setSubmitting(true);

    if (!name.trim()) {
      toast.error("Введите название товара");
      setSubmitting(false);
      return;
    }
    if (!price || isNaN(Number(price))) {
      toast.error("Введите корректную цену");
      setSubmitting(false);
      return;
    }
    if (!categoryId) {
      toast.error("Выберите категорию");
      setSubmitting(false);
      return;
    }

    const newImageFiles = images
      .filter((img) => img.file)
      .map((img) => img.file!);

    let currentImages = images;
    if (newImageFiles.length > 0) {
      try {
        const uploadedUrls = await uploadImages(productId, newImageFiles);

        let uploadedIndex = 0;
        currentImages = images.map((img) => {
          if (!img.file) return img;
          const uploadedUrl = uploadedUrls[uploadedIndex++];
          return {
            localUrl: storageUrl(uploadedUrl) ?? uploadedUrl,
            file: null,
            remoteUrl: uploadedUrl,
          };
        });
        setImages(currentImages);
      } catch {
        toast.error("Ошибка при загрузке изображений");
        setSubmitting(false);
        return;
      }
    }

    // Delete removed images
    if (imageMediaIdsToDelete.length > 0) {
      try {
        await Promise.all(
          imageMediaIdsToDelete.map((mediaId) =>
            deleteMedia(productId, mediaId)
          )
        );
        setImageMediaIdsToDelete([]);
      } catch {
        toast.error("Ошибка при удалении изображений");
        setSubmitting(false);
        return;
      }
    }

    if (video?.file) {
      try {
        // Delete old remote video first if replacing
        if (videoMediaIdToDelete) {
          await deleteMedia(productId, videoMediaIdToDelete);
          setVideoMediaIdToDelete(null);
        }
        await uploadVideo(productId, video.file);
      } catch {
        toast.error("Ошибка при загрузке видео");
        setSubmitting(false);
        return;
      }
    } else if (videoMediaIdToDelete) {
      // User removed the video without replacing
      try {
        await deleteMedia(productId, videoMediaIdToDelete);
        setVideoMediaIdToDelete(null);
      } catch {
        toast.error("Ошибка при удалении видео");
        setSubmitting(false);
        return;
      }
    }

    onSave({
      name: name.trim(),
      price: Number(price),
      stock: Number(stock) || 0,
      categoryId,
      description: description.trim() || undefined,
      discountPercent: discountPercent ? Number(discountPercent) : undefined,
      isPublished,
      images: currentImages
        .map((img) => img.remoteUrl)
        .filter((url): url is string => Boolean(url)),
    });
    setSubmitting(false);
  }

  const isDisabled = submitting || saving || !productId;

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <ProductFormFields
        name={name}
        setName={setName}
        price={price}
        setPrice={setPrice}
        stock={stock}
        setStock={setStock}
        description={description}
        setDescription={setDescription}
        categoryId={categoryId}
        setCategoryId={setCategoryId}
        discountPercent={discountPercent}
        setDiscountPercent={setDiscountPercent}
        categories={categories}
        loadingCategories={loadingCategories}
      />

      <ProductFormImages
        images={images}
        onAddFiles={addImages}
        onRemove={removeImage}
        onReorder={reorderImages}
      />

      <ProductFormVideo
        video={video}
        onAddFile={addVideo}
        onRemove={removeVideo}
      />
      {/* ── Publish toggle ── */}
      <div className="bg-card border-border flex items-center justify-between rounded-lg border p-5">
        <div>
          <p className="text-foreground text-sm font-medium">Опубликовать</p>
          <p className="text-muted-foreground text-xs">
            Если выключено — товар сохраняется как черновик
          </p>
        </div>
        <Switcher isActive={isPublished} setIsActive={setIsPublished} />
      </div>

      {/* ── Actions ── */}
      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={isDisabled}
          className="bg-primary text-primary-foreground hover:bg-primary/90 inline-flex items-center gap-2 rounded-md px-5 py-2 text-sm font-medium transition-colors disabled:opacity-50"
        >
          {(submitting || saving) && (
            <Loader2 className="h-4 w-4 animate-spin" />
          )}
          {t("save")}
        </button>
        <Link
          href="/admin/products"
          className="text-muted-foreground hover:text-foreground text-sm transition-colors"
        >
          Отмена
        </Link>
      </div>
    </form>
  );
}
