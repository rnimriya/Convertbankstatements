/**
 * POST /api/tools/reconciliation — free statement-vs-QuickBooks comparison,
 * no account required. Accepts two files (statement + QuickBooks export, each
 * .csv/.qbo/.ofx/.qfx, max 10 MB), analyzes them in memory, and returns the
 * matched / missing / extra / amount-mismatch / date-drift findings plus a
 * free CSV report payload. Nothing is stored. Anonymous use is rate-limited
 * by checkUploadRateLimit. The matched-entries QBO download is Pro-gated at
 * /api/tools/reconciliation-download.
 */
import { NextRequest, NextResponse } from "next/server";
import { checkUploadRateLimit } from "@/lib/rate-limit";
import { compareStatementToQbo, reconToCsv } from "@/lib/tools/reconciliation";

export const maxDuration = 30;

const MAX_SIZE = 10 * 1024 * 1024;
const EXT = /\.(qbo|ofx|qfx|csv)$/i;

export async function POST(req: NextRequest) {
  const limited = await checkUploadRateLimit(req);
  if (limited) return limited;

  let formData: FormData;
  try {
    formData = await req.formData();
  } catch {
    return NextResponse.json({ error: "Please upload both files." }, { status: 400 });
  }

  const statement = formData.get("statement") as File | null;
  const quickbooks = formData.get("quickbooks") as File | null;
  if (!statement || !quickbooks) {
    return NextResponse.json({ error: "Please upload both a bank-statement file and a QuickBooks export." }, { status: 400 });
  }
  if (statement.size > MAX_SIZE || quickbooks.size > MAX_SIZE) {
    return NextResponse.json({ error: "One of the files is over 10 MB — please try smaller exports." }, { status: 400 });
  }
  if (!EXT.test(statement.name) || !EXT.test(quickbooks.name)) {
    return NextResponse.json({ error: "Both files must be .csv, .qbo, .ofx, or .qfx." }, { status: 400 });
  }

  try {
    const result = compareStatementToQbo(
      await statement.text(),
      statement.name,
      await quickbooks.text(),
      quickbooks.name
    );
    return NextResponse.json({ success: true, ...result, csv: reconToCsv(result) });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Could not compare those files." },
      { status: 400 }
    );
  }
}
