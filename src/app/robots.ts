import type { MetadataRoute } from "next";
import { absoluteUrl, siteConfig } from "@/lib/seo";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/api/",
        "/checkout/",
        "/dashboard/",
        "/invoice/",
        "/messages/",
        "/onboarding/",
        "/order/",
        "/purchases/",
        "/receipt/",
        "/reset-password",
        "/ticket/",
        "/verify-email",
      ],
    },
    sitemap: absoluteUrl("/sitemap.xml"),
    host: siteConfig.url,
  };
}
