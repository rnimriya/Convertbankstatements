"use client";

import { useState, useEffect } from"react";
import { ArrowDownLeft, ArrowUpRight, Download, Loader2, CheckCircle2 } from"lucide-react";

type Phase ="idle" |"processing" |"done";

const BANKS = [
  { name:"JPMorgan Chase", initial:"J", hex:"#005EB8" },
  { name:"Barclays",       initial:"B", hex:"#00AEEF" },
  { name:"SBI",            initial:"S", hex:"#1d4ed8" },
  { name:"Commonwealth",   initial:"C", hex:"#FFCC00" },
];

const FILES = ["Chase_Statement_Jan2025.pdf","Barclays_Account_Nov2024.pdf","SBI_Q3_2025.pdf","CBA_Dec2024.pdf",
];

const TXNS = [
  { desc:"SALARY CREDIT NEFT",   amt:"+₹58,000", pos: true,  date:"01 Jan" },
  { desc:"ATM WDL HDFC BANK",    amt:"−₹5,000",  pos: false, date:"02 Jan" },
  { desc:"SWIGGY ORDER 78231",   amt:"−₹342",    pos: false, date:"04 Jan" },
  { desc:"HOUSE RENT NEFT",      amt:"−₹18,000", pos: false, date:"05 Jan" },
  { desc:"UPI FREELANCE CREDIT", amt:"+₹12,500", pos: true,  date:"12 Jan" },
];

const FORMATS = ["XLSX","CSV","OFX","Sheets"];

