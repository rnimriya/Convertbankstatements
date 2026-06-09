"use client";

import { useState, useCallback } from "react";
import { UploadCard } from "@/components/upload/UploadCard";
import { UsageHistory } from "@/components/dashboard/UsageHistory";
import { PricingSection } from "@/components/dashboard/PricingSection";
import type { BillingContext } from "@/types/billing";
import { FileText, History, CreditCard, LogOut, Upload } from "lucide-react";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/Button";
import { Alert } from "@/components/ui/Alert";

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

  const refreshBilling = useCallback(async () => {
    try {
      const res = await fetch("/api/billing-context");
      if (res.ok) setBilling(await res.json());
    } catch { /* non-fatal */ }
  }, []);

  const handleSignOut = () => { window.location.href = "/login?logout=1"; };

  const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: "upload",  label: "Convert",  icon: <Upload     className="h-4 w-4" /> },
    { id: "history", label: "History",  icon: <History    className="h-4 w-4" /> },
    { id: "billing", label: "Billing",  icon: <CreditCard className="h-4 w-4" /> },
  ];

  const displayName = userName ?? userEmail.split("@")[0];
  const initial = displayName[0]?.toUpperCase();

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Demo banner */}
      {isDemo && (
        <Alert variant="warning" className="rounded-none border-x-0 border-t-0 py-2 text-center text-sm">
          Demo mode —{" "}
          <a href="/signup" className="font-bold underline hover:no-underline">Sign up free</a>
          {" "}to save history and unlock full features.
        </Alert>
      )}

      {/* Header */}
      <header className="border-b border-slate-200 bg-white sticky top-0 z-40">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
          <a href="/" className="flex items-center gap-2.5 group">
            <img src="/logo.svg" alt="Convert Statement" className="h-8 w-8" />
            <span className="hidden sm:inline font-bold text-slate-800 font-display text-[16px]">Convert Statement</span>
          </a>

          <div className="flex items-center gap-3">
            {/* User avatar + name */}
            <div className="hidden sm:flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-full pl-1 pr-3 py-1">
              <div className="h-6 w-6 rounded-full bg-navy flex items-center justify-center text-[11px] font-bold text-white">
                {initial}
              </div>
              <span className="text-sm text-slate-600 font-medium">{displayName}</span>
            </div>
            <Button
              variant="secondary"
              size="sm"
              leftIcon={<LogOut className="h-3.5 w-3.5" />}
              onClick={handleSignOut}
            >
              {isDemo ? "Go home" : "Sign out"}
            </Button>
          </div>
        </div>
      </header>

      {/* Tab bar */}
      <div className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-5xl px-4">
          <div className="flex">
            {tabs.map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`flex items-center gap-2 border-b-2 px-5 py-3.5 text-sm font-medium transition-colors ${
                  tab === t.id
                    ? "border-navy text-navy"
                    : "border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-200"
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
          <div className="mx-auto max-w-xl">
            {/* Page heading */}
            <div className="mb-6 text-center">
              <div className="inline-flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-full mb-3 border border-navy/20 bg-navy/5 text-navy">
                <FileText size={12} />
                PDF → Excel / CSV / OFX
              </div>
              <h1 className="font-display text-2xl font-bold text-slate-900">Convert Bank Statement</h1>
              <p className="mt-1.5 text-sm text-slate-400">
                Upload any Indian bank PDF — your file is never stored on our servers.
              </p>
            </div>
            <UploadCard billing={billing} onBillingUpdate={refreshBilling} userEmail={userEmail} />
          </div>
        )}

        {tab === "history" && (
          <div>
            <div className="mb-6">
              <h1 className="font-display text-2xl font-bold text-slate-900">Processing history</h1>
              <p className="mt-1 text-sm text-slate-500">Your last 20 converted documents.</p>
            </div>
            <UsageHistory logs={recentLogs} isDemo={isDemo} />
          </div>
        )}

        {tab === "billing" && (
          <div>
            <div className="mb-6">
              <h1 className="font-display text-2xl font-bold text-slate-900">Plans &amp; Billing</h1>
              <p className="mt-1 text-sm text-slate-500">
                You&apos;re on the <span className="font-semibold text-navy">{billing.tier}</span> plan.
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
