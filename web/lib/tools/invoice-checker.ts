/**
 * Invoice import validator + formatter.
 *
 * Accepts an invoice CSV in the shape people export from spreadsheets,
 * billing tools, or QuickBooks itself, checks every row against what
 * QuickBooks Online's invoice import needs, applies the safe fixes
 * (date format, amount cleanup, amount calculated from quantity × rate),
 * and returns a cleaned CSV containing only the rows with no errors —
 * in the exact column layout QuickBooks Online's invoice import accepts.
 * Pure parsing, no network, no storage.
 */
import { splitCsvLine, parseMoney, parseDateFlex } from "@/lib/tools/csv-to-qbo";

export interface InvoiceRowValues {
  invoiceNo: string;
  customer: string;
  date: string;
  dueDate: string;
  item: string;
  qty: number | null;
  rate: number | null;
  amount: number | null;
}

export interface InvoiceRow {
  line: number;
  errors: string[];
  fixes: string[];
  ok: boolean;
  values: InvoiceRowValues;
}

export interface InvoiceCheckResult {
  rows: InvoiceRow[];
  summary: {
    totalRows: number;
    okRows: number;
    errorRows: number;
    fixedRows: number;
  };
  fixedCsv: string;
}

const r2 = (n: number) => Math.round(n * 100) / 100;

const HEADER_ALIASES: Record<keyof Omit<InvoiceRowValues, "qty" | "rate" | "amount"> | "qty" | "rate" | "amount", string[]> = {
  customer: ["customer", "customer name", "client", "client name"],
  invoiceNo: ["invoice #", "invoice number", "invoice no", "invoice no.", "inv #", "doc number", "number"],
  date: ["invoice date", "date", "txn date"],
  dueDate: ["due date", "duedate"],
  item: ["product/service", "item", "service", "product", "description", "item name"],
  qty: ["quantity", "qty"],
  rate: ["rate", "price", "unit price", "item rate"],
  amount: ["amount", "total", "line total", "item amount"],
};

function compact(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9]/g, "");
}

function findHeader(headers: string[], aliases: string[]): number {
  const lower = headers.map((h) => h.trim().toLowerCase());
  for (const a of aliases) {
    const i = lower.indexOf(a);
    if (i >= 0) return i;
  }
  const compacted = headers.map((h) => compact(h));
  for (const a of aliases) {
    const i = compacted.indexOf(compact(a));
    if (i >= 0) return i;
  }
  return -1;
}

function isoToMmDdYyyy(iso: string): string {
  const m = iso.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (!m) return iso;
  return `${m[2]}/${m[3]}/${m[1]}`;
}

