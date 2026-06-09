"use client";

import { useState, useEffect, useCallback } from "react";
import { CheckCircle2, FileSpreadsheet, Download, CreditCard, Loader2 } from "lucide-react";

type Phase = "idle" | "processing" | "done";

const FORMATS = ["Excel", "CSV", "OFX", "Sheets"];
const FILES = [
  "HDFC_Statement_Jan2025.pdf",
  "SBI_Nov2024.pdf",
  "ICICI_Q3_2025.pdf",
  "Axis_Dec2024.pdf",
];

export default function ConverterMockup() {
  const [phase, setPhase]               = useState<Phase>("idle");
  const [progress, setProgress]         = useState(0);
  const [selectedFormat, setSelectedFormat] = useState(0);
  const [fileIndex, setFileIndex]       = useState(0);
  const [badgeVisible, setBadgeVisible] = useState(false);
  const [priceVisible, setPriceVisible] = useState(false);
  const [cycle, setCycle]               = useState(0);

  const runCycle = useCallback(() => {
    setBadgeVisible(false);
    setPriceVisible(false);
    setProgress(0);
    setPhase("idle");

    // idle → processing at 1.4s
    const t1 = setTimeout(() => {
      setPhase("processing");
      setPriceVisible(true);
    }, 1400);

    // fill progress bar
    let p = 0;
    const interval = setInterval(() => {
      p += Math.random() * 18 + 8;
      if (p >= 100) { p = 100; clearInterval(interval); }
      setProgress(Math.min(p, 100));
    }, 90);

    // processing → done at ~2s after start
    const t2 = setTimeout(() => {
      setProgress(100);
      setPhase("done");
      setBadgeVisible(true);
    }, 3200);

    // next cycle at 6.5s
    const t3 = setTimeout(() => {
      setSelectedFormat(f => (f + 1) % FORMATS.length);
      setFileIndex(i => (i + 1) % FILES.length);
      setCycle(c => c + 1);
    }, 6500);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    return runCycle();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cycle]);

  const statusLabel =
    phase === "idle"       ? "Ready"
    : phase === "processing" ? "Converting…"
    : "Done!";

  const statusColor =
    phase === "done" ? "text-emerald-600" : "text-slate-400";

  return (
    <div className="relative w-full max-w-[390px] mx-auto lg:mx-0 select-none">

      {/* Glow backdrop that pulses during processing */}
      <div
        className={`absolute inset-0 rounded-2xl transition-opacity duration-700 pointer-events-none ${
          phase === "processing" ? "opacity-100" : "opacity-0"
        }`}
        style={{ boxShadow: "0 0 60px 10px rgba(26,71,200,0.18)", borderRadius: "1rem" }}
      />

      {/* Badge: Processing complete — slides in from top-right */}
      <div
        className={`absolute -top-5 right-0 z-20 flex items-center gap-1.5 px-4 py-2 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold shadow-lg whitespace-nowrap transition-all duration-500 ${
          badgeVisible ? "opacity-100 translate-y-0 scale-100" : "opacity-0 -translate-y-2 scale-95"
        }`}
      >
        <CheckCircle2 size={13} className="text-emerald-500" />
        Processing complete
      </div>

      {/* Main card */}
      <div
        className="bg-white rounded-2xl border border-slate-200 shadow-2xl overflow-hidden"
        style={{ animation: "floatCard 5s ease-in-out infinite" }}
      >
        {/* Browser chrome */}
        <div className="bg-slate-50/80 border-b border-slate-100 px-4 py-3 flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
          <div className="w-2.5 h-2.5 rounded-full bg-amber-400" />
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
          <div className="mx-auto flex items-center gap-1.5 bg-white border border-slate-200 rounded-md px-2.5 py-0.5">
            <span className="text-[10px] text-slate-400 font-medium">convertstatement.online/convert</span>
          </div>
        </div>

        {/* Body */}
        <div className="p-5 space-y-4">

          {/* File row */}
          <div>
            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide mb-1.5">Statement PDF</p>
            <div className="flex items-center gap-3 px-3 py-3 bg-slate-50 border border-slate-200 rounded-xl transition-all duration-300">
              <div className="relative shrink-0">
                <FileSpreadsheet size={18} className="text-red-500" />
              </div>
              <span className="text-sm font-medium text-slate-700 truncate flex-1 min-w-0">
                {FILES[fileIndex]}
              </span>
              <CheckCircle2 size={14} className="text-emerald-500 shrink-0" />
            </div>
          </div>

          {/* Progress */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                {phase === "processing" && (
                  <Loader2 size={11} className="text-navy animate-spin" />
                )}
                {phase === "done" && (
                  <CheckCircle2 size={11} className="text-emerald-500" />
                )}
                <span className={`text-[11px] font-medium transition-colors duration-300 ${statusColor}`}>
                  {statusLabel}
                </span>
              </div>
              <span className={`text-[11px] font-bold tabular-nums transition-colors duration-300 ${phase === "done" ? "text-emerald-600" : "text-navy"}`}>
                {Math.round(progress)}%
              </span>
            </div>
            <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-200 ease-out relative overflow-hidden"
                style={{
                  width: `${progress}%`,
                  background: phase === "done"
                    ? "#10b981"
                    : "linear-gradient(90deg, #1A47C8, #3b6ef5, #1A47C8)",
                  backgroundSize: "200% 100%",
                  animation: phase === "processing"
                    ? "progressShimmer 1.4s linear infinite"
                    : undefined,
                }}
              />
            </div>
          </div>

          {/* Format picker */}
          <div>
            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide mb-1.5">Output format</p>
            <div className="flex flex-wrap gap-1.5">
              {FORMATS.map((f, i) => (
                <button
                  key={f}
                  onClick={() => setSelectedFormat(i)}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all duration-200 ${
                    i === selectedFormat
                      ? "bg-navy text-white shadow-md shadow-navy/30 scale-105"
                      : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          {/* CTA button with shimmer */}
          <button
            className="w-full py-3 rounded-xl text-sm font-bold text-white bg-navy flex items-center justify-center gap-2 relative overflow-hidden group shadow-lg shadow-navy/25"
            style={{ animation: "pulse-ring 2.5s ease-out infinite" }}
          >
            {/* Shimmer overlay */}
            <span
              className="absolute inset-0 pointer-events-none"
              style={{
                background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.18), transparent)",
                animation: "shimmerSlide 2.2s ease-in-out infinite",
              }}
            />
            <Download size={14} className="relative z-10" />
            <span className="relative z-10">Convert &amp; Download</span>
          </button>

        </div>
      </div>

      {/* Badge: Price — slides up from bottom-left */}
      <div
        className={`absolute -bottom-4 -left-2 z-20 flex items-center gap-1.5 px-4 py-2 rounded-full bg-navy text-white text-xs font-bold shadow-xl shadow-navy/30 whitespace-nowrap transition-all duration-500 delay-200 ${
          priceVisible ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-2 scale-95"
        }`}
      >
        <CreditCard size={12} />
        ₹49 per document
      </div>

    </div>
  );
}
