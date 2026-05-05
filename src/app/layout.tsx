import { ApolloClientProvider } from "@/providers/ApolloClientProvider";
import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages } from "next-intl/server";
import "../styles/globals.css";
import { Geist } from "next/font/google";
import { ThemeProvider } from "@/providers/ThemeProvider";
import { ToastProvider } from "@/providers/ToastProvider";
import { TanstackQueryProvider } from "@/providers/TanstackQueryProvider";
import { ServiceWorkerRegistrar } from "@/components/common/ServiceWorkerRegistrar";
import { AuthInit } from "@/components/common/AuthInit";

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" });
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://champino.kz";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "ЧАМПИНО — зоомагазин в Атырау",
    template: "%s | ЧАМПИНО",
  },
  description:
    "ЧАМПИНО ZOO — зоомагазин №1 в Атырау. Корма, лакомства, наполнители, игрушки и аксессуары для кошек, собак и других животных. Программа лояльности со скидками до 10%. Быстрая доставка, оплата онлайн и при получении.",
  keywords: [
    "зоомагазин Атырау",
    "ЧАМПИНО ZOO",
    "купить корм для кошек Атырау",
    "купить корм для собак Атырау",
    "товары для животных Атырау",
    "зоотовары",
    "доставка зоотоваров Атырау",
    "наполнитель для кошачьего туалета",
    "лакомства для кошек",
    "лакомства для собак",
    "аксессуары для питомцев",
    "игрушки для животных",
    "программа лояльности зоомагазин",
    "скидки зоомагазин",
    "карта лояльности питомцы",
    "ветеринарные товары Атырау",
    "зоомагазин онлайн Казахстан",
  ],
  applicationName: "ЧАМПИНО ZOO",
  authors: [{ name: "ЧАМПИНО ZOO", url: siteUrl }],
  category: "shopping",
  icons: {
    icon: [{ url: "/images/logo.png", type: "image/png" }],
    apple: "/images/logo.png",
  },
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    url: "/",
    title: "ЧАМПИНО ZOO — зоомагазин в Атырау",
    description:
      "Качественные товары для кошек, собак и других питомцев. Программа лояльности — накапливайте покупки и получайте скидку до 10%. Доставка по Атырау.",
    siteName: "ЧАМПИНО ZOO",
    locale: "ru_RU",
    images: [
      {
        url: "/images/og-cover.png",
        width: 1200,
        height: 630,
        alt: "ЧАМПИНО ZOO — зоомагазин в Атырау",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "ЧАМПИНО ZOO — зоомагазин в Атырау",
    description:
      "Товары для питомцев: корма, лакомства, аксессуары. Программа лояльности и скидки. Доставка по Атырау.",
    images: ["/images/og-cover.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION ?? undefined,
    yandex: process.env.NEXT_PUBLIC_YANDEX_VERIFICATION ?? undefined,
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();
  const messages = await getMessages();

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "PetStore",
        "@id": `${siteUrl}/#organization`,
        name: "ЧАМПИНО ZOO",
        url: siteUrl,
        logo: `${siteUrl}/images/logotype.png`,
        image: `${siteUrl}/images/og-cover.png`,
        description:
          "Зоомагазин ЧАМПИНО ZOO в Атырау. Корма, лакомства, наполнители и аксессуары для питомцев. Программа лояльности — накапливайте покупки и получайте скидку до 10%.",
        address: {
          "@type": "PostalAddress",
          addressLocality: "Атырау",
          addressCountry: "KZ",
        },
        priceRange: "₸₸",
        currenciesAccepted: "KZT",
        paymentAccepted: "Cash, Credit Card, Online Payment",
        openingHoursSpecification: [
          {
            "@type": "OpeningHoursSpecification",
            dayOfWeek: [
              "Monday",
              "Tuesday",
              "Wednesday",
              "Thursday",
              "Friday",
              "Saturday",
              "Sunday",
            ],
            opens: "09:00",
            closes: "21:00",
          },
        ],
        hasOfferCatalog: {
          "@type": "OfferCatalog",
          name: "Товары для животных",
          itemListElement: [
            { "@type": "OfferCatalog", name: "Корма для кошек" },
            { "@type": "OfferCatalog", name: "Корма для собак" },
            { "@type": "OfferCatalog", name: "Наполнители" },
            { "@type": "OfferCatalog", name: "Лакомства" },
            { "@type": "OfferCatalog", name: "Аксессуары и игрушки" },
          ],
        },
        memberOf: {
          "@type": "ProgramMembership",
          name: "Программа лояльности ЧАМПИНО ZOO",
          description:
            "Совершайте покупки и получайте скидку: 5 покупок — 2%, 15 покупок — 5%, 30 покупок — 8%, 50 покупок — 10%. Персональная карта лояльности с QR-кодом для каждого покупателя.",
          programName: "ЧАМПИНО Лояльность",
        },
      },
      {
        "@type": "WebSite",
        "@id": `${siteUrl}/#website`,
        url: siteUrl,
        name: "ЧАМПИНО ZOO",
        publisher: { "@id": `${siteUrl}/#organization` },
        potentialAction: {
          "@type": "SearchAction",
          target: {
            "@type": "EntryPoint",
            urlTemplate: `${siteUrl}/catalog?q={search_term_string}`,
          },
          "query-input": "required name=search_term_string",
        },
      },
    ],
  };

  return (
    <html lang={locale} className={geist.variable} suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="flex min-h-screen flex-col antialiased">
        <TanstackQueryProvider>
          <ApolloClientProvider>
            <NextIntlClientProvider messages={messages}>
              <ThemeProvider
                attribute="class"
                defaultTheme="light"
                enableSystem={false}
                disableTransitionOnChange
              >
                <ToastProvider />
                <ServiceWorkerRegistrar />
                <AuthInit />
                {children}
              </ThemeProvider>
            </NextIntlClientProvider>
          </ApolloClientProvider>
        </TanstackQueryProvider>
      </body>
    </html>
  );
}
