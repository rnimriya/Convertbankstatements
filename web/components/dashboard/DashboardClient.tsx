"use client";

import { useState, useCallback, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { UploadCard } from "@/components/upload/UploadCard";
import { BulkUploadCard } from "@/components/upload/BulkUploadCard";
import { UsageHistory } from "@/components/dashboard/UsageHistory";
import { PricingSection } from "@/components/dashboard/PricingSection";
import { PortalsPanel } from "@/components/dashboard/PortalsPanel";
import { TeamPanel } from "@/components/dashboard/TeamPanel";
import { AccountSettings } from "@/components/dashboard/AccountSettings";
import { QueuePanel } from "@/components/dashboard/QueuePanel";
import type { BillingContext } from "@/types/billing";
import {
  Upload, History, CreditCard, LogOut, Link2, Users, Settings,
  FileText, Menu, X, ChevronRight, Layers, CheckCircle2,
  AlertTriangle,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Alert } from "@/components/ui/Alert";

type Tab = "upload" | "history" | "billing" | "portals" | "team" | "settings" | "queue";

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
  emailVerified?: boolean;
  hasSheetsAccess?: boolean;
  footer?: React.ReactNode;
}

export function DashboardClient({
  billing: initialBilling,
  recentLogs,
  userEmail,
  userName,
  isDemo,
  emailVerified = true,
  hasSheetsAccess = false,
  footer,
}: Props) {
  const t = useTranslations("dashboard");
  const [tab, setTab] = useState<Tab>("upload");
  const [uploadMode, setUploadMode] = useState<"single" | "bulk">("single");
  const [billing, setBilling] = useState(initialBilling);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [verificationSent, setVerificationSent] = useState(false);
  const [sendingVerification, setSendingVerification] = useState(false);

  const refreshBilling = useCallback(async () => {
    try {
      const res = await fetch("/api/billing-context");
      if (res.ok) setBilling(await res.json());
    } catch { /* non-fatal */ }
  }, []);

  const handleSignOut = () => { window.location.href = "/login?logout=1"; };

  const sendVerificationEmail = async () => {
    setSendingVerification(true);
    try {
      await fetch("/api/auth/send-verification", { method: "POST" });
      setVerificationSent(true);
    } catch { /* non-fatal */ }
    finally { setSendingVerification(false); }
  };

  const displayName = userName ?? userEmail.split("@")[0];
  const initial = displayName[0]?.toUpperCase();
  const isBusinessOrPro = billing.tier === "PRO" || billing.tier === "BUSINESS";
  const isBusiness = billing.tier === "BUSINESS";

  const navItems: { id: Tab; label: string; icon: React.ReactNode; badge?: string }[] = [
    { id: "upload",   label: "Convert",  icon: <Upload    size={18} /> },
    { id: "history",  label: "History",  icon: <History   size={18} /> },
    { id: "queue",    label: "Queue",    icon: <Layers    size={18} /> },
    { id: "billing",  label: "Billing",  icon: <CreditCard size={18} /> },
    { id: "portals",  label: "Portals",  icon: <Link2     size={18} /> },
    ...(isBusiness ? [{ id: "team" as Tab, label: "Team", icon: <Users size={18} />, badge: "Business" }] : []),
    { id: "settings", label: "Settings", icon: <Settings  size={18} /> },
  ];

  const usagePercent = billing.monthlyPageLimit > 0
    ? Math.min(100, Math.round((billing.pagesUsedThisPeriod / billing.monthlyPageLimit) * 100))
    : 0;

  const NavLink = ({ item }: { item: typeof navItems[0] }) => (
    <button
      onClick={() => { setTab(item.id); setSidebarOpen(false); }}
      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group ${
        tab === item.id
          ? "bg-navy text-white shadow-md shadow-navy/20"
          : "text-slate-600 dark:text-gray-400 hover:bg-slate-100 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-gray-100"
      }`}
    >
      <span className={tab === item.id ? "text-white" : "text-slate-400 dark:text-gray-500 group-hover:text-slate-600 dark:group-hover:text-gray-300"}>
        {item.icon}
      </span>
      <span className="flex-1 text-left">{item.label}</span>
      {item.badge && (
        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400">
          {item.badge}
        </span>
      )}
      {tab === item.id && <ChevronRight size={14} className="opacity-60" />}
    </button>
  );

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-surface flex flex-col">
      {isDemo && (
        <div className="bg-amber-50 dark:bg-amber-900/20 border-b border-amber-200 dark:border-amber-800 py-2 text-center text-sm text-amber-800 dark:text-amber-300 px-4">
          Demo mode —{" "}
          <Link href="/signup" className="font-bold underline hover:no-underline">
            Sign up free
          </Link>{" "}
          to save history and unlock full features.
        </div>
      )}

      {/* Top header */}
      <header className="border-b border-slate-200 dark:border-white/10 bg-white dark:bg-surface sticky top-0 z-40">
        <div className="flex items-center justify-between px-4 py-3 gap-3">
          {/* Mobile menu toggle */}
          <button
            className="lg:hidden flex items-center justify-center w-9 h-9 rounded-lg hover:bg-slate-100 dark:hover:bg-white/5 transition-colors"
            onClick={() => setSidebarOpen(v => !v)}
            aria-label="Toggle menu"
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>

          <a href="/" className="flex items-center gap-2.5 group">
            <img src="/logo.svg" alt="Convert Statement" className="h-8 w-8" />
            <span className="hidden sm:inline font-bold text-slate-800 dark:text-white font-display text-[16px]">
              Convert Statement
            </span>
          </a>

          <div className="flex items-center gap-2 ml-auto">
            {/* Usage pill */}
            {isBusinessOrPro && (
              <div className="hidden md:flex items-center gap-2 bg-slate-50 dark:bg-surface border border-slate-200 dark:border-white/10 rounded-full px-3 py-1.5 text-xs">
                <div className="w-16 h-1.5 bg-slate-200 dark:bg-white/10 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${usagePercent > 80 ? "bg-rose-500" : "bg-navy dark:bg-brand-400"}`}
                    style={{ width: `${usagePercent}%` }}
                  />
                </div>
                <span className="text-slate-500 dark:text-gray-400 font-medium">
                  {billing.pagesUsedThisPeriod}/{billing.monthlyPageLimit} pg
                </span>
              </div>
            )}

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

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside
          className={`fixed inset-y-0 left-0 z-30 w-64 bg-white dark:bg-surface border-r border-slate-200 dark:border-white/10 pt-[57px] flex flex-col transition-transform duration-200 lg:static lg:translate-x-0 lg:pt-0 lg:z-auto ${
            sidebarOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full"
          }`}
        >
          {/* Sidebar overlay for mobile */}
          {sidebarOpen && (
            <div
              className="fixed inset-0 bg-black/30 z-[-1] lg:hidden"
              onClick={() => setSidebarOpen(false)}
            />
          )}

          {/* User section */}
          <div className="p-4 border-b border-slate-100 dark:border-white/10">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-xl bg-navy flex items-center justify-center text-sm font-bold text-white shrink-0">
                {initial}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-slate-800 dark:text-white truncate">{displayName}</p>
                <p className="text-xs text-slate-400 dark:text-gray-500 truncate">{userEmail}</p>
              </div>
            </div>

            {/* Tier badge */}
            <div className="mt-3 flex items-center gap-2">
              <span className={`text-[11px] font-bold px-2 py-1 rounded-lg ${
                billing.tier === "BUSINESS" ? "bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300" :
                billing.tier === "PRO"      ? "bg-brand-50 dark:bg-brand-900/40 text-navy dark:text-brand-400" :
                "bg-slate-100 dark:bg-white/10 text-slate-500 dark:text-gray-400"
              }`}>
                {billing.tier} PLAN
              </span>
              {!emailVerified && !verificationSent && (
                <span className="text-[11px] font-bold px-2 py-1 rounded-lg bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300 flex items-center gap-1">
                  <AlertTriangle size={10} /> Unverified
                </span>
              )}
              {!emailVerified && verificationSent && (
                <span className="text-[11px] font-bold px-2 py-1 rounded-lg bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 flex items-center gap-1">
                  <CheckCircle2 size={10} /> Email sent
                </span>
              )}
            </div>

            {/* Usage bar (sidebar) */}
            {isBusinessOrPro && (
              <div className="mt-3">
                <div className="flex items-center justify-between text-xs text-slate-500 dark:text-gray-400 mb-1">
                  <span>Pages used</span>
                  <span className="font-medium">{billing.pagesUsedThisPeriod} / {billing.monthlyPageLimit}</span>
                </div>
                <div className="h-1.5 bg-slate-100 dark:bg-white/10 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${usagePercent > 80 ? "bg-rose-500" : "bg-navy dark:bg-brand-400"}`}
                    style={{ width: `${usagePercent}%` }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Nav items */}
          <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
            {navItems.map(item => (
              <NavLink key={item.id} item={item} />
            ))}
          </nav>

          {/* Sign out */}
          <div className="p-3 border-t border-slate-100 dark:border-white/10">
            <button
              onClick={handleSignOut}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-500 dark:text-gray-400 hover:bg-rose-50 dark:hover:bg-rose-900/20 hover:text-rose-600 dark:hover:text-rose-400 transition-all"
            >
              <LogOut size={18} />
              {isDemo ? t("goHome") : t("signOut")}
            </button>
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 overflow-y-auto">
          {/* Email verification banner */}
          {!emailVerified && !isDemo && (
            <div className="bg-amber-50 dark:bg-amber-900/10 border-b border-amber-200 dark:border-amber-800 px-4 py-3">
              <div className="max-w-4xl mx-auto flex items-center gap-3 flex-wrap">
                <AlertTriangle size={16} className="text-amber-600 dark:text-amber-400 shrink-0" />
                <p className="text-sm text-amber-800 dark:text-amber-300 flex-1">
                  Please verify your email address to unlock full features.
                </p>
                {verificationSent ? (
                  <span className="text-sm font-medium text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 size={14} /> Verification email sent — check your inbox
                  </span>
                ) : (
                  <button
                    onClick={sendVerificationEmail}
                    disabled={sendingVerification}
                    className="text-sm font-semibold text-amber-700 dark:text-amber-300 underline hover:no-underline disabled:opacity-50"
                  >
                    {sendingVerification ? "Sending…" : "Resend verification email"}
                  </button>
                )}
              </div>
            </div>
          )}

          <div className="max-w-4xl mx-auto px-4 py-8">

            {/* Upload tab */}
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
                  ? <UploadCard billing={billing} onBillingUpdate={refreshBilling} userEmail={userEmail} hasSheetsAccess={hasSheetsAccess} />
                  : <BulkUploadCard billing={billing} onBillingUpdate={refreshBilling} />
                }
              </div>
            )}

            {/* History tab */}
            {tab === "history" && (
              <div>
                <div className="mb-6">
                  <h1 className="font-display text-2xl font-bold text-slate-900 dark:text-white">{t("historyTitle")}</h1>
                  <p className="mt-1 text-sm text-slate-500 dark:text-gray-400">{t("historySubtitle")}</p>
                </div>
                <UsageHistory logs={recentLogs} isDemo={isDemo} />
              </div>
            )}

            {/* Queue tab */}
            {tab === "queue" && (
              <div>
                <div className="mb-6">
                  <h1 className="font-display text-2xl font-bold text-slate-900 dark:text-white">Processing Queue</h1>
                  <p className="mt-1 text-sm text-slate-500 dark:text-gray-400">
                    Track async conversions and bulk jobs in real time.
                  </p>
                </div>
                <QueuePanel userEmail={userEmail} tier={billing.tier} />
              </div>
            )}

            {/* Billing tab */}
            {tab === "billing" && (
              <div>
                <div className="mb-6">
                  <h1 className="font-display text-2xl font-bold text-slate-900 dark:text-white">{t("billingTitle")}</h1>
                  <p className="mt-1 text-sm text-slate-500 dark:text-gray-400">
                    {t("billingSubtitle", { tier: billing.tier })}
                  </p>
                </div>
                <PricingSection currentTier={billing.tier} onTierChange={refreshBilling} />
              </div>
            )}

            {/* Portals tab */}
            {tab === "portals" && (
              <div>
                <div className="mb-6">
                  <h1 className="font-display text-2xl font-bold text-slate-900 dark:text-white">{t("portalsTitle")}</h1>
                  <p className="mt-1 text-sm text-slate-500 dark:text-gray-400">{t("portalsSubtitle")}</p>
                </div>
                <PortalsPanel />
              </div>
            )}

            {/* Team tab */}
            {tab === "team" && (
              <div>
                <div className="mb-6">
                  <h1 className="font-display text-2xl font-bold text-slate-900 dark:text-white">Team Management</h1>
                  <p className="mt-1 text-sm text-slate-500 dark:text-gray-400">
                    Invite colleagues and manage your Business team seats.
                  </p>
                </div>
                <TeamPanel tier={billing.tier} userEmail={userEmail} />
              </div>
            )}

            {/* Settings tab */}
            {tab === "settings" && (
              <div>
                <div className="mb-6">
                  <h1 className="font-display text-2xl font-bold text-slate-900 dark:text-white">Account Settings</h1>
                  <p className="mt-1 text-sm text-slate-500 dark:text-gray-400">
                    Manage your profile, integrations, and notification preferences.
                  </p>
                </div>
                <AccountSettings
                  userEmail={userEmail}
                  userName={userName}
                  emailVerified={emailVerified}
                  tier={billing.tier}
                  onVerificationSent={() => setVerificationSent(true)}
                />
              </div>
            )}

          </div>
          {footer}
        </main>
      </div>

      {/* Mobile bottom nav */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-surface border-t border-slate-200 dark:border-white/10 z-20 flex">
        {navItems.slice(0, 5).map(item => (
          <button
            key={item.id}
            onClick={() => setTab(item.id)}
            className={`flex-1 flex flex-col items-center gap-0.5 py-2.5 text-[10px] font-medium transition-colors ${
              tab === item.id ? "text-navy dark:text-brand-400" : "text-slate-400 dark:text-gray-500"
            }`}
          >
            <span className={tab === item.id ? "text-navy dark:text-brand-400" : "text-slate-400 dark:text-gray-500"}>
              {item.icon}
            </span>
            {item.label}
          </button>
        ))}
      </nav>
    </div>
  );
}
