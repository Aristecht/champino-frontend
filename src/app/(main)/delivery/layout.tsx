import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Доставка и оплата",
  description:
    "Доставка зоотоваров ЧАМПИНО ZOO по Атырау: адреса магазинов, режим работы, условия доставки и способы оплаты. Наличные, карта или онлайн-платёж.",
  keywords: [
    "доставка зоотоваров Атырау",
    "самовывоз зоомагазин",
    "адрес зоомагазина Атырау",
    "режим работы ЧАМПИНО ZOO",
    "оплата зоотоваров",
    "ЧАМПИНО ZOO контакты",
    "пункты выдачи Атырау",
  ],
  alternates: { canonical: "/delivery" },
  openGraph: {
    title: "Доставка и оплата | ЧАМПИНО ZOO",
    description:
      "Условия доставки и адреса магазинов ЧАМПИНО ZOO в Атырау. Удобные способы оплаты: наличные, карта, онлайн.",
    url: "/delivery",
    type: "website",
  },
};

export default function DeliveryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
