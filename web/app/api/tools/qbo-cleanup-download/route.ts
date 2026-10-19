/**
 * POST /api/tools/qbo-cleanup-download — cleaned QBO (Pro-gated).
 * Re-analyzes the uploaded file server-side (stateless), drops exact
 * duplicates, regenerates missing/invalid FITIDs, and returns a
 * reconciliation-ready .qbo. CSV/report stay free; this download needs
 * a Pro or Business subscription — the same rule as statement exports.
 */
import { NextRequest, NextResponse } from "next/server";
import { checkUploadRateLimit } from "@/lib/rate-limit";
import { analyzeCleanup, buildCleanedQbo } from "@/lib/tools/cleanup-analysis";
import {
  qboDownloadGate,
  QBO_LOCKED_MESSAGE,
  requireToolUser,
  SIGNUP_REQUIRED_ERROR,
  SIGNUP_REQUIRED_CODE,
} from "@/lib/tools/download-gate";

export const maxDuration = 30;

const MAX_SIZE = 10 * 1024 * 1024;

export async function POST(req: NextRequest) {
  const limited = await checkUploadRateLimit(req);
  if (limited) return limited;

  const toolUser = await requireToolUser();
  if (!toolUser) {
    return NextResponse.json(
      { error: SIGNUP_REQUIRED_ERROR, code: SIGNUP_REQUIRED_CODE },
      { status: 401 }
    );
  }

  const gate = await qboDownloadGate();
  if (!gate.ok) {
    return NextResponse.json(
      { error: QBO_LOCKED_MESSAGE, gate: gate.reason },
      { status: gate.reason === "login" ? 401 : 403 }
    );
  }

  let formData: FormData;
  try {
    formData = await req.formData();
  } catch {
    return NextResponse.json({ error: "Please upload a .qbo, .ofx, .qfx or .csv file." }, { status: 400 });
  }

  const file = formData.get("file") as File | null;
  if (!file || file.size > MAX_SIZE) {
    return NextResponse.json({ error: "Invalid file." }, { status: 400 });
  }

  const text = await file.text();
  const analysis = analyzeCleanup(text, file.name);
  if (analysis.transactionCount === 0) {
    return NextResponse.json({ error: "No transactions found in that file." }, { status: 400 });
  }

  const { qbo, removed } = buildCleanedQbo(analysis);

  const outName = file.name.replace(/\.[^.]+$/, "") + "-cleaned.qbo";
  return new NextResponse(qbo, {
    headers: {
      "Content-Type": "application/octet-stream",
      "Content-Disposition": `attachment; filename="${outName}"`,
      "X-Removed-Duplicates": String(removed),
    },
  });
}
