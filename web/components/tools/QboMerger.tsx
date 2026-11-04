"use client";

import { useState } from "react";
import { AlertTriangle, Download, X } from "lucide-react";
import { ToolUpload, downloadTextFile, downloadFromApi } from "./tool-shared";

interface ParsedRow {
  date: string;
  type: string;
  name: string;
  amount: number;
  fitid: string | null;
}

interface ParsedFile {
  name: string;
  transactions: ParsedRow[];
  summary: {
    periodStart: string | null;
    periodEnd: string | null;
    ledgerBalance: number | null;
    ledgerAsOf: string | null;
    accountId: string | null;
  };
}

interface MergeResult {
  perFile: { name: string; count: number }[];
  totalRows: number;
  duplicatesRemoved: number;
  mergedRows: ParsedRow[];
  rangeStart: string | null;
  rangeEnd: string | null;
  accountId: string | null;
  ledgerBalance: number | null;
  ledgerAsOf: string | null;
}

const MAX_FILES = 10;

/** Same CSV shape and formula-injection guard as the QBO to CSV tool. */
function csvCell(value: string): string {
  const safe = /^[=+\-@\t\r]/.test(value) ? `'${value}` : value;
  return `"${safe.replace(/"/g, '""')}"`;
}

function rowsToCsv(rows: ParsedRow[]): string {
  const header = "Date,Type,Description,Amount,Transaction ID\n";
  const body = rows
    .map((r) =>
      [
        csvCell(r.date),
        csvCell(r.type),
        csvCell(r.name),
        Number.isFinite(r.amount) ? r.amount.toFixed(2) : "",
        csvCell(r.fitid ?? ""),
      ].join(",")
    )
    .join("\n");
  return header + body;
}

