/**
 * POST /api/tools/invoice-check — free invoice CSV validator + formatter,
 * no account required. Accepts one invoice CSV (max 10 MB), checks every
 * row against what QuickBooks Online invoice import needs, applies the
 * safe fixes, and returns the row-by-row result plus a cleaned CSV with
 * only the error-free rows. Nothing is stored. Anonymous use is
 * rate-limited by checkUploadRateLimit.
 */
import { NextRequest, NextResponse } from "next/server";
import { checkUploadRateLimit } from "@/lib/rate-limit";
import { checkInvoiceCsv } from "@/lib/tools/invoice-checker";

export const maxDuration = 30;

const MAX_SIZE = 10 * 1024 * 1024;

export async function POST(req: NextRequest) {
  const limited = await checkUploadRateLimit(req);
  if (limited) return limited;

  let formData: FormData;
  try {
    formData = await req.formData();
  } catch {
    return NextResponse.json({ error: "Please upload a CSV file." }, { status: 400 });
  }

  const file = formData.get("file") as File | null;
  if (!file) {
    return NextResponse.json({ error: "No file received." }, { status: 400 });
  }
  if (file.size > MAX_SIZE) {
    return NextResponse.json({ error: "That file is over 10 MB — please try a smaller one." }, { status: 400 });
  }
  if (!/\.csv$/i.test(file.name)) {
    return NextResponse.json({ error: "Please choose a .csv file." }, { status: 400 });
  }

  const text = await file.text();
  if (!text || !text.trim()) {
    return NextResponse.json({ error: "That file appears to be empty." }, { status: 400 });
  }

  try {
    const result = checkInvoiceCsv(text);
    return NextResponse.json({ success: true, fileName: file.name, ...result });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Could not read that CSV." },
      { status: 400 }
    );
  }
}
