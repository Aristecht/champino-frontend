"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Loader2, ChevronLeft, ImagePlus } from "lucide-react";
import type { PostFormValues } from "@/app/(admin)/admin/news/page";
import { Switcher } from "@/components/common/ui/Switcher";
import { storageUrl } from "@/utils/storage-url";

interface Props {
  initial?: PostFormValues;
  saving: boolean;
  onSubmit: (values: PostFormValues, coverFile: File | null) => void;
  onCancel: () => void;
}

const EMPTY: PostFormValues = {
  title: "",
  slug: "",
  excerpt: "",
  body: "",
  coverImage: "",
  tags: "",
  isPublished: false,
};

function slugify(v: string) {
  return v
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .slice(0, 80);
}

export function AdminNewsForm({ initial, saving, onSubmit, onCancel }: Props) {
  const t = useTranslations("admin");
  const [values, setValues] = useState<PostFormValues>(initial ?? EMPTY);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [localPreview, setLocalPreview] = useState<string | null>(null);
  const publishLabel = values.isPublished ? t("postPublished") : t("postDraft");
  const previewImage =
    localPreview ?? storageUrl(values.coverImage) ?? values.coverImage;

  useEffect(() => {
    if (!coverFile) {
      setLocalPreview(null);
      return;
    }

    const url = URL.createObjectURL(coverFile);
    setLocalPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [coverFile]);

  function set(key: keyof PostFormValues, value: string | boolean) {
    setValues((prev) => ({ ...prev, [key]: value }));
  }

  function handleTitleChange(v: string) {
    set("title", v);
    if (!initial) set("slug", slugify(v));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSubmit(values, coverFile);
  }

  function handleCoverFile(file: File | null) {
    setCoverFile(file);
    if (!file) {
      set("coverImage", "");
      return;
    }

    set("coverImage", "");
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center gap-3">
        <button
          onClick={onCancel}
          className="text-muted-foreground hover:text-foreground flex items-center gap-1 text-sm transition-colors"
        >
          <ChevronLeft className="h-4 w-4" />
          {t("backToShop")}
        </button>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-card border-border/50 space-y-5 rounded-2xl border p-6"
      >
        <h2 className="text-foreground text-lg font-bold">
          {initial ? t("editPost") : t("addPost")}
        </h2>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="space-y-1.5">
            <span className="text-foreground text-xs font-medium">
              {t("postTitle")} *
            </span>
            <input
              required
              value={values.title}
              onChange={(e) => handleTitleChange(e.target.value)}
              className="border-border bg-background text-foreground focus:ring-primary/30 w-full rounded-xl border px-3 py-2 text-sm outline-none focus:ring-2"
            />
          </label>
          <label className="space-y-1.5">
            <span className="text-foreground text-xs font-medium">
              {t("postSlug")} *
            </span>
            <input
              required
              value={values.slug}
              onChange={(e) => set("slug", e.target.value)}
              className="border-border bg-background text-foreground focus:ring-primary/30 w-full rounded-xl border px-3 py-2 text-sm outline-none focus:ring-2"
            />
          </label>
        </div>

        <label className="block space-y-1.5">
          <span className="text-foreground text-xs font-medium">
            {t("postExcerpt")}
          </span>
          <input
            value={values.excerpt}
            onChange={(e) => set("excerpt", e.target.value)}
            className="border-border bg-background text-foreground focus:ring-primary/30 w-full rounded-xl border px-3 py-2 text-sm outline-none focus:ring-2"
          />
        </label>

        <div className="space-y-2">
          <span className="text-foreground text-xs font-medium">
            {t("postCoverImage")}
          </span>

          <label className="border-border bg-background hover:bg-muted/40 flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed px-4 py-3 text-sm transition-colors">
            <ImagePlus className="h-4 w-4" />
            {t("uploadImage")}
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => handleCoverFile(e.target.files?.[0] ?? null)}
            />
          </label>

          <input
            value={values.coverImage}
            onChange={(e) => {
              setCoverFile(null);
              set("coverImage", e.target.value);
            }}
            placeholder="https://..."
            className="border-border bg-background text-foreground focus:ring-primary/30 w-full rounded-xl border px-3 py-2 text-sm outline-none focus:ring-2"
          />

          {previewImage && (
            <div className="border-border/60 overflow-hidden rounded-xl border">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={previewImage}
                alt="cover"
                className="h-40 w-full object-cover"
              />
            </div>
          )}
        </div>

        <label className="block space-y-1.5">
          <span className="text-foreground text-xs font-medium">
            {t("postBody")} *
          </span>
          <textarea
            required
            rows={8}
            value={values.body}
            onChange={(e) => set("body", e.target.value)}
            className="border-border bg-background text-foreground focus:ring-primary/30 w-full resize-y rounded-xl border px-3 py-2 text-sm outline-none focus:ring-2"
          />
        </label>

        <label className="block space-y-1.5">
          <span className="text-foreground text-xs font-medium">
            {t("postTags")}
          </span>
          <input
            value={values.tags}
            onChange={(e) => set("tags", e.target.value)}
            placeholder="promo, tips, new"
            className="border-border bg-background text-foreground focus:ring-primary/30 w-full rounded-xl border px-3 py-2 text-sm outline-none focus:ring-2"
          />
        </label>

        <label className="flex cursor-pointer items-center gap-3">
          <Switcher
            isActive={values.isPublished}
            setIsActive={(e) =>
              setValues((prev) => ({
                ...prev,
                isPublished: typeof e === "function" ? e(prev.isPublished) : e,
              }))
            }
          />
          <span className="text-foreground text-sm">{publishLabel}</span>
        </label>

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={saving}
            className="bg-primary text-primary-foreground hover:bg-primary/90 flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold transition-colors disabled:opacity-60"
          >
            {saving && <Loader2 className="h-4 w-4 animate-spin" />}
            {saving ? t("saving") : t("save")}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="bg-muted text-foreground hover:bg-muted/80 rounded-xl px-5 py-2.5 text-sm font-medium transition-colors"
          >
            {t("cancel")}
          </button>
        </div>
      </form>
    </div>
  );
}
