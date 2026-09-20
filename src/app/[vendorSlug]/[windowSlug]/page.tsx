import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Storefront } from "@/components/storefront/storefront";
import { db } from "@/lib/db";
import { isWindowAcceptingOrders, publicLocation } from "@/lib/commerce";
import { absoluteUrl, jsonLd, siteConfig } from "@/lib/seo";

type PageProps = { params: Promise<{ vendorSlug: string; windowSlug: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { vendorSlug, windowSlug } = await params;
  const window = await db.sellingWindow.findFirst({
    where: { slug: windowSlug, vendor: { slug: vendorSlug }, status: { not: "DRAFT" } },
    include: {
      vendor: true,
      windowProducts: { where: { product: { active: true } }, include: { product: true }, take: 1 },
    },
  });
  if (!window) return { title: "Storefront not found", robots: { index: false } };
  const title = `${window.name} by ${window.vendor.name}`;
  const description = (window.headline || window.description || `Shop ${window.name} from ${window.vendor.name} on Hemigo.`).slice(0, 160);
  const path = `/${vendorSlug}/${windowSlug}`;
  const image = window.windowProducts[0]?.product.imageUrl || siteConfig.logo;
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: { title, description, url: path, type: "website", locale: "en_NG", siteName: "Hemigo", images: [{ url: image }] },
    twitter: { card: "summary_large_image", title, description, images: [image] },
  };
}

export default async function StorefrontPage({ params }: { params: Promise<{ vendorSlug: string; windowSlug: string }> }) {
  const { vendorSlug, windowSlug } = await params;
  const window = await db.sellingWindow.findFirst({ where: { slug: windowSlug, vendor: { slug: vendorSlug }, status: { not: "DRAFT" } }, include: { vendor: true, windowProducts: { include: { product: true }, orderBy: { product: { createdAt: "asc" } } } } });
  if (!window) notFound();
  const data = { windowId: window.id, vendorName: window.vendor.name, vendorSlug: window.vendor.slug, windowName: window.name, windowSlug: window.slug, headline: window.headline || window.name, description: window.description || "A limited selling window, prepared just for you.", location: publicLocation({visibility:window.vendor.locationVisibility,location:window.vendor.location,publicLocation:window.vendor.publicLocation}), opensAt:window.opensAt?.toISOString()??null, closesAt: window.closesAt?.toISOString() ?? null, mode:window.mode, theme: window.theme, isOpen: isWindowAcceptingOrders(window), products: window.windowProducts.filter((item)=>item.product.active).map((item)=>({ id:item.id,name:item.product.name,description:item.product.description,type:item.product.type,priceKobo:item.priceKobo,image:item.product.imageUrl||"https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=1000&q=80",inventory:item.inventoryLimit,sold:item.soldQty,reserved:item.reservedQty,maxPerCustomer:item.maxPerCustomer })) };
  const url = absoluteUrl(`/${window.vendor.slug}/${window.slug}`);
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Store",
    name: `${window.vendor.name} — ${window.name}`,
    url,
    description: data.description,
    areaServed: data.location || "Nigeria",
    makesOffer: data.products.map((product) => ({
      "@type": "Offer",
      url,
      priceCurrency: "NGN",
      price: (product.priceKobo / 100).toFixed(2),
      availability: data.isOpen && (product.inventory === null || product.sold + product.reserved < product.inventory)
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      itemOffered: {
        "@type": "Product",
        name: product.name,
        description: product.description,
        image: product.image,
        category: product.type,
      },
    })),
  };
  return <><script type="application/ld+json" dangerouslySetInnerHTML={{__html:jsonLd(structuredData)}}/><Storefront data={data}/></>;
}
