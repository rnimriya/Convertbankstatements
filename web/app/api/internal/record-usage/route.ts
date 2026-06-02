import { NextRequest, NextResponse } from "next/server";
import { incrementPages } from "@/lib/auth/users";

export async function POST(req: NextRequest) {
  const apiKey = req.headers.get("x-api-key");
  if (apiKey !== process.env.BACKEND_API_KEY) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await req.json();
  const { userId, pageCount } = body;

  if (!userId || typeof pageCount !== "number") {
    return NextResponse.json({ error: "userId and pageCount required" }, { status: 400 });
  }

  await incrementPages(userId, pageCount);
  return NextResponse.json({ ok: true });
}
