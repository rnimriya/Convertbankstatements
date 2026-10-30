"use client";

import { useMemo, useState } from "react";
import { AlertTriangle, Download } from "lucide-react";
import { ToolUpload, usd, downloadFromApi } from "./tool-shared";
import { SampleDownloads } from "./SampleDownloads";
import type { SplitTransaction } from "@/lib/tools/qbo-splitter";

interface Result {
  fileName: string;
  periodStart: string | null;
  periodEnd: string | null;
  transactionCount: number;
  ledgerBalance: number | null;
  netChange: number;
  transactions: SplitTransaction[];
}

export function QboSplitter() {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [result, setResult] = useState<Result | null>(null);
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [dlBusy, setDlBusy] = useState(false);

  async function handleFile(f: File) {
    setBusy(true);
    setError(null);
    setFileName(f.name);
    setResult(null);
    try {
      const fd = new FormData();
      fd.append("file", f);
      const res = await fetch("/api/tools/qbo-split", { method: "POST", body: fd });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error ?? "Could not read that QBO file.");
      const parsed = data as Result;
      setResult(parsed);
      const firstDate = parsed.transactions[0]?.date ?? "";
      const lastDate = parsed.transactions[parsed.transactions.length - 1]?.date ?? "";
      setStart(parsed.periodStart ?? firstDate);
      setEnd(parsed.periodEnd ?? lastDate);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not read that QBO file.");
    } finally {
      setBusy(false);
    }
  }

  const counts = useMemo(() => {
    if (!result || !start || !end) {
      return { kept: 0, droppedBefore: 0, droppedAfter: 0 };
    }
    let kept = 0;
    let droppedBefore = 0;
    let droppedAfter = 0;
    for (const t of result.transactions) {
      if (t.date < start) droppedBefore++;
      else if (t.date > end) droppedAfter++;
      else kept++;
    }
    return { kept, droppedBefore, droppedAfter };
  }, [result, start, end]);

  async function downloadSplit() {
    if (!result) return;
    setDlBusy(true);
    setError(null);
    try {
      await downloadFromApi(
        "/api/tools/qbo-split-download",
        { transactions: result.transactions, start, end },
        "statement-split.qbo"
      );
    } catch (e) {
      setError(e instanceof Error ? e.message : "Download failed.");
    } finally {
      setDlBusy(false);
    }
  }

  const rangeInvalid = Boolean(result && start && end && start > end);

  return (
    <div>
      <ToolUpload
        accept=".qbo,.ofx,.qfx"
        busy={busy}
        busyText="Reading your QBO file…"
        title={fileName ?? "Drop a QBO, OFX or QFX file here"}
        meta={["QBO / OFX / QFX", "Max 10 MB"]}
        activeTitle="Release to split"
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

      {result && (
        <div className="mt-8">
          <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5">
            <h3 className="font-bold text-zinc-900 dark:text-white text-sm">File summary</h3>
            <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
              <div>
                <p className="text-xs text-zinc-500">File period</p>
                <p className="mt-1 font-semibold text-zinc-900 dark:text-white">
                  {result.periodStart ?? "—"} → {result.periodEnd ?? "—"}
                </p>
              </div>
              <div>
                <p className="text-xs text-zinc-500">Transactions</p>
                <p className="mt-1 font-semibold text-zinc-900 dark:text-white">
                  {result.transactionCount}
                </p>
              </div>
              <div>
                <p className="text-xs text-zinc-500">Ledger (closing) balance</p>
                <p className="mt-1 font-semibold text-zinc-900 dark:text-white">
                  {result.ledgerBalance !== null ? usd(result.ledgerBalance) : "Not in file"}
                </p>
              </div>
            </div>
            {result.ledgerBalance === null && (
              <div className="mt-4 rounded-[20px] border border-amber-200 bg-amber-50 dark:bg-amber-900/20 dark:border-amber-800 px-4 py-3 text-sm text-amber-800 dark:text-amber-200 flex items-start gap-2">
                <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
                <span>
                  This file has no closing (ledger) balance, so there is no real balance to carry
                  into the trimmed file. The trimmed file will carry a zero ledger balance because
                  the original file had no closing balance.
                </span>
              </div>
            )}
          </div>

          <div className="mt-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5">
            <h3 className="font-bold text-zinc-900 dark:text-white text-sm">Date range to keep</h3>
            <p className="text-xs text-zinc-500 mt-1">
              Both dates are inclusive. The counts below update as you change the range.
            </p>
            <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
              <label className="block text-sm">
                <span className="text-xs text-zinc-500">Start date</span>
                <input
                  type="date"
                  value={start}
                  onChange={(e) => setStart(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3 py-2 text-zinc-900 dark:text-white"
                />
              </label>
              <label className="block text-sm">
                <span className="text-xs text-zinc-500">End date</span>
                <input
                  type="date"
                  value={end}
                  onChange={(e) => setEnd(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3 py-2 text-zinc-900 dark:text-white"
                />
              </label>
            </div>
            {rangeInvalid ? (
              <p className="mt-3 text-sm text-red-700 dark:text-red-300">
                The start date is after the end date — please fix the range.
              </p>
            ) : (
              <p className="mt-3 text-sm text-zinc-600 dark:text-zinc-300">
                <strong className="text-zinc-900 dark:text-white">{counts.kept} transactions kept</strong>
                {" · "}
                {counts.droppedBefore} dropped before the range
                {" · "}
                {counts.droppedAfter} dropped after the range
              </p>
            )}
          </div>

          <div className="mt-5 flex flex-wrap gap-3">
            <button
              onClick={() => void downloadSplit()}
              disabled={dlBusy || counts.kept === 0 || rangeInvalid}
              className="inline-flex items-center gap-2 bg-pine-600 text-white font-semibold px-5 py-2.5 rounded-lg hover:bg-pine-700 disabled:opacity-60"
            >
              <Download className="h-4 w-4" /> {dlBusy ? "Preparing…" : "Download trimmed .QBO (free)"}
            </button>
          </div>
          <p className="mt-3 text-xs text-zinc-400">
            This download is fully free — no account and no Pro plan needed. When the original file
            carries a closing balance, the trimmed file&apos;s closing balance is the balance after
            the last kept transaction, so its balance chain still checks out.
          </p>
        </div>
      )}
    </div>
  );
}
