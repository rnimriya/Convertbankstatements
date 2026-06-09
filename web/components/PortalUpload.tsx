"use client";

import { useState, useRef } from "react";
import { Upload, Loader2, CheckCircle2, FileSpreadsheet, Download, AlertCircle } from "lucide-react";

interface Props {
  portalToken: string;
  portalLabel: string;
}

type Phase = "idle" | "uploading" | "done" | "error";

interface ExportUrls { csv?: string; xlsx?: string }

export function PortalUpload({ portalToken, portalLabel }: Props) {
  const [phase, setPhase] = useState<Phase>("idle");
  const [dragOver, setDragOver] = useState(false);
  const [fileName, setFileName] = useState("");
  const [txCount, setTxCount] = useState(0);
  const [bankName, setBankName] = useState("");
  const [exportUrls, setExportUrls] = useState<ExportUrls>({});
  const [errorMsg, setErrorMsg] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  async function processFile(file: File) {
    if (!file.name.toLowerCase().endsWith(".pdf")) {
      setErrorMsg("Please upload a PDF file.");
      setPhase("error");
      return;
    }

    setFileName(file.name);
    setPhase("uploading");

    const fd = new FormData();
    fd.append("file", file);
    fd.append("export_formats", "csv,xlsx");
    fd.append("portal_token", portalToken);

    try {
      const res = await fetch("/api/process-statement", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message ?? data.error ?? "Processing failed");

      setTxCount(data.transaction_count ?? 0);
      setBankName(data.bank_name ?? "Unknown bank");
      setExportUrls(data.export_urls ?? {});
      setPhase("done");
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : "Something went wrong.");
      setPhase("error");
    }
  }

  function onFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  }

  function onDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) processFile(file);
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <img src="/logo.svg" alt="Convert Statement" className="h-10 w-10 mx-auto mb-4" />
          <h1 className="font-display text-2xl font-bold text-slate-900">{portalLabel}</h1>
          <p className="text-sm text-slate-500 mt-1">Upload your bank statement PDF below. Your document will be converted and shared securely.</p>
        </div>

        {/* Upload card */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          {phase === "idle" && (
            <div
              onClick={() => inputRef.current?.click()}
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={onDrop}
              className={`flex flex-col items-center justify-center gap-4 p-10 cursor-pointer transition-colors ${dragOver ? "bg-navy/5 border-navy/30" : "hover:bg-slate-50"}`}
            >
              <div className="w-14 h-14 rounded-2xl bg-navy/10 flex items-center justify-center">
                <Upload size={24} className="text-navy" />
              </div>
              <div className="text-center">
                <p className="font-semibold text-slate-800">Drop your PDF here</p>
                <p className="text-sm text-slate-400 mt-0.5">or click to browse</p>
              </div>
              <p className="text-xs text-slate-300">PDF only · Max 50 MB</p>
              <input ref={inputRef} type="file" accept=".pdf,application/pdf" className="hidden" onChange={onFileSelect} />
            </div>
          )}

          {phase === "uploading" && (
            <div className="flex flex-col items-center justify-center gap-4 p-10">
              <Loader2 size={36} className="text-navy animate-spin" />
              <div className="text-center">
                <p className="font-semibold text-slate-800">Converting…</p>
                <p className="text-sm text-slate-400 truncate max-w-[260px]">{fileName}</p>
              </div>
            </div>
          )}

          {phase === "done" && (
            <div className="p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
                  <CheckCircle2 size={20} className="text-emerald-600" />
                </div>
                <div>
                  <p className="font-semibold text-slate-900">Conversion complete!</p>
                  <p className="text-xs text-slate-400">{txCount} transactions · {bankName}</p>
                </div>
              </div>

              <div className="space-y-2">
                {exportUrls.xlsx && (
                  <a
                    href={exportUrls.xlsx}
                    download={fileName.replace(".pdf", ".xlsx")}
                    className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-navy text-white text-sm font-semibold hover:opacity-90 transition-opacity"
                  >
                    <FileSpreadsheet size={15} />
                    Download Excel (.xlsx)
                  </a>
                )}
                {exportUrls.csv && (
                  <a
                    href={exportUrls.csv}
                    download={fileName.replace(".pdf", ".csv")}
                    className="flex items-center justify-center gap-2 w-full py-3 rounded-xl border border-slate-200 text-slate-700 text-sm font-semibold hover:border-navy/30 hover:text-navy transition-colors"
                  >
                    <Download size={15} />
                    Download CSV
                  </a>
                )}
              </div>

              <button
                onClick={() => { setPhase("idle"); setFileName(""); setExportUrls({}); }}
                className="mt-4 w-full text-sm text-slate-400 hover:text-slate-600 transition-colors text-center"
              >
                Upload another file
              </button>
            </div>
          )}

          {phase === "error" && (
            <div className="p-8 flex flex-col items-center gap-4 text-center">
              <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                <AlertCircle size={22} className="text-red-500" />
              </div>
              <div>
                <p className="font-semibold text-slate-900">Upload failed</p>
                <p className="text-sm text-slate-500 mt-1">{errorMsg}</p>
              </div>
              <button
                onClick={() => { setPhase("idle"); setErrorMsg(""); }}
                className="px-5 py-2.5 rounded-xl bg-navy text-white text-sm font-semibold hover:opacity-90 transition-opacity"
              >
                Try again
              </button>
            </div>
          )}
        </div>

        <p className="text-center text-xs text-slate-400 mt-6">
          Secured by <span className="font-medium">Convert Statement</span> · Your file is processed in memory and never stored
        </p>
      </div>
    </div>
  );
}