export function QboMerger() {
  const [files, setFiles] = useState<File[]>([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<MergeResult | null>(null);
  const [dlBusy, setDlBusy] = useState(false);

  function addFile(f: File) {
    setError(null);
    setResult(null);
    setFiles((prev) => {
      if (prev.length >= MAX_FILES) {
        setError(`You can merge at most ${MAX_FILES} files at a time.`);
        return prev;
      }
      if (prev.some((p) => p.name === f.name && p.size === f.size)) {
        setError(`${f.name} is already in the list.`);
        return prev;
      }
      return [...prev, f];
    });
  }

  function removeFile(index: number) {
    setResult(null);
    setFiles((prev) => prev.filter((_, i) => i !== index));
  }

  async function merge() {
    if (files.length < 2) return;
    setBusy(true);
    setError(null);
    setResult(null);
    try {
      const fd = new FormData();
      for (const f of files) fd.append("files", f);
      const res = await fetch("/api/tools/ofx-parse", { method: "POST", body: fd });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error ?? "Could not read those files.");
      const parsed = data.files as ParsedFile[];

      // Combine, drop exact duplicates (same FITID + date + amount), sort
      // by date. Rows with no FITID are never deduped — without an ID there
      // is no proof two rows are the same transaction.
      const seen = new Set<string>();
      const mergedRows: ParsedRow[] = [];
      let duplicatesRemoved = 0;
      let totalRows = 0;
      for (const pf of parsed) {
        for (const t of pf.transactions) {
          totalRows += 1;
          if (t.fitid) {
            const key = `${t.fitid}|${t.date}|${t.amount}`;
            if (seen.has(key)) {
              duplicatesRemoved += 1;
              continue;
            }
            seen.add(key);
          }
          mergedRows.push(t);
        }
      }
      mergedRows.sort((a, b) => (a.date < b.date ? -1 : a.date > b.date ? 1 : 0));

      const dates = mergedRows.map((r) => r.date).filter(Boolean);
      // Closing balance: the statement with the latest period end carries
      // the balance the merged file should reconcile to.
      let latest: ParsedFile | null = null;
      for (const pf of parsed) {
        if (pf.summary.ledgerBalance == null) continue;
        if (!latest || (pf.summary.periodEnd ?? "") > (latest.summary.periodEnd ?? "")) {
          latest = pf;
        }
      }
      setResult({
        perFile: parsed.map((pf) => ({ name: pf.name, count: pf.transactions.length })),
        totalRows,
        duplicatesRemoved,
        mergedRows,
        rangeStart: dates.length ? dates[0] : null,
        rangeEnd: dates.length ? dates[dates.length - 1] : null,
        accountId: parsed.find((pf) => pf.summary.accountId)?.summary.accountId ?? null,
        ledgerBalance: latest?.summary.ledgerBalance ?? null,
        ledgerAsOf: latest?.summary.ledgerAsOf ?? null,
      });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not read those files.");
    } finally {
      setBusy(false);
    }
  }

  async function downloadQbo() {
    if (!result) return;
    setDlBusy(true);
    setError(null);
    try {
      await downloadFromApi(
        "/api/tools/ofx-build",
        {
          transactions: result.mergedRows.map((r) => ({
            date: r.date,
            name: r.name,
            amount: r.amount,
            fitid: r.fitid,
          })),
          accountId: result.accountId ?? undefined,
          ledgerBalance: result.ledgerBalance ?? undefined,
          ledgerAsOf: result.ledgerAsOf ?? undefined,
          fileName: "merged-statement.qbo",
        },
        "merged-statement.qbo"
      );
    } catch (e) {
      setError(e instanceof Error ? e.message : "Download failed.");
    } finally {
      setDlBusy(false);
    }
  }

  function downloadCsv() {
    if (!result) return;
    downloadTextFile("merged-transactions.csv", rowsToCsv(result.mergedRows), "text/csv");
  }

  return (
    <div>
      <ToolUpload
        accept=".qbo,.ofx,.qfx"
        busy={busy}
        busyText="Merging your files…"
        title="Drop QBO, OFX or QFX files here — add up to 10"
        meta={["QBO / OFX / QFX", "Up to 10 files", "Max 10 MB each"]}
        activeTitle="Release to add the file"
        onFile={addFile}
      />

      {files.length > 0 && (
        <div className="mt-5 rounded-2xl border border-zinc-200 bg-white p-5">
          <h3 className="font-bold text-zinc-900 text-sm">
            Files to merge ({files.length} of {MAX_FILES})
          </h3>
          <ul className="mt-3 space-y-2">
            {files.map((f, i) => (
              <li
                key={`${f.name}-${f.size}-${i}`}
                className="flex items-center justify-between gap-3 rounded-lg border border-zinc-200 px-4 py-2 text-sm"
              >
                <span className="truncate text-zinc-700">{f.name}</span>
                <span className="flex shrink-0 items-center gap-3">
                  <span className="text-xs text-zinc-400">{Math.max(1, Math.round(f.size / 1024))} KB</span>
                  <button
                    onClick={() => removeFile(i)}
                    aria-label={`Remove ${f.name}`}
                    className="inline-flex items-center justify-center rounded-md border border-zinc-300 p-1 text-zinc-500 hover:border-red-300 hover:text-red-600"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </span>
              </li>
            ))}
          </ul>
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <button
              onClick={() => void merge()}
              disabled={busy || files.length < 2}
              className="inline-flex items-center gap-2 bg-pine-600 text-white font-semibold px-5 py-2.5 rounded-lg hover:bg-pine-700 disabled:opacity-60"
            >
              {busy ? "Merging…" : "Merge files"}
            </button>
            {files.length < 2 && (
              <span className="text-xs text-zinc-500">Add at least two files to merge.</span>
            )}
          </div>
        </div>
      )}

      {error && (
        <p className="mt-4 rounded-[20px] border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      )}

      {result && (
        <div className="mt-8">
          <div className="rounded-2xl border border-zinc-200 bg-white p-5">
            <h3 className="font-bold text-zinc-900 text-sm">Merge summary</h3>
            <div className="mt-3 overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-xs text-zinc-500 border-b border-zinc-200">
                    <th className="py-2 pr-3 font-semibold">File</th>
                    <th className="py-2 font-semibold text-right">Transactions</th>
                  </tr>
                </thead>
                <tbody>
                  {result.perFile.map((pf, i) => (
                    <tr key={i} className="border-b border-zinc-100 text-zinc-700">
                      <td className="py-1.5 pr-3 truncate max-w-[420px]">{pf.name}</td>
                      <td className="py-1.5 text-right font-mono">{pf.count}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
              <div>
                <p className="text-xs text-zinc-500">Combined transactions</p>
                <p className="mt-1 font-semibold text-zinc-900">{result.mergedRows.length}</p>
              </div>
              <div>
                <p className="text-xs text-zinc-500">Exact duplicates removed</p>
                <p className="mt-1 font-semibold text-zinc-900">{result.duplicatesRemoved}</p>
              </div>
              <div>
                <p className="text-xs text-zinc-500">Merged period</p>
                <p className="mt-1 font-semibold text-zinc-900">
                  {result.rangeStart ?? "—"} → {result.rangeEnd ?? "—"}
                </p>
              </div>
            </div>
            {result.duplicatesRemoved > 0 && (
              <p className="mt-4 flex items-start gap-2 text-sm text-zinc-600">
                <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5 text-amber-500" />
                <span>
                  {result.duplicatesRemoved} row{result.duplicatesRemoved === 1 ? " was" : "s were"}{" "}
                  dropped because another row had the same transaction ID, date and amount — the
                  classic overlap when two downloads cover some of the same days. Rows without a
                  transaction ID are never removed.
                </span>
              </p>
            )}
          </div>

          <div className="mt-5 flex flex-wrap gap-3">
            <button
              onClick={() => void downloadQbo()}
              disabled={dlBusy || result.mergedRows.length === 0}
              className="inline-flex items-center gap-2 bg-pine-600 text-white font-semibold px-5 py-2.5 rounded-lg hover:bg-pine-700 disabled:opacity-60"
            >
              <Download className="h-4 w-4" /> {dlBusy ? "Preparing…" : "Download merged QBO (free)"}
            </button>
            <button
              onClick={downloadCsv}
              disabled={result.mergedRows.length === 0}
              className="inline-flex items-center gap-2 bg-white border border-zinc-300 text-zinc-900 font-semibold px-5 py-2.5 rounded-lg hover:border-pine-400 disabled:opacity-60"
            >
              <Download className="h-4 w-4" /> Download CSV (free)
            </button>
          </div>
          <p className="mt-3 text-xs text-zinc-400">
            Merge files from the same bank account — the merged QBO carries one account number
            (taken from your files) and the closing balance of the latest statement in the set, so
            it reconciles the way the separate files did. Both downloads are fully free.
          </p>
        </div>
      )}
    </div>
  );
}
