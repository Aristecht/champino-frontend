import type { Metadata } from "next";
import { AboutPageClient } from "@/components/features/about/AboutPageClient";

export const metadata: Metadata = {
  title: "О нас",
  description:
    "ЧАМПИНО ZOO — зоомагазин в Атырау с заботой о питомцах. Широкий ассортимент кормов, лакомств и аксессуаров. Программа лояльности для постоянных покупателей: накапливайте покупки и получайте персональную скидку до 10%.",
  keywords: [
    "о магазине ЧАМПИНО ZOO",
    "зоомагазин Атырау история",
    "программа лояльности",
    "скидки для постоянных покупателей",
    "карта лояльности зоомагазин",
    "ЧАМПИНО ZOO отзывы",
    "зоотовары качество",
  ],
  alternates: { canonical: "/about" },
  openGraph: {
    title: "О нас | ЧАМПИНО ZOO",
    description:
      "Узнайте больше о ЧАМПИНО ZOO — нашей миссии, подходе к качеству и программе лояльности для постоянных покупателей.",
    url: "/about",
    type: "website",
  },
};

export default function AboutPage() {
  return <AboutPageClient />;
}
