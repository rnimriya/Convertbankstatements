/**
 * POST /api/tools/qbo-check — free QBO/OFX file validator (free account required).
 * Accepts one .qbo/.ofx/.qfx file (max 10 MB), parses it in memory and
 * returns a structural + balance analysis. Nothing is stored.
 */
import { NextRequest, NextResponse } from "next/server";
import { checkUploadRateLimit } from "@/lib/rate-limit";
import {
  requireToolUser,
  SIGNUP_REQUIRED_ERROR,
  SIGNUP_REQUIRED_CODE,
} from "@/lib/tools/download-gate";
import { analyzeOfx } from "@/lib/ofx-check";

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

  const analysis = analyzeOfx(text);
  return NextResponse.json({ success: true, fileName: file.name, analysis });
}
