"use client";

import { useState, useCallback } from"react";
import { useDropzone } from"react-dropzone";
import {
  Upload, FileText, Loader2, CheckCircle2, AlertCircle,
  Download, FileSpreadsheet, X, Merge,
} from"lucide-react";
import { cn } from"@/lib/utils";
import type { BillingContext } from"@/types/billing";

const MAX_FILES = 20;
const MAX_SIZE_MB = 50;

interface FileResult {
  fileName: string;
  pageCount: number;
  transactionCount: number;
  bankName: string | null;
  exportUrls: { csv?: string; xlsx?: string };
  error?: string;
}

interface Transaction {
  date: string;
  description: string;
  amount: number;
  balance: number;
  type: string;
}

interface Props {
  billing: BillingContext;
  onBillingUpdate: () => void;
}

type Phase ="idle" |"processing" |"done" |"error";

export function BulkUploadCard({ billing, onBillingUpdate }: Props) {
  const [phase, setPhase] = useState<Phase>("idle");
  const [results, setResults] = useState<FileResult[]>([]);
  const [errorMsg, setErrorMsg] = useState("");
  const [merging, setMerging] = useState(false);
  const [mergeUrl, setMergeUrl] = useState<string | null>(null);

  const processFiles = useCallback(async (files: File[]) => {
    setPhase("processing");
    setResults([]);
    setMergeUrl(null);

    const fd = new FormData();
    for (const file of files.slice(0, MAX_FILES)) {
      fd.append("files[]", file);
    }
    fd.append("export_formats","csv,xlsx");

    try {
      const res = await fetch("/api/bulk-process", { method:"POST", body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message ?? data.error ??"Bulk processing failed");
      setResults(data.results ?? []);
      setPhase("done");
      onBillingUpdate();
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message :"Something went wrong.");
      setPhase("error");
    }
  }, [onBillingUpdate]);

  const onDrop = useCallback(
    (accepted: File[]) => {
      if (accepted.length === 0) return;
      processFiles(accepted);
    },
    [processFiles]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {"application/pdf": [".pdf"],"application/zip": [".zip"],"application/x-zip-compressed": [".zip"],
    },
    maxFiles: MAX_FILES,
    maxSize: MAX_SIZE_MB * 1024 * 1024,
    disabled: phase ==="processing",
  });

  async function mergeAll() {
    setMerging(true);
    try {
      const res = await fetch("/api/merge-statements", {
        method:"POST",
        headers: {"Content-Type":"application/json" },
        body: JSON.stringify({ results }),
      });
      const data = await res.json();
      if (res.ok) setMergeUrl(data.xlsx);
    } catch { /* non-fatal */ }
    setMerging(false);
  }

  const hasMultipleBanks = new Set(results.map(r => r.bankName).filter(Boolean)).size > 1;
  const successCount = results.filter(r => !r.error).length;

  if (phase ==="done") {
    return (
      <div className="space-y-4">
        {/* Summary */}
        <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-2xl p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 size={18} className="text-emerald-600 text-emerald-500 dark:text-emerald-400" />
            <span className="font-semibold text-emerald-800 dark:text-emerald-300 text-sm">
              {successCount} of {results.length} files converted
            </span>
          </div>
          <button
            onClick={() => { setPhase("idle"); setResults([]); setMergeUrl(null); }}
            className="text-xs text-zinc-400 dark:text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-gray-300 flex items-center gap-1"
          >
            <X className="text-rose-500 dark:text-rose-400"  size={12} /> Reset
          </button>
        </div>

        {/* Multi-bank merge offer */}
        {hasMultipleBanks && successCount > 1 && (
          <div className="bg-zinc-900 dark:bg-zinc-950/5 dark:bg-zinc-800/40 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-4 flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">Multiple banks detected</p>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">Merge all into one chronologically-sorted Excel sheet</p>
            </div>
            {mergeUrl ? (
              <a
                href={mergeUrl}
                download="Merged_Statements.xlsx"
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-zinc-900 dark:bg-zinc-950 text-white text-xs font-semibold hover:opacity-90 transition-opacity whitespace-nowrap"
              >
                <Download className="text-emerald-500 dark:text-emerald-400"  size={12} /> Download merged
              </a>
            ) : (
              <button
                onClick={mergeAll}
                disabled={merging}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-zinc-900 dark:bg-zinc-950 text-white text-xs font-semibold hover:opacity-90 disabled:opacity-60 transition-opacity whitespace-nowrap"
              >
                {merging ? <Loader2 size={12} className="animate-spin text-purple-500 dark:text-purple-400" /> : <Merge className="text-emerald-500 dark:text-emerald-400"  size={12} />}
                {merging ?"Merging…" :"Merge all banks"}
              </button>
            )}
          </div>
        )}

        {/* Individual file results */}
        <div className="space-y-2">
          {results.map((r, i) => (
            <div key={i} className={`rounded-xl p-4 flex items-center gap-3 border ${r.error ?"border-red-200 dark:border-red-800 bg-red-50/30 dark:bg-red-900/10" :"border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950"}`}>
              {r.error ? (
                <AlertCircle size={16} className="text-red-400 shrink-0 text-amber-500 dark:text-amber-400" />
              ) : (
                <FileSpreadsheet size={16} className="text-emerald-500 shrink-0 text-indigo-500 dark:text-indigo-400" />
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-zinc-800 dark:text-white truncate">{r.fileName}</p>
                {r.error ? (
                  <p className="text-xs text-red-500 dark:text-red-400">{r.error}</p>
                ) : (
                  <p className="text-xs text-zinc-400 dark:text-zinc-500">{r.transactionCount} transactions · {r.pageCount} pages{r.bankName ? ` · ${r.bankName}` :""}</p>
                )}
              </div>
              {!r.error && (
                <div className="flex gap-1.5 shrink-0">
                  {r.exportUrls.xlsx && (
                    <a href={r.exportUrls.xlsx} download={r.fileName.replace(".pdf",".xlsx")}
                      className="px-2.5 py-1.5 rounded-lg bg-zinc-900 dark:bg-zinc-950/10 dark:bg-brand-400/10 text-zinc-900 dark:text-zinc-100 text-xs font-semibold hover:bg-zinc-900 dark:bg-zinc-950/20 dark:hover:bg-brand-400/20 transition-colors">
                      .xlsx
                    </a>
                  )}
                  {r.exportUrls.csv && (
                    <a href={r.exportUrls.csv} download={r.fileName.replace(".pdf",".csv")}
                      className="px-2.5 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-300 text-xs font-semibold hover:border-zinc-300 dark:border-zinc-700 dark:hover:border-white/20 transition-colors">
                      .csv
                    </a>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {phase ==="error" && (
        <div className="flex items-start gap-3 px-4 py-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-sm text-red-700 dark:text-red-400">
          <AlertCircle size={16} className="shrink-0 mt-0.5 text-red-500 text-amber-500 dark:text-amber-400" />
          <span className="flex-1">{errorMsg}</span>
          <button onClick={() => setPhase("idle")} className="shrink-0 text-red-400 hover:text-red-600 font-medium">✕</button>
        </div>
      )}

      <div
        {...getRootProps()}
        className={cn("relative flex min-h-[240px] cursor-pointer flex-col items-center justify-center gap-4","rounded-2xl border-2 border-dashed px-8 py-12 text-center transition-all duration-200 select-none",
          isDragActive ?"border-zinc-900 dark:border-zinc-100 bg-zinc-100 dark:bg-zinc-900 scale-[1.01]" :"border-zinc-200 dark:border-zinc-800 bg-zinc-50/60 dark:bg-zinc-900/50 hover:border-zinc-400 dark:hover:border-zinc-600 hover:bg-zinc-100 dark:hover:bg-zinc-800",
          phase ==="processing" &&"pointer-events-none opacity-70"
        )}
      >
        <input {...getInputProps()} />

        {phase ==="processing" ? (
          <>
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-zinc-100 dark:bg-zinc-900">
              <Loader2 className="h-8 w-8 dark:animate-spin text-purple-500 dark:text-purple-400" />
            </div>
            <div>
              <p className="font-semibold text-zinc-800 dark:text-white">Processing files…</p>
              <p className="mt-1 text-sm text-zinc-400 dark:text-zinc-500">Converting sequentially · please wait</p>
            </div>
          </>
        ) : (
          <>
            <div className={cn("flex h-16 w-16 items-center justify-center rounded-2xl transition-all duration-200",
              isDragActive ?"bg-zinc-900 dark:bg-zinc-950 text-white scale-110" :"bg-white dark:bg-zinc-950 border-2 border-zinc-200 dark:border-zinc-800 text-zinc-400 dark:text-zinc-500"
            )}>
              {isDragActive ? <FileText className="h-8 w-8 text-indigo-500 dark:text-indigo-400" /> : <Upload className="h-8 w-8 text-blue-500 dark:text-blue-400" />}
            </div>
            <div>
              <p className="text-base font-semibold text-zinc-700 dark:text-zinc-200">
                {isDragActive ?"Drop files here!" :"Drop multiple PDFs or a ZIP file"}
              </p>
              <p className="mt-1 text-sm text-zinc-400 dark:text-zinc-500">or <span className="font-semibold text-zinc-900 dark:text-zinc-100 underline underline-offset-2">browse files</span></p>
              <p className="mt-2 text-xs text-zinc-400 dark:text-zinc-500">Up to {MAX_FILES} PDFs or one .zip · max {MAX_SIZE_MB} MB each</p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
