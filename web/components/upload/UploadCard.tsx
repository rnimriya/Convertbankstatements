"use client";

import { useCallback, useState } from"react";
import { useDropzone } from"react-dropzone";
import {
  Upload, FileText, DollarSign, AlertCircle,
  CheckCircle2, Lock, Zap, Plus, ChevronDown, Monitor, HardDrive, CloudDownload, Link2, X,
} from"lucide-react";
import { FreePagesIndicator } from"./FreePagesIndicator";
import dynamic from "next/dynamic";

// ProcessingResult pulls in the analytics dashboard + export chain, which a
// first-time visitor does not need until a conversion finishes. Loading it
// lazily keeps that weight out of the page's First Load JS (2026-11-01).
const ProcessingResult = dynamic(
  () => import("./ProcessingResult").then((m) => m.ProcessingResult),
  {
    loading: () => (
      <div className="py-10 text-center text-sm text-zinc-500">
        Preparing your result…
      </div>
    ),
  }
);
import type { BillingContext, ProcessResult } from"@/types/billing";
import { cn } from"@/lib/utils";
import { DROPBOX_ENABLED, GOOGLE_ENABLED, pickFromDropbox, pickFromGoogleDrive } from"@/lib/imports/cloud";
import Link from"next/link";

const MAX_FILE_MB = 50;
const FREE_PAGE_CAP = 8;

const BANKS = ["Chase","Wells Fargo","Bank of America","Citi","Capital One","U.S. Bank","Truist"];

const FORMATS = [
  { id:"csv",    label:"CSV",    sub:"Universal",    dotColor:"#43A047", dotBg:"#E8F5E9" },
  { id:"xlsx",   label:"Excel",  sub:".xlsx",        dotColor:"#1D6F42", dotBg:"#DCFCE7" },
  { id:"ofx",    label:"OFX",    sub:"Xero / Money", dotColor:"#1565C0", dotBg:"#DBEAFE" },
  { id:"qfx",    label:"QFX",    sub:"Quicken",      dotColor:"#C2410C", dotBg:"#FEF3C7" },
  { id:"sheets", label:"Sheets", sub:"Google",       dotColor:"#15803D", dotBg:"#DCFCE7" },
] as const;

interface Props {
  billing: BillingContext;
  onBillingUpdate: () => void;
  userEmail?: string;
  hasSheetsAccess?: boolean;
  fullWidth?: boolean;
  variant?: "card" | "workspace";
}

type UploadState =
  | { status:"idle" }
  | { status:"processing"; fileName: string }
  | { status:"payment_required"; file: File; pageCount: number; message: string }
  | { status:"done"; result: ProcessResult & { is_demo?: boolean } }
  | { status:"error"; message: string };

