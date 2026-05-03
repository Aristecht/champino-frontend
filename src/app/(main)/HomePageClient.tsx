"use client";

import { HomeHero } from "@/components/features/home/HomeHero";
import { HomeProductsExplorer } from "@/components/features/home/HomeProductsExplorer";

export function HomePageClient() {
  return (
    <div className="pb-8">
      <HomeHero />
      <HomeProductsExplorer />
    </div>
  );
}
