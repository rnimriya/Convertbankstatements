import { NextResponse, type NextRequest } from "next/server";
import { verifyJWT } from "@/lib/auth/jwt";

const PROTECTED = ["/dashboard"];
const AUTH_PAGES = ["/login", "/signup", "/forgot-password", "/reset-password"];

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const isProtected = PROTECTED.some((p) => path.startsWith(p));
  const isAuthPage = AUTH_PAGES.some((p) => path.startsWith(p));

  // Clear session if requested (breaks redirect loops when user is deleted from DB but JWT is still valid)
  if (request.nextUrl.searchParams.has("clear")) {
    const res = isProtected
      ? NextResponse.redirect(new URL("/login", request.url))
      : NextResponse.next();
    res.cookies.delete("bs_token");
    return res;
  }

  // Only check auth when needed
  if (!isProtected && !isAuthPage) return NextResponse.next();

  const token = request.cookies.get("bs_token")?.value ?? "";
  const user = token ? await verifyJWT(token) : null;

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
