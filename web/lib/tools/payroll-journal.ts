/**
 * Payroll journal entry generator.
 *
 * Builds the standard payroll journal entry from gross pay and the
 * withholding / employer-tax totals, checks that net pay matches gross
 * minus employee deductions and that debits equal credits, and exports
 * the entry as a QuickBooks Online journal CSV and a QuickBooks Desktop
 * IIF (GENERAL JOURNAL) file.
 *
 * DEPENDENCY-FREE on purpose: no imports at all, so the client component
 * can import this module directly without pulling server code into the
 * browser bundle.
 */

export interface PayrollAccounts {
  wagesExpense: string;
  payrollTaxExpense: string;
  fedPayable: string;
  statePayable: string;
  ssPayable: string;
  medPayable: string;
  futaPayable: string;
  sutaPayable: string;
  wagesPayable: string;
}

export interface PayrollInput {
  periodStart: string;
  periodEnd: string;
  grossWages: number;
  fedWithholding: number;
  stateWithholding: number;
  empSocialSecurity: number;
  empMedicare: number;
  emprSocialSecurity: number;
  emprMedicare: number;
  futa: number;
  suta: number;
  netPay: number;
  accounts: PayrollAccounts;
}

export interface PayrollJournalLine {
  account: string;
  debit: number;
  credit: number;
}

export interface PayrollJournal {
  lines: PayrollJournalLine[];
  totalDebits: number;
  totalCredits: number;
  difference: number;
  computedNetPay: number;
  netPayMatches: boolean;
  balanced: boolean;
  qboCsv: string;
  iif: string;
  errors: string[];
}

export const DEFAULT_PAYROLL_ACCOUNTS: PayrollAccounts = {
  wagesExpense: "Wages Expense",
  payrollTaxExpense: "Payroll Tax Expense",
  fedPayable: "Federal Withholding Payable",
  statePayable: "State Withholding Payable",
  ssPayable: "Social Security Payable",
  medPayable: "Medicare Payable",
  futaPayable: "FUTA Payable",
  sutaPayable: "SUTA Payable",
  wagesPayable: "Wages Payable",
};

const r2 = (n: number) => Math.round(n * 100) / 100;
const num = (n: number) => (Number.isFinite(n) ? n : 0);
const fmt = (n: number) => r2(num(n)).toFixed(2);

