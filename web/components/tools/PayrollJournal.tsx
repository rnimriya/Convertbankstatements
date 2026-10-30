"use client";

import { useMemo, useState } from "react";
import { AlertTriangle, CheckCircle2, Download } from "lucide-react";
import { usd, downloadTextFile } from "./tool-shared";
import {
  buildPayrollJournal,
  DEFAULT_PAYROLL_ACCOUNTS,
  type PayrollAccounts,
} from "@/lib/tools/payroll-journal";

interface MoneyFields {
  grossWages: string;
  fedWithholding: string;
  stateWithholding: string;
  empSocialSecurity: string;
  empMedicare: string;
  emprSocialSecurity: string;
  emprMedicare: string;
  futa: string;
  suta: string;
  netPay: string;
}

const MONEY_LABELS: { key: keyof MoneyFields; label: string; hint?: string }[] = [
  { key: "grossWages", label: "Gross wages" },
  { key: "fedWithholding", label: "Federal withholding (employee)" },
  { key: "stateWithholding", label: "State withholding (employee)" },
  { key: "empSocialSecurity", label: "Social Security — employee" },
  { key: "empMedicare", label: "Medicare — employee" },
  { key: "emprSocialSecurity", label: "Social Security — employer" },
  { key: "emprMedicare", label: "Medicare — employer" },
  { key: "futa", label: "FUTA (employer)" },
  { key: "suta", label: "SUTA (employer)" },
  { key: "netPay", label: "Net pay", hint: "What employees were actually paid" },
];

const ACCOUNT_LABELS: { key: keyof PayrollAccounts; label: string }[] = [
  { key: "wagesExpense", label: "Wages expense account" },
  { key: "payrollTaxExpense", label: "Payroll tax expense account" },
  { key: "fedPayable", label: "Federal withholding payable" },
  { key: "statePayable", label: "State withholding payable" },
  { key: "ssPayable", label: "Social Security payable" },
  { key: "medPayable", label: "Medicare payable" },
  { key: "futaPayable", label: "FUTA payable" },
  { key: "sutaPayable", label: "SUTA payable" },
  { key: "wagesPayable", label: "Wages payable (net pay)" },
];

const num = (s: string) => {
  const v = parseFloat(s.replace(/[$,]/g, ""));
  return Number.isFinite(v) ? v : 0;
};

const inputCls =
  "mt-1 w-full rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3 py-2 text-zinc-900 dark:text-white";

