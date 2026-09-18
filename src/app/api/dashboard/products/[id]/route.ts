import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireVendor } from "@/lib/auth/session";
import { productSchema } from "@/lib/validation/vendor";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { vendor } = await requireVendor();
  const { id } = await params;
  const owned = await db.product.findFirst({ where: { id, vendorId: vendor.id }, select: { id: true } });
  if (!owned) return NextResponse.json({ error: "Product not found." }, { status: 404 });
  const body = await request.json();
  if (body.action === "archive") { await db.product.update({ where: { id }, data: { active: false } }); return NextResponse.json({ success: true }); }
  const parsed = productSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0]?.message }, { status: 400 });
  const product = await db.product.update({ where: { id }, data: { name: parsed.data.name, description: parsed.data.description, imageUrl: parsed.data.imageUrl || null, defaultPrice: Math.round(parsed.data.defaultPriceNaira * 100) } });
  return NextResponse.json({ product });
}
