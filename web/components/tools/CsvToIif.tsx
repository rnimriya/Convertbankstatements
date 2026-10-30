"use client";

import { useState } from "react";
import { AlertTriangle, Download } from "lucide-react";
import { ToolUpload, usd, downloadTextFile } from "./tool-shared";
import { SampleDownloads } from "./SampleDownloads";
import type { CsvMapping, GenericRow } from "@/lib/tools/csv-to-qbo";
import type { IifAccounts } from "@/lib/tools/csv-to-iif";

interface Result {
  headers: string[];
  mapping: CsvMapping;
  rows: GenericRow[];
  warnings: string[];
  iif: string;
}

const FIELDS: { key: keyof CsvMapping; label: string; required?: boolean }[] = [
  { key: "date", label: "Date column", required: true },
  { key: "payee", label: "Payee / description column", required: true },
  { key: "amount", label: "Amount column (signed)" },
  { key: "debit", label: "Debit (money out) column" },
  { key: "credit", label: "Credit (money in) column" },
  { key: "memo", label: "Memo column (optional)" },
];

const DEFAULT_ACCOUNTS: IifAccounts = {
  bankAccount: "Business Checking",
  incomeAccount: "Uncategorized Income",
  expenseAccount: "Uncategorized Expense",
};

const ACCOUNT_FIELDS: { key: keyof IifAccounts; label: string; help: string }[] = [
  {
    key: "bankAccount",
    label: "Bank account",
    help: "The QuickBooks Desktop bank account these transactions belong to.",
  },
  {
    key: "incomeAccount",
    label: "Income account (for deposits)",
    help: "Deposits (positive amounts) post against this account.",
  },
  {
    key: "expenseAccount",
    label: "Expense account (for payments)",
    help: "Payments (negative amounts) post against this account.",
  },
];

