"use client";

import Image from "next/image";
import Link from "next/link";
import { ShoppingCart, Sparkles } from "lucide-react";
import { useTranslations } from "next-intl";

export function HomeHero() {
  const t = useTranslations("home");

  return (
    <section className="pt-6 sm:pt-8">
      <div className="mx-auto max-w-6xl px-4 pb-8 sm:px-6 lg:px-8">
        <div className="grid gap-4 lg:grid-cols-[1fr_auto] lg:items-stretch lg:gap-6">
          {/* Hero text */}
          <div className="bg-card border-border relative flex h-full flex-col justify-between overflow-hidden rounded-3xl border px-5 py-7 sm:px-8 sm:py-9">
            <div className="bg-primary/10 text-primary z-10 mb-4 inline-flex w-fit items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold">
              <Sparkles className="h-3.5 w-3.5" />
              {t("heroBadge")}
            </div>
            <h1 className="text-foreground z-10 max-w-2xl text-3xl font-bold tracking-tight sm:text-5xl">
              {t("heroHeadingPre")}{" "}
              <span className="text-primary z-10">
                {t("heroHeadingHighlight")}
              </span>{" "}
              {t("heroHeadingPost")}
            </h1>
            <p className="text-foreground/60 z-10 mt-3 max-w-md text-sm leading-6 sm:text-base">
              {t("heroSubheading")}
            </p>
            <div className="z-10 mt-6 flex flex-wrap items-center gap-3">
              <Link
                href="/catalog"
                className="bg-primary text-primary-foreground hover:bg-primary/90 inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-colors"
              >
                <ShoppingCart className="h-4 w-4" />
                {t("catalogBtn")}
              </Link>
              <Link
                href="/catalog"
                className="border-primary/30 text-primary hover:bg-primary/5 inline-flex items-center rounded-xl border px-4 py-2.5 text-sm font-semibold transition-colors"
              >
                {t("salesBtn")}
              </Link>
            </div>
            <div className="absolute -bottom-16 z-0 hidden translate-x-130 2xl:flex">
              <Image
                alt="dog"
                src={"/images/dog.png"}
                width={450}
                height={450}
              />
            </div>
            <div className="absolute -right-17 z-0 flex -translate-y-7 2xl:-right-10 2xl:-translate-y-18">
              <Image
                alt="parrot"
                src={"/images/parrot-2.png"}
                width={250}
                height={250}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
