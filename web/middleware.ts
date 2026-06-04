import { NextResponse, type NextRequest } from "next/server";
import { verifyJWT } from "@/lib/auth/jwt";

const PROTECTED = ["/dashboard"];
const AUTH_PAGES = ["/login", "/signup", "/forgot-password", "/reset-password"];

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const isProtected = PROTECTED.some((p) => path.startsWith(p));
  const isAuthPage = AUTH_PAGES.some((p) => path.startsWith(p));

  // Explicit logout: only clear the cookie when ?logout=1 is present.
  // This is intentional — the user clicked "Sign out".
  if (request.nextUrl.searchParams.has("logout")) {
    const res = NextResponse.redirect(new URL("/login", request.url));
    res.cookies.delete("bs_token");
    return res;
  }

  // Only check auth when needed
  if (!isProtected && !isAuthPage) return NextResponse.next();

  const token = request.cookies.get("bs_token")?.value ?? "";
  const user = token ? await verifyJWT(token) : null;

  // Unauthenticated user trying to access a protected page
  if (isProtected && !user) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("redirectTo", path);
    return NextResponse.redirect(url);
  }

  // Logged-in users should not see login/signup/forgot/reset pages
  if (isAuthPage && user) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|api).*)"],
};
