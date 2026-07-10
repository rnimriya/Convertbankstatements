import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET() {
  // In a real implementation, we would exchange the `code` for an access token
  // and refresh token from Intuit, and save the refresh token to the User model in Redis.
  
  // For the beta/testing phase, we just set a cookie to flag the mock integration as connected.
  const cookieStore = await cookies();
  cookieStore.set("qb_mock_connected", "true", { 
    path: "/", 
    maxAge: 30 * 24 * 60 * 60, // 30 days
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production"
  });

  return NextResponse.redirect(new URL("/dashboard", process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000"));
}
