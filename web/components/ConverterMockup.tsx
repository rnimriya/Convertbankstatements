"use client";

import { useState, useEffect } from "react";
import {
  ArrowDownLeft, ArrowUpRight, Download, Loader2,
  CheckCircle2, Zap, Shield, FileText,
} from "lucide-react";

type Phase = "idle" | "processing" | "done";

const BANKS = [
  { name: "HDFC Bank",  initial: "H", hex: "#dc2626" },
  { name: "SBI",        initial: "S", hex: "#1d4ed8" },
  { name: "ICICI Bank", initial: "I", hex: "#b45309" },
  { name: "Axis Bank",  initial: "A", hex: "#7c3aed" },
];

const FILES = [
  "HDFC_Statement_Jan2025.pdf",
  "SBI_Account_Nov2024.pdf",
  "ICICI_Q3_2025.pdf",
  "Axis_Dec2024.pdf",
];

/* Indian-style realistic transactions */
const TXNS = [
  { desc: "SALARY CREDIT NEFT",   amt: "+₹58,000", pos: true,  date: "01 Jan" },
  { desc: "ATM WDL HDFC BANK",    amt: "−₹5,000",  pos: false, date: "02 Jan" },
  { desc: "SWIGGY ORDER 78231",   amt: "−₹342",    pos: false, date: "04 Jan" },
  { desc: "HOUSE RENT NEFT",      amt: "−₹18,000", pos: false, date: "05 Jan" },
  { desc: "UPI FREELANCE CREDIT", amt: "+₹12,500", pos: true,  date: "12 Jan" },
  { desc: "AMAZON PAY PURCHASE",  amt: "−₹2,499",  pos: false, date: "14 Jan" },
];

const FORMATS = ["XLSX", "CSV", "OFX", "Sheets"];

const RING_R = 17;
const RING_C = 2 * Math.PI * RING_R;

/* Dark glass card style shared by floating badges */
const GLASS: React.CSSProperties = {
  background: "rgba(5,10,30,0.90)",
  border: "1px solid rgba(255,255,255,0.09)",
  backdropFilter: "blur(20px)",
  WebkitBackdropFilter: "blur(20px)",
};

