import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Мои заказы",
  description:
    "История заказов в ЧАМПИНО ZOO: статус, состав и детали каждого заказа.",
  robots: { index: false, follow: false },
};

export default function OrdersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
