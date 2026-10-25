"use client";

import { useState } from "react";
import Link from "next/link";
import { AlertTriangle, CheckCircle2, Download, Lock, Search } from "lucide-react";
import { ToolUpload, QboGateNotice, usd, downloadTextFile, downloadFromApi } from "./tool-shared";
import type { ReconEntry, ReconResult } from "@/lib/tools/reconciliation";

interface Result extends ReconResult {
  csv: string;
}

const KIND_LABEL: Record<ReconEntry["kind"], string> = {
  matched: "Matched",
  missing: "Missing from QuickBooks",
  extra: "Extra in QuickBooks",
  "amount-mismatch": "Amount mismatch",
  "date-drift": "Date drift (probably fine)",
};

function FindingRow({ e }: { e: ReconEntry }) {
  const s = e.statement;
  const q = e.quickbooks;
  return (
    <tr className="border-b border-zinc-100 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300">
      <td className="px-3 py-2 text-xs font-semibold whitespace-nowrap">{KIND_LABEL[e.kind]}</td>
      <td className="px-3 py-2 text-sm">{s ? `${s.date} · ${s.name}` : "—"}</td>
      <td className="px-3 py-2 text-right font-mono text-sm">{s ? usd(s.amount) : "—"}</td>
      <td className="px-3 py-2 text-sm">{q ? `${q.date} · ${q.name}` : "—"}</td>
      <td className="px-3 py-2 text-right font-mono text-sm">{q ? usd(q.amount) : "—"}</td>
    </tr>
  );
}

