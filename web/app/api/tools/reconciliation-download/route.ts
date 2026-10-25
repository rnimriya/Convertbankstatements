/**
 * POST /api/tools/reconciliation-download — .qbo of the matched entries only
 * (Pro-gated). Body: the reconciliation result's entries array, re-validated
 * here (matched entries with a date, payee, and finite amount, capped at
 * 5000). Unmatched entries are never exported — the point of the download
 * is a clean file, not a copy of the discrepancy. Requires a signed-in
 * Pro/Business account, same as every other tool QBO download.
 */
import { NextRequest, NextResponse } from "next/server";
import { checkUploadRateLimit } from "@/lib/rate-limit";
import { matchedEntriesToQbo, type ReconResult } from "@/lib/tools/reconciliation";
import {
  qboDownloadGate,
  QBO_LOCKED_MESSAGE,
  requireToolUser,
  SIGNUP_REQUIRED_ERROR,
  SIGNUP_REQUIRED_CODE,
} from "@/lib/tools/download-gate";

export const maxDuration = 30;

export async function POST(req: NextRequest) {
  const limited = await checkUploadRateLimit(req);
  if (limited) return limited;

  const toolUser = await requireToolUser();
  if (!toolUser) {
    return NextResponse.json(
      { error: SIGNUP_REQUIRED_ERROR, code: SIGNUP_REQUIRED_CODE },
      { status: 401 }
    );
  }

  const gate = await qboDownloadGate();
  if (!gate.ok) {
    return NextResponse.json(
      { error: QBO_LOCKED_MESSAGE, gate: gate.reason },
      { status: gate.reason === "login" ? 401 : 403 }
    );
  }

  let body: { entries?: ReconResult["entries"] };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const entries = Array.isArray(body.entries) ? body.entries.slice(0, 5000) : [];
  const clean = entries.filter(
    (e) =>
      e &&
      e.kind === "matched" &&
      e.statement &&
      /^\d{4}-\d{2}-\d{2}$/.test(e.statement.date ?? "") &&
      typeof e.statement.amount === "number" &&
      Number.isFinite(e.statement.amount)
  );
  if (clean.length === 0) {
    return NextResponse.json({ error: "No matched entries to export." }, { status: 400 });
  }

  let qbo: string;
  try {
    qbo = matchedEntriesToQbo({
      entries: clean,
    } as ReconResult);
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Could not build the QBO." },
      { status: 400 }
    );
  }

  return new NextResponse(qbo, {
    headers: {
      "Content-Type": "application/octet-stream",
      "Content-Disposition": 'attachment; filename="reconciled-matched.qbo"',
    },
  });
}
