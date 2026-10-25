/**
 * Generic CSV → QBO converter.
 *
 * Accepts any bank / transaction CSV: the caller supplies a column mapping
 * (date, payee, amount — or a debit/credit column pair — plus optional memo),
 * or the mapping is auto-detected from common header names. Pure parsing, no
 * network, no storage. The QBO body is generated with the site's existing
 * transactionsToQBO() so FITIDs stay collision-proof and the file passes the
 * site's own QBO checker.
 */
import { transactionsToQBO, verifyBalanceChain } from "@/lib/mock-transactions";
import type { Transaction } from "@/types/billing";

export interface CsvMapping {
  date: number; // column index, -1 = unmapped
  payee: number;
  amount: number; // -1 when debit/credit columns are used instead
  debit: number;
  credit: number;
  memo: number;
  balance: number;
}

export interface GenericRow {
  date: string;
  payee: string;
  amount: number;
  memo: string;
  balance: number | null;
}

export interface GenericResult {
  rows: GenericRow[];
  warnings: string[];
  csv: string;
  balanceChecked: boolean;
  balanceOk: boolean | null;
}

const r2 = (n: number) => Math.round(n * 100) / 100;

export function splitCsvLine(line: string): string[] {
  const out: string[] = [];
  let cur = "";
  let inQ = false;
  for (let i = 0; i < line.length; i++) {
    const c = line[i];
    if (inQ) {
      if (c === '"') {
        if (line[i + 1] === '"') { cur += '"'; i++; } else inQ = false;
      } else cur += c;
    } else if (c === '"') {
      inQ = true;
    } else if (c === ",") {
      out.push(cur); cur = "";
    } else cur += c;
  }
  out.push(cur);
  return out;
}

export function parseMoney(raw: string | undefined): number | null {
  if (raw === undefined) return null;
  let s = raw.trim();
  if (!s) return null;
  const neg = /^\(.*\)$/.test(s) || s.startsWith("-");
  s = s.replace(/[()$,£€\s]/g, "");
  if (!/^-?[\d,]*\.?\d+$/.test(s.replace(/,/g, ""))) return null;
  const v = parseFloat(s.replace(/,/g, ""));
  if (Number.isNaN(v)) return null;
  return neg && v > 0 ? -v : v;
}

export function parseDateFlex(raw: string | undefined): string {
  const s = (raw ?? "").trim();
  if (!s) return "";
  let m = s.match(/^(\d{4})[/\-.](\d{1,2})[/\-.](\d{1,2})/);
  if (m) return `${m[1]}-${m[2].padStart(2, "0")}-${m[3].padStart(2, "0")}`;
  m = s.match(/^(\d{1,2})[/\-.](\d{1,2})[/\-.](\d{2,4})/);
  if (m) {
    const y = m[3].length === 2 ? `20${m[3]}` : m[3];
    return `${y}-${m[1].padStart(2, "0")}-${m[2].padStart(2, "0")}`;
  }
  const d = new Date(s);
  return Number.isNaN(d.getTime()) ? "" : d.toISOString().slice(0, 10);
}

const DATE_NAMES = ["date", "posted", "posting date", "transaction date", "post date", "txn date", "value date"];
const PAYEE_NAMES = ["description", "memo", "name", "payee", "details", "narrative", "transaction details", "merchant"];
const AMOUNT_NAMES = ["amount", "amt", "value", "total", "sum"];
const DEBIT_NAMES = ["debit", "withdrawal", "money out", "out", "debits", "payment"];
const CREDIT_NAMES = ["credit", "deposit", "money in", "in", "credits", "receipt"];
const MEMO_NAMES = ["memo", "note", "notes", "reference", "ref", "check number", "category"];
const BALANCE_NAMES = ["balance", "running balance", "bal", "ledger balance"];

function findCol(headers: string[], names: string[]): number {
  for (const n of names) {
    const i = headers.indexOf(n);
    if (i >= 0) return i;
  }
  return -1;
}

/** Best-guess mapping from a header row. -1 means "not found, user must pick". */
export function autoDetectMapping(headers: string[]): CsvMapping {
  const lower = headers.map((h) => h.trim().toLowerCase());
  return {
    date: findCol(lower, DATE_NAMES),
    payee: findCol(lower, PAYEE_NAMES),
    amount: findCol(lower, AMOUNT_NAMES),
    debit: findCol(lower, DEBIT_NAMES),
    credit: findCol(lower, CREDIT_NAMES),
    memo: findCol(lower, MEMO_NAMES),
    balance: findCol(lower, BALANCE_NAMES),
  };
}

