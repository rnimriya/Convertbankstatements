import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { createPortal, listPortals } from "@/lib/portals";
import { checkCsrfOrigin } from "@/lib/csrf";
import { z } from "zod";

const createSchema = z.object({
  label: z.string().max(80).optional(),
  slug: z.string().max(80).optional(),
});

/** GET /api/portals — list caller's portals */
export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const portals = await listPortals(session.sub);
  return NextResponse.json({ portals });
}

/** POST /api/portals — create a new portal */
export async function POST(req: NextRequest) {
  const csrf = checkCsrfOrigin(req);
  if (csrf) return csrf;

  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => ({}));
  const parsed = createSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid request" }, { status: 400 });

  let portal;
  try {
    portal = await createPortal(session.sub, parsed.data.label ?? "", parsed.data.slug);
  } catch (err: unknown) {
    return NextResponse.json({ error: err instanceof Error ? err.message : "Creation failed" }, { status: 400 });
  }
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? "https://convertstatement.online";

  return NextResponse.json({
    portal,
    url: `${baseUrl}/p/${portal.token}`,
  }, { status: 201 });
}
