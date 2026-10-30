/**
 * POST /api/tools/qbo-split-download — trimmed .qbo for a chosen date
 * range. Fully free: no account and no Pro gate.
 * Body: { transactions, start, end }. Rows are re-validated here
 * (yyyy-mm-dd dates, finite amounts, capped at 5000) and start/end must
 * be valid dates with start <= end, so the download cannot be abused to
 * mint arbitrary QBO bodies. Rate-limited by checkUploadRateLimit.
 */
import { NextRequest, NextResponse } from "next/server";
import { checkUploadRateLimit } from "@/lib/rate-limit";
import { splitQbo, type SplitTransaction } from "@/lib/tools/qbo-splitter";

export const maxDuration = 30;

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

function isValidDate(value: unknown): value is string {
  if (typeof value !== "string" || !DATE_RE.test(value)) return false;
  const d = new Date(`${value}T00:00:00Z`);
  return !Number.isNaN(d.getTime()) && d.toISOString().slice(0, 10) === value;
}

export async function POST(req: NextRequest) {
  const limited = await checkUploadRateLimit(req);
  if (limited) return limited;

  let body: { transactions?: unknown; start?: unknown; end?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  if (!isValidDate(body.start) || !isValidDate(body.end)) {
    return NextResponse.json({ error: "Please choose a valid start and end date." }, { status: 400 });
  }
  const start = body.start;
  const end = body.end;
  if (start > end) {
    return NextResponse.json({ error: "The start date must be on or before the end date." }, { status: 400 });
  }

  const rows = Array.isArray(body.transactions) ? body.transactions.slice(0, 5000) : [];
  const clean: SplitTransaction[] = [];
  for (const raw of rows) {
    if (!raw || typeof raw !== "object") continue;
    const r = raw as Record<string, unknown>;
    if (!isValidDate(r.date)) continue;
    if (typeof r.amount !== "number" || !Number.isFinite(r.amount)) continue;
    const description =
      typeof r.description === "string" && r.description.trim()
        ? r.description.slice(0, 120)
        : typeof r.name === "string" && r.name.trim()
          ? r.name.slice(0, 120)
          : "Transaction";
    clean.push({
      date: r.date,
      description,
      amount: Math.round(r.amount * 100) / 100,
      balance:
        typeof r.balance === "number" && Number.isFinite(r.balance)
          ? Math.round(r.balance * 100) / 100
          : null,
      category: typeof r.category === "string" ? r.category.slice(0, 120) : null,
      reference: typeof r.reference === "string" ? r.reference.slice(0, 120) : null,
    });
  }
  if (clean.length === 0) {
    return NextResponse.json({ error: "No valid transactions to export." }, { status: 400 });
  }

  try {
    const { qbo } = splitQbo(clean, start, end);
    return new NextResponse(qbo, {
      headers: {
        "Content-Type": "application/octet-stream",
        "Content-Disposition": 'attachment; filename="statement-split.qbo"',
      },
    });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Could not build the trimmed QBO file." },
      { status: 400 }
    );
  }
}
