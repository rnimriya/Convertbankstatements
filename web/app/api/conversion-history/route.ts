import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { getConversionLogs } from "@/lib/auth/users";

export async function GET(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const logs = await getConversionLogs(session.sub);
  const res = NextResponse.json(logs);
  res.headers.set("Cache-Control", "private, no-cache, no-store");
  return res;
}
