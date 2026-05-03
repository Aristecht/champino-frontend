"use client";

import {
  MapPin,
  Phone,
  Clock,
  Pencil,
  Trash2,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { cn } from "@/utils/tw-merge";
import type { Branch } from "./branchTypes";

interface BranchCardProps {
  branch: Branch;
  onEdit: (branch: Branch) => void;
  onDelete: (branch: Branch) => void;
}

export function BranchCard({ branch: b, onEdit, onDelete }: BranchCardProps) {
  return (
    <div
      className={cn(
        "bg-card border-border group relative rounded-xl border p-5 transition-shadow hover:shadow-md",
        !b.isActive && "opacity-60"
      )}
    >
      <div className="mb-3 flex items-start justify-between gap-2">
        <h2 className="text-foreground leading-tight font-semibold">
          {b.name}
        </h2>
        <span
          className={cn(
            "inline-flex shrink-0 items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium",
            b.isActive
              ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
              : "bg-muted text-muted-foreground"
          )}
        >
          {b.isActive ? (
            <CheckCircle2 className="h-3 w-3" />
          ) : (
            <XCircle className="h-3 w-3" />
          )}
          {b.isActive ? "Активен" : "Неактивен"}
        </span>
      </div>

      <div className="space-y-1.5">
        <div className="flex items-start gap-2">
          <MapPin className="text-muted-foreground mt-0.5 h-3.5 w-3.5 shrink-0" />
          <span className="text-foreground text-sm">
            {b.city}, {b.address}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Phone className="text-muted-foreground h-3.5 w-3.5 shrink-0" />
          <span className="text-foreground text-sm">{b.phone}</span>
        </div>
        {b.workingHours && (
          <div className="flex items-center gap-2">
            <Clock className="text-muted-foreground h-3.5 w-3.5 shrink-0" />
            <span className="text-muted-foreground text-xs">
              {b.workingHours}
            </span>
          </div>
        )}
      </div>

      <div className="mt-4 flex items-center gap-2 border-t pt-3">
        <button
          onClick={() => onEdit(b)}
          className="text-muted-foreground hover:text-foreground hover:bg-accent flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium transition-colors"
        >
          <Pencil className="h-3.5 w-3.5" />
          Редактировать
        </button>
        <button
          onClick={() => onDelete(b)}
          className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 ml-auto flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium transition-colors"
        >
          <Trash2 className="h-3.5 w-3.5" />
          Удалить
        </button>
      </div>
    </div>
  );
}
