import { NextResponse, NextRequest } from "next/server";
import createIntlMiddleware from "next-intl/middleware";
import { verifyJWT } from "@/lib/auth/jwt";
import { routing } from "@/i18n/routing";

const PROTECTED = ["/dashboard"];
const AUTH_PAGES = ["/login", "/signup", "/forgot-password", "/reset-password"];

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

  // Auth redirects (no CSP/nonce needed on a redirect response)
  if (isProtected || isAuthPage) {
    const token = request.cookies.get("bs_token")?.value ?? "";
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
  }

  // Generate a per-request nonce and propagate it via the REQUEST headers so
  // Next.js automatically applies it to its own inline (hydration) scripts.
  const nonce = Buffer.from(crypto.randomUUID()).toString("base64");
  const csp = buildCsp(nonce);

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-nonce", nonce);
  requestHeaders.set("content-security-policy", csp);

  // Hand off to next-intl with the augmented request headers so the locale
  // rewrite carries the nonce/CSP through to server rendering.
  const intlRequest = new NextRequest(request, { headers: requestHeaders });
  const response = intlMiddleware(intlRequest);
  response.headers.set("content-security-policy", csp);
  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|api|admin|.*\\..*).*)"],
};
