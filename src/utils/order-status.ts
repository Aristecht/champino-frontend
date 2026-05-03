import { DeliveryType, OrderStatus } from "@/generated/output";

export const ORDER_STATUS_LABEL: Record<OrderStatus, string> = {
  PROCESSING: "В обработке",
  ASSEMBLING: "На сборке",
  READY_FOR_PICKUP: "Заберите с филиала",
  IN_TRANSIT: "В пути",
  DELIVERED: "Доставлен",
  COMPLETED: "Успешно завершен",
  CANCELLED: "Отменен",
  REFUNDED: "Возвращен",
};

export const ORDER_STATUS_CLASS: Record<OrderStatus, string> = {
  PROCESSING:
    "text-amber-700 bg-amber-50 dark:text-amber-400 dark:bg-amber-950/40",
  ASSEMBLING: "text-blue-700 bg-blue-50 dark:text-blue-400 dark:bg-blue-950/40",
  READY_FOR_PICKUP:
    "text-sky-700 bg-sky-50 dark:text-sky-400 dark:bg-sky-950/40",
  IN_TRANSIT: "text-blue-700 bg-blue-50 dark:text-blue-400 dark:bg-blue-950/40",
  DELIVERED:
    "text-emerald-700 bg-emerald-50 dark:text-emerald-400 dark:bg-emerald-950/40",
  COMPLETED:
    "text-emerald-700 bg-emerald-50 dark:text-emerald-400 dark:bg-emerald-950/40",
  CANCELLED: "text-red-700 bg-red-50 dark:text-red-400 dark:bg-red-950/40",
  REFUNDED:
    "text-purple-700 bg-purple-50 dark:text-purple-400 dark:bg-purple-950/40",
};

export function getOrderStatusLabel(
  status: OrderStatus,
  _deliveryType?: DeliveryType | null
): string {
  void _deliveryType;
  // Show the exact server status label; do not remap between tabs.
  return ORDER_STATUS_LABEL[status] ?? status;
}

const PICKUP_FLOW: OrderStatus[] = [
  OrderStatus.Processing,
  OrderStatus.Assembling,
  OrderStatus.ReadyForPickup,
  OrderStatus.Completed,
];

const COURIER_FLOW: OrderStatus[] = [
  OrderStatus.Processing,
  OrderStatus.Assembling,
  OrderStatus.InTransit,
  OrderStatus.Delivered,
];

export function getNextOrderStatuses(
  status: OrderStatus,
  deliveryType?: DeliveryType | null
): OrderStatus[] {
  const isPickup = deliveryType === DeliveryType.Pickup;
  const flow = isPickup ? PICKUP_FLOW : COURIER_FLOW;

  // For migrated orders with an intermediate status from the opposite flow,
  // only offer the safe corrective step first.
  if (isPickup && status === OrderStatus.InTransit) {
    return [OrderStatus.ReadyForPickup, OrderStatus.Cancelled];
  }

  if (!isPickup && status === OrderStatus.ReadyForPickup) {
    return [OrderStatus.InTransit, OrderStatus.Cancelled];
  }

  const idx = flow.indexOf(status);
  const next = idx >= 0 ? flow[idx + 1] : undefined;

  const finalStatus = isPickup ? OrderStatus.Completed : OrderStatus.Delivered;

  const options: OrderStatus[] = [];

  if (next) {
    options.push(next);
  }

  if (
    status !== finalStatus &&
    status !== OrderStatus.Cancelled &&
    status !== OrderStatus.Refunded
  ) {
    options.push(OrderStatus.Cancelled);
  }

  return options;
}
