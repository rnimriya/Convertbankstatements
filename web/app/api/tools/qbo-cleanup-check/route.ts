/**
 * POST /api/tools/qbo-cleanup-check — free duplicate/cleanup report, no account required.
 * Accepts one .qbo/.ofx/.qfx/.csv file (max 10 MB), analyzes it in memory and
 * returns duplicate groups, a health score and issue list. Nothing is stored.
 * Anonymous use is rate-limited by checkUploadRateLimit. The cleaned-QBO
 * download stays Pro-gated at /api/tools/qbo-cleanup-download.
 */
import { NextRequest, NextResponse } from "next/server";
import { checkUploadRateLimit } from "@/lib/rate-limit";
import { analyzeCleanup } from "@/lib/tools/cleanup-analysis";

export const maxDuration = 30;

const MAX_SIZE = 10 * 1024 * 1024;

export async function POST(req: NextRequest) {
  const limited = await checkUploadRateLimit(req);
  if (limited) return limited;

  let formData: FormData;
  try {
    formData = await req.formData();
  } catch {
    return NextResponse.json({ error: "Please upload a .qbo, .ofx, .qfx or .csv file." }, { status: 400 });
  }

  const file = formData.get("file") as File | null;
  if (!file) {
    return NextResponse.json({ error: "No file received." }, { status: 400 });
  }
  if (file.size > MAX_SIZE) {
    return NextResponse.json({ error: "That file is over 10 MB — please try a smaller one." }, { status: 400 });
  }
  const name = file.name.toLowerCase();
  if (!/\.(qbo|ofx|qfx|csv)$/.test(name)) {
    return NextResponse.json({ error: "Please choose a .qbo, .ofx, .qfx or .csv file." }, { status: 400 });
  }

  const text = await file.text();
  if (!text || text.length < 50) {
    return NextResponse.json({ error: "That file appears to be empty." }, { status: 400 });
  }

  const analysis = analyzeCleanup(text, file.name);
  return NextResponse.json({ success: true, fileName: file.name, analysis });
}
