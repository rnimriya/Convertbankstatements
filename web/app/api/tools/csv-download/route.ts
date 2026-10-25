/**
 * POST /api/tools/csv-download — .qbo of mapped generic-CSV rows (Pro-gated).
 * Body: { rows: GenericRow[] }. Rows are re-validated here (date format,
 * finite amounts, capped at 5000) so the download cannot be abused to mint
 * arbitrary QBO bodies. Requires a signed-in Pro/Business account, same as
 * every other tool QBO download.
 */
import { NextRequest, NextResponse } from "next/server";
import { checkUploadRateLimit } from "@/lib/rate-limit";
import { genericRowsToQbo, type GenericRow } from "@/lib/tools/csv-to-qbo";
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

  let body: { rows?: GenericRow[] };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const rows = Array.isArray(body.rows) ? body.rows.slice(0, 5000) : [];
  const clean: GenericRow[] = [];
  for (const r of rows) {
    if (!r || typeof r.amount !== "number" || !Number.isFinite(r.amount)) continue;
    if (!/^\d{4}-\d{2}-\d{2}$/.test(r.date ?? "")) continue;
    clean.push({
      date: r.date,
      payee: String(r.payee ?? "Transaction").slice(0, 120),
      amount: Math.round(Number(r.amount) * 100) / 100,
      memo: typeof r.memo === "string" ? r.memo.slice(0, 120) : "",
      balance: typeof r.balance === "number" && Number.isFinite(r.balance) ? r.balance : null,
    });
  }
  if (clean.length === 0) {
    return NextResponse.json({ error: "No valid rows to export." }, { status: 400 });
  }

  const qbo = genericRowsToQbo(clean);
  return new NextResponse(qbo, {
    headers: {
      "Content-Type": "application/octet-stream",
      "Content-Disposition": 'attachment; filename="transactions.qbo"',
    },
  });
}
