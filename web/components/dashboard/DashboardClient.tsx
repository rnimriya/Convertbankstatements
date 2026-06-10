"use client";

import { useState, useCallback } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { UploadCard } from "@/components/upload/UploadCard";
import { BulkUploadCard } from "@/components/upload/BulkUploadCard";
import { UsageHistory } from "@/components/dashboard/UsageHistory";
import { PricingSection } from "@/components/dashboard/PricingSection";
import { PortalsPanel } from "@/components/dashboard/PortalsPanel";
import type { BillingContext } from "@/types/billing";
import { FileText, History, CreditCard, LogOut, Upload, Link2 } from "lucide-react";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/Button";
import { Alert } from "@/components/ui/Alert";

type Tab = "upload" | "history" | "billing" | "portals";

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
  const t = useTranslations("dashboard");
  const [tab, setTab] = useState<Tab>("upload");
  const [uploadMode, setUploadMode] = useState<"single" | "bulk">("single");
  const [billing, setBilling] = useState(initialBilling);

  const refreshBilling = useCallback(async () => {
    try {
      const res = await fetch("/api/billing-context");
      if (res.ok) setBilling(await res.json());
    } catch { /* non-fatal */ }
  }, []);

  const handleSignOut = () => { window.location.href = "/login?logout=1"; };

  const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: "upload",  label: t("tabConvert"),  icon: <Upload     className="h-4 w-4" /> },
    { id: "history", label: t("tabHistory"),  icon: <History    className="h-4 w-4" /> },
    { id: "billing", label: t("tabBilling"),  icon: <CreditCard className="h-4 w-4" /> },
    { id: "portals", label: t("tabPortals"),  icon: <Link2      className="h-4 w-4" /> },
  ];

  const displayName = userName ?? userEmail.split("@")[0];
  const initial = displayName[0]?.toUpperCase();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-surface">
      {isDemo && (
        <Alert variant="warning" className="rounded-none border-x-0 border-t-0 py-2 text-center text-sm">
          {t.rich("demoAlert", {
            link: () => (
              <Link href="/signup" className="font-bold underline hover:no-underline">
                {t("demoLink")}
              </Link>
            ),
          })}
        </Alert>
      )}

      <header className="border-b border-slate-200 dark:border-white/10 bg-white dark:bg-surface sticky top-0 z-40">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
          <a href="/" className="flex items-center gap-2.5 group">
            <img src="/logo.svg" alt="Convert Statement" className="h-8 w-8" />
            <span className="hidden sm:inline font-bold text-slate-800 dark:text-white font-display text-[16px]">Convert Statement</span>
          </a>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 bg-slate-50 dark:bg-surface border border-slate-200 dark:border-white/10 rounded-full pl-1 pr-3 py-1">
              <div className="h-6 w-6 rounded-full bg-navy flex items-center justify-center text-[11px] font-bold text-white">
                {initial}
              </div>
              <span className="text-sm text-slate-600 dark:text-gray-300 font-medium">{displayName}</span>
            </div>
            <Button
              variant="secondary"
              size="sm"
              leftIcon={<LogOut className="h-3.5 w-3.5" />}
              onClick={handleSignOut}
            >
              {isDemo ? t("goHome") : t("signOut")}
            </Button>
          </div>
        </div>
      </header>

      <div className="border-b border-slate-200 dark:border-white/10 bg-white dark:bg-surface">
        <div className="mx-auto max-w-5xl px-4">
          <div className="flex">
            {tabs.map((tb) => (
              <button
                key={tb.id}
                onClick={() => setTab(tb.id)}
                className={`flex items-center gap-2 border-b-2 px-5 py-3.5 text-sm font-medium transition-colors ${
                  tab === tb.id
                    ? "border-navy text-navy dark:border-brand-400 dark:text-brand-400"
                    : "border-transparent text-slate-500 dark:text-gray-400 hover:text-slate-800 dark:hover:text-gray-200 hover:border-slate-200 dark:hover:border-white/20"
                }`}
              >
                {tb.icon}
                {tb.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <main className="mx-auto max-w-5xl px-4 py-8">

        {tab === "upload" && (
          <div className="mx-auto max-w-xl">
            <div className="mb-6 text-center">
              <div className="inline-flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-full mb-3 border border-navy/20 dark:border-brand-400/20 bg-navy/5 dark:bg-brand-400/5 text-navy dark:text-brand-400">
                <FileText size={12} />
                {t("convertBadge")}
              </div>
              <h1 className="font-display text-2xl font-bold text-slate-900 dark:text-white">{t("convertTitle")}</h1>
              <p className="mt-1.5 text-sm text-slate-400 dark:text-gray-500">{t("convertSubtitle")}</p>
            </div>
            <div className="flex items-center gap-1 bg-slate-100 dark:bg-surface rounded-xl p-1 mb-4">
              {(["single", "bulk"] as const).map(m => (
                <button
                  key={m}
                  onClick={() => setUploadMode(m)}
                  className={`flex-1 py-1.5 rounded-lg text-sm font-semibold transition-all ${uploadMode === m ? "bg-white dark:bg-surface-raised text-navy dark:text-brand-400 shadow-sm" : "text-slate-500 dark:text-gray-400 hover:text-slate-700 dark:hover:text-gray-200"}`}
                >
                  {m === "single" ? t("singleFile") : t("bulkUpload")}
                </button>
              ))}
            </div>

            {uploadMode === "single"
              ? <UploadCard billing={billing} onBillingUpdate={refreshBilling} userEmail={userEmail} />
              : <BulkUploadCard billing={billing} onBillingUpdate={refreshBilling} />
            }
          </div>
        )}

        {tab === "history" && (
          <div>
            <div className="mb-6">
              <h1 className="font-display text-2xl font-bold text-slate-900 dark:text-white">{t("historyTitle")}</h1>
              <p className="mt-1 text-sm text-slate-500 dark:text-gray-400">{t("historySubtitle")}</p>
            </div>
            <UsageHistory logs={recentLogs} isDemo={isDemo} />
          </div>
        )}

        {tab === "billing" && (
          <div>
            <div className="mb-6">
              <h1 className="font-display text-2xl font-bold text-slate-900 dark:text-white">{t("billingTitle")}</h1>
              <p className="mt-1 text-sm text-slate-500 dark:text-gray-400">
                {t("billingSubtitle", { tier: billing.tier })}
              </p>
            </div>
            <PricingSection currentTier={billing.tier} />
          </div>
        )}

        {tab === "portals" && (
          <div>
            <div className="mb-6">
              <h1 className="font-display text-2xl font-bold text-slate-900 dark:text-white">{t("portalsTitle")}</h1>
              <p className="mt-1 text-sm text-slate-500 dark:text-gray-400">{t("portalsSubtitle")}</p>
            </div>
            <PortalsPanel />
          </div>
        )}

      </main>
      <Footer />
    </div>
  );
}