export function PayrollJournal() {
  const [periodStart, setPeriodStart] = useState("");
  const [periodEnd, setPeriodEnd] = useState("");
  const [money, setMoney] = useState<MoneyFields>({
    grossWages: "",
    fedWithholding: "",
    stateWithholding: "",
    empSocialSecurity: "",
    empMedicare: "",
    emprSocialSecurity: "",
    emprMedicare: "",
    futa: "",
    suta: "",
    netPay: "",
  });
  const [accounts, setAccounts] = useState<PayrollAccounts>({ ...DEFAULT_PAYROLL_ACCOUNTS });

  const result = useMemo(
    () =>
      buildPayrollJournal({
        periodStart,
        periodEnd,
        grossWages: num(money.grossWages),
        fedWithholding: num(money.fedWithholding),
        stateWithholding: num(money.stateWithholding),
        empSocialSecurity: num(money.empSocialSecurity),
        empMedicare: num(money.empMedicare),
        emprSocialSecurity: num(money.emprSocialSecurity),
        emprMedicare: num(money.emprMedicare),
        futa: num(money.futa),
        suta: num(money.suta),
        netPay: num(money.netPay),
        accounts,
      }),
    [periodStart, periodEnd, money, accounts]
  );

  const hasActivity = result.totalDebits > 0 || result.totalCredits > 0;
  const canDownload = result.balanced && hasActivity;

  function downloadCsv() {
    downloadTextFile("payroll-journal.csv", result.qboCsv, "text/csv");
  }
  function downloadIif() {
    downloadTextFile("payroll-journal.iif", result.iif, "text/plain");
  }

  return (
    <div>
      <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5">
        <h3 className="font-bold text-zinc-900 dark:text-white text-sm">Pay period</h3>
        <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
          <label className="block text-sm">
            <span className="text-xs text-zinc-500">Period start</span>
            <input type="date" value={periodStart} onChange={(e) => setPeriodStart(e.target.value)} className={inputCls} />
          </label>
          <label className="block text-sm">
            <span className="text-xs text-zinc-500">Period end (journal date)</span>
            <input type="date" value={periodEnd} onChange={(e) => setPeriodEnd(e.target.value)} className={inputCls} />
          </label>
        </div>

        <h3 className="font-bold text-zinc-900 dark:text-white text-sm mt-6">Payroll totals</h3>
        <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
          {MONEY_LABELS.map((f) => (
            <label key={f.key} className="block text-sm">
              <span className="text-xs text-zinc-500">{f.label}{f.hint ? ` — ${f.hint}` : ""}</span>
              <input
                type="number"
                inputMode="decimal"
                min="0"
                step="0.01"
                placeholder="0.00"
                value={money[f.key]}
                onChange={(e) => setMoney((m) => ({ ...m, [f.key]: e.target.value }))}
                className={inputCls}
              />
            </label>
          ))}
        </div>

        <h3 className="font-bold text-zinc-900 dark:text-white text-sm mt-6">Account names</h3>
        <p className="text-xs text-zinc-500 mt-1">Prefilled with the usual QuickBooks names — change any of them to match your chart of accounts.</p>
        <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
          {ACCOUNT_LABELS.map((f) => (
            <label key={f.key} className="block text-sm">
              <span className="text-xs text-zinc-500">{f.label}</span>
              <input
                type="text"
                value={accounts[f.key]}
                onChange={(e) => setAccounts((a) => ({ ...a, [f.key]: e.target.value }))}
                className={inputCls}
              />
            </label>
          ))}
        </div>
      </div>

      {/* ── Live preview ── */}
      <div className="mt-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden">
        <div className="px-5 py-3 bg-zinc-50 dark:bg-zinc-900/60 border-b border-zinc-200 dark:border-zinc-800">
          <p className="font-bold text-zinc-900 dark:text-white">Journal entry preview</p>
          <p className="text-xs text-zinc-500 mt-0.5">Updates as you type. Employee and employer Social Security and Medicare are combined into one payable line each.</p>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-xs text-zinc-500 border-b border-zinc-200 dark:border-zinc-800">
              <th className="px-5 py-2 font-semibold">Account</th>
              <th className="px-3 py-2 font-semibold text-right">Debit</th>
              <th className="px-3 py-2 font-semibold text-right">Credit</th>
            </tr>
          </thead>
          <tbody>
            {result.lines.map((l, i) => (
              <tr key={i} className="border-b border-zinc-100 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300">
                <td className="px-5 py-1.5">{l.account}</td>
                <td className="px-3 py-1.5 text-right font-mono">{l.debit !== 0 ? usd(l.debit) : ""}</td>
                <td className="px-3 py-1.5 text-right font-mono">{l.credit !== 0 ? usd(l.credit) : ""}</td>
              </tr>
            ))}
            {result.lines.length === 0 && (
              <tr>
                <td colSpan={3} className="px-5 py-4 text-zinc-500">Enter your payroll totals above to preview the entry.</td>
              </tr>
            )}
          </tbody>
          <tfoot>
            <tr className="font-bold text-zinc-900 dark:text-white bg-zinc-50 dark:bg-zinc-900/60">
              <td className="px-5 py-2">Totals</td>
              <td className="px-3 py-2 text-right font-mono">{usd(result.totalDebits)}</td>
              <td className="px-3 py-2 text-right font-mono">{usd(result.totalCredits)}</td>
            </tr>
          </tfoot>
        </table>
      </div>

      {/* ── Balance status ── */}
      {hasActivity && result.balanced && (
        <div className="mt-4 rounded-[20px] border border-pine-200 dark:border-pine-800 bg-pine-50 dark:bg-pine-900/20 px-4 py-3 text-sm text-pine-800 dark:text-pine-200 flex items-start gap-2">
          <CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5" />
          <span>This entry balances — debits equal credits at {usd(result.totalDebits)}, and net pay matches gross minus employee deductions ({usd(result.computedNetPay)}).</span>
        </div>
      )}
      {hasActivity && !result.balanced && (
        <div className="mt-4 rounded-[20px] border border-red-200 bg-red-50 dark:bg-red-900/20 dark:border-red-800 px-4 py-3 text-sm text-red-700 dark:text-red-300">
          <p className="flex items-start gap-2 font-semibold"><AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" /> This entry does not balance yet</p>
          <ul className="mt-2 list-disc pl-5 space-y-1">
            {result.errors.map((e, i) => (
              <li key={i}>{e}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="mt-5 flex flex-wrap gap-3">
        <button
          onClick={downloadCsv}
          disabled={!canDownload}
          className="inline-flex items-center gap-2 bg-pine-600 text-white font-semibold px-5 py-2.5 rounded-lg hover:bg-pine-700 disabled:opacity-60"
        >
          <Download className="h-4 w-4" /> Download QBO journal CSV (free)
        </button>
        <button
          onClick={downloadIif}
          disabled={!canDownload}
          className="inline-flex items-center gap-2 bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-white font-semibold px-5 py-2.5 rounded-lg hover:border-pine-400 disabled:opacity-60"
        >
          <Download className="h-4 w-4" /> Download Desktop IIF (free)
        </button>
      </div>
      {!canDownload && (
        <p className="mt-3 text-xs text-zinc-400">
          Downloads unlock when the entry balances: debits must equal credits and net pay must equal gross minus employee deductions.
          {hasActivity && !result.netPayMatches ? ` Net pay should be ${usd(result.computedNetPay)} based on gross minus employee deductions.` : ""}
        </p>
      )}
      <p className="mt-2 text-xs text-zinc-400">Everything runs in your browser — nothing is uploaded or stored.</p>
    </div>
  );
}
