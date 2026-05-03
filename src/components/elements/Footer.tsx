import Link from "next/link";
import { PawPrint, Phone, Mail, Info } from "lucide-react";
import { getTranslations } from "next-intl/server";

export async function Footer() {
  const t = await getTranslations("footer");
  const tc = await getTranslations("common");
  const td = await getTranslations("delivery.contacts");

  const infoLinks = [
    { label: tc("catalog"), href: "/catalog?root=1" },
    { label: tc("news"), href: "/news" },
    { label: t("aboutStore"), href: "/about" },
    { label: t("delivery"), href: "/delivery#branches" },
  ];

  return (
    <footer className="border-border bg-muted/25 border-t">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-[1.2fr_0.8fr_1fr]">
          <div className="space-y-3">
            <div className="text-primary flex items-center gap-2">
              <PawPrint className="h-5 w-5" />
              <span className="text-sm font-extrabold tracking-wide uppercase">
                {tc("shopName")}
              </span>
            </div>
            <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
              {t("description")}
            </p>

            <div className="bg-card border-border/60 inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs">
              <span className="inline-flex h-2 w-2 rounded-full bg-emerald-500" />
              <span className="text-muted-foreground">
                {td("workingHours")}
              </span>
            </div>
          </div>

          <div>
            <h4 className="text-foreground mb-3 text-sm font-semibold">
              {t("infoSection")}
            </h4>
            <ul className="grid gap-2">
              {infoLinks.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-muted-foreground hover:text-foreground text-sm transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-foreground mb-3 text-sm font-semibold">
              {td("title")}
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li className="text-muted-foreground flex items-start gap-2.5">
                <Phone className="mt-0.5 h-4 w-4 shrink-0" />
                <a
                  href={`tel:${td("phone").replace(/[^+\d]/g, "")}`}
                  className="hover:text-foreground transition-colors"
                >
                  {td("phone")}
                </a>
              </li>
              <li className="text-muted-foreground flex items-start gap-2.5">
                <Mail className="mt-0.5 h-4 w-4 shrink-0" />
                <a
                  href={`mailto:${td("email")}`}
                  className="hover:text-foreground transition-colors"
                >
                  {td("email")}
                </a>
              </li>
              <li className="text-muted-foreground flex items-start gap-2.5">
                <Info className="mt-0.5 h-4 w-4 shrink-0" />
                <a
                  href={`/delivery#branches`}
                  className="hover:text-foreground transition-colors"
                >
                  {td("moreInfo")}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-border mt-8 border-t pt-6">
          <p className="text-muted-foreground text-center text-xs tracking-wide">
            © {new Date().getFullYear()} {tc("shopName")}. {t("copyright")}
          </p>
        </div>
      </div>
    </footer>
  );
}