function fitidFor(row: GenericRow, idx: number): string {
  const raw = `${row.date}|${row.payee}|${row.amount.toFixed(2)}|${idx}`;
  let h = 5381;
  for (let i = 0; i < raw.length; i++) h = ((h << 5) + h + raw.charCodeAt(i)) >>> 0;
  return `CSCSV${h.toString(36).toUpperCase()}${idx + 1}`;
}

export function parseGenericCsv(text: string, mapping: CsvMapping): GenericResult {
  const warnings: string[] = [];
  const lines = text.split(/\r?\n/).filter((l) => l.trim().length > 0);
  if (lines.length < 2) {
    throw new Error("That CSV appears to be empty. It needs a header row and at least one transaction row.");
  }
  if (mapping.date < 0 || mapping.payee < 0) {
    throw new Error("Please map the date and payee columns first.");
  }
  const hasAmount = mapping.amount >= 0;
  const hasPair = mapping.debit >= 0 && mapping.credit >= 0;
  if (!hasAmount && !hasPair) {
    throw new Error("Please map either an amount column or a debit/credit column pair.");
  }
  const body = lines.slice(1).map(splitCsvLine);
  const rows: GenericRow[] = [];
  let skipped = 0;
  for (const cells of body) {
    let amount: number | null;
    if (hasAmount) {
      amount = parseMoney(cells[mapping.amount]);
    } else {
      // Debit/credit pair convention: a debit (money out) is negative, a
      // credit (money in) is positive. A row normally fills only one side.
      const debit = parseMoney(cells[mapping.debit]) ?? 0;
      const credit = parseMoney(cells[mapping.credit]) ?? 0;
      amount = debit !== 0 ? -Math.abs(debit) : credit !== 0 ? Math.abs(credit) : null;
    }
    if (amount === null) { skipped++; continue; }
    const date = parseDateFlex(cells[mapping.date]);
    if (!date) { skipped++; continue; }
    rows.push({
      date,
      payee: (cells[mapping.payee] ?? "").trim().slice(0, 120) || "Transaction",
      amount: r2(amount),
      memo: mapping.memo >= 0 ? (cells[mapping.memo] ?? "").trim().slice(0, 120) : "",
      balance: mapping.balance >= 0 ? parseMoney(cells[mapping.balance]) : null,
    });
  }
  if (rows.length === 0) {
    throw new Error("No transaction rows could be read with this mapping. Check that the date and amount columns are mapped to the right headers.");
  }
  if (skipped > 0) {
    warnings.push(`${skipped} row(s) were skipped because the date or amount could not be read.`);
  }

  let balanceChecked = false;
  let balanceOk: boolean | null = null;
  const withBal = rows.filter((r) => r.balance !== null);
  if (withBal.length >= 2) {
    const chain = verifyBalanceChain(
      withBal.map((r) => ({ date: r.date, description: r.payee, amount: r.amount, balance: r.balance, category: null, reference: null }))
    );
    balanceChecked = chain.checked;
    balanceOk = chain.checked ? chain.ok : null;
    if (chain.checked && !chain.ok) {
      warnings.push("The running-balance chain breaks somewhere in this file: previous balance + transaction does not equal the next balance. Review the file before importing.");
    }
  }

  const csv = [
    "Date,Payee,Amount,Memo",
    ...rows.map((r) => [r.date, `"${r.payee.replace(/"/g, '""')}"`, r.amount.toFixed(2), `"${r.memo.replace(/"/g, '""')}"`].join(",")),
  ].join("\n");

  return { rows, warnings, csv, balanceChecked, balanceOk };
}

/** Build the QBO body for mapped rows (download itself is Pro-gated at the route). */
export function genericRowsToQbo(rows: GenericRow[]): string {
  const txns: Transaction[] = rows.map((r, i) => ({
    date: r.date,
    description: r.payee,
    amount: r.amount,
    balance: r.balance,
    category: r.memo || null,
    reference: fitidFor(r, i),
  }));
  return transactionsToQBO(txns, "0000000000");
}
