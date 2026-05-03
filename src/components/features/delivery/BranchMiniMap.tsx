import Link from "next/link";
import { ExternalLink, MapPin } from "lucide-react";
import { useTranslations } from "next-intl";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/common/ui/Card";
import { Button } from "@/components/common/ui/Button";
import type { DeliveryBranch } from "./types";

interface BranchMiniMapProps {
  branch: DeliveryBranch | null;
}

function buildMapUrl(branch: DeliveryBranch) {
  if (branch.latitude == null || branch.longitude == null) return null;

  const lat = branch.latitude;
  const lon = branch.longitude;
  const point = `${lat.toFixed(6)},${lon.toFixed(6)}`;
  const encodedPoint = encodeURIComponent(point);

  return {
    embed: `https://www.google.com/maps?q=${encodedPoint}&z=16&output=embed`,
    googleExternal: `https://www.google.com/maps?q=${encodedPoint}`,
    dgisExternal: `https://2gis.kz/search/${encodedPoint}`,
  };
}

export function BranchMiniMap({ branch }: BranchMiniMapProps) {
  const t = useTranslations("delivery.map");
  const mapUrl = branch ? buildMapUrl(branch) : null;

  return (
    <Card variant="gradient" className="rounded-3xl">
      <CardHeader>
        <CardTitle>{t("title")}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 pb-5">
        {branch ? (
          <div className="space-y-3">
            <div className="bg-background/70 border-border/50 rounded-2xl border p-4">
              <h3 className="text-foreground text-sm font-semibold">
                {branch.name}
              </h3>
              <p className="text-muted-foreground mt-1 text-sm leading-6">
                {branch.city}, {branch.address}
              </p>
            </div>

            {mapUrl ? (
              <>
                <div className="border-border/60 overflow-hidden rounded-2xl border">
                  <iframe
                    title={t("branchMapTitle", { name: branch.name })}
                    src={mapUrl.embed}
                    loading="lazy"
                    className="h-72 w-full border-0"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                </div>
                <div className="flex flex-col gap-2 sm:flex-row">
                  <Button
                    asChild
                    variant="outline"
                    className="w-full sm:w-auto"
                  >
                    <Link
                      href={mapUrl.googleExternal}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {t("openInGoogleMap")}
                      <ExternalLink className="h-4 w-4" />
                    </Link>
                  </Button>
                  <Button
                    asChild
                    variant="outline"
                    className="w-full sm:w-auto"
                  >
                    <Link
                      href={mapUrl.dgisExternal}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {t("openIn2Gis")}
                      <ExternalLink className="h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </>
            ) : (
              <div className="bg-background/70 border-border/50 text-muted-foreground flex min-h-72 items-center justify-center rounded-2xl border p-6 text-center text-sm leading-6">
                {t("noCoordinates")}
              </div>
            )}
          </div>
        ) : (
          <div className="bg-background/70 border-border/50 text-muted-foreground flex min-h-72 items-center justify-center rounded-2xl border p-6 text-center text-sm leading-6">
            <div>
              <MapPin className="mx-auto mb-3 h-6 w-6" />
              {t("selectBranch")}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
