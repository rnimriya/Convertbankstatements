"use client";

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import {
  Upload, FileText, IndianRupee, AlertCircle,
  CheckCircle2, Lock, Zap,
} from "lucide-react";
import { FreePagesIndicator } from "./FreePagesIndicator";
import { ProcessingResult } from "./ProcessingResult";
import type { BillingContext, ProcessResult } from "@/types/billing";
import { cn } from "@/lib/utils";
import Link from "next/link";

const MAX_FILE_MB = 50;
const FREE_PAGE_CAP = 8;

const BANKS = ["SBI", "HDFC", "ICICI", "Axis", "Kotak", "PNB", "BOB"];

const FORMATS = [
  { id: "csv",    label: "CSV",    sub: "Universal",    dotColor: "#43A047", dotBg: "#E8F5E9" },
  { id: "xlsx",   label: "Excel",  sub: ".xlsx",        dotColor: "#1D6F42", dotBg: "#DCFCE7" },
  { id: "ofx",    label: "OFX",    sub: "Tally / Xero", dotColor: "#1565C0", dotBg: "#DBEAFE" },
  { id: "qfx",    label: "QFX",    sub: "Quicken",      dotColor: "#C2410C", dotBg: "#FEF3C7" },
  { id: "sheets", label: "Sheets", sub: "Google",       dotColor: "#15803D", dotBg: "#DCFCE7" },
] as const;

interface Props {
  billing: BillingContext;
  onBillingUpdate: () => void;
  userEmail?: string;
  hasSheetsAccess?: boolean;
}

type UploadState =
  | { status: "idle" }
  | { status: "processing"; fileName: string }
  | { status: "payment_required"; file: File; pageCount: number; message: string }
  | { status: "done"; result: ProcessResult & { is_demo?: boolean } }
  | { status: "error"; message: string };

