/**
 * Generic CSV → IIF converter for QuickBooks Desktop.
 *
 * Reuses the generic CSV parser from csv-to-qbo (column mapping, money and
 * date handling) and emits a QuickBooks Desktop IIF bank-transaction file:
 * TAB-separated, one !TRNS/!SPL/!ENDTRNS header block, then one TRNS + SPL
 * pair per row. Every pair sums to zero — the TRNS line carries the amount
 * against the bank account and the SPL line carries the opposite amount
 * against the income or expense account — which is the IIF double-entry
 * convention QuickBooks Desktop expects on import.
 *
 * Pure formatting — no network, no storage. This tool is fully free: the
 * IIF download happens client-side, with no account and no Pro gate.
 */
import { parseGenericCsv, type CsvMapping, type GenericRow } from "./csv-to-qbo";

export interface IifAccounts {
  bankAccount: string;
  incomeAccount: string;
  expenseAccount: string;
}

const r2 = (n: number) => Math.round(n * 100) / 100;

/** IIF is TAB-separated, one transaction per line — embedded tabs or
 *  newlines in a payee/memo would break the column layout, so strip them. */
function sanitize(value: string): string {
  return value.replace(/[\t\r\n]+/g, " ").trim();
}

function fmtDate(iso: string): string {
  const m = iso.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!m) return iso;
  return `${m[2]}/${m[3]}/${m[1]}`;
}

function fmtAmount(n: number): string {
  const v = r2(n);
  // Avoid "-0.00" for a zero offset amount.
  return (v === 0 ? 0 : v).toFixed(2);
}

export function buildIif(rows: GenericRow[], accounts: IifAccounts): string {
  const bankAccount = sanitize(accounts.bankAccount) || "Business Checking";
  const incomeAccount = sanitize(accounts.incomeAccount) || "Uncategorized Income";
  const expenseAccount = sanitize(accounts.expenseAccount) || "Uncategorized Expense";

  const lines: string[] = [
    "!TRNS\tTRNSID\tTRNSTYPE\tDATE\tACCNT\tNAME\tAMOUNT\tMEMO",
    "!SPL\tSPLID\tTRNSTYPE\tDATE\tACCNT\tNAME\tAMOUNT\tMEMO",
    "!ENDTRNS",
  ];

  for (const row of rows) {
    const isDeposit = row.amount > 0;
    const trnsType = isDeposit ? "DEPOSIT" : "CHECK";
    const offsetAccount = isDeposit ? incomeAccount : expenseAccount;
    const date = fmtDate(row.date);
    const name = sanitize(row.payee);
    const memo = sanitize(row.memo ?? "");
    const amount = r2(row.amount);
    const offsetAmount = r2(-amount);

    lines.push(
      ["TRNS", "", trnsType, date, bankAccount, name, fmtAmount(amount), memo].join("\t")
    );
    lines.push(
      ["SPL", "", trnsType, date, offsetAccount, name, fmtAmount(offsetAmount), memo].join("\t")
    );
    lines.push("ENDTRNS");
  }

  return lines.join("\n") + "\n";
}

export function parseCsvToIif(
  text: string,
  mapping: CsvMapping,
  accounts: IifAccounts
): { rows: GenericRow[]; warnings: string[]; iif: string } {
  const { rows, warnings } = parseGenericCsv(text, mapping);
  const iif = buildIif(rows, accounts);
  return { rows, warnings, iif };
}
