"use client";

import { useRef } from "react";
import { ImagePlus, Trash2 } from "lucide-react";
import { type MediaItem } from "../../../../../components/features/admin/products/productFormHelpers";

interface ProductFormImagesProps {
  images: MediaItem[];
  onAddFiles: (files: FileList | null) => void;
  onRemove: (idx: number) => void;
}

export function ProductFormImages({
  images,
  onAddFiles,
  onRemove,
}: ProductFormImagesProps) {
  const imgInputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="bg-card border-border rounded-lg border p-5">
      <div className="mb-3 flex items-center justify-between">
        <div>
          <h2 className="text-foreground text-sm font-semibold">Изображения</h2>
          <p className="text-muted-foreground text-xs">{images.length} / 10</p>
        </div>
        {images.length < 10 && (
          <button
            type="button"
            onClick={() => imgInputRef.current?.click()}
            className="border-border text-foreground hover:bg-muted inline-flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-xs transition-colors"
          >
            <ImagePlus className="h-3.5 w-3.5" />
            Добавить
          </button>
        )}
      </div>

      <input
        ref={imgInputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(e) => onAddFiles(e.target.files)}
      />

      {images.length > 0 ? (
        <div className="grid grid-cols-5 gap-2">
          {images.map((img, i) => (
            <div
              key={i}
              className="group relative aspect-square overflow-hidden rounded-md"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={img.localUrl}
                alt=""
                className="h-full w-full object-cover"
              />
              <button
                type="button"
                onClick={() => onRemove(i)}
                className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-opacity group-hover:opacity-100"
              >
                <Trash2 className="h-4 w-4 text-white" />
              </button>
              {i === 0 && (
                <span className="absolute bottom-1 left-1 rounded bg-black/60 px-1 py-0.5 text-[9px] text-white">
                  Главное
                </span>
              )}
            </div>
          ))}
        </div>
      ) : (
        <button
          type="button"
          onClick={() => imgInputRef.current?.click()}
          className="border-border text-muted-foreground hover:bg-muted flex w-full items-center justify-center gap-2 rounded-md border border-dashed py-8 text-sm transition-colors"
        >
          <ImagePlus className="h-5 w-5" />
          Выбрать изображения
        </button>
      )}
    </div>
  );
}
