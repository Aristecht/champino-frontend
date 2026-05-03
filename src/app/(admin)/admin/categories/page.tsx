"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import {
  useFindAllCategoriesQuery,
  useRemoveCategoryMutation,
  useUpdateCategoryMutation,
} from "@/generated/output";
import { api } from "@/libs/api";
import { CategoryTable } from "@/components/features/admin/categories/CategoryTable";
import {
  CreateCategoryDialog,
  EditCategoryDialog,
  DeleteCategoryDialog,
} from "@/components/features/admin/categories/CategoryDialogs";
import {
  type CatForm,
  type EditTarget,
  EMPTY_FORM,
} from "@/components/features/admin/categories/categoryTypes";

export default function AdminCategoriesPage() {
  const t = useTranslations("admin");

  const [createOpen, setCreateOpen] = useState(false);
  const [createForm, setCreateForm] = useState<CatForm>(EMPTY_FORM);
  const [createImage, setCreateImage] = useState<File | null>(null);
  const [createIsRoot, setCreateIsRoot] = useState(true);

  const [editTarget, setEditTarget] = useState<EditTarget | null>(null);
  const [editForm, setEditForm] = useState<CatForm>(EMPTY_FORM);
  const [editImage, setEditImage] = useState<File | string | null>(null);
  const [editIsRoot, setEditIsRoot] = useState(true);

  const [deleteTarget, setDeleteTarget] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const [creating, setCreating] = useState(false);

  const { data, loading, refetch } = useFindAllCategoriesQuery({
    fetchPolicy: "cache-and-network",
  });

  const [removeCategory, { loading: deleting }] = useRemoveCategoryMutation({
    onCompleted: () => {
      toast.success(t("categoryDeleted"));
      setDeleteTarget(null);
      refetch();
    },
    onError: () => toast.error(t("categoryDeleteError")),
  });

  const [updateCategory, { loading: updating }] = useUpdateCategoryMutation({
    onCompleted: () => {
      toast.success("Категория обновлена");
      setEditTarget(null);
      refetch();
    },
    onError: (e) => toast.error(e.message || "Ошибка при обновлении категории"),
  });

  const categories = data?.findAllCategories ?? [];
  const rootCats = categories.filter((c) => !c.parentId);

  function toggleExpand(id: string) {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function mkChange(setter: React.Dispatch<React.SetStateAction<CatForm>>) {
    return (k: keyof CatForm) =>
      (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const val =
          k === "slug" ? e.target.value.toLowerCase() : e.target.value;
        setter((f) => ({ ...f, [k]: val }));
      };
  }

  function openEdit(target: EditTarget) {
    setEditTarget(target);
    setEditIsRoot(target.isRoot);
    setEditForm({
      name: target.name ?? "",
      slug: target.slug ?? "",
      parentId: target.parentId ?? "",
    });
    setEditImage(target.imageUrl ?? null);
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!createForm.name.trim()) {
      toast.error("Введите название");
      return;
    }
    setCreating(true);
    try {
      const fd = new FormData();
      fd.append("name", createForm.name.trim());
      if (createForm.slug.trim()) fd.append("slug", createForm.slug.trim());
      if (createForm.parentId) fd.append("parentId", createForm.parentId);
      if (createImage) fd.append("image", createImage);
      await api.post("/categories", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("Категория создана");
      setCreateOpen(false);
      setCreateForm(EMPTY_FORM);
      setCreateImage(null);
      setCreateIsRoot(true);
      refetch();
    } catch (err: unknown) {
      toast.error(
        err instanceof Error ? err.message : "Ошибка при создании категории"
      );
    } finally {
      setCreating(false);
    }
  }

  async function handleUpdate(e: React.FormEvent) {
    e.preventDefault();
    if (!editTarget || !editForm.name.trim()) {
      toast.error("Введите название");
      return;
    }
    if (editImage instanceof File) {
      try {
        const fd = new FormData();
        fd.append("image", editImage);
        await api.post(`/categories/${editTarget.id}/image`, fd, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } catch {
        toast.error("Ошибка загрузки изображения");
        return;
      }
    } else if (editImage === null && editTarget.imageUrl) {
      try {
        await api.delete(`/categories/${editTarget.id}/image`);
      } catch {
        toast.error("Ошибка удаления изображения");
        return;
      }
    }
    updateCategory({
      variables: {
        id: editTarget.id,
        data: {
          name: editForm.name.trim(),
          slug: editForm.slug.trim() || undefined,
          parentId: editIsRoot ? null : editForm.parentId || undefined,
        },
      },
    });
  }

  return (
    <div className="space-y-5 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-foreground text-xl font-semibold">
            {t("categories")}
          </h1>
          {!loading && (
            <p className="text-muted-foreground mt-0.5 text-sm">
              {categories.length} {t("categories").toLowerCase()}
            </p>
          )}
        </div>
        <button
          onClick={() => {
            setCreateForm(EMPTY_FORM);
            setCreateImage(null);
            setCreateIsRoot(true);
            setCreateOpen(true);
          }}
          className="bg-primary text-primary-foreground hover:bg-primary/90 inline-flex items-center gap-1.5 rounded-md px-3.5 py-2 text-sm font-medium transition-colors"
        >
          <Plus className="h-4 w-4" />
          {t("addCategory")}
        </button>
      </div>

      <CategoryTable
        loading={loading}
        rootCats={rootCats}
        expanded={expanded}
        onToggleExpand={toggleExpand}
        onEdit={openEdit}
        onDelete={setDeleteTarget}
      />

      <CreateCategoryDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        form={createForm}
        image={createImage}
        isRoot={createIsRoot}
        rootCats={rootCats}
        creating={creating}
        onChange={mkChange(setCreateForm)}
        onIsRootChange={(v) => {
          setCreateIsRoot(v);
          if (v) setCreateForm((f) => ({ ...f, parentId: "" }));
        }}
        onImageChange={setCreateImage}
        onSubmit={handleCreate}
      />

      <EditCategoryDialog
        target={editTarget}
        onClose={() => setEditTarget(null)}
        form={editForm}
        image={editImage}
        isRoot={editIsRoot}
        rootCats={rootCats}
        updating={updating}
        onChange={mkChange(setEditForm)}
        onIsRootChange={(v) => {
          setEditIsRoot(v);
          if (v) setEditForm((f) => ({ ...f, parentId: "" }));
        }}
        onImageChange={(f) => setEditImage(f)}
        onSubmit={handleUpdate}
      />

      <DeleteCategoryDialog
        target={deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={(id) => removeCategory({ variables: { id } })}
        deleting={deleting}
      />
    </div>
  );
}
