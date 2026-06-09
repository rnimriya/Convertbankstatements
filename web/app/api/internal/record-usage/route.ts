import { NextRequest, NextResponse } from "next/server";
import { timingSafeEqual } from "crypto";
import { incrementPages } from "@/lib/auth/users";

function isValidApiKey(provided: string | null): boolean {
  const expected = process.env.BACKEND_API_KEY ?? "";
  if (!expected || !provided) return false;
  try {
    const a = Buffer.from(expected);
    const b = Buffer.from(provided);
    if (a.length !== b.length) return false;
    return timingSafeEqual(a, b);
  } catch {
    return false;
  }
}

export async function POST(req: NextRequest) {
  if (!isValidApiKey(req.headers.get("x-api-key"))) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await req.json();
  const { userId, pageCount } = body;

  if (
    !userId ||
    typeof userId !== "string" ||
    typeof pageCount !== "number" ||
    !Number.isInteger(pageCount) ||
    pageCount <= 0 ||
    pageCount > 1000
  ) {
    return NextResponse.json(
      { error: "userId (string) and pageCount (integer 1–1000) are required." },
      { status: 400 }
    );
  }

  await incrementPages(userId, pageCount);
  return NextResponse.json({ ok: true });
}
