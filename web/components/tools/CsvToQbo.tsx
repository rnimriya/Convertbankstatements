"use client";

import { useState } from "react";
import Link from "next/link";
import { AlertTriangle, CheckCircle2, Download, Lock } from "lucide-react";
import { ToolUpload, QboGateNotice, usd, downloadTextFile, downloadFromApi } from "./tool-shared";
import { SampleDownloads } from "./SampleDownloads";
import type { CsvMapping, GenericRow } from "@/lib/tools/csv-to-qbo";

interface Result {
  headers: string[];
  mapping: CsvMapping;
  rows: GenericRow[];
  warnings: string[];
  csv: string;
  balanceChecked: boolean;
  balanceOk: boolean | null;
}

const FIELDS: { key: keyof CsvMapping; label: string; required?: boolean }[] = [
  { key: "date", label: "Date column", required: true },
  { key: "payee", label: "Payee / description column", required: true },
  { key: "amount", label: "Amount column (signed)" },
  { key: "debit", label: "Debit (money out) column" },
  { key: "credit", label: "Credit (money in) column" },
  { key: "memo", label: "Memo column (optional)" },
  { key: "balance", label: "Running balance column (optional)" },
];

export function CsvToQbo() {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [result, setResult] = useState<Result | null>(null);
  const [mapping, setMapping] = useState<CsvMapping | null>(null);
  const [dlBusy, setDlBusy] = useState(false);
  const [gate, setGate] = useState<string | null>(null);

  async function runConvert(file: File, map: CsvMapping | null) {
    setBusy(true);
    setError(null);
    setGate(null);
    try {
      const fd = new FormData();
      fd.append("file", file);
      if (map) fd.append("mapping", JSON.stringify(map));
      const res = await fetch("/api/tools/csv-convert", { method: "POST", body: fd });
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
    await runConvert(f, null);
  }

  // Mapping edits re-run the conversion in memory from the file already
  // uploaded in this browser tab. Nothing is stored on the server.
  async function remap(next: CsvMapping) {
    if (!file) return;
    await runConvert(file, next);
  }

  function downloadCsv() {
    if (!result) return;
    downloadTextFile("transactions.csv", result.csv, "text/csv");
  }

  async function downloadQbo() {
    if (!result) return;
    setDlBusy(true);
    setGate(null);
    try {
      await downloadFromApi("/api/tools/csv-download", { rows: result.rows }, "transactions.qbo");
    } catch (e) {
      const g = (e as Error & { gate?: string }).gate;
      if (g === "login" || g === "upgrade") setGate(g);
      else setError(e instanceof Error ? e.message : "Download failed.");
    } finally {
      setDlBusy(false);
    }
  }

  function setField(key: keyof CsvMapping, value: string) {
    if (!mapping) return;
    const next = { ...mapping, [key]: value === "" ? -1 : Number(value) };
    setMapping(next);
    void remap(next);
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
        <p className="mt-4 rounded-xl border border-red-200 bg-red-50 dark:bg-red-900/20 dark:border-red-800 px-4 py-3 text-sm text-red-700 dark:text-red-300">
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

          {result.warnings.map((w, i) => (
            <div key={i} className="mt-3 rounded-xl border border-amber-200 bg-amber-50 dark:bg-amber-900/20 dark:border-amber-800 px-4 py-3 text-sm text-amber-800 dark:text-amber-200 flex items-start gap-2">
              <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" /> <span>{w}</span>
            </div>
          ))}

          <div className="mt-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden">
            <div className="px-5 py-3 bg-zinc-50 dark:bg-zinc-900/60 border-b border-zinc-200 dark:border-zinc-800 flex flex-wrap items-center gap-x-4 gap-y-1">
              <p className="font-bold text-zinc-900 dark:text-white">{result.rows.length} transactions parsed</p>
              {result.balanceChecked && (
                <span className={`text-xs font-semibold ${result.balanceOk ? "text-pine-700 dark:text-pine-300" : "text-red-700 dark:text-red-300"}`}>
                  {result.balanceOk ? (
                    <span className="inline-flex items-center gap-1"><CheckCircle2 className="h-3.5 w-3.5" /> Balance chain holds</span>
                  ) : (
                    "Balance chain breaks — review before importing"
                  )}
                </span>
              )}
              <Link href="/tools/qbo-import-errors" className="ml-auto text-xs font-semibold text-pine-600 dark:text-pine-400 hover:underline">
                QBO import errors, explained →
              </Link>
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
              <p className="px-5 py-2 text-xs text-zinc-500">Showing the first 50 of {result.rows.length} rows — the full file is in the downloads below.</p>
            )}
          </div>

          <div className="mt-5 flex flex-wrap gap-3">
            <button
              onClick={downloadCsv}
              className="inline-flex items-center gap-2 bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-white font-semibold px-5 py-2.5 rounded-lg hover:border-pine-400"
            >
              <Download className="h-4 w-4" /> Download CSV (free)
            </button>
            <button
              onClick={() => void downloadQbo()}
              disabled={dlBusy}
              className="inline-flex items-center gap-2 bg-pine-600 text-white font-semibold px-5 py-2.5 rounded-lg hover:bg-pine-700 disabled:opacity-60"
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
            The QBO uses a unique transaction ID per row, derived from the row itself — re-importing the same file will not create duplicates in QuickBooks.
          </p>
        </div>
      )}
    </div>
  );
}
