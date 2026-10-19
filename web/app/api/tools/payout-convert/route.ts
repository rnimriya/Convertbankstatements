/**
 * POST /api/tools/payout-convert — free Stripe/PayPal payout analysis (free account required).
 * Accepts one CSV export (max 10 MB), auto-detects the export format, groups
 * transactions into payouts using the clearing-account model, and returns per-
 * payout summaries with a tie-out check plus a QBO-Online-ready CSV. Nothing
 * is stored. The .qbo download is Pro-gated at /api/tools/payout-download.
 */
import { NextRequest, NextResponse } from "next/server";
import { checkUploadRateLimit } from "@/lib/rate-limit";
import {
  requireToolUser,
  SIGNUP_REQUIRED_ERROR,
  SIGNUP_REQUIRED_CODE,
} from "@/lib/tools/download-gate";
import { parsePayoutCsv, type Provider } from "@/lib/tools/payout";

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
    return NextResponse.json({ error: "Please upload a CSV file." }, { status: 400 });
  }

  const file = formData.get("file") as File | null;
  const provider = (formData.get("provider") as string) === "paypal" ? "paypal" : "stripe";
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
  if (!text || text.length < 50) {
    return NextResponse.json({ error: "That file appears to be empty." }, { status: 400 });
  }

  try {
    const result = parsePayoutCsv(text, provider as Provider);
    return NextResponse.json({ success: true, fileName: file.name, ...result });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Could not read that CSV." },
      { status: 400 }
    );
  }
}
