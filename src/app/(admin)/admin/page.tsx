"use client";

import {
  ShoppingBag,
  Users,
  TrendingUp,
  ArrowRight,
  DollarSign,
} from "lucide-react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { cn } from "@/utils/tw-merge";
import { ORDER_STATUS_CLASS, getOrderStatusLabel } from "@/utils/order-status";
import {
  useGetAnalyticsSummaryQuery,
  useAdminGetAllOrdersQuery,
} from "@/generated/output";

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

export default function AdminDashboardPage() {
  const t = useTranslations("admin");
  const now = new Date();
  const from = new Date(now.getFullYear(), now.getMonth(), 1)
    .toISOString()
    .split("T")[0];
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const to = tomorrow.toISOString().split("T")[0];

  const { data: analytics, loading: loadingAnalytics } =
    useGetAnalyticsSummaryQuery({ variables: { from, to } });
  const { data: ordersData, loading: loadingOrders } =
    useAdminGetAllOrdersQuery({ variables: { filter: { limit: 8, page: 1 } } });

  const s = analytics?.getAnalyticsSummary;
  const orders = ordersData?.adminGetAllOrders?.data ?? [];

  const stats = [
    {
      label: t("revenue"),
      value: s ? fmtKzt(s.totalRevenue) : null,
      icon: DollarSign,
    },
    {
      label: t("totalOrders"),
      value: s ? String(s.totalOrders) : null,
      icon: ShoppingBag,
    },
    {
      label: t("newCustomers"),
      value: s ? String(s.newCustomers) : null,
      icon: Users,
    },
    {
      label: t("avgOrderValue"),
      value: s ? fmtKzt(s.avgOrderValue) : null,
      icon: TrendingUp,
    },
  ];

  return (
    <div className="space-y-6 p-4 sm:p-6">
      <div>
        <h1 className="text-foreground text-xl font-semibold">
          {t("overview")}
        </h1>
        <p className="text-muted-foreground mt-0.5 text-sm">
          {now.toLocaleDateString("ru-RU", { month: "long", year: "numeric" })}
        </p>
      </div>

      {/* KPI */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="bg-card border-border rounded-lg border p-4"
            >
              <div className="flex items-center justify-between">
                <p className="text-muted-foreground text-xs font-medium tracking-wider uppercase">
                  {stat.label}
                </p>
                <Icon className="text-muted-foreground h-4 w-4" />
              </div>
              {loadingAnalytics ? (
                <div className="bg-muted mt-2 h-7 w-28 animate-pulse rounded" />
              ) : (
                <p className="text-foreground mt-2 text-2xl font-bold tabular-nums">
                  {stat.value ?? "—"}
                </p>
              )}
              <p className="text-muted-foreground mt-1 text-xs">
                {t("currentMonth")}
              </p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Recent orders */}
        <div className="bg-card border-border col-span-2 rounded-lg border">
          <div className="flex items-center justify-between border-b px-5 py-3.5">
            <p className="text-foreground text-sm font-semibold">
              {t("recentOrders")}
            </p>
            <Link
              href="/admin/orders"
              className="text-muted-foreground hover:text-foreground flex items-center gap-1 text-xs transition-colors"
            >
              {t("viewAll")} <ArrowRight className="h-3 w-3" />
            </Link>
          </div>

          {loadingOrders ? (
            <div className="divide-y">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="flex items-center gap-4 px-5 py-3.5">
                  <div className="bg-muted h-3 w-20 animate-pulse rounded" />
                  <div className="bg-muted h-3 w-32 animate-pulse rounded" />
                  <div className="bg-muted ml-auto h-3 w-16 animate-pulse rounded" />
                </div>
              ))}
            </div>
          ) : orders.length === 0 ? (
            <div className="text-muted-foreground flex h-32 items-center justify-center text-sm">
              {t("noRecentOrders")}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    {[
                      "ID",
                      t("customer"),
                      t("total"),
                      t("status"),
                      t("date"),
                    ].map((h) => (
                      <th
                        key={h}
                        className="text-muted-foreground px-5 py-2.5 text-left text-xs font-medium"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {orders.map((o, i) => (
                    <tr
                      key={o.id}
                      className={cn(
                        "hover:bg-muted/30 transition-colors",
                        i < orders.length - 1 && "border-b"
                      )}
                    >
                      <td className="text-foreground px-5 py-3 font-mono text-xs">
                        {o.id.slice(0, 8)}…
                      </td>
                      <td className="text-foreground px-5 py-3 text-sm">
                        {o.shipping?.fullName ?? "—"}
                      </td>
                      <td className="text-foreground px-5 py-3 text-sm font-medium">
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
                      <td className="px-5 py-3">
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
                      <td className="text-muted-foreground px-5 py-3 text-xs">
                        {fmtDate(o.createdAt)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Top products */}
        <div className="bg-card border-border rounded-lg border">
          <div className="border-b px-5 py-3.5">
            <p className="text-foreground text-sm font-semibold">
              {t("topProducts")}
            </p>
          </div>
          {loadingAnalytics ? (
            <div className="space-y-px p-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-center gap-3 px-4 py-3">
                  <div className="bg-muted h-3 w-3 animate-pulse rounded" />
                  <div className="bg-muted h-3 flex-1 animate-pulse rounded" />
                </div>
              ))}
            </div>
          ) : (s?.topProducts ?? []).length === 0 ? (
            <div className="text-muted-foreground flex h-32 items-center justify-center text-sm">
              {t("noData")}
            </div>
          ) : (
            <ol className="divide-y">
              {(s?.topProducts ?? []).slice(0, 8).map((p, i) => (
                <li
                  key={p.productId}
                  className="hover:bg-muted/30 flex items-center gap-3 px-5 py-3 transition-colors"
                >
                  <span className="text-muted-foreground w-4 text-right text-xs tabular-nums">
                    {i + 1}
                  </span>
                  <span className="text-foreground flex-1 truncate text-sm">
                    {p.productName}
                  </span>
                  <span className="text-foreground text-sm font-medium tabular-nums">
                    {fmtKzt(p.totalRevenue)}
                  </span>
                </li>
              ))}
            </ol>
          )}
        </div>
      </div>
    </div>
  );
}
