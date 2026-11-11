/**
 * AutoPay Khoj — audit API (Day 6, 2026-11-11).
 *
 * POST a statement PDF (multipart, field "file") → the SAME extractor
 * the converter uses → detection engine → waste engine → report view
 * model as JSON. The audit is a free product feature: no billing, no
 * page quota, no storage — the PDF lives only in this request's
 * memory. The shared upload rate limit still applies.
 */
import { NextRequest, NextResponse } from "next/server";
import { countPdfPages } from "@/lib/pdf-utils";
import { extractTransactions } from "@/lib/extraction/extract";
import { checkUploadRateLimit } from "@/lib/rate-limit";
import { buildReportVM } from "@/lib/autopay/report-vm";

export const maxDuration = 60;

const MAX_PAGES = 300;

function clientIp(req: NextRequest): string {
  return (req.headers.get("x-forwarded-for") ?? "127.0.0.1").split(",")[0].trim();
}

export async function POST(req: NextRequest) {
  const limited = await checkUploadRateLimit(req);
  if (limited) return limited;

  let formData: FormData;
  try {
    formData = await req.formData();
  } catch {
    return NextResponse.json(
      { error: "Invalid upload request. Please attach a PDF file and try again." },
      { status: 400 },
    );
  }

  const file = formData.get("file") as File | null;
  if (!file) return NextResponse.json({ error: "No file uploaded." }, { status: 400 });
  if (!file.name.toLowerCase().endsWith(".pdf") && file.type !== "application/pdf") {
    return NextResponse.json({ error: "Only PDF files are accepted." }, { status: 415 });
  }
  if (file.size > 50 * 1024 * 1024) {
    return NextResponse.json({ error: "File exceeds 50 MB limit." }, { status: 413 });
  }

  const bytes = Buffer.from(await file.arrayBuffer());
  if (!bytes.subarray(0, 5).toString("latin1").startsWith("%PDF-")) {
    return NextResponse.json(
      { error: "File does not appear to be a valid PDF." },
      { status: 415 },
    );
  }

  const pageCount = countPdfPages(bytes);
  if (pageCount === 0) {
    return NextResponse.json(
      { error: "Invalid PDF: no pages detected. The file may be corrupted or empty." },
      { status: 400 },
    );
  }
  if (pageCount > MAX_PAGES) {
    return NextResponse.json(
      { error: `This PDF has ${pageCount} pages. The maximum is ${MAX_PAGES}. Please split it and try again.` },
      { status: 413 },
    );
  }

  let extraction;
  try {
    extraction = await extractTransactions(bytes, file.name, clientIp(req));
  } catch (err) {
    console.error("[autopay-audit] extraction failed:", err);
    return NextResponse.json(
      { error: "We could not read that PDF. If it is password-protected, please upload an unprotected copy." },
      { status: 422 },
    );
  }

  if (!extraction.transactions || extraction.transactions.length === 0) {
    return NextResponse.json(
      {
        error:
          "We read the document but found no transactions. Please confirm it is a bank statement (not a cover or summary page) and not password-protected.",
      },
      { status: 422 },
    );
  }

  const vm = buildReportVM(extraction.transactions);
  return NextResponse.json({
    success: true,
    fileName: file.name,
    bankName: extraction.bankName ?? null,
    pageCount,
    transactionCount: extraction.transactions.length,
    vm,
  });
}
