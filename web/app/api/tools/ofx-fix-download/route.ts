/**
 * POST /api/tools/ofx-fix-download — the fixed .qbo built from the
 * /api/tools/ofx-fix result. Fully free: no account required and no
 * Pro gate. Body: { transactions, intuBid, bankName, accountId }.
 * Rows are re-validated here (date format, finite amounts, capped
 * strings, max 5000 rows) so the download cannot be abused to mint
 * arbitrary QBO bodies. Anonymous use is rate-limited by
 * checkUploadRateLimit. Nothing is stored.
 */
import { NextRequest, NextResponse } from "next/server";
import { checkUploadRateLimit } from "@/lib/rate-limit";
import { buildFixedQbo } from "@/lib/tools/ofx-fixer";
import type { Transaction } from "@/types/billing";

export const maxDuration = 30;

interface DownloadBody {
  transactions?: Transaction[];
  intuBid?: string | null;
  bankName?: string | null;
  accountId?: string;
  ledgerBalance?: number | null;
  ledgerAsOf?: string | null;
}

export async function POST(req: NextRequest) {
  const limited = await checkUploadRateLimit(req);
  if (limited) return limited;

  let body: DownloadBody;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const rows = Array.isArray(body.transactions) ? body.transactions.slice(0, 5000) : [];
  const clean: Transaction[] = [];
  for (const r of rows) {
    if (!r || typeof r.amount !== "number" || !Number.isFinite(r.amount)) continue;
    if (!/^\d{4}-\d{2}-\d{2}$/.test(r.date ?? "")) continue;
    clean.push({
      date: r.date,
      description: typeof r.description === "string" ? r.description.slice(0, 200) : "Transaction",
      amount: Math.round(Number(r.amount) * 100) / 100,
      balance: typeof r.balance === "number" && Number.isFinite(r.balance) ? r.balance : null,
      category: typeof r.category === "string" ? r.category.slice(0, 120) : null,
      reference: typeof r.reference === "string" ? r.reference.slice(0, 64) : null,
    });
  }
  if (clean.length === 0) {
    return NextResponse.json({ error: "No valid transactions to export." }, { status: 400 });
  }

  const intuBid =
    typeof body.intuBid === "string" ? body.intuBid.replace(/\D/g, "").slice(0, 32) || null : null;
  const bankName = typeof body.bankName === "string" ? body.bankName.slice(0, 120) : null;
  const accountId =
    typeof body.accountId === "string" && /^[\w-]{1,64}$/.test(body.accountId)
      ? body.accountId
      : "0000000000";
  const ledgerBalance =
    typeof body.ledgerBalance === "number" && Number.isFinite(body.ledgerBalance)
      ? Math.round(body.ledgerBalance * 100) / 100
      : null;
  const ledgerAsOf =
    typeof body.ledgerAsOf === "string" && /^\d{4}-\d{2}-\d{2}$/.test(body.ledgerAsOf)
      ? body.ledgerAsOf
      : null;

  const qbo = buildFixedQbo(clean, { intuBid, bankName, accountId, ledgerBalance, ledgerAsOf });
  return new NextResponse(qbo, {
    headers: {
      "Content-Type": "application/octet-stream",
      "Content-Disposition": 'attachment; filename="fixed.qbo"',
    },
  });
}
