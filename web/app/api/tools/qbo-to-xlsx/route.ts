/**
 * POST /api/tools/qbo-to-xlsx — free Excel export of QBO-to-CSV rows,
 * no account required and no Pro gate. Body: { rows } from the
 * /api/tools/qbo-to-csv response. Rows are re-validated here (date
 * format, finite amounts, capped strings, max 5000 rows) so the
 * download cannot be abused to mint arbitrary spreadsheets.
 * Anonymous use is rate-limited by checkUploadRateLimit.
 */
import { NextRequest, NextResponse } from "next/server";
import { checkUploadRateLimit } from "@/lib/rate-limit";
import { qboRowsToXlsx, type QboCsvRow } from "@/lib/tools/qbo-to-csv";

export const maxDuration = 30;

export async function POST(req: NextRequest) {
  const limited = await checkUploadRateLimit(req);
  if (limited) return limited;

  let body: { rows?: QboCsvRow[] };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const rows = Array.isArray(body.rows) ? body.rows.slice(0, 5000) : [];
  const clean: QboCsvRow[] = [];
  for (const r of rows) {
    if (!r || typeof r.amount !== "number" || !Number.isFinite(r.amount)) continue;
    if (!/^\d{4}-\d{2}-\d{2}$/.test(r.date ?? "")) continue;
    clean.push({
      date: r.date,
      type: typeof r.type === "string" ? r.type.slice(0, 32) : "",
      name: typeof r.name === "string" ? r.name.slice(0, 200) : "",
      amount: Math.round(Number(r.amount) * 100) / 100,
      fitid: typeof r.fitid === "string" ? r.fitid.slice(0, 64) : null,
    });
  }
  if (clean.length === 0) {
    return NextResponse.json({ error: "No valid rows to export." }, { status: 400 });
  }

  const buf = qboRowsToXlsx(clean);
  return new NextResponse(new Uint8Array(buf), {
    headers: {
      "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": 'attachment; filename="transactions.xlsx"',
    },
  });
}
