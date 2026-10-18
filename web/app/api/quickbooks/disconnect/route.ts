import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { checkCsrfOrigin } from "@/lib/csrf";
import { deleteConnection } from "@/lib/quickbooks";

export async function POST(req: NextRequest) {
  const csrf = checkCsrfOrigin(req);
  if (csrf) return csrf;
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  await deleteConnection(session.sub);
  return NextResponse.json({ connected: false });
}
