import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/session";
import { db } from "@/lib/db";
import { siteConfig } from "@/lib/seo";
import { DocsShell } from "@/components/docs/docs-shell";
import { DOCS_ARTICLES } from "@/lib/docs-data";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = DOCS_ARTICLES[slug];
  if (!article) return { title: "Documentation | Hemigo" };

  return {
    title: `${article.title} — Hemigo Docs`,
    description: article.subtitle,
    alternates: { canonical: `/docs/${slug}` },
    openGraph: {
      title: `${article.title} — Hemigo Docs`,
      description: article.subtitle,
      url: `/docs/${slug}`,
      type: "website",
      siteName: siteConfig.name,
      images: [{ url: siteConfig.logo, width: 2172, height: 724, alt: article.title }],
    },
  };
}

export default async function DocArticlePage({ params }: Props) {
  const { slug } = await params;
  const article = DOCS_ARTICLES[slug];
  if (!article) notFound();

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
      initialSlug={slug}
      user={
        currentUser
          ? { name: currentUser.name || currentUser.email, hasVendor }
          : null
      }
    />
  );
}
