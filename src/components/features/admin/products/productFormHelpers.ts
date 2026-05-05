import { storageUrl } from "@/utils/storage-url";

// ── Constants ──────────────────────────────────────────────────────────────────

export const INPUT_CLS =
  "border-input bg-background text-foreground placeholder:text-muted-foreground w-full rounded-md border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/20";

// ── Media helpers ──────────────────────────────────────────────────────────────

type MediaObject = { id: string; url: string };

export type MediaItem = {
  localUrl: string;
  file: File | null;
  remoteUrl?: string;
  mediaId?: string;
};

function resolveApiBaseUrl() {
  if (process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL;
  }

  if (typeof window !== "undefined") {
    return `${window.location.origin}/api`;
  }

  return "http://localhost:4000/api";
}

export function remoteToMediaItem(url: string): MediaItem {
  return { localUrl: storageUrl(url) ?? url, file: null, remoteUrl: url };
}

export async function uploadImages(
  productId: string,
  files: File[]
): Promise<string[]> {
  const apiBaseUrl = resolveApiBaseUrl();
  const fd = new FormData();
  files.forEach((f) => fd.append("images", f));
  const res = await fetch(`${apiBaseUrl}/products/${productId}/media/images`, {
    method: "POST",
    body: fd,
    credentials: "include",
  });
  if (!res.ok) throw new Error(`Upload failed: ${res.status}`);
  const data: MediaObject[] = await res.json();
  return (Array.isArray(data) ? data : []).map((item) =>
    typeof item === "string" ? item : item.url
  );
}

export async function uploadVideo(
  productId: string,
  file: File
): Promise<string> {
  const apiBaseUrl = resolveApiBaseUrl();
  const fd = new FormData();
  fd.append("video", file);
  const res = await fetch(`${apiBaseUrl}/products/${productId}/media/video`, {
    method: "POST",
    body: fd,
    credentials: "include",
  });
  if (!res.ok) throw new Error(`Upload failed: ${res.status}`);
  const data: MediaObject = await res.json();
  return data.url;
}

export async function deleteMedia(
  productId: string,
  mediaId: string
): Promise<void> {
  const apiBaseUrl = resolveApiBaseUrl();
  const res = await fetch(
    `${apiBaseUrl}/products/${productId}/media/${mediaId}`,
    { method: "DELETE", credentials: "include" }
  );
  if (!res.ok) throw new Error(`Delete failed: ${res.status}`);
}

// ── Types ──────────────────────────────────────────────────────────────────────

export interface ProductFormValues {
  name: string;
  price: number;
  stock: number;
  description?: string;
  categoryId: string;
  discountPercent?: number;
  isPublished: boolean;
  images: string[];
}

export interface Category {
  id: string;
  name: string;
  /** Present when this is a subcategory; used for optgroup grouping in selects. */
  parentName?: string;
}

export interface ProductFormProps {
  /** Used for media uploads: draftId (new) or existing product id (edit). */
  productId: string | null;
  initialValues?: {
    name?: string;
    price?: string;
    stock?: string;
    description?: string;
    categoryId?: string;
    discountPercent?: string;
    /** Always defaults to true when not provided. */
    isPublished?: boolean;
    images?: MediaItem[];
    video?: MediaItem | null;
  };
  categories: Category[];
  loadingCategories: boolean;
  /** True while the parent mutation (createProduct / updateProduct) is in-flight. */
  saving: boolean;
  onSave: (values: ProductFormValues) => void;
}