export function CsvToIif() {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [result, setResult] = useState<Result | null>(null);
  const [mapping, setMapping] = useState<CsvMapping | null>(null);
  const [accounts, setAccounts] = useState<IifAccounts>(DEFAULT_ACCOUNTS);

  async function runConvert(file: File, map: CsvMapping | null, accts: IifAccounts) {
    setBusy(true);
    setError(null);
    try {
      const fd = new FormData();
      fd.append("file", file);
      if (map) fd.append("mapping", JSON.stringify(map));
      fd.append("bankAccount", accts.bankAccount);
      fd.append("incomeAccount", accts.incomeAccount);
      fd.append("expenseAccount", accts.expenseAccount);
      const res = await fetch("/api/tools/csv-iif-convert", { method: "POST", body: fd });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error ?? "Could not read that CSV.");
      setResult(data as Result);
      setMapping(data.mapping as CsvMapping);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not read that CSV.");
    } finally {
      setBusy(false);
    }
  }

  async function handleFile(f: File) {
    setFile(f);
    setFileName(f.name);
    setResult(null);
    setMapping(null);
    await runConvert(f, null, accounts);
  }

  // Mapping and account edits re-run the conversion in memory from the
  // file already uploaded in this browser tab. Nothing is stored.
  async function remap(next: CsvMapping) {
    if (!file) return;
    await runConvert(file, next, accounts);
  }

  async function reRunWithAccounts(next: IifAccounts) {
    if (!file) return;
    await runConvert(file, mapping, next);
  }

  function setField(key: keyof CsvMapping, value: string) {
    if (!mapping) return;
    const next = { ...mapping, [key]: value === "" ? -1 : Number(value) };
    setMapping(next);
    void remap(next);
  }

  function setAccountField(key: keyof IifAccounts, value: string) {
    setAccounts((prev) => ({ ...prev, [key]: value }));
  }

  function downloadIif() {
    if (!result) return;
    downloadTextFile("transactions.iif", result.iif);
  }

  return (
    <div>
      <ToolUpload
        accept=".csv"
        busy={busy}
        busyText="Reading your CSV…"
        title={fileName ?? "Drop a bank CSV export here"}
        meta={["CSV export", "Max 10 MB"]}
        activeTitle="Release to convert"
        onFile={(f) => void handleFile(f)}
      />
      <div className="mt-4">
        <p className="text-xs text-zinc-500 mb-2">Try it without your own data first:</p>
        <SampleDownloads ids={["generic-csv"]} />
      </div>

      {error && (
        <p className="mt-4 rounded-[20px] border border-red-200 bg-red-50 dark:bg-red-900/20 dark:border-red-800 px-4 py-3 text-sm text-red-700 dark:text-red-300">
          {error}
        </p>
      )}

      {result && mapping && (
        <div className="mt-8">
          <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5">
            <h3 className="font-bold text-zinc-900 dark:text-white text-sm">Column mapping</h3>
            <p className="text-xs text-zinc-500 mt-1">
              Auto-detected from your header row. If a column looks wrong, change it here and the file is re-read right away.
            </p>
            <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
              {FIELDS.map((f) => (
                <label key={f.key} className="block text-sm">
                  <span className="text-xs text-zinc-500">
                    {f.label}
                    {f.required ? " *" : ""}
                  </span>
                  <select
                    value={mapping[f.key] >= 0 ? String(mapping[f.key]) : ""}
                    onChange={(e) => setField(f.key, e.target.value)}
                    className="mt-1 w-full rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3 py-2 text-zinc-900 dark:text-white"
                  >
                    <option value="">— not mapped —</option>
                    {result.headers.map((h, i) => (
                      <option key={i} value={i}>{h}</option>
                    ))}
                  </select>
                </label>
              ))}
            </div>
            <p className="mt-2 text-xs text-zinc-400">
              Map either one signed amount column, or a debit/credit pair. Debit rows become negative amounts; credit rows stay positive.
            </p>
          </div>

          <div className="mt-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5">
            <h3 className="font-bold text-zinc-900 dark:text-white text-sm">Accounts</h3>
            <p className="text-xs text-zinc-500 mt-1">
              Type the account names exactly as they appear in your QuickBooks Desktop chart of accounts.
              If a name does not exist yet, QuickBooks Desktop will ask to create it during import.
              Changing a name re-runs the conversion when you leave the field.
            </p>
            <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-3">
              {ACCOUNT_FIELDS.map((f) => (
                <label key={f.key} className="block text-sm">
                  <span className="text-xs text-zinc-500">{f.label}</span>
                  <input
                    type="text"
                    value={accounts[f.key]}
                    maxLength={80}
                    onChange={(e) => setAccountField(f.key, e.target.value)}
                    onBlur={() => void reRunWithAccounts(accounts)}
                    className="mt-1 w-full rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3 py-2 text-zinc-900 dark:text-white"
                  />
                  <span className="mt-1 block text-xs text-zinc-400">{f.help}</span>
                </label>
              ))}
            </div>
          </div>

          {result.warnings.map((w, i) => (
            <div key={i} className="mt-3 rounded-[20px] border border-amber-200 bg-amber-50 dark:bg-amber-900/20 dark:border-amber-800 px-4 py-3 text-sm text-amber-800 dark:text-amber-200 flex items-start gap-2">
              <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" /> <span>{w}</span>
            </div>
          ))}

          <div className="mt-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden">
            <div className="px-5 py-3 bg-zinc-50 dark:bg-zinc-900/60 border-b border-zinc-200 dark:border-zinc-800 flex flex-wrap items-center gap-x-4 gap-y-1">
              <p className="font-bold text-zinc-900 dark:text-white">{result.rows.length} transactions parsed</p>
            </div>
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs text-zinc-500 border-b border-zinc-200 dark:border-zinc-800">
                  <th className="px-5 py-2 font-semibold">Date</th>
                  <th className="px-3 py-2 font-semibold">Payee</th>
                  <th className="px-3 py-2 font-semibold text-right">Amount</th>
                </tr>
              </thead>
              <tbody>
                {result.rows.slice(0, 50).map((r, i) => (
                  <tr key={i} className="border-b border-zinc-100 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300">
                    <td className="px-5 py-1.5">{r.date}</td>
                    <td className="px-3 py-1.5">{r.payee}{r.memo ? <span className="text-zinc-400"> · {r.memo}</span> : null}</td>
                    <td className="px-3 py-1.5 text-right font-mono">{usd(r.amount)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {result.rows.length > 50 && (
              <p className="px-5 py-2 text-xs text-zinc-500">Showing the first 50 of {result.rows.length} rows — the full file is in the download below.</p>
            )}
          </div>

          <div className="mt-5 flex flex-wrap gap-3">
            <button
              onClick={downloadIif}
              className="inline-flex items-center gap-2 bg-pine-600 text-white font-semibold px-5 py-2.5 rounded-lg hover:bg-pine-700"
            >
              <Download className="h-4 w-4" /> Download .IIF (free)
            </button>
          </div>
          <div className="mt-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/60 px-5 py-4 text-sm text-zinc-600 dark:text-zinc-300">
            <p className="font-semibold text-zinc-900 dark:text-white">Importing into QuickBooks Desktop</p>
            <p className="mt-1 leading-relaxed">
              In QuickBooks Desktop, go to File → Utilities → Import → IIF Files, then choose the
              downloaded file. Make a backup of your company file first (File → Back Up Company) —
              IIF imports cannot be undone in one step, so a backup is the standard, honest advice
              before any import. Deposits post to your income account and payments post to your
              expense account, so review the imported transactions against your chart of accounts
              afterwards.
            </p>
          </div>
          <p className="mt-3 text-xs text-zinc-400">
            This download is fully free — no account and no Pro plan needed. Positive amounts import
            as deposits and negative amounts import as checks/payments, each balanced by its offset line.
          </p>
        </div>
      )}
    </div>
  );
}
