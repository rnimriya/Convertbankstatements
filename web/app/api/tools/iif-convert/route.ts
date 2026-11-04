/**
 * POST /api/tools/iif-convert — free QuickBooks Desktop IIF to CSV /
 * Excel converter, no account required. Accepts one .iif file (max
 * 10 MB) plus a format field ("csv" or "xlsx"). IIF is tab-separated:
 * lines starting with "!" declare the columns, TRNS lines open each
 * transaction and SPL lines carry its split (distribution) lines. The
 * spreadsheet gets one row per TRNS line and one per SPL line (SPL rows
 * are marked Type = "Split line"), with dates converted from
 * MM/DD/YYYY to yyyy-mm-dd when recognizable. Nothing is stored.
 * Anonymous use is rate-limited by checkUploadRateLimit.
 */
import { NextRequest, NextResponse } from "next/server";
import * as XLSX from "xlsx";
import { checkUploadRateLimit } from "@/lib/rate-limit";

export const maxDuration = 30;

const MAX_SIZE = 10 * 1024 * 1024;

interface IifRow {
  date: string;
  type: string;
  account: string;
  name: string;
  amount: number | string;
  memo: string;
}

/** Column order QuickBooks Desktop writes when a file has no "!" header
 *  for a block (the standard IIF layout, TRNS and SPL share the shape). */
const FALLBACK_COLUMNS = [
  "TRNSID", "TRNSTYPE", "DATE", "ACCNT", "NAME", "AMOUNT", "DOCNUM", "MEMO",
  "CLEAR", "TOPRINT", "ADDR1", "ADDR2", "ADDR3", "ADDR4", "ADDR5", "DUEDATE",
  "TERMS", "PAID", "PAYMETH", "SHIPVIA", "SHIPDATE", "REP", "FOB", "PONUM",
  "INVTITLE", "INVMEMO", "SADDR1", "SADDR2",
];

/** MM/DD/YYYY (or M/D/YY) → yyyy-mm-dd when the date is recognizable. */
function convertDate(raw: string): string {
  const m = raw.trim().match(/^(\d{1,2})\/(\d{1,2})\/(\d{2}|\d{4})$/);
  if (!m) return raw.trim();
  const month = Number(m[1]);
  const day = Number(m[2]);
  const year = m[3].length === 2 ? 2000 + Number(m[3]) : Number(m[3]);
  if (month < 1 || month > 12 || day < 1 || day > 31) return raw.trim();
  const iso = `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
  const d = new Date(`${iso}T00:00:00Z`);
  if (Number.isNaN(d.getTime()) || d.toISOString().slice(0, 10) !== iso) return raw.trim();
  return iso;
}

function parseAmount(raw: string): number | string {
  const cleaned = raw.replace(/[$,\s]/g, "");
  if (!cleaned) return "";
  const n = Number(cleaned);
  return Number.isFinite(n) ? Math.round(n * 100) / 100 : raw.trim();
}

function parseIif(text: string): IifRow[] {
  const headers: Record<string, string[]> = { TRNS: FALLBACK_COLUMNS, SPL: FALLBACK_COLUMNS };
  const rows: IifRow[] = [];

  const field = (cols: string[], fields: string[], column: string): string => {
    const idx = cols.indexOf(column);
    if (idx < 0) return "";
    return (fields[idx + 1] ?? "").trim();
  };

  for (const rawLine of text.split(/\r?\n/)) {
    if (!rawLine.trim()) continue;
    if (rawLine.startsWith("!")) {
      const cells = rawLine.split("\t");
      const kind = cells[0].slice(1).trim().toUpperCase();
      if ((kind === "TRNS" || kind === "SPL") && cells.length > 1) {
        headers[kind] = cells.slice(1).map((c) => c.trim().toUpperCase());
      }
      continue;
    }
    const fields = rawLine.split("\t");
    const kind = (fields[0] ?? "").trim().toUpperCase();
    if (kind !== "TRNS" && kind !== "SPL") continue;
    const cols = headers[kind];
    rows.push({
      date: convertDate(field(cols, fields, "DATE")),
      type: kind === "SPL" ? "Split line" : field(cols, fields, "TRNSTYPE"),
      account: field(cols, fields, "ACCNT"),
      name: field(cols, fields, "NAME"),
      amount: parseAmount(field(cols, fields, "AMOUNT")),
      memo: field(cols, fields, "MEMO"),
    });
  }
  return rows;
}

/** Neutralise spreadsheet formula injection, same guard as the QBO tools. */
function csvSafe(value: string): string {
  return /^[=+\-@\t\r]/.test(value) ? `'${value}` : value;
}

function csvCell(value: string): string {
  return `"${csvSafe(value).replace(/"/g, '""')}"`;
}

function rowsToCsv(rows: IifRow[]): string {
  const header = "Date,Type,Account,Name,Amount,Memo\n";
  const body = rows
    .map((r) =>
      [
        csvCell(r.date),
        csvCell(r.type),
        csvCell(r.account),
        csvCell(r.name),
        typeof r.amount === "number" ? r.amount.toFixed(2) : csvCell(String(r.amount)),
        csvCell(r.memo),
      ].join(",")
    )
    .join("\n");
  return header + body;
}

function rowsToXlsx(rows: IifRow[]): Buffer {
  const sheetRows = rows.map((r) => ({
    Date: r.date,
    Type: r.type,
    Account: r.account,
    Name: r.name,
    Amount: r.amount,
    Memo: r.memo,
  }));
  const ws = XLSX.utils.json_to_sheet(sheetRows);
  ws["!cols"] = [
    { wch: 12 }, // Date
    { wch: 14 }, // Type
    { wch: 28 }, // Account
    { wch: 32 }, // Name
    { wch: 14 }, // Amount
    { wch: 40 }, // Memo
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
    return NextResponse.json({ error: "Please upload an .iif file." }, { status: 400 });
  }

  const file = formData.get("file") as File | null;
  if (!file) {
    return NextResponse.json({ error: "No file received." }, { status: 400 });
  }
  if (file.size > MAX_SIZE) {
    return NextResponse.json({ error: "That file is over 10 MB — please try a smaller one." }, { status: 400 });
  }
  if (!/\.iif$/i.test(file.name)) {
    return NextResponse.json({ error: "Please choose an .iif file." }, { status: 400 });
  }
  const format = formData.get("format") === "xlsx" ? "xlsx" : "csv";

  const text = await file.text();
  if (!text || text.length < 20) {
    return NextResponse.json({ error: "That file appears to be empty." }, { status: 400 });
  }

  const rows = parseIif(text);
  const transactionRows = rows.filter((r) => r.type !== "Split line").length;
  if (transactionRows === 0) {
    return NextResponse.json(
      {
        error:
          "That file does not look like an IIF file — no transaction (TRNS) rows were found in it. IIF files are tab-separated text exports from QuickBooks Desktop; please export again from QuickBooks Desktop and choose the .iif file it creates.",
      },
      { status: 400 }
    );
  }

  const base = file.name.replace(/\.iif$/i, "").replace(/[^a-zA-Z0-9._-]+/g, "-") || "iif-export";
  if (format === "xlsx") {
    const buf = rowsToXlsx(rows);
    return new NextResponse(new Uint8Array(buf), {
      headers: {
        "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": `attachment; filename="${base}.xlsx"`,
        "X-Rows": String(rows.length),
      },
    });
  }
  return new NextResponse(rowsToCsv(rows), {
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": `attachment; filename="${base}.csv"`,
      "X-Rows": String(rows.length),
    },
  });
}
