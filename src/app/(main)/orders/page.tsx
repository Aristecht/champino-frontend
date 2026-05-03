"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Package, ChevronDown, ChevronUp, AlertCircle } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { toast } from "sonner";
import { cn } from "@/utils/tw-merge";
import { storageUrl } from "@/utils/storage-url";
import { ORDER_STATUS_CLASS, getOrderStatusLabel } from "@/utils/order-status";
import {
  useGetMyOrdersQuery,
  useCancelOrderMutation,
  OrderStatus,
  DeliveryType,
  PaymentMethod,
  PaymentsStatus,
} from "@/generated/output";

const DELIVERY_LABEL_KEY: Record<string, string> = {
  COURIER: "deliveryCourier",
  PICKUP: "deliveryPickup",
};

const PAYMENT_LABEL_KEY: Record<string, string> = {
  CASH_ON_DELIVERY: "paymentCod",
  KASPI_PAY: "paymentKaspi",
  HALYK_EKVAYRING: "paymentHalyk",
};

const PAYMENT_STATUS_LABEL_KEY: Record<string, string> = {
  PENDING: "paymentStatusPending",
  PROCESSING: "paymentStatusProcessing",
  SUCCEEDED: "paymentStatusSucceeded",
  FAILED: "paymentStatusFailed",
  REFUNDED: "paymentStatusRefunded",
  EXPIRED: "paymentStatusExpired",
};

function getOriginalAmount(
  totalAmount: number,
  discountAmount?: number | null
) {
  return totalAmount + (discountAmount ?? 0);
}

const CANCELLABLE = [OrderStatus.Processing, OrderStatus.Assembling];

