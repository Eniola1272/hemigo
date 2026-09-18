import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Storefront } from "@/components/storefront/storefront";
import { db } from "@/lib/db";

export const metadata: Metadata = { title: "Storefront" };
export default async function StorefrontPage({ params }: { params: Promise<{ vendorSlug: string; windowSlug: string }> }) {
  const { vendorSlug, windowSlug } = await params;
  const window = await db.sellingWindow.findFirst({ where: { slug: windowSlug, vendor: { slug: vendorSlug }, status: { not: "DRAFT" } }, include: { vendor: true, windowProducts: { include: { product: true }, orderBy: { product: { createdAt: "asc" } } } } });
  if (!window) notFound();
  const now = new Date();
  const data = { windowId: window.id, vendorName: window.vendor.name, vendorSlug: window.vendor.slug, windowName: window.name, windowSlug: window.slug, headline: window.headline || window.name, description: window.description || "A limited selling window, prepared just for you.", location: window.vendor.location, closesAt: window.closesAt.toISOString(), theme: window.theme, isOpen: window.opensAt <= now && window.closesAt > now, products: window.windowProducts.filter((item)=>item.product.active).map((item)=>({ id:item.id,name:item.product.name,description:item.product.description,priceKobo:item.priceKobo,image:item.product.imageUrl||"https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=1000&q=80",inventory:item.inventoryLimit,sold:item.soldQty,reserved:item.reservedQty,maxPerCustomer:item.maxPerCustomer })) };
  return <Storefront data={data}/>;
}
