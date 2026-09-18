import { SignJWT } from "jose/jwt/sign";
import { jwtVerify } from "jose/jwt/verify";

export const SESSION_COOKIE = "hemigo_session";

function secret() {
  return new TextEncoder().encode(process.env.AUTH_SECRET ?? "hemigo-development-secret-change-before-production");
}

export async function createSessionToken(user: { id: string; email: string }) {
  return new SignJWT({ email: user.email })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(user.id)
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(secret());
}

export async function verifySessionToken(token: string) {
  const { payload } = await jwtVerify(token, secret(), { algorithms: ["HS256"] });
  if (!payload.sub || typeof payload.email !== "string") throw new Error("Invalid session.");
  return { userId: payload.sub, email: payload.email };
}
