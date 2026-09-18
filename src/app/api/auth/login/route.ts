import { compare } from "bcryptjs";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { createSession } from "@/lib/auth/session";
import { loginSchema } from "@/lib/validation/auth";
import { enforceAuthRateLimit } from "@/lib/auth/rate-limit";

export async function POST(request: Request) {
  const parsed = loginSchema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: "Check your email and password." }, { status: 400 });
  try{await enforceAuthRateLimit("login",parsed.data.email)}catch(error){return NextResponse.json({error:error instanceof Error?error.message:"Too many attempts."},{status:429})}
  const user = await db.user.findUnique({ where: { email: parsed.data.email } });
  if (!user || !(await compare(parsed.data.password, user.passwordHash))) return NextResponse.json({ error: "That email or password doesn’t match." }, { status: 401 });
  if (!user.emailVerifiedAt) return NextResponse.json({ error: "Verify your email before logging in." }, { status: 403 });
  await createSession(user.id);
  return NextResponse.json({ user: { id: user.id, name: user.name, email: user.email } });
}
