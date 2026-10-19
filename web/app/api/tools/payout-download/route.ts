/**
 * POST /api/tools/payout-download — .qbo of the clearing entries (Pro-gated).
 * Body: { payouts: PayoutSummary[] }. The summaries are recomputed only from
 * the posted qboTransactions, so no file re-upload is needed.
 */
import { NextRequest, NextResponse } from "next/server";
import { checkUploadRateLimit } from "@/lib/rate-limit";
import { payoutsToQbo, type PayoutSummary } from "@/lib/tools/payout";
import {
  qboDownloadGate,
  QBO_LOCKED_MESSAGE,
  requireToolUser,
  SIGNUP_REQUIRED_ERROR,
  SIGNUP_REQUIRED_CODE,
} from "@/lib/tools/download-gate";
import type { Transaction } from "@/types/billing";

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

  let body: { payouts?: PayoutSummary[] };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const payouts = Array.isArray(body.payouts) ? body.payouts : [];
  const txns: Transaction[] = [];
  for (const p of payouts.slice(0, 200)) {
    if (!Array.isArray(p.qboTransactions)) continue;
    for (const t of p.qboTransactions.slice(0, 50)) {
      if (typeof t?.amount !== "number" || !t?.description) continue;
      txns.push({
        date: /^\d{4}-\d{2}-\d{2}$/.test(t.date ?? "") ? t.date : "1970-01-01",
        description: String(t.description).slice(0, 120),
        amount: Math.round(Number(t.amount) * 100) / 100,
        balance: null,
        category: typeof t.category === "string" ? t.category.slice(0, 60) : null,
        reference: typeof t.reference === "string" ? t.reference.slice(0, 60) : null,
      });
    }
  }
  if (txns.length === 0) {
    return NextResponse.json({ error: "No clearing entries to export." }, { status: 400 });
  }

  const qbo = payoutsToQbo([{ qboTransactions: txns } as PayoutSummary]);
  return new NextResponse(qbo, {
    headers: {
      "Content-Type": "application/octet-stream",
      "Content-Disposition": 'attachment; filename="payout-clearing.qbo"',
    },
  });
}
