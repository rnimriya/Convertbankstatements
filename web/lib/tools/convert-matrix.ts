/**
 * Shared conversion matrix engine.
 *
 * Parses a statement file in any supported input format (CSV, OFX, QBO,
 * QFX, IIF, QIF) into one normalized transaction shape, and emits that
 * shape as any supported output format (CSV, XLSX, OFX, QFX, QBO, IIF,
 * QIF, PDF). All parsing / formatting reuses the site's existing tool
 * libraries — this module only adapts between them and adds the two
 * formats that did not exist yet (QIF parse/emit and PDF emit).
 *
 * Pure parsing / formatting — no network, no storage. Parsers throw
 * honest, user-facing errors so API routes can surface them as-is.
 */
import { PDFDocument, StandardFonts, rgb, type PDFFont, type PDFPage } from "pdf-lib";
import {
  analyzeQboToCsv,
  qboRowsToCsv,
  qboRowsToXlsx,
  type QboCsvRow,
} from "./qbo-to-csv";
import { buildFixedQbo, fixOfx } from "./ofx-fixer";
import {
  autoDetectMapping,
  parseGenericCsv,
  splitCsvLine,
  type GenericRow,
} from "./csv-to-qbo";
import { buildIif } from "./csv-to-iif";
import type { Transaction } from "@/types/billing";

export type InputFormat = "csv" | "ofx" | "qbo" | "qfx" | "iif" | "qif";
export type OutputFormat =
  | "csv"
  | "xlsx"
  | "ofx"
  | "qfx"
  | "qbo"
  | "iif"
  | "qif"
  | "pdf";

export interface NormalizedTxn {
  date: string; // ISO yyyy-mm-dd
  name: string;
  memo: string;
  amount: number;
  fitid: string | null;
  type: string;
  checkNum: string | null;
}

export interface StatementMeta {
  accountId: string | null;
  bankName: string | null;
  intuBid: string | null;
  currency: string | null;
  ledgerBalance: number | null;
  ledgerAsOf: string | null;
}

export interface ParsedStatement {
  txns: NormalizedTxn[];
  meta: StatementMeta;
}

export interface EmitResult {
  body: string | Buffer;
  contentType: string;
  ext: string;
}

export interface Conversion {
  from: InputFormat;
  to: OutputFormat;
}

/** The 19 supported conversions, keyed by tool slug. */
export const CONVERSIONS: Record<string, Conversion> = {
  "csv-to-ofx": { from: "csv", to: "ofx" },
  "csv-to-qfx": { from: "csv", to: "qfx" },
  "csv-to-qif": { from: "csv", to: "qif" },
  "iif-to-csv": { from: "iif", to: "csv" },
  "ofx-to-csv": { from: "ofx", to: "csv" },
  "ofx-to-qfx": { from: "ofx", to: "qfx" },
  "ofx-to-pdf": { from: "ofx", to: "pdf" },
  "qbo-to-iif": { from: "qbo", to: "iif" },
  "qbo-to-pdf": { from: "qbo", to: "pdf" },
  "qfx-to-csv": { from: "qfx", to: "csv" },
  "qfx-to-excel": { from: "qfx", to: "xlsx" },
  "qfx-to-ofx": { from: "qfx", to: "ofx" },
  "qfx-to-pdf": { from: "qfx", to: "pdf" },
  "qfx-to-qbo": { from: "qfx", to: "qbo" },
  "qfx-to-qif": { from: "qfx", to: "qif" },
  "qif-to-csv": { from: "qif", to: "csv" },
  "qif-to-excel": { from: "qif", to: "xlsx" },
  "qif-to-pdf": { from: "qif", to: "pdf" },
  "qif-to-qbo": { from: "qif", to: "qbo" },
};

const EMPTY_META: StatementMeta = {
  accountId: null,
  bankName: null,
  intuBid: null,
  currency: null,
  ledgerBalance: null,
  ledgerAsOf: null,
};

const DEFAULT_IIF_ACCOUNTS = {
  bankAccount: "Business Checking",
  incomeAccount: "Uncategorized Income",
  expenseAccount: "Uncategorized Expense",
};

const r2 = (n: number) => Math.round(n * 100) / 100;

// ---------------------------------------------------------------------------
// CSV parsing
// ---------------------------------------------------------------------------

