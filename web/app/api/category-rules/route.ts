/**
 * /api/category-rules — the caller's learned auto-categorization rules.
 * GET: list · POST: add/update {pattern, category} · DELETE: {pattern}
 */
import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { checkCsrfOrigin } from "@/lib/csrf";
import {
  listCategoryRules,
  setCategoryRule,
  deleteCategoryRule,
} from "@/lib/user-categories";
import { z } from "zod";

const upsertSchema = z.object({
  pattern: z.string().min(2).max(60),
  category: z.string().min(1).max(40),
});
const deleteSchema = z.object({ pattern: z.string().min(1).max(60) });

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const rules = await listCategoryRules(session.sub);
  return NextResponse.json({ rules });
}

export async function POST(req: NextRequest) {
  const csrf = checkCsrfOrigin(req);
  if (csrf) return csrf;
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const parsed = upsertSchema.safeParse(await req.json().catch(() => ({})));
  if (!parsed.success) return NextResponse.json({ error: "Invalid request" }, { status: 400 });

  try {
    await setCategoryRule(session.sub, parsed.data.pattern, parsed.data.category);
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Could not save the rule" },
      { status: 400 }
    );
  }
  return NextResponse.json({ rules: await listCategoryRules(session.sub) });
}

export async function DELETE(req: NextRequest) {
  const csrf = checkCsrfOrigin(req);
  if (csrf) return csrf;
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const parsed = deleteSchema.safeParse(await req.json().catch(() => ({})));
  if (!parsed.success) return NextResponse.json({ error: "Invalid request" }, { status: 400 });

  await deleteCategoryRule(session.sub, parsed.data.pattern);
  return NextResponse.json({ rules: await listCategoryRules(session.sub) });
}
