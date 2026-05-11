"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { cn } from "@/utils/tw-merge";
import { ORDER_STATUS_CLASS, getOrderStatusLabel } from "@/utils/order-status";
import {
  useAdminGetAllOrdersQuery,
  useAdminRefundOrderMutation,
  useAdminUpdateOrderStatusMutation,
  OrderStatus,
} from "@/generated/output";
import { AdminOrderDetailModal } from "@/components/features/admin/orders/AdminOrderDetailModal";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/common/ui/DropdownMenu";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/common/ui/Pagination";
import { ChevronDown } from "lucide-react";

const LIMIT = 20;

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString("ru-RU", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function fmtKzt(n: number) {
  return new Intl.NumberFormat("ru-RU", {
    style: "currency",
    currency: "KZT",
    maximumFractionDigits: 0,
  }).format(n);
}

function getOriginalAmount(
  totalAmount: number,
  discountAmount?: number | null
) {
  return totalAmount + (discountAmount ?? 0);
}

const STATUS_TABS = [
  { value: OrderStatus.Refunded, label: "Возвраты" },
  { value: OrderStatus.Cancelled, label: "Отменённые" },
  { value: OrderStatus.Completed, label: "Завершенные самовывоз" },
  { value: OrderStatus.Delivered, label: "Доставленные" },
];

export default function AdminReturnsPage() {
  const t = useTranslations("admin");
  const [activeStatus, setActiveStatus] = useState<OrderStatus>(
    OrderStatus.Refunded
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);

  const { data, previousData, loading, refetch } = useAdminGetAllOrdersQuery({
    variables: {
      filter: { limit: LIMIT, page: currentPage, status: activeStatus },
    },
    fetchPolicy: "cache-and-network",
  });

  // Keep last successful response so table never blanks out on tab change / refetch
  const displayData = data ?? previousData;

  const [refundOrder, { loading: refunding }] = useAdminRefundOrderMutation({
    onCompleted: () => {
      toast.success("Возврат оформлен");
      refetch();
    },
    onError: (e) => toast.error(e.message || "Ошибка при возврате"),
  });

  const [updateStatus, { loading: updatingStatus }] =
    useAdminUpdateOrderStatusMutation({
      onCompleted: () => {
        toast.success("Статус обновлён");
        refetch();
      },
      onError: () => toast.error("Ошибка при обновлении статуса"),
    });

  const orders = displayData?.adminGetAllOrders?.data ?? [];
  const total = displayData?.adminGetAllOrders?.total ?? 0;
  const totalPages = Math.ceil(total / LIMIT);
  const isFirstLoad = !displayData && loading;
  const isRefreshing = !!previousData && !data && loading;

  function handleTabChange(status: OrderStatus) {
    setActiveStatus(status);
    setCurrentPage(1);
  }

  return (
    <div className="space-y-5 p-4 sm:p-6">
      <div>
        <h1 className="text-foreground text-xl font-semibold">
          {t("returns")}
        </h1>
        <p className="text-muted-foreground mt-0.5 text-sm">
          {isFirstLoad ? "\u00a0" : `${total} заявок`}
        </p>
      </div>

      <div className="bg-card border-border rounded-lg border">
        <div className="border-b px-4 py-3">
          <div className="overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <div className="flex min-w-max gap-1">
              {STATUS_TABS.map((tab) => (
                <button
                  key={tab.value}
                  onClick={() => handleTabChange(tab.value)}
                  className={cn(
                    "rounded-md px-3 py-1.5 text-xs font-medium whitespace-nowrap transition-colors",
                    activeStatus === tab.value
                      ? "bg-foreground text-background"
                      : "text-muted-foreground hover:bg-accent"
                  )}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Mobile cards */}
        <div className="sm:hidden">
          {isFirstLoad ? (
            Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className="flex items-start gap-3 border-b px-4 py-4 last:border-0"
              >
                <div className="min-w-0 flex-1 space-y-2">
                  <div className="bg-muted h-3 w-24 animate-pulse rounded" />
                  <div className="bg-muted h-4 w-36 animate-pulse rounded" />
                  <div className="bg-muted h-3 w-28 animate-pulse rounded" />
                </div>
                <div className="bg-muted h-5 w-16 animate-pulse rounded-full" />
              </div>
            ))
          ) : orders.length === 0 ? (
            <div className="text-muted-foreground px-5 py-12 text-center text-sm">
              Нет заказов
            </div>
          ) : (
            <div
              className={cn(
                "transition-opacity duration-200",
                isRefreshing && "opacity-50"
              )}
            >
              {orders.map((o) => (
                <div
                  key={o.id}
                  onClick={() => setSelectedOrderId(o.id)}
                  className="hover:bg-muted/30 flex cursor-pointer items-start gap-3 border-b px-4 py-3.5 transition-colors last:border-0"
                >
                  <div className="min-w-0 flex-1 space-y-1">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="text-foreground font-mono text-xs">
                        {o.id.slice(0, 8)}…
                      </span>
                      <span
                        className={cn(
                          "inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium",
                          ORDER_STATUS_CLASS[o.status] ??
                            "bg-muted text-muted-foreground"
                        )}
                      >
                        {getOrderStatusLabel(
                          o.status,
                          o.shipping?.deliveryType ?? null
                        )}
                      </span>
                    </div>
                    <p className="text-foreground text-sm">
                      {o.shipping?.fullName ?? "—"}
                    </p>
                    {o.shipping?.phone && (
                      <p className="text-muted-foreground text-xs">
                        {o.shipping.phone}
                      </p>
                    )}
                    <div className="text-muted-foreground flex items-center gap-2 text-xs">
                      <span>{o.items.length} тов.</span>
                      <span>·</span>
                      <span>{fmtDate(o.createdAt)}</span>
                    </div>
                  </div>
                  <div className="flex shrink-0 flex-col items-end gap-2">
                    <span className="text-foreground font-medium tabular-nums">
                      {fmtKzt(o.totalAmount)}
                    </span>
                    {(o.discountAmount ?? 0) > 0 && (
                      <span className="text-muted-foreground text-xs line-through">
                        {fmtKzt(
                          getOriginalAmount(o.totalAmount, o.discountAmount)
                        )}
                      </span>
                    )}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button
                          onClick={(e) => e.stopPropagation()}
                          disabled={refunding || updatingStatus}
                          className="hover:bg-accent flex h-7 items-center gap-1 rounded-md px-2 transition-colors disabled:opacity-50"
                        >
                          <span className="text-muted-foreground text-xs">
                            Действие
                          </span>
                          <ChevronDown className="text-muted-foreground h-3 w-3" />
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        align="end"
                        className="w-48"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {o.status !== OrderStatus.Refunded && (
                          <DropdownMenuItem
                            disabled={refunding}
                            onClick={() =>
                              refundOrder({ variables: { orderId: o.id } })
                            }
                          >
                            Оформить возврат
                          </DropdownMenuItem>
                        )}
                        {o.status !== OrderStatus.Cancelled && (
                          <DropdownMenuItem
                            disabled={updatingStatus}
                            onClick={() =>
                              updateStatus({
                                variables: {
                                  orderId: o.id,
                                  data: { status: OrderStatus.Cancelled },
                                },
                              })
                            }
                          >
                            Отменить заказ
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Desktop table */}
        <div className="hidden overflow-x-auto sm:block">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                {[
                  "Заказ",
                  "Клиент",
                  "Товары",
                  "Сумма",
                  "Статус",
                  "Дата",
                  "",
                ].map((h) => (
                  <th
                    key={h}
                    className="text-muted-foreground px-4 py-2.5 text-left text-xs font-medium first:pl-5"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody
              className={cn(
                "transition-opacity duration-200",
                isRefreshing && "opacity-50"
              )}
            >
              {isFirstLoad ? (
                Array.from({ length: 6 }).map((_, i) => (
                  <tr key={i} className="border-b last:border-0">
                    {Array.from({ length: 7 }).map((_, j) => (
                      <td key={j} className="px-4 py-3.5 first:pl-5">
                        <div
                          className="bg-muted h-4 animate-pulse rounded"
                          style={{ width: j === 0 ? "70px" : "50%" }}
                        />
                      </td>
                    ))}
                  </tr>
                ))
              ) : orders.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="text-muted-foreground px-5 py-12 text-center text-sm"
                  >
                    Нет заказов
                  </td>
                </tr>
              ) : (
                orders.map((o, i) => (
                  <tr
                    key={o.id}
                    onClick={() => setSelectedOrderId(o.id)}
                    className={cn(
                      "hover:bg-muted/30 cursor-pointer transition-colors",
                      i < orders.length - 1 && "border-b"
                    )}
                  >
                    <td className="text-foreground py-3.5 pr-4 pl-5 font-mono text-xs">
                      {o.id}
                    </td>
                    <td className="px-4 py-3.5">
                      <p className="text-foreground text-sm">
                        {o.shipping?.fullName ?? "—"}
                      </p>
                      {o.shipping?.phone && (
                        <p className="text-muted-foreground text-xs">
                          {o.shipping.phone}
                        </p>
                      )}
                    </td>
                    <td className="text-foreground px-4 py-3.5 text-sm">
                      {o.items.length}
                    </td>
                    <td className="text-foreground px-4 py-3.5 font-medium">
                      <span>{fmtKzt(o.totalAmount)}</span>
                      {(o.discountAmount ?? 0) > 0 && (
                        <div className="mt-0.5 space-y-0.5 text-xs">
                          <p className="text-muted-foreground line-through">
                            {fmtKzt(
                              getOriginalAmount(o.totalAmount, o.discountAmount)
                            )}
                          </p>
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3.5">
                      <span
                        className={cn(
                          "inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium",
                          ORDER_STATUS_CLASS[o.status] ??
                            "bg-muted text-muted-foreground"
                        )}
                      >
                        {getOrderStatusLabel(
                          o.status,
                          o.shipping?.deliveryType ?? null
                        )}
                      </span>
                    </td>
                    <td className="text-muted-foreground px-4 py-3.5 text-xs">
                      {fmtDate(o.createdAt)}
                    </td>
                    <td className="px-4 py-3.5 pr-5">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button
                            onClick={(e) => e.stopPropagation()}
                            disabled={refunding || updatingStatus}
                            className="hover:bg-accent flex h-7 items-center gap-1 rounded-md px-2 transition-colors disabled:opacity-50"
                          >
                            <span className="text-muted-foreground text-xs">
                              Действие
                            </span>
                            <ChevronDown className="text-muted-foreground h-3 w-3" />
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                          align="end"
                          className="w-48"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {o.status !== OrderStatus.Refunded && (
                            <DropdownMenuItem
                              disabled={refunding}
                              onClick={() =>
                                refundOrder({ variables: { orderId: o.id } })
                              }
                            >
                              Оформить возврат
                            </DropdownMenuItem>
                          )}
                          {o.status !== OrderStatus.Cancelled && (
                            <DropdownMenuItem
                              disabled={updatingStatus}
                              onClick={() =>
                                updateStatus({
                                  variables: {
                                    orderId: o.id,
                                    data: { status: OrderStatus.Cancelled },
                                  },
                                })
                              }
                            >
                              Отменить заказ
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="min-h-13 border-t px-4 py-3">
          {totalPages > 1 && (
            <Pagination>
              <PaginationContent>
                {currentPage > 1 && (
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      className="cursor-pointer"
                      label="Назад"
                    />
                  </PaginationItem>
                )}
                {Array.from({ length: totalPages }).map((_, i) => {
                  const page = i + 1;
                  if (
                    page === 1 ||
                    page === totalPages ||
                    (page >= currentPage - 1 && page <= currentPage + 1)
                  ) {
                    return (
                      <PaginationItem key={page}>
                        <PaginationLink
                          isActive={page === currentPage}
                          onClick={() => setCurrentPage(page)}
                          className="cursor-pointer"
                        >
                          {page}
                        </PaginationLink>
                      </PaginationItem>
                    );
                  }
                  if (page === currentPage - 2 || page === currentPage + 2)
                    return <PaginationEllipsis key={page} />;
                  return null;
                })}
                {currentPage < totalPages && (
                  <PaginationItem>
                    <PaginationNext
                      onClick={() => setCurrentPage((p) => p + 1)}
                      className="cursor-pointer"
                      label="Вперёд"
                    />
                  </PaginationItem>
                )}
              </PaginationContent>
            </Pagination>
          )}
        </div>
      </div>

      <AdminOrderDetailModal
        orderId={selectedOrderId}
        onClose={() => setSelectedOrderId(null)}
        onRefetch={refetch}
      />
    </div>
  );
}
