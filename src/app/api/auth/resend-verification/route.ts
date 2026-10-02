import { NextResponse } from "next/server";
import { randomBytes } from "crypto";
import { db } from "@/lib/db";
import { hashToken } from "@/lib/auth/session";
import { enforceAuthRateLimit } from "@/lib/auth/rate-limit";
import { sendVerificationEmail } from "@/lib/email";

export async function POST(request: Request) {
  try {
    const { email } = await request.json();
    if (!email || typeof email !== "string") {
      return NextResponse.json({ error: "Email is required." }, { status: 400 });
    }

    try {
      await enforceAuthRateLimit("resend-verification", email.toLowerCase(), 4, 60 * 60_000);
    } catch {
      return NextResponse.json(
        { error: "Too many verification requests. Please wait a bit." },
        { status: 429 }
      );
    }

    const user = await db.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (!user) {
      // Don't leak user existence
      return NextResponse.json({ success: true });
    }

    if (user.emailVerifiedAt) {
      return NextResponse.json({ success: true, alreadyVerified: true });
    }

    // Refresh token
    const verificationToken = randomBytes(32).toString("base64url");
    await db.emailVerificationToken.deleteMany({ where: { userId: user.id } });
    await db.emailVerificationToken.create({
      data: {
        userId: user.id,
        tokenHash: hashToken(verificationToken),
        expiresAt: new Date(Date.now() + 24 * 60 * 60_000),
      },
    });

    const verificationUrl = `${process.env.NEXT_PUBLIC_APP_URL || ""}/api/auth/verify-email?token=${verificationToken}`;

    await sendVerificationEmail({
      to: user.email,
      name: user.name,
      verificationUrl,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Resend verification error:", err);
    return NextResponse.json(
      { error: "Failed to resend verification email." },
      { status: 500 }
    );
  }
}
