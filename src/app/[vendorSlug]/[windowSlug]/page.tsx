import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Storefront } from "@/components/storefront/storefront";
import { db } from "@/lib/db";
import { isWindowAcceptingOrders, publicLocation } from "@/lib/commerce";

export const metadata: Metadata = { title: "Storefront" };
export default async function StorefrontPage({ params }: { params: Promise<{ vendorSlug: string; windowSlug: string }> }) {
  const { vendorSlug, windowSlug } = await params;
  const window = await db.sellingWindow.findFirst({ where: { slug: windowSlug, vendor: { slug: vendorSlug }, status: { not: "DRAFT" } }, include: { vendor: true, windowProducts: { include: { product: true }, orderBy: { product: { createdAt: "asc" } } } } });
  if (!window) notFound();
  const data = { windowId: window.id, vendorName: window.vendor.name, vendorSlug: window.vendor.slug, windowName: window.name, windowSlug: window.slug, headline: window.headline || window.name, description: window.description || "A limited selling window, prepared just for you.", location: publicLocation({visibility:window.vendor.locationVisibility,location:window.vendor.location,publicLocation:window.vendor.publicLocation}), opensAt:window.opensAt?.toISOString()??null, closesAt: window.closesAt?.toISOString() ?? null, mode:window.mode, theme: window.theme, isOpen: isWindowAcceptingOrders(window), products: window.windowProducts.filter((item)=>item.product.active).map((item)=>({ id:item.id,name:item.product.name,description:item.product.description,type:item.product.type,priceKobo:item.priceKobo,image:item.product.imageUrl||"https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=1000&q=80",inventory:item.inventoryLimit,sold:item.soldQty,reserved:item.reservedQty,maxPerCustomer:item.maxPerCustomer })) };
  return <Storefront data={data}/>;
}
