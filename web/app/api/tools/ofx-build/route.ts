/**
 * POST /api/tools/ofx-build — shared .qbo builder for the QBO File
 * Editor and the QBO Merger. Body: { transactions: [{ date, name,
 * amount, fitid }], accountId?, ledgerBalance?, ledgerAsOf?,
 * fileName? }. Rows are strictly validated here (yyyy-mm-dd dates,
 * finite amounts, max 10,000 rows) and rebuilt as a clean OFX 1.02 Web
 * Connect file by buildFixedQbo — the same builder the OFX fixer uses,
 * so the closing balance is carried through when one is supplied.
 * Fully free, no account. Nothing is stored. Anonymous use is
 * rate-limited by checkUploadRateLimit.
 */
import { NextRequest, NextResponse } from "next/server";
import { checkUploadRateLimit } from "@/lib/rate-limit";
import { buildFixedQbo } from "@/lib/tools/ofx-fixer";
import type { Transaction } from "@/types/billing";

export const maxDuration = 30;

const MAX_ROWS = 10000;
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

function isValidDate(value: unknown): value is string {
  if (typeof value !== "string" || !DATE_RE.test(value)) return false;
  const d = new Date(`${value}T00:00:00Z`);
  return !Number.isNaN(d.getTime()) && d.toISOString().slice(0, 10) === value;
}

function safeFileName(raw: unknown): string {
  if (typeof raw !== "string") return "statement.qbo";
  const cleaned = raw.replace(/[^a-zA-Z0-9._-]+/g, "-").replace(/^-+|-+$/g, "");
  if (!cleaned) return "statement.qbo";
  return /\.qbo$/i.test(cleaned) ? cleaned : `${cleaned}.qbo`;
}

export async function POST(req: NextRequest) {
  const limited = await checkUploadRateLimit(req);
  if (limited) return limited;

  let body: {
    transactions?: unknown;
    accountId?: unknown;
    ledgerBalance?: unknown;
    ledgerAsOf?: unknown;
    fileName?: unknown;
  };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  if (!Array.isArray(body.transactions) || body.transactions.length === 0) {
    return NextResponse.json({ error: "No transactions were provided to build." }, { status: 400 });
  }
  if (body.transactions.length > MAX_ROWS) {
    return NextResponse.json(
      { error: `Too many transactions — the limit is ${MAX_ROWS.toLocaleString("en-US")} rows per file.` },
      { status: 400 }
    );
  }

  const transactions: Transaction[] = [];
  for (let i = 0; i < body.transactions.length; i++) {
    const raw = body.transactions[i];
    if (!raw || typeof raw !== "object") {
      return NextResponse.json({ error: `Row ${i + 1} is not a valid transaction.` }, { status: 400 });
    }
    const r = raw as Record<string, unknown>;
    if (!isValidDate(r.date)) {
      return NextResponse.json(
        { error: `Row ${i + 1} has an invalid date — dates must be real yyyy-mm-dd dates.` },
        { status: 400 }
      );
    }
    if (typeof r.amount !== "number" || !Number.isFinite(r.amount)) {
      return NextResponse.json({ error: `Row ${i + 1} has an invalid amount.` }, { status: 400 });
    }
    const name =
      typeof r.name === "string" && r.name.trim() ? r.name.trim().slice(0, 120) : "Transaction";
    transactions.push({
      date: r.date,
      description: name,
      amount: Math.round(r.amount * 100) / 100,
      balance: null,
      category: null,
      reference: typeof r.fitid === "string" && r.fitid ? r.fitid.slice(0, 120) : null,
    });
  }

  const accountId =
    typeof body.accountId === "string" && body.accountId.trim()
      ? body.accountId.trim().slice(0, 64)
      : undefined;
  const ledgerBalance =
    typeof body.ledgerBalance === "number" && Number.isFinite(body.ledgerBalance)
      ? Math.round(body.ledgerBalance * 100) / 100
      : null;
  const ledgerAsOf = isValidDate(body.ledgerAsOf) ? body.ledgerAsOf : null;

  try {
    const qbo = buildFixedQbo(transactions, { accountId, ledgerBalance, ledgerAsOf });
    return new NextResponse(qbo, {
      headers: {
        "Content-Type": "application/octet-stream",
        "Content-Disposition": `attachment; filename="${safeFileName(body.fileName)}"`,
        "X-Rows": String(transactions.length),
      },
    });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Could not build the QBO file." },
      { status: 400 }
    );
  }
}
