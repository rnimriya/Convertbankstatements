"use client";

import { useMemo, useState } from "react";
import { Download } from "lucide-react";
import { ToolUpload, usd, downloadTextFile } from "./tool-shared";

interface VendorGroup {
  vendor: string;
  total: number;
  count: number;
  lastDate: string;
}

interface Result {
  success: boolean;
  sourceKind: "csv" | "qbo";
  vendors: VendorGroup[];
  vendorCount: number;
  totalPaid: number;
}

const DISCLAIMER =
  "Informational report only — this is not tax filing or tax advice. Thresholds and rules have exceptions (for example, payments to corporations and payments made by card are often treated differently). Confirm your filing obligations with your tax professional.";

// The vendor report CSV is generated inline here instead of importing
// vendorReportCsv from the lib: the lib also pulls in the CSV/QBO parsers,
// and keeping that chain out of this client bundle keeps the page light.
// The logic mirrors vendorReportCsv in lib/tools/vendor-1099.ts exactly.
function reportCsv(groups: VendorGroup[], threshold: number): string {
  const esc = (v: string) => (/[",\n\r]/.test(v) ? `"${v.replace(/"/g, '""')}"` : v);
  return [
    "Vendor,Total Paid,Transactions,Last Payment,At or Above Threshold",
    ...groups.map((g) =>
      [esc(g.vendor), g.total.toFixed(2), String(g.count), esc(g.lastDate), g.total >= threshold ? "Yes" : "No"].join(",")
    ),
  ].join("\n");
}

export function VendorChecker1099() {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [result, setResult] = useState<Result | null>(null);
  const [threshold, setThreshold] = useState(600);

  async function handleFile(f: File) {
    setBusy(true);
    setError(null);
    setResult(null);
    setFileName(f.name);
    try {
      const fd = new FormData();
      fd.append("file", f);
      const res = await fetch("/api/tools/1099-check", { method: "POST", body: fd });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error ?? "Could not read that file.");
      setResult(data as Result);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not read that file.");
    } finally {
      setBusy(false);
    }
  }

  const atOrAbove = useMemo(
    () => (result ? result.vendors.filter((v) => v.total >= threshold).length : 0),
    [result, threshold]
  );

  function downloadReport() {
    if (!result) return;
    downloadTextFile("vendor-1099-report.csv", reportCsv(result.vendors, threshold), "text/csv");
  }

  return (
    <div>
      <ToolUpload
        accept=".csv,.qbo,.ofx,.qfx"
        busy={busy}
        busyText="Grouping your vendor payments…"
        title={fileName ?? "Drop a bank CSV or QBO file here"}
        meta={["CSV or QBO / OFX", "Max 10 MB"]}
        activeTitle="Release to check"
        onFile={(f) => void handleFile(f)}
      />

      <div className="mt-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5">
        <label className="block text-sm">
          <span className="text-xs text-zinc-500">Threshold (USD) — vendors paid at or above this total are highlighted</span>
          <input
            type="number"
            min={0}
            step="1"
            value={Number.isNaN(threshold) ? "" : threshold}
            onChange={(e) => setThreshold(e.target.value === "" ? 0 : Number(e.target.value))}
            className="mt-1 w-full sm:w-56 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3 py-2 text-zinc-900 dark:text-white"
          />
        </label>
        <p className="mt-2 text-xs text-zinc-400">The default is $600. Change it to test any cutoff — the table and the report update right away.</p>
      </div>

      {error && (
        <p className="mt-4 rounded-[20px] border border-red-200 bg-red-50 dark:bg-red-900/20 dark:border-red-800 px-4 py-3 text-sm text-red-700 dark:text-red-300">
          {error}
        </p>
      )}

      {result && (
        <div className="mt-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4">
              <p className="text-2xl font-extrabold text-zinc-900 dark:text-white">{result.vendorCount}</p>
              <p className="text-xs text-zinc-500 mt-0.5">Vendors found</p>
            </div>
            <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4">
              <p className="text-2xl font-extrabold text-zinc-900 dark:text-white">{usd(result.totalPaid)}</p>
              <p className="text-xs text-zinc-500 mt-0.5">Total paid out</p>
            </div>
            <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4">
              <p className="text-2xl font-extrabold text-amber-600 dark:text-amber-400">{atOrAbove}</p>
              <p className="text-xs text-zinc-500 mt-0.5">Vendors at or above {usd(threshold)}</p>
            </div>
          </div>

          <div className="mt-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden">
            <div className="px-5 py-3 bg-zinc-50 dark:bg-zinc-900/60 border-b border-zinc-200 dark:border-zinc-800">
              <p className="font-bold text-zinc-900 dark:text-white">Payments by vendor ({result.sourceKind === "csv" ? "CSV" : "QBO"} file)</p>
              <p className="text-xs text-zinc-500 mt-0.5">Name variants are grouped together — for example, “ACME LLC” and “Acme, LLC” count as one vendor. Only money out is counted; deposits are ignored.</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-xs text-zinc-500 border-b border-zinc-200 dark:border-zinc-800">
                    <th className="px-5 py-2 font-semibold">Vendor</th>
                    <th className="px-3 py-2 font-semibold text-right">Total paid</th>
                    <th className="px-3 py-2 font-semibold text-right">Transactions</th>
                    <th className="px-3 py-2 font-semibold">Last payment</th>
                    <th className="px-3 py-2 font-semibold">Threshold</th>
                  </tr>
                </thead>
                <tbody>
                  {result.vendors.map((v) => {
                    const hit = v.total >= threshold;
                    return (
                      <tr key={v.vendor} className={`border-b border-zinc-100 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 ${hit ? "bg-amber-50 dark:bg-amber-900/10" : ""}`}>
                        <td className="px-5 py-2 font-medium text-zinc-900 dark:text-white">{v.vendor}</td>
                        <td className="px-3 py-2 text-right font-mono">{usd(v.total)}</td>
                        <td className="px-3 py-2 text-right">{v.count}</td>
                        <td className="px-3 py-2">{v.lastDate || "—"}</td>
                        <td className="px-3 py-2">
                          {hit ? (
                            <span className="inline-flex items-center rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-200 px-2.5 py-0.5 text-xs font-semibold">At/above {usd(threshold)}</span>
                          ) : (
                            <span className="text-xs text-zinc-400">Below</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            {result.vendors.length === 0 && (
              <p className="px-5 py-4 text-sm text-zinc-500">No outgoing payments were found in that file.</p>
            )}
          </div>

          <div className="mt-5 flex flex-wrap gap-3">
            <button
              onClick={downloadReport}
              disabled={result.vendors.length === 0}
              className="inline-flex items-center gap-2 bg-pine-600 text-white font-semibold px-5 py-2.5 rounded-lg hover:bg-pine-700 disabled:opacity-60"
            >
              <Download className="h-4 w-4" /> Download vendor report (free)
            </button>
          </div>
        </div>
      )}

      <div className="mt-6 rounded-[20px] border border-amber-200 bg-amber-50 dark:bg-amber-900/20 dark:border-amber-800 px-4 py-3 text-sm text-amber-800 dark:text-amber-200">
        {DISCLAIMER}
      </div>
    </div>
  );
}
