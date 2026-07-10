"use client";

import {
  CheckCircle2, Lock, Zap, Shield, BarChart3, Star,
} from"lucide-react";
import type { BillingContext } from"@/types/billing";
import { UploadCard } from"@/components/upload/UploadCard";

const TRUST_STATS = [
  { icon: <Zap size={13} className="text-amber-400 text-amber-500 dark:text-amber-400" />,    label:"~11s conversion" },
  { icon: <Shield size={13} className="text-emerald-500 text-purple-500 dark:text-purple-400" />, label:"Bank-grade security" },
  { icon: <Lock size={13} className="text-sky-500 text-rose-500 dark:text-rose-400" />,     label:"Files deleted instantly" },
  { icon: <BarChart3 size={13} className="text-violet-500 text-purple-500 dark:text-purple-400" />, label:"99.4% accuracy" },
];

const AVATAR_COLORS = ["bg-violet-500","bg-emerald-500","bg-amber-500","bg-blue-600","bg-rose-500"];
const AVATAR_INITIALS = ["R","S","P","A","K"];

interface Props {
  billing: BillingContext;
  onBillingUpdate: () => void;
  userEmail?: string;
  hasSheetsAccess?: boolean;
}

export function HeroSection({ billing, onBillingUpdate, userEmail, hasSheetsAccess }: Props) {
  return (
    <section className="w-full relative overflow-hidden bg-zinc-50 dark:bg-zinc-950">
      {/* Background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[400px] opacity-20 dark:opacity-15 bg-blue-500 dark:bg-blue-600 rounded-full blur-[120px] pointer-events-none" />

      {/* Elegant Graph Paper Grid with a top-down radial mask fade */}
      <div 
        className="absolute inset-0 pointer-events-none bg-graph-paper dark:bg-graph-paper-dark" 
        style={{
          maskImage: 'radial-gradient(ellipse 100% 100% at 50% 0%, black 50%, transparent 100%)',
          WebkitMaskImage: 'radial-gradient(ellipse 100% 100% at 50% 0%, black 50%, transparent 100%)'
        }} 
      />


      {/* Full-width content container */}
      <div className="relative z-10 w-full px-6 lg:px-10 xl:px-16 pt-10 pb-12">

        {/* ── Headline block — centered ── */}
        <div className="text-center mb-6 max-w-4xl mx-auto">
          <h1
            className="font-bold text-zinc-900 dark:text-zinc-50 tracking-tight leading-[1.07] mb-4"
            style={{ fontSize:"clamp(1.6rem, 3vw, 2.4rem)" }}
          >
            Free Bank Statement Converter
          </h1>
          <p className="text-[0.95rem] text-zinc-500 dark:text-zinc-400 max-w-2xl mx-auto leading-relaxed">
            Upload any Wells Fargo, Citibank, U.S. Bank, Cadence Bank, or Kotak statement — get CSV, Excel, OFX for Tally, or Google Sheets in under 15 seconds. No manual typing.
          </p>
        </div>

        {/* ── Upload Card — full width with max-w ── */}
        <div className="w-full max-w-5xl mx-auto">
          <UploadCard billing={billing} onBillingUpdate={onBillingUpdate} userEmail={userEmail} hasSheetsAccess={hasSheetsAccess} fullWidth={true} />

          {/* Security note */}
          <div className="mt-4 flex items-center justify-center gap-2">
            <CheckCircle2 size={14} className="shrink-0 text-emerald-500 dark:text-emerald-400" />
            <p className="text-[12.5px] text-zinc-500">
              <span className="font-semibold text-zinc-700 dark:text-zinc-300">Bank-grade security</span>
              {""}— Files processed securely and deleted immediately
            </p>
          </div>
        </div>

        {/* ── Trust stats bar — full width ── */}
        <div className="mt-6 pt-6 border-t border-zinc-200 dark:border-zinc-800">
          <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
            {TRUST_STATS.map(({ icon, label }) => (
              <div key={label} className="flex items-center gap-2 text-[12.5px] text-zinc-500">
                <span className="text-zinc-400">{icon}</span>
                <span>{label}</span>
              </div>
            ))}
            <div className="flex items-center gap-3 border-l border-zinc-200 dark:border-zinc-800 pl-8">
              <div className="flex items-center -space-x-2">
                {AVATAR_COLORS.map((_, i) => (
                  <div key={i} className={`w-7 h-7 rounded-full border-2 border-zinc-50 dark:border-zinc-950 bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center text-[10px] font-bold text-zinc-700 dark:text-zinc-300`}>
                    {AVATAR_INITIALS[i]}
                  </div>
                ))}
              </div>
              <div className="flex items-center gap-1.5">
                <div className="flex gap-0.5">
                  {[0,1,2,3,4].map(i => <Star key={i} size={11} className="fill-zinc-400 text-amber-500 dark:text-amber-400" />)}
                </div>
                <span className="text-[12px] text-zinc-500 font-medium">10,000+ users</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
