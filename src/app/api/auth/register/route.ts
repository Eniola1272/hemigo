import { hash } from "bcryptjs";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { registerSchema } from "@/lib/validation/auth";
import { randomBytes } from "node:crypto";
import { createSession, hashToken } from "@/lib/auth/session";
import { sendEmail } from "@/lib/email";
import { enforceAuthRateLimit } from "@/lib/auth/rate-limit";

export async function POST(request: Request) {
  const parsed = registerSchema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Check your details." }, { status: 400 });
  try{await enforceAuthRateLimit("register",parsed.data.email,5,60*60_000)}catch(error){return NextResponse.json({error:error instanceof Error?error.message:"Too many attempts."},{status:429})}
  const exists = await db.user.findUnique({ where: { email: parsed.data.email }, select: { id: true } });
  if (exists) return NextResponse.json({ error: "An account already exists for this email." }, { status: 409 });
  const user = await db.user.create({
    data: {
      name: parsed.data.name,
      email: parsed.data.email,
      passwordHash: await hash(parsed.data.password, 12),
      emailVerifiedAt: new Date(), // Auto-verify new accounts until custom email domain is configured
    },
  });
  const verificationToken = randomBytes(32).toString("base64url");
  await db.emailVerificationToken.create({
    data: {
      userId: user.id,
      tokenHash: hashToken(verificationToken),
      expiresAt: new Date(Date.now() + 24 * 60 * 60_000),
    },
  });
  const verificationUrl = `${process.env.NEXT_PUBLIC_APP_URL || ""}/api/auth/verify-email?token=${verificationToken}`;
  try {
    await sendEmail({
      to: user.email,
      subject: "Verify your Hemigo account",
      html: `<p>Welcome to Hemigo.</p><p><a href="${verificationUrl}">Verify your email</a></p>`,
    });
  } catch (emailErr) {
    console.warn("[Register email warning]", emailErr);
  }
  await createSession(user.id);
  return NextResponse.json(
    {
      user: { id: user.id, name: user.name, email: user.email },
      verificationRequired: false,
      autoVerified: true,
      devVerificationUrl: verificationUrl,
    },
    { status: 201 }
  );
}
