"use client";

import Link from "next/link";
import {
  Heart,
  ShoppingCart,
  ShoppingBag,
  Apple,
  Gamepad2,
  Scissors,
  Users,
  Package,
  Zap,
  MessageCircle,
  Phone,
  ShieldCheck,
} from "lucide-react";
import { useTranslations } from "next-intl";

const OFFER_ITEMS = [
  { key: "offer1", icon: Apple },
  { key: "offer2", icon: Heart },
  { key: "offer3", icon: Gamepad2 },
  { key: "offer4", icon: Scissors },
] as const;

const WHY_ITEMS = [
  { key: "why1", icon: Package },
  { key: "why2", icon: ShoppingBag },
  { key: "why3", icon: Zap },
  { key: "why4", icon: MessageCircle },
] as const;

export function AboutPageClient() {
  const t = useTranslations("about");
  const whatsappLink = "https://wa.me/77713444481";

  return (
    <div className="mx-auto max-w-5xl space-y-7 px-4 py-10 sm:px-6 lg:py-12">
      {/* Hero */}
      <div className="from-primary/20 via-background relative overflow-hidden rounded-3xl bg-linear-to-br to-transparent px-6 py-6 sm:px-10">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_15%_20%,rgba(255,145,77,0.22),transparent_45%),radial-gradient(circle_at_85%_0%,rgba(255,145,77,0.12),transparent_35%)]" />

        <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
          <div>
            <p className="text-primary mb-3 text-xs font-semibold tracking-[0.22em] uppercase">
              Champino Zoo
            </p>
            <h1 className="text-foreground text-3xl font-extrabold tracking-tight sm:text-4xl">
              {t("title")}
            </h1>
            <p className="text-muted-foreground mt-3 max-w-2xl text-base leading-relaxed">
              {t("subtitle")}
            </p>
          </div>

          <div className="bg-card/85 border-border/50 rounded-2xl border p-5 backdrop-blur-sm">
            <div className="mb-4 flex items-center gap-2">
              <ShieldCheck className="text-primary h-5 w-5" />
              <p className="text-foreground text-sm font-semibold">
                Champino Standard
              </p>
            </div>
            <ul className="text-muted-foreground space-y-2 text-sm">
              <li>Проверенные бренды и прозрачные составы</li>
              <li>Консультация по возрасту и особенностям питомца</li>
              <li>Быстрая обработка онлайн-заказов</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="bg-card border-border/50 rounded-2xl border p-6 shadow-sm">
        <h2 className="text-foreground mb-3 text-xl font-bold">
          {t("storyTitle")}
        </h2>
        <p className="text-muted-foreground text-sm leading-relaxed">
          {t("storyText")}
        </p>
      </div>

      <div>
        <h2 className="text-foreground mb-4 text-xl font-bold">
          {t("offerTitle")}
        </h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {OFFER_ITEMS.map(({ key, icon: Icon }) => (
            <div
              key={key}
              className="bg-card border-border/50 hover:border-primary/35 flex items-center gap-3 rounded-2xl border p-4 transition-colors"
            >
              <div className="bg-primary/10 text-primary flex h-9 w-9 shrink-0 items-center justify-center rounded-xl">
                <Icon className="h-4 w-4" />
              </div>
              <p className="text-foreground text-sm font-medium">
                {t(key as Parameters<typeof t>[0])}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div className="bg-card border-border/50 rounded-2xl border p-6">
          <h2 className="text-foreground mb-3 text-lg font-bold">
            {t("approachTitle")}
          </h2>
          <p className="text-muted-foreground text-sm leading-relaxed">
            {t("approachText")}
          </p>
        </div>
        <div className="bg-primary/5 border-primary/20 rounded-2xl border p-6">
          <div className="bg-primary/10 text-primary mb-3 flex h-10 w-10 items-center justify-center rounded-xl">
            <Users className="h-5 w-5" />
          </div>
          <h2 className="text-foreground mb-2 text-lg font-bold">
            {t("missionTitle")}
          </h2>
          <p className="text-muted-foreground text-sm leading-relaxed">
            {t("missionText")}
          </p>
        </div>
      </div>

      <div>
        <h2 className="text-foreground mb-4 text-xl font-bold">
          {t("whyTitle")}
        </h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {WHY_ITEMS.map(({ key, icon: Icon }) => (
            <div
              key={key}
              className="bg-card border-border/50 hover:border-primary/35 flex flex-col items-center gap-2 rounded-2xl border px-4 py-5 text-center transition-colors"
            >
              <div className="bg-primary/10 text-primary flex h-10 w-10 items-center justify-center rounded-xl">
                <Icon className="h-5 w-5" />
              </div>
              <p className="text-foreground text-sm font-semibold">
                {t(key as Parameters<typeof t>[0])}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-card border-border/50 rounded-2xl border p-6 text-center">
        <p className="text-muted-foreground mb-4 text-sm">{t("ctaText")}</p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/catalog"
            className="bg-primary text-primary-foreground hover:bg-primary/90 inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold transition-colors"
          >
            <ShoppingCart className="h-4 w-4" />
            {t("catalogBtn")}
          </Link>

          <a
            href={whatsappLink}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-emerald-700"
          >
            <Phone className="h-4 w-4" />
            {t("whatsappBtn")}
          </a>

          <Link
            href="/delivery#branches"
            className="bg-secondary text-secondary-foreground hover:bg-secondary/85 inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold transition-colors"
          >
            <Phone className="h-4 w-4" />
            {t("deliveryBtn")}
          </Link>
        </div>
      </div>
    </div>
  );
}
