"use client";

import { useCallback, useState } from"react";
import { useDropzone } from"react-dropzone";
import {
  Upload, FileText, DollarSign, AlertCircle,
  CheckCircle2, Lock, Zap,
} from"lucide-react";
import { FreePagesIndicator } from"./FreePagesIndicator";
import { ProcessingResult } from"./ProcessingResult";
import type { BillingContext, ProcessResult } from"@/types/billing";
import { cn } from"@/lib/utils";
import Link from"next/link";

const MAX_FILE_MB = 50;
const FREE_PAGE_CAP = 8;

const BANKS = ["SBI","HDFC","ICICI","Axis","Kotak","PNB","BOB"];

const FORMATS = [
  { id:"csv",    label:"CSV",    sub:"Universal",    dotColor:"#43A047", dotBg:"#E8F5E9" },
  { id:"xlsx",   label:"Excel",  sub:".xlsx",        dotColor:"#1D6F42", dotBg:"#DCFCE7" },
  { id:"ofx",    label:"OFX",    sub:"Tally / Xero", dotColor:"#1565C0", dotBg:"#DBEAFE" },
  { id:"qfx",    label:"QFX",    sub:"Quicken",      dotColor:"#C2410C", dotBg:"#FEF3C7" },
  { id:"sheets", label:"Sheets", sub:"Google",       dotColor:"#15803D", dotBg:"#DCFCE7" },
] as const;

interface Props {
  billing: BillingContext;
  onBillingUpdate: () => void;
  userEmail?: string;
  hasSheetsAccess?: boolean;
  fullWidth?: boolean;
}

type UploadState =
  | { status:"idle" }
  | { status:"processing"; fileName: string }
  | { status:"payment_required"; file: File; pageCount: number; message: string }
  | { status:"done"; result: ProcessResult & { is_demo?: boolean } }
  | { status:"error"; message: string };

