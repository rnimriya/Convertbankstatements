/**
 * POST /api/tools/bulk-delete — free bulk transaction remover for
 * QBO/OFX/QFX files, in two steps:
 *
 *   step=analyze — accepts one .qbo/.ofx/.qfx file (max 10 MB) and
 *   returns its transactions (with row indexes) and summary as JSON,
 *   so the browser can show a checkbox list.
 *
 *   step=build — accepts the same file plus `remove`, a JSON array of
 *   row indexes to remove. The kept transactions are rebuilt as a
 *   clean OFX 1.02 .qbo (header normalized, FITIDs preserved or
 *   regenerated, the file's own INTU.BID and closing balance carried
 *   through) and returned as a download with an X-Removed header.
 *
 * This tool edits the FILE only — it never connects to QuickBooks and
 * cannot remove transactions that are already inside QuickBooks.
 * Files are processed in memory and nothing is stored. Anonymous use
 * is rate-limited by checkUploadRateLimit.
 */
import { NextRequest, NextResponse } from "next/server";
import { checkUploadRateLimit } from "@/lib/rate-limit";
import { analyzeQboToCsv } from "@/lib/tools/qbo-to-csv";
import { buildFixedQbo, fixOfx } from "@/lib/tools/ofx-fixer";

export const maxDuration = 60;

const MAX_SIZE = 10 * 1024 * 1024;

export async function POST(req: NextRequest) {
  const limited = await checkUploadRateLimit(req);
  if (limited) return limited;

  let formData: FormData;
  try {
    formData = await req.formData();
  } catch {
    return NextResponse.json({ error: "Please upload a .qbo, .ofx or .qfx file." }, { status: 400 });
  }

  const step = (formData.get("step") as string | null) ?? "analyze";
  if (step !== "analyze" && step !== "build") {
    return NextResponse.json({ error: "Unknown step." }, { status: 400 });
  }

  const file = formData.get("file") as File | null;
  if (!file) {
    return NextResponse.json({ error: "No file received." }, { status: 400 });
  }
  if (file.size > MAX_SIZE) {
    return NextResponse.json({ error: "That file is over 10 MB — a QBO/OFX file should be far smaller." }, { status: 400 });
  }
  if (!/\.(qbo|ofx|qfx)$/i.test(file.name)) {
    return NextResponse.json({ error: "Please choose a .qbo, .ofx or .qfx file." }, { status: 400 });
  }

  const text = await file.text();
  if (!text || text.length < 50) {
    return NextResponse.json({ error: "That file appears to be empty." }, { status: 400 });
  }

  // Both steps parse first — analyzeQboToCsv throws clear, user-facing
  // errors for non-OFX or transaction-free files.
  let parsed;
  try {
    parsed = analyzeQboToCsv(text);
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Could not read that file." },
      { status: 400 }
    );
  }

  if (step === "analyze") {
    return NextResponse.json({
      success: true,
      fileName: file.name,
      summary: parsed.summary,
      transactions: parsed.rows.map((r, index) => ({ index, ...r })),
      issues: parsed.issues,
    });
  }

  // ── step=build ──────────────────────────────────────────────────────────
  let removeRaw: unknown;
  try {
    removeRaw = JSON.parse((formData.get("remove") as string | null) ?? "[]");
  } catch {
    return NextResponse.json({ error: "Invalid removal list." }, { status: 400 });
  }
  if (!Array.isArray(removeRaw)) {
    return NextResponse.json({ error: "Invalid removal list." }, { status: 400 });
  }
  const total = parsed.rows.length;
  const removeSet = new Set<number>();
  for (const v of removeRaw) {
    if (typeof v === "number" && Number.isInteger(v) && v >= 0 && v < total) {
      removeSet.add(v);
    }
  }
  if (removeSet.size === 0) {
    return NextResponse.json(
      { error: "No transactions were selected for removal." },
      { status: 400 }
    );
  }
  if (removeSet.size >= total) {
    return NextResponse.json(
      {
        error:
          "That selection removes every transaction in the file — there would be nothing left to import. Keep at least one transaction.",
      },
      { status: 400 }
    );
  }

  // fixOfx maps the same parsed transactions to Transaction[] (same
  // order as the rows above) with FITIDs preserved or regenerated and
  // the file's own bank identity + closing balance carried through.
  const fixed = fixOfx(text);
  const kept = fixed.transactions.filter((_, i) => !removeSet.has(i));
  const qbo = buildFixedQbo(kept, {
    intuBid: fixed.report.intuBid,
    bankName: fixed.report.bankName,
    accountId: fixed.accountId,
    ledgerBalance: fixed.ledgerBalance,
    ledgerAsOf: fixed.ledgerAsOf,
  });

  const base = file.name.replace(/\.(qbo|ofx|qfx)$/i, "").replace(/[^\w.-]+/g, "-") || "statement";
  return new NextResponse(qbo, {
    headers: {
      "Content-Type": "application/octet-stream",
      "Content-Disposition": `attachment; filename="${base}-cleaned.qbo"`,
      "X-Removed": String(removeSet.size),
    },
  });
}
