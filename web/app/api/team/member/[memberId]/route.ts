import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { findById } from "@/lib/auth/users";
import { getRedis } from "@/lib/redis";

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
  if (!redis) return NextResponse.json({ ok: true });

  // Ownership check — verify the member belongs to this team before deleting.
  // Without this, any BUSINESS user could delete members from other teams by guessing memberId.
  const existing = await redis.hget(`cs:team:${teamId}`, `member:${memberId}`);
  if (!existing) {
    return NextResponse.json({ error: "Member not found." }, { status: 404 });
  }

  await redis.hdel(`cs:team:${teamId}`, `member:${memberId}`);
  return NextResponse.json({ ok: true });
}
