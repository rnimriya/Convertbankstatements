import { NextRequest, NextResponse } from "next/server";
import { randomBytes } from "crypto";
import { getSession } from "@/lib/auth/session";
import { getRedis } from "@/lib/redis";

const SCOPES = [
  "https://www.googleapis.com/auth/spreadsheets",
  "https://www.googleapis.com/auth/drive.file",
].join(" ");

export async function GET(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const clientId = process.env.GOOGLE_CLIENT_ID;
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? "https://convertstatement.online";
  const redirectUri = `${baseUrl}/api/google-sheets/callback`;

  if (!clientId) {
    return NextResponse.json({ error: "Google Sheets integration not configured." }, { status: 503 });
  }

  // Generate an opaque state token tied to the session user in Redis.
  // The callback verifies this token before trusting the userId, preventing IDOR.
  const stateToken = randomBytes(24).toString("hex");
  const redis = getRedis();
  if (redis) {
    await redis.set(`cs:gs:state:${stateToken}`, session.sub, { ex: 600 }); // 10-min TTL
  }

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: "code",
    scope: SCOPES,
    access_type: "offline",
    prompt: "consent",
    state: stateToken,
  });

  const url = `https://accounts.google.com/o/oauth2/v2/auth?${params}`;
  return NextResponse.json({ url });
}
