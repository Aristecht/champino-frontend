import type { Metadata } from "next";
import { NewsPageClient } from "@/components/features/news/NewsPageClient";

export const metadata: Metadata = {
  title: "Новости и статьи",
  description:
    "Новости ЧАМПИНО ZOO: новые поступления, акции, советы по кормлению, уходу и воспитанию питомцев. Статьи о здоровье кошек, собак и других животных.",
  keywords: [
    "новости зоомагазина Атырау",
    "статьи о питомцах",
    "советы по уходу за кошкой",
    "советы по уходу за собакой",
    "здоровье животных",
    "акции зоомагазин",
    "ЧАМПИНО ZOO новости",
    "корм для животных советы",
  ],
  alternates: { canonical: "/news" },
  openGraph: {
    title: "Новости и статьи | ЧАМПИНО ZOO",
    description:
      "Полезные статьи, советы ветеринаров и свежие новости для владельцев питомцев от ЧАМПИНО ZOO.",
    url: "/news",
    type: "website",
  },
};

export default function NewsPage() {
  return <NewsPageClient />;
}