export default function MyOrdersPage() {
  const t = useTranslations("orders");
  const locale = useLocale();
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [cancellingId, setCancellingId] = useState<string | null>(null);

  const fmtMoney = (n: number) =>
    new Intl.NumberFormat(locale, {
      style: "currency",
      currency: "KZT",
      maximumFractionDigits: 0,
    }).format(n);

  const fmtDate = (iso: string) =>
    new Date(iso).toLocaleDateString(locale, {
      day: "numeric",
      month: "long",
      year: "numeric",
    });

  const { data, loading, error, refetch } = useGetMyOrdersQuery({
    variables: { filter: { limit: 50, page: 1 } },
    fetchPolicy: "network-only",
  });

  const [cancelOrder] = useCancelOrderMutation();

  const orders = data?.getMyOrders?.data ?? [];

  const getLabel = (value: string, map: Record<string, string>) => {
    const key = map[value];
    return key ? t(key) : value;
  };

  function getDisplayPaymentStatus(
    method: PaymentMethod,
    status: PaymentsStatus,
    orderStatus: OrderStatus
  ) {
    if (
      method === PaymentMethod.CashOnDelivery &&
      orderStatus === OrderStatus.Completed
    ) {
      return PaymentsStatus.Succeeded;
    }
    return status;
  }

  function toggleExpand(id: string) {
    setExpandedId((prev) => (prev === id ? null : id));
  }

  function handleCancel(orderId: string) {
    setCancellingId(orderId);
    cancelOrder({ variables: { orderId } })
      .then((res) => {
        if (res.data?.cancelOrder) {
          toast.success(t("cancelSent"));
          refetch();
        } else {
          toast.error(t("cancelFailed"));
        }
      })
      .catch(() => toast.error(t("cancelError")))
      .finally(() => setCancellingId(null));
  }

  if (loading && orders.length === 0) {
    return (
      <div className="mx-auto max-w-3xl space-y-4 px-4 py-8">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="bg-card border-border h-28 animate-pulse rounded-xl border"
          />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 text-center">
        <AlertCircle className="mx-auto mb-3 h-10 w-10 text-red-500 opacity-60" />
        <p className="text-foreground text-sm font-medium">
          {t("loadErrorTitle")}
        </p>
        <p className="text-muted-foreground mt-1 text-xs">{error.message}</p>
        <button
          onClick={() => refetch()}
          className="bg-primary text-primary-foreground mt-4 rounded-md px-4 py-2 text-xs font-medium hover:opacity-90"
        >
          {t("retry")}
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl px-4 py-8 sm:mx-16">
      <h1 className="text-foreground mb-6 text-xl font-semibold">
        {t("title")}
      </h1>

      {orders.length === 0 ? (
        <div className="text-muted-foreground flex flex-col items-center gap-3 py-20 text-center">
          <Package className="h-12 w-12 opacity-30" />
          <p className="text-sm">{t("empty")}</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => {
            const isExpanded = expandedId === order.id;
            const canCancel = CANCELLABLE.includes(order.status);
            const isCancelling = cancellingId === order.id;

            return (
              <div
                key={order.id}
                className="bg-card border-border overflow-hidden rounded-xl border"
              >
                {/* Header */}
                <button
                  onClick={() => toggleExpand(order.id)}
                  className="hover:bg-muted/30 flex w-full items-start justify-between gap-4 p-4 text-left transition-colors"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-muted-foreground font-mono text-xs">
                        #{order.id.slice(0, 8).toUpperCase()}
                      </span>
                      <span
                        className={cn(
                          "inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium",
                          ORDER_STATUS_CLASS[order.status] ??
                            "bg-muted text-muted-foreground"
                        )}
                      >
                        {getOrderStatusLabel(
                          order.status,
                          order.shipping?.deliveryType ?? null
                        )}
                      </span>
                    </div>
                    <p className="text-foreground mt-1 text-sm font-medium">
                      {t("totalInline", { value: fmtMoney(order.totalAmount) })}
                    </p>
                    {(order.discountAmount ?? 0) > 0 && <></>}
                    <p className="text-muted-foreground mt-1 text-xs">
                      {fmtDate(order.createdAt)}
                    </p>
                  </div>
                  <div className="text-muted-foreground mt-1 shrink-0">
                    {isExpanded ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    )}
                  </div>
                </button>

                {/* Expanded details */}
                {isExpanded && (
                  <div className="space-y-4 border-t px-4 pt-3 pb-4">
                    {/* Items */}
                    <div className="space-y-2">
                      {order.items.map((item) => {
                        const imgSrc = storageUrl(
                          item.product?.images?.[0] ?? null
                        );
                        const productHref = item.product?.id
                          ? `/catalog/${item.product.id}`
                          : null;
                        return (
                          <div
                            key={item.id}
                            className="flex items-center gap-3"
                          >
                            <Link
                              href={productHref ?? "#"}
                              className="bg-muted relative h-12 w-12 shrink-0 overflow-hidden rounded-lg"
                              onClick={(e) =>
                                !productHref && e.preventDefault()
                              }
                            >
                              {imgSrc && (
                                <Image
                                  src={imgSrc}
                                  alt={item.product?.name ?? ""}
                                  fill
                                  className="object-cover"
                                  unoptimized
                                />
                              )}
                            </Link>
                            <div className="min-w-0 flex-1">
                              {productHref ? (
                                <Link
                                  href={productHref}
                                  className="text-foreground hover:text-primary truncate text-sm font-medium transition-colors"
                                >
                                  {item.product?.name ?? t("productFallback")}
                                </Link>
                              ) : (
                                <p className="text-foreground truncate text-sm font-medium">
                                  {item.product?.name ?? t("productFallback")}
                                </p>
                              )}
                              {item.variantName && (
                                <p className="text-muted-foreground text-xs">
                                  {item.variantName}
                                </p>
                              )}
                              <p className="text-muted-foreground text-xs">
                                {item.quantity} × {fmtMoney(item.priceAtOrder)}
                              </p>
                            </div>
                            <p className="text-foreground shrink-0 text-sm font-medium">
                              {fmtMoney(item.subtotal)}
                            </p>
                          </div>
                        );
                      })}
                    </div>

                    {/* Shipping */}
                    {order.shipping && (
                      <div className="text-muted-foreground space-y-1 text-xs">
                        <p className="text-foreground text-sm font-medium">
                          {t("shipping")}
                        </p>
                        <p>
                          {getLabel(
                            order.shipping.deliveryType,
                            DELIVERY_LABEL_KEY
                          )}
                        </p>
                        <p>
                          {order.shipping.fullName} · {order.shipping.phone}
                        </p>
                        {order.shipping.deliveryType ===
                          DeliveryType.Courier && (
                          <p>
                            {[
                              order.shipping.city,
                              order.shipping.street,
                              order.shipping.building,
                              order.shipping.apartment,
                            ]
                              .filter(Boolean)
                              .join(", ")}
                          </p>
                        )}
                      </div>
                    )}

                    {/* Payment */}
                    {order.payment && (
                      <div className="text-muted-foreground space-y-1 text-xs">
                        <p className="text-foreground text-sm font-medium">
                          {t("payment")}
                        </p>
                        <p>
                          {getLabel(order.payment.method, PAYMENT_LABEL_KEY)}
                        </p>
                        <p>
                          {t("paymentStatus")}:{" "}
                          {t(
                            PAYMENT_STATUS_LABEL_KEY[
                              getDisplayPaymentStatus(
                                order.payment.method,
                                order.payment.status,
                                order.status
                              )
                            ] ?? "paymentStatusPending"
                          )}
                        </p>
                      </div>
                    )}

                    {/* Note */}
                    {order.note && (
                      <div className="bg-muted/50 rounded-lg p-3">
                        <p className="text-muted-foreground mb-1 text-xs font-medium">
                          {t("yourComment")}
                        </p>
                        <p className="text-foreground text-sm">{order.note}</p>
                      </div>
                    )}

                    {/* Totals */}
                    <div className="border-t pt-3 text-sm">
                      {order.discountAmount && order.discountAmount > 0 ? (
                        <>
                          <div className="text-muted-foreground mb-1 flex justify-between">
                            <span>{t("was")}</span>
                            <span className="line-through">
                              {fmtMoney(
                                getOriginalAmount(
                                  order.totalAmount,
                                  order.discountAmount
                                )
                              )}
                            </span>
                          </div>
                          <div className="mb-1 flex justify-between text-green-600 dark:text-green-400">
                            <span>{t("discount")}</span>
                            <span>−{fmtMoney(order.discountAmount)}</span>
                          </div>
                        </>
                      ) : null}
                      <div className="flex justify-between font-semibold">
                        <span>{t("total")}</span>
                        <span>{fmtMoney(order.totalAmount)}</span>
                      </div>
                    </div>

                    {/* Cancel button */}
                    {canCancel && (
                      <div className="flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 p-3 dark:border-amber-900/50 dark:bg-amber-950/20">
                        <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-amber-600 dark:text-amber-400" />
                        <div className="flex-1">
                          <p className="text-xs text-amber-800 dark:text-amber-300">
                            {t("cancelHint")}
                          </p>
                          <button
                            onClick={() => handleCancel(order.id)}
                            disabled={isCancelling}
                            className="mt-2 rounded-md bg-red-100 px-3 py-1.5 text-xs font-medium text-red-700 transition-colors hover:bg-red-200 disabled:opacity-50 dark:bg-red-950/40 dark:text-red-400"
                          >
                            {isCancelling ? t("sending") : t("requestCancel")}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