const RING_R = 17;
const RING_C = 2 * Math.PI * RING_R;

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

    t(() => setPhase("processing"), 900);

    for (let i = 0; i < TXNS.length; i++) {
      const idx = i;
      t(() => setVisRows(idx + 1), 1000 + idx * 450);
    }

    for (let i = 1; i <= 32; i++) {
      t(() => setProgress(p => Math.min(p + Math.random() * 4 + 2, 95)), i * 90);
    }

    t(() => { setProgress(100); setPhase("done"); }, 3600);

    t(() => {
      setSelFmt(f => (f + 1) % FORMATS.length);
      setBankIdx(b => (b + 1) % BANKS.length);
      setCycle(c => c + 1);
    }, 7400);

    return () => ids.forEach(clearTimeout);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cycle]);

  const bank = BANKS[bankIdx];
  const done = phase ==="done";
  const proc = phase ==="processing";

  return (
    <div className="relative select-none" style={{ width: 460 }}>

      {/* Subtle ambient glow */}
      <div
        className="absolute pointer-events-none"
        style={{
          inset:"-32px",
          background:"radial-gradient(ellipse at 55% 50%, rgba(26,71,200,0.10) 0%, transparent 70%)",
          filter:"blur(24px)",
        }}
      />

      {/* ══════════════════ MAIN CARD ══════════════════ */}
      <div
        className="relative rounded-2xl overflow-hidden"
        style={{
          background:"#ffffff",
          border:"1px solid #e2e8f0",
          boxShadow:"0 20px 60px rgba(15,23,42,0.10), 0 4px 16px rgba(15,23,42,0.06)",
        }}
      >

        {/* ── HEADER ── */}
        <div
          className="flex items-center gap-3 px-5 py-4"
          style={{ borderBottom:"1px solid #f1f5f9" }}
        >
          {/* Bank avatar */}
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center text-base font-black shrink-0"
            style={{ background: `${bank.hex}14`, border: `1.5px solid ${bank.hex}33`, color: bank.hex }}
          >
            {bank.initial}
          </div>

          <div className="flex-1 min-w-0">
            <p className="text-[13px] font-bold text-zinc-800 dark:text-zinc-200 leading-none mb-0.5">{bank.name}</p>
            <p className="text-[11px] truncate text-zinc-400 dark:text-zinc-500">
              {FILES[bankIdx]}
            </p>
          </div>

          {/* Circular progress ring */}
          <div className="relative w-11 h-11 shrink-0 flex items-center justify-center">
            <svg width="44" height="44" viewBox="0 0 44 44" className="absolute inset-0 -rotate-90">
              <circle cx="22" cy="22" r={RING_R} fill="none" stroke="#e2e8f0" strokeWidth="4" />
              <circle
                cx="22" cy="22" r={RING_R}
                fill="none"
                stroke={done ?"#10b981" :"#1A47C8"}
                strokeWidth="4"
                strokeLinecap="round"
                strokeDasharray={RING_C}
                strokeDashoffset={RING_C * (1 - progress / 100)}
                style={{ transition:"stroke-dashoffset 0.15s ease, stroke 0.4s ease" }}
              />
            </svg>
            <span
              className="relative text-[10px] font-black tabular-nums"
              style={{ color: done ?"#10b981" :"#1A47C8" }}
            >
              {Math.round(progress)}%
            </span>
          </div>
        </div>

        {/* ── TRANSACTION FEED ── */}
        <div className="px-4 pt-4 pb-3">
          {/* Column headers */}
          <div className="flex items-center gap-2 px-3 mb-2.5 text-[9px] font-bold uppercase tracking-[0.12em] text-zinc-400 dark:text-zinc-500">
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
                  background:"#f8fafc",
                  border:"1px solid #e2e8f0",
                  animation:"slideInRow 0.32s ease forwards",
                }}
              >
                <div
                  className="w-6 h-6 rounded-lg flex items-center justify-center shrink-0"
                  style={{ background: txn.pos ?"rgba(16,185,129,0.12)" :"rgba(239,68,68,0.10)" }}
                >
                  {txn.pos
                    ? <ArrowDownLeft size={12} className="text-emerald-500 text-emerald-500 dark:text-emerald-400" />
                    : <ArrowUpRight  size={12} className="text-rose-500 text-purple-500 dark:text-purple-400" />
                  }
                </div>

                <span className="flex-1 text-[12px] font-medium text-zinc-700 dark:text-zinc-300 truncate" style={{ fontVariantNumeric:"tabular-nums" }}>
                  {txn.desc}
                </span>

                <span
                  className="w-20 text-right text-[12px] font-bold tabular-nums shrink-0"
                  style={{ color: txn.pos ?"#059669" :"#dc2626" }}
                >
                  {txn.amt}
                </span>

                <span className="w-12 text-right text-[10px] text-zinc-400 dark:text-zinc-500 shrink-0">
                  {txn.date}
                </span>
              </div>
            ))}

            {/* Extracting spinner row */}
            {proc && visRows < TXNS.length && (
              <div className="flex items-center gap-2.5 px-3 py-2.5">
                <div className="w-6 h-6 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
                  <Loader2 size={11} className="animate-spin text-blue-500 text-purple-500 dark:text-purple-400" />
                </div>
                <span className="text-[12px] text-zinc-400 dark:text-zinc-500">Extracting…</span>
                <div className="flex gap-1 ml-1">
                  {[0, 1, 2].map(i => (
                    <div
                      key={i}
                      className="w-1 h-1 rounded-full bg-blue-400"
                      style={{ animation: `dotBounce 0.9s ease-in-out ${i * 0.18}s infinite` }}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Done: summary row */}
            {done && (
              <div
                className="flex items-center gap-2.5 px-3 py-3 rounded-xl mt-1"
                style={{ background:"#f0fdf4", border:"1px solid #bbf7d0" }}
              >
                <CheckCircle2 size={15} className="text-emerald-500 shrink-0 text-emerald-500 dark:text-emerald-400" />
                <span className="text-[12px] font-semibold text-emerald-700 flex-1">
                  142 transactions extracted successfully
                </span>
                <span className="text-[11px] text-emerald-500/70">3.2s</span>
              </div>
            )}
          </div>
        </div>

        {/* ── FOOTER: format + CTA ── */}
        <div
          className="px-4 pt-3 pb-4"
          style={{ borderTop:"1px solid #f1f5f9", background:"#f8fafc" }}
        >
          <div className="flex gap-1.5 mb-3">
            {FORMATS.map((f, i) => (
              <button
                key={f}
                onClick={() => setSelFmt(i)}
                className="flex-1 py-2 rounded-xl text-[11px] font-bold transition-all duration-200"
                style={
                  i === selFmt
                    ? { background:"#1A47C8", color:"#fff", boxShadow:"0 4px 12px rgba(26,71,200,0.30)" }
                    : { background:"#e2e8f0", color:"#94a3b8" }
                }
              >
                {f}
              </button>
            ))}
          </div>

          <button
            className="w-full py-3.5 rounded-xl text-sm font-bold text-white flex items-center justify-center gap-2 relative overflow-hidden"
            style={{ background:"linear-gradient(135deg,#f97316,#ea580c)", boxShadow:"0 6px 20px rgba(249,115,22,0.35)" }}
          >
            <span
              className="absolute inset-0 pointer-events-none"
              style={{ background:"linear-gradient(90deg,transparent,rgba(255,255,255,0.15),transparent)", animation:"shimmerSlide 2.2s ease-in-out infinite" }}
            />
            <Download size={15} className="relative z-10 text-emerald-500 dark:text-emerald-400" />
            <span className="relative z-10">Download {FORMATS[selFmt]}</span>
          </button>
        </div>
      </div>

    </div>
  );
}
