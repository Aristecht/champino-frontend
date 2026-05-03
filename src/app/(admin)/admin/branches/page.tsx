"use client";

import { useState } from "react";
import { toast } from "sonner";
import { MapPin, Plus } from "lucide-react";
import {
  useAdminGetBranchesQuery,
  useAdminCreateBranchMutation,
  useAdminUpdateBranchMutation,
  useAdminDeleteBranchMutation,
  type CreateBranchInput,
  type UpdateBranchInput,
} from "@/generated/output";
import { BranchCard } from "@/components/features/admin/branches/BranchCard";
import { BranchFormDialog } from "@/components/features/admin/branches/BranchFormDialog";
import { DeleteBranchDialog } from "@/components/features/admin/branches/DeleteBranchDialog";
import {
  type Branch,
  type BranchFormState,
  EMPTY_BRANCH_FORM,
} from "@/components/features/admin/branches/branchTypes";

export default function AdminBranchesPage() {
  const { data, loading, refetch } = useAdminGetBranchesQuery({
    fetchPolicy: "cache-and-network",
  });

  const [createBranch, { loading: creating }] = useAdminCreateBranchMutation({
    onCompleted: () => { toast.success("Филиал создан"); setCreateOpen(false); refetch(); },
    onError: (e) => toast.error(e.message || "Ошибка при создании"),
  });

  const [updateBranch, { loading: updating }] = useAdminUpdateBranchMutation({
    onCompleted: () => { toast.success("Филиал обновлён"); setEditTarget(null); refetch(); },
    onError: (e) => toast.error(e.message || "Ошибка при обновлении"),
  });

  const [deleteBranch, { loading: deleting }] = useAdminDeleteBranchMutation({
    onCompleted: () => { toast.success("Филиал удалён"); setDeleteTarget(null); refetch(); },
    onError: (e) => toast.error(e.message || "Ошибка при удалении"),
  });

  const [createOpen, setCreateOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Branch | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Branch | null>(null);

  const branches = data?.adminGetBranches ?? [];

  function handleCreate(values: BranchFormState) {
    createBranch({
      variables: {
        data: {
          name: values.name,
          city: values.city,
          address: values.address,
          phone: values.phone,
          workingHours: values.workingHours || undefined,
          latitude: values.latitude ? Number(values.latitude) : undefined,
          longitude: values.longitude ? Number(values.longitude) : undefined,
        } as CreateBranchInput,
      },
    });
  }

  function handleUpdate(values: BranchFormState) {
    if (!editTarget) return;
    updateBranch({
      variables: {
        id: editTarget.id,
        data: {
          name: values.name || undefined,
          city: values.city || undefined,
          address: values.address || undefined,
          phone: values.phone || undefined,
          workingHours: values.workingHours || undefined,
          isActive: values.isActive,
          latitude: values.latitude ? Number(values.latitude) : undefined,
          longitude: values.longitude ? Number(values.longitude) : undefined,
        } as UpdateBranchInput,
      },
    });
  }

  return (
    <div className="space-y-5 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-foreground text-xl font-semibold">Филиалы</h1>
          <p className="text-muted-foreground mt-0.5 text-sm">
            {loading && branches.length === 0
              ? "\u00a0"
              : `${branches.length} ${branches.length === 1 ? "филиал" : "филиалов"}`}
          </p>
        </div>
        <button
          onClick={() => setCreateOpen(true)}
          className="bg-foreground text-background hover:bg-foreground/90 inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-colors"
        >
          <Plus className="h-4 w-4" />
          Добавить филиал
        </button>
      </div>

      {loading && branches.length === 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-card border-border rounded-xl border p-5">
              <div className="space-y-2">
                {[60, 40, 80, 50].map((w, j) => (
                  <div key={j} className="bg-muted h-4 animate-pulse rounded" style={{ width: `${w}%` }} />
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : branches.length === 0 ? (
        <div className="bg-card border-border flex flex-col items-center justify-center rounded-xl border py-16 text-center">
          <MapPin className="text-muted-foreground mb-3 h-10 w-10" />
          <p className="text-foreground font-medium">Нет филиалов</p>
          <p className="text-muted-foreground mt-1 text-sm">Добавьте первый филиал магазина</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {branches.map((b) => (
            <BranchCard
              key={b.id}
              branch={b as Branch}
              onEdit={setEditTarget}
              onDelete={setDeleteTarget}
            />
          ))}
        </div>
      )}

      <BranchFormDialog
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        initial={EMPTY_BRANCH_FORM}
        onSave={handleCreate}
        saving={creating}
        title="Новый филиал"
      />

      {editTarget && (
        <BranchFormDialog
          open
          onClose={() => setEditTarget(null)}
          initial={{
            name: editTarget.name,
            city: editTarget.city,
            address: editTarget.address,
            phone: editTarget.phone,
            workingHours: editTarget.workingHours ?? "",
            latitude: editTarget.latitude ?? undefined,
            longitude: editTarget.longitude ?? undefined,
            isActive: editTarget.isActive,
          }}
          onSave={handleUpdate}
          saving={updating}
          title="Редактировать филиал"
          showActiveToggle
        />
      )}

      {deleteTarget && (
        <DeleteBranchDialog
          branch={deleteTarget}
          onClose={() => setDeleteTarget(null)}
          onConfirm={() => deleteBranch({ variables: { id: deleteTarget.id } })}
          deleting={deleting}
        />
      )}
    </div>
  );
}
