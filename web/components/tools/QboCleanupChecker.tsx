"use client";

import { useState } from "react";
import Link from "next/link";
import {
  FileCheck2, AlertTriangle, XCircle, CheckCircle2, ArrowRight,
  Download, Printer, Sparkles,
} from "lucide-react";
import { ToolUpload, QboGateNotice, usd, downloadTextFile, downloadFileFromApi } from "./tool-shared";

interface CleanupRow {
  index: number; date: string; name: string; amount: number;
  fitid: string | null; balance: number | null; cleared: string | null;
}
interface DuplicateGroup {
  kind: "exact-fitid" | "exact-match" | "near-match";
  rows: CleanupRow[]; note: string;
}
interface Analysis {
  source: "ofx" | "csv";
  transactionCount: number;
  creditsTotal: number; debitsTotal: number; netChange: number;
  duplicateGroups: DuplicateGroup[];
  duplicateInstances: number;
  errorCount: number; warningCount: number;
  healthScore: number;
  issues: { level: "error" | "warning"; message: string }[];
  balanceChecked: boolean; balanceOk: boolean | null;
  staleUncleared: number;
  ledgerBalance: number | null; periodStart: string | null; periodEnd: string | null;
  rows: CleanupRow[];
}

const KIND_LABEL: Record<DuplicateGroup["kind"], string> = {
  "exact-fitid": "Exact duplicates — repeated transaction ID",
  "exact-match": "Exact duplicates — identical date, amount, payee",
  "near-match": "Possible duplicates — please review",
};

function scoreColor(score: number) {
  if (score >= 90) return "text-pine-600 dark:text-pine-400";
  if (score >= 70) return "text-amber-600 dark:text-amber-400";
  return "text-red-600 dark:text-red-400";
}

