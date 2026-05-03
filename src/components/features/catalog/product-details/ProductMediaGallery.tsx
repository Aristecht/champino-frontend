"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Play, Tag } from "lucide-react";
import { useTranslations } from "next-intl";
import { cn } from "@/utils/tw-merge";
import { storageUrl } from "@/utils/storage-url";
import { MediaType } from "@/generated/output";

interface ProductMedia {
  id: string;
  url: string;
  mediaType: MediaType;
}

interface ProductMediaGalleryProps {
  medias: ProductMedia[];
  mediaIdx: number;
  onMediaChange: (index: number) => void;
  productName: string;
  hasDiscount: boolean;
  discountPercent: number;
}

export function ProductMediaGallery({
  medias,
  mediaIdx,
  onMediaChange,
  productName,
  hasDiscount,
  discountPercent,
}: ProductMediaGalleryProps) {
  const t = useTranslations("product");
  const [thumbStart, setThumbStart] = useState(0);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const currentMedia = medias[mediaIdx];
  const currentMediaUrl = currentMedia ? storageUrl(currentMedia.url) : null;
  const isVideo = currentMedia?.mediaType === MediaType.Video;
  const canSlide = medias.length > 4;
  const maxStart = Math.max(0, medias.length - 4);
  const hasMultiple = medias.length > 1;

  const visibleThumbs = useMemo(
    () => medias.slice(thumbStart, thumbStart + 4),
    [medias, thumbStart]
  );

  const goNext = () => {
    if (!hasMultiple) return;
    onMediaChange(mediaIdx >= medias.length - 1 ? 0 : mediaIdx + 1);
  };

  const goPrev = () => {
    if (!hasMultiple) return;
    onMediaChange(mediaIdx <= 0 ? medias.length - 1 : mediaIdx - 1);
  };

  const handleTouchStart = (x: number) => setTouchStartX(x);
  const handleTouchEnd = (x: number) => {
    if (touchStartX === null || !hasMultiple) return;
    const diff = touchStartX - x;
    if (Math.abs(diff) < 45) {
      setTouchStartX(null);
      return;
    }
    if (diff > 0) goNext();
    else goPrev();
    setTouchStartX(null);
  };

  return (
    <div className="space-y-3">
      <div
        className="bg-muted relative aspect-square w-full overflow-hidden rounded-2xl"
        onTouchStart={(e) =>
          handleTouchStart(e.changedTouches[0]?.clientX ?? 0)
        }
        onTouchEnd={(e) => handleTouchEnd(e.changedTouches[0]?.clientX ?? 0)}
      >
        {currentMedia ? (
          isVideo ? (
            currentMediaUrl ? (
              <video
                src={currentMediaUrl}
                controls
                className="h-full w-full object-contain"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-5xl opacity-20">
                📦
              </div>
            )
          ) : (
            currentMediaUrl ? (
              <Image
                src={currentMediaUrl}
                alt={productName}
                fill
                className="object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-5xl opacity-20">
                📦
              </div>
            )
          )
        ) : (
          <div className="flex h-full items-center justify-center text-5xl opacity-20">
            📦
          </div>
        )}

        {hasDiscount && (
          <div className="bg-destructive text-destructive-foreground absolute top-3 left-3 flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-bold">
            <Tag className="h-3 w-3" />-{discountPercent}%
          </div>
        )}

        {hasMultiple && (
          <>
            <button
              type="button"
              onClick={goPrev}
              className="bg-background/85 text-foreground absolute top-1/2 left-2 z-10 -translate-y-1/2 rounded-full p-2 shadow-sm backdrop-blur-sm transition hover:scale-105"
              aria-label={t("mediaPrev")}
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={goNext}
              className="bg-background/85 text-foreground absolute top-1/2 right-2 z-10 -translate-y-1/2 rounded-full p-2 shadow-sm backdrop-blur-sm transition hover:scale-105"
              aria-label={t("mediaNext")}
            >
              <ChevronRight className="h-4 w-4" />
            </button>

            <div className="absolute bottom-2 left-1/2 z-10 flex -translate-x-1/2 items-center gap-1.5 rounded-full bg-black/30 px-2 py-1 backdrop-blur-sm">
              {medias.slice(0, 8).map((m, idx) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => onMediaChange(idx)}
                  aria-label={t("mediaGoTo", { index: idx + 1 })}
                  className={cn(
                    "h-1.5 rounded-full transition-all",
                    idx === mediaIdx
                      ? "w-4 bg-white"
                      : "w-1.5 bg-white/65 hover:bg-white"
                  )}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {hasMultiple && (
        <div className="hidden space-y-2 sm:block">
          <div className="grid grid-cols-4 gap-2">
            {(canSlide ? visibleThumbs : medias).map((m, i) => {
              const index = canSlide ? thumbStart + i : i;
              const thumbUrl = storageUrl(m.url);
              const isVid = m.mediaType === MediaType.Video;
              return (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => onMediaChange(index)}
                  className={cn(
                    "bg-muted relative h-28 w-full overflow-hidden rounded-xl border-2 transition-all",
                    mediaIdx === index
                      ? "border-primary"
                      : "hover:border-border border-transparent"
                  )}
                >
                  {isVid ? (
                    <div className="flex h-full w-full items-center justify-center">
                      <Play className="text-foreground h-6 w-6 opacity-70" />
                    </div>
                  ) : thumbUrl ? (
                    <Image
                      src={thumbUrl}
                      alt=""
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-2xl opacity-20">
                      📦
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {canSlide && (
            <div className="flex items-center justify-center gap-2">
              <button
                type="button"
                onClick={() => setThumbStart((prev) => Math.max(0, prev - 1))}
                disabled={thumbStart === 0}
                className="border-border hover:bg-accent rounded-lg border p-1.5 disabled:opacity-40"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <span className="text-muted-foreground text-xs">
                {t("mediaRange", {
                  start: thumbStart + 1,
                  end: Math.min(thumbStart + 4, medias.length),
                  total: medias.length,
                })}
              </span>
              <button
                type="button"
                onClick={() =>
                  setThumbStart((prev) => Math.min(maxStart, prev + 1))
                }
                disabled={thumbStart >= maxStart}
                className="border-border hover:bg-accent rounded-lg border p-1.5 disabled:opacity-40"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
