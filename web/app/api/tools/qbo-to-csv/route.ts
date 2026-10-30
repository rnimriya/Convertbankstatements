/**
 * POST /api/tools/qbo-to-csv — free QBO/OFX/QFX to CSV converter, no
 * account required and no Pro gate: the CSV (and the Excel export at
 * /api/tools/qbo-to-xlsx) are fully free. Accepts one .qbo/.ofx/.qfx
 * file (max 10 MB), parses it in memory and returns the summary, rows,
 * CSV text and any issues found in the file. Nothing is stored.
 * Anonymous use is rate-limited by checkUploadRateLimit.
 */
import { NextRequest, NextResponse } from "next/server";
import { checkUploadRateLimit } from "@/lib/rate-limit";
import { analyzeQboToCsv } from "@/lib/tools/qbo-to-csv";

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
    const result = analyzeQboToCsv(text);
    return NextResponse.json({
      success: true,
      fileName: file.name,
      summary: result.summary,
      rows: result.rows,
      csv: result.csv,
      issues: result.issues,
    });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Could not convert that file." },
      { status: 400 }
    );
  }
}
