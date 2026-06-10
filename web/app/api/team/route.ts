import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { findById } from "@/lib/auth/users";
import { Redis } from "@upstash/redis";

function getRedis() {
  if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
    return new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL!,
      token: process.env.UPSTASH_REDIS_REST_TOKEN!,
    });
  }
  return null;
}

export async function GET(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = await findById(session.sub);
  if (!user || user.tier !== "BUSINESS") {
    return NextResponse.json({ error: "Business plan required." }, { status: 403 });
  }

  const redis = getRedis();
  if (!redis || !user.teamId) {
    return NextResponse.json({ members: [] });
  }

  const raw = await redis.hgetall(`cs:team:${user.teamId}`);
  if (!raw) return NextResponse.json({ members: [] });

  const members = Object.entries(raw)
    .filter(([k]) => k.startsWith("member:"))
    .map(([, v]) => (typeof v === "string" ? JSON.parse(v) : v));

  return NextResponse.json({ members });
}
