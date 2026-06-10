"use client";

import { useState, useEffect, useCallback } from "react";
import { CheckCircle2, FileSpreadsheet, Download, Shield, Zap, Loader2 } from "lucide-react";

type Phase = "idle" | "processing" | "done";

const FILES = [
  { name: "HDFC_Statement_Jan2025.pdf", bank: "HDFC Bank", txns: 142, pages: 4 },
  { name: "SBI_Account_Nov2024.pdf",    bank: "SBI",       txns: 87,  pages: 6 },
  { name: "ICICI_Q3_2025.pdf",          bank: "ICICI Bank",txns: 201, pages: 3 },
  { name: "Axis_Dec2024.pdf",           bank: "Axis Bank", txns: 64,  pages: 2 },
];

const FORMATS = ["XLSX", "CSV", "OFX", "Sheets"];

const TXNS = [
  { desc: "UPI Transfer",  amt: "+₹12,500", pos: true  },
  { desc: "HDFC ATM",      amt: "−₹3,000",  pos: false },
  { desc: "Salary Credit", amt: "+₹58,000", pos: true  },
];

/* Shared floating card style */
const FLOAT: React.CSSProperties = {
  background: "rgba(6,12,38,0.92)",
  border: "1px solid rgba(255,255,255,0.10)",
  backdropFilter: "blur(20px)",
  WebkitBackdropFilter: "blur(20px)",
};

