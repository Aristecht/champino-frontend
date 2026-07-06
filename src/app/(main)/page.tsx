import type { Metadata } from "next";
import { HomePageClient } from "./HomePageClient";

export const metadata: Metadata = {
  title: {
    absolute: "Qadam CRM — unified revenue command center",
  },
  description:
    "Qadam CRM is a modern, single-page CRM workspace with blue and cyan styling for sales, customer success, and operations teams.",
  keywords: [
    "Qadam CRM",
    "CRM dashboard",
    "single page CRM",
    "sales workspace",
    "customer success platform",
    "business dashboard",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    title: "Qadam CRM — unified revenue command center",
    description:
      "A professional single-page CRM experience for pipeline visibility, customer health, and team coordination.",
    url: "/",
    type: "website",
  },
};

export default function Page() {
  return <HomePageClient />;
}
