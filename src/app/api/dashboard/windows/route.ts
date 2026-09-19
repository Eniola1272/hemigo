import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireVendor } from "@/lib/auth/session";
import { windowSchema } from "@/lib/validation/vendor";

export async function GET() {
  const { vendor } = await requireVendor();
  const windows = await db.sellingWindow.findMany({ where: { vendorId: vendor.id }, include: { _count: { select: { orders: true, windowProducts: true } }, orders: { where: { status: "PAID" }, select: { totalKobo: true } } }, orderBy: { createdAt: "desc" } });
  return NextResponse.json({ windows });
}

export async function POST(request: Request) {
  const { vendor } = await requireVendor();
  const parsed = windowSchema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Check the selling-window details." }, { status: 400 });
  const productIds = parsed.data.products.map((item) => item.productId);
  const ownedProducts = await db.product.count({ where: { id: { in: productIds }, vendorId: vendor.id, active: true } });
  if (ownedProducts !== new Set(productIds).size) return NextResponse.json({ error: "One or more selected products are unavailable." }, { status: 400 });
  const base = parsed.data.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  let slug = base; let suffix = 1;
  while (await db.sellingWindow.findUnique({ where: { vendorId_slug: { vendorId: vendor.id, slug } }, select: { id: true } })) slug = `${base}-${++suffix}`;
  const now = new Date();
  const status = !parsed.data.publish ? "DRAFT" : parsed.data.mode === "SHOP" ? "LIVE" : parsed.data.opensAt! > now ? "UPCOMING" : parsed.data.closesAt! <= now ? "CLOSED" : "LIVE";
  const window = await db.sellingWindow.create({ data: { vendorId: vendor.id, name: parsed.data.name, slug, description: parsed.data.description, headline: parsed.data.headline, mode: parsed.data.mode, opensAt: parsed.data.opensAt, closesAt: parsed.data.closesAt, fulfillmentAt: parsed.data.fulfillmentAt, allowPayLater: parsed.data.allowPayLater, invoiceHoldMinutes: parsed.data.invoiceHoldMinutes, invoiceReservesInventory: parsed.data.invoiceReservesInventory, theme: parsed.data.theme, status, windowProducts: { create: parsed.data.products.map((item) => ({ productId: item.productId, priceKobo: Math.round(item.priceNaira * 100), inventoryLimit: item.inventoryLimit, maxPerCustomer: item.maxPerCustomer })) } }, include: { windowProducts: true } });
  return NextResponse.json({ window, shareUrl: window.mode === "SHOP" ? `/${vendor.slug}` : `/${vendor.slug}/${window.slug}` }, { status: 201 });
}
