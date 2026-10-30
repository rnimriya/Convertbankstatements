"use client";

import { useState } from "react";
import Link from "next/link";
import { AlertTriangle, CheckCircle2, Download, Wrench, XCircle } from "lucide-react";
import { ToolUpload, downloadFromApi } from "./tool-shared";

interface Issue {
  level: "error" | "warning";
  message: string;
}

interface Fix {
  kind: string;
  count: number;
  detail: string;
}

interface FixReport {
  fixes: Fix[];
  intuBid: string | null;
  intuBidSource: "file" | "user" | null;
  bankName: string | null;
  transactionCount: number;
  issuesBefore: Issue[];
}

interface FixedTxn {
  date: string;
  description: string;
  amount: number;
  balance: number | null;
  category: string | null;
  reference: string | null;
}

interface Result {
  report: FixReport;
  transactions: FixedTxn[];
  accountId: string;
  ledgerBalance: number | null;
  ledgerAsOf: string | null;
}

export function OfxFixer() {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [result, setResult] = useState<Result | null>(null);
  const [dlBusy, setDlBusy] = useState(false);
  const [intuBid, setIntuBid] = useState("");
  const [bankName, setBankName] = useState("");

  async function handleFile(f: File) {
    setBusy(true);
    setError(null);
    setResult(null);
    setFileName(f.name);
    try {
      const fd = new FormData();
      fd.append("file", f);
      if (intuBid.trim()) fd.append("intuBid", intuBid.trim());
      if (bankName.trim()) fd.append("bankName", bankName.trim());
      const res = await fetch("/api/tools/ofx-fix", { method: "POST", body: fd });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error ?? "Could not fix that file.");
      setResult(data as Result);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not fix that file.");
    } finally {
      setBusy(false);
    }
  }

  async function downloadFixed() {
    if (!result) return;
    setDlBusy(true);
    setError(null);
    try {
      // The optional inputs are re-sent on download, so a value typed
      // after the upload still lands in the downloaded file.
      await downloadFromApi(
        "/api/tools/ofx-fix-download",
        {
          transactions: result.transactions,
          intuBid: intuBid.trim() || result.report.intuBid,
          bankName: bankName.trim() || result.report.bankName,
          accountId: result.accountId,
          ledgerBalance: result.ledgerBalance,
          ledgerAsOf: result.ledgerAsOf,
        },
        "fixed.qbo"
      );
    } catch (e) {
      setError(e instanceof Error ? e.message : "Download failed.");
    } finally {
      setDlBusy(false);
    }
  }

  const report = result?.report;

  return (
    <div>
      <div className="mb-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5">
        <h3 className="font-bold text-zinc-900 dark:text-white text-sm">Bank identity (optional)</h3>
        <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
          <label className="block text-sm">
            <span className="text-xs text-zinc-500">INTU.BID (optional)</span>
            <input
              type="text"
              inputMode="numeric"
              value={intuBid}
              onChange={(e) => setIntuBid(e.target.value)}
              placeholder="e.g. 3000"
              className="mt-1 w-full rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3 py-2 text-zinc-900 dark:text-white"
            />
          </label>
          <label className="block text-sm">
            <span className="text-xs text-zinc-500">Bank name (optional)</span>
            <input
              type="text"
              value={bankName}
              onChange={(e) => setBankName(e.target.value)}
              placeholder="Your bank's name"
              className="mt-1 w-full rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3 py-2 text-zinc-900 dark:text-white"
            />
          </label>
        </div>
        <p className="mt-2 text-xs text-zinc-400 leading-relaxed">
          Optional. If QuickBooks says your bank is not supported, copy the INTU.BID from a working QBO file downloaded from your bank (open it in a text editor and search for INTU.BID). Leave blank to keep the value already in your file.
        </p>
      </div>

      <ToolUpload
        accept=".ofx,.qfx,.qbo"
        busy={busy}
        busyText="Fixing your file…"
        title={fileName ?? "Drop an OFX, QFX or QBO file here"}
        meta={["OFX / QFX / QBO", "Max 10 MB"]}
        activeTitle="Release to fix"
        onFile={(f) => void handleFile(f)}
      />

      {error && (
        <p className="mt-4 rounded-[20px] border border-red-200 bg-red-50 dark:bg-red-900/20 dark:border-red-800 px-4 py-3 text-sm text-red-700 dark:text-red-300">
          {error}
        </p>
      )}

      {result && report && (
        <div className="mt-8">
          <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden">
            <div className="px-5 py-3 bg-zinc-50 dark:bg-zinc-900/60 border-b border-zinc-200 dark:border-zinc-800 flex flex-wrap items-center gap-x-4 gap-y-1">
              <p className="font-bold text-zinc-900 dark:text-white">{report.transactionCount} transactions rebuilt</p>
              <Link href="/tools/qbo-import-errors" className="ml-auto text-xs font-semibold text-pine-600 dark:text-pine-400 hover:underline">
                QBO import errors, explained →
              </Link>
            </div>

            <div className="px-5 py-4">
              <h3 className="font-bold text-zinc-900 dark:text-white text-sm">Before — what was wrong with the file</h3>
              {report.issuesBefore.length === 0 ? (
                <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-300 flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5 text-pine-600" />
                  <span>No problems were found in the original file. It was still rebuilt as a clean OFX 1.02 QBO below.</span>
                </p>
              ) : (
                <ul className="mt-3 space-y-3">
                  {report.issuesBefore.map((issue, i) => (
                    <li key={i} className="flex items-start gap-3 rounded-[20px] border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-4 py-3">
                      {issue.level === "error" ? (
                        <XCircle className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
                      ) : (
                        <AlertTriangle className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
                      )}
                      <span className="text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed">{issue.message}</span>
                    </li>
                  ))}
                </ul>
              )}

              <h3 className="mt-6 font-bold text-zinc-900 dark:text-white text-sm">Fixes applied</h3>
              {report.fixes.length === 0 ? (
                <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-300">
                  No structural fixes were needed — the header, dates, and transaction IDs were already in QBO shape.
                </p>
              ) : (
                <ul className="mt-3 space-y-2">
                  {report.fixes.map((fix, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-zinc-600 dark:text-zinc-300">
                      <Wrench className="h-4 w-4 shrink-0 mt-0.5 text-pine-600" />
                      <span>
                        {fix.detail}{" "}
                        <span className="font-semibold text-zinc-900 dark:text-white">× {fix.count}</span>
                      </span>
                    </li>
                  ))}
                </ul>
              )}

              <p className="mt-4 text-sm text-zinc-600 dark:text-zinc-300">
                <strong className="text-zinc-900 dark:text-white">INTU.BID:</strong>{" "}
                {report.intuBidSource === "file" && (
                  <>preserved from your file ({report.intuBid}) — this tool never guesses a bank&apos;s ID.</>
                )}
                {report.intuBidSource === "user" && (
                  <>set from your input ({report.intuBid}).</>
                )}
                {report.intuBidSource === null && (
                  <>not present in your file — left unset. If QuickBooks asks for a supported bank, type the INTU.BID from a working QBO downloaded from your bank in the field above and download again.</>
                )}
                {report.bankName ? <> · Bank name: {report.bankName}</> : null}
              </p>
            </div>
          </div>

          <div className="mt-5 flex flex-wrap gap-3">
            <button
              onClick={() => void downloadFixed()}
              disabled={dlBusy}
              className="inline-flex items-center gap-2 bg-pine-600 text-white font-semibold px-5 py-2.5 rounded-lg hover:bg-pine-700 disabled:opacity-60"
            >
              <Download className="h-4 w-4" /> {dlBusy ? "Preparing…" : "Download fixed .QBO (free)"}
            </button>
          </div>
          <p className="mt-3 text-xs text-zinc-400">
            Fully free — no account, no plan. Regenerated transaction IDs are derived from each transaction itself, so re-importing the fixed file will not create duplicates in QuickBooks.
          </p>
        </div>
      )}
    </div>
  );
}
