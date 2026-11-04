"use client";

import { useState } from "react";
import { CheckCircle2, Download, Trash2 } from "lucide-react";
import { ToolUpload, usd } from "./tool-shared";

interface TxnRow {
  index: number;
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

interface DoneState {
  removed: number;
  kept: number;
  fileName: string;
}

export function BulkDeleter() {
  const [file, setFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [dlBusy, setDlBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [summary, setSummary] = useState<Summary | null>(null);
  const [rows, setRows] = useState<TxnRow[]>([]);
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [done, setDone] = useState<DoneState | null>(null);

  async function handleFile(f: File) {
    setBusy(true);
    setError(null);
    setDone(null);
    setSummary(null);
    setRows([]);
    setSelected(new Set());
    setFile(f);
    setFileName(f.name);
    try {
      const fd = new FormData();
      fd.append("step", "analyze");
      fd.append("file", f);
      const res = await fetch("/api/tools/bulk-delete", { method: "POST", body: fd });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error ?? "Could not read that file.");
      setSummary(data.summary as Summary);
      setRows(data.transactions as TxnRow[]);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not read that file.");
      setFile(null);
    } finally {
      setBusy(false);
    }
  }

  function toggle(index: number) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  }

  function selectDuplicates() {
    // Same key the site's QBO checker uses: date + amount + name.
    // The first occurrence of each key is kept; later ones are selected.
    const seen = new Set<string>();
    const dups = new Set<number>();
    for (const r of rows) {
      const key = `${r.date}|${r.amount}|${r.name.toLowerCase()}`;
      if (seen.has(key)) dups.add(r.index);
      else seen.add(key);
    }
    setSelected(dups);
  }

  async function downloadCleaned() {
    if (!file || selected.size === 0) return;
    setDlBusy(true);
    setError(null);
    try {
      const fd = new FormData();
      fd.append("step", "build");
      fd.append("file", file);
      fd.append("remove", JSON.stringify([...selected]));
      const res = await fetch("/api/tools/bulk-delete", { method: "POST", body: fd });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? "Could not build the cleaned file.");
      }
      const removedHeader = Number(res.headers.get("X-Removed") ?? selected.size);
      const blob = await res.blob();
      const base = (fileName ?? "statement").replace(/\.(qbo|ofx|qfx)$/i, "");
      const objectUrl = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = objectUrl;
      a.download = `${base}-cleaned.qbo`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(objectUrl);
      setDone({
        removed: Number.isFinite(removedHeader) ? removedHeader : selected.size,
        kept: rows.length - selected.size,
        fileName: `${base}-cleaned.qbo`,
      });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not build the cleaned file.");
    } finally {
      setDlBusy(false);
    }
  }

  return (
    <div>
      <ToolUpload
        accept=".qbo,.ofx,.qfx"
        busy={busy}
        busyText="Reading your file…"
        title={fileName ?? "Drop a QBO, OFX or QFX file here"}
        meta={["QBO / OFX / QFX", "Max 10 MB"]}
        activeTitle="Release to read the file"
        onFile={(f) => void handleFile(f)}
      />
      <p className="mt-3 text-center text-xs text-zinc-500">
        This removes transactions from the <strong>file</strong> before you import it — it does not delete anything inside QuickBooks.
      </p>

      {error && (
        <p className="mt-4 rounded-[20px] border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      )}

      {summary && rows.length > 0 && (
        <div className="mt-8">
          <p className="text-sm text-zinc-600 leading-relaxed">
            <strong className="text-zinc-900">{summary.transactionCount} transactions</strong>
            {summary.periodStart && summary.periodEnd ? (
              <> · {summary.periodStart} → {summary.periodEnd}</>
            ) : null}
            {" "}· Money in {usd(summary.creditsTotal)} · Money out {usd(summary.debitsTotal)} · Net {usd(summary.netChange)}
            {summary.ledgerBalance != null ? <> · Ledger balance {usd(summary.ledgerBalance)}</> : null}
          </p>

          <div className="mt-4 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={selectDuplicates}
              className="inline-flex items-center gap-2 bg-white border border-zinc-300 text-zinc-900 font-semibold px-4 py-2 rounded-lg hover:border-pine-400 text-sm"
            >
              Select duplicates
            </button>
            <button
              type="button"
              onClick={() => setSelected(new Set(rows.map((r) => r.index)))}
              className="inline-flex items-center gap-2 bg-white border border-zinc-300 text-zinc-900 font-semibold px-4 py-2 rounded-lg hover:border-pine-400 text-sm"
            >
              Select all
            </button>
            <button
              type="button"
              onClick={() => setSelected(new Set())}
              className="inline-flex items-center gap-2 bg-white border border-zinc-300 text-zinc-900 font-semibold px-4 py-2 rounded-lg hover:border-pine-400 text-sm"
            >
              Clear
            </button>
            <span className="text-sm text-zinc-600">
              <strong className="text-zinc-900">{selected.size}</strong> of {rows.length} selected for removal
            </span>
          </div>

          <div className="mt-4 rounded-2xl border border-zinc-200 overflow-hidden">
            <div className="max-h-[480px] overflow-y-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-xs text-zinc-500 border-b border-zinc-200 bg-white sticky top-0">
                    <th className="px-4 py-2 font-semibold w-10">
                      <span className="sr-only">Remove</span>
                    </th>
                    <th className="px-3 py-2 font-semibold">Date</th>
                    <th className="px-3 py-2 font-semibold">Type</th>
                    <th className="px-3 py-2 font-semibold">Description</th>
                    <th className="px-4 py-2 font-semibold text-right">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((r) => (
                    <tr
                      key={r.index}
                      className={`border-b border-zinc-100 text-zinc-700 ${selected.has(r.index) ? "bg-red-50" : ""}`}
                    >
                      <td className="px-4 py-1.5">
                        <input
                          type="checkbox"
                          checked={selected.has(r.index)}
                          onChange={() => toggle(r.index)}
                          aria-label={`Remove transaction ${r.name} on ${r.date}`}
                          className="h-4 w-4 accent-red-600"
                        />
                      </td>
                      <td className="px-3 py-1.5 whitespace-nowrap">{r.date}</td>
                      <td className="px-3 py-1.5">{r.type}</td>
                      <td className="px-3 py-1.5">{r.name}</td>
                      <td className="px-4 py-1.5 text-right font-mono">{usd(r.amount)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="mt-5 flex flex-wrap gap-3">
            <button
              onClick={() => void downloadCleaned()}
              disabled={dlBusy || selected.size === 0}
              className="inline-flex items-center gap-2 bg-pine-600 text-white font-semibold px-5 py-2.5 rounded-lg hover:bg-pine-700 disabled:opacity-60"
            >
              <Trash2 className="h-4 w-4" /> {dlBusy ? "Building…" : `Download cleaned QBO (${selected.size} to remove)`}
            </button>
          </div>
          <p className="mt-3 text-xs text-zinc-400">
            The cleaned file keeps the remaining transactions exactly as they were — same dates, amounts and transaction IDs — rebuilt as a clean QBO with your file&apos;s bank identity and closing balance preserved. Your original file is never changed.
          </p>
        </div>
      )}

      {done && (
        <div className="mt-8 rounded-2xl border border-pine-200 bg-pine-50 px-5 py-4">
          <p className="font-semibold text-zinc-900 flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-pine-600" />
            Done — {done.removed} transaction{done.removed === 1 ? "" : "s"} removed, {done.kept} kept
          </p>
          <p className="mt-2 text-sm text-zinc-600">
            Downloaded as {done.fileName}. Import that file into QuickBooks instead of the original and the removed transactions will never reach your books.
          </p>
        </div>
      )}
    </div>
  );
}
