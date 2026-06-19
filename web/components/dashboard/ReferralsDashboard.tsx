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
    <div className="min-h-screen bg-slate-50 dark:bg-surface px-4 py-10">
      <div className="mx-auto max-w-2xl">
        <Link href="/dashboard" className="inline-flex items-center gap-1.5 text-sm text-slate-500 dark:text-gray-400 hover:text-slate-800 dark:hover:text-white transition-colors mb-8">
          <ArrowLeft size={14} />
          Back to dashboard
        </Link>

        <h1 className="font-display text-2xl font-bold text-slate-900 dark:text-white mb-2">Refer & Earn</h1>
        <p className="text-slate-500 dark:text-gray-400 text-sm mb-8">
          Share your link. When a friend signs up, you both get <span className="font-semibold text-slate-700 dark:text-gray-200">50 free pages</span> — no strings attached.
        </p>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="bg-white dark:bg-surface rounded-2xl border border-slate-200 dark:border-white/10 p-5">
            <div className="flex items-center gap-2 text-slate-400 dark:text-gray-500 text-xs font-semibold uppercase tracking-wide mb-2">
              <Gift size={13} />
              Pages earned
            </div>
            <p className="font-display text-3xl font-bold text-navy dark:text-brand-400">{pagesCredited}</p>
            <p className="text-xs text-slate-400 dark:text-gray-500 mt-0.5">via referrals</p>
          </div>
          <div className="bg-white dark:bg-surface rounded-2xl border border-slate-200 dark:border-white/10 p-5">
            <div className="flex items-center gap-2 text-slate-400 dark:text-gray-500 text-xs font-semibold uppercase tracking-wide mb-2">
              <Users size={13} />
              Per referral
            </div>
            <p className="font-display text-3xl font-bold text-emerald-600 dark:text-emerald-400">50</p>
            <p className="text-xs text-slate-400 dark:text-gray-500 mt-0.5">free pages for both</p>
          </div>
        </div>

        {/* Link card */}
        <div className="bg-white dark:bg-surface rounded-2xl border border-slate-200 dark:border-white/10 p-6 mb-6">
          <p className="text-sm font-semibold text-slate-700 dark:text-gray-200 mb-3">Your referral link</p>
          <div className="flex items-center gap-2">
            <div className="flex-1 bg-slate-50 dark:bg-surface border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm text-slate-600 dark:text-gray-300 font-mono truncate">
              {referralUrl}
            </div>
            <button
              onClick={copyLink}
              className={`flex items-center gap-1.5 px-4 py-3 rounded-xl text-sm font-semibold transition-all shrink-0 ${
                copied
                  ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800"
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
            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-surface text-sm font-semibold text-slate-700 dark:text-gray-200 hover:border-emerald-300 dark:hover:border-emerald-700 hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors"
          >
            Share on WhatsApp
          </a>
          <button
            onClick={copyLink}
            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-surface text-sm font-semibold text-slate-700 dark:text-gray-200 hover:border-navy/30 dark:hover:border-brand-400/30 hover:text-navy dark:hover:text-brand-400 transition-colors"
          >
            <Copy size={14} />
            Copy link
          </button>
        </div>

        <p className="mt-6 text-xs text-slate-400 dark:text-gray-500 text-center">
          Pages are credited instantly when your friend creates an account via your link. No expiry.
        </p>
      </div>
    </div>
  );
}
