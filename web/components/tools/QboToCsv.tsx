"use client";

import { useState } from "react";
import { AlertTriangle, Download, XCircle } from "lucide-react";
import { ToolUpload, usd, downloadTextFile, downloadFromApi } from "./tool-shared";
import { SampleDownloads } from "./SampleDownloads";

interface QboRow {
  date: string;
  type: string;
  name: string;
  amount: number;
  fitid: string | null;
}

interface Summary {
  transactionCount: number;
  creditsTotal: number;
  debitsTotal: number;
  netChange: number;
  periodStart: string | null;
  periodEnd: string | null;
  currency: string | null;
  ledgerBalance: number | null;
}

interface Issue {
  level: "error" | "warning";
  message: string;
}

interface Result {
  fileName: string;
  summary: Summary;
  rows: QboRow[];
  csv: string;
  issues: Issue[];
}

export function QboToCsv() {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [result, setResult] = useState<Result | null>(null);
  const [dlBusy, setDlBusy] = useState(false);

  async function handleFile(f: File) {
    setBusy(true);
    setError(null);
    setResult(null);
    setFileName(f.name);
    try {
      const fd = new FormData();
      fd.append("file", f);
      const res = await fetch("/api/tools/qbo-to-csv", { method: "POST", body: fd });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error ?? "Could not convert that file.");
      setResult(data as Result);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not convert that file.");
    } finally {
      setBusy(false);
    }
  }

  function downloadCsv() {
    if (!result) return;
    downloadTextFile("transactions.csv", result.csv, "text/csv");
  }

  async function downloadExcel() {
    if (!result) return;
    setDlBusy(true);
    try {
      await downloadFromApi("/api/tools/qbo-to-xlsx", { rows: result.rows }, "transactions.xlsx");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Download failed.");
    } finally {
      setDlBusy(false);
    }
  }

  const { summary } = result ?? { summary: null };

  return (
    <div>
      <ToolUpload
        accept=".qbo,.ofx,.qfx"
        busy={busy}
        busyText="Converting your file…"
        title={fileName ?? "Drop a QBO, OFX or QFX file here"}
        meta={["QBO / OFX / QFX", "Max 10 MB"]}
        activeTitle="Release to convert"
        onFile={(f) => void handleFile(f)}
      />
      <div className="mt-4">
        <p className="text-xs text-zinc-500 mb-2">Try it without your own data first:</p>
        <SampleDownloads ids={["clean-qbo"]} />
      </div>

      {error && (
        <p className="mt-4 rounded-[20px] border border-red-200 bg-red-50 dark:bg-red-900/20 dark:border-red-800 px-4 py-3 text-sm text-red-700 dark:text-red-300">
          {error}
        </p>
      )}

      {result && summary && (
        <div className="mt-8">
          <p className="text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed">
            <strong className="text-zinc-900 dark:text-white">{summary.transactionCount} transactions</strong>
            {summary.periodStart && summary.periodEnd ? (
              <> · {summary.periodStart} → {summary.periodEnd}</>
            ) : null}
            {" "}· Money in {usd(summary.creditsTotal)} · Money out {usd(summary.debitsTotal)} · Net {usd(summary.netChange)}
            {summary.ledgerBalance != null ? <> · Ledger balance {usd(summary.ledgerBalance)}</> : null}
          </p>

          {result.issues.length > 0 && (
            <ul className="mt-4 space-y-3">
              {result.issues.map((issue, i) => (
                <li
                  key={i}
                  className={`flex items-start gap-2 rounded-[20px] border px-4 py-3 text-sm ${
                    issue.level === "error"
                      ? "border-red-200 bg-red-50 dark:bg-red-900/20 dark:border-red-800 text-red-800 dark:text-red-200"
                      : "border-amber-200 bg-amber-50 dark:bg-amber-900/20 dark:border-amber-800 text-amber-800 dark:text-amber-200"
                  }`}
                >
                  {issue.level === "error" ? (
                    <XCircle className="h-4 w-4 shrink-0 mt-0.5" />
                  ) : (
                    <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
                  )}
                  <span>{issue.message}</span>
                </li>
              ))}
            </ul>
          )}

          <div className="mt-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden">
            <div className="px-5 py-3 bg-zinc-50 dark:bg-zinc-900/60 border-b border-zinc-200 dark:border-zinc-800">
              <p className="font-bold text-zinc-900 dark:text-white text-sm">Preview — first 50 rows</p>
            </div>
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs text-zinc-500 border-b border-zinc-200 dark:border-zinc-800">
                  <th className="px-5 py-2 font-semibold">Date</th>
                  <th className="px-3 py-2 font-semibold">Type</th>
                  <th className="px-3 py-2 font-semibold">Description</th>
                  <th className="px-3 py-2 font-semibold text-right">Amount</th>
                </tr>
              </thead>
              <tbody>
                {result.rows.slice(0, 50).map((r, i) => (
                  <tr key={i} className="border-b border-zinc-100 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300">
                    <td className="px-5 py-1.5">{r.date}</td>
                    <td className="px-3 py-1.5">{r.type}</td>
                    <td className="px-3 py-1.5">{r.name}</td>
                    <td className="px-3 py-1.5 text-right font-mono">{usd(r.amount)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {result.rows.length > 50 && (
              <p className="px-5 py-2 text-xs text-zinc-500">Showing the first 50 of {result.rows.length} rows — the full file is in the downloads below.</p>
            )}
          </div>

          <div className="mt-5 flex flex-wrap gap-3">
            <button
              onClick={downloadCsv}
              className="inline-flex items-center gap-2 bg-pine-600 text-white font-semibold px-5 py-2.5 rounded-lg hover:bg-pine-700"
            >
              <Download className="h-4 w-4" /> Download CSV (free)
            </button>
            <button
              onClick={() => void downloadExcel()}
              disabled={dlBusy}
              className="inline-flex items-center gap-2 bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-white font-semibold px-5 py-2.5 rounded-lg hover:border-pine-400 disabled:opacity-60"
            >
              <Download className="h-4 w-4" /> {dlBusy ? "Preparing…" : "Download Excel (free)"}
            </button>
          </div>
          <p className="mt-3 text-xs text-zinc-400">
            Both downloads are fully free — no account, no plan. Amounts are copied exactly as they appear in your file; nothing is converted or rounded beyond cents.
          </p>
        </div>
      )}
    </div>
  );
}
