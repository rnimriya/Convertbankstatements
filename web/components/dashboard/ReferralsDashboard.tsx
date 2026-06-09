"use client";

import { useState } from "react";
import Link from "next/link";
import { Copy, CheckCircle2, Gift, Users, ArrowLeft } from "lucide-react";

interface Props {
  referralUrl: string;
  pagesCredited: number;
}

export function ReferralsDashboard({ referralUrl, pagesCredited }: Props) {
  const [copied, setCopied] = useState(false);

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(referralUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback for older browsers
      const el = document.createElement("textarea");
      el.value = referralUrl;
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  const shareMessage = encodeURIComponent(
    `Convert Indian bank statement PDFs to Excel/CSV in seconds. Get 50 free bonus pages when you sign up: ${referralUrl}`
  );
  const whatsappUrl = `https://wa.me/?text=${shareMessage}`;

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-10">
      <div className="mx-auto max-w-2xl">
        <Link href="/dashboard" className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-800 transition-colors mb-8">
          <ArrowLeft size={14} />
          Back to dashboard
        </Link>

        <h1 className="font-display text-2xl font-bold text-slate-900 mb-2">Refer & Earn</h1>
        <p className="text-slate-500 text-sm mb-8">
          Share your link. When a friend signs up, you both get <span className="font-semibold text-slate-700">50 free pages</span> — no strings attached.
        </p>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="bg-white rounded-2xl border border-slate-200 p-5">
            <div className="flex items-center gap-2 text-slate-400 text-xs font-semibold uppercase tracking-wide mb-2">
              <Gift size={13} />
              Pages earned
            </div>
            <p className="font-display text-3xl font-bold text-navy">{pagesCredited}</p>
            <p className="text-xs text-slate-400 mt-0.5">via referrals</p>
          </div>
          <div className="bg-white rounded-2xl border border-slate-200 p-5">
            <div className="flex items-center gap-2 text-slate-400 text-xs font-semibold uppercase tracking-wide mb-2">
              <Users size={13} />
              Per referral
            </div>
            <p className="font-display text-3xl font-bold text-emerald-600">50</p>
            <p className="text-xs text-slate-400 mt-0.5">free pages for both</p>
          </div>
        </div>

        {/* Link card */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-6">
          <p className="text-sm font-semibold text-slate-700 mb-3">Your referral link</p>
          <div className="flex items-center gap-2">
            <div className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-600 font-mono truncate">
              {referralUrl}
            </div>
            <button
              onClick={copyLink}
              className={`flex items-center gap-1.5 px-4 py-3 rounded-xl text-sm font-semibold transition-all shrink-0 ${
                copied
                  ? "bg-emerald-100 text-emerald-700 border border-emerald-200"
                  : "bg-navy text-white hover:opacity-90"
              }`}
            >
              {copied ? (
                <><CheckCircle2 size={14} /> Copied!</>
              ) : (
                <><Copy size={14} /> Copy</>
              )}
            </button>
          </div>
        </div>

        {/* Share buttons */}
        <div className="flex gap-3">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border border-slate-200 bg-white text-sm font-semibold text-slate-700 hover:border-emerald-300 hover:text-emerald-700 transition-colors"
          >
            Share on WhatsApp
          </a>
          <button
            onClick={copyLink}
            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border border-slate-200 bg-white text-sm font-semibold text-slate-700 hover:border-navy/30 hover:text-navy transition-colors"
          >
            <Copy size={14} />
            Copy link
          </button>
        </div>

        <p className="mt-6 text-xs text-slate-400 text-center">
          Pages are credited instantly when your friend creates an account via your link. No expiry.
        </p>
      </div>
    </div>
  );
}
