/**
 * POST /api/tools/receipt-extract — free receipt extraction (no login).
 * Accepts one receipt image (.jpg/.png/.webp, max 10 MB) or PDF. Images go
 * through the same vision chain as scanned statements (Gemini free tier
 * first, Claude as backup) — no new providers or keys. Nothing is stored.
 */
import { NextRequest, NextResponse } from "next/server";
import { checkUploadRateLimit } from "@/lib/rate-limit";
import { extractTransactions, extractReceiptFromImage } from "@/lib/extraction/extract";

export const maxDuration = 120;

const MAX_SIZE = 10 * 1024 * 1024;

const IMAGE_MIMES = ["image/jpeg", "image/png", "image/webp"];

export async function POST(req: NextRequest) {
  const limited = await checkUploadRateLimit(req);
  if (limited) return limited;

  let formData: FormData;
  try {
    formData = await req.formData();
  } catch {
    return NextResponse.json({ error: "Please upload a receipt image or PDF." }, { status: 400 });
  }

  const file = formData.get("file") as File | null;
  if (!file) {
    return NextResponse.json({ error: "No file received." }, { status: 400 });
  }
  if (file.size > MAX_SIZE) {
    return NextResponse.json({ error: "That file is over 10 MB — please try a smaller one." }, { status: 400 });
  }

  const ext = file.name.toLowerCase().split(".").pop() ?? "";
  const isPdf = ext === "pdf" || file.type === "application/pdf";
  const isImage = IMAGE_MIMES.includes(file.type) || ["jpg", "jpeg", "png", "webp"].includes(ext);
  if (!isPdf && !isImage) {
    return NextResponse.json(
      { error: "Please choose a receipt photo (.jpg, .png, .webp) or PDF." },
      { status: 400 }
    );
  }

  const bytes = Buffer.from(await file.arrayBuffer());
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? undefined;

  const result = isPdf
    ? await extractTransactions(bytes, file.name, ip)
    : await extractReceiptFromImage(bytes, file.type || "image/jpeg", ip);

  if (result.method === "none" || result.transactions.length === 0) {
    const message =
      result.reason === "no_vision_key"
        ? "Receipt reading is temporarily unavailable — please try again later."
        : "We couldn't read any line items from that receipt. A clear, straight-on photo of the full receipt works best.";
    return NextResponse.json({ success: false, reason: result.reason, error: message }, { status: 422 });
  }

  const vendor = result.bankName;
  const debits = result.transactions.filter((t) => t.amount < 0);
  const total = Math.abs(
    Math.round(debits.reduce((s, t) => s + t.amount, 0) * 100) / 100
  );
  const dates = result.transactions.map((t) => t.date).filter(Boolean).sort();

  return NextResponse.json({
    success: true,
    fileName: file.name,
    vendor,
    date: dates[0] ?? "",
    total,
    method: result.method,
    transactions: result.transactions,
  });
}
