/**
 * POST /api/tools/preimport-check — free pre-import check of a generated QBO,
 * no account required. Body: { qbo: string } — the exact QBO text the user
 * is about to download/import (the converter result screen decodes its own
 * data-URL download and posts it here). Runs the existing cleanup analysis
 * (duplicates, health score, structural issues) in memory. Nothing is
 * stored. Anonymous use is rate-limited by checkUploadRateLimit.
 */
import { NextRequest, NextResponse } from "next/server";
import { checkUploadRateLimit } from "@/lib/rate-limit";
import { analyzeCleanup } from "@/lib/tools/cleanup-analysis";

export const maxDuration = 30;

const MAX_CHARS = 5 * 1024 * 1024;

export async function POST(req: NextRequest) {
  const limited = await checkUploadRateLimit(req);
  if (limited) return limited;

  let body: { qbo?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const qbo = typeof body.qbo === "string" ? body.qbo : "";
  if (!qbo || qbo.length < 50) {
    return NextResponse.json({ error: "No QBO content received." }, { status: 400 });
  }
  if (qbo.length > MAX_CHARS) {
    return NextResponse.json({ error: "That QBO file is too large to check here." }, { status: 400 });
  }

  const analysis = analyzeCleanup(qbo, "generated.qbo");
  return NextResponse.json({ success: true, analysis });
}
