import { createHmac, randomBytes } from "node:crypto";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { SESSION_COOKIE, SESSION_TTL_SECONDS } from "./constants";

export function hashToken(token: string) {
  const secret = process.env.AUTH_SECRET;
  if (process.env.NODE_ENV === "production" && (!secret || secret.length < 32)) {
    throw new Error("AUTH_SECRET must contain at least 32 characters in production.");
  }
  return createHmac("sha256", secret || "hemigo-local-development-only")
    .update(token)
    .digest("hex");
}

export async function createSession(userId: string) {
  const token = randomBytes(32).toString("base64url");
  const requestHeaders = await headers();
  const expiresAt = new Date(Date.now() + SESSION_TTL_SECONDS * 1000);
  await db.session.create({ data: { userId, tokenHash: hashToken(token), expiresAt, userAgent: requestHeaders.get("user-agent"), ipAddress: requestHeaders.get("x-forwarded-for")?.split(",")[0]?.trim() } });
  (await cookies()).set(SESSION_COOKIE, token, { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", path: "/", maxAge: SESSION_TTL_SECONDS });
}

export async function deleteCurrentSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (token) await db.session.deleteMany({ where: { tokenHash: hashToken(token) } });
  cookieStore.set(SESSION_COOKIE, "", { httpOnly: true, expires: new Date(0), path: "/" });
}

export async function getCurrentUser() {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!token) return null;
  const session = await db.session.findUnique({ where: { tokenHash: hashToken(token) }, include: { user: true } });
  if (!session || session.expiresAt <= new Date()) return null;
  return session.user;
}

export async function requireUser() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  return user;
}

export async function requireVendor() {
  const user = await requireUser();
  const membership = await db.vendorMember.findFirst({ where: { userId: user.id }, include: { vendor: true }, orderBy: { createdAt: "asc" } });
  if (!membership) redirect("/onboarding");
  return { user, vendor: membership.vendor, role: membership.role };
}
