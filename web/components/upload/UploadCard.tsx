"use client";

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import {
  Upload, FileText, IndianRupee, AlertCircle,
  Loader2, CheckCircle2, Lock, Zap, ChevronRight,
} from "lucide-react";
import { FreePagesIndicator } from "./FreePagesIndicator";
import { ProcessingResult } from "./ProcessingResult";
import { RazorpayCheckout } from "@/components/payment/RazorpayCheckout";
import type { BillingContext, ProcessResult } from "@/types/billing";
import { cn } from "@/lib/utils";

const MAX_FILE_MB = 50;
const FREE_PAGE_CAP = 8;

const BANKS = ["SBI", "HDFC", "ICICI", "Axis", "Kotak", "PNB", "BOB", "Canara", "Union"];

const FORMATS = [
  { id: "csv",    label: "CSV",    sub: "Universal",    color: "#43A047", bg: "#E8F5E9" },
  { id: "xlsx",   label: "Excel",  sub: ".xlsx",        color: "#1D6F42", bg: "#E8F5E9" },
  { id: "ofx",    label: "OFX",    sub: "Tally/Xero",   color: "#1565C0", bg: "#E3F2FD" },
  { id: "qfx",    label: "QFX",    sub: "Quicken",      color: "#E65100", bg: "#FFF3E0" },
  { id: "sheets", label: "Sheets", sub: "Google",       color: "#34A853", bg: "#E8F5E9" },
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
      if (!res.ok) throw new Error(data.error ?? "Processing failed.");
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

  if (state.status === "done") {
    return <ProcessingResult result={state.result} onReset={reset} hasSheetsAccess={hasSheetsAccess} />;
  }

  if (state.status === "payment_required") {
    return (
      <div className="max-w-md mx-auto space-y-4">
        <FreePagesIndicator tier={billing.tier} pagesUsed={billing.pagesUsedThisPeriod} monthlyPageLimit={billing.monthlyPageLimit} />
        <div className="rounded-3xl border border-amber-200 bg-amber-50 p-8 text-center">
          <div className="mx-auto w-16 h-16 rounded-2xl bg-amber-100 flex items-center justify-center mb-4">
            <IndianRupee className="h-8 w-8 text-amber-600" />
          </div>
          <h3 className="text-xl font-black text-slate-900">Payment Required</h3>
          <p className="mt-1 text-sm font-medium text-slate-600">{state.file.name}</p>
          <p className="mt-1 text-sm text-slate-500">{state.message}</p>
          <div className="mt-5 mb-1">
            <span className="text-5xl font-extrabold text-slate-900">₹49</span>
            <span className="ml-2 text-sm text-slate-500">one-time · per document</span>
          </div>
          <p className="text-xs text-slate-400 mb-6">Secure via Razorpay · UPI / Cards / NetBanking</p>
          <div className="flex flex-col gap-2">
            <RazorpayCheckout
              plan="payg"
              label={`Pay ₹49 & Convert (${state.pageCount} pages)`}
              amountINR={49}
              userEmail={userEmail}
              fileName={state.file.name}
              pageCount={state.pageCount}
              onSuccess={async () => { await uploadFile(state.file); }}
              onError={(msg) => setState({ status: "error", message: msg })}
              className="flex w-full items-center justify-center gap-2 rounded-xl py-3.5 text-sm font-bold text-white bg-navy hover:opacity-90 transition-opacity"
            />
            <button onClick={reset} className="w-full py-3 rounded-xl border border-slate-200 bg-white text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors">Cancel</button>
          </div>
        </div>
      </div>
    );
  }

  const isProcessing = state.status === "processing";
  const freeRemaining = billing.tier === "FREE" ? Math.max(0, FREE_PAGE_CAP - billing.pagesUsedThisPeriod) : 0;

  return (
    <div className="flex flex-col gap-4 max-w-4xl mx-auto w-full">

      {/* ── USAGE BAR ── */}
      <FreePagesIndicator
        tier={billing.tier}
        pagesUsed={billing.pagesUsedThisPeriod}
        monthlyPageLimit={billing.monthlyPageLimit}
      />

      {/* ── ERROR ── */}
      {state.status === "error" && (
        <div className="flex items-center gap-3 px-4 py-3 bg-red-50 border border-red-200 rounded-2xl text-sm text-red-700">
          <AlertCircle size={15} className="shrink-0 text-red-500" />
          <span className="flex-1">{state.message}</span>
          <button onClick={reset} className="shrink-0 font-bold text-red-400 hover:text-red-600">✕</button>
        </div>
      )}

      {/* ── MAIN CARD ── */}
      <div
        className="rounded-3xl overflow-hidden border border-slate-200 bg-white"
        style={{ boxShadow: "0 4px 24px rgba(15,23,42,0.08), 0 1px 4px rgba(15,23,42,0.04)" }}
      >
        {/* Top colour bar */}
        <div className="h-[3px]" style={{ background: "linear-gradient(90deg,#1A47C8 0%,#6366f1 50%,#a855f7 100%)" }} />

        {/* Drop zone */}
        <div
          {...getRootProps()}
          className={cn(
            "relative flex flex-col items-center justify-center px-8 py-16 cursor-pointer transition-all duration-200 select-none",
            isDragActive ? "bg-blue-50" : "bg-white hover:bg-slate-50/60",
            isProcessing && "pointer-events-none"
          )}
        >
          <input {...getInputProps()} />

          {/* Active drag overlay */}
          {isDragActive && (
            <div className="absolute inset-0 border-2 border-navy rounded-none pointer-events-none" />
          )}

          {isProcessing ? (
            /* ── Processing ── */
            <div className="flex flex-col items-center gap-5 py-4">
              <div className="relative">
                <svg width="96" height="96" viewBox="0 0 96 96" className="animate-spin" style={{ animationDuration: "2s" }}>
                  <circle cx="48" cy="48" r="40" fill="none" stroke="#e2e8f0" strokeWidth="6" />
                  <circle cx="48" cy="48" r="40" fill="none" stroke="#1A47C8" strokeWidth="6"
                    strokeLinecap="round" strokeDasharray="251" strokeDashoffset="188" />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <FileText size={32} className="text-navy" />
                </div>
              </div>
              <div className="text-center">
                <p className="text-2xl font-black text-slate-900">Converting…</p>
                <p className="text-slate-500 text-sm mt-1">
                  Extracting from <span className="font-semibold text-slate-700">{(state as { status: "processing"; fileName: string }).fileName}</span>
                </p>
                <p className="text-xs text-slate-400 mt-2">Usually under 15 seconds</p>
              </div>
              {/* Shimmer bar */}
              <div className="w-48 h-1 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full rounded-full" style={{
                  background: "linear-gradient(90deg,#1A47C8,#6366f1,#1A47C8)",
                  backgroundSize: "200% 100%",
                  animation: "progressShimmer 1.4s linear infinite",
                }} />
              </div>
            </div>
          ) : (
            /* ── Idle / Drag ── */
            <div className="flex flex-col items-center gap-5">

              {/* Icon */}
              <div className="relative">
                {/* Soft glow */}
                <div className="absolute inset-0 rounded-full blur-2xl opacity-20 scale-150 pointer-events-none"
                  style={{ background: "#1A47C8" }} />
                <div
                  className="relative w-[88px] h-[88px] rounded-[28px] flex items-center justify-center transition-transform duration-200"
                  style={{
                    background: isDragActive
                      ? "linear-gradient(145deg,#1A47C8,#6366f1)"
                      : "linear-gradient(145deg,#1A47C8,#3b6ef5)",
                    boxShadow: isDragActive
                      ? "0 0 0 8px rgba(26,71,200,0.18), 0 20px 50px rgba(26,71,200,0.40)"
                      : "0 0 0 6px rgba(26,71,200,0.10), 0 12px 30px rgba(26,71,200,0.25)",
                    transform: isDragActive ? "scale(1.08) rotate(-2deg)" : "scale(1) rotate(0deg)",
                  }}
                >
                  {isDragActive
                    ? <FileText size={42} className="text-white" strokeWidth={1.5} />
                    : <Upload size={42} className="text-white" strokeWidth={1.5} />
                  }
                </div>
              </div>

              {/* Heading */}
              <div className="text-center">
                <h3 className="text-[28px] font-black text-slate-900 leading-tight">
                  {isDragActive ? "Release to convert!" : "Drop your bank statement PDF"}
                </h3>
                <p className="text-slate-400 text-base mt-2">
                  or{" "}
                  <span className="text-navy font-bold underline underline-offset-2 hover:text-navy/80 transition-colors">
                    browse files
                  </span>
                </p>
              </div>

              {/* Trust chips row */}
              <div className="flex items-center gap-4 text-xs text-slate-400">
                <span className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />
                  PDF only
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-400 inline-block" />
                  Max {MAX_FILE_MB} MB
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-violet-400 inline-block" />
                  Password-protected OK
                </span>
              </div>

              {/* Bank pills */}
              <div className="flex flex-wrap justify-center gap-2 max-w-lg">
                {BANKS.map(b => (
                  <span key={b} className="text-[11px] font-semibold px-3 py-1 rounded-full border border-slate-200 text-slate-500 bg-white">
                    {b}
                  </span>
                ))}
                <span className="text-[11px] font-semibold px-3 py-1 text-slate-400">+21 more</span>
              </div>

              {/* Free badge */}
              {billing.tier === "FREE" && freeRemaining > 0 && (
                <div className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold"
                  style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", color: "#059669" }}>
                  <CheckCircle2 size={14} />
                  {freeRemaining} free page{freeRemaining !== 1 ? "s" : ""} remaining
                </div>
              )}
            </div>
          )}
        </div>

        {/* ── DIVIDER ── */}
        <div className="h-px bg-slate-100" />

        {/* ── FORMAT + TRUST STRIP ── */}
        {!isProcessing && (
          <div className="px-8 py-5 bg-slate-50/60">
            <div className="flex items-center justify-between gap-6 flex-wrap">

              {/* Format pills */}
              <div className="flex-1 min-w-0">
                <p className="text-[10px] font-black uppercase tracking-[0.14em] text-slate-400 mb-3">
                  Output format <span className="normal-case font-normal">(select all you need)</span>
                </p>
                <div className="flex flex-wrap gap-2">
                  {FORMATS.map(f => {
                    const active = formats.includes(f.id);
                    return (
                      <button
                        key={f.id}
                        onClick={() => toggleFormat(f.id)}
                        className={cn(
                          "flex items-center gap-2.5 pl-2.5 pr-4 py-2 rounded-xl border-2 text-sm font-bold transition-all duration-150",
                          active
                            ? "border-navy text-white shadow-md shadow-navy/20"
                            : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
                        )}
                        style={active ? { background: "linear-gradient(135deg,#1A47C8,#3b6ef5)" } : {}}
                      >
                        {/* Format dot icon */}
                        <span
                          className="w-5 h-5 rounded-md flex items-center justify-center text-[10px] font-black shrink-0"
                          style={{
                            background: active ? "rgba(255,255,255,0.20)" : f.bg,
                            color: active ? "#fff" : f.color,
                          }}
                        >
                          {f.label[0]}
                        </span>
                        {f.label}
                        {active && <CheckCircle2 size={13} className="text-white/80 shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Trust badges */}
              <div className="flex flex-col gap-2 shrink-0">
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <div className="w-7 h-7 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center shrink-0">
                    <Lock size={12} className="text-emerald-600" />
                  </div>
                  <span>Files never stored</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <div className="w-7 h-7 rounded-lg bg-amber-50 border border-amber-100 flex items-center justify-center shrink-0">
                    <Zap size={12} className="text-amber-600" />
                  </div>
                  <span>Avg. 11s per doc</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
