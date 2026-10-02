import type { Metadata } from "next";
import { getCurrentUser } from "@/lib/auth/session";
import { db } from "@/lib/db";
import { siteConfig } from "@/lib/seo";
import { DocsShell } from "@/components/docs/docs-shell";
import { DOCS_ARTICLES } from "@/lib/docs-data";

export const metadata: Metadata = {
  title: "Documentation & Guides — How to Use Hemigo",
  description:
    "Learn how to set up your store, launch selling windows, upload product photos, collect Paystack payments, and fulfill batch orders calmly.",
  alternates: { canonical: "/docs" },
  openGraph: {
    title: "Hemigo Documentation & Seller Guides",
    description:
      "Everything you need to know about selling in batches, managing drops, and running your store on Hemigo.",
    url: "/docs",
    type: "website",
    locale: "en_NG",
    siteName: siteConfig.name,
    images: [{ url: siteConfig.logo, width: 2172, height: 724, alt: "Hemigo Docs" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Hemigo Documentation & Seller Guides",
    description: "Learn how to set up your store, launch selling windows, and fulfill without chaos.",
    images: [siteConfig.logo],
  },
};

export default async function DocsPage({
  searchParams,
}: {
  searchParams: Promise<{ topic?: string }>;
}) {
  const { topic = "introduction" } = await searchParams;
  const initialSlug = DOCS_ARTICLES[topic] ? topic : "introduction";

  const currentUser = await getCurrentUser();
  const hasVendor = currentUser
    ? Boolean(
        await db.vendorMember.findFirst({
          where: { userId: currentUser.id },
          select: { id: true },
        }),
      )
    : false;

  return (
    <DocsShell
      initialSlug={initialSlug}
      user={
        currentUser
          ? { name: currentUser.name || currentUser.email, hasVendor }
          : null
      }
    />
  );
}
