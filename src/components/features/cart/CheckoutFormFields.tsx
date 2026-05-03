"use client";

import { Button } from "@/components/common/ui/Button";
import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { useTranslations } from "next-intl";
import { DeliveryType, PaymentMethod } from "@/generated/output";
import {
  CustomSelect,
  type SelectOption,
} from "../admin/products/CategoryCascadeSelect";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/common/ui/Card";

interface BranchMapItem {
  id: string;
  name: string;
  city: string;
  address: string;
  latitude?: number | null;
  longitude?: number | null;
}

interface CheckoutFormFieldsProps {
  fullName: string;
  phone: string;
  city: string;
  street: string;
  building: string;
  apartment: string;
  postalCode: string;
  branchId: string;
  note: string;
  deliveryType: DeliveryType;
  paymentMethod: PaymentMethod;
  fieldClassName: string;
  deliveryOptions: SelectOption[];
  paymentOptions: SelectOption[];
  onlinePaymentsStatusText: string;
  branchOptions: SelectOption[];
  branches: BranchMapItem[];
  isSubmitting: boolean;
  isDisabled: boolean;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  onFullNameChange: (value: string) => void;
  onPhoneChange: (value: string) => void;
  onCityChange: (value: string) => void;
  onStreetChange: (value: string) => void;
  onBuildingChange: (value: string) => void;
  onApartmentChange: (value: string) => void;
  onPostalCodeChange: (value: string) => void;
  onBranchIdChange: (value: string) => void;
  onNoteChange: (value: string) => void;
  onDeliveryTypeChange: (value: DeliveryType) => void;
  onPaymentMethodChange: (value: PaymentMethod) => void;
}

export function CheckoutFormFields({
  fullName,
  phone,
  city,
  street,
  building,
  apartment,
  postalCode,
  branchId,
  note,
  deliveryType,
  paymentMethod,
  fieldClassName,
  deliveryOptions,
  paymentOptions,
  onlinePaymentsStatusText,
  branchOptions,
  branches,
  isSubmitting,
  isDisabled,
  onSubmit,
  onFullNameChange,
  onPhoneChange,
  onCityChange,
  onStreetChange,
  onBuildingChange,
  onApartmentChange,
  onPostalCodeChange,
  onBranchIdChange,
  onNoteChange,
  onDeliveryTypeChange,
  onPaymentMethodChange,
}: CheckoutFormFieldsProps) {
  const t = useTranslations("cart.checkout");
  const selectedBranch = branches.find((b) => b.id === branchId) ?? null;
  const hasCoords =
    selectedBranch?.latitude != null && selectedBranch?.longitude != null;
  const googleMapLink = selectedBranch
    ? hasCoords
      ? `https://www.google.com/maps?q=${selectedBranch.latitude},${selectedBranch.longitude}`
      : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${selectedBranch.city}, ${selectedBranch.address}`)}`
    : null;
  const dgisLink = selectedBranch
    ? `https://2gis.kz/search/${encodeURIComponent(`${selectedBranch.city}, ${selectedBranch.address}`)}`
    : null;

  return (
    <form id="checkout-form" onSubmit={onSubmit} className="space-y-4">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <input
          value={fullName}
          onChange={(e) => onFullNameChange(e.target.value)}
          placeholder={t("fullName")}
          className={fieldClassName}
        />
        <input
          value={phone}
          onChange={(e) => onPhoneChange(e.target.value)}
          placeholder={t("phone")}
          className={fieldClassName}
        />
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <CustomSelect
          value={deliveryType}
          onChange={(value) => onDeliveryTypeChange(value as DeliveryType)}
          options={deliveryOptions}
          placeholder={t("chooseDelivery")}
        />
        <CustomSelect
          value={paymentMethod}
          onChange={(value) => onPaymentMethodChange(value as PaymentMethod)}
          options={paymentOptions}
          placeholder={t("choosePayment")}
        />
      </div>
      <p className="text-muted-foreground -mt-2 text-xs">
        {onlinePaymentsStatusText}
      </p>

      {deliveryType === DeliveryType.Courier ? (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <input
            value={city}
            onChange={(e) => onCityChange(e.target.value)}
            placeholder={t("city")}
            className={fieldClassName}
          />
          <input
            value={street}
            onChange={(e) => onStreetChange(e.target.value)}
            placeholder={t("street")}
            className={fieldClassName}
          />
          <input
            value={building}
            onChange={(e) => onBuildingChange(e.target.value)}
            placeholder={t("building")}
            className={fieldClassName}
          />
          <input
            value={apartment}
            onChange={(e) => onApartmentChange(e.target.value)}
            placeholder={t("apartment")}
            className={fieldClassName}
          />
          <input
            value={postalCode}
            onChange={(e) => onPostalCodeChange(e.target.value)}
            placeholder={t("postalCode")}
            className={`${fieldClassName} sm:col-span-2`}
          />
        </div>
      ) : (
        <div className="space-y-3">
          <CustomSelect
            value={branchId}
            onChange={onBranchIdChange}
            options={branchOptions}
            placeholder={t("chooseBranch")}
          />

          {selectedBranch && (
            <Card variant="gradient" className="rounded-2xl">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">{t("branchMapTitle")}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="bg-background/70 border-border/50 rounded-2xl border p-3">
                  <h3 className="text-foreground text-sm font-semibold">
                    {selectedBranch.name}
                  </h3>
                  <p className="text-muted-foreground mt-1 text-xs leading-5">
                    {selectedBranch.city}, {selectedBranch.address}
                  </p>
                </div>

                {hasCoords ? (
                  <div className="border-border/60 overflow-hidden rounded-2xl border">
                    <iframe
                      title={t("branchMapFrame", { name: selectedBranch.name })}
                      className="h-56 w-full border-0"
                      loading="lazy"
                      src={`https://www.google.com/maps?q=${selectedBranch.latitude},${selectedBranch.longitude}&z=16&output=embed`}
                      referrerPolicy="no-referrer-when-downgrade"
                    />
                  </div>
                ) : (
                  <div className="bg-background/70 border-border/50 text-muted-foreground flex min-h-24 items-center justify-center rounded-2xl border p-4 text-center text-xs">
                    {t("noCoordinates")}
                  </div>
                )}

                <div className="flex flex-col gap-2 sm:flex-row">
                  {googleMapLink && (
                    <Button
                      asChild
                      variant="outline"
                      className="w-full sm:w-auto"
                    >
                      <Link
                        href={googleMapLink}
                        target="_blank"
                        rel="noreferrer"
                      >
                        {t("openInGoogleMap")}
                        <ExternalLink className="h-4 w-4" />
                      </Link>
                    </Button>
                  )}
                  {dgisLink && (
                    <Button
                      asChild
                      variant="outline"
                      className="w-full sm:w-auto"
                    >
                      <Link href={dgisLink} target="_blank" rel="noreferrer">
                        {t("openIn2Gis")}
                        <ExternalLink className="h-4 w-4" />
                      </Link>
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      <textarea
        value={note}
        onChange={(e) => onNoteChange(e.target.value)}
        placeholder={t("note")}
        rows={4}
        className={`${fieldClassName} resize-none`}
      />

      <Button type="submit" className="w-full" disabled={isDisabled}>
        {isSubmitting ? t("submitting") : t("confirm")}
      </Button>
    </form>
  );
}
