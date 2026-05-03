"use client";

import { useState, useEffect } from "react";
import { BRANCH_FORM_FIELDS, BranchFormState } from "./branchTypes";

interface BranchFormDialogProps {
  open: boolean;
  onClose: () => void;
  initial: BranchFormState;
  onSave: (values: BranchFormState) => void;
  saving: boolean;
  title: string;
  showActiveToggle?: boolean;
}

export function BranchFormDialog({
  open,
  onClose,
  initial,
  onSave,
  saving,
  title,
  showActiveToggle = false,
}: BranchFormDialogProps) {
  const [form, setForm] = useState<BranchFormState>(initial);

  useEffect(() => {
    if (open) setForm(initial);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  if (!open) return null;

  function field(key: keyof BranchFormState) {
    return {
      value: (form[key] as string) ?? "",
      onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
        setForm((f) => ({ ...f, [key]: e.target.value || undefined })),
    };
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSave(form);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="bg-background/80 absolute inset-0 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="bg-card border-border relative z-10 w-full max-w-md rounded-xl border shadow-xl">
        <div className="border-b px-5 py-4">
          <h2 className="text-foreground text-base font-semibold">{title}</h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3 px-5 py-4">
          {BRANCH_FORM_FIELDS.map(({ key, label, required, placeholder }) => (
            <div key={key}>
              <label className="text-foreground mb-1 block text-xs font-medium">
                {label}
                {required && <span className="text-destructive ml-0.5">*</span>}
              </label>
              <input
                className="border-input bg-background text-foreground placeholder:text-muted-foreground focus:ring-ring w-full rounded-md border px-3 py-2 text-sm outline-none focus:ring-2"
                placeholder={placeholder ?? label}
                required={required}
                {...field(key)}
              />
            </div>
          ))}

          {showActiveToggle && (
            <label className="flex cursor-pointer items-center gap-2">
              <input
                type="checkbox"
                className="h-4 w-4 rounded"
                checked={!!form.isActive}
                onChange={(e) =>
                  setForm((f) => ({ ...f, isActive: e.target.checked }))
                }
              />
              <span className="text-foreground text-sm">Активный филиал</span>
            </label>
          )}

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="border-border text-foreground hover:bg-accent rounded-md border px-4 py-2 text-sm font-medium transition-colors"
            >
              Отмена
            </button>
            <button
              type="submit"
              disabled={saving}
              className="bg-foreground text-background hover:bg-foreground/90 rounded-md px-4 py-2 text-sm font-medium transition-colors disabled:opacity-50"
            >
              {saving ? "Сохранение…" : "Сохранить"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
