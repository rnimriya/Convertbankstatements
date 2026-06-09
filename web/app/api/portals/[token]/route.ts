import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { deactivatePortal } from "@/lib/portals";

/** DELETE /api/portals/{token} — deactivate (soft-delete) a portal */
export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { token } = await params;
  const ok = await deactivatePortal(token, session.sub);
  if (!ok) return NextResponse.json({ error: "Portal not found or access denied" }, { status: 404 });

  return NextResponse.json({ ok: true });
}
