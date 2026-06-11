"use client";

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, FileText, IndianRupee, AlertCircle, Loader2, CheckCircle2 } from "lucide-react";
import { FreePagesIndicator } from "./FreePagesIndicator";
import { ExportFormatSelector } from "./ExportFormatSelector";
import { ProcessingResult } from "./ProcessingResult";
import { RazorpayCheckout } from "@/components/payment/RazorpayCheckout";
import type { BillingContext, ProcessResult } from "@/types/billing";
import { cn } from "@/lib/utils";

const MAX_FILE_MB = 50;
const FREE_PAGE_CAP = 8;

const TRUST_BANKS = ["SBI", "HDFC", "ICICI", "Axis", "Kotak", "PNB", "BOB"];

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
    const formData = new FormData();
    formData.append("file", file);
    formData.append("export_formats", formats.join(","));
    try {
      const res = await fetch("/api/process-statement", { method: "POST", body: formData });
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
            ? `File exceeds ${MAX_FILE_MB} MB.`
            : "Only PDF files are accepted.",
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

  if (state.status === "done") {
    return <ProcessingResult result={state.result} onReset={reset} hasSheetsAccess={hasSheetsAccess} />;
  }

  if (state.status === "payment_required") {
    return (
      <div className="space-y-4 max-w-xl mx-auto">
        <FreePagesIndicator
          tier={billing.tier}
          pagesUsed={billing.pagesUsedThisPeriod}
          monthlyPageLimit={billing.monthlyPageLimit}
        />
        <div className="rounded-3xl border border-amber-200 bg-amber-50 p-8 text-center shadow-sm">
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
            <button onClick={reset} className="w-full py-3 rounded-xl border border-slate-200 bg-white text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors">
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  }

  const freeRemaining = billing.tier === "FREE"
    ? Math.max(0, FREE_PAGE_CAP - billing.pagesUsedThisPeriod) : 0;
  const isProcessing = state.status === "processing";

  return (
    <div className="space-y-5 max-w-3xl mx-auto">

      {/* Usage indicator */}
      <FreePagesIndicator
        tier={billing.tier}
        pagesUsed={billing.pagesUsedThisPeriod}
        monthlyPageLimit={billing.monthlyPageLimit}
      />

      {/* Error */}
      {state.status === "error" && (
        <div className="flex items-start gap-3 px-4 py-3 bg-red-50 border border-red-200 rounded-2xl text-sm text-red-700">
          <AlertCircle size={16} className="shrink-0 mt-0.5 text-red-500" />
          <span className="flex-1">{state.message}</span>
          <button onClick={reset} className="shrink-0 text-red-400 hover:text-red-600 font-bold">✕</button>
        </div>
      )}

      {/* ── MAIN DROP ZONE CARD ─────────────────────────────── */}
      <div
        {...getRootProps()}
        className={cn(
          "relative cursor-pointer rounded-3xl border-2 transition-all duration-200 select-none overflow-hidden",
          isDragActive
            ? "border-navy scale-[1.01] shadow-2xl shadow-navy/20"
            : "border-slate-200 hover:border-navy/50 hover:shadow-lg hover:shadow-navy/10",
          isProcessing && "pointer-events-none"
        )}
        style={{
          background: isDragActive
            ? "linear-gradient(160deg,#eff6ff 0%,#e0e7ff 100%)"
            : "linear-gradient(160deg,#fafbff 0%,#f0f3ff 100%)",
        }}
      >
        <input {...getInputProps()} />

        {/* Top accent line */}
        <div
          className="absolute top-0 inset-x-0 h-1 rounded-t-3xl"
          style={{ background: "linear-gradient(90deg,#1A47C8,#6366f1,#a855f7)" }}
        />

        <div className="flex flex-col items-center justify-center px-8 py-14 text-center">

          {isProcessing ? (
            /* Processing state */
            <div className="flex flex-col items-center gap-5">
              <div className="relative">
                <div
                  className="w-24 h-24 rounded-3xl flex items-center justify-center"
                  style={{ background: "linear-gradient(135deg,#1A47C8,#3b6ef5)", boxShadow: "0 20px 50px rgba(26,71,200,0.35)" }}
                >
                  <Loader2 size={40} className="text-white animate-spin" />
                </div>
                <div
                  className="absolute -inset-3 rounded-[30px] pointer-events-none"
                  style={{ border: "2px solid rgba(26,71,200,0.15)", animation: "pulse-ring 1.8s ease-out infinite" }}
                />
              </div>
              <div>
                <p className="text-xl font-black text-slate-900">Converting…</p>
                <p className="text-sm text-slate-500 mt-1 max-w-xs">
                  Extracting transactions from <span className="font-semibold text-slate-700">{(state as { status: "processing"; fileName: string }).fileName}</span>
                </p>
              </div>
              <div className="w-56 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full"
                  style={{
                    width: "65%",
                    background: "linear-gradient(90deg,#1A47C8,#6366f1,#1A47C8)",
                    backgroundSize: "200% 100%",
                    animation: "progressShimmer 1.4s linear infinite",
                  }}
                />
              </div>
              <p className="text-xs text-slate-400">Usually under 15 seconds</p>
            </div>
          ) : (
            /* Idle / drag state */
            <div className="flex flex-col items-center gap-5">
              {/* Icon */}
              <div className="relative">
                <div
                  className="w-24 h-24 rounded-3xl flex items-center justify-center transition-transform duration-200"
                  style={{
                    background: isDragActive
                      ? "linear-gradient(135deg,#1A47C8,#6366f1)"
                      : "linear-gradient(135deg,#1A47C8,#3b6ef5)",
                    boxShadow: isDragActive
                      ? "0 24px 60px rgba(26,71,200,0.50)"
                      : "0 16px 40px rgba(26,71,200,0.30)",
                    transform: isDragActive ? "scale(1.08)" : "scale(1)",
                  }}
                >
                  {isDragActive
                    ? <FileText size={40} className="text-white" />
                    : <Upload size={40} className="text-white" />
                  }
                </div>
                {/* Glow rings */}
                <div
                  className="absolute -inset-3 rounded-[30px] pointer-events-none"
                  style={{ border: "1.5px solid rgba(26,71,200,0.14)" }}
                />
                <div
                  className="absolute -inset-6 rounded-[36px] pointer-events-none"
                  style={{ border: "1px solid rgba(26,71,200,0.07)" }}
                />
              </div>

              {/* Title */}
              <div>
                <h3 className="text-2xl font-black text-slate-900 mb-2">
                  {isDragActive ? "Release to convert!" : "Drop your bank statement PDF"}
                </h3>
                <p className="text-slate-500 text-base">
                  or{" "}
                  <span className="font-bold text-navy underline underline-offset-2">browse files</span>
                </p>
              </div>

              {/* Specs row */}
              <div className="flex items-center gap-3 text-xs text-slate-400">
                {["PDF only", `max ${MAX_FILE_MB} MB`, "Password protected OK"].map((s, i) => (
                  <span key={s} className="flex items-center gap-1.5">
                    {i > 0 && <span className="w-1 h-1 rounded-full bg-slate-300 inline-block" />}
                    {s}
                  </span>
                ))}
              </div>

              {/* Bank pills */}
              <div className="flex items-center gap-2 flex-wrap justify-center">
                {TRUST_BANKS.map(b => (
                  <span
                    key={b}
                    className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-white border border-slate-200 text-slate-500 shadow-sm"
                  >
                    {b}
                  </span>
                ))}
                <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full text-slate-400">
                  +23 more
                </span>
              </div>

              {/* Free remaining badge */}
              {billing.tier === "FREE" && freeRemaining > 0 && (
                <div
                  className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold"
                  style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", color: "#059669" }}
                >
                  <CheckCircle2 size={14} />
                  {freeRemaining} free page{freeRemaining !== 1 ? "s" : ""} remaining
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ── FORMAT SELECTOR ─────────────────────────────────── */}
      {!isProcessing && (
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-3">
            Output format <span className="normal-case font-normal ml-1">(select all you need)</span>
          </p>
          <ExportFormatSelector selected={formats} onChange={setFormats} />
        </div>
      )}
    </div>
  );
}
