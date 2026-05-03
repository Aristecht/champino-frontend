import { CreditCard, MapPinned, ShieldCheck, Truck } from "lucide-react";
import { useTranslations } from "next-intl";

const highlightIcons = [Truck, MapPinned, CreditCard, ShieldCheck] as const;

export function DeliveryHero() {
  const t = useTranslations("delivery.hero");

  const highlights = highlightIcons.map((icon, index) => ({
    icon,
    title: t(`highlights.${index}.title`),
    text: t(`highlights.${index}.text`),
  }));

  return (
    <section className="from-primary/10 via-background to-background border-border/60 rounded-3xl border bg-linear-to-br p-6 sm:p-8">
      <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="space-y-4">
          <span className="text-primary bg-primary/10 inline-flex rounded-full px-3 py-1 text-xs font-semibold tracking-wide uppercase">
            {t("badge")}
          </span>
          <div className="space-y-3">
            <h1 className="text-foreground text-3xl font-semibold tracking-tight sm:text-4xl">
              {t("title")}
            </h1>
            <p className="text-muted-foreground max-w-2xl text-sm leading-6 sm:text-base">
              {t("subtitle")}
            </p>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          {highlights.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                className="bg-card/80 border-border/60 rounded-2xl border p-4 backdrop-blur-sm"
              >
                <Icon className="text-primary mb-3 h-5 w-5" />
                <h2 className="text-foreground text-sm font-semibold">
                  {item.title}
                </h2>
                <p className="text-muted-foreground mt-1 text-xs leading-5">
                  {item.text}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
