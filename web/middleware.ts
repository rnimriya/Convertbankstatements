import { NextResponse, NextRequest } from "next/server";
import createIntlMiddleware from "next-intl/middleware";
import { verifyJWT, signJWT, SESSION_TTL_SECONDS } from "@/lib/auth/jwt";
import { isDeployed } from "@/lib/env";
import { BUILD_NONCE } from "@/lib/csp-nonce";
import { routing } from "@/i18n/routing";

/**
 * DYNAMIC tier — auth flows, dashboard and per-token portal pages. Their HTML
 * is personalized/redirect-sensitive, so responses must never be cached.
 * Everything else is static HTML identical for every visitor and safe for the
 * edge cache (session-dependent UI resolves client-side via /api/auth/me).
 */
const DYNAMIC_PREFIXES = [
  "/dashboard",
  "/login",
  "/signup",
  "/forgot-password",
  "/reset-password",
  "/verify-email",
  "/p",
];

/** True for a pathname (after stripping an optional /en locale prefix). */
function isDynamicTier(path: string): boolean {
  const stripped = path.replace(/^\/(en)(\/|$)/, "/");
  return DYNAMIC_PREFIXES.some(
    (p) => stripped === p || stripped.startsWith(p + "/")
  );
}

const PROTECTED = ["/dashboard"];
const AUTH_PAGES = ["/login", "/signup", "/forgot-password", "/reset-password"];
const SESSION_COOKIE = "bs_token";
// Re-issue a still-valid token once it's older than this (i.e. < TTL-slide left).
const SLIDE_AFTER_SECONDS = 24 * 60 * 60; // 1 day

const intlMiddleware = createIntlMiddleware(routing);

/** Per-request CSP. Drops 'unsafe-inline' from script-src in favour of a nonce;
 *  Razorpay's checkout script stays allowed by host. Styles keep 'unsafe-inline'
 *  (Tailwind / inline style props). */
function buildCsp(nonce: string, extraNonce?: string): string {
  const extra = extraNonce ? ` 'nonce-${extraNonce}'` : "";
  return [
    "default-src 'self'",
    `script-src 'self' 'nonce-${nonce}'${extra} https://checkout.razorpay.com https://www.googletagmanager.com`,
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

  const strippedPath = path;

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

  // CSP nonce strategy (two tiers):
  // - Static tier: the deployment-wide BUILD_NONCE. Static pages are
  //   prerendered with this value, so the served CSP must match it exactly.
  // - Dynamic tier (auth/dashboard/portals): a fresh per-request nonce, as
  //   before. The CSP additionally allows BUILD_NONCE because the shared
  //   layout's own inline scripts (GA config, JSON-LD, theme init) carry it;
  //   the page's own framework scripts use the per-request value via x-nonce.
  // script-src never gains 'unsafe-inline'. The nonce is propagated via the
  // REQUEST headers so Next.js applies it to its own inline scripts.
  const dynamic = isDynamicTier(path);
  const nonce = dynamic
    ? Buffer.from(crypto.randomUUID()).toString("base64")
    : BUILD_NONCE;
  const csp = dynamic ? buildCsp(nonce, BUILD_NONCE) : buildCsp(nonce);

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-nonce", nonce);
  requestHeaders.set("content-security-policy", csp);

  // Routing: only already-prefixed /en paths go through the next-intl
  // middleware (it answers NextResponse.next() for them). Prefix-less paths
  // skip it and are mapped to /en by the afterFiles rewrite in
  // next.config.js instead. Why: a middleware REWRITE response makes Vercel
  // discard middleware-set response headers (the origin function's
  // Cache-Control wins → private/no-store → nothing is edge-cached), while
  // headers on a next() response are merged over the origin response. With
  // the rewrite living in config, the Cache-Control set below survives and
  // public pages are CDN-cacheable. Locale resolution is unaffected:
  // i18n/request.ts falls back to the default locale (en) when the intl
  // middleware did not run.
  let response: NextResponse;
  if (path === "/en" || path.startsWith("/en/")) {
    const intlRequest = new NextRequest(request, { headers: requestHeaders });
    response = intlMiddleware(intlRequest as any);
  } else {
    response = NextResponse.next({ request: { headers: requestHeaders } });
  }
  response.headers.set("content-security-policy", csp);

  // Cache behavior: static-tier pages render identically for every visitor
  // (session UI resolves client-side via /api/auth/me), so the edge may cache
  // them for an hour with a day of stale-while-revalidate. Dynamic-tier
  // pages must never be cached — auth state is evaluated per request.
  response.headers.set(
    "Cache-Control",
    dynamic
      ? "private, no-cache, no-store"
      : "public, s-maxage=3600, stale-while-revalidate=86400"
  );

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
  matcher: ["/((?!_next/static|_next/image|favicon.ico|api|admin|opengraph-image|twitter-image|icon|sitemap|robots|manifest|.*\\..*).*)"],
};
