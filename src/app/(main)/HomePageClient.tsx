"use client";

import { HomeHero } from "@/components/features/home/HomeHero";
import { HomeProductsExplorer } from "@/components/features/home/HomeProductsExplorer";
import { HomeNewsSection } from "@/components/features/home/HomeNewsSection";

export function HomePageClient() {
  return (
    <div className="pb-8">
      <HomeHero />
      <HomeNewsSection />
      <HomeProductsExplorer />
    </div>
  );
}
