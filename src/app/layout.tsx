import { ApolloClientProvider } from "@/providers/ApolloClientProvider";
import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages } from "next-intl/server";
import "../styles/globals.css";
import { ThemeProvider } from "@/providers/ThemeProvider";
import { ToastProvider } from "@/providers/ToastProvider";
import { TanstackQueryProvider } from "@/providers/TanstackQueryProvider";
import { ServiceWorkerRegistrar } from "@/components/common/ServiceWorkerRegistrar";
import { AuthInit } from "@/components/common/AuthInit";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://qadamcrm.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Qadam CRM",
    template: "%s | Qadam CRM",
  },
  description:
    "Qadam CRM is a modern CRM workspace for sales, customer success, and operations teams that need a clear single-page command center.",
  keywords: [
    "Qadam CRM",
    "CRM",
    "sales dashboard",
    "customer success",
    "pipeline analytics",
    "operations command center",
  ],
  applicationName: "Qadam CRM",
  authors: [{ name: "Qadam CRM", url: siteUrl }],
  category: "business",
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
    title: "Qadam CRM",
    description:
      "A single-page CRM command center for analytics, customer management, and team execution.",
    siteName: "Qadam CRM",
    locale: "en_US",
    images: [
      {
        url: "/images/og-cover.png",
        width: 1200,
        height: 630,
        alt: "Qadam CRM",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Qadam CRM",
    description:
      "A professional blue and cyan CRM experience for sales, customer success, and operations teams.",
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
        "@type": "Organization",
        "@id": `${siteUrl}/#organization`,
        name: "Qadam CRM",
        url: siteUrl,
        logo: `${siteUrl}/images/logotype.png`,
        image: `${siteUrl}/images/og-cover.png`,
        description:
          "Qadam CRM helps teams manage pipeline, customer health, operations, and automations from a single-page command center.",
      },
      {
        "@type": "SoftwareApplication",
        "@id": `${siteUrl}/#application`,
        name: "Qadam CRM",
        applicationCategory: "BusinessApplication",
        operatingSystem: "Web",
        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency: "USD",
        },
        description:
          "A modern CRM workspace for managing deals, customer timelines, analytics, and internal operations.",
        publisher: { "@id": `${siteUrl}/#organization` },
      },
      {
        "@type": "WebSite",
        "@id": `${siteUrl}/#website`,
        url: siteUrl,
        name: "Qadam CRM",
        publisher: { "@id": `${siteUrl}/#organization` },
        potentialAction: {
          "@type": "SearchAction",
          target: {
            "@type": "EntryPoint",
            urlTemplate: `${siteUrl}/?q={search_term_string}`,
          },
          "query-input": "required name=search_term_string",
        },
      },
    ],
  };

  return (
    <html lang={locale} suppressHydrationWarning>
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
