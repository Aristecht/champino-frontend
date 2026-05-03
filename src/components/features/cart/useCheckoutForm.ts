"use client";

import { useEffect, useState } from "react";
import { useMutation, useQuery } from "@apollo/client/react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { authStore } from "@/store/auth/auth.store";
import { cartStore } from "@/store/cart/cart.store";
import type { CartItem } from "@/store/cart/cart.types";
import {
  DeliveryType,
  PaymentMethod,
  useFindProfileQuery,
} from "@/generated/output";
import {
  ADD_TO_CART,
  BranchesQuery,
  CANCEL_ORDER,
  CancelOrderResult,
  CLEAR_CART,
  CREATE_ORDER,
  CreateOrderResult,
  GET_BRANCHES,
  INIT_PAYMENT,
  InitPaymentResult,
} from "./checkoutApi";
import { SelectOption } from "../admin/products/CategoryCascadeSelect";

type BranchOption = BranchesQuery["getBranches"][number];

export function useCheckoutForm(items: CartItem[]) {
  const router = useRouter();
  const t = useTranslations("cart.checkout");
  const isAuthenticated = authStore((s) => s.isAuthenticated);
  const clearLocalCart = cartStore((s) => s.clearCart);
  const [open, setOpen] = useState(false);
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [street, setStreet] = useState("");
  const [building, setBuilding] = useState("");
  const [apartment, setApartment] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [branchId, setBranchId] = useState("");
  const [note, setNote] = useState("");
  const [deliveryType, setDeliveryType] = useState<DeliveryType>(
    DeliveryType.Courier
  );
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(
    PaymentMethod.CashOnDelivery
  );

  const { data: profileData } = useFindProfileQuery({ skip: !isAuthenticated });
  const { data: branchesData } = useQuery<BranchesQuery>(GET_BRANCHES);
  const [addToServerCart] = useMutation(ADD_TO_CART);
  const [clearServerCart] = useMutation(CLEAR_CART);
  const [cancelOrder] = useMutation<CancelOrderResult>(CANCEL_ORDER);
  const [createOrder, { loading: creatingOrder }] =
    useMutation<CreateOrderResult>(CREATE_ORDER);
  const [initPayment, { loading: startingPayment }] =
    useMutation<InitPaymentResult>(INIT_PAYMENT);

  useEffect(() => {
    const profile = profileData?.findProfile;
    if (!profile || fullName || phone) return;
    Promise.resolve().then(() => {
      setFullName(profile.username ?? "");
      setPhone(profile.phoneNumber ?? "");
    });
  }, [profileData, fullName, phone]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!isAuthenticated) {
      toast.info(t("loginRequired"));
      router.push("/account/login");
      return;
    }
    if (!fullName.trim() || !phone.trim())
      return toast.error(t("fillNamePhoneError"));
    if (
      deliveryType === DeliveryType.Courier &&
      (!city.trim() || !street.trim() || !building.trim())
    ) {
      return toast.error(t("fillAddressError"));
    }
    if (deliveryType === DeliveryType.Pickup && !branchId) {
      return toast.error(t("chooseBranchError"));
    }
    if (paymentMethod !== PaymentMethod.CashOnDelivery) {
      return toast.error(t("paymentFailed"));
    }

    try {
      await clearServerCart();
      for (const item of items) {
        await addToServerCart({
          variables: {
            data: { productId: item.productId, quantity: item.quantity },
          },
        });
      }

      const orderRes = await createOrder({
        variables: {
          data: {
            note: note.trim() || undefined,
            paymentMethod,
            shipping: {
              fullName: fullName.trim(),
              phone: phone.trim(),
              deliveryType,
              city:
                deliveryType === DeliveryType.Courier ? city.trim() : undefined,
              street:
                deliveryType === DeliveryType.Courier
                  ? street.trim()
                  : undefined,
              building:
                deliveryType === DeliveryType.Courier
                  ? building.trim()
                  : undefined,
              apartment: apartment.trim() || undefined,
              postalCode: postalCode.trim() || undefined,
              branchId:
                deliveryType === DeliveryType.Pickup ? branchId : undefined,
            },
          },
        },
      });

      const orderId = orderRes.data?.createOrder.id;
      if (!orderId) throw new Error("ORDER_NOT_CREATED");

      if (paymentMethod === PaymentMethod.CashOnDelivery) {
        await clearServerCart();
        clearLocalCart();
        setOpen(false);
        toast.success(t("orderCreatedCod"));
        router.push("/");
        return;
      }

      try {
        const paymentRes = await initPayment({ variables: { orderId } });
        const redirectUrl =
          paymentRes.data?.initPayment.paymentUrl ||
          paymentRes.data?.initPayment.formUrl ||
          paymentRes.data?.initPayment.qrUrl;
        if (!redirectUrl) throw new Error("PAYMENT_URL_NOT_FOUND");

        await clearServerCart();
        clearLocalCart();
        setOpen(false);
        window.location.assign(redirectUrl);
      } catch {
        await cancelOrder({ variables: { orderId } });
        toast.error(t("paymentFailed"));
      }
    } catch {
      toast.error(t("createOrderError"));
    }
  }

  const activeBranches = (branchesData?.getBranches ?? []).filter(
    (x: BranchOption) => x.isActive
  );
  const branchOptions: SelectOption[] = activeBranches.map((branch) => ({
    label: `${branch.name} · ${branch.city}, ${branch.address}`,
    value: branch.id,
  }));

  return {
    open,
    setOpen,
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
    activeBranches,
    branchOptions,
    isSubmitting: creatingOrder || startingPayment,
    handleSubmit,
    setFullName,
    setPhone,
    setCity,
    setStreet,
    setBuilding,
    setApartment,
    setPostalCode,
    setBranchId,
    setNote,
    setDeliveryType,
    setPaymentMethod,
  };
}
