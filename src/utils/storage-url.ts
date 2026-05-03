export function storageUrl(path: string | null | undefined): string | null {
  if (!path) return null;
  // Blob URLs (new file preview) — always use as-is
  if (path.startsWith("blob:")) return path;

  const base = process.env.NEXT_PUBLIC_S3_URL;

  if (path.startsWith("https://") || path.startsWith("http://")) {
    // Already the CDN URL — return as-is
    if (base && path.startsWith(base)) return path;
    // Raw S3 path-style URL: https://s3.region.host/bucket-name/object-key
    // → rewrite to CDN: ${base}/object-key
    if (base) {
      try {
        const url = new URL(path);
        const parts = url.pathname.split("/").filter(Boolean);
        if (parts.length > 1) {
          const objectKey = parts.slice(1).join("/");
          return `${base}/${objectKey}`;
        }
      } catch {
        // fall through
      }
    }
    return path;
  }

  // Relative path — prepend CDN base
  if (!base) return null;
  return `${base}/${path.replace(/^\//, "")}`;
}
