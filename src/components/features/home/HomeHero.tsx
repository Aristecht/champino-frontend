"use client";

import Image from "next/image";
import Link from "next/link";
import { ShoppingCart, Sparkles, Info, Star, Lock } from "lucide-react";
import { useTranslations } from "next-intl";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/common/ui/Dialog";
import { useMyLoyaltyCardQuery } from "@/generated/output";
import { authStore } from "@/store/auth/auth.store";

const TIERS = [
  { purchases: 5, discount: 2 },
  { purchases: 10, discount: 3 },
  { purchases: 15, discount: 5 },
] as const;

const LOYALTY_QR_VALUE = "https://champino.kz/loyalty/card";

function getNextTier(n: number) {
  return TIERS.find((t) => n < t.purchases) ?? null;
}

export function HomeHero() {
  const t = useTranslations("home");
  const isAuthenticated = authStore((s) => s.isAuthenticated);
  const { data, loading } = useMyLoyaltyCardQuery({
    skip: !isAuthenticated,
    fetchPolicy: "cache-and-network",
  });

  const totalOrders = data?.myLoyaltyCard.totalOrders ?? 0;
  const discount = data?.myLoyaltyCard.discountPct ?? 0;
  const nextTier = getNextTier(totalOrders);
  const progress = nextTier
    ? Math.round((totalOrders / nextTier.purchases) * 100)
    : 100;
  const qrValue = data?.myLoyaltyCard.qrUrl ?? LOYALTY_QR_VALUE;
  const qrSrc = `https://api.qrserver.com/v1/create-qr-code/?size=320x320&margin=16&data=${encodeURIComponent(qrValue)}`;

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
            <div className="absolute -bottom-16 z-0 hidden translate-x-70 2xl:flex">
              <Image
                alt="dog"
                src={"/images/dog.png"}
                width={450}
                height={450}
              />
            </div>
            <div className="absolute -right-17 z-0 flex -translate-y-7 2xl:-right-10 2xl:-translate-y-18">
              {/* <Image
                alt="parrot"
                src={"/images/parrot.png"}
                width={250}
                height={250}
              /> */}
              <Image
                alt="parrot"
                src={"/images/parrot-2.png"}
                width={250}
                height={250}
              />
            </div>
          </div>

          <div className="bg-card border-border flex w-full flex-col items-center rounded-3xl border px-4 py-5 sm:px-5 lg:w-[320px] lg:shrink-0">
            <div className="mb-3 flex w-full items-center justify-between">
              <span className="text-foreground text-sm font-semibold">
                {t("loyaltyCardTitle")}
              </span>
              <Dialog>
                <DialogTrigger asChild>
                  <button
                    type="button"
                    className="text-muted-foreground hover:text-primary inline-flex items-center gap-1 text-xs transition-colors"
                  >
                    <Info className="h-4 w-4" />
                    {t("loyaltyProgressBtn")}
                  </button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>{t("loyaltyTiersTitle")}</DialogTitle>
                    <DialogDescription>
                      {t("loyaltyTiersDesc")}
                    </DialogDescription>
                  </DialogHeader>

                  <div className="bg-muted/40 rounded-xl border p-3">
                    <div className="mb-2 flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">
                        {loading && isAuthenticated ? "..." : totalOrders}{" "}
                        {t("loyaltyPurchases")}
                      </span>
                      <span className="text-primary font-semibold">
                        {loading && isAuthenticated ? "..." : discount}%
                      </span>
                    </div>
                    <div className="bg-muted h-2 w-full overflow-hidden rounded-full">
                      <div
                        className="bg-primary h-full rounded-full transition-all"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                    {nextTier ? (
                      <p className="text-muted-foreground mt-2 text-xs">
                        {t("loyaltyNextAt")} {nextTier.purchases}{" "}
                        {t("loyaltyPurchasesNeeded")}
                      </p>
                    ) : (
                      <p className="text-muted-foreground mt-2 text-xs">
                        {t("loyaltyMaxLevel")}
                      </p>
                    )}
                  </div>

                  <div className="mt-3 space-y-2">
                    {TIERS.map((tier, i) => (
                      <div
                        key={i}
                        className="border-border bg-muted/50 flex items-center justify-between rounded-xl border px-4 py-2.5"
                      >
                        <div className="flex items-center gap-2">
                          <Star className="text-primary h-4 w-4" />
                          <span className="text-sm">
                            {t("loyaltyFrom")} {tier.purchases}{" "}
                            {t("loyaltyPurchases")}
                          </span>
                        </div>
                        <span className="text-primary text-sm font-bold">
                          {tier.discount}%
                        </span>
                      </div>
                    ))}
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <div className="relative mb-3 w-full rounded-2xl border bg-white p-2">
              <Image
                src={qrSrc}
                alt={t("loyaltyQrAlt")}
                className="mx-auto rounded-md object-contain"
                width={320}
                height={320}
                loading="lazy"
                unoptimized
              />
              {!isAuthenticated && (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 rounded-2xl backdrop-blur-xs">
                  <div className="bg-muted/90 flex flex-col items-center gap-2 rounded-2xl px-4 py-4 text-center shadow-sm">
                    <Lock className="text-muted-foreground h-6 w-6" />
                    <p className="text-foreground text-xs font-semibold">
                      {t("loyaltyLoginRequired")}
                    </p>
                    <Link
                      href="/account/login"
                      className="bg-primary text-primary-foreground hover:bg-primary/90 mt-1 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors"
                    >
                      {t("loyaltyLoginBtn")}
                    </Link>
                  </div>
                </div>
              )}
            </div>

            <p className="text-muted-foreground mb-2 text-center text-xs">
              {t("loyaltyShowCashier")}
            </p>

            <div className="bg-primary/10 border-primary/20 w-full rounded-xl border px-3 py-2">
              {!isAuthenticated ? (
                <p className="text-muted-foreground text-center text-xs">
                  {t("loyaltyNoDiscount")}
                </p>
              ) : discount > 0 ? (
                <p className="text-primary text-center text-sm font-bold">
                  {t("loyaltyDiscount")} {discount}%
                </p>
              ) : (
                <p className="text-muted-foreground text-center text-xs">
                  {t("loyaltyNoDiscount")}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
