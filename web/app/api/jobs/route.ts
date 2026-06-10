import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { Redis } from "@upstash/redis";

function getRedis() {
  if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
    return new Redis({ url: process.env.UPSTASH_REDIS_REST_URL!, token: process.env.UPSTASH_REDIS_REST_TOKEN! });
  }
  return null;
}

export async function GET(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const redis = getRedis();
  if (!redis) return NextResponse.json([]);

  const raw = await redis.lrange<string>(`cs:jobs:${session.sub}`, 0, 29);
  const jobs = raw.map(s => (typeof s === "string" ? JSON.parse(s) : s));
  return NextResponse.json(jobs);
}