export function QboCleanupChecker() {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState<Analysis | null>(null);
  const [dlBusy, setDlBusy] = useState(false);
  const [gate, setGate] = useState<string | null>(null);

  async function handleFile(f: File) {
    setBusy(true);
    setError(null);
    setResult(null);
    setGate(null);
    setFile(f);
    setFileName(f.name);
    try {
      const fd = new FormData();
      fd.append("file", f);
      const res = await fetch("/api/tools/qbo-cleanup-check", { method: "POST", body: fd });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data.error ?? "Could not check that file.");
      }
      setResult(data.analysis as Analysis);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not check that file.");
    } finally {
      setBusy(false);
    }
  }

  function downloadCsvReport() {
    if (!result) return;
    const lines = [
      `Cleanup report,${fileName ?? ""},Health score,${result.healthScore}`,
      "Date,Payee,Amount,FITID,Flag",
      ...result.rows.map((r) => {
        const g = result.duplicateGroups.find((gg) => gg.rows.some((x) => x.index === r.index));
        return [
          r.date,
          `"${r.name.replace(/"/g, '""')}"`,
          r.amount.toFixed(2),
          r.fitid ?? "",
          g ? KIND_LABEL[g.kind] : "",
        ].join(",");
      }),
    ];
    downloadTextFile(`${(fileName ?? "cleanup").replace(/\.[^.]+$/, "")}-report.csv`, lines.join("\n"), "text/csv");
  }

  async function downloadCleanedQbo() {
    if (!file) return;
    setDlBusy(true);
    setGate(null);
    try {
      const removed = await downloadFileFromApi(
        "/api/tools/qbo-cleanup-download",
        file,
        file.name.replace(/\.[^.]+$/, "") + "-cleaned.qbo"
      );
      void removed;
    } catch (e) {
      const g = (e as Error & { gate?: string; code?: string }).gate;
      if (g === "login" || g === "upgrade") {
        setGate(g);
      } else {
        setError(e instanceof Error ? e.message : "Download failed.");
      }
    } finally {
      setDlBusy(false);
    }
  }

  const errors = result?.issues.filter((i) => i.level === "error") ?? [];
  const warnings = result?.issues.filter((i) => i.level === "warning") ?? [];

  return (
    <div>
      <ToolUpload
        accept=".qbo,.ofx,.qfx,.csv"
        busy={busy}
        busyText="Checking your file…"
        title={fileName ?? "Drop a .qbo, .ofx, .qfx or .csv file here"}
        meta={["QBO · OFX · QFX · CSV", "Max 10 MB"]}
        activeTitle="Release to check"
        onFile={(f) => void handleFile(f)}
      />

      {error && (
        <p className="mt-4 rounded-xl border border-red-200 bg-red-50 dark:bg-red-900/20 dark:border-red-800 px-4 py-3 text-sm text-red-700 dark:text-red-300">
          {error}
        </p>
      )}

      {result && (
        <div className="mt-8">
          {/* Health score */}
          <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-6 py-5 flex items-center gap-6">
            <div className="text-center shrink-0">
              <p className={`text-5xl font-extrabold ${scoreColor(result.healthScore)}`}>
                {result.healthScore}
              </p>
              <p className="text-xs text-zinc-500 mt-1">Health score</p>
            </div>
            <div className="text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed">
              <p className="font-bold text-zinc-900 dark:text-white flex items-center gap-2">
                <FileCheck2 className="h-5 w-5 text-pine-600" />
                {result.transactionCount} transactions analyzed
              </p>
              <p className="mt-1">
                {result.duplicateInstances > 0
                  ? `${result.duplicateInstances} duplicate instance${result.duplicateInstances > 1 ? "s" : ""} found`
                  : "No duplicates found"}
                {" · "}
                {errors.length} error{errors.length === 1 ? "" : "s"}
                {" · "}
                {warnings.length} warning{warnings.length === 1 ? "" : "s"}
              </p>
              <p className="mt-1">
                In {usd(result.creditsTotal)} · Out {usd(Math.abs(result.debitsTotal))} · Net {usd(result.netChange)}
              </p>
              {result.balanceChecked && (
                <p className="mt-1">
                  Balance chain:{" "}
                  {result.balanceOk ? (
                    <span className="text-pine-600 dark:text-pine-400 font-semibold">holds</span>
                  ) : (
                    <span className="text-red-600 dark:text-red-400 font-semibold">breaks — review before import</span>
                  )}
                </p>
              )}
            </div>
          </div>

          {/* Duplicate groups */}
          {result.duplicateGroups.length > 0 && (
            <div className="mt-6">
              <h3 className="font-bold text-zinc-900 dark:text-white text-lg">Duplicates found</h3>
              {result.duplicateGroups.map((g, gi) => (
                <div key={gi} className="mt-3 rounded-2xl border border-amber-200 dark:border-amber-800 bg-amber-50/60 dark:bg-amber-900/10 overflow-hidden">
                  <div className="px-5 py-3 flex items-start gap-2">
                    <AlertTriangle className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold text-zinc-900 dark:text-white text-sm">{KIND_LABEL[g.kind]}</p>
                      <p className="text-sm text-zinc-600 dark:text-zinc-300 mt-0.5">{g.note}</p>
                    </div>
                  </div>
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-left text-xs text-zinc-500 border-t border-amber-200 dark:border-amber-800">
                        <th className="px-5 py-2 font-semibold">Date</th>
                        <th className="px-3 py-2 font-semibold">Payee</th>
                        <th className="px-3 py-2 font-semibold text-right">Amount</th>
                        <th className="px-5 py-2 font-semibold">Transaction ID</th>
                      </tr>
                    </thead>
                    <tbody>
                      {g.rows.map((r) => (
                        <tr key={r.index} className="border-t border-amber-100 dark:border-amber-900/50 text-zinc-700 dark:text-zinc-300">
                          <td className="px-5 py-1.5">{r.date || "—"}</td>
                          <td className="px-3 py-1.5">{r.name || "—"}</td>
                          <td className="px-3 py-1.5 text-right font-mono">{usd(r.amount)}</td>
                          <td className="px-5 py-1.5 font-mono text-xs">{r.fitid ?? "none"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ))}
            </div>
          )}

          {/* Issues */}
          {result.issues.length > 0 && (
            <div className="mt-6">
              <h3 className="font-bold text-zinc-900 dark:text-white text-lg">All findings</h3>
              <ul className="mt-3 space-y-2">
                {result.issues.map((i, n) => (
                  <li
                    key={n}
                    className={`flex items-start gap-2.5 rounded-xl border px-4 py-3 text-sm ${
                      i.level === "error"
                        ? "border-red-200 bg-red-50 dark:bg-red-900/20 dark:border-red-800 text-red-800 dark:text-red-200"
                        : "border-amber-200 bg-amber-50 dark:bg-amber-900/20 dark:border-amber-800 text-amber-800 dark:text-amber-200"
                    }`}
                  >
                    {i.level === "error" ? (
                      <XCircle className="h-4 w-4 shrink-0 mt-0.5" />
                    ) : (
                      <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
                    )}
                    <span>{i.message}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {result.issues.length === 0 && (
            <div className="mt-6 rounded-2xl border border-pine-200 bg-pine-50 dark:bg-pine-900/20 dark:border-pine-800 px-5 py-4 flex items-start gap-3">
              <CheckCircle2 className="h-6 w-6 text-pine-500 shrink-0" />
              <p className="text-sm text-zinc-700 dark:text-zinc-200">
                Clean file — no duplicates, no structural issues, and every transaction carries a
                unique ID. Safe to import.
              </p>
            </div>
          )}

          {/* Actions */}
          <div className="mt-6 flex flex-wrap gap-3">
            <button
              onClick={downloadCsvReport}
              className="inline-flex items-center gap-2 bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-white font-semibold px-5 py-2.5 rounded-lg hover:border-pine-400"
            >
              <Download className="h-4 w-4" /> Download report (CSV)
            </button>
            <button
              onClick={() => window.print()}
              className="inline-flex items-center gap-2 bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-white font-semibold px-5 py-2.5 rounded-lg hover:border-pine-400"
            >
              <Printer className="h-4 w-4" /> Print summary
            </button>
            <button
              onClick={() => void downloadCleanedQbo()}
              disabled={dlBusy}
              className="inline-flex items-center gap-2 bg-pine-600 text-white font-semibold px-5 py-2.5 rounded-lg hover:bg-pine-700 disabled:opacity-60"
            >
              <Sparkles className="h-4 w-4" />
              {dlBusy ? "Preparing…" : "Download Cleaned QBO (Pro)"}
            </button>
          </div>
          {gate && (
            <div className="mt-4">
              <QboGateNotice gate={gate} />
            </div>
          )}
          <p className="mt-3 text-xs text-zinc-400">
            The cleaned file drops exact duplicates, regenerates missing or repeated transaction
            IDs, and keeps near-matches for your review — the same format our converter exports,
            balance-ready. If QuickBooks still refuses a file, the{" "}
            <Link href="/tools/qbo-import-errors" className="text-pine-600 dark:text-pine-400 font-semibold hover:underline">import-error decoder</Link>{" "}
            explains each error and its fix.
          </p>

          {/* Cleanup upsell */}
          <div className="mt-8 relative overflow-hidden p-8 rounded-xl bg-zinc-900 text-white">
            <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[500px] h-[200px] opacity-25 bg-pine-500 rounded-full blur-[100px] pointer-events-none" />
            <div className="relative">
              <h3 className="font-bold text-lg">Found a real mess? That&apos;s a cleanup, not a download.</h3>
              <p className="text-zinc-400 text-sm mt-2 max-w-xl">
                If months of duplicates and unreconciled accounts are hiding behind this file, a
                cleaned QBO is only step one. We do full QuickBooks cleanups — statements imported
                in order, everything categorized consistently, each month re-reconciled. Free
                assessment, fixed quote before anything starts.
              </p>
              <Link
                href="/contact"
                className="mt-4 inline-flex items-center gap-2 bg-white text-zinc-900 font-semibold px-5 py-2 rounded-lg hover:bg-zinc-200 transition-colors"
              >
                Get a free cleanup assessment <ArrowRight className="h-4 w-4" />
              </Link>
              <p className="mt-2 text-xs text-zinc-500">
                Mention the subject line “QuickBooks Cleanup” and how many months and accounts you have.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