export default function ConverterMockup() {
  const [phase, setPhase]         = useState<Phase>("idle");
  const [progress, setProgress]   = useState(0);
  const [selFmt, setSelFmt]       = useState(0);
  const [fileIdx, setFileIdx]     = useState(0);
  const [cycle, setCycle]         = useState(0);

  const runCycle = useCallback(() => {
    setProgress(0);
    setPhase("idle");

    const t1 = setTimeout(() => setPhase("processing"), 1200);

    let p = 0;
    const iv = setInterval(() => {
      p += Math.random() * 16 + 8;
      if (p >= 100) { p = 100; clearInterval(iv); }
      setProgress(Math.min(p, 100));
    }, 85);

    const t2 = setTimeout(() => { setProgress(100); setPhase("done"); }, 3000);

    const t3 = setTimeout(() => {
      setSelFmt(f => (f + 1) % FORMATS.length);
      setFileIdx(i => (i + 1) % FILES.length);
      setCycle(c => c + 1);
    }, 6800);

    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearInterval(iv); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => runCycle(), [cycle]);

  const file = FILES[fileIdx];
  const done = phase === "done";
  const proc = phase === "processing";

  return (
    /* ── Outer illustration container ─────────────────────────── */
    <div className="relative select-none" style={{ padding: "72px 88px 84px" }}>

      {/* Dark gradient background */}
      <div
        className="absolute inset-0 rounded-[2rem]"
        style={{ background: "linear-gradient(150deg, #060c22 0%, #0b1845 45%, #070e28 100%)" }}
      />

      {/* Dot grid */}
      <div
        className="absolute inset-0 rounded-[2rem] pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.055) 1px, transparent 1px)",
          backgroundSize: "26px 26px",
        }}
      />

      {/* Decorative rings (centered behind browser) */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden rounded-[2rem]">
        <div
          className="absolute rounded-full"
          style={{ width: 580, height: 580, border: "1px solid rgba(255,255,255,0.06)" }}
        />
        <div
          className="absolute rounded-full"
          style={{ width: 420, height: 420, border: "1px dashed rgba(255,255,255,0.05)" }}
        />
        <div
          className="absolute rounded-full"
          style={{
            width: 260, height: 260,
            background: "radial-gradient(circle, rgba(59,91,252,0.18) 0%, transparent 70%)",
          }}
        />
      </div>

      {/* ── BROWSER WINDOW ─────────────────────────────────────── */}
      <div
        className="relative z-10 bg-white rounded-2xl overflow-hidden"
        style={{
          minWidth: 400,
          boxShadow: "0 32px 80px rgba(0,0,0,0.55), 0 0 0 1px rgba(255,255,255,0.08)",
        }}
      >
        {/* Chrome bar */}
        <div
          className="flex items-center gap-3 px-4 py-3"
          style={{ background: "#f1f5f9", borderBottom: "1px solid #e2e8f0" }}
        >
          <div className="flex gap-1.5 shrink-0">
            <div className="w-3 h-3 rounded-full bg-red-400" />
            <div className="w-3 h-3 rounded-full bg-amber-400" />
            <div className="w-3 h-3 rounded-full bg-emerald-400" />
          </div>
          <div className="flex-1 flex items-center justify-center">
            <div
              className="flex items-center gap-2 bg-white rounded-lg px-3 py-1.5"
              style={{ border: "1px solid #e2e8f0", maxWidth: 260, width: "100%" }}
            >
              <div className="w-2 h-2 rounded-full border border-slate-300 shrink-0" />
              <span className="text-[11px] text-slate-400 font-medium truncate">
                convertstatement.online/convert
              </span>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5">

          {/* File row */}
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-slate-400 mb-2.5">
              Bank Statement PDF
            </p>
            <div
              className="flex items-center gap-3.5 px-4 py-3.5 rounded-xl"
              style={{ background: "#f8fafc", border: "1px solid #e8edf4" }}
            >
              <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center shrink-0">
                <FileSpreadsheet size={20} className="text-red-500" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[13px] font-semibold text-slate-700 truncate">{file.name}</p>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  {file.bank} &middot; {file.pages} pages
                </p>
              </div>
              <CheckCircle2 size={17} className="text-emerald-500 shrink-0" />
            </div>
          </div>

          {/* Progress */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {proc && <Loader2 size={13} className="text-navy animate-spin" />}
                {done && <CheckCircle2 size={13} className="text-emerald-500" />}
                <span
                  className={`text-sm font-semibold transition-colors ${
                    done ? "text-emerald-600" : proc ? "text-navy" : "text-slate-400"
                  }`}
                >
                  {done ? "Done!" : proc ? "Converting…" : "Ready"}
                </span>
              </div>
              <span
                className={`text-base font-black tabular-nums transition-colors ${
                  done ? "text-emerald-600" : "text-navy"
                }`}
              >
                {Math.round(progress)}%
              </span>
            </div>

            {/* Bar */}
            <div className="h-2.5 rounded-full overflow-hidden" style={{ background: "#f1f5f9" }}>
              <div
                className="h-full rounded-full transition-all duration-150 ease-out relative overflow-hidden"
                style={{
                  width: `${progress}%`,
                  background: done
                    ? "linear-gradient(90deg, #10b981, #34d399)"
                    : "linear-gradient(90deg, #1A47C8, #4f72f5, #818cf8)",
                  backgroundSize: "200% 100%",
                  animation: proc ? "progressShimmer 1.4s linear infinite" : undefined,
                }}
              />
            </div>

            {done && (
              <p className="text-xs font-semibold text-emerald-600">
                ✓ {file.txns} transactions extracted successfully
              </p>
            )}
          </div>

          {/* Format picker */}
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-slate-400 mb-2.5">
              Export format
            </p>
            <div className="grid grid-cols-4 gap-2">
              {FORMATS.map((f, i) => (
                <button
                  key={f}
                  onClick={() => setSelFmt(i)}
                  className="py-2.5 rounded-xl text-xs font-bold transition-all duration-200"
                  style={
                    i === selFmt
                      ? {
                          background: "linear-gradient(135deg, #1A47C8, #3b6ef5)",
                          color: "#fff",
                          boxShadow: "0 4px 14px rgba(26,71,200,0.35)",
                          transform: "scale(1.05)",
                        }
                      : { background: "#f1f5f9", color: "#64748b" }
                  }
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          {/* CTA */}
          <button
            className="w-full py-3.5 rounded-xl text-sm font-bold text-white flex items-center justify-center gap-2 relative overflow-hidden"
            style={{
              background: "linear-gradient(135deg, #1A47C8, #3b6ef5)",
              boxShadow: "0 6px 24px rgba(26,71,200,0.45)",
            }}
          >
            <span
              className="absolute inset-0 pointer-events-none"
              style={{
                background: "linear-gradient(90deg,transparent,rgba(255,255,255,0.16),transparent)",
                animation: "shimmerSlide 2.2s ease-in-out infinite",
              }}
            />
            <Download size={15} className="relative z-10" />
            <span className="relative z-10">Convert &amp; Download</span>
          </button>
        </div>
      </div>

      {/* ── FLOATING BADGE: Processing complete (top-left) ─────── */}
      <div
        className={`absolute z-20 flex items-center gap-3 px-5 py-4 rounded-2xl shadow-2xl transition-all duration-500 ${
          done ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2"
        }`}
        style={{ ...FLOAT, top: 20, left: 4 }}
      >
        <div
          className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
          style={{ background: "rgba(16,185,129,0.18)" }}
        >
          <CheckCircle2 size={22} className="text-emerald-400" />
        </div>
        <div>
          <p className="text-[13px] font-bold text-white leading-tight">Processing complete</p>
          <p className="text-[11px] mt-0.5" style={{ color: "rgba(255,255,255,0.40)" }}>
            {file.txns} transactions extracted
          </p>
        </div>
      </div>

      {/* ── FLOATING BADGE: Never stored (top-right) ───────────── */}
      <div
        className="absolute z-20 flex items-center gap-3 px-5 py-4 rounded-2xl shadow-2xl"
        style={{ ...FLOAT, top: 20, right: 4 }}
      >
        <div
          className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
          style={{ background: "rgba(139,92,246,0.18)" }}
        >
          <Shield size={20} className="text-violet-400" />
        </div>
        <div>
          <p className="text-[13px] font-bold text-white leading-tight">Never stored</p>
          <p className="text-[11px] mt-0.5" style={{ color: "rgba(255,255,255,0.40)" }}>100% private</p>
        </div>
      </div>

      {/* ── FLOATING CARD: Latest transactions (bottom-left) ────── */}
      <div
        className="absolute z-20 rounded-2xl shadow-2xl overflow-hidden"
        style={{ ...FLOAT, bottom: 14, left: 0, minWidth: 220 }}
      >
        <div
          className="px-4 py-3"
          style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}
        >
          <p
            className="text-[9px] font-bold uppercase tracking-[0.14em]"
            style={{ color: "rgba(255,255,255,0.35)" }}
          >
            Latest Transactions
          </p>
        </div>
        {TXNS.map(tx => (
          <div key={tx.desc} className="flex items-center justify-between px-4 py-3">
            <span className="text-[12px] font-medium" style={{ color: "rgba(255,255,255,0.55)" }}>
              {tx.desc}
            </span>
            <span
              className="text-[12px] font-bold tabular-nums ml-4"
              style={{ color: tx.pos ? "#34d399" : "#f87171" }}
            >
              {tx.amt}
            </span>
          </div>
        ))}
      </div>

      {/* ── FLOATING BADGE: Speed (bottom-right) ───────────────── */}
      <div
        className="absolute z-20 flex items-center gap-3 px-5 py-4 rounded-2xl shadow-2xl"
        style={{ ...FLOAT, bottom: 14, right: 4 }}
      >
        <div
          className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
          style={{ background: "rgba(245,158,11,0.18)" }}
        >
          <Zap size={20} className="text-amber-400" />
        </div>
        <div>
          <p className="text-[13px] font-bold text-white leading-tight">11.2s avg.</p>
          <p className="text-[11px] mt-0.5" style={{ color: "rgba(255,255,255,0.40)" }}>
            Conversion speed
          </p>
        </div>
      </div>

    </div>
  );
}
