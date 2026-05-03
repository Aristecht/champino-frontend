"use client";

import { useState } from "react";
import { Eye, ChevronDown } from "lucide-react";
import { useTranslations } from "next-intl";
import { cn } from "@/utils/tw-merge";
import { toast } from "sonner";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/common/ui/Pagination";
import {
  useAdminGetAllOrdersQuery,
  useAdminUpdateOrderStatusMutation,
  OrderStatus,
} from "@/generated/output";
import {
  ORDER_STATUS_CLASS,
  getOrderStatusLabel,
  getNextOrderStatuses,
} from "@/utils/order-status";
import { AdminOrderDetailModal } from "@/components/features/admin/orders/AdminOrderDetailModal";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/common/ui/DropdownMenu";

function fmtKzt(n: number) {
  return new Intl.NumberFormat("ru-RU", {
    style: "currency",
    currency: "KZT",
    maximumFractionDigits: 0,
  }).format(n);
}

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString("ru-RU", {
    day: "numeric",
    month: "short",
  });
}

function getOriginalAmount(
  totalAmount: number,
  discountAmount?: number | null
) {
  return totalAmount + (discountAmount ?? 0);
}

export default function AdminOrdersPage() {
  const t = useTranslations("admin");
  const [activeStatus, setActiveStatus] = useState<OrderStatus | undefined>(
    undefined
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);

  const STATUS_TABS = [
    { value: undefined, label: t("allOrders") },
    { value: OrderStatus.Processing, label: "В обработке" },
    { value: OrderStatus.Assembling, label: "На сборке" },
    { value: OrderStatus.ReadyForPickup, label: "Заберите с филиала" },
    { value: OrderStatus.InTransit, label: "В пути" },
    { value: OrderStatus.Delivered, label: "Доставлен" },
    { value: OrderStatus.Completed, label: "Успешно завершен" },
    { value: OrderStatus.Cancelled, label: "Отменен" },
    { value: OrderStatus.Refunded, label: "Возвращен" },
  ];

  function handleTabChange(status: OrderStatus | undefined) {
    setActiveStatus(status);
    setCurrentPage(1);
  }

  const { data, previousData, loading, refetch } = useAdminGetAllOrdersQuery({
    variables: {
      filter: { limit: 20, page: currentPage, status: activeStatus },
    },
    fetchPolicy: "cache-and-network",
  });

  const [updateStatus, { loading: updatingStatus }] =
    useAdminUpdateOrderStatusMutation({
      onCompleted: () => {
        toast.success(t("statusUpdated"));
        refetch();
      },
      onError: () => toast.error(t("statusUpdateError")),
    });

  // Keep old data visible while new tab/page is loading
  const displayData = data ?? previousData;
  const orders = displayData?.adminGetAllOrders?.data ?? [];
  const total = displayData?.adminGetAllOrders?.total ?? 0;
  const limit = 20;
  const totalPages = Math.ceil(total / limit);
  const isFirstLoad = !displayData && loading;
  const isRefreshing = !!previousData && !data && loading;

  return (
    <div className="space-y-5 p-6">
      <div>
        <h1 className="text-foreground text-xl font-semibold">{t("orders")}</h1>
        <p className="text-muted-foreground mt-0.5 text-sm">
          {isFirstLoad ? "\u00a0" : `${total} ${t("orders").toLowerCase()}`}
        </p>
      </div>

      <div className="bg-card border-border rounded-lg border">
        <div className="flex flex-wrap items-center gap-2 border-b px-4 py-3">
          <div className="flex gap-1">
            {STATUS_TABS.map((tab) => (
              <button
                key={String(tab.value)}
                onClick={() => handleTabChange(tab.value)}
                className={cn(
                  "rounded-md px-3 py-1.5 text-xs font-medium transition-colors",
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

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                {[
                  t("orderId"),
                  t("customer"),
                  t("itemsCount"),
                  t("total"),
                  t("status"),
                  t("date"),
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
                Array.from({ length: 7 }).map((_, i) => (
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
                    {t("noOrders")}
                  </td>
                </tr>
              ) : (
                orders.map((o, i) => {
                  const nextStatuses = getNextOrderStatuses(
                    o.status,
                    o.shipping?.deliveryType ?? null
                  );
                  const isFinalOrder =
                    o.status === OrderStatus.Completed ||
                    o.status === OrderStatus.Refunded;
                  return (
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
                                getOriginalAmount(
                                  o.totalAmount,
                                  o.discountAmount
                                )
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
                        {!isFinalOrder && nextStatuses.length > 0 ? (
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <button
                                onClick={(e) => e.stopPropagation()}
                                disabled={updatingStatus}
                                className="hover:bg-accent flex h-7 items-center gap-1 rounded-md px-2 transition-colors disabled:opacity-50"
                              >
                                <Eye className="text-muted-foreground h-3.5 w-3.5" />
                                <ChevronDown className="text-muted-foreground h-3 w-3" />
                              </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                              align="end"
                              className="w-44"
                              onClick={(e) => e.stopPropagation()}
                            >
                              {nextStatuses.map((s) => (
                                <DropdownMenuItem
                                  key={s}
                                  onClick={() =>
                                    updateStatus({
                                      variables: {
                                        orderId: o.id,
                                        data: { status: s },
                                      },
                                    })
                                  }
                                >
                                  {getOrderStatusLabel(
                                    s,
                                    o.shipping?.deliveryType ?? null
                                  )}
                                </DropdownMenuItem>
                              ))}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        ) : null}
                      </td>
                    </tr>
                  );
                })
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
                  if (page === currentPage - 2 || page === currentPage + 2) {
                    return <PaginationEllipsis key={page} />;
                  }
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
