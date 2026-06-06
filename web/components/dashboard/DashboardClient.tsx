"use client";

import { useState, useCallback } from "react";
import { UploadCard } from "@/components/upload/UploadCard";
import { UsageHistory } from "@/components/dashboard/UsageHistory";
import { PricingSection } from "@/components/dashboard/PricingSection";
import type { BillingContext } from "@/types/billing";
import { FileText, History, CreditCard, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { Footer } from "@/components/layout/Footer";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
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
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
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

  const handleSignOut = () => {
    window.location.href = "/login?logout=1";
  };

  const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: "upload",  label: "Upload",  icon: <FileText className="h-4 w-4" /> },
    { id: "history", label: "History", icon: <History  className="h-4 w-4" /> },
    { id: "billing", label: "Billing", icon: <CreditCard className="h-4 w-4" /> },
  ];

  const displayName = userName ?? userEmail.split("@")[0];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-surface">
      {/* Demo banner */}
      {isDemo && (
        <Alert variant="warning" className="rounded-none border-x-0 border-t-0 py-2 text-center text-sm">
          Demo mode — Supabase not configured.{" "}
          <a href="/signup" className="font-bold underline hover:no-underline">Sign up free</a>
          {" "}to save history and unlock full features.
        </Alert>
      )}

      {/* Header */}
      <header className="border-b border-slate-200 dark:border-white/10 bg-white dark:bg-surface">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
          <a href="/" className="flex items-center gap-2">
            <img src="/logo.svg" alt="BankStatements" className="h-8 w-8" />
            <span className="hidden sm:inline font-bold text-slate-800 dark:text-white">BankStatements</span>
          </a>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2">
              <div className="h-7 w-7 rounded-full bg-brand-100 dark:bg-brand-900/50 flex items-center justify-center text-xs font-bold text-brand-700 dark:text-brand-300">
                {displayName[0]?.toUpperCase()}
              </div>
              <span className="text-sm text-slate-600 dark:text-gray-300">{displayName}</span>
            </div>
            <ThemeToggle />
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
      <div className="border-b border-slate-200 dark:border-white/10 bg-white dark:bg-surface">
        <div className="mx-auto max-w-5xl px-4">
          <div className="flex gap-0">
            {tabs.map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`flex items-center gap-2 border-b-2 px-5 py-3.5 text-sm font-medium transition-colors ${
                  tab === t.id
                    ? "border-brand-400 text-brand-600 dark:text-brand-400"
                    : "border-transparent text-slate-500 dark:text-gray-400 hover:text-slate-700 dark:hover:text-gray-200 hover:border-slate-200 dark:hover:border-gray-600"
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
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Convert bank statement</h1>
              <p className="mt-1 text-sm text-slate-500 dark:text-gray-400">
                Upload a PDF — 1,000+ banks supported. Your file is never stored on our servers.
              </p>
            </div>
            <UploadCard billing={billing} onBillingUpdate={refreshBilling} userEmail={userEmail} />
          </div>
        )}

        {tab === "history" && (
          <div>
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Processing history</h1>
              <p className="mt-1 text-sm text-slate-500 dark:text-gray-400">Your last 20 converted documents.</p>
            </div>
            <UsageHistory logs={recentLogs} isDemo={isDemo} />
          </div>
        )}

        {tab === "billing" && (
          <div>
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Plans & Billing</h1>
              <p className="mt-1 text-sm text-slate-500 dark:text-gray-400">
                You&apos;re on the <span className="font-semibold text-brand-700 dark:text-brand-400">{billing.tier}</span> plan.
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
