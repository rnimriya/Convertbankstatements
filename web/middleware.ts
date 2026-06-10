import { NextResponse, type NextRequest } from "next/server";
import createIntlMiddleware from "next-intl/middleware";
import { verifyJWT } from "@/lib/auth/jwt";
import { routing } from "@/i18n/routing";

const PROTECTED = ["/dashboard"];
const AUTH_PAGES = ["/login", "/signup", "/forgot-password", "/reset-password"];

const intlMiddleware = createIntlMiddleware(routing);

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // Strip locale prefix to get the canonical path for auth checks
  const localePattern = /^\/(hi|ta|te|kn|ml|mr|gu|pa)(\/|$)/;
  const strippedPath = path.replace(localePattern, "/");

  const isProtected = PROTECTED.some((p) => strippedPath.startsWith(p));
  const isAuthPage = AUTH_PAGES.some((p) => strippedPath.startsWith(p));

  // Explicit logout: clear cookie and redirect to /login
  if (request.nextUrl.searchParams.has("logout")) {
    const res = NextResponse.redirect(new URL("/login", request.url));
    res.cookies.delete("bs_token");
    return res;
  }

  // Run intl middleware for all non-auth, non-protected paths
  if (!isProtected && !isAuthPage) return intlMiddleware(request);

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

  return intlMiddleware(request);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|api|admin|.*\\..*).*)"],
};