export function UploadCard({ billing, onBillingUpdate, userEmail, hasSheetsAccess }: Props) {
  const [state, setState] = useState<UploadState>({ status: "idle" });
  const [formats, setFormats] = useState<string[]>(["csv"]);

  const uploadFile = useCallback(async (file: File) => {
    setState({ status: "processing", fileName: file.name });
    const fd = new FormData();
    fd.append("file", file);
    fd.append("export_formats", formats.join(","));
    try {
      const res = await fetch("/api/process-statement", { method: "POST", body: fd });
      const data = await res.json();
      if (res.status === 402) {
        setState({ status: "payment_required", file, pageCount: data.page_count, message: data.message });
        return;
      }
      // Prefer the human-readable `message` (e.g. the "couldn't read any
      // transactions" explanation) over the machine `error` code.
      if (!res.ok) throw new Error(data.message ?? data.error ?? "Processing failed.");
      setState({ status: "done", result: data });
      onBillingUpdate();
    } catch (e) {
      setState({ status: "error", message: e instanceof Error ? e.message : "Unexpected error." });
    }
  }, [formats, onBillingUpdate]);

  const onDrop = useCallback(
    (accepted: File[], rejected: { file: File; errors: readonly { code: string }[] }[]) => {
      if (rejected.length > 0) {
        setState({
          status: "error",
          message: rejected[0].errors[0]?.code === "file-too-large"
            ? `File exceeds ${MAX_FILE_MB} MB.` : "Only PDF files are accepted.",
        });
        return;
      }
      if (accepted[0]) uploadFile(accepted[0]);
    },
    [uploadFile]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "application/pdf": [".pdf"] },
    maxFiles: 1,
    maxSize: MAX_FILE_MB * 1024 * 1024,
    disabled: state.status === "processing",
  });

  const reset = () => setState({ status: "idle" });

  const toggleFormat = (id: string) => {
    if (formats.includes(id)) {
      if (formats.length === 1) return;
      setFormats(formats.filter(f => f !== id));
    } else {
      setFormats([...formats, id]);
    }
  };

  const freeRemaining = billing.tier === "FREE"
    ? Math.max(0, FREE_PAGE_CAP - billing.pagesUsedThisPeriod)
    : 0;

  // Inline page-usage stats for the compact toolbar.
  const pageLimit = billing.monthlyPageLimit;
  const pagesRemaining = Math.max(0, pageLimit - billing.pagesUsedThisPeriod);
  const usedPct = pageLimit > 0 ? Math.min(100, (billing.pagesUsedThisPeriod / pageLimit) * 100) : 0;
  const lowPages = usedPct > 85;

  /* ── Done ── */
  if (state.status === "done") {
    return (
      <div className="p-6 lg:p-8">
        <ProcessingResult result={state.result} onReset={reset} hasSheetsAccess={hasSheetsAccess} />
      </div>
    );
  }

  /* ── Payment required ── */
  if (state.status === "payment_required") {
    const payState = state as { status: "payment_required"; file: File; pageCount: number; message: string };
    return (
      <div className="p-6 lg:p-8 flex flex-col gap-4 max-w-md mx-auto">
        <FreePagesIndicator tier={billing.tier} pagesUsed={billing.pagesUsedThisPeriod} monthlyPageLimit={billing.monthlyPageLimit} />
        <div className="rounded-3xl border border-amber-200 bg-amber-50 p-8 text-center">
          <div className="mx-auto w-16 h-16 rounded-2xl bg-amber-100 flex items-center justify-center mb-4">
            <IndianRupee className="h-8 w-8 text-amber-600" />
          </div>
          <h3 className="text-xl font-black text-slate-900">Payment Required</h3>
          <p className="mt-1 text-sm font-medium text-slate-600">{payState.file.name}</p>
          <p className="mt-1 text-sm text-slate-500">{payState.message}</p>
          <div className="mt-5 mb-1">
            <span className="text-xl font-extrabold text-slate-900">Upgrade Required</span>
          </div>
          <p className="text-xs text-slate-400 mb-6">Unlock more pages with a Pro or Business plan.</p>
          <div className="flex flex-col gap-2">
            <Link
              href="/pricing"
              className="flex w-full items-center justify-center gap-2 rounded-xl py-3.5 text-sm font-bold text-white bg-navy hover:opacity-90 transition-opacity"
            >
              View Upgrade Plans
            </Link>
            <button onClick={reset} className="w-full py-3 rounded-xl border border-slate-200 bg-white text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors">Cancel</button>
          </div>
        </div>
      </div>
    );
  }

  const isProcessing = state.status === "processing";
  const procState = state as { status: "processing"; fileName: string };

  /* ── Compact, centered upload card ── */
  return (
    <div className="h-full overflow-y-auto">
      <div className="min-h-full flex items-center justify-center p-4 sm:p-6">
        <div className="w-full max-w-xl">

          {/* Error banner */}
          {state.status === "error" && (
            <div className="mb-3 flex items-start gap-2.5 rounded-xl border border-red-100 bg-red-50 px-4 py-2.5 text-sm text-red-700">
              <AlertCircle size={15} className="mt-0.5 shrink-0 text-red-500" />
              <span className="flex-1">{state.message}</span>
              <button onClick={reset} className="shrink-0 font-bold text-red-400 hover:text-red-600">✕</button>
            </div>
          )}

          <div className="rounded-3xl border border-slate-200 bg-white shadow-sm overflow-hidden dark:border-white/10 dark:bg-surface">

            {/* ── Drop zone ── */}
            <div className="p-3">
              <div
                {...(isProcessing ? {} : getRootProps())}
                className={cn(
                  "relative flex flex-col items-center justify-center rounded-2xl border-2 border-dashed px-6 py-8 text-center transition-colors select-none",
                  isProcessing
                    ? "border-slate-200 dark:border-white/10"
                    : "cursor-pointer",
                  !isProcessing && (isDragActive
                    ? "border-navy bg-blue-50/70 dark:bg-brand-400/10"
                    : "border-slate-200 bg-slate-50/60 hover:border-navy/40 hover:bg-slate-50 dark:border-white/10 dark:bg-white/5")
                )}
              >
                {!isProcessing && <input {...getInputProps()} />}

                {isProcessing ? (
                  /* Processing (compact) */
                  <div className="flex flex-col items-center gap-4 py-2">
                    <div className="relative h-16 w-16">
                      <svg className="h-full w-full animate-spin" style={{ animationDuration: "2s" }} viewBox="0 0 112 112">
                        <circle cx="56" cy="56" r="48" fill="none" stroke="#e2e8f0" strokeWidth="6" />
                        <circle cx="56" cy="56" r="48" fill="none" stroke="#1A47C8" strokeWidth="6" strokeLinecap="round"
                          strokeDasharray={`${2 * Math.PI * 48 * 0.75} ${2 * Math.PI * 48 * 0.25}`} />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <FileText size={24} className="text-navy" />
                      </div>
                    </div>
                    <div>
                      <p className="text-lg font-black text-slate-900 dark:text-white">Converting…</p>
                      <p className="mt-0.5 max-w-[260px] truncate text-sm text-slate-400">{procState.fileName}</p>
                    </div>
                    <div className="h-1.5 w-48 overflow-hidden rounded-full bg-slate-200 dark:bg-white/10">
                      <div className="h-full rounded-full" style={{
                        background: "linear-gradient(90deg,#1A47C8,#6366f1,#a855f7,#1A47C8)",
                        backgroundSize: "300% 100%",
                        animation: "progressShimmer 1.8s linear infinite",
                      }} />
                    </div>
                  </div>
                ) : (
                  /* Idle (compact) */
                  <>
                    <div
                      className="mb-3 flex h-14 w-14 items-center justify-center rounded-2xl transition-all duration-300"
                      style={{
                        background: isDragActive ? "linear-gradient(145deg,#0f35b8,#1A47C8)" : "linear-gradient(145deg,#1A47C8,#4a78f5)",
                        boxShadow: isDragActive ? "0 14px 34px rgba(26,71,200,0.45)" : "0 8px 22px rgba(26,71,200,0.24)",
                        transform: isDragActive ? "scale(1.06)" : "scale(1)",
                      }}
                    >
                      {isDragActive
                        ? <FileText size={26} className="text-white" strokeWidth={1.6} />
                        : <Upload size={26} className="text-white" strokeWidth={1.6} />}
                    </div>

                    <h2 className="text-xl font-black tracking-tight text-slate-900 dark:text-white">
                      {isDragActive ? "Release to convert" : "Drop your statement PDF"}
                    </h2>
                    <p className="mt-1 text-sm text-slate-400">
                      or <span className="font-bold text-navy underline decoration-navy/30 underline-offset-2 dark:text-brand-400">browse files</span>
                    </p>

                    <div className="mt-3 flex items-center gap-2 text-xs text-slate-400">
                      <span>PDF only</span>
                      <span className="h-1 w-1 rounded-full bg-slate-300" />
                      <span>Max {MAX_FILE_MB} MB</span>
                      <span className="h-1 w-1 rounded-full bg-slate-300" />
                      <span>Password OK</span>
                    </div>

                    <p className="mt-2 text-[11px] text-slate-400 dark:text-gray-500">
                      {BANKS.join(" · ")} <span className="text-slate-300 dark:text-gray-600">+23 more</span>
                    </p>

                    {billing.tier === "FREE" && freeRemaining > 0 && (
                      <div className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 dark:border-emerald-900 dark:bg-emerald-900/20 dark:text-emerald-400">
                        <CheckCircle2 size={12} /> {freeRemaining} free page{freeRemaining !== 1 ? "s" : ""} left
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>

            {/* ── Toolbar: format + pages + trust ── */}
            {!isProcessing && (
              <div className="border-t border-slate-100 px-4 py-3.5 dark:border-white/10">
                {/* Format pills */}
                <div className="flex flex-wrap items-center gap-2">
                  <span className="shrink-0 text-[10px] font-black uppercase tracking-[0.14em] text-slate-400">Format</span>
                  {FORMATS.map(f => {
                    const active = formats.includes(f.id);
                    return (
                      <button
                        key={f.id}
                        onClick={() => toggleFormat(f.id)}
                        className={cn(
                          "flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-[13px] font-bold transition-all",
                          active
                            ? "border-transparent text-white shadow-sm"
                            : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 dark:border-white/10 dark:bg-surface dark:text-gray-300"
                        )}
                        style={active ? { background: "linear-gradient(135deg,#1A47C8,#4a78f5)" } : {}}
                      >
                        <span
                          className="flex h-4 w-4 items-center justify-center rounded text-[9px] font-black"
                          style={{ background: active ? "rgba(255,255,255,0.22)" : f.dotBg, color: active ? "#fff" : f.dotColor }}
                        >
                          {f.label[0]}
                        </span>
                        {f.label}
                      </button>
                    );
                  })}
                </div>

                {/* Pages usage + trust */}
                <div className="mt-3 flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
                  <div className="flex min-w-0 max-w-[260px] flex-1 items-center gap-2.5">
                    <span className="shrink-0 text-[10px] font-black uppercase tracking-[0.14em] text-slate-400">Pages</span>
                    <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-slate-100 dark:bg-white/10">
                      <div className={cn("h-full rounded-full transition-all", lowPages ? "bg-amber-400" : "bg-navy")} style={{ width: `${usedPct}%` }} />
                    </div>
                    <span className={cn("shrink-0 text-[11px] font-bold tabular-nums", lowPages ? "text-amber-600" : "text-slate-500 dark:text-gray-400")}>
                      {pagesRemaining}/{pageLimit}
                    </span>
                  </div>
                  <div className="flex shrink-0 items-center gap-3">
                    <span className="flex items-center gap-1 text-[11px] text-slate-400"><Lock size={11} /> Not stored on our servers</span>
                    <span className="flex items-center gap-1 text-[11px] text-slate-400"><Zap size={11} className="text-amber-400" /> ~11s</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
