"use client";

import { useState } from "react";
import { CheckCircle2, Download, FileSpreadsheet, X } from "lucide-react";
import { ToolUpload } from "./tool-shared";

const MAX_FILES = 10;

interface FileCount {
  name: string;
  rows: number;
}

interface ExportResult {
  counts: FileCount[];
  total: number;
  format: "csv" | "xlsx";
}

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function BulkExporter() {
  const [files, setFiles] = useState<File[]>([]);
  const [format, setFormat] = useState<"csv" | "xlsx">("csv");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ExportResult | null>(null);

  function addFile(f: File) {
    setError(null);
    setResult(null);
    setFiles((prev) => {
      if (prev.length >= MAX_FILES) {
        setError(`You can merge up to ${MAX_FILES} files at a time. Remove one to add another.`);
        return prev;
      }
      if (prev.some((p) => p.name === f.name && p.size === f.size)) return prev;
      return [...prev, f];
    });
  }

  function removeFile(index: number) {
    setFiles((prev) => prev.filter((_, i) => i !== index));
    setResult(null);
  }

  async function exportAll() {
    if (files.length === 0) return;
    setBusy(true);
    setError(null);
    setResult(null);
    try {
      const fd = new FormData();
      for (const f of files) fd.append("files", f);
      fd.append("format", format);
      const res = await fetch("/api/tools/bulk-export", { method: "POST", body: fd });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? "Could not export those files.");
      }
      let counts: FileCount[] = [];
      const rawCounts = res.headers.get("X-Counts");
      if (rawCounts) {
        try {
          counts = JSON.parse(decodeURIComponent(rawCounts)) as FileCount[];
        } catch {
          try {
            counts = JSON.parse(rawCounts) as FileCount[];
          } catch {
            counts = [];
          }
        }
      }
      const blob = await res.blob();
      const objectUrl = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = objectUrl;
      a.download = format === "xlsx" ? "transactions-merged.xlsx" : "transactions-merged.csv";
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(objectUrl);
      setResult({
        counts,
        total: counts.reduce((s, c) => s + c.rows, 0),
        format,
      });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not export those files.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      <ToolUpload
        accept=".qbo,.ofx,.qfx"
        busy={busy}
        busyText="Merging your files…"
        title="Drop QBO, OFX or QFX files here — one at a time"
        meta={["QBO / OFX / QFX", `Up to ${MAX_FILES} files`, "Max 10 MB each"]}
        activeTitle="Release to add the file"
        onFile={addFile}
      />

      {error && (
        <p className="mt-4 rounded-[20px] border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      )}

      {files.length > 0 && (
        <div className="mt-8">
          <div className="rounded-2xl border border-zinc-200 overflow-hidden">
            <div className="px-5 py-3 bg-white border-b border-zinc-200">
              <p className="font-bold text-zinc-900 text-sm">
                {files.length} of {MAX_FILES} files added
              </p>
            </div>
            <ul className="divide-y divide-zinc-100">
              {files.map((f, i) => (
                <li key={`${f.name}-${i}`} className="flex items-center gap-3 px-5 py-2.5 text-sm">
                  <FileSpreadsheet className="h-4 w-4 shrink-0 text-pine-600" />
                  <span className="font-medium text-zinc-900 truncate">{f.name}</span>
                  <span className="text-xs text-zinc-400 shrink-0">{formatSize(f.size)}</span>
                  <button
                    type="button"
                    onClick={() => removeFile(i)}
                    disabled={busy}
                    aria-label={`Remove ${f.name}`}
                    className="ml-auto shrink-0 rounded-full p-1 text-zinc-400 hover:text-zinc-700 disabled:opacity-50"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-3">
            <div className="flex items-center gap-4" role="radiogroup" aria-label="Export format">
              <label className="flex items-center gap-2 text-sm font-medium text-zinc-900 cursor-pointer">
                <input
                  type="radio"
                  name="bulk-export-format"
                  value="csv"
                  checked={format === "csv"}
                  onChange={() => setFormat("csv")}
                  className="h-4 w-4 accent-[#2CA01C]"
                />
                CSV
              </label>
              <label className="flex items-center gap-2 text-sm font-medium text-zinc-900 cursor-pointer">
                <input
                  type="radio"
                  name="bulk-export-format"
                  value="xlsx"
                  checked={format === "xlsx"}
                  onChange={() => setFormat("xlsx")}
                  className="h-4 w-4 accent-[#2CA01C]"
                />
                Excel (.xlsx)
              </label>
            </div>
            <button
              onClick={() => void exportAll()}
              disabled={busy}
              className="inline-flex items-center gap-2 bg-pine-600 text-white font-semibold px-5 py-2.5 rounded-lg hover:bg-pine-700 disabled:opacity-60"
            >
              <Download className="h-4 w-4" /> {busy ? "Merging…" : `Export all ${files.length} file${files.length === 1 ? "" : "s"} as one ${format === "xlsx" ? "Excel file" : "CSV"}`}
            </button>
          </div>
          <p className="mt-3 text-xs text-zinc-400">
            The merged file gets one extra column — Source File — naming the file each transaction came from. Fully free, no account; files are processed in memory and never stored.
          </p>
        </div>
      )}

      {result && (
        <div className="mt-8 rounded-2xl border border-pine-200 bg-pine-50 px-5 py-4">
          <p className="font-semibold text-zinc-900 flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-pine-600" />
            Export complete — {result.total} transactions from {result.counts.length} file{result.counts.length === 1 ? "" : "s"}
          </p>
          <ul className="mt-3 space-y-1.5 text-sm text-zinc-600">
            {result.counts.map((c, i) => (
              <li key={`${c.name}-${i}`} className="flex items-baseline gap-2">
                <span className="truncate">{c.name}</span>
                <span className="ml-auto shrink-0 font-semibold text-zinc-900">{c.rows} rows</span>
              </li>
            ))}
          </ul>
          <p className="mt-3 text-xs text-zinc-500">
            Downloaded as {result.format === "xlsx" ? "transactions-merged.xlsx" : "transactions-merged.csv"} — every row carries its source file name in the last column.
          </p>
        </div>
      )}
    </div>
  );
}
