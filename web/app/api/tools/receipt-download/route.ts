/**
 * POST /api/tools/receipt-download — .qbo of the (user-reviewed) receipt
 * line items as expense transactions (Pro-gated). Body: { transactions }.
 */
import { NextRequest, NextResponse } from "next/server";
import { checkUploadRateLimit } from "@/lib/rate-limit";
import { transactionsToQBO } from "@/lib/mock-transactions";
import { withZeroLedger } from "@/lib/tools/payout";
import { qboDownloadGate, QBO_LOCKED_MESSAGE } from "@/lib/tools/download-gate";
import type { Transaction } from "@/types/billing";

export const maxDuration = 30;

export async function POST(req: NextRequest) {
  const limited = await checkUploadRateLimit(req);
  if (limited) return limited;

  const gate = await qboDownloadGate();
  if (!gate.ok) {
    return NextResponse.json(
      { error: QBO_LOCKED_MESSAGE, gate: gate.reason },
      { status: gate.reason === "login" ? 401 : 403 }
    );
  }

  let body: { transactions?: Transaction[] };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const txns: Transaction[] = [];
  for (const t of Array.isArray(body.transactions) ? body.transactions.slice(0, 200) : []) {
    if (typeof t?.amount !== "number" || !t?.description) continue;
    txns.push({
      date: /^\d{4}-\d{2}-\d{2}$/.test(t.date ?? "") ? t.date : new Date().toISOString().slice(0, 10),
      description: String(t.description).slice(0, 120),
      amount: -Math.abs(Math.round(Number(t.amount) * 100) / 100), // receipts are expenses
      balance: null,
      category: typeof t.category === "string" ? t.category.slice(0, 60) : null,
      reference: null,
    });
  }
  if (txns.length === 0) {
    return NextResponse.json({ error: "No receipt lines to export." }, { status: 400 });
  }

  const qbo = withZeroLedger(transactionsToQBO(txns, "0000000000"));
  return new NextResponse(qbo, {
    headers: {
      "Content-Type": "application/octet-stream",
      "Content-Disposition": 'attachment; filename="receipt-expenses.qbo"',
    },
  });
}
