import { NextResponse, type NextRequest } from "next/server";
import { verifyJWT } from "@/lib/auth/jwt";

const PROTECTED = ["/dashboard"];
const AUTH_PAGES = ["/login", "/signup"];

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const isProtected = PROTECTED.some((p) => path.startsWith(p));
  const isAuthPage = AUTH_PAGES.includes(path);

  // Clear session if requested (breaks redirect loops when user is deleted from DB but JWT is still valid)
  if (isAuthPage && request.nextUrl.searchParams.has("clear")) {
    const res = NextResponse.next();
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

  if (isAuthPage && user) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|api).*)"],
};