export function UploadCard({ billing, onBillingUpdate, userEmail, hasSheetsAccess, fullWidth, variant }: Props) {
  const [state, setState] = useState<UploadState>({ status:"idle" });
  const [formats, setFormats] = useState<string[]>(["csv"]);
  const [staged, setStaged] = useState<File | null>(null);
  const isWorkspace = !fullWidth && variant === "workspace";
  const [formatNotice, setFormatNotice] = useState<string | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [cloudNotice, setCloudNotice] = useState<string | null>(null);
  const [urlModalOpen, setUrlModalOpen] = useState(false);
  const [urlInput, setUrlInput] = useState("");
  const [urlError, setUrlError] = useState<string | null>(null);
  const [urlBusy, setUrlBusy] = useState(false);
  const PRO_FORMATS = ["ofx", "qfx", "sheets"];
  const isProTier = billing.tier === "PRO" || billing.tier === "BUSINESS";

  const uploadFile = useCallback(async (file: File) => {
    setState({ status:"processing", fileName: file.name });
    const fd = new FormData();
    fd.append("file", file);
    fd.append("export_formats", formats.join(","));
    try {
      const res = await fetch("/api/process-statement", { method:"POST", body: fd });
      const data = await res.json().catch(() => null);
      if (!data) throw new Error("The server returned an unexpected response. Please try again.");
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
      setState({ status:"error", message: e instanceof TypeError
        ? "The connection dropped while processing. If the conversion completed, it will appear in your History — please check there before re-uploading, so your pages are not counted twice."
        : e instanceof Error ? e.message :"Unexpected error." });
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
      if (accepted[0]) {
        if (isWorkspace) {
          setStaged(accepted[0]);
          setState({ status: "idle" });
        } else {
          uploadFile(accepted[0]);
        }
      }
    },
    [uploadFile, isWorkspace]
  );

  // Cloud import (Drive / Dropbox): the picker runs in the browser, the
  // downloaded File then goes through the exact same onDrop pipeline.
  const importCloud = useCallback(
    async (source: "drive" | "dropbox") => {
      setMenuOpen(false);
      setCloudNotice(null);
      try {
        const file = source === "drive" ? await pickFromGoogleDrive() : await pickFromDropbox();
        if (file) {
          if (file.size > MAX_FILE_MB * 1024 * 1024) {
            setState({ status: "error", message: `File exceeds ${MAX_FILE_MB} MB.` });
            return;
          }
          onDrop([file], []);
        }
      } catch (e) {
        setState({ status: "error", message: e instanceof Error ? e.message : "Import failed. Please try again." });
      }
    },
    [onDrop],
  );

  // Cloud option abhi keys ke bina visible hai (owner ka design order);
  // click par jhoota picker nahi khulta — saaf "coming soon" notice banta hai.
  const cloudSoon = useCallback((name: string) => {
    setMenuOpen(false);
    setCloudNotice(`${name} import is coming soon — please use From Device for now.`);
  }, []);

  // From URL: browser hi link se PDF lata hai (CORS wale hosts par chalta
  // hai); fail ho to saaf wajah + From Device ka rasta dikhta hai.
  const importFromUrl = useCallback(async () => {
    const raw = urlInput.trim();
    let parsed: URL;
    try {
      parsed = new URL(raw);
      if (parsed.protocol !== "http:" && parsed.protocol !== "https:") throw new Error("protocol");
    } catch {
      setUrlError("Please paste a valid link starting with http:// or https://.");
      return;
    }
    setUrlBusy(true);
    setUrlError(null);
    try {
      const res = await fetch(parsed.toString());
      if (!res.ok) throw new Error("fetch failed");
      const blob = await res.blob();
      if (blob.size > MAX_FILE_MB * 1024 * 1024) {
        setUrlError(`That file exceeds ${MAX_FILE_MB} MB.`);
        return;
      }
      const last = decodeURIComponent(parsed.pathname.split("/").filter(Boolean).pop() ?? "");
      const name = last.toLowerCase().endsWith(".pdf") ? last : "statement.pdf";
      const file = new File([blob], name, { type: "application/pdf" });
      setUrlModalOpen(false);
      setUrlInput("");
      onDrop([file], []);
    } catch {
      setUrlError("Could not fetch a PDF from that link — the site may be blocking downloads. Please download the file yourself and use From Device instead.");
    } finally {
      setUrlBusy(false);
    }
  }, [urlInput, onDrop]);

  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    onDrop,
    accept: {"application/pdf": [".pdf"] },
    maxFiles: 1,
    maxSize: MAX_FILE_MB * 1024 * 1024,
    disabled: state.status ==="processing",
  });

  const reset = () => { setState({ status:"idle" }); setStaged(null); };

  const toggleFormat = (id: string) => {
    if (!isProTier && PRO_FORMATS.includes(id) && !formats.includes(id)) {
      setFormatNotice(`${id === "sheets" ? "Google Sheets" : id.toUpperCase()} export is a Pro plan feature — CSV and Excel are included in your plan.`);
      return;
    }
    setFormatNotice(null);
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

  /* ── Workspace layout (dashboard Converter tab, mockup 07) ── */
  if (isWorkspace) {
    const wsProcessing = state.status === "processing";
    const wsFileName = state.status === "processing" ? state.fileName : "";
    const done = state.status === "done" ? state.result : null;
    const pay = state.status === "payment_required" ? state : null;
    const recon = done?.reconciliation;
    const money = (v: number) => `$${Math.abs(v).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    const fmtAmount = (v: number) => `${v < 0 ? "-" : "+"}${money(v)}`;
    const fmtDate = (d: string) => {
      const dt = new Date(d);
      return isNaN(+dt) ? d : dt.toLocaleDateString("en-US", { month: "short", day: "2-digit" });
    };
    const lockedSwitch = (
      <span className="relative inline-block w-11 h-6 rounded-full bg-[#2CA01C] shrink-0">
        <span className="absolute right-[3px] top-[3px] w-[18px] h-[18px] rounded-full bg-white" />
      </span>
    );

    return (
      <div className="flex-1 overflow-y-auto">
        <div className="grid xl:grid-cols-3 gap-5 p-5 lg:p-7 max-w-[1400px]">
          {/* ── LEFT column ── */}
          <div className="xl:col-span-2 space-y-5 min-w-0">
            {state.status === "error" && (
              <div className="flex items-start gap-2.5 rounded-[20px] border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">
                <AlertCircle size={15} className="mt-0.5 shrink-0 text-red-500" />
                <span className="flex-1">{state.message}</span>
                <button onClick={reset} className="shrink-0 font-bold text-red-400 hover:text-red-600">✕</button>
              </div>
            )}

            {/* Converter card */}
            <div className="bg-white rounded-[24px] border border-[#E3EDE0] shadow-[0_2px_10px_rgba(11,31,22,0.04)] p-3.5">
              <div
                {...(wsProcessing ? {} : getRootProps())}
                className={cn(
                  "relative flex flex-col items-center justify-center rounded-2xl px-6 py-12 text-center transition-colors select-none border-2 border-dashed",
                  wsProcessing
                    ? "border-zinc-200"
                    : isDragActive
                      ? "border-[#2CA01C] bg-[#EFF7ED] cursor-pointer"
                      : "border-zinc-300 hover:border-[#2CA01C] cursor-pointer"
                )}
              >
                {!wsProcessing && <input {...getInputProps()} />}
                {wsProcessing ? (
                  <div className="flex flex-col items-center gap-4 py-2">
                    <div className="relative h-16 w-16">
                      <svg className="h-full w-full animate-spin" style={{ animationDuration: "2s" }} viewBox="0 0 112 112">
                        <circle cx="56" cy="56" r="48" fill="none" stroke="#e4e4e7" strokeWidth="6" />
                        <circle cx="56" cy="56" r="48" fill="none" stroke="#2CA01C" strokeWidth="6" strokeLinecap="round"
                          strokeDasharray={`${2 * Math.PI * 48 * 0.75} ${2 * Math.PI * 48 * 0.25}`} />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <FileText size={24} className="text-[#007A33]" />
                      </div>
                    </div>
                    <div>
                      <p className="text-lg font-display font-bold text-brand-text">Converting…</p>
                      <p className="mt-0.5 max-w-[280px] truncate text-sm text-brand-muted">{wsFileName}</p>
                    </div>
                  </div>
                ) : (
                  <>
                    <div
                      className="mb-3 flex h-[52px] w-[52px] items-center justify-center rounded-full transition-all duration-300"
                      style={{ background: isDragActive ? "#0B1F16" : "#2CA01C", transform: isDragActive ? "scale(1.06)" : "scale(1)" }}
                    >
                      {isDragActive
                        ? <FileText size={22} color="#ffffff" strokeWidth={1.6} />
                        : <Upload size={22} color="#ffffff" strokeWidth={1.6} />}
                    </div>
                    <h3 className="text-2xl font-display font-bold tracking-tight text-brand-text">
                      {isDragActive ? "Release to stage" : "Drop your statement PDF"}
                    </h3>
                    <p className="mt-1 text-sm text-brand-muted">
                      or <span className="font-bold text-brand-text underline decoration-zinc-300 underline-offset-2">browse files</span> — PDF only, max {MAX_FILE_MB} MB, password OK
                    </p>
                  </>
                )}
              </div>

              {/* Staged / converted file row */}
              {(staged || done) && !wsProcessing && (
                <div className="mt-3.5 flex items-center gap-3 rounded-2xl bg-[#F7FAF5] border border-[#E3EDE0] px-4 py-3">
                  <div className="w-9 h-9 rounded-[10px] bg-white border border-[#E3EDE0] flex items-center justify-center shrink-0">
                    <FileText size={16} className="text-[#007A33]" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-bold text-brand-text truncate">{done ? done.file_name : staged!.name}</p>
                    <p className="text-xs text-brand-muted truncate">
                      {done
                        ? `${done.page_count} pages${done.bank_name ? ` · ${done.bank_name} detected` : ""}`
                        : `${(staged!.size / 1024 / 1024).toFixed(1)} MB · ready to convert`}
                    </p>
                  </div>
                  <span className="inline-flex items-center gap-1 text-[11.5px] font-bold px-2.5 py-1 rounded-full bg-[#E3F2DF] text-[#007A33] shrink-0">
                    {done ? "Done" : "Ready"} <CheckCircle2 size={11} />
                  </span>
                  {!done && staged && (
                    <button onClick={() => setStaged(null)} aria-label="Remove file" className="shrink-0 text-brand-muted hover:text-brand-text font-bold px-1">✕</button>
                  )}
                </div>
              )}
            </div>

            {/* Payment required */}
            {pay && (
              <div className="rounded-[24px] border border-amber-200 bg-amber-50 p-8 text-center">
                <div className="mx-auto w-16 h-16 rounded-2xl bg-amber-100 flex items-center justify-center mb-4">
                  <DollarSign className="h-8 w-8 text-amber-600" />
                </div>
                <h3 className="text-xl font-display font-bold text-brand-text">Payment Required</h3>
                <p className="mt-1 text-sm font-medium text-brand-muted">{pay.file.name}</p>
                <p className="mt-2 text-base text-brand-muted">{pay.message}</p>
                <div className="flex flex-col gap-2 mt-6 max-w-sm mx-auto">
                  <Link href="/pricing" className="flex w-full items-center justify-center gap-2 rounded-full py-3.5 text-sm font-bold text-white bg-[#2CA01C] hover:bg-[#238a17] transition-colors">
                    View Upgrade Plans
                  </Link>
                  <button onClick={reset} className="w-full py-3 rounded-full border border-[#E3EDE0] bg-white text-sm font-medium text-zinc-600 hover:bg-[#F7FAF5] transition-colors">Cancel</button>
                </div>
              </div>
            )}

            {/* Preview — first rows */}
            {done && done.transactions && done.transactions.length > 0 && (
              <div className="bg-white rounded-[24px] border border-[#E3EDE0] shadow-[0_2px_10px_rgba(11,31,22,0.04)] overflow-hidden">
                <div className="flex items-center justify-between gap-3 px-6 py-4">
                  <h3 className="text-[15px] font-display font-bold text-brand-text">Preview — first rows</h3>
                  {recon?.checked && (recon.ok ? (
                    <span className="inline-flex items-center gap-1 text-[11.5px] font-bold px-2.5 py-1 rounded-full bg-[#E3F2DF] text-[#007A33]">Balance check passed <CheckCircle2 size={11} /></span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[11.5px] font-bold px-2.5 py-1 rounded-full bg-amber-100 text-amber-700">Balance flagged — review</span>
                  ))}
                </div>
                <div className="px-6">
                  <div className="grid grid-cols-12 py-2 text-[10.5px] font-bold uppercase tracking-[0.08em] text-brand-muted border-b border-[#E3EDE0]">
                    <div className="col-span-2">Date</div>
                    <div className="col-span-5">Description</div>
                    <div className="col-span-2 text-right">Amount</div>
                    <div className="col-span-3 text-right">Balance</div>
                  </div>
                  <div className="divide-y divide-[#EFF4EC]">
                    {done.transactions.slice(0, 5).map((t, i) => (
                      <div key={i} className="grid grid-cols-12 py-2.5 text-[13px] items-center">
                        <div className="col-span-2 text-brand-muted">{fmtDate(t.date)}</div>
                        <div className="col-span-5 font-medium text-brand-text truncate pr-3">{t.description}</div>
                        <div className={`col-span-2 text-right font-bold ${t.amount < 0 ? "text-brand-text" : "text-[#007A33]"}`}>{fmtAmount(t.amount)}</div>
                        <div className="col-span-3 text-right text-brand-muted">{t.balance != null ? money(t.balance) : "—"}</div>
                      </div>
                    ))}
                  </div>
                </div>
                <p className="px-6 py-3.5 text-xs text-brand-muted border-t border-[#EFF4EC]">
                  {recon?.checked
                    ? `${done.transaction_count} transactions · Opening ${money(recon.openingBalance ?? 0)} → Closing ${money(recon.closingBalance ?? 0)} · ${recon.ok ? "Chain verified" : "Chain needs review"}`
                    : `${done.transaction_count} transactions extracted`}
                </p>
              </div>
            )}

            {/* Full result: downloads, Sheets, QuickBooks */}
            {done && (
              <div className="bg-white rounded-[24px] border border-[#E3EDE0] shadow-[0_2px_10px_rgba(11,31,22,0.04)] p-6 lg:p-8">
                <ProcessingResult result={done} hasSheetsAccess={hasSheetsAccess} onReset={reset} />
              </div>
            )}
          </div>

          {/* ── RIGHT column ── */}
          <div className="space-y-5 min-w-0">
            {/* Export formats */}
            <div className="bg-white rounded-[24px] border border-[#E3EDE0] shadow-[0_2px_10px_rgba(11,31,22,0.04)] p-5">
              <h3 className="text-[15px] font-display font-bold text-brand-text mb-3.5">Export formats</h3>
              <div className="grid grid-cols-3 gap-2.5">
                {FORMATS.map(f => {
                  const active = formats.includes(f.id);
                  const locked = !isProTier && PRO_FORMATS.includes(f.id);
                  return (
                    <button
                      key={f.id}
                      onClick={() => toggleFormat(f.id)}
                      className={cn(
                        "relative flex flex-col items-center gap-1 rounded-2xl border px-2 py-3.5 transition-all",
                        active
                          ? "border-[#2CA01C] bg-[#EFF7ED]"
                          : "border-[#E3EDE0] bg-white hover:border-zinc-300"
                      )}
                    >
                      {active && (
                        <span className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-[#2CA01C] flex items-center justify-center">
                          <CheckCircle2 size={11} color="#ffffff" />
                        </span>
                      )}
                      <span className="flex h-8 w-8 items-center justify-center rounded-lg text-[13px] font-black" style={{ background: f.dotBg, color: f.dotColor }}>
                        {f.label[0]}
                      </span>
                      <span className="text-[13px] font-bold text-brand-text leading-tight">{f.label}</span>
                      <span className="text-[10.5px] text-brand-muted leading-tight">{f.sub}</span>
                      {locked && <Lock size={11} className="text-brand-muted opacity-60" />}
                    </button>
                  );
                })}
              </div>
              {formatNotice ? (
                <p className="mt-3.5 text-[11px] font-semibold text-pine-600">{formatNotice} <a href="/pricing" className="underline">See Pro plan</a></p>
              ) : (
                <p className="mt-3.5 text-xs text-brand-muted">You get a separate download for each format you pick.</p>
              )}
            </div>

            {/* Options (live product behaviour, shown as status) */}
            <div className="bg-white rounded-[24px] border border-[#E3EDE0] shadow-[0_2px_10px_rgba(11,31,22,0.04)] p-5">
              <h3 className="text-[15px] font-display font-bold text-brand-text mb-1.5">Options</h3>
              <div className="flex items-center gap-3 py-3 border-b border-[#EFF4EC]">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-brand-text">Balance check</p>
                  <p className="text-xs text-brand-muted mt-0.5">Runs on every conversion — see the preview</p>
                </div>
                {lockedSwitch}
              </div>
              <div className="flex items-center gap-3 py-3 border-b border-[#EFF4EC]">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-brand-text">Auto-categorization</p>
                  <p className="text-xs text-brand-muted mt-0.5">Your category rules apply automatically</p>
                </div>
                <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-[#E3F2DF] text-[#007A33] shrink-0">AUTO</span>
              </div>
              <div className="flex items-center gap-3 py-3">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-brand-text">Delete file after convert</p>
                  <p className="text-xs text-brand-muted mt-0.5">Always on — files are never stored</p>
                </div>
                {lockedSwitch}
              </div>
            </div>

            {/* CTA */}
            <button
              onClick={() => { if (done) reset(); else if (staged) uploadFile(staged); }}
              disabled={wsProcessing || (!staged && !done)}
              className="w-full py-4 rounded-full bg-[#2CA01C] text-white text-[15px] font-bold hover:bg-[#238a17] transition-colors disabled:opacity-40 disabled:hover:bg-[#2CA01C]"
            >
              {wsProcessing ? "Converting…" : done ? "Convert another file" : "Convert file →"}
            </button>
            <p className="text-center text-xs text-brand-muted -mt-2">
              {done
                ? `${done.page_count} pages used · ${pagesRemaining} left this month`
                : `${pagesRemaining} of ${pageLimit} pages left this month · pages counted when you convert`}
            </p>
          </div>
        </div>
      </div>
    );
  }

  /* ── Done ── */
  if (state.status ==="done") {
    return (
      <div className="p-6 lg:p-8">
        <ProcessingResult 
          result={state.result} 
          hasSheetsAccess={hasSheetsAccess} 
          onReset={reset} 
        />
      </div>
    );
  }

  /* ── Payment required ── */
  if (state.status ==="payment_required") {
    const payState = state as { status:"payment_required"; file: File; pageCount: number; message: string };
    return (
      <div className="p-6 lg:p-8 flex flex-col gap-4 max-w-md mx-auto">
        <FreePagesIndicator tier={billing.tier} pagesUsed={billing.pagesUsedThisPeriod} monthlyPageLimit={billing.monthlyPageLimit} />
        <div className="rounded-[20px] border border-amber-200 bg-amber-50 p-8 text-center">
          <div className="mx-auto w-16 h-16 rounded-2xl bg-amber-100 flex items-center justify-center mb-4">
            <DollarSign className="h-8 w-8 text-amber-600 text-rose-500 dark:text-rose-400" />
          </div>
          <h3 className="text-xl font-display font-bold text-brand-text">Payment Required</h3>
          <p className="mt-1 text-sm font-medium text-brand-muted">{payState.file.name}</p>
          <p className="mt-2 text-base text-brand-muted">{payState.message}</p>
          <div className="mt-5 mb-1">
            <span className="text-xl font-extrabold text-brand-text">Upgrade Required</span>
          </div>
          <p className="text-xs text-brand-muted mb-6">Unlock more pages with a Pro or Business plan.</p>
          <div className="flex flex-col gap-2">
            <Link
              href="/pricing"
              className="flex w-full items-center justify-center gap-2 rounded-full py-3.5 text-sm font-bold text-white bg-[#2CA01C] hover:bg-[#238a17] transition-colors"
            >
              View Upgrade Plans
            </Link>
            <button onClick={reset} className="w-full py-3 rounded-full border border-[#E3EDE0] bg-brand-surface text-sm font-medium text-zinc-600 hover:bg-[#F7FAF5] transition-colors">Cancel</button>
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
            <div className="mb-3 flex items-start gap-2.5 rounded-[20px] border border-red-100 bg-red-50 px-4 py-2.5 text-sm text-red-700">
              <AlertCircle size={15} className="mt-0.5 shrink-0 text-red-500 text-amber-500 dark:text-amber-400" />
              <span className="flex-1">{state.message}</span>
              <button onClick={reset} className="shrink-0 font-bold text-red-400 hover:text-red-600">✕</button>
            </div>
          )}

          <div className="rounded-[30px] border border-[#e2e2e2] bg-white p-5 shadow-[0_20px_25px_-5px_rgba(11,31,22,0.12),0_8px_10px_-6px_rgba(11,31,22,0.10)]">

            {/* ── Drop zone — Design v3 (owner-approved 2026-11-03): white
                bg + XL shadow, radius 20px, split Choose File button with
                source dropdown, extra margin around the box ── */}
            <div>
              <div
                {...(isProcessing ? {} : getRootProps())}
                className={cn("relative flex min-h-[255px] flex-col items-center justify-center rounded-[20px] p-0 text-center transition-colors select-none",
                  isProcessing
                    ? "border-[2.5px] border-dashed border-[#CFE0CC] bg-white"
                    : "cursor-pointer",
                  !isProcessing && (isDragActive
                    ? "border-[2.5px] border-dashed border-[#2CA01C] bg-[#F2F8EF]"
                    : "border-[2.5px] border-dashed border-[#8FCE7E] bg-white hover:bg-[#FBFDFB]"))
                }
              >
                {!isProcessing && <input {...getInputProps()} />}

                {isProcessing ? (
                  /* Processing (compact) */
                  <div className="flex flex-col items-center gap-4 py-2">
                    <div className="relative h-16 w-16">
                      <svg className="h-full w-full animate-spin" style={{ animationDuration:"2s" }} viewBox="0 0 112 112">
                        <circle cx="56" cy="56" r="48" fill="none" stroke="#e4e4e7" strokeWidth="6" />
                        <circle cx="56" cy="56" r="48" fill="none" stroke="#2CA01C" strokeWidth="6" strokeLinecap="round"
                          strokeDasharray={`${2 * Math.PI * 48 * 0.75} ${2 * Math.PI * 48 * 0.25}`} />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <FileText size={24} className="text-[#007A33]" />
                      </div>
                    </div>
                    <div>
                      <p className="text-lg font-display font-bold text-brand-text">Converting…</p>
                      <p className="mt-0.5 max-w-[260px] truncate text-sm text-brand-muted">{procState.fileName}</p>
                    </div>
                    <div className="h-1.5 w-48 overflow-hidden rounded-full bg-zinc-200">
                      <div className="h-full rounded-full" style={{
                        background:"linear-gradient(90deg,#007A33,#2CA01C,#007A33)",
                        backgroundSize:"300% 100%",
                        animation:"progressShimmer 1.8s linear infinite",
                      }} />
                    </div>
                  </div>
                ) : (
                  /* Idle (compact) — WordToPDF-style split button */
                  <>
                    {isDragActive ? (
                      <div className="flex flex-col items-center gap-3 py-2">
                        <FileText size={44} className="text-[#007A33]" strokeWidth={1.4} />
                        <p className="font-display text-[22px] font-bold text-brand-text">Release to convert</p>
                        <p className="text-sm text-brand-muted">Drop the PDF to start converting</p>
                      </div>
                    ) : (
                      <>
                        <div className="relative">
                          <div className="inline-flex overflow-hidden rounded-md shadow-[0_10px_15px_-3px_rgba(11,31,22,0.25),0_4px_6px_-4px_rgba(11,31,22,0.2)]">
                            <button
                              type="button"
                              onClick={(e) => { e.stopPropagation(); open(); }}
                              className="flex min-w-[240px] items-center justify-center gap-2.5 bg-[#2CA01C] px-12 py-[18px] text-lg font-bold tracking-wide text-white transition-colors hover:bg-[#35B424]"
                            >
                              <Plus size={24} strokeWidth={2.5} /> Choose File
                            </button>
                            <button
                              type="button"
                              aria-label="More ways to add a statement"
                              aria-expanded={menuOpen}
                              onClick={(e) => { e.stopPropagation(); setMenuOpen((o) => !o); }}
                              className="flex items-center border-l border-white/20 bg-[#007A33] px-4 text-white transition-colors hover:bg-[#006B2C]"
                            >
                              <ChevronDown size={20} className={cn("transition-transform duration-200", menuOpen && "rotate-180")} />
                            </button>
                          </div>
                          {menuOpen && (
                            <>
                              <div className="fixed inset-0 z-40" onClick={(e) => { e.stopPropagation(); setMenuOpen(false); }} />
                              <div className="absolute right-0 top-[calc(100%+10px)] z-50 w-[252px] overflow-hidden rounded-xl border border-slate-200 bg-white text-left shadow-[0_20px_25px_-5px_rgba(11,31,22,0.18),0_8px_10px_-6px_rgba(11,31,22,0.12)]">
                                <button
                                  type="button"
                                  onClick={(e) => { e.stopPropagation(); setMenuOpen(false); open(); }}
                                  className="flex w-full items-center gap-3 border-b border-slate-50 px-5 py-3.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
                                >
                                  <Monitor size={16} className="shrink-0 text-slate-400" /> From Device
                                </button>
                                <button
                                  type="button"
                                  onClick={(e) => { e.stopPropagation(); if (DROPBOX_ENABLED) { void importCloud("dropbox"); } else { cloudSoon("Dropbox"); } }}
                                  className="flex w-full items-center gap-3 border-b border-slate-50 px-5 py-3.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
                                >
                                  <CloudDownload size={16} className="shrink-0 text-slate-400" /> From Dropbox
                                </button>
                                <button
                                  type="button"
                                  onClick={(e) => { e.stopPropagation(); if (GOOGLE_ENABLED) { void importCloud("drive"); } else { cloudSoon("Google Drive"); } }}
                                  className="flex w-full items-center gap-3 border-b border-slate-50 px-5 py-3.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
                                >
                                  <HardDrive size={16} className="shrink-0 text-slate-400" /> From Google Drive
                                </button>
                                <button
                                  type="button"
                                  onClick={(e) => { e.stopPropagation(); setMenuOpen(false); setUrlError(null); setUrlModalOpen(true); }}
                                  className="flex w-full items-center gap-3 px-5 py-3.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
                                >
                                  <Link2 size={16} className="shrink-0 text-slate-400" /> From URL
                                </button>
                              </div>
                            </>
                          )}
                        </div>
                        <p className="mt-3.5 text-[13px] font-medium text-slate-500">
                          {billing.tier === "FREE"
                            ? "First 8 pages free · No account needed · Or drop your statement PDF here"
                            : "Or drop your statement PDF here"}
                        </p>
                        <p className="mt-1.5 text-xs text-slate-400">
                          PDF only · Max {MAX_FILE_MB} MB · Password OK · By proceeding, you agree to our{" "}
                          <Link href="/terms" className="underline underline-offset-2" onClick={(e) => e.stopPropagation()}>
                            Terms of Use
                          </Link>.
                        </p>
                        <p className="mt-3 text-[11px] text-slate-400">
                          {BANKS.join(" ·")} <span className="text-zinc-300">+400 more</span>
                        </p>
                        {billing.tier === "FREE" && freeRemaining > 0 && (
                          <div className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-honey-200 bg-honey-400 px-3 py-1 text-xs font-semibold text-[#0B3D2E]">
                            <CheckCircle2 className="text-zinc-900" size={12} /> {freeRemaining} free page{freeRemaining !== 1 ? "s" : ""} left
                          </div>
                        )}
                      </>
                    )}
                  </>
                )}
              </div>
            </div>

            {/* ── From URL modal (WordToPDF-style) ── */}
            {urlModalOpen && (
              <div className="fixed inset-0 z-[999] flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm" onClick={() => setUrlModalOpen(false)}>
                <div className="w-full max-w-md rounded-xl border border-slate-200 bg-white p-6 text-left shadow-2xl" onClick={(e) => e.stopPropagation()}>
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <div className="flex items-center gap-2.5">
                      <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#2CA01C] text-white"><Link2 size={15} /></span>
                      <h3 className="text-sm font-bold text-slate-900 sm:text-base">Import from Web URL</h3>
                    </div>
                    <button type="button" aria-label="Close" onClick={() => setUrlModalOpen(false)} className="p-1 text-slate-400 hover:text-slate-700"><X size={17} /></button>
                  </div>
                  <form className="mt-4 space-y-4" onSubmit={(e) => { e.preventDefault(); void importFromUrl(); }}>
                    <div className="space-y-1.5">
                      <label htmlFor="cs-url-import" className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Enter PDF document link</label>
                      <input id="cs-url-import" type="url" value={urlInput} onChange={(e) => setUrlInput(e.target.value)} placeholder="https://example.com/statement.pdf" required className="w-full rounded-lg border border-slate-200 px-4 py-2.5 text-sm text-slate-800 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[#2CA01C]" />
                      {urlError && <p className="text-[11px] font-medium text-rose-500">{urlError}</p>}
                    </div>
                    <button type="submit" disabled={urlBusy} className="flex w-full items-center justify-center gap-1.5 rounded-lg bg-[#2CA01C] py-3 text-sm font-bold text-white transition-colors hover:bg-[#35B424] disabled:opacity-60">
                      {urlBusy ? "Fetching file…" : "Import File"}
                    </button>
                  </form>
                </div>
              </div>
            )}

            {/* ── Toolbar: format + pages + trust ── */}
            {!isProcessing && (
              <div className="pt-4">
                {/* Format pills */}
                <div className={cn("flex flex-wrap items-center gap-2", fullWidth && "justify-center")}>
                  <span className="shrink-0 text-[10px] font-black uppercase tracking-[0.14em] text-brand-muted">Format</span>
                  {FORMATS.map(f => {
                    const active = formats.includes(f.id);
                    const locked = !isProTier && PRO_FORMATS.includes(f.id);
                    return (
                      <button
                        key={f.id}
                        onClick={() => toggleFormat(f.id)}
                        className={cn("flex items-center gap-1.5 rounded-lg border px-2.5 text-[13px] font-bold transition-all", fullWidth ?"py-1" :"py-1.5",
                          active
                            ?"border-transparent text-white bg-[#0B1F16]"
                            :"border-brand-border bg-brand-surface text-brand-muted hover:border-zinc-300 dark:hover:border-zinc-700"
                        )}
                      >
                        <span
                          className={cn("flex h-4 w-4 items-center justify-center rounded text-[9px] font-black",
                            active &&"bg-white/20 text-white"
                          )}
                          style={active ? {} : { background: f.dotBg, color: f.dotColor }}
                        >
                          {f.label[0]}
                        </span>
                        {f.label}
                        {locked && <Lock size={11} className="opacity-50" />}
                      </button>
                    );
                  })}
                </div>

                {cloudNotice && (
                  <p className={cn("mt-2 text-[11px] font-semibold text-pine-600", fullWidth && "text-center")}>{cloudNotice}</p>
                )}
                {formatNotice ? (
                  <p className={cn("mt-2 text-[11px] font-semibold text-pine-600", fullWidth && "text-center")}>{formatNotice} <a href="/pricing" className="underline">See Pro plan</a></p>
                ) : (
                  <p className={cn("mt-2 text-[11px] text-brand-muted", fullWidth && "text-center")}>Pick one or more formats — you get a separate download for each.</p>
                )}

              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
