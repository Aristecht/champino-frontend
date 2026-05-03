import { Banknote, CreditCard, PackageCheck, Store, Truck } from "lucide-react";
import { useTranslations } from "next-intl";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/common/ui/Card";

const deliveryIcons = [Truck, Store, PackageCheck] as const;
const paymentIcons = [CreditCard, CreditCard, Banknote] as const;

export function DeliveryPolicyGrid() {
  const t = useTranslations("delivery.policy");

  const deliveryOptions = deliveryIcons.map((icon, index) => ({
    icon,
    title: t(`delivery.${index}.title`),
    text: t(`delivery.${index}.text`),
  }));

  const paymentOptions = paymentIcons.map((icon, index) => ({
    icon,
    title: t(`payment.${index}.title`),
    text: t(`payment.${index}.text`),
  }));

  return (
    <section className="grid gap-6 lg:grid-cols-2">
      <Card variant="gradient" className="rounded-3xl">
        <CardHeader>
          <CardTitle>{t("deliveryTitle")}</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3 pb-5">
          {deliveryOptions.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                className="bg-background/70 border-border/50 flex gap-3 rounded-2xl border p-4"
              >
                <div className="bg-primary/10 text-primary flex h-10 w-10 shrink-0 items-center justify-center rounded-xl">
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-foreground text-sm font-semibold">
                    {item.title}
                  </h3>
                  <p className="text-muted-foreground mt-1 text-sm leading-6">
                    {item.text}
                  </p>
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>

      <Card variant="gradient" className="rounded-3xl">
        <CardHeader>
          <CardTitle>{t("paymentTitle")}</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3 pb-5">
          {paymentOptions.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                className="bg-background/70 border-border/50 flex gap-3 rounded-2xl border p-4"
              >
                <div className="bg-primary/10 text-primary flex h-10 w-10 shrink-0 items-center justify-center rounded-xl">
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-foreground text-sm font-semibold">
                    {item.title}
                  </h3>
                  <p className="text-muted-foreground mt-1 text-sm leading-6">
                    {item.text}
                  </p>
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>
    </section>
  );
}