export default function ConverterMockup() {
  const [phase, setPhase]       = useState<Phase>("idle");
  const [progress, setProgress] = useState(0);
  const [selFmt, setSelFmt]     = useState(0);
  const [bankIdx, setBankIdx]   = useState(0);
  const [visRows, setVisRows]   = useState(0);
  const [cycle, setCycle]       = useState(0);

  useEffect(() => {
    setProgress(0);
    setVisRows(0);
    setPhase("idle");

    const ids: ReturnType<typeof setTimeout>[] = [];
    const t = (fn: () => void, ms: number) => { const id = setTimeout(fn, ms); ids.push(id); };

    /* Start processing */
    t(() => setPhase("processing"), 900);

    /* Reveal each transaction row */
    for (let i = 0; i < TXNS.length; i++) {
      const idx = i;
      t(() => setVisRows(idx + 1), 1000 + idx * 450);
    }

    /* Progress ticks */
    for (let i = 1; i <= 32; i++) {
      t(() => setProgress(p => Math.min(p + Math.random() * 4 + 2, 95)), i * 90);
    }

    /* Done */
    t(() => { setProgress(100); setPhase("done"); }, 3600);

    /* Next cycle */
    t(() => {
      setSelFmt(f => (f + 1) % FORMATS.length);
      setBankIdx(b => (b + 1) % BANKS.length);
      setCycle(c => c + 1);
    }, 7400);

    return () => ids.forEach(clearTimeout);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cycle]);

  const bank = BANKS[bankIdx];
  const done = phase === "done";
  const proc = phase === "processing";

  return (
    <div className="relative select-none" style={{ width: 480 }}>

      {/* Ambient glow behind card */}
      <div
        className="absolute pointer-events-none"
        style={{
          inset: "-40px",
          background: "radial-gradient(ellipse at 55% 50%, rgba(59,91,252,0.22) 0%, transparent 65%)",
          filter: "blur(30px)",
        }}
      />

      {/* ══════════════════ MAIN CARD ══════════════════ */}
      <div
        className="relative rounded-3xl overflow-hidden"
        style={{
          background: "linear-gradient(160deg, #0d1638 0%, #101f52 55%, #0b1430 100%)",
          border: "1px solid rgba(255,255,255,0.08)",
          boxShadow: "0 40px 90px rgba(0,0,0,0.55), 0 0 0 1px rgba(255,255,255,0.04), inset 0 1px 0 rgba(255,255,255,0.06)",
        }}
      >

        {/* ── HEADER ── */}
        <div
          className="flex items-center gap-3 px-5 py-4"
          style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}
        >
          {/* Bank avatar */}
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center text-base font-black shrink-0"
            style={{ background: `${bank.hex}22`, border: `1.5px solid ${bank.hex}55`, color: bank.hex }}
          >
            {bank.initial}
          </div>

          <div className="flex-1 min-w-0">
            <p className="text-[13px] font-bold text-white leading-none mb-0.5">{bank.name}</p>
            <p className="text-[11px] truncate" style={{ color: "rgba(255,255,255,0.32)" }}>
              {FILES[bankIdx]}
            </p>
          </div>

          {/* Circular progress ring */}
          <div className="relative w-11 h-11 shrink-0 flex items-center justify-center">
            <svg width="44" height="44" viewBox="0 0 44 44" className="absolute inset-0 -rotate-90">
              <circle cx="22" cy="22" r={RING_R} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="4" />
              <circle
                cx="22" cy="22" r={RING_R}
                fill="none"
                stroke={done ? "#10b981" : "#4f72f5"}
                strokeWidth="4"
                strokeLinecap="round"
                strokeDasharray={RING_C}
                strokeDashoffset={RING_C * (1 - progress / 100)}
                style={{ transition: "stroke-dashoffset 0.15s ease, stroke 0.4s ease" }}
              />
            </svg>
            <span
              className="relative text-[10px] font-black tabular-nums"
              style={{ color: done ? "#10b981" : "rgba(255,255,255,0.85)" }}
            >
              {Math.round(progress)}%
            </span>
          </div>
        </div>

        {/* ── TRANSACTION FEED ── */}
        <div className="px-4 pt-4 pb-3">
          {/* Column headers */}
          <div
            className="flex items-center gap-2 px-3 mb-2.5 text-[9px] font-bold uppercase tracking-[0.12em]"
            style={{ color: "rgba(255,255,255,0.20)" }}
          >
            <span className="w-6 shrink-0" />
            <span className="flex-1">Description</span>
            <span className="w-20 text-right">Amount</span>
            <span className="w-12 text-right">Date</span>
          </div>

          {/* Rows */}
          <div className="space-y-1.5" style={{ minHeight: 228 }}>
            {TXNS.slice(0, visRows).map((txn, i) => (
              <div
                key={i}
                className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl"
                style={{
                  background: "rgba(255,255,255,0.07)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  animation: "slideInRow 0.32s ease forwards",
                }}
              >
                {/* Direction icon */}
                <div
                  className="w-6 h-6 rounded-lg flex items-center justify-center shrink-0"
                  style={{ background: txn.pos ? "rgba(16,185,129,0.18)" : "rgba(239,68,68,0.14)" }}
                >
                  {txn.pos
                    ? <ArrowDownLeft size={12} className="text-emerald-400" />
                    : <ArrowUpRight  size={12} className="text-rose-400" />
                  }
                </div>

                <span
                  className="flex-1 text-[12px] font-medium truncate"
                  style={{ color: "rgba(255,255,255,0.72)", fontVariantNumeric: "tabular-nums" }}
                >
                  {txn.desc}
                </span>

                <span
                  className="w-20 text-right text-[12px] font-bold tabular-nums shrink-0"
                  style={{ color: txn.pos ? "#34d399" : "#f87171" }}
                >
                  {txn.amt}
                </span>

                <span
                  className="w-12 text-right text-[10px] shrink-0"
                  style={{ color: "rgba(255,255,255,0.22)" }}
                >
                  {txn.date}
                </span>
              </div>
            ))}

            {/* Extracting spinner row */}
            {proc && visRows < TXNS.length && (
              <div className="flex items-center gap-2.5 px-3 py-2.5">
                <div className="w-6 h-6 rounded-lg bg-blue-900/40 flex items-center justify-center shrink-0">
                  <Loader2 size={11} className="animate-spin text-blue-400" />
                </div>
                <span className="text-[12px]" style={{ color: "rgba(255,255,255,0.18)" }}>
                  Extracting…
                </span>
                <div className="flex gap-1 ml-1">
                  {[0, 1, 2].map(i => (
                    <div
                      key={i}
                      className="w-1 h-1 rounded-full bg-blue-400/60"
                      style={{ animation: `dotBounce 0.9s ease-in-out ${i * 0.18}s infinite` }}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Done state: total summary row */}
            {done && (
              <div
                className="flex items-center gap-2.5 px-3 py-3 rounded-xl mt-1"
                style={{ background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.18)" }}
              >
                <CheckCircle2 size={15} className="text-emerald-400 shrink-0" />
                <span className="text-[12px] font-semibold text-emerald-400 flex-1">
                  142 transactions extracted successfully
                </span>
                <span className="text-[11px] text-emerald-400/60">3.2s</span>
              </div>
            )}
          </div>
        </div>

        {/* ── FOOTER: format + CTA ── */}
        <div
          className="px-4 pt-3 pb-4"
          style={{ borderTop: "1px solid rgba(255,255,255,0.06)", background: "rgba(0,0,0,0.18)" }}
        >
          <div className="flex gap-1.5 mb-3">
            {FORMATS.map((f, i) => (
              <button
                key={f}
                onClick={() => setSelFmt(i)}
                className="flex-1 py-2 rounded-xl text-[11px] font-bold transition-all duration-200"
                style={
                  i === selFmt
                    ? { background: "linear-gradient(135deg,#1A47C8,#3b6ef5)", color: "#fff", boxShadow: "0 4px 12px rgba(26,71,200,0.45)" }
                    : { background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.38)" }
                }
              >
                {f}
              </button>
            ))}
          </div>

          <button
            className="w-full py-3.5 rounded-xl text-sm font-bold text-white flex items-center justify-center gap-2 relative overflow-hidden"
            style={{ background: "linear-gradient(135deg,#f97316,#ea580c)", boxShadow: "0 6px 22px rgba(249,115,22,0.42)" }}
          >
            <span
              className="absolute inset-0 pointer-events-none"
              style={{ background: "linear-gradient(90deg,transparent,rgba(255,255,255,0.15),transparent)", animation: "shimmerSlide 2.2s ease-in-out infinite" }}
            />
            <Download size={15} className="relative z-10" />
            <span className="relative z-10">Download {FORMATS[selFmt]}</span>
          </button>
        </div>
      </div>

      {/* ── FLOATING BADGE: top-right — speed ── */}
      <div
        className="absolute -top-4 -right-6 z-20 flex items-center gap-2.5 px-4 py-3 rounded-2xl shadow-2xl"
        style={GLASS}
      >
        <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ background: "rgba(245,158,11,0.18)" }}>
          <Zap size={17} className="text-amber-400" />
        </div>
        <div>
          <p className="text-[12px] font-bold text-white leading-tight">11.2s avg.</p>
          <p className="text-[10px] leading-tight" style={{ color: "rgba(255,255,255,0.38)" }}>Conversion speed</p>
        </div>
      </div>

      {/* ── FLOATING BADGE: top-left — file count ── */}
      <div
        className="absolute -top-4 -left-6 z-20 flex items-center gap-2.5 px-4 py-3 rounded-2xl shadow-2xl"
        style={GLASS}
      >
        <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ background: "rgba(59,91,252,0.20)" }}>
          <FileText size={16} className="text-indigo-400" />
        </div>
        <div>
          <p className="text-[12px] font-bold text-white leading-tight">30+ Banks</p>
          <p className="text-[10px] leading-tight" style={{ color: "rgba(255,255,255,0.38)" }}>All Indian banks</p>
        </div>
      </div>

      {/* ── FLOATING BADGE: bottom-left — privacy ── */}
      <div
        className="absolute -bottom-4 -left-6 z-20 flex items-center gap-2.5 px-4 py-3 rounded-2xl shadow-2xl"
        style={GLASS}
      >
        <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ background: "rgba(139,92,246,0.18)" }}>
          <Shield size={16} className="text-violet-400" />
        </div>
        <div>
          <p className="text-[12px] font-bold text-white leading-tight">100% Private</p>
          <p className="text-[10px] leading-tight" style={{ color: "rgba(255,255,255,0.38)" }}>Files never stored</p>
        </div>
      </div>

      {/* ── FLOATING BADGE: bottom-right — done indicator ── */}
      <div
        className={`absolute -bottom-4 -right-6 z-20 flex items-center gap-2.5 px-4 py-3 rounded-2xl shadow-2xl transition-all duration-500 ${done ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"}`}
        style={GLASS}
      >
        <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ background: "rgba(16,185,129,0.18)" }}>
          <CheckCircle2 size={17} className="text-emerald-400" />
        </div>
        <div>
          <p className="text-[12px] font-bold text-white leading-tight">Done!</p>
          <p className="text-[10px] leading-tight" style={{ color: "rgba(255,255,255,0.38)" }}>142 txns extracted</p>
        </div>
      </div>

    </div>
  );
}
