import { NextRequest, NextResponse } from "next/server";
import { randomBytes } from "crypto";
import { getSession } from "@/lib/auth/session";
import { findById, setApiKey } from "@/lib/auth/users";

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = await findById(session.sub);
  if (!user || user.tier !== "BUSINESS") {
    return NextResponse.json({ error: "Business plan required." }, { status: 403 });
  }

  const key = `cs_live_${randomBytes(32).toString("hex")}`;
  await setApiKey(user.id, key);

  return NextResponse.json({ key });
}