export function ReconciliationFinder() {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [statementFile, setStatementFile] = useState<File | null>(null);
  const [qboFile, setQboFile] = useState<File | null>(null);
  const [result, setResult] = useState<Result | null>(null);
  const [filter, setFilter] = useState<string>("all");
  const [dlBusy, setDlBusy] = useState(false);
  const [gate, setGate] = useState<string | null>(null);

  async function compare() {
    if (!statementFile || !qboFile) return;
    setBusy(true);
    setError(null);
    setResult(null);
    setGate(null);
    try {
      const fd = new FormData();
      fd.append("statement", statementFile);
      fd.append("quickbooks", qboFile);
      const res = await fetch("/api/tools/reconciliation", { method: "POST", body: fd });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error ?? "Could not compare those files.");
      setResult(data as Result);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not compare those files.");
    } finally {
      setBusy(false);
    }
  }

  function downloadCsv() {
    if (!result) return;
    downloadTextFile("reconciliation-differences.csv", result.csv, "text/csv");
  }

  async function downloadQbo() {
    if (!result) return;
    setDlBusy(true);
    setGate(null);
    try {
      await downloadFromApi("/api/tools/reconciliation-download", { entries: result.entries }, "reconciled-matched.qbo");
    } catch (e) {
      const g = (e as Error & { gate?: string }).gate;
      if (g === "login" || g === "upgrade") setGate(g);
      else setError(e instanceof Error ? e.message : "Download failed.");
    } finally {
      setDlBusy(false);
    }
  }

  const shown = result
    ? filter === "all"
      ? result.entries
      : result.entries.filter((e) => e.kind === filter)
    : [];

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <p className="text-sm font-semibold text-zinc-900 dark:text-white mb-2">1 · Bank statement export</p>
          <ToolUpload
            accept=".csv,.qbo,.ofx,.qfx"
            busy={false}
            busyText=""
            title={statementFile?.name ?? "Drop the statement file here"}
            meta={["CSV · QBO · OFX", "Max 10 MB"]}
            activeTitle="Release to add"
            onFile={(f) => setStatementFile(f)}
          />
        </div>
        <div>
          <p className="text-sm font-semibold text-zinc-900 dark:text-white mb-2">2 · QuickBooks export</p>
          <ToolUpload
            accept=".csv,.qbo,.ofx,.qfx"
            busy={false}
            busyText=""
            title={qboFile?.name ?? "Drop the QuickBooks file here"}
            meta={["CSV · QBO · OFX", "Max 10 MB"]}
            activeTitle="Release to add"
            onFile={(f) => setQboFile(f)}
          />
        </div>
      </div>

      <button
        onClick={() => void compare()}
        disabled={busy || !statementFile || !qboFile}
        className="mt-5 inline-flex items-center gap-2 bg-blue-600 text-white font-semibold px-6 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-60"
      >
        <Search className="h-4 w-4" /> {busy ? "Comparing…" : "Find the differences"}
      </button>
      {(!statementFile || !qboFile) && (
        <p className="mt-2 text-xs text-zinc-500">Upload both files first — the statement on the left, the QuickBooks export on the right.</p>
      )}

      {error && (
        <p className="mt-4 rounded-xl border border-red-200 bg-red-50 dark:bg-red-900/20 dark:border-red-800 px-4 py-3 text-sm text-red-700 dark:text-red-300">
          {error}
        </p>
      )}

      {result && (
        <div className="mt-8">
          {result.warnings.map((w, i) => (
            <div key={i} className="mb-3 rounded-xl border border-amber-200 bg-amber-50 dark:bg-amber-900/20 dark:border-amber-800 px-4 py-3 text-sm text-amber-800 dark:text-amber-200 flex items-start gap-2">
              <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" /> <span>{w}</span>
            </div>
          ))}

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { label: "Matched", value: String(result.matchedCount) },
              { label: "Missing from QuickBooks", value: String(result.missingCount) },
              { label: "Extra in QuickBooks", value: String(result.extraCount) },
              { label: "Amount mismatches", value: String(result.amountMismatchCount) },
            ].map((s) => (
              <div key={s.label} className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4">
                <p className="text-xs font-semibold uppercase tracking-wider text-zinc-400">{s.label}</p>
                <p className="mt-1.5 font-bold text-zinc-900 dark:text-white text-xl leading-snug">{s.value}</p>
              </div>
            ))}
          </div>
          <p className="mt-3 text-sm text-zinc-500 dark:text-zinc-400">
            Statement: {result.statementCount} rows · {usd(result.statementNet)} · QuickBooks: {result.quickbooksCount} rows · {usd(result.quickbooksNet)} · Difference: {usd(result.difference)}
            {result.dateDriftCount > 0 ? ` · ${result.dateDriftCount} date-drift entries (usually posting vs cleared dates, not real differences)` : ""}
          </p>

          {result.difference === 0 && result.missingCount === 0 && result.extraCount === 0 && result.amountMismatchCount === 0 && (
            <div className="mt-4 rounded-2xl border border-emerald-200 bg-emerald-50 dark:bg-emerald-900/20 dark:border-emerald-800 px-5 py-4 flex items-start gap-3">
              <CheckCircle2 className="h-6 w-6 text-emerald-500 shrink-0" />
              <p className="text-sm text-zinc-700 dark:text-zinc-200">
                Fully reconciled — every statement row has a matching QuickBooks entry and the totals agree.
              </p>
            </div>
          )}

          <div className="mt-6 flex flex-wrap gap-2">
            {["all", "missing", "extra", "amount-mismatch", "date-drift", "matched"].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold border ${filter === f ? "bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 border-zinc-900" : "border-zinc-300 dark:border-zinc-700 text-zinc-600 dark:text-zinc-300"}`}
              >
                {f === "all" ? `All (${result.entries.length})` : `${KIND_LABEL[f as ReconEntry["kind"]]} (${result.entries.filter((e) => e.kind === f).length})`}
              </button>
            ))}
          </div>

          <div className="mt-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden overflow-x-auto">
            <table className="w-full text-sm min-w-[640px]">
              <thead>
                <tr className="text-left text-xs text-zinc-500 bg-zinc-50 dark:bg-zinc-900/60 border-b border-zinc-200 dark:border-zinc-800">
                  <th className="px-3 py-2 font-semibold">Finding</th>
                  <th className="px-3 py-2 font-semibold">Statement</th>
                  <th className="px-3 py-2 font-semibold text-right">Amount</th>
                  <th className="px-3 py-2 font-semibold">QuickBooks</th>
                  <th className="px-3 py-2 font-semibold text-right">Amount</th>
                </tr>
              </thead>
              <tbody>
                {shown.slice(0, 200).map((e, i) => (
                  <FindingRow key={i} e={e} />
                ))}
              </tbody>
            </table>
            {shown.length > 200 && (
              <p className="px-5 py-2 text-xs text-zinc-500">Showing the first 200 of {shown.length} findings — the full list is in the CSV report below.</p>
            )}
            {shown.length === 0 && (
              <p className="px-5 py-4 text-sm text-zinc-500">No findings in this category.</p>
            )}
          </div>

          <div className="mt-5 flex flex-wrap gap-3">
            <button
              onClick={downloadCsv}
              className="inline-flex items-center gap-2 bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-white font-semibold px-5 py-2.5 rounded-lg hover:border-blue-400"
            >
              <Download className="h-4 w-4" /> Download differences (CSV, free)
            </button>
            <button
              onClick={() => void downloadQbo()}
              disabled={dlBusy}
              className="inline-flex items-center gap-2 bg-blue-600 text-white font-semibold px-5 py-2.5 rounded-lg hover:bg-blue-700 disabled:opacity-60"
            >
              <Lock className="h-4 w-4" /> {dlBusy ? "Preparing…" : "Download matched-only .QBO (Pro)"}
            </button>
          </div>
          {gate && (
            <div className="mt-4">
              <QboGateNotice gate={gate} />
            </div>
          )}
          <p className="mt-3 text-xs text-zinc-400">
            The matched-only QBO contains only entries that agreed on both sides, with fresh transaction IDs — import it into a clean account rather than re-importing the whole month. Still stuck? The{" "}
            <Link href="/tools/qbo-import-errors" className="text-blue-600 dark:text-blue-400 font-semibold hover:underline">import-error decoder</Link>{" "}
            explains the errors QuickBooks shows when a file will not import at all.
          </p>
        </div>
      )}
    </div>
  );
}
