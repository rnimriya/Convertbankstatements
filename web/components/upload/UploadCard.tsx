"use client";

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, FileText, IndianRupee, AlertCircle, Loader2 } from "lucide-react";
import { FreePagesIndicator } from "./FreePagesIndicator";
import { ExportFormatSelector } from "./ExportFormatSelector";
import { ProcessingResult } from "./ProcessingResult";
import { RazorpayCheckout } from "@/components/payment/RazorpayCheckout";
import { Spinner } from "@/components/ui/Spinner";
import type { BillingContext, ProcessResult } from "@/types/billing";
import { cn } from "@/lib/utils";

const MAX_FILE_MB = 50;
const FREE_PAGE_CAP = 8;

interface Props {
  billing: BillingContext;
  onBillingUpdate: () => void;
  userEmail?: string;
}

type UploadState =
  | { status: "idle" }
  | { status: "processing"; fileName: string }
  | { status: "payment_required"; file: File; pageCount: number; message: string }
  | { status: "done"; result: ProcessResult & { is_demo?: boolean } }
  | { status: "error"; message: string };

export function UploadCard({ billing, onBillingUpdate, userEmail }: Props) {
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
    return <ProcessingResult result={state.result} onReset={reset} />;
  }

  if (state.status === "payment_required") {
    return (
      <div className="space-y-4">
        <FreePagesIndicator
          tier={billing.tier}
          pagesUsed={billing.pagesUsedThisPeriod}
          monthlyPageLimit={billing.monthlyPageLimit}
        />
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6">
          <div className="text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-100">
              <IndianRupee className="h-6 w-6 text-amber-600" />
            </div>
            <h3 className="mt-3 text-lg font-bold text-slate-800">Payment Required</h3>
            <p className="mt-1 text-sm text-slate-600 font-medium">{state.file.name}</p>
            <p className="mt-1 text-sm text-slate-500">{state.message}</p>
            <div className="mt-4">
              <span className="text-4xl font-extrabold text-slate-900">₹49</span>
              <span className="ml-1 text-sm text-slate-500">one-time · per document</span>
            </div>
            <p className="mt-2 text-xs text-slate-400">Secure payment via Razorpay · UPI / Cards / NetBanking</p>
          </div>
          <div className="mt-5 flex flex-col gap-2">
            <RazorpayCheckout
              plan="payg"
              label={`Pay ₹49 & Process (${state.pageCount} pages)`}
              amountINR={49}
              userEmail={userEmail}
              fileName={state.file.name}
              pageCount={state.pageCount}
              onSuccess={async () => { await uploadFile(state.file); }}
              onError={(msg) => setState({ status: "error", message: msg })}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-navy py-3 text-sm font-semibold text-white hover:opacity-90 transition-opacity"
            />
            <button onClick={reset} className="w-full py-2.5 rounded-xl border border-slate-200 bg-white text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors">
              Cancel
            </button>
          </div>
          <p className="mt-4 text-center text-xs text-slate-400">
            Or upgrade to Pro for 500 pages/month →{" "}
            <a href="/pricing" className="text-navy underline">See plans</a>
          </p>
        </div>
      </div>
    );
  }

  const freeRemaining = billing.tier === "FREE"
    ? Math.max(0, FREE_PAGE_CAP - billing.pagesUsedThisPeriod) : 0;

  return (
    <div className="space-y-4">
      {/* Free pages / plan indicator */}
      <FreePagesIndicator
        tier={billing.tier}
        pagesUsed={billing.pagesUsedThisPeriod}
        monthlyPageLimit={billing.monthlyPageLimit}
      />

      {/* Format pills */}
      <ExportFormatSelector selected={formats} onChange={setFormats} />

      {/* Error */}
      {state.status === "error" && (
        <div className="flex items-start gap-3 px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
          <AlertCircle size={16} className="shrink-0 mt-0.5 text-red-500" />
          <span className="flex-1">{state.message}</span>
          <button onClick={reset} className="shrink-0 text-red-400 hover:text-red-600 font-medium">✕</button>
        </div>
      )}

      {/* Drop zone */}
      <div
        {...getRootProps()}
        className={cn(
          "relative flex min-h-[260px] cursor-pointer flex-col items-center justify-center gap-4",
          "rounded-2xl border-2 border-dashed px-8 py-12 text-center transition-all duration-200 select-none",
          isDragActive
            ? "border-navy bg-navy/5 scale-[1.01]"
            : "border-slate-200 bg-slate-50/60 hover:border-navy/40 hover:bg-navy/[0.02]",
          state.status === "processing" && "pointer-events-none opacity-70"
        )}
      >
        <input {...getInputProps()} />

        {state.status === "processing" ? (
          <>
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-navy/10">
              <Loader2 className="h-8 w-8 text-navy animate-spin" />
            </div>
            <div>
              <p className="font-semibold text-slate-800">Converting {state.fileName}…</p>
              <p className="mt-1 text-sm text-slate-400">Extracting transactions · usually under 15s</p>
            </div>
            <div className="w-48 h-1 bg-slate-200 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full bg-navy"
                style={{
                  width: "60%",
                  background: "linear-gradient(90deg, #1A47C8, #3b6ef5, #1A47C8)",
                  backgroundSize: "200% 100%",
                  animation: "progressShimmer 1.4s linear infinite",
                }}
              />
            </div>
          </>
        ) : (
          <>
            <div className={cn(
              "flex h-16 w-16 items-center justify-center rounded-2xl transition-all duration-200",
              isDragActive
                ? "bg-navy text-white scale-110"
                : "bg-white border-2 border-slate-200 text-slate-400"
            )}>
              {isDragActive
                ? <FileText className="h-8 w-8" />
                : <Upload className="h-8 w-8" />}
            </div>

            <div>
              <p className="text-base font-semibold text-slate-700">
                {isDragActive ? "Drop it here!" : "Drop your bank statement PDF"}
              </p>
              <p className="mt-1 text-sm text-slate-400">
                or{" "}
                <span className="font-semibold text-navy underline underline-offset-2">browse files</span>
              </p>
              <p className="mt-2 text-xs text-slate-400">PDF only · max {MAX_FILE_MB} MB · All Indian banks</p>
            </div>

            {billing.tier === "FREE" && freeRemaining > 0 && (
              <div className="flex items-center gap-1.5 rounded-full bg-emerald-50 border border-emerald-200 px-4 py-1.5 text-xs font-semibold text-emerald-700">
                <span className="text-emerald-500">✓</span>
                {freeRemaining} free page{freeRemaining !== 1 ? "s" : ""} remaining
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
