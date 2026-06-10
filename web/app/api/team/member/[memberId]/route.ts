import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { findById } from "@/lib/auth/users";
import { Redis } from "@upstash/redis";

function getRedis() {
  if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
    return new Redis({ url: process.env.UPSTASH_REDIS_REST_URL!, token: process.env.UPSTASH_REDIS_REST_TOKEN! });
  }
  return null;
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ memberId: string }> }
) {
  const { memberId } = await params;
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = await findById(session.sub);
  if (!user || user.tier !== "BUSINESS") {
    return NextResponse.json({ error: "Business plan required." }, { status: 403 });
  }

  const teamId = user.teamId ?? user.id;
  const redis = getRedis();
  if (redis) {
    await redis.hdel(`cs:team:${teamId}`, `member:${memberId}`);
  }

  return NextResponse.json({ ok: true });
}
