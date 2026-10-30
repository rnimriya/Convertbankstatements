/**
 * POST /api/tools/ofx-fix — free OFX/QFX/QBO fixer analysis, no account
 * required and no Pro gate. Accepts one .ofx/.qfx/.qbo file (max 10 MB)
 * plus optional text fields intuBid and bankName. The file is repaired
 * in memory and the fixed transactions + a report of every fix are
 * returned; the .qbo download itself happens at
 * /api/tools/ofx-fix-download. Nothing is stored. Anonymous use is
 * rate-limited by checkUploadRateLimit.
 *
 * INTU.BID is never guessed: the file's own value is preserved unless
 * the user supplies one (see lib/tools/ofx-fixer.ts).
 */
import { NextRequest, NextResponse } from "next/server";
import { checkUploadRateLimit } from "@/lib/rate-limit";
import { fixOfx } from "@/lib/tools/ofx-fixer";

export const maxDuration = 30;

const MAX_SIZE = 10 * 1024 * 1024;

export async function POST(req: NextRequest) {
  const limited = await checkUploadRateLimit(req);
  if (limited) return limited;

  let formData: FormData;
  try {
    formData = await req.formData();
  } catch {
    return NextResponse.json({ error: "Please upload a .ofx, .qfx or .qbo file." }, { status: 400 });
  }

  const file = formData.get("file") as File | null;
  if (!file) {
    return NextResponse.json({ error: "No file received." }, { status: 400 });
  }
  if (file.size > MAX_SIZE) {
    return NextResponse.json({ error: "That file is over 10 MB — an OFX/QBO file should be far smaller." }, { status: 400 });
  }
  const name = file.name.toLowerCase();
  if (!/\.(ofx|qfx|qbo)$/.test(name)) {
    return NextResponse.json({ error: "Please choose a .ofx, .qfx or .qbo file." }, { status: 400 });
  }

  const text = await file.text();
  if (!text || text.length < 50) {
    return NextResponse.json({ error: "That file appears to be empty." }, { status: 400 });
  }

  const intuBidRaw = formData.get("intuBid");
  const bankNameRaw = formData.get("bankName");
  const intuBid = typeof intuBidRaw === "string" ? intuBidRaw.slice(0, 32) : undefined;
  const bankName = typeof bankNameRaw === "string" ? bankNameRaw.slice(0, 120) : undefined;

  try {
    const result = fixOfx(text, { intuBid, bankName });
    return NextResponse.json({
      success: true,
      report: result.report,
      transactions: result.transactions,
      accountId: result.accountId,
      ledgerBalance: result.ledgerBalance,
      ledgerAsOf: result.ledgerAsOf,
    });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Could not fix that file." },
      { status: 400 }
    );
  }
}
