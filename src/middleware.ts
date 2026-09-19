import { NextResponse, type NextRequest } from "next/server";
import { SESSION_COOKIE } from "@/lib/auth/constants";

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
      return NextResponse.json({ error: "Invalid request origin." }, { status: 403 });
    }
  }

  if (!request.nextUrl.pathname.startsWith("/dashboard")) {
    return NextResponse.next();
  }

  const token = request.cookies.get(SESSION_COOKIE)?.value;
  if (!token) {
    return NextResponse.redirect(
      new URL(
        `/login?next=${encodeURIComponent(request.nextUrl.pathname)}`,
        request.url,
      ),
    );
  }

  return NextResponse.next();
}

export const config = { matcher: ["/dashboard/:path*", "/api/:path*"] };
