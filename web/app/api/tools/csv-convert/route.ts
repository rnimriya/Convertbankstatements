/**
 * POST /api/tools/csv-convert — free generic CSV analysis, no account required.
 * Accepts one CSV (max 10 MB) plus a JSON column mapping (date/payee/amount
 * or debit/credit pair, optional memo/balance). Returns the parsed rows, a
 * free CSV export, and a balance-chain check when the file carries balances.
 * Nothing is stored. Anonymous use is rate-limited by checkUploadRateLimit.
 * The .qbo download is Pro-gated at /api/tools/csv-download.
 */
import { NextRequest, NextResponse } from "next/server";
import { checkUploadRateLimit } from "@/lib/rate-limit";
import { parseGenericCsv, autoDetectMapping, splitCsvLine, type CsvMapping } from "@/lib/tools/csv-to-qbo";

export const maxDuration = 30;

const MAX_SIZE = 10 * 1024 * 1024;

function asMapping(raw: unknown, headers: string[]): CsvMapping | null {
  if (raw && typeof raw === "object") {
    const m = raw as Record<string, unknown>;
    const num = (v: unknown) => (typeof v === "number" && Number.isInteger(v) ? v : -1);
    return {
      date: num(m.date),
      payee: num(m.payee),
      amount: num(m.amount),
      debit: num(m.debit),
      credit: num(m.credit),
      memo: num(m.memo),
      balance: num(m.balance),
    };
  }
  return autoDetectMapping(headers);
}

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
  if (!text || text.length < 50) {
    return NextResponse.json({ error: "That file appears to be empty." }, { status: 400 });
  }

  try {
    const firstLine = text.split(/\r?\n/)[0] ?? "";
    const headers = splitCsvLine(firstLine).map((h) => h.trim());
    let mapping: CsvMapping | null = null;
    const mappingRaw = formData.get("mapping") as string | null;
    if (mappingRaw) {
      try {
        mapping = asMapping(JSON.parse(mappingRaw), headers);
      } catch {
        mapping = null;
      }
    }
    if (!mapping) mapping = autoDetectMapping(headers.map((h) => h.toLowerCase()));
    const result = parseGenericCsv(text, mapping);
    return NextResponse.json({ success: true, fileName: file.name, headers, mapping, ...result });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Could not read that CSV." },
      { status: 400 }
    );
  }
}
