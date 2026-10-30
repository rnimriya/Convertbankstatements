/**
 * QBO / OFX / QFX → CSV + Excel converter.
 *
 * Parses a Web Connect / OFX file with the site's existing analyzeOfx()
 * and turns its transactions into a plain spreadsheet shape: Date, Type,
 * Description, Amount, Transaction ID. USD semantics throughout (QBO is a
 * US QuickBooks format) — no currency conversion is done, amounts are
 * copied exactly as they appear in the file. Pure parsing, no network,
 * no storage.
 */
import * as XLSX from "xlsx";
import { analyzeOfx, type OfxIssue } from "@/lib/ofx-check";

export interface QboCsvRow {
  date: string; // ISO yyyy-mm-dd
  type: string;
  name: string;
  amount: number;
  fitid: string | null;
}

export interface QboCsvSummary {
  transactionCount: number;
  creditsTotal: number;
  debitsTotal: number;
  netChange: number;
  periodStart: string | null;
  periodEnd: string | null;
  currency: string | null;
  ledgerBalance: number | null;
}

export interface QboCsvResult {
  summary: QboCsvSummary;
  rows: QboCsvRow[];
  csv: string;
  issues: OfxIssue[];
}

/**
 * Neutralise CSV/spreadsheet formula injection — same guard as
 * transactionsToCSV in lib/mock-transactions.ts. A cell beginning with
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

export function qboRowsToCsv(rows: QboCsvRow[]): string {
  const header = "Date,Type,Description,Amount,Transaction ID\n";
  const body = rows
    .map((r) =>
      [
        csvCell(r.date),
        csvCell(r.type),
        csvCell(r.name),
        Number.isFinite(r.amount) ? r.amount.toFixed(2) : "",
        csvCell(r.fitid ?? ""),
      ].join(",")
    )
    .join("\n");
  return header + body;
}

/** Excel (.xlsx) — returns a Buffer, built the same way as transactionsToExcel. */
export function qboRowsToXlsx(rows: QboCsvRow[]): Buffer {
  const sheetRows = rows.map((r) => ({
    Date: r.date,
    Type: r.type,
    Description: r.name,
    Amount: r.amount,
    "Transaction ID": r.fitid ?? "",
  }));

  const ws = XLSX.utils.json_to_sheet(sheetRows);
  ws["!cols"] = [
    { wch: 12 }, // Date
    { wch: 12 }, // Type
    { wch: 40 }, // Description
    { wch: 14 }, // Amount
    { wch: 22 }, // Transaction ID
  ];
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Transactions");
  return Buffer.from(XLSX.write(wb, { type: "buffer", bookType: "xlsx" }));
}

/**
 * Parse a QBO/OFX/QFX file's text into spreadsheet rows + a summary.
 * Throws a clear error when the file is not an OFX file or contains no
 * transactions, so API routes can surface the message as-is.
 */
export function analyzeQboToCsv(text: string): QboCsvResult {
  const analysis = analyzeOfx(text);

  const notOfx = analysis.issues.some(
    (i) => i.level === "error" && i.message.includes("does not look like an OFX")
  );
  if (notOfx) {
    throw new Error(
      "That file does not look like a QBO, OFX or QFX file. QuickBooks Web Connect (.qbo) files are OFX format underneath — please choose a .qbo, .ofx or .qfx file exported from your bank."
    );
  }
  if (analysis.transactions.length === 0) {
    throw new Error(
      "No transactions were found in that file. Please check that it is a complete QBO, OFX or QFX statement file exported from your bank."
    );
  }

  const rows: QboCsvRow[] = analysis.transactions.map((t) => ({
    date: t.date,
    type: t.type,
    name: t.name,
    amount: t.amount,
    fitid: t.fitid,
  }));

  return {
    summary: {
      transactionCount: analysis.transactionCount,
      creditsTotal: analysis.creditsTotal,
      debitsTotal: analysis.debitsTotal,
      netChange: analysis.netChange,
      periodStart: analysis.periodStart,
      periodEnd: analysis.periodEnd,
      currency: analysis.currency,
      ledgerBalance: analysis.ledgerBalance,
    },
    rows,
    csv: qboRowsToCsv(rows),
    issues: analysis.issues,
  };
}
