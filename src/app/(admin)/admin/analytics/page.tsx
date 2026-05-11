"use client";

import { useState } from "react";
import { Calendar } from "lucide-react";
import { useTranslations } from "next-intl";
import { cn } from "@/utils/tw-merge";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useGetAnalyticsSummaryQuery } from "@/generated/output";

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

function toLocalDateInputValue(date: Date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

interface RevenuePoint {
  date: string;
  revenue: number;
  ordersCount: number;
  displayDate: string;
}

interface CandleShapeProps {
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  fill?: string;
}

function CandleShape({ x, y, width, height, fill }: CandleShapeProps) {
  if (
    x === undefined ||
    y === undefined ||
    width === undefined ||
    height === undefined
  ) {
    return null;
  }

  const wickX = x + width / 2;
  const bodyWidth = Math.max(8, Math.round(width * 0.46));
  const bodyX = x + (width - bodyWidth) / 2;

  return (
    <g>
      <line
        x1={wickX}
        y1={y}
        x2={wickX}
        y2={y + height}
        stroke="#64748b"
        strokeWidth={2}
        strokeLinecap="round"
      />
      <rect
        x={bodyX}
        y={y}
        width={bodyWidth}
        height={Math.max(6, height)}
        rx={5}
        ry={5}
        fill={fill ?? "#0ea5e9"}
      />
    </g>
  );
}

interface RevenueTooltipProps {
  active?: boolean;
  payload?: Array<{ payload: RevenuePoint }>;
  label?: string;
}

function RevenueTooltip({ active, payload, label }: RevenueTooltipProps) {
  if (!active || !payload?.length) {
    return null;
  }

  const point = payload[0]?.payload;
  if (!point) {
    return null;
  }

  return (
    <div className="bg-popover/95 border-border min-w-44 rounded-lg border px-3 py-2.5 shadow-md backdrop-blur-sm">
      <p className="text-foreground text-xs font-semibold">{label}</p>
      <p className="text-foreground mt-1 text-sm font-semibold tabular-nums">
        {fmtKzt(point.revenue)}
      </p>
      <p className="text-muted-foreground mt-0.5 text-xs">
        {point.ordersCount} заказов
      </p>
    </div>
  );
}

export default function AdminAnalyticsPage() {
  const t = useTranslations("admin");
  const now = new Date();
  const [from, setFrom] = useState(() =>
    toLocalDateInputValue(new Date(now.getFullYear(), now.getMonth(), 1))
  );
  const [to, setTo] = useState(() => {
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    return toLocalDateInputValue(tomorrow);
  });

  const { data, loading } = useGetAnalyticsSummaryQuery({
    variables: { from, to },
  });
  const s = data?.getAnalyticsSummary;

  const revenueByDay = s?.revenueByDay ?? [];
  const topProducts = s?.topProducts ?? [];
  const chartData: RevenuePoint[] = revenueByDay.map((d) => ({
    ...d,
    displayDate: fmtDate(d.date),
  }));
  const chartMinWidth = Math.max(680, chartData.length * 34);

  const stats = [
    { label: t("revenue"), value: s ? fmtKzt(s.totalRevenue) : null },
    { label: t("totalOrders"), value: s ? String(s.totalOrders) : null },
    { label: t("newCustomers"), value: s ? String(s.newCustomers) : null },
    { label: t("avgOrderValue"), value: s ? fmtKzt(s.avgOrderValue) : null },
    {
      label: t("conversion"),
      value: s ? s.conversionRate.toFixed(1) + "%" : null,
    },
  ];

  return (
    <div className="space-y-6 p-4 sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-foreground text-xl font-semibold">
          {t("analytics")}
        </h1>
        <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
          <div className="flex items-center gap-2">
            <Calendar className="text-muted-foreground h-4 w-4" />
            <label className="text-muted-foreground text-xs">
              {t("dateFrom")}
            </label>
            <input
              type="date"
              value={from}
              onChange={(e) => setFrom(e.target.value)}
              className="border-input bg-background text-foreground focus:ring-primary/20 rounded-md border px-2.5 py-1.5 text-xs outline-none focus:ring-2"
            />
          </div>
          <div className="flex items-center gap-2">
            <label className="text-muted-foreground text-xs">
              {t("dateTo")}
            </label>
            <input
              type="date"
              value={to}
              onChange={(e) => setTo(e.target.value)}
              className="border-input bg-background text-foreground focus:ring-primary/20 rounded-md border px-2.5 py-1.5 text-xs outline-none focus:ring-2"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-5">
        {stats.map(({ label, value }) => (
          <div
            key={label}
            className="bg-card border-border rounded-lg border p-4"
          >
            <p className="text-muted-foreground text-xs">{label}</p>
            {loading || value === null ? (
              <div className="bg-muted mt-2 h-6 w-24 animate-pulse rounded" />
            ) : (
              <p className="text-foreground mt-1 text-lg font-semibold tabular-nums">
                {value}
              </p>
            )}
          </div>
        ))}
      </div>

      <div className="bg-card border-border rounded-lg border p-5">
        <h2 className="text-foreground mb-4 text-sm font-semibold">
          {t("revenueByDay")}
        </h2>
        {loading ? (
          <div className="flex h-48 items-center justify-center">
            <div className="bg-muted h-8 w-8 animate-pulse rounded-full" />
          </div>
        ) : revenueByDay.length === 0 ? (
          <p className="text-muted-foreground py-10 text-center text-sm">
            {t("noPeriodData")}
          </p>
        ) : (
          <div className="bg-muted/20 border-border overflow-x-auto rounded-xl border p-3">
            <div style={{ width: chartMinWidth }}>
              <ResponsiveContainer width="100%" height={240}>
                <BarChart
                  data={chartData}
                  margin={{ top: 15, right: 0, left: 0, bottom: -10 }}
                  barCategoryGap="10%"
                >
                  <defs>
                    <linearGradient
                      id="revenueCandle"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="0%"
                        stopColor="#38bdf8"
                        stopOpacity={0.95}
                      />
                      <stop
                        offset="100%"
                        stopColor="#0284c7"
                        stopOpacity={0.95}
                      />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="var(--border)"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="displayDate"
                    stroke="var(--muted-foreground)"
                    tick={{
                      fontSize: 12,
                      fill: "var(--muted-foreground)",
                    }}
                    axisLine={false}
                    tickLine={false}
                    minTickGap={18}
                    interval="preserveStartEnd"
                  />
                  <YAxis
                    stroke="var(--muted-foreground)"
                    tick={{ fontSize: 12, fill: "var(--foreground)" }}
                    tickFormatter={(v) => fmtKzt(v as number)}
                    axisLine={false}
                    tickLine={false}
                    width={82}
                  />
                  <Tooltip
                    cursor={{ fill: "var(--muted)", fillOpacity: 0.45 }}
                    wrapperStyle={{ outline: "none" }}
                    content={<RevenueTooltip />}
                  />
                  <Bar
                    dataKey="revenue"
                    shape={<CandleShape />}
                    fill="url(#revenueCandle)"
                    barSize={18}
                    minPointSize={10}
                    isAnimationActive={false}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </div>

      <div className="bg-card border-border rounded-lg border">
        <div className="border-b px-5 py-3.5">
          <h2 className="text-foreground text-sm font-semibold">
            {t("topProducts")}
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                {[
                  "#",
                  t("name"),
                  t("totalSold"),
                  t("revenue"),
                  "Сред. цена",
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
            <tbody>
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="border-b last:border-0">
                    {[0, 1, 2, 3, 4].map((j) => (
                      <td key={j} className="px-4 py-3.5 first:pl-5">
                        <div className="bg-muted h-4 animate-pulse rounded" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : topProducts.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="text-muted-foreground px-5 py-8 text-center text-sm"
                  >
                    {t("noData")}
                  </td>
                </tr>
              ) : (
                topProducts.map((p, i) => (
                  <tr
                    key={p.productId}
                    className={cn(
                      "hover:bg-muted/30 transition-colors",
                      i < topProducts.length - 1 && "border-b"
                    )}
                  >
                    <td className="text-muted-foreground py-3.5 pr-4 pl-5 text-xs">
                      {i + 1}
                    </td>
                    <td className="text-foreground px-4 py-3.5 font-medium">
                      {p.productName}
                    </td>
                    <td className="px-4 py-3.5 tabular-nums">{p.totalSold}</td>
                    <td className="px-4 py-3.5 font-medium tabular-nums">
                      {fmtKzt(p.totalRevenue)}
                    </td>
                    <td className="text-muted-foreground px-4 py-3.5 text-xs tabular-nums">
                      {p.totalSold > 0
                        ? fmtKzt(p.totalRevenue / p.totalSold)
                        : "—"}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