function csvEscape(v: string): string {
  return /[",\n\r]/.test(v) ? `"${v.replace(/"/g, '""')}"` : v;
}

export function checkInvoiceCsv(text: string): InvoiceCheckResult {
  const lines = (text ?? "").split(/\r?\n/);
  if (lines.length === 0 || !lines[0]?.trim()) {
    throw new Error("That CSV appears to be empty. It needs a header row and at least one invoice row.");
  }
  const headers = splitCsvLine(lines[0]).map((h) => h.trim());

  const col: Record<string, number> = {};
  for (const key of Object.keys(HEADER_ALIASES) as (keyof typeof HEADER_ALIASES)[]) {
    col[key] = findHeader(headers, HEADER_ALIASES[key]);
  }

  if (col.customer < 0 || col.date < 0) {
    const missing: string[] = [];
    if (col.customer < 0) missing.push('a customer column ("Customer", "Customer Name", "Client" or "Client Name")');
    if (col.date < 0) missing.push('an invoice date column ("Invoice Date", "Date" or "Txn Date")');
    throw new Error(
      `Could not find the columns QuickBooks needs: ${missing.join(" and ")}. ` +
        "QuickBooks Online invoice import requires at least a customer name and an invoice date on every row. " +
        "Check your header row and try again."
    );
  }

  const get = (cells: string[], idx: number): string => (idx >= 0 ? (cells[idx] ?? "").trim() : "");

  const rows: InvoiceRow[] = [];
  const seenInvoiceNos = new Map<string, number>();

  for (let i = 1; i < lines.length; i++) {
    const rawLine = lines[i];
    if (!rawLine.trim()) continue;
    const line = i + 1; // 1-based line number in the file, header = line 1
    const cells = splitCsvLine(rawLine);
    const errors: string[] = [];
    const fixes: string[] = [];

    const invoiceNo = get(cells, col.invoiceNo);
    const customer = get(cells, col.customer);
    const dateRaw = get(cells, col.date);
    const dueDateRaw = get(cells, col.dueDate);
    const item = get(cells, col.item);
    const qtyRaw = get(cells, col.qty);
    const rateRaw = get(cells, col.rate);
    const amountRaw = get(cells, col.amount);

    const values: InvoiceRowValues = {
      invoiceNo,
      customer,
      date: dateRaw,
      dueDate: dueDateRaw,
      item,
      qty: null,
      rate: null,
      amount: null,
    };

    if (!customer) errors.push("Missing customer name");

    // ── Date ──────────────────────────────────────────────────────────────
    const parsedDate = parseDateFlex(dateRaw);
    if (!dateRaw || !parsedDate) {
      errors.push("Missing or unreadable invoice date");
    } else {
      const formatted = isoToMmDdYyyy(parsedDate);
      values.date = formatted;
      if (!/^\d{2}\/\d{2}\/\d{4}$/.test(dateRaw)) {
        fixes.push("Date reformatted to MM/DD/YYYY");
      }
    }

    // Due date: normalize when parseable (no fix recorded — it is a
    // formatting convenience, not a repair QuickBooks requires flagged).
    if (dueDateRaw) {
      const parsedDue = parseDateFlex(dueDateRaw);
      if (parsedDue) values.dueDate = isoToMmDdYyyy(parsedDue);
    }

    if (!item) errors.push("Missing product/service (item)");

    // ── Quantity / rate ───────────────────────────────────────────────────
    if (qtyRaw) {
      const q = parseMoney(qtyRaw);
      if (q === null) errors.push("Quantity is not a number");
      else values.qty = q;
    }
    if (rateRaw) {
      const r = parseMoney(rateRaw);
      if (r === null) errors.push("Rate is not a number");
      else values.rate = r;
    }

    // ── Amount ────────────────────────────────────────────────────────────
    let amount = amountRaw ? parseMoney(amountRaw) : null;
    if (amountRaw && amount !== null && (amountRaw.includes("$") || amountRaw.includes(","))) {
      fixes.push("Amount cleaned");
    }
    if (amountRaw && amount === null) {
      errors.push("Amount is not a number");
    } else if (amount === null) {
      if (values.qty !== null && values.rate !== null) {
        amount = r2(values.qty * values.rate);
        fixes.push("Amount calculated from quantity × rate");
      } else {
        errors.push("Missing amount");
      }
    }
    if (amount !== null) {
      values.amount = r2(amount);
      if (amount <= 0) errors.push("Amount must be greater than zero");
    }

    // ── Duplicate invoice numbers ─────────────────────────────────────────
    if (invoiceNo) {
      const first = seenInvoiceNos.get(invoiceNo);
      if (first !== undefined) {
        errors.push(`Duplicate invoice number ${invoiceNo} (first used on line ${first})`);
      } else {
        seenInvoiceNos.set(invoiceNo, line);
      }
    }

    rows.push({ line, errors, fixes, ok: errors.length === 0, values });
  }

  const okRows = rows.filter((r) => r.ok).length;
  const summary = {
    totalRows: rows.length,
    okRows,
    errorRows: rows.length - okRows,
    fixedRows: rows.filter((r) => r.ok && r.fixes.length > 0).length,
  };

  const fmtQty = (n: number | null): string => {
    if (n === null) return "";
    return Number.isInteger(n) ? String(n) : String(r2(n));
  };
  const fmtMoney = (n: number | null): string => (n === null ? "" : n.toFixed(2));

  const fixedLines = [
    "InvoiceNo,Customer,InvoiceDate,DueDate,ItemName,ItemQuantity,ItemRate,ItemAmount",
    ...rows
      .filter((r) => r.ok)
      .map((r) =>
        [
          csvEscape(r.values.invoiceNo),
          csvEscape(r.values.customer),
          csvEscape(r.values.date),
          csvEscape(r.values.dueDate),
          csvEscape(r.values.item),
          fmtQty(r.values.qty),
          fmtMoney(r.values.rate),
          fmtMoney(r.values.amount),
        ].join(",")
      ),
  ];
  const fixedCsv = fixedLines.join("\n");

  return { rows, summary, fixedCsv };
}
