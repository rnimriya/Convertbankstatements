import { NextResponse, NextRequest } from "next/server";
import createIntlMiddleware from "next-intl/middleware";
import { verifyJWT, signJWT, SESSION_TTL_SECONDS } from "@/lib/auth/jwt";
import { isDeployed } from "@/lib/env";
import { routing } from "@/i18n/routing";

const PROTECTED = ["/dashboard"];
const AUTH_PAGES = ["/login", "/signup", "/forgot-password", "/reset-password"];
const SESSION_COOKIE = "bs_token";
// Re-issue a still-valid token once it's older than this (i.e. < TTL-slide left).
const SLIDE_AFTER_SECONDS = 24 * 60 * 60; // 1 day

const intlMiddleware = createIntlMiddleware(routing);

/** Per-request CSP. Drops 'unsafe-inline' from script-src in favour of a nonce;
 *  Razorpay's checkout script stays allowed by host. Styles keep 'unsafe-inline'
 *  (Tailwind / inline style props). */
function buildCsp(nonce: string): string {
  return [
    "default-src 'self'",
    `script-src 'self' 'nonce-${nonce}' https://checkout.razorpay.com`,
    "frame-src https://api.razorpay.com",
    "connect-src 'self' https://api.razorpay.com",
    "style-src 'self' 'unsafe-inline'",
    "font-src 'self' https://fonts.gstatic.com",
    "img-src 'self' data: https:",
    "object-src 'none'",
    "base-uri 'self'",
    "frame-ancestors 'none'",
  ].join("; ");
}

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // Strip locale prefix to get the canonical path for auth checks
  const localePattern = /^\/(hi|ta|te|kn|ml|mr|gu|pa)(\/|$)/;
  const strippedPath = path.replace(localePattern, "/");

  const isProtected = PROTECTED.some((p) => strippedPath.startsWith(p));
  const isAuthPage = AUTH_PAGES.some((p) => strippedPath.startsWith(p));

  // Verify the session once; reuse for redirects and sliding renewal.
  const token = request.cookies.get(SESSION_COOKIE)?.value ?? "";
  const user = token ? await verifyJWT(token) : null;

  if (isProtected && !user) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("redirectTo", strippedPath);
    return NextResponse.redirect(url);
  }
  if (isAuthPage && user) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // Generate a per-request nonce and propagate it via the REQUEST headers so
  // Next.js automatically applies it to its own inline (hydration) scripts.
  const nonce = Buffer.from(crypto.randomUUID()).toString("base64");
  const csp = buildCsp(nonce);

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-nonce", nonce);
  requestHeaders.set("content-security-policy", csp);

  const intlRequest = new NextRequest(request, { headers: requestHeaders });
  const response = intlMiddleware(intlRequest);
  response.headers.set("content-security-policy", csp);

  // Sliding session renewal: if the token is still valid but older than the
  // slide threshold, re-issue it with a fresh 7-day expiry so active users stay
  // logged in. Idle sessions still expire at the original 7-day mark. The same
  // tokenVersion is carried over, so getSession's revocation check still applies.
  if (user?.exp) {
    const remaining = user.exp - Math.floor(Date.now() / 1000);
    if (remaining > 0 && remaining < SESSION_TTL_SECONDS - SLIDE_AFTER_SECONDS) {
      const fresh = await signJWT({
        sub: user.sub,
        email: user.email,
        name: user.name,
        tokenVersion: user.tokenVersion,
      });
      response.cookies.set(SESSION_COOKIE, fresh, {
        httpOnly: true,
        secure: isDeployed(),
        sameSite: "lax",
        path: "/",
        maxAge: SESSION_TTL_SECONDS,
      });
    }
  }

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|api|admin|.*\\..*).*)"],
};
