import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { saveQuickbooksRefreshToken } from "@/lib/auth/users";

export async function GET(req: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const url = req.nextUrl;
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const realmId = url.searchParams.get("realmId"); // Intuit provides this, could be saved if needed

  if (!code) {
    return NextResponse.json({ error: "No authorization code provided" }, { status: 400 });
  }

  if (state !== session.sub) {
    return NextResponse.json({ error: "Invalid state token" }, { status: 400 });
  }

  const clientId = process.env.QUICKBOOKS_CLIENT_ID;
  const clientSecret = process.env.QUICKBOOKS_CLIENT_SECRET;
  
  if (!clientId || !clientSecret) {
    return NextResponse.json({ error: "QuickBooks integration not configured" }, { status: 500 });
  }

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";
  const redirectUri = `${baseUrl}/api/quickbooks/callback`;

  const authHeader = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');

  try {
    const tokenResponse = await fetch("https://oauth.platform.intuit.com/oauth2/v1/tokens/bearer", {
      method: "POST",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/x-www-form-urlencoded",
        "Authorization": `Basic ${authHeader}`
      },
      body: new URLSearchParams({
        grant_type: "authorization_code",
        code,
        redirect_uri: redirectUri
      })
    });

    const data = await tokenResponse.json();

    if (!tokenResponse.ok) {
      console.error("Intuit Token Error:", data);
      return NextResponse.redirect(new URL("/dashboard?error=qb_auth_failed", baseUrl));
    }

    if (data.refresh_token) {
      await saveQuickbooksRefreshToken(session.sub, data.refresh_token);
    }

    return NextResponse.redirect(new URL("/dashboard", baseUrl));
  } catch (error) {
    console.error("QuickBooks Auth Error:", error);
    return NextResponse.redirect(new URL("/dashboard?error=qb_auth_error", process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000"));
  }
}
