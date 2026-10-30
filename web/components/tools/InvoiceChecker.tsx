"use client";

import { useState } from "react";
import { AlertTriangle, CheckCircle2, Download, FileDown } from "lucide-react";
import { ToolUpload, usd, downloadTextFile } from "./tool-shared";
import type { InvoiceCheckResult } from "@/lib/tools/invoice-checker";

const SAMPLE_CSV = [
  "InvoiceNo,Customer,InvoiceDate,DueDate,Item,Qty,Rate,Amount",
  "INV-1001,Acme Corp,2026-01-15,2026-02-14,Consulting,1,1200,1200.00",
  'INV-1002,Beta LLC,01/20/2026,02/19/2026,Design work,1,1250,"$1,250.00"',
  "INV-1002,Beta LLC,01/21/2026,02/20/2026,Design work,1,300,300.00",
  "INV-1004,,01/22/2026,02/21/2026,Support,1,500,500.00",
  "INV-1005,Delta Co,01/23/2026,02/22/2026,Setup,2,150,",
].join("\n");

export function InvoiceChecker() {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [result, setResult] = useState<InvoiceCheckResult | null>(null);

  async function handleFile(f: File) {
    setBusy(true);
    setError(null);
    setResult(null);
    setFileName(f.name);
    try {
      const fd = new FormData();
      fd.append("file", f);
      const res = await fetch("/api/tools/invoice-check", { method: "POST", body: fd });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error ?? "Could not read that CSV.");
      setResult(data as InvoiceCheckResult);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not read that CSV.");
    } finally {
      setBusy(false);
    }
  }

  function downloadSample() {
    downloadTextFile("sample-invoices.csv", SAMPLE_CSV, "text/csv");
  }

  function downloadFixed() {
    if (!result) return;
    downloadTextFile("quickbooks-invoices.csv", result.fixedCsv, "text/csv");
  }

  const cleanRows = result?.summary.okRows ?? 0;

  return (
    <div>
      <ToolUpload
        accept=".csv"
        busy={busy}
        busyText="Checking your invoices…"
        title={fileName ?? "Drop an invoice CSV here"}
        meta={["CSV export", "Max 10 MB"]}
        activeTitle="Release to check"
        onFile={(f) => void handleFile(f)}
      />
      <div className="mt-4">
        <p className="text-xs text-zinc-500 mb-2">No file handy? Download a sample invoice CSV with a few planted issues, then drop it in above to see the checker work:</p>
        <button
          onClick={downloadSample}
          className="inline-flex items-center gap-2 bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-white font-semibold px-4 py-2 rounded-lg hover:border-pine-400 text-sm"
        >
          <FileDown className="h-4 w-4" /> Try a sample invoice CSV
        </button>
      </div>

      {error && (
        <p className="mt-4 rounded-[20px] border border-red-200 bg-red-50 dark:bg-red-900/20 dark:border-red-800 px-4 py-3 text-sm text-red-700 dark:text-red-300">
          {error}
        </p>
      )}

      {result && (
        <div className="mt-8">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4">
              <p className="text-2xl font-extrabold text-zinc-900 dark:text-white">{result.summary.totalRows}</p>
              <p className="text-xs text-zinc-500 mt-0.5">Invoice rows checked</p>
            </div>
            <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4">
              <p className="text-2xl font-extrabold text-pine-700 dark:text-pine-300">{result.summary.okRows}</p>
              <p className="text-xs text-zinc-500 mt-0.5">Ready to import</p>
            </div>
            <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4">
              <p className="text-2xl font-extrabold text-red-600 dark:text-red-400">{result.summary.errorRows}</p>
              <p className="text-xs text-zinc-500 mt-0.5">Rows with errors</p>
            </div>
            <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4">
              <p className="text-2xl font-extrabold text-amber-600 dark:text-amber-400">{result.summary.fixedRows}</p>
              <p className="text-xs text-zinc-500 mt-0.5">Rows auto-fixed</p>
            </div>
          </div>

          <div className="mt-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden">
            <div className="px-5 py-3 bg-zinc-50 dark:bg-zinc-900/60 border-b border-zinc-200 dark:border-zinc-800">
              <p className="font-bold text-zinc-900 dark:text-white">Row-by-row results</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-xs text-zinc-500 border-b border-zinc-200 dark:border-zinc-800">
                    <th className="px-5 py-2 font-semibold">Line</th>
                    <th className="px-3 py-2 font-semibold">Invoice No</th>
                    <th className="px-3 py-2 font-semibold">Customer</th>
                    <th className="px-3 py-2 font-semibold">Date</th>
                    <th className="px-3 py-2 font-semibold text-right">Amount</th>
                    <th className="px-3 py-2 font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {result.rows.map((r) => (
                    <tr key={r.line} className="border-b border-zinc-100 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 align-top">
                      <td className="px-5 py-2">{r.line}</td>
                      <td className="px-3 py-2">{r.values.invoiceNo || "—"}</td>
                      <td className="px-3 py-2">{r.values.customer || "—"}</td>
                      <td className="px-3 py-2">{r.values.date || "—"}</td>
                      <td className="px-3 py-2 text-right font-mono">{r.values.amount !== null ? usd(r.values.amount) : "—"}</td>
                      <td className="px-3 py-2">
                        {r.ok ? (
                          <span className="inline-flex items-center gap-1 text-pine-700 dark:text-pine-300 font-semibold text-xs"><CheckCircle2 className="h-3.5 w-3.5" /> OK</span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-red-700 dark:text-red-300 font-semibold text-xs"><AlertTriangle className="h-3.5 w-3.5" /> Error</span>
                        )}
                        {r.errors.map((e, i) => (
                          <p key={`e${i}`} className="text-xs text-red-600 dark:text-red-400 mt-1">{e}</p>
                        ))}
                        {r.fixes.map((f, i) => (
                          <p key={`f${i}`} className="text-xs text-amber-600 dark:text-amber-400 mt-1">Fixed: {f}</p>
                        ))}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="mt-5 flex flex-wrap gap-3">
            <button
              onClick={downloadFixed}
              disabled={cleanRows === 0}
              className="inline-flex items-center gap-2 bg-pine-600 text-white font-semibold px-5 py-2.5 rounded-lg hover:bg-pine-700 disabled:opacity-60"
            >
              <Download className="h-4 w-4" /> Download QuickBooks-ready CSV (free)
            </button>
          </div>
          <p className="mt-3 text-xs text-zinc-400">
            {cleanRows === 0
              ? "No clean rows yet — fix the errors above in your file and check it again."
              : "The download contains only the rows with no errors, with every fix applied, in the column layout QuickBooks Online's invoice import accepts. Rows with errors stay out so a bad row cannot fail the whole import."}
          </p>
        </div>
      )}
    </div>
  );
}
