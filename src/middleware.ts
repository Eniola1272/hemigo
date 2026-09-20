import { NextResponse, type NextRequest } from "next/server";
import { SESSION_COOKIE } from "@/lib/auth/constants";

const noIndexPrefixes = [
  "/api/",
  "/checkout/",
  "/dashboard",
  "/forgot-password",
  "/invoice/",
  "/login",
  "/messages",
  "/onboarding",
  "/order/",
  "/purchases",
  "/receipt/",
  "/reset-password",
  "/signup",
  "/ticket/",
  "/verify-email",
];

function withRobotsHeader(response: NextResponse, pathname: string) {
  if (noIndexPrefixes.some((prefix) => pathname.startsWith(prefix))) {
    response.headers.set("X-Robots-Tag", "noindex, nofollow, noarchive");
  }
  return response;
}

function isAllowedOrigin(request: NextRequest, origin: string) {
  try {
    const originUrl = new URL(origin);
    const requestHost = request.headers.get("host") ?? request.nextUrl.host;

    if (originUrl.host === requestHost) return true;
    if (process.env.NODE_ENV === "production") return false;

    const requestUrl = new URL(`${request.nextUrl.protocol}//${requestHost}`);
    const localHosts = new Set(["localhost", "127.0.0.1", "[::1]"]);

    return (
      localHosts.has(originUrl.hostname) &&
      localHosts.has(requestUrl.hostname) &&
      originUrl.port === requestUrl.port
    );
  } catch {
    return false;
  }
}

export async function middleware(request: NextRequest) {
  const unsafeMethod = !["GET", "HEAD", "OPTIONS"].includes(request.method);
  if (
    unsafeMethod &&
    request.nextUrl.pathname.startsWith("/api/") &&
    !request.nextUrl.pathname.startsWith("/api/webhooks/") &&
    !request.nextUrl.pathname.startsWith("/api/jobs/")
  ) {
    const origin = request.headers.get("origin");
    if (
      (origin && !isAllowedOrigin(request, origin)) ||
      (!origin && process.env.NODE_ENV === "production")
    ) {
      return withRobotsHeader(
        NextResponse.json({ error: "Invalid request origin." }, { status: 403 }),
        request.nextUrl.pathname,
      );
    }
  }

  if (!request.nextUrl.pathname.startsWith("/dashboard")) {
    return withRobotsHeader(NextResponse.next(), request.nextUrl.pathname);
  }

  const token = request.cookies.get(SESSION_COOKIE)?.value;
  if (!token) {
    return withRobotsHeader(NextResponse.redirect(
      new URL(
        `/login?next=${encodeURIComponent(request.nextUrl.pathname)}`,
        request.url,
      ),
    ), request.nextUrl.pathname);
  }

  return withRobotsHeader(NextResponse.next(), request.nextUrl.pathname);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|icon.png|brand/).*)"],
};