function csvEscape(v: string): string {
  return /[",\n\r]/.test(v) ? `"${v.replace(/"/g, '""')}"` : v;
}

/** Convert an ISO (yyyy-mm-dd) or other parseable date to MM/DD/YYYY. */
function toMmDdYyyy(raw: string): string {
  const s = (raw ?? "").trim();
  const iso = s.match(/^(\d{4})-(\d{1,2})-(\d{1,2})/);
  if (iso) return `${iso[2].padStart(2, "0")}/${iso[3].padStart(2, "0")}/${iso[1]}`;
  const us = s.match(/^(\d{1,2})\/(\d{1,2})\/(\d{2,4})$/);
  if (us) {
    const y = us[3].length === 2 ? `20${us[3]}` : us[3];
    return `${us[1].padStart(2, "0")}/${us[2].padStart(2, "0")}/${y}`;
  }
  return s;
}

export function buildPayrollJournal(input: PayrollInput): PayrollJournal {
  const a = input.accounts;
  const gross = num(input.grossWages);
  const fed = num(input.fedWithholding);
  const state = num(input.stateWithholding);
  const empSS = num(input.empSocialSecurity);
  const empMed = num(input.empMedicare);
  const emprSS = num(input.emprSocialSecurity);
  const emprMed = num(input.emprMedicare);
  const futa = num(input.futa);
  const suta = num(input.suta);
  const netPay = num(input.netPay);

  const payrollTaxExpense = r2(emprSS + emprMed + futa + suta);
  const ssPayable = r2(empSS + emprSS);
  const medPayable = r2(empMed + emprMed);

  const rawLines: PayrollJournalLine[] = [
    { account: a.wagesExpense, debit: r2(gross), credit: 0 },
    { account: a.payrollTaxExpense, debit: payrollTaxExpense, credit: 0 },
    { account: a.fedPayable, debit: 0, credit: r2(fed) },
    { account: a.statePayable, debit: 0, credit: r2(state) },
    { account: a.ssPayable, debit: 0, credit: ssPayable },
    { account: a.medPayable, debit: 0, credit: medPayable },
    { account: a.futaPayable, debit: 0, credit: r2(futa) },
    { account: a.sutaPayable, debit: 0, credit: r2(suta) },
    { account: a.wagesPayable, debit: 0, credit: r2(netPay) },
  ];
  // Skip zero-amount lines.
  const lines = rawLines.filter((l) => l.debit !== 0 || l.credit !== 0);

  const totalDebits = r2(lines.reduce((s, l) => s + l.debit, 0));
  const totalCredits = r2(lines.reduce((s, l) => s + l.credit, 0));
  const difference = r2(totalDebits - totalCredits);

  const computedNetPay = r2(gross - (fed + state + empSS + empMed));
  const netPayMatches = Math.abs(computedNetPay - netPay) < 0.011;
  const balanced = netPayMatches && Math.abs(totalDebits - totalCredits) < 0.011;

  const errors: string[] = [];
  if (!netPayMatches) {
    errors.push(
      `Net pay should be $${fmt(computedNetPay)} based on gross minus employee deductions (you entered $${fmt(netPay)}). ` +
        "Check the withholding amounts or the net pay figure."
    );
  }
  if (Math.abs(totalDebits - totalCredits) >= 0.011) {
    errors.push(
      `Debits ($${fmt(totalDebits)}) do not equal credits ($${fmt(totalCredits)}) — difference $${fmt(Math.abs(difference))}. ` +
        "Journal entries must balance before import, so QuickBooks will reject this entry until debits equal credits."
    );
  }

  // ── QuickBooks Online journal CSV ───────────────────────────────────────
  const description = `Payroll ${input.periodStart} to ${input.periodEnd}`;
  const qboCsv = [
    "Journal Date,Account,Debit,Credit,Description",
    ...lines.map((l) =>
      [
        csvEscape(input.periodEnd),
        csvEscape(l.account),
        l.debit !== 0 ? fmt(l.debit) : "",
        l.credit !== 0 ? fmt(l.credit) : "",
        csvEscape(description),
      ].join(",")
    ),
  ].join("\n");

  // ── QuickBooks Desktop IIF (GENERAL JOURNAL) ────────────────────────────
  // TRNS row = first line (the Wages Expense debit); every other line is an
  // SPL row. Amounts are signed: debits positive, credits negative, so the
  // whole block sums to zero when the entry balances.
  const iifDate = toMmDdYyyy(input.periodEnd);
  const signed = (l: PayrollJournalLine) => (l.debit !== 0 ? fmt(l.debit) : `-${fmt(l.credit)}`);
  const iifLines = [
    "!TRNS\tTRNSID\tTRNSTYPE\tDATE\tACCNT\tAMOUNT",
    "!SPL\tSPLID\tTRNSTYPE\tDATE\tACCNT\tAMOUNT",
    "!ENDTRNS",
  ];
  lines.forEach((l, i) => {
    const kind = i === 0 ? "TRNS" : "SPL";
    iifLines.push(`${kind}\t\tGENERAL JOURNAL\t${iifDate}\t${l.account}\t${signed(l)}`);
  });
  iifLines.push("ENDTRNS");
  const iif = iifLines.join("\n");

  return {
    lines,
    totalDebits,
    totalCredits,
    difference,
    computedNetPay,
    netPayMatches,
    balanced,
    qboCsv,
    iif,
    errors,
  };
}
