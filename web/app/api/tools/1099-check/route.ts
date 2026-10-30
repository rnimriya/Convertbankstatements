/**
 * POST /api/tools/1099-check — free 1099 vendor payment checker, no
 * account required. Accepts one bank CSV or one QBO/OFX/QFX file
 * (max 10 MB), groups the money-out payments by vendor, and returns the
 * vendor totals. Nothing is stored. Anonymous use is rate-limited by
 * checkUploadRateLimit. Informational only — not tax filing or advice.
 */
import { NextRequest, NextResponse } from "next/server";
import { checkUploadRateLimit } from "@/lib/rate-limit";
import { groupVendorPayments, txnsFromCsv, txnsFromQbo, type VendorTxn } from "@/lib/tools/vendor-1099";

export const maxDuration = 30;

const MAX_SIZE = 10 * 1024 * 1024;

export async function POST(req: NextRequest) {
  const limited = await checkUploadRateLimit(req);
  if (limited) return limited;

  let formData: FormData;
  try {
    formData = await req.formData();
  } catch {
    return NextResponse.json({ error: "Please upload a .csv, .qbo, .ofx or .qfx file." }, { status: 400 });
  }

  const file = formData.get("file") as File | null;
  if (!file) {
    return NextResponse.json({ error: "No file received." }, { status: 400 });
  }
  if (file.size > MAX_SIZE) {
    return NextResponse.json({ error: "That file is over 10 MB — please try a smaller one." }, { status: 400 });
  }

  const name = file.name.toLowerCase();
  const isCsv = /\.csv$/.test(name);
  const isQbo = /\.(qbo|ofx|qfx)$/.test(name);
  if (!isCsv && !isQbo) {
    return NextResponse.json({ error: "Please choose a .csv, .qbo, .ofx or .qfx file." }, { status: 400 });
  }

  const text = await file.text();
  if (!text || !text.trim()) {
    return NextResponse.json({ error: "That file appears to be empty." }, { status: 400 });
  }

  try {
    const txns: VendorTxn[] = isCsv ? txnsFromCsv(text) : txnsFromQbo(text);
    const vendors = groupVendorPayments(txns);
    const totalPaid = Math.round(vendors.reduce((s, v) => s + v.total, 0) * 100) / 100;
    return NextResponse.json({
      success: true,
      fileName: file.name,
      sourceKind: isCsv ? "csv" : "qbo",
      vendors,
      vendorCount: vendors.length,
      totalPaid,
    });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Could not read that file." },
      { status: 400 }
    );
  }
}
