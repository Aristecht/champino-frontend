"use client";

import { useRef } from "react";
import { ImagePlus } from "lucide-react";
import { storageUrl } from "@/utils/storage-url";

interface ImagePickerProps {
  value: File | string | null;
  onChange: (v: File | null) => void;
}

export function ImagePicker({ value, onChange }: ImagePickerProps) {
  const ref = useRef<HTMLInputElement>(null);
  const preview =
    value instanceof File
      ? URL.createObjectURL(value)
      : storageUrl(value as string | null);

  return (
    <div className="space-y-1.5">
      <label className="text-foreground text-sm font-medium">
        Изображение{" "}
        <span className="text-muted-foreground text-xs font-normal">
          (необязательно)
        </span>
      </label>
      <input
        ref={ref}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => onChange(e.target.files?.[0] ?? null)}
      />
      {preview ? (
        <div className="relative w-24">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={preview}
            alt="preview"
            className="h-24 w-24 rounded-md object-cover"
          />
          <button
            type="button"
            onClick={() => {
              onChange(null);
              if (ref.current) ref.current.value = "";
            }}
            className="absolute top-1 right-1 flex h-5 w-5 items-center justify-center rounded-full bg-black/60 text-xs text-white hover:opacity-80"
          >
            ×
          </button>
          <button
            type="button"
            onClick={() => ref.current?.click()}
            className="border-border text-foreground hover:bg-muted mt-1 w-full rounded border px-2 py-1 text-xs transition-colors"
          >
            Изменить
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => ref.current?.click()}
          className="border-border text-muted-foreground hover:bg-muted flex h-24 w-24 flex-col items-center justify-center gap-1 rounded-md border border-dashed text-xs transition-colors"
        >
          <ImagePlus className="h-5 w-5" />
          Загрузить
        </button>
      )}
    </div>
  );
}
