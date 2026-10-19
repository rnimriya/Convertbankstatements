"use client";

import { useState } from "react";
import { Receipt, AlertTriangle, Download, Lock, Plus, Trash2 } from "lucide-react";
import { ToolUpload, QboGateNotice, usd, downloadTextFile, downloadFromApi, useToolAuth, ToolAuthWall, SIGNUP_REQUIRED_CODE } from "./tool-shared";

interface Txn {
  date: string;
  description: string;
  amount: number;
  category: string | null;
}

interface Result {
  vendor: string | null;
  date: string;
  total: number;
  transactions: Txn[];
}

const CATEGORIES = [
  "Food & Dining", "Shopping", "Groceries", "Transport", "Travel", "Fuel",
  "Utilities", "Software", "Office Supplies", "Insurance", "Taxes",
  "Bank Fees", "Entertainment", "Health", "Income", "Transfer", "Other", "Others",
];

export function ReceiptToQbo() {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [result, setResult] = useState<Result | null>(null);
  const [rows, setRows] = useState<Txn[]>([]);
  const [dlBusy, setDlBusy] = useState(false);
  const [gate, setGate] = useState<string | null>(null);
  const { authed, forceWall } = useToolAuth();

  async function handleFile(f: File) {
    setBusy(true);
    setError(null);
    setResult(null);
    setRows([]);
    setGate(null);
    setFileName(f.name);
    try {
      const fd = new FormData();
      fd.append("file", f);
      const res = await fetch("/api/tools/receipt-extract", { method: "POST", body: fd });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        if (data?.code === SIGNUP_REQUIRED_CODE) { forceWall(); return; }
        throw new Error(data.error ?? "Could not read that receipt.");
      }
      const r = data as Result;
      setResult(r);
      setRows(r.transactions.map((t) => ({ ...t })));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not read that receipt.");
    } finally {
      setBusy(false);
    }
  }

  function updateRow(i: number, patch: Partial<Txn>) {
    setRows((prev) => prev.map((r, k) => (k === i ? { ...r, ...patch } : r)));
  }

  function addRow() {
    setRows((prev) => [...prev, { date: result?.date ?? "", description: "", amount: 0, category: "Other" }]);
  }

  function removeRow(i: number) {
    setRows((prev) => prev.filter((_, k) => k !== i));
  }

  const total = rows.reduce((s, r) => s + Math.abs(r.amount || 0), 0);

  function downloadCsv() {
    const lines = [
      "Date,Description,Amount,Category",
      ...rows.map((r) =>
        [
          r.date,
          `"${r.description.replace(/"/g, '""')}"`,
          (-Math.abs(r.amount || 0)).toFixed(2),
          `"${(r.category ?? "").replace(/"/g, '""')}"`,
        ].join(",")
      ),
    ];
    downloadTextFile("receipt-expenses.csv", lines.join("\n"), "text/csv");
  }

  async function downloadQbo() {
    setDlBusy(true);
    setGate(null);
    try {
      await downloadFromApi("/api/tools/receipt-download", { transactions: rows }, "receipt-expenses.qbo");
    } catch (e) {
      const g = (e as Error & { gate?: string }).gate;
      if ((e as Error & { code?: string }).code === SIGNUP_REQUIRED_CODE) forceWall();
      else if (g === "login" || g === "upgrade") setGate(g);
      else setError(e instanceof Error ? e.message : "Download failed.");
    } finally {
      setDlBusy(false);
    }
  }

  if (authed === false) return <ToolAuthWall path="/tools/free-receipt-to-quickbooks" />;

  return (
    <div>
      <ToolUpload
        accept=".jpg,.jpeg,.png,.webp,.pdf"
        busy={busy}
        busyText="Reading your receipt…"
        title={fileName ?? "Drop a receipt photo or PDF here"}
        meta={["JPG · PNG · WebP · PDF", "Max 10 MB"]}
        activeTitle="Release to read"
        onFile={(f) => void handleFile(f)}
      />

      {error && (
        <p className="mt-4 rounded-xl border border-red-200 bg-red-50 dark:bg-red-900/20 dark:border-red-800 px-4 py-3 text-sm text-red-700 dark:text-red-300">
          {error}
        </p>
      )}

      {result && (
        <div className="mt-8">
          <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-6 py-5">
            <p className="font-bold text-zinc-900 dark:text-white flex items-center gap-2">
              <Receipt className="h-5 w-5 text-blue-600" />
              {result.vendor || "Receipt"}
            </p>
            <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-300">
              {result.date || "Date not detected"} · {rows.length} line{rows.length === 1 ? "" : "s"} ·
              Total {usd(total)}
            </p>
            <p className="mt-2 text-xs text-amber-700 dark:text-amber-300 flex items-start gap-1.5">
              <AlertTriangle className="h-3.5 w-3.5 shrink-0 mt-0.5" />
              AI reading can misread handwriting, faded print, or folded receipts. Check every line
              below before importing — you can edit anything.
            </p>
          </div>

          {/* Editable rows */}
          <div className="mt-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs text-zinc-500 bg-zinc-50 dark:bg-zinc-900/60">
                  <th className="px-4 py-2.5 font-semibold">Date</th>
                  <th className="px-4 py-2.5 font-semibold">Description</th>
                  <th className="px-4 py-2.5 font-semibold text-right">Amount</th>
                  <th className="px-4 py-2.5 font-semibold">Category</th>
                  <th className="px-4 py-2.5 w-10" />
                </tr>
              </thead>
              <tbody>
                {rows.map((r, i) => (
                  <tr key={i} className="border-t border-zinc-100 dark:border-zinc-800">
                    <td className="px-4 py-2">
                      <input
                        type="date"
                        value={r.date}
                        onChange={(e) => updateRow(i, { date: e.target.value })}
                        className="w-full rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-2 py-1.5 text-zinc-900 dark:text-white"
                      />
                    </td>
                    <td className="px-4 py-2">
                      <input
                        value={r.description}
                        onChange={(e) => updateRow(i, { description: e.target.value })}
                        className="w-full rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-2 py-1.5 text-zinc-900 dark:text-white"
                      />
                    </td>
                    <td className="px-4 py-2">
                      <input
                        type="number"
                        step="0.01"
                        value={r.amount}
                        onChange={(e) => updateRow(i, { amount: parseFloat(e.target.value) || 0 })}
                        className="w-full rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-2 py-1.5 text-right font-mono text-zinc-900 dark:text-white"
                      />
                    </td>
                    <td className="px-4 py-2">
                      <select
                        value={r.category ?? "Other"}
                        onChange={(e) => updateRow(i, { category: e.target.value })}
                        className="w-full rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-2 py-1.5 text-zinc-900 dark:text-white"
                      >
                        {CATEGORIES.map((c) => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </select>
                    </td>
                    <td className="px-4 py-2">
                      <button
                        onClick={() => removeRow(i)}
                        aria-label="Remove line"
                        className="text-zinc-400 hover:text-red-500"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="px-4 py-3 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
              <button
                onClick={addRow}
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-600 dark:text-blue-400 hover:underline"
              >
                <Plus className="h-4 w-4" /> Add a line
              </button>
              <p className="text-sm font-bold text-zinc-900 dark:text-white">
                Total: <span className="font-mono">{usd(total)}</span>
              </p>
            </div>
          </div>

          {/* Downloads */}
          <div className="mt-5 flex flex-wrap gap-3">
            <button
              onClick={downloadCsv}
              className="inline-flex items-center gap-2 bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-white font-semibold px-5 py-2.5 rounded-lg hover:border-blue-400"
            >
              <Download className="h-4 w-4" /> Download CSV (free)
            </button>
            <button
              onClick={() => void downloadQbo()}
              disabled={dlBusy || rows.length === 0}
              className="inline-flex items-center gap-2 bg-blue-600 text-white font-semibold px-5 py-2.5 rounded-lg hover:bg-blue-700 disabled:opacity-60"
            >
              <Lock className="h-4 w-4" /> {dlBusy ? "Preparing…" : "Download .QBO (Pro)"}
            </button>
          </div>
          {gate && (
            <div className="mt-4">
              <QboGateNotice gate={gate} />
            </div>
          )}
          <p className="mt-3 text-xs text-zinc-400">
            The QBO carries each line as an expense transaction with a unique ID, dated and
            categorized as shown above. Import it into QuickBooks like any bank file, then
            reconcile against the receipt total.
          </p>
        </div>
      )}
    </div>
  );
}
