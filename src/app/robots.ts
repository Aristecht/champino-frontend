import type { MetadataRoute } from "next";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://champino.kz";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/catalog", "/about", "/news", "/delivery"],
        disallow: [
          "/account/",
          "/settings",
          "/orders",
          "/cart",
          "/admin/",
          "/api/",
          "/_next/",
        ],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  };
}
