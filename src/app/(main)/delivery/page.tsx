"use client";

import { gql } from "@apollo/client";
import { useQuery } from "@apollo/client/react";
import { useMemo, useState } from "react";
import { AlertCircle } from "lucide-react";
import { useTranslations } from "next-intl";
import { DeliveryHero } from "@/components/features/delivery/DeliveryHero";
import { DeliveryPolicyGrid } from "@/components/features/delivery/DeliveryPolicyGrid";
import { BranchDirectory } from "@/components/features/delivery/BranchDirectory";
import { BranchMiniMap } from "@/components/features/delivery/BranchMiniMap";
import type { DeliveryBranch } from "@/components/features/delivery/types";

const GET_BRANCHES = gql`
  query GetBranchesPublicPage {
    getBranches {
      id
      name
      city
      address
      phone
      workingHours
      latitude
      longitude
    }
  }
`;

type GetBranchesResult = {
  getBranches: DeliveryBranch[];
};

export default function DeliveryPage() {
  const t = useTranslations("delivery");
  const { data, loading, error } = useQuery<GetBranchesResult>(GET_BRANCHES);
  const branches = useMemo(() => data?.getBranches ?? [], [data]);
  const [selectedBranchId, setSelectedBranchId] = useState<string | null>(null);

  const effectiveSelectedBranchId = useMemo(() => {
    if (
      selectedBranchId &&
      branches.some((branch) => branch.id === selectedBranchId)
    ) {
      return selectedBranchId;
    }
    return (
      branches.find(
        (branch) => branch.latitude != null && branch.longitude != null
      )?.id ??
      branches[0]?.id ??
      null
    );
  }, [branches, selectedBranchId]);

  const selectedBranch =
    branches.find((branch) => branch.id === effectiveSelectedBranchId) ?? null;

  return (
    <div className="container mx-auto max-w-7xl space-y-6 px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
      <DeliveryHero />
      <DeliveryPolicyGrid />

      <section
        id="branches"
        className="grid scroll-mt-24 gap-6 lg:grid-cols-[1.05fr_0.95fr]"
      >
        {loading ? (
          <div className="bg-card border-border h-128 animate-pulse rounded-3xl border lg:col-span-2" />
        ) : error ? (
          <div className="bg-card border-border text-muted-foreground flex min-h-52 flex-col items-center justify-center rounded-3xl border p-6 text-center lg:col-span-2">
            <AlertCircle className="mb-3 h-8 w-8 text-red-500" />
            {t("loadError")}
          </div>
        ) : (
          <>
            <BranchDirectory
              branches={branches}
              selectedBranchId={effectiveSelectedBranchId}
              onSelect={setSelectedBranchId}
            />
            <BranchMiniMap branch={selectedBranch} />
          </>
        )}
      </section>
    </div>
  );
}
