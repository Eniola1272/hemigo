import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireVendor } from "@/lib/auth/session";
import { productSchema } from "@/lib/validation/vendor";

export async function GET() {
  const { vendor } = await requireVendor();
  const products = await db.product.findMany({ where: { vendorId: vendor.id, active: true }, orderBy: { createdAt: "desc" } });
  return NextResponse.json({ products });
}

export async function POST(request: Request) {
  const { vendor } = await requireVendor();
  const parsed = productSchema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Check the product details." }, { status: 400 });
  const base = parsed.data.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  let slug = base;
  let suffix = 1;
  while (await db.product.findUnique({ where: { vendorId_slug: { vendorId: vendor.id, slug } }, select: { id: true } })) slug = `${base}-${++suffix}`;
  const product = await db.product.create({ data: { vendorId: vendor.id, name: parsed.data.name, slug, description: parsed.data.description, imageUrl: parsed.data.imageUrl || null, defaultPrice: Math.round(parsed.data.defaultPriceNaira * 100) } });
  return NextResponse.json({ product }, { status: 201 });
}
