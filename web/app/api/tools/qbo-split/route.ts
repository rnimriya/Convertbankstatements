/**
 * POST /api/tools/qbo-split — free QBO splitter analysis, no account
 * required and no Pro gate.
 * Accepts one .qbo/.ofx/.qfx file (max 10 MB), parses it in memory and
 * returns its period, transaction count, ledger balance, and transactions
 * with rebuilt running balances. Nothing is stored. Anonymous use is
 * rate-limited by checkUploadRateLimit. The trimmed download is free at
 * /api/tools/qbo-split-download.
 */
import { NextRequest, NextResponse } from "next/server";
import { checkUploadRateLimit } from "@/lib/rate-limit";
import { analyzeForSplit } from "@/lib/tools/qbo-splitter";

export const maxDuration = 30;

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

  const file = formData.get("file") as File | null;
  if (!file) {
    return NextResponse.json({ error: "No file received." }, { status: 400 });
  }
  if (file.size > MAX_SIZE) {
    return NextResponse.json({ error: "That file is over 10 MB — a QBO/OFX file should be far smaller." }, { status: 400 });
  }
  const name = file.name.toLowerCase();
  if (!/\.(qbo|ofx|qfx)$/.test(name)) {
    return NextResponse.json({ error: "Please choose a .qbo, .ofx or .qfx file." }, { status: 400 });
  }

  const text = await file.text();
  if (!text || text.length < 50) {
    return NextResponse.json({ error: "That file appears to be empty." }, { status: 400 });
  }

  try {
    const result = analyzeForSplit(text);
    return NextResponse.json({ success: true, fileName: file.name, ...result });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Could not read that QBO file." },
      { status: 400 }
    );
  }
}
