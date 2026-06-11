"use client";

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import {
  Upload, FileText, IndianRupee, AlertCircle,
  CheckCircle2, Lock, Zap,
} from "lucide-react";
import { FreePagesIndicator } from "./FreePagesIndicator";
import { ProcessingResult } from "./ProcessingResult";
import { RazorpayCheckout } from "@/components/payment/RazorpayCheckout";
import type { BillingContext, ProcessResult } from "@/types/billing";
import { cn } from "@/lib/utils";

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

  const freeRemaining = billing.tier === "FREE"
    ? Math.max(0, FREE_PAGE_CAP - billing.pagesUsedThisPeriod)
    : 0;

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
            <span className="text-5xl font-extrabold text-slate-900">₹49</span>
            <span className="ml-2 text-sm text-slate-500">one-time · per document</span>
          </div>
          <p className="text-xs text-slate-400 mb-6">Secure via Razorpay · UPI / Cards / NetBanking</p>
          <div className="flex flex-col gap-2">
            <RazorpayCheckout
              plan="payg"
              label={`Pay ₹49 & Convert (${payState.pageCount} pages)`}
              amountINR={49}
              userEmail={userEmail}
              fileName={payState.file.name}
              pageCount={payState.pageCount}
              onSuccess={async () => { await uploadFile(payState.file); }}
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
  const procState = state as { status: "processing"; fileName: string };

  /* ── Full-screen hero layout ── */
  return (
    <div className="flex flex-col h-full">

      {/* ── Error banner ── */}
      {state.status === "error" && (
        <div className="shrink-0 flex items-center gap-3 px-8 py-3 bg-red-50 border-b border-red-100 text-sm text-red-700">
          <AlertCircle size={15} className="shrink-0 text-red-500" />
          <span className="flex-1">{state.message}</span>
          <button onClick={reset} className="shrink-0 font-bold text-red-400 hover:text-red-600">✕</button>
        </div>
      )}

      {/* ── HERO DROP ZONE ── */}
      <div
        {...(isProcessing ? {} : getRootProps())}
        className={cn(
          "flex-1 relative flex flex-col items-center justify-center overflow-y-auto select-none",
          !isProcessing && "cursor-pointer",
        )}
        style={{ minHeight: 320, background: "#f8fafc" }}
      >
        {!isProcessing && <input {...getInputProps()} />}

        {/* Dot-grid texture */}
        <div
          className="absolute inset-0 pointer-events-none transition-opacity duration-300"
          style={{
            backgroundImage: "radial-gradient(circle, #94a3b8 1px, transparent 1px)",
            backgroundSize: "28px 28px",
            opacity: isDragActive ? 0.50 : 0.20,
          }}
        />

        {/* Drag highlight */}
        {isDragActive && (
          <>
            <div className="absolute inset-0 bg-blue-50/80 pointer-events-none" />
            <div
              className="absolute rounded-3xl pointer-events-none"
              style={{
                inset: "24px",
                border: "2.5px dashed rgba(26,71,200,0.45)",
                boxShadow: "inset 0 0 80px rgba(26,71,200,0.06)",
              }}
            />
          </>
        )}

        {isProcessing ? (
          /* Processing */
          <div className="relative flex flex-col items-center gap-6 text-center px-8">
            <div className="relative w-28 h-28">
              <svg className="w-full h-full animate-spin" style={{ animationDuration: "2s" }} viewBox="0 0 112 112">
                <circle cx="56" cy="56" r="48" fill="none" stroke="#e2e8f0" strokeWidth="5" />
                <circle cx="56" cy="56" r="48" fill="none" stroke="#1A47C8" strokeWidth="5"
                  strokeLinecap="round"
                  strokeDasharray={`${2 * Math.PI * 48 * 0.75} ${2 * Math.PI * 48 * 0.25}`}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <FileText size={36} className="text-navy" />
              </div>
            </div>
            <div>
              <p className="text-3xl font-black text-slate-900">Converting…</p>
              <p className="text-slate-400 mt-2">
                Processing{" "}
                <span className="font-semibold text-slate-700">{procState.fileName}</span>
              </p>
              <p className="text-sm text-slate-400 mt-1">Usually under 15 seconds</p>
            </div>
            <div className="w-56 h-1.5 bg-slate-200 rounded-full overflow-hidden">
              <div className="h-full rounded-full" style={{
                background: "linear-gradient(90deg,#1A47C8,#6366f1,#a855f7,#1A47C8)",
                backgroundSize: "300% 100%",
                animation: "progressShimmer 1.8s linear infinite",
              }} />
            </div>
          </div>
        ) : (
          /* Idle */
          <div className="relative flex flex-col items-center gap-4 text-center px-8 py-6 max-w-2xl w-full">

            {/* Icon — no glow plate, just the square with a clean drop shadow */}
            <div
              className="w-[72px] h-[72px] rounded-[22px] flex items-center justify-center transition-all duration-300 shrink-0"
              style={{
                background: isDragActive
                  ? "linear-gradient(145deg,#0f35b8,#1A47C8)"
                  : "linear-gradient(145deg,#1A47C8,#4a78f5)",
                boxShadow: isDragActive
                  ? "0 16px 48px rgba(26,71,200,0.48)"
                  : "0 10px 30px rgba(26,71,200,0.26)",
                transform: isDragActive ? "scale(1.08) rotate(-3deg)" : "scale(1)",
              }}
            >
              {isDragActive
                ? <FileText size={36} className="text-white" strokeWidth={1.5} />
                : <Upload size={36} className="text-white" strokeWidth={1.5} />
              }
            </div>

            {/* Heading */}
            <div>
              <h2 className="text-[28px] lg:text-[34px] font-black text-slate-900 leading-tight mb-1.5 tracking-tight whitespace-nowrap">
                {isDragActive ? "Release to convert!" : "Drop your bank statement PDF"}
              </h2>
              <p className="text-slate-400 text-base">
                or{" "}
                <span className="text-navy font-bold underline underline-offset-2 decoration-navy/30 hover:decoration-navy transition-colors">
                  browse files
                </span>
              </p>
            </div>

            {/* Specs */}
            <div className="flex items-center gap-2.5 text-[13px] text-slate-400">
              <span>PDF only</span>
              <span className="w-1 h-1 rounded-full bg-slate-300" />
              <span>Max {MAX_FILE_MB} MB</span>
              <span className="w-1 h-1 rounded-full bg-slate-300" />
              <span>Password protected OK</span>
            </div>

            {/* Bank chips — single row */}
            <div className="flex items-center justify-center gap-1.5 flex-wrap">
              {BANKS.map(b => (
                <span key={b}
                  className="text-[11px] font-semibold px-3 py-1 rounded-full bg-white border border-slate-200 text-slate-500">
                  {b}
                </span>
              ))}
              <span className="text-[11px] font-medium px-2 py-1 text-slate-400">+23 more</span>
            </div>

            {/* Free pages badge */}
            {billing.tier === "FREE" && freeRemaining > 0 && (
              <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[13px] font-semibold bg-emerald-50 border border-emerald-200 text-emerald-700">
                <CheckCircle2 size={13} />
                {freeRemaining} free page{freeRemaining !== 1 ? "s" : ""} remaining
              </div>
            )}
          </div>
        )}
      </div>

      {/* ── FORMAT PICKER BAR ── */}
      {!isProcessing && (
        <div className="shrink-0 border-t border-slate-200 bg-white">
          {/* Usage indicator inside the bar */}
          <div className="px-8 pt-3 pb-0">
            <FreePagesIndicator
              tier={billing.tier}
              pagesUsed={billing.pagesUsedThisPeriod}
              monthlyPageLimit={billing.monthlyPageLimit}
            />
          </div>
          <div className="px-8 py-3 flex items-center gap-5 flex-wrap">
            <span className="text-[10px] font-black uppercase tracking-[0.16em] text-slate-400 shrink-0 whitespace-nowrap">
              Output format
            </span>

            <div className="flex flex-1 flex-wrap gap-2 min-w-0">
              {FORMATS.map(f => {
                const active = formats.includes(f.id);
                return (
                  <button
                    key={f.id}
                    onClick={() => toggleFormat(f.id)}
                    className={cn(
                      "flex items-center gap-2 pl-2.5 pr-4 py-2 rounded-xl border-2 text-sm font-bold transition-all duration-150 whitespace-nowrap",
                      active
                        ? "border-navy text-white shadow-lg shadow-navy/20"
                        : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50"
                    )}
                    style={active ? { background: "linear-gradient(135deg,#1A47C8,#4a78f5)" } : {}}
                  >
                    <span
                      className="w-5 h-5 rounded-md flex items-center justify-center text-[10px] font-black shrink-0"
                      style={{
                        background: active ? "rgba(255,255,255,0.22)" : f.dotBg,
                        color: active ? "#fff" : f.dotColor,
                      }}
                    >
                      {f.label[0]}
                    </span>
                    {f.label}
                    {active && <CheckCircle2 size={12} className="text-white/75 shrink-0" />}
                  </button>
                );
              })}
            </div>

            {/* Trust micro-badges */}
            <div className="flex items-center gap-4 shrink-0">
              <span className="flex items-center gap-1.5 text-[11px] text-slate-400 whitespace-nowrap">
                <Lock size={11} />
                Never stored
              </span>
              <span className="flex items-center gap-1.5 text-[11px] text-slate-400 whitespace-nowrap">
                <Zap size={11} className="text-amber-400" />
                ~11s avg
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
