import type { MetadataRoute } from "next";
import { db } from "@/lib/db";
import { absoluteUrl } from "@/lib/seo";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const windows = await db.sellingWindow.findMany({
    where: {
      OR: [
        { mode: "SHOP", status: "LIVE" },
        { mode: "LAUNCH", status: { in: ["UPCOMING", "LIVE"] } },
      ],
    },
    select: {
      slug: true,
      mode: true,
      updatedAt: true,
      vendor: { select: { slug: true } },
    },
    orderBy: { updatedAt: "desc" },
  });

  const staticPages: MetadataRoute.Sitemap = [
    { url: absoluteUrl("/"), changeFrequency: "weekly", priority: 1 },
    { url: absoluteUrl("/explore"), changeFrequency: "daily", priority: 0.9 },
    { url: absoluteUrl("/about"), changeFrequency: "monthly", priority: 0.7 },
    { url: absoluteUrl("/contact"), changeFrequency: "monthly", priority: 0.6 },
  ];

  const seenShops = new Set<string>();
  const storefronts: MetadataRoute.Sitemap = [];
  for (const window of windows) {
    const path =
      window.mode === "SHOP"
        ? `/${window.vendor.slug}`
        : `/${window.vendor.slug}/${window.slug}`;
    if (window.mode === "SHOP" && seenShops.has(path)) continue;
    seenShops.add(path);
    storefronts.push({
      url: absoluteUrl(path),
      lastModified: window.updatedAt,
      changeFrequency: window.mode === "SHOP" ? "weekly" : "daily",
      priority: window.mode === "SHOP" ? 0.8 : 0.7,
    });
  }

  return [...staticPages, ...storefronts];
}