function parseCsvStatement(text: string): ParsedStatement {
  const firstLine = text.split(/\r?\n/).find((l) => l.trim().length > 0) ?? "";
  const headers = splitCsvLine(firstLine);
  const mapping = autoDetectMapping(headers);
  // parseGenericCsv throws its own honest messages — propagate as-is.
  const { rows } = parseGenericCsv(text, mapping);
  const txns: NormalizedTxn[] = rows.map((r) => ({
    date: r.date,
    name: r.payee,
    memo: r.memo,
    amount: r.amount,
    fitid: null,
    type: r.amount >= 0 ? "CREDIT" : "DEBIT",
    checkNum: null,
  }));
  return { txns, meta: { ...EMPTY_META } };
}

// ---------------------------------------------------------------------------
// OFX / QBO / QFX parsing
// ---------------------------------------------------------------------------

function parseOfxStatement(text: string): ParsedStatement {
  // analyzeQboToCsv throws its honest "does not look like…" /
  // "No transactions were found…" messages — propagate as-is.
  const { rows } = analyzeQboToCsv(text);
  const fixed = fixOfx(text);
  const txns: NormalizedTxn[] = rows.map((r) => ({
    date: r.date,
    name: r.name,
    memo: "",
    amount: r.amount,
    fitid: r.fitid,
    type: r.type,
    checkNum: null,
  }));
  return {
    txns,
    meta: {
      accountId: fixed.accountId,
      bankName: fixed.report.bankName,
      intuBid: fixed.report.intuBid,
      currency: fixed.currency,
      ledgerBalance: fixed.ledgerBalance,
      ledgerAsOf: fixed.ledgerAsOf,
    },
  };
}

// ---------------------------------------------------------------------------
// IIF parsing — parse logic copied from app/api/tools/iif-convert/route.ts
// (parseIif + convertDate), keeping TRNS rows only and numeric amounts only.
// ---------------------------------------------------------------------------

/** Column order QuickBooks Desktop writes when a file has no "!" header
 *  for a block (the standard IIF layout, TRNS and SPL share the shape). */
const IIF_FALLBACK_COLUMNS = [
  "TRNSID", "TRNSTYPE", "DATE", "ACCNT", "NAME", "AMOUNT", "DOCNUM", "MEMO",
  "CLEAR", "TOPRINT", "ADDR1", "ADDR2", "ADDR3", "ADDR4", "ADDR5", "DUEDATE",
  "TERMS", "PAID", "PAYMETH", "SHIPVIA", "SHIPDATE", "REP", "FOB", "PONUM",
  "INVTITLE", "INVMEMO", "SADDR1", "SADDR2",
];

/** MM/DD/YYYY (or M/D/YY) → yyyy-mm-dd when the date is recognizable. */
function convertIifDate(raw: string): string {
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

function parseIifAmount(raw: string): number | null {
  const cleaned = raw.replace(/[$,\s]/g, "");
  if (!cleaned) return null;
  const n = Number(cleaned);
  return Number.isFinite(n) ? Math.round(n * 100) / 100 : null;
}

function parseIifStatement(text: string): ParsedStatement {
  const headers: Record<string, string[]> = {
    TRNS: IIF_FALLBACK_COLUMNS,
    SPL: IIF_FALLBACK_COLUMNS,
  };
  const txns: NormalizedTxn[] = [];

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
    // TRNS rows only — SPL rows are split (distribution) lines, not
    // transactions in their own right.
    if (kind !== "TRNS") continue;
    const cols = headers[kind];
    const amount = parseIifAmount(field(cols, fields, "AMOUNT"));
    if (amount === null) continue; // numeric amounts only
    const docNum = cols.includes("DOCNUM") ? field(cols, fields, "DOCNUM") : "";
    txns.push({
      date: convertIifDate(field(cols, fields, "DATE")),
      name: field(cols, fields, "NAME"),
      memo: field(cols, fields, "MEMO"),
      amount,
      fitid: null,
      type: field(cols, fields, "TRNSTYPE"),
      checkNum: docNum ? docNum : null,
    });
  }

  if (txns.length === 0) {
    throw new Error(
      "That file does not look like an IIF file — no transaction (TRNS) rows were found in it. IIF files are tab-separated text exports from QuickBooks Desktop; please export again from QuickBooks Desktop and choose the .iif file it creates."
    );
  }
  return { txns, meta: { ...EMPTY_META } };
}

// ---------------------------------------------------------------------------
// QIF parsing (new)
// ---------------------------------------------------------------------------

