import { Clock3, MapPin, Phone } from "lucide-react";
import { useTranslations } from "next-intl";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/common/ui/Card";
import { cn } from "@/utils/tw-merge";
import type { DeliveryBranch } from "./types";

interface BranchDirectoryProps {
  branches: DeliveryBranch[];
  selectedBranchId: string | null;
  onSelect: (branchId: string) => void;
}

export function BranchDirectory({
  branches,
  selectedBranchId,
  onSelect,
}: BranchDirectoryProps) {
  const t = useTranslations("delivery.branches");

  return (
    <Card variant="gradient" className="rounded-3xl">
      <CardHeader>
        <CardTitle>{t("title")}</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-3 pb-5">
        {branches.map((branch) => {
          const isActive = branch.id === selectedBranchId;

          return (
            <button
              key={branch.id}
              type="button"
              onClick={() => onSelect(branch.id)}
              className={cn(
                "bg-background/70 border-border/50 rounded-2xl border p-4 text-left transition-all",
                isActive
                  ? "border-primary bg-primary/5 shadow-sm"
                  : "hover:border-primary/40 hover:bg-background"
              )}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-foreground text-sm font-semibold">
                    {branch.name}
                  </h3>
                  <p className="text-muted-foreground mt-1 text-xs">
                    {branch.city}
                  </p>
                </div>
                <span
                  className={cn(
                    "rounded-full px-2.5 py-1 text-[11px] font-medium whitespace-nowrap",
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                  )}
                >
                  {isActive ? t("selected") : t("onMap")}
                </span>
              </div>

              <div className="mt-4 space-y-2 text-sm">
                <p className="text-muted-foreground flex items-start gap-2 leading-6">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0" />
                  <span>{branch.address}</span>
                </p>
                <p className="text-muted-foreground flex items-center gap-2">
                  <Phone className="h-4 w-4 shrink-0" />
                  <span>{branch.phone}</span>
                </p>
                <p className="text-muted-foreground flex items-center gap-2">
                  <Clock3 className="h-4 w-4 shrink-0" />
                  <span>{branch.workingHours || t("hoursFallback")}</span>
                </p>
              </div>
            </button>
          );
        })}
      </CardContent>
    </Card>
  );
}
