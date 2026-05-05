"use client";

import { useRef } from "react";
import { ImagePlus, Trash2 } from "lucide-react";
import {
  DndContext,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  rectSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { type MediaItem } from "./productFormHelpers";

interface ProductFormImagesProps {
  images: MediaItem[];
  onAddFiles: (files: FileList | null) => void;
  onRemove: (idx: number) => void;
  onReorder: (next: MediaItem[]) => void;
}

export function ProductFormImages({
  images,
  onAddFiles,
  onRemove,
  onReorder,
}: ProductFormImagesProps) {
  const imgInputRef = useRef<HTMLInputElement>(null);
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 6,
      },
    })
  );

  const itemIds = images.map(getImageId);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = itemIds.indexOf(String(active.id));
    const newIndex = itemIds.indexOf(String(over.id));
    if (oldIndex < 0 || newIndex < 0) return;

    onReorder(arrayMove(images, oldIndex, newIndex));
  };

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
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext items={itemIds} strategy={rectSortingStrategy}>
            <div className="grid grid-cols-5 gap-2">
              {images.map((img, i) => (
                <SortableImageItem
                  key={getImageId(img)}
                  id={getImageId(img)}
                  img={img}
                  index={i}
                  onRemove={onRemove}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
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

function SortableImageItem({
  id,
  img,
  index,
  onRemove,
}: {
  id: string;
  img: MediaItem;
  index: number;
  onRemove: (idx: number) => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="bg-muted/40 group relative aspect-square overflow-hidden rounded-md"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={img.localUrl} alt="" className="h-full w-full object-contain" />

      <button
        type="button"
        onClick={() => onRemove(index)}
        className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-opacity group-hover:opacity-100"
      >
        <Trash2 className="h-4 w-4 text-white" />
      </button>

      <button
        type="button"
        {...attributes}
        {...listeners}
        className="absolute top-1 right-1 cursor-grab rounded bg-black/55 px-1.5 py-0.5 text-[10px] text-white active:cursor-grabbing"
        aria-label="Перетащить изображение"
      >
        drag
      </button>

      {index === 0 && (
        <span className="absolute bottom-1 left-1 rounded bg-black/60 px-1 py-0.5 text-[9px] text-white">
          Главное
        </span>
      )}

      {isDragging && (
        <div className="ring-primary pointer-events-none absolute inset-0 rounded-md ring-2" />
      )}
    </div>
  );
}

function getImageId(img: MediaItem): string {
  return img.mediaId ?? img.remoteUrl ?? img.localUrl;
}
