"use client";

import { Button } from "@/components/common/ui/Button";
import { useTranslations } from "next-intl";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/common/ui/Dialog";
import { DeliveryType, PaymentMethod } from "@/generated/output";
import type { CartItem } from "@/store/cart/cart.types";
import { checkoutFieldCls } from "./checkoutConstants";
import type { SelectOption } from "../admin/products/CategoryCascadeSelect";
import { CheckoutFormFields } from "./CheckoutFormFields";
import { useCheckoutForm } from "./useCheckoutForm";

interface CheckoutFormProps {
  items: CartItem[];
}

export function CheckoutForm({ items }: CheckoutFormProps) {
  const t = useTranslations("cart.checkout");
  const checkout = useCheckoutForm(items);

  const deliveryOptions: SelectOption[] = [
    { label: t("deliveryCourier"), value: DeliveryType.Courier },
    { label: t("deliveryPickup"), value: DeliveryType.Pickup },
  ];

  const paymentOptions: SelectOption[] =
    checkout.deliveryType === DeliveryType.Courier
      ? [{ label: t("paymentCod"), value: PaymentMethod.CashOnDelivery }]
      : [];

  return (
    <Dialog open={checkout.open} onOpenChange={checkout.setOpen}>
      <DialogTrigger asChild>
        <Button className="w-full" disabled={items.length === 0}>
          {t("openCheckout")}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto rounded-2xl p-0">
        <div className="bg-card space-y-4 p-4 sm:p-6">
          <DialogHeader>
            <DialogTitle>{t("title")}</DialogTitle>
            <DialogDescription>{t("helpText")}</DialogDescription>
          </DialogHeader>

          <CheckoutFormFields
            fullName={checkout.fullName}
            phone={checkout.phone}
            city={checkout.city}
            street={checkout.street}
            building={checkout.building}
            apartment={checkout.apartment}
            postalCode={checkout.postalCode}
            branchId={checkout.branchId}
            note={checkout.note}
            deliveryType={checkout.deliveryType}
            paymentMethod={checkout.paymentMethod}
            fieldClassName={checkoutFieldCls}
            deliveryOptions={deliveryOptions}
            paymentOptions={paymentOptions}
            onlinePaymentsStatusText={t("onlinePaymentsStatus")}
            branchOptions={checkout.branchOptions}
            branches={checkout.activeBranches}
            isSubmitting={checkout.isSubmitting}
            isDisabled={items.length === 0 || checkout.isSubmitting}
            onSubmit={checkout.handleSubmit}
            onFullNameChange={checkout.setFullName}
            onPhoneChange={checkout.setPhone}
            onCityChange={checkout.setCity}
            onStreetChange={checkout.setStreet}
            onBuildingChange={checkout.setBuilding}
            onApartmentChange={checkout.setApartment}
            onPostalCodeChange={checkout.setPostalCode}
            onBranchIdChange={checkout.setBranchId}
            onNoteChange={checkout.setNote}
            onDeliveryTypeChange={checkout.setDeliveryType}
            onPaymentMethodChange={checkout.setPaymentMethod}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
