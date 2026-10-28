"use client";

import {
  CheckCircle2, Lock, Zap, Shield, BarChart3, Star,
} from"lucide-react";
import type { BillingContext } from"@/types/billing";
import { UploadCard } from"@/components/upload/UploadCard";

const TRUST_STATS = [
  { icon: <Zap size={13} className="text-pine-600 dark:text-pine-400" />,    label:"~11s conversion" },
  { icon: <Shield size={13} className="text-pine-600 dark:text-pine-400" />, label:"Bank-grade security" },
  { icon: <Lock size={13} className="text-pine-600 dark:text-pine-400" />,     label:"Files deleted instantly" },
  { icon: <BarChart3 size={13} className="text-pine-600 dark:text-pine-400" />, label:"99.4% accuracy" },
];

const AVATAR_COLORS = ["bg-pine-500","bg-pine-500","bg-amber-500","bg-pine-600","bg-rose-500"];
const AVATAR_INITIALS = ["R","S","P","A","K"];

interface Props {
  billing: BillingContext;
  onBillingUpdate: () => void;
  userEmail?: string;
  hasSheetsAccess?: boolean;
}

export function HeroSection({ billing, onBillingUpdate, userEmail, hasSheetsAccess }: Props) {
  return (
    <>
    <section className="w-full relative overflow-hidden bg-pine-800">

      {/* Elegant Graph Paper Grid with a top-down radial mask fade */}


      {/* Full-width content container */}
      <div className="relative z-10 w-full px-6 lg:px-10 xl:px-16 pt-10 pb-28">

        {/* ── Headline block — centered ── */}
        <div className="text-center mb-6 max-w-4xl mx-auto">
          <span className="inline-block text-honey-400 text-[11px] font-bold uppercase tracking-[0.18em] mb-5">For accountants, bookkeepers &amp; finance teams</span>
          <h1
            className="font-bold text-white tracking-tight leading-[1.07] mb-4"
            style={{ fontSize:"clamp(2rem, 4.5vw, 3.25rem)" }}
          >
            Free Bank Statement <span className="text-pine-400">Converter</span>
          </h1>
          <p className="text-[0.95rem] text-zinc-300 max-w-2xl mx-auto leading-relaxed">
            Upload any Wells Fargo, Citibank, U.S. Bank, Cadence Bank, or Kotak statement — get CSV, Excel, OFX for Tally, or Google Sheets in under 15 seconds. No manual typing.
          </p>
        </div>
      </div>
    </section>
    <div className="relative z-20 w-full px-6 lg:px-10 xl:px-16 -mt-20">
      <div className="w-full max-w-5xl mx-auto">
          <UploadCard billing={billing} onBillingUpdate={onBillingUpdate} userEmail={userEmail} hasSheetsAccess={hasSheetsAccess} fullWidth={true} />

          {/* Security note */}
          <div className="mt-4 flex items-center justify-center gap-2">
            <CheckCircle2 size={14} className="shrink-0 text-pine-500 dark:text-pine-400" />
            <p className="text-[12.5px] text-zinc-500">
              <span className="font-semibold text-zinc-700 dark:text-zinc-300">Bank-grade security</span>
              {""}— Files processed securely and deleted immediately
            </p>
          </div>
        </div>

    </div>
    <div className="w-full px-6 lg:px-10 xl:px-16 mt-6">
      <div className="max-w-5xl mx-auto pt-6 border-t border-zinc-200">
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
                  <div key={i} className={`w-7 h-7 rounded-full border-2 border-zinc-50 dark:border-zinc-950 bg-pine-500 dark:bg-pine-600 flex items-center justify-center text-[10px] font-bold text-white`}>
                    {AVATAR_INITIALS[i]}
                  </div>
                ))}
              </div>
              <div className="flex items-center gap-1.5">
                <div className="flex gap-0.5">
                  {[0,1,2,3,4].map(i => <Star key={i} size={11} className="fill-honey-400 text-honey-400" />)}
                </div>
                <span className="text-[12px] text-zinc-500 font-medium">10,000+ finance professionals</span>
              </div>
            </div>
          </div>
      </div>
    </div>
    </>
  );
}
