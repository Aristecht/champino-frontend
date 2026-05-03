"use client";

import type { Branch } from "./branchTypes";

interface DeleteBranchDialogProps {
  branch: Branch;
  onClose: () => void;
  onConfirm: () => void;
  deleting: boolean;
}

export function DeleteBranchDialog({
  branch,
  onClose,
  onConfirm,
  deleting,
}: DeleteBranchDialogProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="bg-background/80 absolute inset-0 backdrop-blur-sm" onClick={onClose} />
      <div className="bg-card border-border relative z-10 w-full max-w-sm rounded-xl border shadow-xl">
        <div className="px-5 py-5">
          <h2 className="text-foreground text-base font-semibold">Удалить филиал?</h2>
          <p className="text-muted-foreground mt-1 text-sm">
            «{branch.name}» — {branch.city}, {branch.address}
          </p>
          <div className="mt-4 flex justify-end gap-2">
            <button
              onClick={onClose}
              className="border-border text-foreground hover:bg-accent rounded-md border px-4 py-2 text-sm font-medium transition-colors"
            >
              Отмена
            </button>
            <button
              onClick={onConfirm}
              disabled={deleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90 rounded-md px-4 py-2 text-sm font-medium transition-colors disabled:opacity-50"
            >
              {deleting ? "Удаление…" : "Удалить"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