/** QIF dates: MM/DD/YYYY, M/D/YYYY, MM/DD/YY (→ 20YY), MM/DD'YYYY. */
function parseQifDate(raw: string): string {
  const s = raw.trim().replace(/'/g, "/").replace(/\s+/g, "");
  const m = s.match(/^(\d{1,2})\/(\d{1,2})\/(\d{2}|\d{4})$/);
  if (!m) return "";
  const month = Number(m[1]);
  const day = Number(m[2]);
  const year = m[3].length === 2 ? 2000 + Number(m[3]) : Number(m[3]);
  if (month < 1 || month > 12 || day < 1 || day > 31) return "";
  const iso = `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
  const d = new Date(`${iso}T00:00:00Z`);
  if (Number.isNaN(d.getTime()) || d.toISOString().slice(0, 10) !== iso) return "";
  return iso;
}

/** QIF amounts: strip commas / $; parentheses mean negative. */
function parseQifAmount(raw: string): number | null {
  let s = raw.trim();
  if (!s) return null;
  const parenNegative = /^\(.*\)$/.test(s);
  s = s.replace(/[()$,\s]/g, "");
  if (!s) return null;
  const n = Number(s);
  if (!Number.isFinite(n)) return null;
  return r2(parenNegative && n > 0 ? -n : n);
}

function parseQifStatement(text: string): ParsedStatement {
  const txns: NormalizedTxn[] = [];
  let current: Record<string, string> = {};
  let inAccountBlock = false;

  const flush = () => {
    const rec = current;
    current = {};
    if (!rec.D && !rec.T && !rec.P) return;
    const date = rec.D ? parseQifDate(rec.D) : "";
    const amount = rec.T ? parseQifAmount(rec.T) : null;
    if (!date || amount === null) return;
    txns.push({
      date,
      name: (rec.P ?? "").trim().slice(0, 120) || "Transaction",
      memo: (rec.M ?? "").trim(),
      amount,
      fitid: null,
      type: amount >= 0 ? "CREDIT" : "DEBIT",
      checkNum: rec.N?.trim() ? rec.N.trim() : null,
    });
  };

  for (const rawLine of text.split(/\r?\n/)) {
    const line = rawLine;
    const trimmed = line.trim();
    if (!trimmed) continue;
    if (trimmed.startsWith("!")) {
      const typeMatch = trimmed.match(/^!Type:\s*(\S+)/i);
      if (typeMatch) {
        const kind = typeMatch[1].toLowerCase();
        if (kind.startsWith("invst") || kind.startsWith("invest")) {
          throw new Error(
            "investment QIF files are not supported by this converter — please export a Bank, CCard or Cash QIF file instead."
          );
        }
        // Bank / CCard / Cash (and anything else non-investment) parse
        // with the same record fields.
      }
      if (/^!Account/i.test(trimmed)) inAccountBlock = true;
      continue;
    }
    if (trimmed === "^") {
      if (inAccountBlock) {
        inAccountBlock = false;
        current = {};
      } else {
        flush();
      }
      continue;
    }
    if (inAccountBlock) continue;
    const code = line.charAt(0).toUpperCase();
    const value = line.slice(1);
    // D date, T amount, P payee, M memo, N check number are kept;
    // L category, C cleared status, A address lines and split fields
    // (S / E / $) are intentionally ignored.
    if (code === "D" || code === "T" || code === "P" || code === "M" || code === "N") {
      current[code] = value;
    }
  }
  flush(); // tolerate a final record with no trailing ^

  if (txns.length === 0) {
    throw new Error(
      "No transactions were found in that QIF file. Please check that it is a complete QIF statement exported from your bank or accounting software."
    );
  }
  return { txns, meta: { ...EMPTY_META } };
}

// ---------------------------------------------------------------------------
// parseStatement
// ---------------------------------------------------------------------------

export function parseStatement(format: InputFormat, text: string): ParsedStatement {
  switch (format) {
    case "csv":
      return parseCsvStatement(text);
    case "ofx":
    case "qbo":
    case "qfx":
      return parseOfxStatement(text);
    case "iif":
      return parseIifStatement(text);
    case "qif":
      return parseQifStatement(text);
    default:
      throw new Error(`Unsupported input format: ${format}`);
  }
}

// ---------------------------------------------------------------------------
// Emitters
// ---------------------------------------------------------------------------

function txnsToQboCsvRows(txns: NormalizedTxn[]): QboCsvRow[] {
  return txns.map((t) => ({
    date: t.date,
    type: t.type,
    name: t.name,
    amount: t.amount,
    fitid: t.fitid,
  }));
}

function emitOfxLike(
  format: "ofx" | "qfx" | "qbo",
  txns: NormalizedTxn[],
  meta: StatementMeta
): EmitResult {
  const transactions: Transaction[] = txns.map((t) => ({
    date: t.date,
    description: t.name,
    amount: t.amount,
    balance: null,
    category: t.memo || null,
    reference: t.fitid,
  }));
  const body = buildFixedQbo(transactions, {
    intuBid: meta.intuBid ? meta.intuBid : null,
    bankName: meta.bankName,
    accountId: meta.accountId || "0000000000",
    ledgerBalance: meta.ledgerBalance,
    ledgerAsOf: meta.ledgerAsOf,
  });
  return { body, contentType: "application/octet-stream", ext: format };
}

function emitIif(txns: NormalizedTxn[]): EmitResult {
  const rows: GenericRow[] = txns.map((t) => ({
    date: t.date,
    payee: t.name,
    amount: t.amount,
    memo: t.memo,
    balance: null,
  }));
  return {
    body: buildIif(rows, DEFAULT_IIF_ACCOUNTS),
    contentType: "application/octet-stream",
    ext: "iif",
  };
}

function qifField(value: string): string {
  return value.replace(/[\r\n\t]/g, " ").trim();
}

function isoToQifDate(iso: string): string {
  const m = iso.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!m) return iso;
  return `${m[2]}/${m[3]}/${m[1]}`;
}

function emitQif(txns: NormalizedTxn[]): EmitResult {
  const lines: string[] = ["!Type:Bank"];
  for (const t of txns) {
    lines.push(`D${isoToQifDate(t.date)}`);
    lines.push(`T${r2(t.amount).toFixed(2)}`);
    lines.push(`P${qifField(t.name)}`);
    if (t.memo) lines.push(`M${qifField(t.memo)}`);
    if (t.checkNum) lines.push(`N${qifField(t.checkNum)}`);
    lines.push("^");
  }
  return {
    body: lines.join("\n") + "\n",
    contentType: "application/octet-stream",
    ext: "qif",
  };
}

// --- PDF emit (pdf-lib) -----------------------------------------------------

const PDF_PAGE_W = 612; // Letter
const PDF_PAGE_H = 792;
const PDF_MARGIN = 48;
const PDF_RIGHT = PDF_PAGE_W - PDF_MARGIN; // 564
const PDF_ROW_H = 16;
const PDF_FONT_SIZE = 10.5;

function formatMoney(n: number): string {
  const v = r2(n);
  const sign = v < 0 ? "-" : "";
  const abs = Math.abs(v).toFixed(2);
  const [intPart, decPart] = abs.split(".");
  const grouped = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return `${sign}${grouped}.${decPart}`;
}

/** Truncate text (with an ellipsis) until it fits maxWidth at size. */
function truncateToWidth(
  text: string,
  font: PDFFont,
  size: number,
  maxWidth: number
): string {
  if (font.widthOfTextAtSize(text, size) <= maxWidth) return text;
  const ellipsis = "…";
  let out = text;
  while (out.length > 0 && font.widthOfTextAtSize(out + ellipsis, size) > maxWidth) {
    out = out.slice(0, -1);
  }
  return out + ellipsis;
}

async function emitPdf(
  txns: NormalizedTxn[],
  sourceName: string
): Promise<EmitResult> {
  const pdfDoc = await PDFDocument.create();
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const dark = rgb(0.15, 0.15, 0.15);
  const grey = rgb(0.45, 0.45, 0.45);
  const ruleColor = rgb(0.25, 0.25, 0.25);

  const drawHeaderRow = (page: PDFPage, headerBaseline: number) => {
    page.drawText("Date", { x: PDF_MARGIN, y: headerBaseline, size: PDF_FONT_SIZE, font: fontBold, color: dark });
    page.drawText("Description", { x: 126, y: headerBaseline, size: PDF_FONT_SIZE, font: fontBold, color: dark });
    const amountLabel = "Amount";
    const amountW = fontBold.widthOfTextAtSize(amountLabel, PDF_FONT_SIZE);
    page.drawText(amountLabel, { x: PDF_RIGHT - amountW, y: headerBaseline, size: PDF_FONT_SIZE, font: fontBold, color: dark });
    page.drawLine({
      start: { x: PDF_MARGIN, y: headerBaseline - 6 },
      end: { x: PDF_RIGHT, y: headerBaseline - 6 },
      thickness: 1,
      color: ruleColor,
    });
  };

  let page = pdfDoc.addPage([PDF_PAGE_W, PDF_PAGE_H]);

  // Title (first page only).
  const rawTitle = `${sourceName} — converted by ConvertStatement`;
  const cappedTitle = rawTitle.length > 95 ? `${rawTitle.slice(0, 94)}…` : rawTitle;
  const title = truncateToWidth(cappedTitle, fontBold, 15, PDF_PAGE_W - PDF_MARGIN * 2);
  page.drawText(title, { x: PDF_MARGIN, y: PDF_PAGE_H - 60, size: 15, font: fontBold, color: dark });

  let y = PDF_PAGE_H - 92;
  drawHeaderRow(page, y);
  y -= 10; // gap under the header rule

  for (const t of txns) {
    y -= PDF_ROW_H;
    if (y < 90) {
      page = pdfDoc.addPage([PDF_PAGE_W, PDF_PAGE_H]);
      y = PDF_PAGE_H - 60;
      drawHeaderRow(page, y);
      y -= 10 + PDF_ROW_H;
    }
    page.drawText(t.date, { x: PDF_MARGIN, y, size: PDF_FONT_SIZE, font, color: dark });
    const desc = truncateToWidth(t.name || "", font, PDF_FONT_SIZE, 330);
    page.drawText(desc, { x: 126, y, size: PDF_FONT_SIZE, font, color: dark });
    const amountText = formatMoney(t.amount);
    const amountW = font.widthOfTextAtSize(amountText, PDF_FONT_SIZE);
    page.drawText(amountText, { x: PDF_RIGHT - amountW, y, size: PDF_FONT_SIZE, font, color: dark });
  }

  // Totals.
  if (y < 150) {
    page = pdfDoc.addPage([PDF_PAGE_W, PDF_PAGE_H]);
    y = PDF_PAGE_H - 60;
  }
  y -= 10;
  page.drawLine({
    start: { x: PDF_MARGIN, y },
    end: { x: PDF_RIGHT, y },
    thickness: 1,
    color: ruleColor,
  });
  const totalIn = txns.filter((t) => t.amount > 0).reduce((s, t) => s + t.amount, 0);
  const totalOut = txns.filter((t) => t.amount < 0).reduce((s, t) => s + Math.abs(t.amount), 0);
  const net = totalIn - totalOut;
  const totals: string[] = [
    `Total in: ${formatMoney(totalIn)}`,
    `Total out: ${formatMoney(totalOut)}`,
    `Net: ${formatMoney(net)}`,
  ];
  for (const line of totals) {
    y -= PDF_ROW_H;
    page.drawText(line, { x: PDF_MARGIN, y, size: PDF_FONT_SIZE, font: fontBold, color: dark });
  }

  // Footer on every page (second pass — page count is now known).
  const pages = pdfDoc.getPages();
  const totalPages = pages.length;
  const footerText = "Converted by ConvertStatement · convertstatement.online";
  pages.forEach((p, idx) => {
    p.drawText(footerText, { x: PDF_MARGIN, y: 36, size: 8, font, color: grey });
    const pageLabel = `Page ${idx + 1} of ${totalPages}`;
    const labelW = font.widthOfTextAtSize(pageLabel, 8);
    p.drawText(pageLabel, { x: PDF_RIGHT - labelW, y: 36, size: 8, font, color: grey });
  });

  const bytes = await pdfDoc.save();
  return { body: Buffer.from(bytes), contentType: "application/pdf", ext: "pdf" };
}

// ---------------------------------------------------------------------------
// emitStatement
// ---------------------------------------------------------------------------

export async function emitStatement(
  format: OutputFormat,
  txns: NormalizedTxn[],
  meta: StatementMeta,
  sourceName: string
): Promise<EmitResult> {
  switch (format) {
    case "csv":
      return { body: qboRowsToCsv(txnsToQboCsvRows(txns)), contentType: "text/csv", ext: "csv" };
    case "xlsx":
      return {
        body: qboRowsToXlsx(txnsToQboCsvRows(txns)),
        contentType:
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        ext: "xlsx",
      };
    case "ofx":
    case "qfx":
    case "qbo":
      return emitOfxLike(format, txns, meta);
    case "iif":
      return emitIif(txns);
    case "qif":
      return emitQif(txns);
    case "pdf":
      return emitPdf(txns, sourceName);
    default:
      throw new Error(`Unsupported output format: ${format}`);
  }
}
