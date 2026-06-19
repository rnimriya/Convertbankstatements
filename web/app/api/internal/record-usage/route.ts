import { NextRequest, NextResponse } from "next/server";
import { incrementPages } from "@/lib/auth/users";
import { validateBackendApiKey } from "@/lib/api-auth";

export async function POST(req: NextRequest) {
  if (!validateBackendApiKey(req.headers.get("x-api-key"))) {
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
