import { NextRequest, NextResponse } from "next/server";
import { setGoogleSheetsToken } from "@/lib/auth/users";
import { getRedis } from "@/lib/redis";

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get("code");
  const stateToken = req.nextUrl.searchParams.get("state");
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? "https://convertstatement.online";
  const errorUrl = new URL("/dashboard?sheets=error", baseUrl);

  if (!code || !stateToken) {
    return NextResponse.redirect(errorUrl);
  }

  // Verify the opaque state token against Redis — prevents IDOR where an
  // attacker could forge state=<victim_user_id> to hijack token storage.
  const redis = getRedis();
  if (!redis) return NextResponse.redirect(errorUrl);

  const userId = await redis.get<string>(`cs:gs:state:${stateToken}`);
  if (!userId) {
    // Token missing or expired (>10 min)
    return NextResponse.redirect(errorUrl);
  }
  // Consume the state token — one-time use
  await redis.del(`cs:gs:state:${stateToken}`);

  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const redirectUri = `${baseUrl}/api/google-sheets/callback`;

  if (!clientId || !clientSecret) {
    return NextResponse.redirect(errorUrl);
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
    return NextResponse.redirect(errorUrl);
  }
}
