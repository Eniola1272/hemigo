import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireUser } from "@/lib/auth/session";
import { onboardingSchema } from "@/lib/validation/vendor";

export async function POST(request: Request) {
  const user = await requireUser();
  const parsed = onboardingSchema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Check your business details." }, { status: 400 });
  const existing = await db.vendorProfile.findUnique({ where: { slug: parsed.data.slug }, select: { id: true, ownerId: true } });
  if (existing && existing.ownerId !== user.id) return NextResponse.json({ error: "That Hemigo link is already taken." }, { status: 409 });
  const vendor = await db.$transaction(async (tx) => {
    const profile = existing
      ? await tx.vendorProfile.update({ where: { id: existing.id }, data: { ...parsed.data, whatsapp: parsed.data.whatsapp || null, contactEmail: parsed.data.contactEmail || null, onboardingCompleted: true } })
      : await tx.vendorProfile.create({ data: { ownerId: user.id, ...parsed.data, whatsapp: parsed.data.whatsapp || null, contactEmail: parsed.data.contactEmail || null, onboardingCompleted: true } });
    await tx.vendorMember.upsert({ where: { userId_vendorId: { userId: user.id, vendorId: profile.id } }, update: { role: "OWNER" }, create: { userId: user.id, vendorId: profile.id, role: "OWNER" } });
    return profile;
  });
  return NextResponse.json({ vendor: { id: vendor.id, slug: vendor.slug } }, { status: 201 });
}
