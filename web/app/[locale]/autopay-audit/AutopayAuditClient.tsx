"use client";

/**
 * AutoPay Khoj — upload + report shell (Day 6, 2026-11-11).
 *
 * Starts on the clearly-labelled SAMPLE report. When the user uploads
 * a statement PDF, it posts to /api/autopay-audit (the PDF is parsed
 * in memory server-side and never stored), and the real report
 * replaces the sample. Errors are shown in plain words — including
 * the honest one: password-protected statements are not supported
 * yet, exactly as in the main converter.
 */
import { useRef, useState } from "react";
import type { ReportVM } from "@/lib/autopay/report-vm";
import { AutopayReport } from "./AutopayReport";

type Mode = "sample" | "real";

export function AutopayAuditClient({ sampleVM }: { sampleVM: ReportVM }) {
  const [vm, setVm] = useState<ReportVM>(sampleVM);
  const [mode, setMode] = useState<Mode>("sample");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [realMeta, setRealMeta] = useState<{ fileName: string; bankName: string | null; transactionCount: number } | null>(null);
  const [email, setEmail] = useState("");
  const [emailBusy, setEmailBusy] = useState(false);
  const [emailNote, setEmailNote] = useState<{ ok: boolean; text: string } | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFile(file: File) {
    setError(null);
    setEmailNote(null);
    if (!file.name.toLowerCase().endsWith(".pdf")) {
      setError("That file is not a PDF. Please choose your bank statement PDF.");
      return;
    }
    setBusy(true);
    try {
      const form = new FormData();
      form.append("file", file);
      const res = await fetch("/api/autopay-audit", { method: "POST", body: form });
      const data = await res.json().catch(() => null);
      if (!res.ok || !data?.success) {
        setError(data?.error ?? "Something went wrong while reading that PDF. Please try again.");
        return;
      }
      setVm(data.vm as ReportVM);
      setMode("real");
      setRealMeta({
        fileName: data.fileName as string,
        bankName: (data.bankName as string | null) ?? null,
        transactionCount: data.transactionCount as number,
      });
    } catch {
      setError("We could not reach the audit service. Please check your connection and try again.");
    } finally {
      setBusy(false);
    }
  }

  async function sendEmail() {
    setEmailNote(null);
    const addr = email.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(addr)) {
      setEmailNote({ ok: false, text: "Please enter a valid email address." });
      return;
    }
    setEmailBusy(true);
    try {
      const res = await fetch("/api/autopay-audit/email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: addr, vm }),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok || !data?.success) {
        setEmailNote({ ok: false, text: data?.error ?? "The email could not be sent. Please try again." });
        return;
      }
      setEmailNote({ ok: true, text: `Your report (PDF) is on its way to ${addr}.` });
    } catch {
      setEmailNote({ ok: false, text: "The email could not be sent. Please try again." });
    } finally {
      setEmailBusy(false);
    }
  }

  return (
    <div>
      {/* Upload card */}
      <div
        className={`rounded-[24px] border-2 border-dashed bg-white p-8 text-center ${dragOver ? "border-[#2CA01C] bg-[#EFF7ED]" : "border-[#C9DFC2]"}`}
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          const f = e.dataTransfer.files?.[0];
          if (f) void handleFile(f);
        }}
      >
        <h2 className="text-xl font-bold text-[#0B1F16] sm:text-2xl">Audit my statement — free</h2>
        <p className="mx-auto mt-2 max-w-xl text-sm leading-relaxed text-[#5c6f63]">
          Drop your bank statement PDF here, or choose it from your device. It is processed in memory to
          build your report and is never stored. No bank login, no card details — ever.
        </p>
        <input
          ref={inputRef}
          type="file"
          accept="application/pdf,.pdf"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) void handleFile(f);
            e.target.value = "";
          }}
        />
        <button
          type="button"
          disabled={busy}
          onClick={() => inputRef.current?.click()}
          className="mt-5 inline-flex items-center gap-2 rounded-full bg-[#2CA01C] px-7 py-3.5 text-sm font-bold text-white disabled:opacity-60"
        >
          {busy ? "Reading your statement…" : "Choose statement PDF"}
        </button>
        <p className="mt-3 text-xs text-[#5c6f63]">
          One honest limit: if your statement PDF is password-protected, remove the password first — protected
          files are not supported yet, just as in our converter.
        </p>
        {error && (
          <p className="mx-auto mt-4 max-w-xl rounded-xl border border-[#FECDCA] bg-[#FEF3F2] px-4 py-3 text-sm font-semibold text-[#B42318]">
            {error}
          </p>
        )}
      </div>

      {/* Report banner */}
      {mode === "sample" ? (
        <div className="mt-8 rounded-[24px] border border-[#FEDF89] bg-[#FFFAEB] px-6 py-4">
          <p className="text-sm font-bold text-[#B54708]">SAMPLE REPORT</p>
          <p className="mt-1 text-sm leading-relaxed text-[#7A4A08]">
            This report was built from a demo statement so you can see exactly what an audit looks like —
            every number below is real output of the audit engine, run on sample charges. Upload your own
            statement above and this becomes your report.
          </p>
        </div>
      ) : (
        <div className="mt-8 rounded-[24px] border border-[#D8E8D2] bg-[#EFF7ED] px-6 py-4">
          <p className="text-sm font-bold text-[#007A33]">YOUR REPORT</p>
          <p className="mt-1 text-sm leading-relaxed text-[#3d5546]">
            Built from {realMeta?.fileName}
            {realMeta?.bankName ? ` (${realMeta.bankName})` : ""} — {realMeta?.transactionCount} transactions
            read. Your PDF was processed in memory and was not stored.
          </p>
          {/* Email the report */}
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-64 rounded-full border border-[#C9DFC2] bg-white px-4 py-2.5 text-sm text-[#0B1F16] outline-none"
            />
            <button
              type="button"
              disabled={emailBusy}
              onClick={() => void sendEmail()}
              className="inline-flex items-center gap-2 rounded-full border border-[#00573F] bg-white px-5 py-2.5 text-sm font-bold text-[#00573F] disabled:opacity-60"
            >
              {emailBusy ? "Sending…" : "Email me this report (PDF)"}
            </button>
          </div>
          {emailNote && (
            <p className={`mt-3 text-sm font-semibold ${emailNote.ok ? "text-[#007A33]" : "text-[#B42318]"}`}>
              {emailNote.text}
            </p>
          )}
        </div>
      )}

      <div className="mt-8">
        <AutopayReport vm={vm} />
      </div>
    </div>
  );
}
