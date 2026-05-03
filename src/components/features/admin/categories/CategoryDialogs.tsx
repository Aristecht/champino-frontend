"use client";

import { Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/common/ui/Dialog";
import { CategoryFormFields } from "./CategoryFormFields";
import { type CatForm, type EditTarget, type RootCat } from "./categoryTypes";

// ── Create dialog ─────────────────────────────────────────────────

interface CreateCategoryDialogProps {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  form: CatForm;
  image: File | null;
  isRoot: boolean;
  rootCats: RootCat[];
  creating: boolean;
  onChange: (k: keyof CatForm) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  onIsRootChange: (v: boolean) => void;
  onImageChange: (f: File | null) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export function CreateCategoryDialog({
  open,
  onOpenChange,
  form,
  image,
  isRoot,
  rootCats,
  creating,
  onChange,
  onIsRootChange,
  onImageChange,
  onSubmit,
}: CreateCategoryDialogProps) {
  const t = useTranslations("admin");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t("addCategory")}</DialogTitle>
          <DialogDescription>Заполните данные новой категории</DialogDescription>
        </DialogHeader>
        <form id="create-cat" onSubmit={onSubmit}>
          <CategoryFormFields
            form={form}
            rootCats={rootCats}
            onChange={onChange}
            isRoot={isRoot}
            onIsRootChange={onIsRootChange}
            imageVal={image}
            onImageChange={onImageChange}
          />
        </form>
        <DialogFooter className="mt-2 gap-2">
          <DialogClose asChild>
            <button className="border-border text-foreground hover:bg-muted rounded-md border px-4 py-2 text-sm transition-colors">
              Отмена
            </button>
          </DialogClose>
          <button
            type="submit"
            form="create-cat"
            disabled={creating}
            className="bg-primary text-primary-foreground hover:bg-primary/90 inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-colors disabled:opacity-50"
          >
            {creating && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
            Создать
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ── Edit dialog ───────────────────────────────────────────────────

interface EditCategoryDialogProps {
  target: EditTarget | null;
  onClose: () => void;
  form: CatForm;
  image: File | string | null;
  isRoot: boolean;
  rootCats: RootCat[];
  updating: boolean;
  onChange: (k: keyof CatForm) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  onIsRootChange: (v: boolean) => void;
  onImageChange: (f: File | null) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export function EditCategoryDialog({
  target,
  onClose,
  form,
  image,
  isRoot,
  rootCats,
  updating,
  onChange,
  onIsRootChange,
  onImageChange,
  onSubmit,
}: EditCategoryDialogProps) {
  return (
    <Dialog open={!!target} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Редактировать: {target?.name}</DialogTitle>
          <DialogDescription>Измените данные категории</DialogDescription>
        </DialogHeader>
        <form id="edit-cat" onSubmit={onSubmit}>
          <CategoryFormFields
            form={form}
            rootCats={rootCats}
            excludeId={target?.id}
            onChange={onChange}
            isRoot={isRoot}
            onIsRootChange={onIsRootChange}
            imageVal={image}
            onImageChange={onImageChange}
          />
        </form>
        <DialogFooter className="mt-2 gap-2">
          <DialogClose asChild>
            <button className="border-border text-foreground hover:bg-muted rounded-md border px-4 py-2 text-sm transition-colors">
              Отмена
            </button>
          </DialogClose>
          <button
            type="submit"
            form="edit-cat"
            disabled={updating}
            className="bg-primary text-primary-foreground hover:bg-primary/90 inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-colors disabled:opacity-50"
          >
            {updating && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
            Сохранить
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ── Delete dialog ─────────────────────────────────────────────────

interface DeleteCategoryDialogProps {
  target: { id: string; name: string } | null;
  onClose: () => void;
  onConfirm: (id: string) => void;
  deleting: boolean;
}

export function DeleteCategoryDialog({
  target,
  onClose,
  onConfirm,
  deleting,
}: DeleteCategoryDialogProps) {
  return (
    <Dialog open={!!target} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Удалить категорию</DialogTitle>
          <DialogDescription>
            Вы уверены, что хотите удалить{" "}
            <span className="text-foreground font-medium">«{target?.name}»</span>?
            Это действие необратимо.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="mt-2 gap-2">
          <DialogClose asChild>
            <button className="border-border text-foreground hover:bg-muted rounded-md border px-4 py-2 text-sm transition-colors">
              Отмена
            </button>
          </DialogClose>
          <button
            onClick={() => target && onConfirm(target.id)}
            disabled={deleting}
            className="inline-flex items-center gap-2 rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-700 disabled:opacity-50"
          >
            {deleting && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
            Удалить
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
