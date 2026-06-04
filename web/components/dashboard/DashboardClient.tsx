"use client";

import { useState, useCallback } from "react";
import { UploadCard } from "@/components/upload/UploadCard";
import { UsageHistory } from "@/components/dashboard/UsageHistory";
import { PricingSection } from "@/components/dashboard/PricingSection";
import type { BillingContext } from "@/types/billing";
import { FileText, History, CreditCard, LogOut, Info } from "lucide-react";
import { useRouter } from "next/navigation";
import { Footer } from "@/components/layout/Footer";

type Tab = "upload" | "history" | "billing";

export interface RecentLog {
  id: string;
  fileName: string;
  pageCount: number;
  transactionCount: number;
  billingType: string;
  bankName: string | null;
  createdAt: Date;
  exportFormats: string[];
}

interface Props {
  billing: BillingContext;
  recentLogs: RecentLog[];
  userEmail: string;
  userName: string | null;
  isDemo?: boolean;
}

export function DashboardClient({ billing: initialBilling, recentLogs, userEmail, userName, isDemo }: Props) {
  const [tab, setTab] = useState<Tab>("upload");
  const [billing, setBilling] = useState(initialBilling);
  const router = useRouter();

  const refreshBilling = useCallback(async () => {
    try {
      const res = await fetch("/api/billing-context");
      if (res.ok) {
        const data = await res.json();
        setBilling(data);
      }
    } catch { /* non-fatal */ }
  }, []);

  const handleSignOut = async () => {
    // Hard-navigate to /login?logout=1 — middleware clears the cookie atomically
    window.location.href = "/login?logout=1";
  };


  const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: "upload", label: "Upload", icon: <FileText className="h-4 w-4" /> },
    { id: "history", label: "History", icon: <History className="h-4 w-4" /> },
    { id: "billing", label: "Billing", icon: <CreditCard className="h-4 w-4" /> },
  ];

  const displayName = userName ?? userEmail.split("@")[0];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Demo banner */}
      {isDemo && (
        <div className="flex items-center justify-center gap-2 bg-amber-500 px-4 py-2 text-center text-sm font-medium text-white">
          <Info className="h-4 w-4 shrink-0" />
          Demo mode — Supabase not configured.{" "}
          <a href="/signup" className="underline hover:no-underline font-bold">Sign up free</a>
          {" "}to save your history and unlock full features.
        </div>
      )}

      {/* Header */}
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
          <a href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-600">
              <FileText className="h-4 w-4 text-white" />
            </div>
            <span className="font-bold text-slate-800">BankStatements</span>
          </a>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2">
              <div className="h-7 w-7 rounded-full bg-brand-100 flex items-center justify-center text-xs font-bold text-brand-700">
                {displayName[0]?.toUpperCase()}
              </div>
              <span className="text-sm text-slate-600">{displayName}</span>
            </div>
            <button
              onClick={handleSignOut}
              className="flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-sm text-slate-600 hover:bg-slate-50 transition-colors"
            >
              <LogOut className="h-3.5 w-3.5" />
              {isDemo ? "Go home" : "Sign out"}
            </button>
          </div>
        </div>
      </header>

      {/* Tab bar */}
      <div className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-5xl px-4">
          <div className="flex gap-0">
            {tabs.map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`flex items-center gap-2 border-b-2 px-5 py-3.5 text-sm font-medium transition-colors ${
                  tab === t.id
                    ? "border-brand-600 text-brand-700"
                    : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-200"
                }`}
              >
                {t.icon}
                {t.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <main className="mx-auto max-w-5xl px-4 py-8">
        {tab === "upload" && (
          <div className="mx-auto max-w-2xl">
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-slate-900">Convert bank statement</h1>
              <p className="mt-1 text-sm text-slate-500">
                Upload a PDF — 1,000+ banks supported. Your file is never stored on our servers.
              </p>
            </div>
            <UploadCard billing={billing} onBillingUpdate={refreshBilling} />
          </div>
        )}

        {tab === "history" && (
          <div>
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-slate-900">Processing history</h1>
              <p className="mt-1 text-sm text-slate-500">Your last 20 converted documents.</p>
            </div>
            <UsageHistory logs={recentLogs} isDemo={isDemo} />
          </div>
        )}

        {tab === "billing" && (
          <div>
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-slate-900">Plans & Billing</h1>
              <p className="mt-1 text-sm text-slate-500">
                You&apos;re on the <span className="font-semibold text-brand-700">{billing.tier}</span> plan.
              </p>
            </div>
            <PricingSection currentTier={billing.tier} />
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