export function UploadCard({ billing, onBillingUpdate, userEmail, hasSheetsAccess, fullWidth }: Props) {
  const [state, setState] = useState<UploadState>({ status:"idle" });
  const [formats, setFormats] = useState<string[]>(["csv"]);

  const uploadFile = useCallback(async (file: File) => {
    setState({ status:"processing", fileName: file.name });
    const fd = new FormData();
    fd.append("file", file);
    fd.append("export_formats", formats.join(","));
    try {
      const res = await fetch("/api/process-statement", { method:"POST", body: fd });
      const data = await res.json();
      if (res.status === 402) {
        setState({ status:"payment_required", file, pageCount: data.page_count, message: data.message });
        return;
      }
      // Prefer the human-readable `message` (e.g. the"couldn't read any
      // transactions" explanation) over the machine `error` code.
      if (!res.ok) throw new Error(data.message ?? data.error ??"Processing failed.");
      setState({ status:"done", result: data });
      onBillingUpdate();
    } catch (e) {
      setState({ status:"error", message: e instanceof Error ? e.message :"Unexpected error." });
    }
  }, [formats, onBillingUpdate]);

  const onDrop = useCallback(
    (accepted: File[], rejected: { file: File; errors: readonly { code: string }[] }[]) => {
      if (rejected.length > 0) {
        setState({
          status:"error",
          message: rejected[0].errors[0]?.code ==="file-too-large"
            ? `File exceeds ${MAX_FILE_MB} MB.` :"Only PDF files are accepted.",
        });
        return;
      }
      if (accepted[0]) uploadFile(accepted[0]);
    },
    [uploadFile]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {"application/pdf": [".pdf"] },
    maxFiles: 1,
    maxSize: MAX_FILE_MB * 1024 * 1024,
    disabled: state.status ==="processing",
  });

  const reset = () => setState({ status:"idle" });

  const toggleFormat = (id: string) => {
    if (formats.includes(id)) {
      if (formats.length === 1) return;
      setFormats(formats.filter(f => f !== id));
    } else {
      setFormats([...formats, id]);
    }
  };

  const freeRemaining = billing.tier ==="FREE"
    ? Math.max(0, FREE_PAGE_CAP - billing.pagesUsedThisPeriod)
    : 0;

  // Inline page-usage stats for the compact toolbar.
  const pageLimit = billing.monthlyPageLimit;
  const pagesRemaining = Math.max(0, pageLimit - billing.pagesUsedThisPeriod);
  const usedPct = pageLimit > 0 ? Math.min(100, (billing.pagesUsedThisPeriod / pageLimit) * 100) : 0;
  const lowPages = usedPct > 85;

  /* ── Done ── */
  if (state.status ==="done") {
    return (
      <div className="p-6 lg:p-8">
        <ProcessingResult result={state.result} onReset={reset} hasSheetsAccess={hasSheetsAccess} />
      </div>
    );
  }

  /* ── Payment required ── */
  if (state.status ==="payment_required") {
    const payState = state as { status:"payment_required"; file: File; pageCount: number; message: string };
    return (
      <div className="p-6 lg:p-8 flex flex-col gap-4 max-w-md mx-auto">
        <FreePagesIndicator tier={billing.tier} pagesUsed={billing.pagesUsedThisPeriod} monthlyPageLimit={billing.monthlyPageLimit} />
        <div className="rounded-3xl border border-amber-200 bg-amber-50 p-8 text-center">
          <div className="mx-auto w-16 h-16 rounded-2xl bg-amber-100 flex items-center justify-center mb-4">
            <DollarSign className="h-8 w-8 text-amber-600 text-rose-500 dark:text-rose-400" />
          </div>
          <h3 className="text-xl font-black text-brand-text">Payment Required</h3>
          <p className="mt-1 text-sm font-medium text-brand-muted">{payState.file.name}</p>
          <p className="mt-2 text-base text-brand-muted">{payState.message}</p>
          <div className="mt-5 mb-1">
            <span className="text-xl font-extrabold text-brand-text">Upgrade Required</span>
          </div>
          <p className="text-xs text-brand-muted mb-6">Unlock more pages with a Pro or Business plan.</p>
          <div className="flex flex-col gap-2">
            <Link
              href="/pricing"
              className="flex w-full items-center justify-center gap-2 rounded-xl py-3.5 text-sm font-bold text-white bg-black hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200 transition-colors"
            >
              View Upgrade Plans
            </Link>
            <button onClick={reset} className="w-full py-3 rounded-xl border border-zinc-200 bg-brand-bg text-sm font-medium text-zinc-600 hover:bg-zinc-50 transition-colors">Cancel</button>
          </div>
        </div>
      </div>
    );
  }

  const isProcessing = state.status ==="processing";
  const procState = state as { status:"processing"; fileName: string };

  /* ── Compact, centered upload card ── */
  return (
    <div className="h-full overflow-y-auto">
      <div className="min-h-full flex items-center justify-center p-4 sm:p-6">
        <div className={cn("w-full", fullWidth ?"max-w-full" :"max-w-4xl")}>

          {/* Error banner */}
          {state.status ==="error" && (
            <div className="mb-3 flex items-start gap-2.5 rounded-xl border border-red-100 bg-red-50 px-4 py-2.5 text-sm text-red-700">
              <AlertCircle size={15} className="mt-0.5 shrink-0 text-red-500 text-amber-500 dark:text-amber-400" />
              <span className="flex-1">{state.message}</span>
              <button onClick={reset} className="shrink-0 font-bold text-red-400 hover:text-red-600">✕</button>
            </div>
          )}

          <div className="rounded-3xl border border-brand-border bg-brand-bg shadow-sm overflow-hidden">

            {/* ── Drop zone ── */}
            <div className="p-3">
              <div
                {...(isProcessing ? {} : getRootProps())}
                className={cn("relative flex flex-col items-center justify-center rounded-2xl border-2 border-dashed px-6 py-12 lg:py-16 text-center transition-colors select-none",
                  isProcessing
                    ?"border-zinc-200"
                    :"cursor-pointer",
                  !isProcessing && (isDragActive
                    ?"border-zinc-900 dark:border-zinc-100 bg-brand-surface"
                    :"border-brand-border bg-zinc-50/60 dark:bg-zinc-900/50 hover:border-zinc-400 dark:hover:border-zinc-600 hover:bg-brand-surface/80")
                )}
              >
                {!isProcessing && <input {...getInputProps()} />}

                {isProcessing ? (
                  /* Processing (compact) */
                  <div className="flex flex-col items-center gap-4 py-2">
                    <div className="relative h-16 w-16">
                      <svg className="h-full w-full animate-spin" style={{ animationDuration:"2s" }} viewBox="0 0 112 112">
                        <circle cx="56" cy="56" r="48" fill="none" stroke="#e4e4e7" strokeWidth="6" />
                        <circle cx="56" cy="56" r="48" fill="none" stroke="#18181b" strokeWidth="6" strokeLinecap="round"
                          strokeDasharray={`${2 * Math.PI * 48 * 0.75} ${2 * Math.PI * 48 * 0.25}`} />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <FileText size={24} className="dark: text-indigo-500 dark:text-indigo-400" />
                      </div>
                    </div>
                    <div>
                      <p className="text-lg font-black text-brand-text">Converting…</p>
                      <p className="mt-0.5 max-w-[260px] truncate text-sm text-brand-muted">{procState.fileName}</p>
                    </div>
                    <div className="h-1.5 w-48 overflow-hidden rounded-full bg-zinc-200">
                      <div className="h-full rounded-full" style={{
                        background:"linear-gradient(90deg,#52525b,#18181b,#52525b)",
                        backgroundSize:"300% 100%",
                        animation:"progressShimmer 1.8s linear infinite",
                      }} />
                    </div>
                  </div>
                ) : (
                  /* Idle (compact) */
                  <>
                    <div
                      className="mb-3 flex h-14 w-14 items-center justify-center rounded-2xl transition-all duration-300"
                      style={{
                        background: isDragActive ?"#09090b" :"#18181b",
                        transform: isDragActive ?"scale(1.06)" :"scale(1)",
                      }}
                    >
                      {isDragActive
                        ? <FileText size={26} className="text-white text-indigo-500 dark:text-indigo-400" strokeWidth={1.6} />
                        : <Upload size={26} className="text-white text-blue-500 dark:text-blue-400" strokeWidth={1.6} />}
                    </div>

                    <h2 className="text-2xl lg:text-3xl font-black tracking-tight text-brand-text">
                      {isDragActive ?"Release to convert" :"Drop your statement PDF"}
                    </h2>
                    <p className="mt-1 text-sm text-brand-muted">
                      or <span className="font-bold text-brand-text underline decoration-zinc-300 dark:decoration-zinc-700 underline-offset-2">browse files</span>
                    </p>

                    <div className="mt-3 flex items-center gap-2 text-xs text-brand-muted">
                      <span>PDF only</span>
                      <span className="h-1 w-1 rounded-full bg-zinc-300" />
                      <span>Max {MAX_FILE_MB} MB</span>
                      <span className="h-1 w-1 rounded-full bg-zinc-300" />
                      <span>Password OK</span>
                    </div>

                    <p className="mt-2 text-[11px] text-brand-muted">
                      {BANKS.join(" ·")} <span className="text-zinc-300 dark:text-zinc-600">+23 more</span>
                    </p>

                    {billing.tier ==="FREE" && freeRemaining > 0 && (
                      <div className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 dark:border-emerald-900 dark:bg-emerald-900/20 dark:text-emerald-400">
                        <CheckCircle2 className="text-emerald-500 dark:text-emerald-400"  size={12} /> {freeRemaining} free page{freeRemaining !== 1 ?"s" :""} left
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>

            {/* ── Toolbar: format + pages + trust ── */}
            {!isProcessing && (
              <div className="border-t border-zinc-100 dark:border-zinc-800 px-4 py-3.5">
                {/* Format pills */}
                <div className="flex flex-wrap items-center gap-2">
                  <span className="shrink-0 text-[10px] font-black uppercase tracking-[0.14em] text-brand-muted">Format</span>
                  {FORMATS.map(f => {
                    const active = formats.includes(f.id);
                    return (
                      <button
                        key={f.id}
                        onClick={() => toggleFormat(f.id)}
                        className={cn("flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-[13px] font-bold transition-all",
                          active
                            ?"border-transparent text-white bg-zinc-900 dark:bg-zinc-100 dark:text-zinc-900"
                            :"border-brand-border bg-brand-bg text-brand-muted hover:border-zinc-300 dark:hover:border-zinc-700"
                        )}
                      >
                        <span
                          className={cn("flex h-4 w-4 items-center justify-center rounded text-[9px] font-black",
                            active &&"bg-white/20 text-white dark:bg-black/10 dark:text-black"
                          )}
                          style={active ? {} : { background: f.dotBg, color: f.dotColor }}
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
                    <span className="shrink-0 text-[10px] font-black uppercase tracking-[0.14em] text-brand-muted">Pages</span>
                    <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-brand-surface">
                      <div className={cn("h-full rounded-full transition-all", lowPages ?"bg-amber-400" :"bg-zinc-900 dark:bg-zinc-100")} style={{ width: `${usedPct}%` }} />
                    </div>
                    <span className={cn("shrink-0 text-[11px] font-bold tabular-nums", lowPages ?"text-amber-600" :"text-brand-muted")}>
                      {pagesRemaining}/{pageLimit}
                    </span>
                  </div>
                  <div className="flex shrink-0 items-center gap-3">
                    <span className="flex items-center gap-1 text-[11px] text-brand-muted"><Lock className="text-rose-500 dark:text-rose-400"  size={11} /> Not stored on our servers</span>
                    <span className="flex items-center gap-1 text-[11px] text-brand-muted"><Zap size={11} className="text-amber-400 text-amber-500 dark:text-amber-400" /> ~11s</span>
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
