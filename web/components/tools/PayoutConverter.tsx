"use client";

import { useState } from "react";
import { CheckCircle2, AlertTriangle, Download, Lock } from "lucide-react";
import { ToolUpload, QboGateNotice, usd, downloadTextFile, downloadFromApi } from "./tool-shared";
import { SampleDownloads } from "./SampleDownloads";
import { PROVIDER_CLEARING, PROVIDER_LABELS, type Provider } from "@/lib/tools/payout";

interface PayoutSummary {
  provider: Provider;
  payoutId: string | null;
  payoutDate: string;
  gross: number;
  refunds: number;
  disputes: number;
  disputeFees: number;
  fees: number;
  adjustments: number;
  net: number;
  bankAmount: number | null;
  tieOutDiff: number | null;
  tiedOut: boolean | null;
  rowCount: number;
  qboTransactions: { date: string; description: string; amount: number; category: string | null; reference: string | null }[];
}

interface Result {
  detectedFormat: string;
  payouts: PayoutSummary[];
  warnings: string[];
  csv: string;
}

export function PayoutConverter({ provider }: { provider: Provider }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [result, setResult] = useState<Result | null>(null);
  const [dlBusy, setDlBusy] = useState(false);
  const [gate, setGate] = useState<string | null>(null);
  const [incomeAccount, setIncomeAccount] = useState(PROVIDER_CLEARING[provider]);
  const [feeAccount, setFeeAccount] = useState(`${PROVIDER_LABELS[provider]} Fees`);
  const [bankAccount, setBankAccount] = useState("Business Checking");

  const label = PROVIDER_LABELS[provider];

  async function handleFile(f: File) {
    setBusy(true);
    setError(null);
    setResult(null);
    setGate(null);
    setFileName(f.name);
    try {
      const fd = new FormData();
      fd.append("file", f);
      fd.append("provider", provider);
      const res = await fetch("/api/tools/payout-convert", { method: "POST", body: fd });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data.error ?? "Could not read that CSV.");
      }
      setResult(data as Result);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not read that CSV.");
    } finally {
      setBusy(false);
    }
  }

  function downloadCsv() {
    if (!result) return;
    downloadTextFile(
      `${label.toLowerCase()}-payout-clearing.csv`,
      result.csv,
      "text/csv"
    );
  }

  async function downloadQbo() {
    if (!result) return;
    setDlBusy(true);
    setGate(null);
    try {
      await downloadFromApi("/api/tools/payout-download", { payouts: result.payouts }, `${label.toLowerCase()}-payout-clearing.qbo`);
    } catch (e) {
      const g = (e as Error & { gate?: string }).gate;
      if (g === "login" || g === "upgrade") setGate(g);
      else setError(e instanceof Error ? e.message : "Download failed.");
    } finally {
      setDlBusy(false);
    }
  }

  return (
    <div>
      <ToolUpload
        accept=".csv"
        busy={busy}
        busyText="Reading your payout data…"
        title={fileName ?? `Drop your ${label} CSV export here`}
        meta={["CSV export", "Max 10 MB"]}
        activeTitle="Release to convert"
        onFile={(f) => void handleFile(f)}
      />
      <div className="mt-4">
        <p className="text-xs text-zinc-500 mb-2">Try it without your own data first:</p>
        <SampleDownloads ids={[`${provider}-csv`]} />
      </div>

      {error && (
        <p className="mt-4 rounded-xl border border-red-200 bg-red-50 dark:bg-red-900/20 dark:border-red-800 px-4 py-3 text-sm text-red-700 dark:text-red-300">
          {error}
        </p>
      )}

      {result && (
        <div className="mt-8">
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Detected: <span className="font-semibold text-zinc-700 dark:text-zinc-200">{result.detectedFormat}</span>
            {" · "}
            {result.payouts.length} payout{result.payouts.length === 1 ? "" : "s"}
          </p>

          {result.warnings.map((w, i) => (
            <div key={i} className="mt-3 rounded-xl border border-amber-200 bg-amber-50 dark:bg-amber-900/20 dark:border-amber-800 px-4 py-3 text-sm text-amber-800 dark:text-amber-200 flex items-start gap-2">
              <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" /> <span>{w}</span>
            </div>
          ))}

          {result.payouts.map((p, i) => (
            <div key={i} className="mt-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden">
              <div className="px-5 py-3 bg-zinc-50 dark:bg-zinc-900/60 border-b border-zinc-200 dark:border-zinc-800 flex flex-wrap items-center gap-x-4 gap-y-1">
                <p className="font-bold text-zinc-900 dark:text-white">
                  {p.payoutId ? `Payout ${p.payoutId}` : `Payout ${i + 1}`}
                </p>
                <p className="text-sm text-zinc-500">{p.payoutDate || "date unknown"}</p>
                <p className="text-sm text-zinc-500">{p.rowCount} source rows</p>
                <span className="ml-auto">
                  {p.tiedOut === null ? (
                    <span className="text-xs font-semibold text-zinc-500">no bank total to check against</span>
                  ) : p.tiedOut ? (
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-teal-700 dark:text-teal-300 bg-teal-50 dark:bg-teal-900/30 border border-teal-200 dark:border-teal-800 rounded-full px-3 py-1">
                      <CheckCircle2 className="h-3.5 w-3.5" /> Ties out
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-red-700 dark:text-red-300 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-full px-3 py-1">
                      <AlertTriangle className="h-3.5 w-3.5" /> Off by {usd(Math.abs(p.tieOutDiff ?? 0))}
                    </span>
                  )}
                </span>
              </div>
              <table className="w-full text-sm">
                <tbody className="text-zinc-700 dark:text-zinc-300">
                  <tr className="border-b border-zinc-100 dark:border-zinc-800">
                    <td className="px-5 py-2">Gross sales</td>
                    <td className="px-5 py-2 text-right font-mono">{usd(p.gross)}</td>
                    <td className="px-5 py-2 text-xs text-zinc-400">→ {incomeAccount} (income)</td>
                  </tr>
                  {p.refunds !== 0 && (
                    <tr className="border-b border-zinc-100 dark:border-zinc-800">
                      <td className="px-5 py-2">Refunds</td>
                      <td className="px-5 py-2 text-right font-mono">{usd(p.refunds)}</td>
                      <td className="px-5 py-2 text-xs text-zinc-400">→ {incomeAccount} (contra-income)</td>
                    </tr>
                  )}
                  {p.disputes !== 0 && (
                    <tr className="border-b border-zinc-100 dark:border-zinc-800">
                      <td className="px-5 py-2">Disputes / chargebacks</td>
                      <td className="px-5 py-2 text-right font-mono">{usd(p.disputes)}</td>
                      <td className="px-5 py-2 text-xs text-zinc-400">→ {incomeAccount}</td>
                    </tr>
                  )}
                  {p.disputeFees !== 0 && (
                    <tr className="border-b border-zinc-100 dark:border-zinc-800">
                      <td className="px-5 py-2">{provider === "stripe" ? "Dispute fees ($15 each)" : "Dispute fees"}</td>
                      <td className="px-5 py-2 text-right font-mono">{usd(p.disputeFees)}</td>
                      <td className="px-5 py-2 text-xs text-zinc-400">→ {feeAccount} (returned only if won)</td>
                    </tr>
                  )}
                  {p.fees - p.disputeFees !== 0 && (
                    <tr className="border-b border-zinc-100 dark:border-zinc-800">
                      <td className="px-5 py-2">Processing fees</td>
                      <td className="px-5 py-2 text-right font-mono">{usd(p.fees - p.disputeFees)}</td>
                      <td className="px-5 py-2 text-xs text-zinc-400">→ {feeAccount}</td>
                    </tr>
                  )}
                  {p.adjustments !== 0 && (
                    <tr className="border-b border-zinc-100 dark:border-zinc-800">
                      <td className="px-5 py-2">Adjustments</td>
                      <td className="px-5 py-2 text-right font-mono">{usd(p.adjustments)}</td>
                      <td className="px-5 py-2 text-xs text-zinc-400">→ review manually</td>
                    </tr>
                  )}
                  <tr className="bg-zinc-50 dark:bg-zinc-900/60 font-bold text-zinc-900 dark:text-white">
                    <td className="px-5 py-2.5">Net payout</td>
                    <td className="px-5 py-2.5 text-right font-mono">{usd(p.net)}</td>
                    <td className="px-5 py-2.5 text-xs font-normal text-zinc-400">
                      transfer: {incomeAccount} → {bankAccount}
                    </td>
                  </tr>
                </tbody>
              </table>
              {p.bankAmount !== null && (
                <p className="px-5 py-2 text-xs text-zinc-500 border-t border-zinc-100 dark:border-zinc-800">
                  Bank deposit: {usd(p.bankAmount)} · Gross − Fees − Refunds = Payout{" "}
                  {p.tiedOut ? "✓ matched" : `— differs by ${usd(p.tieOutDiff ?? 0)}; check for reserves, holds, or instant-payout fees before importing`}
                </p>
              )}
            </div>
          ))}

          {/* Mapping labels */}
          <div className="mt-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5">
            <h3 className="font-bold text-zinc-900 dark:text-white text-sm">Account labels used in the exports</h3>
            <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
              {[
                { label: "Clearing account", value: incomeAccount, set: setIncomeAccount },
                { label: "Fee expense account", value: feeAccount, set: setFeeAccount },
                { label: "Bank account", value: bankAccount, set: setBankAccount },
              ].map((f) => (
                <label key={f.label} className="block">
                  <span className="text-xs text-zinc-500">{f.label}</span>
                  <input
                    value={f.value}
                    onChange={(e) => f.set(e.target.value)}
                    className="mt-1 w-full rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3 py-2 text-zinc-900 dark:text-white"
                  />
                </label>
              ))}
            </div>
            <p className="mt-2 text-xs text-zinc-400">
              These are just the names printed on the export and the import steps — nothing connects
              to your books. Create a “{incomeAccount}” bank account in QuickBooks first, then import.
            </p>
          </div>

          {/* Downloads */}
          <div className="mt-5 flex flex-wrap gap-3">
            <button
              onClick={downloadCsv}
              className="inline-flex items-center gap-2 bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-white font-semibold px-5 py-2.5 rounded-lg hover:border-teal-400"
            >
              <Download className="h-4 w-4" /> Download CSV (free)
            </button>
            <button
              onClick={() => void downloadQbo()}
              disabled={dlBusy}
              className="inline-flex items-center gap-2 bg-teal-600 text-white font-semibold px-5 py-2.5 rounded-lg hover:bg-teal-700 disabled:opacity-60"
            >
              <Lock className="h-4 w-4" /> {dlBusy ? "Preparing…" : "Download .QBO (Pro)"}
            </button>
          </div>
          {gate && (
            <div className="mt-4">
              <QboGateNotice gate={gate} />
            </div>
          )}

          {/* Import steps */}
          <div className="mt-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5">
            <h3 className="font-bold text-zinc-900 dark:text-white text-sm">How to import (clearing-account method)</h3>
            <ol className="mt-2 list-decimal list-inside space-y-1.5 text-sm text-zinc-600 dark:text-zinc-300">
              <li>In QuickBooks, create a bank account named “{incomeAccount}” (your clearing account).</li>
              <li>Import the .qbo file into that clearing account — each payout becomes its gross, refund, fee, and transfer lines.</li>
              <li>The transfer line moves the net payout to “{bankAccount}”. Match it against the real deposit in your bank feed.</li>
              <li>When the clearing account nets to zero, the payout is fully reconciled. Record the gross in your income account and fees in “{feeAccount}” as mapped during categorization.</li>
            </ol>
            <p className="mt-2 text-xs text-zinc-400">
              Per-payout summary mode is free and covers most sellers. Per-transaction detail and
              bulk payout conversion are available on Pro. If QuickBooks refuses the file, the{" "}
              <a href="/tools/qbo-import-errors" className="text-teal-600 dark:text-teal-400 font-semibold hover:underline">import-error decoder</a>{" "}
              explains what each error means and how to fix it.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
