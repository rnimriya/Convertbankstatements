import { NextRequest, NextResponse } from "next/server";
import { setGoogleSheetsToken } from "@/lib/auth/users";

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get("code");
  const userId = req.nextUrl.searchParams.get("state");
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? "https://convertstatement.com";

  if (!code || !userId) {
    return NextResponse.redirect(new URL("/dashboard?sheets=error", baseUrl));
  }

  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const redirectUri = `${baseUrl}/api/google-sheets/callback`;

  if (!clientId || !clientSecret) {
    return NextResponse.redirect(new URL("/dashboard?sheets=error", baseUrl));
  }

  try {
    const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        grant_type: "authorization_code",
      }),
    });

    const tokens = await tokenRes.json();
    if (!tokenRes.ok) throw new Error(tokens.error ?? "Token exchange failed");

    if (tokens.refresh_token) {
      await setGoogleSheetsToken(userId, tokens.refresh_token);
    }

    return NextResponse.redirect(new URL("/dashboard?sheets=connected", baseUrl));
  } catch {
    return NextResponse.redirect(new URL("/dashboard?sheets=error", baseUrl));
  }
}
