import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Корзина",
  description:
    "Ваша корзина в ЧАМПИНО ZOO. Просмотрите выбранные товары, оформите заказ и получите скидку по карте лояльности.",
  robots: { index: false, follow: false },
};

export default function CartLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
