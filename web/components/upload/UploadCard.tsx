"use client";

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, FileText, Loader2, AlertTriangle, X, IndianRupee } from "lucide-react";
import { FreePagesIndicator } from "./FreePagesIndicator";
import { ExportFormatSelector } from "./ExportFormatSelector";
import { ProcessingResult } from "./ProcessingResult";
import { RazorpayCheckout } from "@/components/payment/RazorpayCheckout";
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

        <div className="rounded-2xl border border-amber-200 dark:border-amber-700 bg-amber-50 dark:bg-amber-900/20 p-6 shadow-sm">
          <div className="text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-100 dark:bg-amber-900/40">
              <IndianRupee className="h-6 w-6 text-amber-600 dark:text-amber-400" />
            </div>
            <h3 className="mt-3 text-lg font-bold text-slate-800 dark:text-gray-200">Payment Required</h3>
            <p className="mt-1 text-sm text-slate-600 dark:text-gray-300 font-medium">{state.file.name}</p>
            <p className="mt-1 text-sm text-slate-500 dark:text-gray-400">{state.message}</p>

            <div className="mt-4">
              <span className="text-4xl font-extrabold text-slate-900 dark:text-white">₹49</span>
              <span className="ml-1 text-sm text-slate-500 dark:text-gray-400">one-time · per document</span>
            </div>

            <p className="mt-2 text-xs text-slate-400 dark:text-gray-500">Secure payment via Razorpay · UPI / Cards / NetBanking</p>
          </div>

          <div className="mt-5 flex flex-col gap-2">
            <RazorpayCheckout
              plan="payg"
              label={`Pay ₹49 & Process (${state.pageCount} pages)`}
              amountINR={49}
              userEmail={userEmail}
              fileName={state.file.name}
              pageCount={state.pageCount}
              onSuccess={async () => {
                await uploadFile(state.file);
              }}
              onError={(msg) => setState({ status: "error", message: msg })}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-brand-600 py-3 text-sm font-semibold text-white shadow hover:bg-brand-700 transition-colors"
            />
            <button
              onClick={reset}
              className="w-full rounded-xl border border-slate-200 dark:border-gray-800 bg-white dark:bg-gray-800 py-2.5 text-sm font-medium text-slate-600 dark:text-gray-300 hover:bg-slate-50 dark:hover:bg-gray-800 transition-colors"
            >
              Cancel
            </button>
          </div>

          <p className="mt-4 text-center text-xs text-slate-400 dark:text-gray-500">
            Or upgrade to Pro (₹399/mo) for 200 pages/month →{" "}
            <a href="/pricing" className="text-brand-600 dark:text-brand-400 underline">See plans</a>
          </p>
        </div>
      </div>
    );
  }

  const freeRemaining = billing.tier === "FREE"
    ? Math.max(0, FREE_PAGE_CAP - billing.pagesUsedThisPeriod) : 0;

  return (
    <div className="space-y-4">
      <FreePagesIndicator
        tier={billing.tier}
        pagesUsed={billing.pagesUsedThisPeriod}
        monthlyPageLimit={billing.monthlyPageLimit}
      />
      <ExportFormatSelector selected={formats} onChange={setFormats} />

      <div
        {...getRootProps()}
        className={cn(
          "relative flex min-h-[220px] cursor-pointer flex-col items-center justify-center",
          "rounded-2xl border-2 border-dashed px-6 py-10 transition-all duration-200 select-none",
          isDragActive
            ? "border-brand-500 bg-brand-50 dark:bg-brand-900/20 scale-[1.01]"
            : "border-slate-300 dark:border-gray-800LITE bg-white dark:bg-gray-800 hover:border-brand-400 hover:bg-slate-50 dark:hover:bg-gray-800",
          state.status === "processing" && "pointer-events-none opacity-70"
        )}
      >
        <input {...getInputProps()} />

        {state.status === "processing" ? (
          <>
            <Loader2 className="h-10 w-10 animate-spin text-brand-500" />
            <p className="mt-3 text-sm font-semibold text-slate-700 dark:text-gray-200">
              Processing <span className="text-slate-900 dark:text-white">{state.fileName}</span>…
            </p>
            <p className="mt-1 text-xs text-slate-400 dark:text-gray-500">Extracting transactions · usually under 15s</p>
          </>
        ) : state.status === "error" ? (
          <>
            <AlertTriangle className="h-10 w-10 text-red-400" />
            <p className="mt-3 text-sm font-semibold text-red-700 dark:text-red-400">{state.message}</p>
            <button onClick={(e) => { e.stopPropagation(); reset(); }}
              className="mt-3 flex items-center gap-1 text-xs text-slate-500 dark:text-gray-400 underline">
              <X className="h-3 w-3" /> Clear
            </button>
          </>
        ) : (
          <>
            <div className={cn(
              "flex h-16 w-16 items-center justify-center rounded-2xl transition-colors",
              isDragActive ? "bg-brand-100 dark:bg-brand-900/40" : "bg-brand-50 dark:bg-brand-900/20 ring-2 ring-brand-100 dark:ring-brand-900/50"
            )}>
              {isDragActive
                ? <FileText className="h-8 w-8 text-brand-600 dark:text-brand-400" />
                : <Upload className="h-8 w-8 text-brand-500 dark:text-brand-400" />}
            </div>

            <p className="mt-4 text-base font-semibold text-slate-700 dark:text-gray-200">
              {isDragActive ? "Drop your PDF here!" : "Drop your bank statement PDF"}
            </p>
            <p className="mt-1 text-sm text-slate-400 dark:text-gray-500">
              or <span className="font-medium text-brand-600 dark:text-brand-400 underline underline-offset-2">browse files</span>
            </p>
            <p className="mt-2 text-xs text-slate-400 dark:text-gray-500">PDF only · max {MAX_FILE_MB} MB · All Indian banks</p>

            {billing.tier === "FREE" && freeRemaining > 0 && (
              <div className="mt-4 rounded-full bg-emerald-50 dark:bg-emerald-900/20 px-4 py-1.5 text-xs font-semibold text-emerald-700 dark:text-emerald-400 ring-1 ring-emerald-200 dark:ring-emerald-800">
                ✓ {freeRemaining} free page{freeRemaining !== 1 ? "s" : ""} remaining
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
