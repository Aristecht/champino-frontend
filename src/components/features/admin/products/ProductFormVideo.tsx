"use client";

import { useRef } from "react";
import { Trash2, Video } from "lucide-react";
import { type MediaItem } from "./productFormHelpers";

interface ProductFormVideoProps {
  video: MediaItem | null;
  onAddFile: (files: FileList | null) => void;
  onRemove: () => void;
}

export function ProductFormVideo({
  video,
  onAddFile,
  onRemove,
}: ProductFormVideoProps) {
  const vidInputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="bg-card border-border rounded-lg border p-5">
      <div className="mb-3 flex items-center justify-between">
        <div>
          <h2 className="text-foreground text-sm font-semibold">Видео</h2>
          <p className="text-muted-foreground text-xs">1 видео</p>
        </div>
        <button
          type="button"
          onClick={() => vidInputRef.current?.click()}
          className="border-border text-foreground hover:bg-muted inline-flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-xs transition-colors"
        >
          <Video className="h-3.5 w-3.5" />
          {video ? "Заменить" : "Добавить"}
        </button>
      </div>

      <input
        ref={vidInputRef}
        type="file"
        accept="video/*"
        className="hidden"
        onChange={(e) => onAddFile(e.target.files)}
      />

      {video ? (
        <div className="relative overflow-hidden rounded-md">
          <video
            src={video.localUrl}
            controls
            className="w-full rounded-md"
            style={{ maxHeight: "200px" }}
          />
          <button
            type="button"
            onClick={onRemove}
            className="absolute top-2 right-2 flex h-7 w-7 items-center justify-center rounded-full bg-black/60 text-white transition-opacity hover:opacity-80"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => vidInputRef.current?.click()}
          className="border-border text-muted-foreground hover:bg-muted flex w-full items-center justify-center gap-2 rounded-md border border-dashed py-8 text-sm transition-colors"
        >
          <Video className="h-5 w-5" />
          Выбрать видео
        </button>
      )}
    </div>
  );
}
