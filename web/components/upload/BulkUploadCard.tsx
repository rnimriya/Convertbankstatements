"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import {
  Upload, FileText, Loader2, CheckCircle2, AlertCircle,
  Download, FileSpreadsheet, X, Merge,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { BillingContext } from "@/types/billing";

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

type Phase = "idle" | "processing" | "done" | "error";

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
    fd.append("export_formats", "csv,xlsx");

    try {
      const res = await fetch("/api/bulk-process", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message ?? data.error ?? "Bulk processing failed");
      setResults(data.results ?? []);
      setPhase("done");
      onBillingUpdate();
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : "Something went wrong.");
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
    accept: {
      "application/pdf": [".pdf"],
      "application/zip": [".zip"],
      "application/x-zip-compressed": [".zip"],
    },
    maxFiles: MAX_FILES,
    maxSize: MAX_SIZE_MB * 1024 * 1024,
    disabled: phase === "processing",
  });

  async function mergeAll() {
    setMerging(true);
    try {
      const res = await fetch("/api/merge-statements", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ results }),
      });
      const data = await res.json();
      if (res.ok) setMergeUrl(data.xlsx);
    } catch { /* non-fatal */ }
    setMerging(false);
  }

  const hasMultipleBanks = new Set(results.map(r => r.bankName).filter(Boolean)).size > 1;
  const successCount = results.filter(r => !r.error).length;

  if (phase === "done") {
    return (
      <div className="space-y-4">
        {/* Summary */}
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 size={18} className="text-emerald-600" />
            <span className="font-semibold text-emerald-800 text-sm">
              {successCount} of {results.length} files converted
            </span>
          </div>
          <button
            onClick={() => { setPhase("idle"); setResults([]); setMergeUrl(null); }}
            className="text-xs text-slate-400 hover:text-slate-600 flex items-center gap-1"
          >
            <X size={12} /> Reset
          </button>
        </div>

        {/* Multi-bank merge offer */}
        {hasMultipleBanks && successCount > 1 && (
          <div className="bg-navy/5 border border-navy/20 rounded-2xl p-4 flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-navy">Multiple banks detected</p>
              <p className="text-xs text-slate-500 mt-0.5">Merge all into one chronologically-sorted Excel sheet</p>
            </div>
            {mergeUrl ? (
              <a
                href={mergeUrl}
                download="Merged_Statements.xlsx"
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-navy text-white text-xs font-semibold hover:opacity-90 transition-opacity whitespace-nowrap"
              >
                <Download size={12} /> Download merged
              </a>
            ) : (
              <button
                onClick={mergeAll}
                disabled={merging}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-navy text-white text-xs font-semibold hover:opacity-90 disabled:opacity-60 transition-opacity whitespace-nowrap"
              >
                {merging ? <Loader2 size={12} className="animate-spin" /> : <Merge size={12} />}
                {merging ? "Merging…" : "Merge all banks"}
              </button>
            )}
          </div>
        )}

        {/* Individual file results */}
        <div className="space-y-2">
          {results.map((r, i) => (
            <div key={i} className={`bg-white border rounded-xl p-4 flex items-center gap-3 ${r.error ? "border-red-200 bg-red-50/30" : "border-slate-200"}`}>
              {r.error ? (
                <AlertCircle size={16} className="text-red-400 shrink-0" />
              ) : (
                <FileSpreadsheet size={16} className="text-emerald-500 shrink-0" />
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-800 truncate">{r.fileName}</p>
                {r.error ? (
                  <p className="text-xs text-red-500">{r.error}</p>
                ) : (
                  <p className="text-xs text-slate-400">{r.transactionCount} transactions · {r.pageCount} pages{r.bankName ? ` · ${r.bankName}` : ""}</p>
                )}
              </div>
              {!r.error && (
                <div className="flex gap-1.5 shrink-0">
                  {r.exportUrls.xlsx && (
                    <a href={r.exportUrls.xlsx} download={r.fileName.replace(".pdf", ".xlsx")}
                      className="px-2.5 py-1.5 rounded-lg bg-navy/10 text-navy text-xs font-semibold hover:bg-navy/20 transition-colors">
                      .xlsx
                    </a>
                  )}
                  {r.exportUrls.csv && (
                    <a href={r.exportUrls.csv} download={r.fileName.replace(".pdf", ".csv")}
                      className="px-2.5 py-1.5 rounded-lg border border-slate-200 text-slate-600 text-xs font-semibold hover:border-slate-300 transition-colors">
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
      {phase === "error" && (
        <div className="flex items-start gap-3 px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
          <AlertCircle size={16} className="shrink-0 mt-0.5 text-red-500" />
          <span className="flex-1">{errorMsg}</span>
          <button onClick={() => setPhase("idle")} className="shrink-0 text-red-400 hover:text-red-600 font-medium">✕</button>
        </div>
      )}

      <div
        {...getRootProps()}
        className={cn(
          "relative flex min-h-[240px] cursor-pointer flex-col items-center justify-center gap-4",
          "rounded-2xl border-2 border-dashed px-8 py-12 text-center transition-all duration-200 select-none",
          isDragActive
            ? "border-navy bg-navy/5 scale-[1.01]"
            : "border-slate-200 bg-slate-50/60 hover:border-navy/40 hover:bg-navy/[0.02]",
          phase === "processing" && "pointer-events-none opacity-70"
        )}
      >
        <input {...getInputProps()} />

        {phase === "processing" ? (
          <>
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-navy/10">
              <Loader2 className="h-8 w-8 text-navy animate-spin" />
            </div>
            <div>
              <p className="font-semibold text-slate-800">Processing files…</p>
              <p className="mt-1 text-sm text-slate-400">Converting sequentially · please wait</p>
            </div>
          </>
        ) : (
          <>
            <div className={cn(
              "flex h-16 w-16 items-center justify-center rounded-2xl transition-all duration-200",
              isDragActive ? "bg-navy text-white scale-110" : "bg-white border-2 border-slate-200 text-slate-400"
            )}>
              {isDragActive ? <FileText className="h-8 w-8" /> : <Upload className="h-8 w-8" />}
            </div>
            <div>
              <p className="text-base font-semibold text-slate-700">
                {isDragActive ? "Drop files here!" : "Drop multiple PDFs or a ZIP file"}
              </p>
              <p className="mt-1 text-sm text-slate-400">or <span className="font-semibold text-navy underline underline-offset-2">browse files</span></p>
              <p className="mt-2 text-xs text-slate-400">Up to {MAX_FILES} PDFs or one .zip · max {MAX_SIZE_MB} MB each</p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
