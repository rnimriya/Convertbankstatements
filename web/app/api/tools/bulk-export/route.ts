/**
 * POST /api/tools/bulk-export — free bulk QBO/OFX/QFX exporter, no
 * account required and no Pro gate. Accepts 1–10 .qbo/.ofx/.qfx files
 * (max 10 MB each) plus a `format` field ("csv" | "xlsx") and returns
 * ONE merged download containing every transaction from every file,
 * with an extra "Source File" column naming the file each row came
 * from. Response headers carry X-Files (file count) and X-Counts
 * (JSON array of { name, rows } per file, URI-encoded). Files are
 * parsed in memory and nothing is stored. Anonymous use is
 * rate-limited by checkUploadRateLimit.
 */
import { NextRequest, NextResponse } from "next/server";
import * as XLSX from "xlsx";
import { checkUploadRateLimit } from "@/lib/rate-limit";
import { analyzeQboToCsv, type QboCsvRow } from "@/lib/tools/qbo-to-csv";

export const maxDuration = 60;

const MAX_SIZE = 10 * 1024 * 1024;
const MAX_FILES = 10;

interface MergedRow extends QboCsvRow {
  source: string;
}

/**
 * Neutralise CSV/spreadsheet formula injection — same guard as
 * qboRowsToCsv in lib/tools/qbo-to-csv.ts. A cell beginning with
 * =, +, -, @, or a control char is treated as a formula by Excel /
 * LibreOffice / Sheets, and transaction names come from uploaded files.
 */
function csvSafe(value: string): string {
  return /^[=+\-@\t\r]/.test(value) ? `'${value}` : value;
}

/** Wrap a string cell for CSV: sanitise formulas, then quote and escape. */
function csvCell(value: string): string {
  return `"${csvSafe(value).replace(/"/g, '""')}"`;
}

function mergedRowsToCsv(rows: MergedRow[]): string {
  const header = "Date,Type,Description,Amount,Transaction ID,Source File\n";
  const body = rows
    .map((r) =>
      [
        csvCell(r.date),
        csvCell(r.type),
        csvCell(r.name),
        Number.isFinite(r.amount) ? r.amount.toFixed(2) : "",
        csvCell(r.fitid ?? ""),
        csvCell(r.source),
      ].join(",")
    )
    .join("\n");
  return header + body;
}

function mergedRowsToXlsx(rows: MergedRow[]): Buffer {
  const aoa: (string | number)[][] = [
    ["Date", "Type", "Description", "Amount", "Transaction ID", "Source File"],
    ...rows.map((r) => [
      r.date,
      r.type,
      r.name,
      r.amount,
      r.fitid ?? "",
      r.source,
    ]),
  ];
  const ws = XLSX.utils.aoa_to_sheet(aoa);
  ws["!cols"] = [
    { wch: 12 }, // Date
    { wch: 12 }, // Type
    { wch: 40 }, // Description
    { wch: 14 }, // Amount
    { wch: 22 }, // Transaction ID
    { wch: 28 }, // Source File
  ];
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Transactions");
  return Buffer.from(XLSX.write(wb, { type: "buffer", bookType: "xlsx" }));
}

export async function POST(req: NextRequest) {
  const limited = await checkUploadRateLimit(req);
  if (limited) return limited;

  let formData: FormData;
  try {
    formData = await req.formData();
  } catch {
    return NextResponse.json({ error: "Please upload one or more .qbo, .ofx or .qfx files." }, { status: 400 });
  }

  const format = (formData.get("format") as string | null) === "xlsx" ? "xlsx" : "csv";
  const files = formData.getAll("files").filter((f): f is File => f instanceof File);

  if (files.length === 0) {
    return NextResponse.json({ error: "No files received." }, { status: 400 });
  }
  if (files.length > MAX_FILES) {
    return NextResponse.json(
      { error: `Too many files — this tool merges up to ${MAX_FILES} files at a time.` },
      { status: 400 }
    );
  }

  const merged: MergedRow[] = [];
  const counts: { name: string; rows: number }[] = [];

  for (const file of files) {
    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { error: `“${file.name}” is over 10 MB — a QBO/OFX file should be far smaller.` },
        { status: 400 }
      );
    }
    if (!/\.(qbo|ofx|qfx)$/i.test(file.name)) {
      return NextResponse.json(
        { error: `“${file.name}” is not a .qbo, .ofx or .qfx file.` },
        { status: 400 }
      );
    }
    const text = await file.text();
    if (!text || text.length < 50) {
      return NextResponse.json({ error: `“${file.name}” appears to be empty.` }, { status: 400 });
    }
    try {
      const result = analyzeQboToCsv(text);
      for (const row of result.rows) merged.push({ ...row, source: file.name });
      counts.push({ name: file.name, rows: result.rows.length });
    } catch (err) {
      return NextResponse.json(
        {
          error: `“${file.name}” could not be exported: ${
            err instanceof Error ? err.message : "Could not read that file."
          }`,
        },
        { status: 400 }
      );
    }
  }

  const countsHeader = encodeURIComponent(JSON.stringify(counts));

  if (format === "xlsx") {
    const buf = mergedRowsToXlsx(merged);
    return new NextResponse(new Uint8Array(buf), {
      headers: {
        "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": 'attachment; filename="transactions-merged.xlsx"',
        "X-Files": String(files.length),
        "X-Counts": countsHeader,
      },
    });
  }

  return new NextResponse(mergedRowsToCsv(merged), {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": 'attachment; filename="transactions-merged.csv"',
      "X-Files": String(files.length),
      "X-Counts": countsHeader,
    },
  });
}
