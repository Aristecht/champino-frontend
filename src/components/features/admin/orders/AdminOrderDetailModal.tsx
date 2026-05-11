"use client";

import Image from "next/image";
import { Loader2, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/utils/tw-merge";
import { storageUrl } from "@/utils/storage-url";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/common/ui/Dialog";
import {
  useAdminGetBranchesQuery,
  useAdminGetOrderQuery,
  useAdminRefundOrderMutation,
  useAdminUpdateOrderStatusMutation,
  OrderStatus,
  DeliveryType,
  PaymentMethod,
  PaymentsStatus,
} from "@/generated/output";
import {
  ORDER_STATUS_CLASS,
  getOrderStatusLabel,
  getNextOrderStatuses,
} from "@/utils/order-status";

const DELIVERY_LABEL: Record<string, string> = {
  COURIER: "Курьер",
  PICKUP: "Самовывоз",
};

const PAYMENT_LABEL: Record<string, string> = {
  CASH_ON_DELIVERY: "Наличными при получении",
  KASPI_PAY: "Kaspi Pay",
  HALYK_EKVAYRING: "Halyk Эквайринг",
};

const PAYMENT_STATUS_LABEL: Record<string, string> = {
  PENDING: "Ожидает",
  PROCESSING: "В обработке",
  SUCCEEDED: "Успешно",
  FAILED: "Ошибка",
  REFUNDED: "Возвращён",
  EXPIRED: "Истёк",
};

function fmtMoney(n: number, currency = "KZT") {
  return new Intl.NumberFormat("ru-RU", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(n);
}

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString("ru-RU", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function getOriginalAmount(
  totalAmount: number,
  discountAmount?: number | null
) {
  return totalAmount + (discountAmount ?? 0);
}

interface AdminOrderDetailModalProps {
  orderId: string | null;
  onClose: () => void;
  onRefetch: () => void;
}

export function AdminOrderDetailModal({
  orderId,
  onClose,
  onRefetch,
}: AdminOrderDetailModalProps) {
  const safeOrderId = orderId ?? "";
  const { data, loading, error, refetch } = useAdminGetOrderQuery({
    variables: { orderId: safeOrderId },
    skip: !orderId,
    fetchPolicy: "network-only",
  });
  const { data: branchesData } = useAdminGetBranchesQuery();
  const [refundOrder, { loading: refunding }] = useAdminRefundOrderMutation();
  const [updateStatus, { loading: updatingStatus }] =
    useAdminUpdateOrderStatusMutation();

  const order = data?.adminGetOrder;
  const effectiveStatus = order?.status;
  const selectedBranch = branchesData?.adminGetBranches.find(
    (b) => b.id === order?.shipping?.branchId
  );

  function handleRefund() {
    if (!orderId) return;
    refundOrder({ variables: { orderId } })
      .then((res) => {
        if (res.data?.adminRefundOrder) {
          toast.success("Возврат оформлен");
          refetch();
          onRefetch();
        } else {
          toast.error("Не удалось оформить возврат");
        }
      })
      .catch(() => toast.error("Ошибка при возврате"));
  }

  function handleStatusChange(status: OrderStatus) {
    if (!orderId) return;
    updateStatus({ variables: { orderId, data: { status } } })
      .then(() => {
        toast.success("Статус обновлён");
        refetch();
        onRefetch();
      })
      .catch(() => toast.error("Ошибка при обновлении статуса"));
  }

  const isOrderPaid = order?.payment?.status === PaymentsStatus.Succeeded;
  const isCashOnDelivery =
    order?.payment?.method === PaymentMethod.CashOnDelivery;

  const displayPaymentStatus =
    order?.payment &&
    order.payment.method === PaymentMethod.CashOnDelivery &&
    order.status === OrderStatus.Completed
      ? PaymentsStatus.Succeeded
      : order?.payment?.status;

  const canRefund =
    !!order &&
    !!order.payment &&
    isOrderPaid &&
    !isCashOnDelivery &&
    order.payment.status !== PaymentsStatus.Refunded &&
    [
      OrderStatus.Processing,
      OrderStatus.Assembling,
      OrderStatus.ReadyForPickup,
      OrderStatus.InTransit,
      OrderStatus.Delivered,
      OrderStatus.Completed,
      OrderStatus.Cancelled,
    ].includes(order.status);

  const canChangeStatus =
    !!order &&
    order.status !== OrderStatus.Completed &&
    order.status !== OrderStatus.Refunded;

  return (
    <Dialog open={!!orderId} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-h-dvh w-[calc(100vw-1rem)] max-w-2xl overflow-y-auto rounded-xl p-4 sm:max-h-[90vh] sm:w-full sm:p-6">
        <DialogHeader>
          <DialogTitle className="pr-8 text-base sm:text-lg">
            {loading || !order ? (
              "Загрузка заказа…"
            ) : (
              <span>
                Заказ{" "}
                <span className="font-mono text-xs sm:text-sm">
                  #{order.id.slice(0, 8).toUpperCase()}
                </span>
              </span>
            )}
          </DialogTitle>
        </DialogHeader>

        {loading && (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="text-muted-foreground h-8 w-8 animate-spin" />
          </div>
        )}

        {!loading && error && (
          <div className="flex items-center gap-3 rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-900/40 dark:bg-red-950/20">
            <AlertCircle className="h-5 w-5 shrink-0 text-red-500" />
            <p className="text-sm text-red-700 dark:text-red-400">
              Не удалось загрузить заказ: {error.message}
            </p>
          </div>
        )}

        {!loading && order && (
          <div className="space-y-4 pt-1 sm:space-y-5">
            {/* Status + actions */}
            <div className="flex flex-wrap items-center gap-3">
              <span
                className={cn(
                  "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium",
                  ORDER_STATUS_CLASS[effectiveStatus ?? order.status] ??
                    "bg-muted text-muted-foreground"
                )}
              >
                {getOrderStatusLabel(
                  effectiveStatus ?? order.status,
                  order.shipping?.deliveryType ?? null
                )}
              </span>
              <p className="text-muted-foreground text-xs">
                {fmtDate(order.createdAt)}
              </p>
            </div>

            {/* Customer note */}
            {order.note && (
              <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 dark:border-amber-900/40 dark:bg-amber-950/20">
                <p className="mb-1 text-xs font-semibold tracking-wide text-amber-800 uppercase dark:text-amber-300">
                  Сообщение клиента
                </p>
                <p className="text-sm text-amber-900 dark:text-amber-200">
                  {order.note}
                </p>
              </div>
            )}

            {/* Items */}
            <div>
              <p className="text-foreground mb-2 text-sm font-semibold">
                Товары ({order.items.length})
              </p>
              <div className="space-y-2">
                {order.items.map((item) => {
                  const imgSrc = storageUrl(item.product?.images?.[0] ?? null);
                  return (
                    <div
                      key={item.id}
                      className="bg-muted/30 flex items-start gap-3 rounded-lg p-2"
                    >
                      <div className="bg-muted relative h-12 w-12 shrink-0 overflow-hidden rounded-md sm:h-14 sm:w-14">
                        {imgSrc && (
                          <Image
                            src={imgSrc}
                            alt={item.product?.name ?? ""}
                            fill
                            className="object-cover"
                            unoptimized
                          />
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-foreground truncate text-sm leading-snug font-medium">
                          {item.product?.name ?? "Товар"}
                        </p>
                        {item.variantName && (
                          <p className="text-muted-foreground text-xs">
                            {item.variantName}
                          </p>
                        )}
                        <p className="text-muted-foreground text-xs">
                          {item.quantity} шт. × {fmtMoney(item.priceAtOrder)}
                        </p>
                      </div>
                      <p className="text-foreground shrink-0 text-sm font-semibold tabular-nums">
                        {fmtMoney(item.subtotal)}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Totals */}
            <div className="border-t pt-3 text-sm">
              {order.discountAmount && order.discountAmount > 0 ? (
                <>
                  <div className="text-muted-foreground mb-1 flex justify-between">
                    <span>Было</span>
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
                    <span>Скидка</span>
                    <span>−{fmtMoney(order.discountAmount)}</span>
                  </div>
                </>
              ) : null}
              <div className="flex justify-between font-semibold">
                <span>Итого</span>
                <span>{fmtMoney(order.totalAmount)}</span>
              </div>
            </div>

            {/* Shipping */}
            {order.shipping && (
              <div>
                <p className="text-foreground mb-1.5 text-sm font-semibold">
                  Доставка
                </p>
                <div className="text-muted-foreground space-y-0.5 text-sm">
                  <p>
                    {DELIVERY_LABEL[order.shipping.deliveryType] ??
                      order.shipping.deliveryType}
                  </p>
                  <p>{order.shipping.fullName}</p>
                  <p>{order.shipping.phone}</p>
                  {order.shipping.deliveryType === DeliveryType.Courier && (
                    <p>
                      {[
                        order.shipping.city,
                        order.shipping.street,
                        order.shipping.building,
                        order.shipping.apartment,
                        order.shipping.postalCode,
                      ]
                        .filter(Boolean)
                        .join(", ")}
                    </p>
                  )}
                  {order.shipping.deliveryType === DeliveryType.Pickup &&
                    order.shipping.branchId && (
                      <p>
                        Филиал: {selectedBranch?.name ?? "Не найден"}
                        {selectedBranch?.address
                          ? `, ${selectedBranch.city}, ${selectedBranch.address}`
                          : ""}
                      </p>
                    )}
                </div>
              </div>
            )}

            {/* Payment */}
            {order.payment && (
              <div>
                <p className="text-foreground mb-1.5 text-sm font-semibold">
                  Оплата
                </p>
                <div className="text-muted-foreground space-y-0.5 text-sm">
                  <p>
                    {PAYMENT_LABEL[order.payment.method] ??
                      order.payment.method}
                  </p>
                  <p>
                    Статус:{" "}
                    <span className="text-foreground">
                      {displayPaymentStatus
                        ? (PAYMENT_STATUS_LABEL[displayPaymentStatus] ??
                          displayPaymentStatus)
                        : "—"}
                    </span>
                  </p>
                  <p>
                    Сумма:{" "}
                    {fmtMoney(order.payment.amount, order.payment.currency)}
                  </p>
                  {order.payment.paidAt && (
                    <p>Оплачено: {fmtDate(order.payment.paidAt)}</p>
                  )}
                </div>
              </div>
            )}

            {/* Admin actions */}
            <div className="space-y-3 border-t pt-4">
              {/* Change status */}
              {canChangeStatus && (
                <div>
                  <p className="text-foreground mb-2 text-sm font-semibold">
                    Изменить статус
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {getNextOrderStatuses(
                      order.status,
                      order.shipping?.deliveryType ?? null
                    ).map((s) => (
                      <button
                        key={s}
                        onClick={() => handleStatusChange(s)}
                        disabled={updatingStatus}
                        className="hover:bg-accent rounded-md border px-3 py-2 text-xs font-medium transition-colors disabled:opacity-50"
                      >
                        {getOrderStatusLabel(
                          s,
                          order.shipping?.deliveryType ?? null
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Refund */}
              {canRefund && (
                <button
                  onClick={handleRefund}
                  disabled={refunding}
                  className="flex w-full items-center justify-center gap-2 rounded-lg bg-purple-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-purple-700 disabled:opacity-50"
                >
                  {refunding ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Оформление возврата…
                    </>
                  ) : (
                    "Оформить возврат денежных средств"
                  )}
                </button>
              )}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
