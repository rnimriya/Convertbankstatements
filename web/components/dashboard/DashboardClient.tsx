"use client";

import { useState, useCallback } from "react";
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
  FileText, Menu, X, Layers, CheckCircle2, AlertTriangle,
  LayoutDashboard, TrendingUp, Clock, Zap, ChevronRight, ArrowRight,
  ArrowUpRight,
} from "lucide-react";

type Tab = "home" | "upload" | "history" | "billing" | "portals" | "team" | "settings" | "queue";

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

const RING_R = 26;
const RING_C = 2 * Math.PI * RING_R;

/* ── Page banner ─────────────────────────────────────────────────── */
function PageBanner({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="shrink-0 bg-white border-b border-gray-100 px-6 lg:px-8 py-5">
      <div className="flex items-center justify-between gap-4 max-w-[1200px]">
        <div>
          <h2 className="text-[17px] font-bold text-gray-900 leading-tight">{title}</h2>
          <p className="text-[13px] text-gray-400 mt-0.5">{subtitle}</p>
        </div>
        {action && <div className="shrink-0">{action}</div>}
      </div>
    </div>
  );
}

/* ── Stat card ───────────────────────────────────────────────────── */
function StatCard({
  label, value, sub, Icon,
}: { label: string; value: string; sub: string; Icon: React.ElementType }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-5 hover:shadow-sm transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <div className="w-8 h-8 rounded-xl bg-gray-100 flex items-center justify-center">
          <Icon size={15} className="text-gray-500" />
        </div>
      </div>
      <p className="text-[28px] font-black text-gray-900 leading-none tracking-tight">{value}</p>
      <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mt-1.5">{label}</p>
      <p className="text-xs text-gray-400 mt-0.5">{sub}</p>
    </div>
  );
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
  const [tab, setTab] = useState<Tab>("home");
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

  const handleSignOut = async () => {
    try { await fetch("/api/auth/logout", { method: "POST" }); } catch { /* ignore */ }
    window.location.href = "/login";
  };

  const sendVerificationEmail = async () => {
    setSendingVerification(true);
    try {
      await fetch("/api/auth/send-verification", { method: "POST" });
      setVerificationSent(true);
    } finally { setSendingVerification(false); }
  };

  const displayName = userName ?? userEmail.split("@")[0];
  const initial = displayName[0]?.toUpperCase();
  const isBusinessOrPro = billing.tier === "PRO" || billing.tier === "BUSINESS";
  const isBusiness = billing.tier === "BUSINESS";

  const usagePercent = billing.monthlyPageLimit > 0
    ? Math.min(100, Math.round((billing.pagesUsedThisPeriod / billing.monthlyPageLimit) * 100))
    : 0;

  const totalDocs = recentLogs.length;
  const totalTxns = recentLogs.reduce((s, l) => s + l.transactionCount, 0);

  const greeting = (() => {
    const h = new Date().getHours();
    if (h < 12) return "Good morning";
    if (h < 17) return "Good afternoon";
    return "Good evening";
  })();

  const navSections = [
    {
      label: "Workspace",
      items: [
        { id: "home" as Tab,    label: "Overview",  Icon: LayoutDashboard },
        { id: "upload" as Tab,  label: "Convert",   Icon: Upload },
        { id: "history" as Tab, label: "History",   Icon: History },
        { id: "queue" as Tab,   label: "Queue",     Icon: Layers },
      ],
    },
    {
      label: "Account",
      items: [
        { id: "billing" as Tab,  label: "Billing",  Icon: CreditCard },
        ...(isBusiness ? [{ id: "team" as Tab, label: "Team", Icon: Users }] : []),
        { id: "settings" as Tab, label: "Settings", Icon: Settings },
      ],
    },
    {
      label: "Tools",
      items: [
        { id: "portals" as Tab, label: "Portals", Icon: Link2 },
      ],
    },
  ];

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">

      {/* Sidebar overlay (mobile) */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/30 z-20 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* ── SIDEBAR ──────────────────────────────────────────────── */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-30 w-[216px] flex flex-col bg-white border-r border-gray-100 transition-transform duration-200 lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Logo */}
        <div className="flex items-center gap-2.5 px-5 py-5">
          <a href="/" className="flex items-center gap-2.5">
            <img src="/logo.svg" alt="Convert Statement" className="h-7 w-7" />
            <div className="leading-none">
              <span className="font-bold text-gray-900 text-[14px] tracking-tight block">Convert</span>
              <span className="text-[10px] font-medium text-gray-400 tracking-[0.1em] uppercase">Statement</span>
            </div>
          </a>
        </div>

        {/* User info (minimal, flat) */}
        <div className="px-4 pb-3">
          <div className="flex items-center gap-2.5 py-2.5 px-2 rounded-xl">
            <div className="h-8 w-8 rounded-xl bg-gray-900 flex items-center justify-center text-xs font-black text-white shrink-0">
              {initial}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[13px] font-semibold text-gray-800 truncate leading-tight">{displayName}</p>
              <p className="text-[10px] text-gray-400 truncate leading-tight">{userEmail}</p>
            </div>
          </div>
          {/* Plan badge */}
          <div className="px-2 mt-1 flex items-center gap-2">
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
              billing.tier === "BUSINESS" ? "bg-indigo-50 text-indigo-600" :
              billing.tier === "PRO"      ? "bg-violet-50 text-violet-600" :
              "bg-gray-100 text-gray-500"
            }`}>
              {billing.tier}
            </span>
            {!emailVerified && !verificationSent && (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-50 text-amber-600 flex items-center gap-1">
                <AlertTriangle size={8} /> Unverified
              </span>
            )}
          </div>
          {/* Pages bar for pro/business */}
          {isBusinessOrPro && (
            <div className="px-2 mt-2.5">
              <div className="flex justify-between text-[10px] text-gray-400 mb-1">
                <span>Pages</span>
                <span className="font-medium text-gray-600">{billing.pagesUsedThisPeriod}/{billing.monthlyPageLimit}</span>
              </div>
              <div className="h-1 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${usagePercent}%`,
                    background: usagePercent > 80 ? "#EF4444" : "#374151",
                  }}
                />
              </div>
            </div>
          )}
        </div>

        <div className="h-px bg-gray-100 mx-4" />

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto px-3 py-3 space-y-4">
          {navSections.map(section => (
            <div key={section.label}>
              <p className="px-3 mb-1.5 text-[9px] font-bold uppercase tracking-[0.18em] text-gray-400">
                {section.label}
              </p>
              <div className="space-y-0.5">
                {section.items.map(({ id, label, Icon }) => {
                  const active = tab === id;
                  return (
                    <button
                      key={id}
                      onClick={() => { setTab(id); setSidebarOpen(false); }}
                      className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-[13px] font-medium transition-all text-left group ${
                        active
                          ? "bg-gray-100 text-gray-900 font-semibold"
                          : "text-gray-500 hover:bg-gray-50 hover:text-gray-800"
                      }`}
                    >
                      <Icon
                        size={14}
                        className={`shrink-0 ${active ? "text-gray-700" : "text-gray-400 group-hover:text-gray-600"}`}
                      />
                      <span className="flex-1 truncate">{label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Sign out */}
        <div className="p-3 border-t border-gray-100">
          <button
            onClick={handleSignOut}
            className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-[13px] font-medium text-gray-400 hover:bg-red-50 hover:text-red-500 transition-all"
          >
            <LogOut size={14} />
            {isDemo ? t("goHome") : t("signOut")}
          </button>
        </div>
      </aside>

      {/* ── RIGHT PANEL ──────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">

        {/* Top bar */}
        <header className="flex items-center gap-3 px-4 lg:px-6 py-3.5 bg-white border-b border-gray-100 shrink-0">
          <button
            className="lg:hidden flex items-center justify-center w-8 h-8 rounded-lg hover:bg-gray-100 transition-colors"
            onClick={() => setSidebarOpen(v => !v)}
          >
            {sidebarOpen ? <X size={17} /> : <Menu size={17} />}
          </button>
          <a href="/" className="lg:hidden shrink-0">
            <img src="/logo.svg" alt="" className="h-7 w-7" />
          </a>
          <div className="flex-1" />
          <div className="flex items-center gap-2 shrink-0">
            {tab !== "upload" && (
              <button
                onClick={() => setTab("upload")}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold text-white bg-gray-900 hover:bg-gray-800 transition-colors"
              >
                <Upload size={13} />
                <span className="hidden sm:inline">Convert</span>
              </button>
            )}
            <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-full pl-1.5 pr-3 py-1">
              <div className="h-6 w-6 rounded-full bg-gray-900 flex items-center justify-center text-[10px] font-black text-white">
                {initial}
              </div>
              <span className="text-sm text-gray-600 font-medium truncate max-w-[120px]">{displayName}</span>
            </div>
          </div>
        </header>

        {/* System banners */}
        {isDemo && (
          <div className="bg-amber-50 border-b border-amber-100 py-2 text-center text-sm text-amber-700 px-4 shrink-0">
            Demo mode —{" "}
            <Link href="/signup" className="font-bold underline hover:no-underline">Sign up free</Link>{" "}
            to save history and unlock all features.
          </div>
        )}
        {!emailVerified && !isDemo && (
          <div className="bg-amber-50 border-b border-amber-100 px-6 py-2.5 flex items-center gap-3 flex-wrap shrink-0">
            <AlertTriangle size={14} className="text-amber-500 shrink-0" />
            <p className="text-sm text-amber-700 flex-1">Please verify your email to unlock all features.</p>
            {verificationSent ? (
              <span className="text-sm font-medium text-emerald-600 flex items-center gap-1">
                <CheckCircle2 size={13} /> Check your inbox
              </span>
            ) : (
              <button
                onClick={sendVerificationEmail}
                disabled={sendingVerification}
                className="text-sm font-semibold text-amber-700 underline hover:no-underline disabled:opacity-50"
              >
                {sendingVerification ? "Sending…" : "Resend link"}
              </button>
            )}
          </div>
        )}

        {/* ── PAGE CONTENT ─────────────────────────────────────── */}
        <main className="flex-1 overflow-y-auto pb-20 lg:pb-0">

          {/* ═══ HOME / OVERVIEW ════════════════════════════════ */}
          {tab === "home" && (
            <div className="p-6 lg:p-8 space-y-6 max-w-[1400px]">

              {/* ── Welcome header ── */}
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div>
                  <p className="text-sm text-gray-400 mb-1">
                    {new Date().toLocaleDateString("en-IN", { weekday: "long", month: "long", day: "numeric" })}
                  </p>
                  <h1 className="text-2xl lg:text-3xl font-black text-gray-900 tracking-tight">
                    {greeting}, {displayName}
                  </h1>
                  <p className="text-sm text-gray-400 mt-1">Here&apos;s your statement conversion overview.</p>
                </div>
                <button
                  onClick={() => setTab("upload")}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-gray-900 hover:bg-gray-800 transition-colors shrink-0"
                >
                  <Upload size={14} />
                  Convert Statement
                </button>
              </div>

              {/* ── Stat cards ── */}
              <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
                <StatCard
                  label="Docs Converted"
                  value={String(totalDocs)}
                  sub={totalDocs === 0 ? "No files yet" : `${totalDocs} file${totalDocs !== 1 ? "s" : ""} converted`}
                  Icon={FileText}
                />
                <StatCard
                  label="Pages Processed"
                  value={billing.pagesUsedThisPeriod.toLocaleString("en-IN")}
                  sub={billing.pagesUsedThisPeriod === 0 ? "No pages yet" : `of ${billing.monthlyPageLimit} ${isBusinessOrPro ? "this period" : "free"}`}
                  Icon={TrendingUp}
                />
                <StatCard
                  label="Transactions"
                  value={totalTxns.toLocaleString("en-IN")}
                  sub={totalTxns > 0 ? "Auto-extracted" : "Upload to start"}
                  Icon={Zap}
                />
                <StatCard
                  label="Plan Usage"
                  value={isBusinessOrPro ? `${usagePercent}%` : billing.tier}
                  sub={isBusinessOrPro
                    ? `${billing.pagesUsedThisPeriod} / ${billing.monthlyPageLimit} pages`
                    : billing.tier === "FREE"
                      ? `${Math.max(0, billing.monthlyPageLimit - billing.pagesUsedThisPeriod)} of ${billing.monthlyPageLimit} pages left`
                      : "Pay per doc"}
                  Icon={Clock}
                />
              </div>

              {/* ── Mid section ── */}
              <div className="grid xl:grid-cols-3 gap-5">

                {/* Recent conversions */}
                <div className="xl:col-span-2 bg-white rounded-2xl border border-gray-200 overflow-hidden">
                  <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
                    <div>
                      <h3 className="text-sm font-semibold text-gray-900">Recent Conversions</h3>
                      <p className="text-xs text-gray-400 mt-0.5">
                        {recentLogs.length === 0 ? "No documents yet" : `Last ${Math.min(5, recentLogs.length)} processed`}
                      </p>
                    </div>
                    {recentLogs.length > 5 && (
                      <button
                        onClick={() => setTab("history")}
                        className="flex items-center gap-1 text-xs font-medium text-gray-500 hover:text-gray-900 transition-colors"
                      >
                        View all <ArrowUpRight size={11} />
                      </button>
                    )}
                  </div>

                  {recentLogs.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-14 px-6 text-center">
                      <div className="w-14 h-14 rounded-2xl bg-gray-100 flex items-center justify-center mb-4">
                        <FileText size={22} className="text-gray-400" />
                      </div>
                      <p className="font-semibold text-gray-700 text-base">No documents yet</p>
                      <p className="text-sm text-gray-400 mt-1 max-w-xs">
                        Upload your first Indian bank statement PDF to get started.
                      </p>
                      <button
                        onClick={() => setTab("upload")}
                        className="mt-5 flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-gray-900 hover:bg-gray-800 transition-colors"
                      >
                        Convert your first statement <ArrowRight size={13} />
                      </button>
                    </div>
                  ) : (
                    <div>
                      <div className="grid grid-cols-12 px-5 py-2.5 bg-gray-50 border-b border-gray-100 text-[10px] font-bold uppercase tracking-widest text-gray-400">
                        <div className="col-span-5">File</div>
                        <div className="col-span-2 hidden sm:block">Bank</div>
                        <div className="col-span-2 text-center">Pages</div>
                        <div className="col-span-2 text-center">Txns</div>
                        <div className="col-span-1 text-right hidden sm:block">Date</div>
                      </div>
                      <div className="divide-y divide-gray-50">
                        {recentLogs.slice(0, 5).map(log => (
                          <div key={log.id} className="grid grid-cols-12 items-center gap-2 px-5 py-3.5 hover:bg-gray-50/70 transition-colors">
                            <div className="col-span-5 flex items-center gap-3 min-w-0">
                              <div className="w-8 h-8 rounded-xl bg-gray-100 flex items-center justify-center shrink-0">
                                <FileText size={14} className="text-gray-500" />
                              </div>
                              <div className="min-w-0">
                                <p className="text-sm font-medium text-gray-800 truncate">{log.fileName}</p>
                                <div className="flex gap-1 mt-0.5">
                                  {log.exportFormats.slice(0, 2).map(f => (
                                    <span key={f} className="text-[9px] font-bold px-1.5 py-0.5 rounded-md bg-gray-100 text-gray-500 uppercase">{f}</span>
                                  ))}
                                </div>
                              </div>
                            </div>
                            <div className="col-span-2 hidden sm:block">
                              <span className="text-xs text-gray-400 truncate">{log.bankName ?? "—"}</span>
                            </div>
                            <div className="col-span-2 text-center">
                              <span className="text-sm font-semibold text-gray-700">{log.pageCount}</span>
                            </div>
                            <div className="col-span-2 text-center">
                              <span className="text-sm font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-lg">
                                {log.transactionCount}
                              </span>
                            </div>
                            <div className="col-span-1 text-right hidden sm:block">
                              <span className="text-xs text-gray-400">
                                {new Date(log.createdAt).toLocaleDateString("en-IN", { month: "short", day: "numeric" })}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                      {recentLogs.length > 5 && (
                        <div className="px-5 py-3 border-t border-gray-100 text-center">
                          <button onClick={() => setTab("history")} className="text-xs font-medium text-gray-500 hover:text-gray-900 transition-colors">
                            View all {recentLogs.length} conversions →
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Right column */}
                <div className="space-y-4">
                  {/* Plan card */}
                  <div className="bg-white rounded-2xl border border-gray-200 p-5">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">Current Plan</p>
                        <p className="text-xl font-black text-gray-900">{billing.tier}</p>
                      </div>
                      <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-lg ${
                        billing.tier === "BUSINESS" ? "bg-indigo-50 text-indigo-600" :
                        billing.tier === "PRO"      ? "bg-violet-50 text-violet-600" :
                        "bg-gray-100 text-gray-500"
                      }`}>
                        {billing.tier === "FREE" ? "Free forever" : "Active"}
                      </span>
                    </div>

                    {isBusinessOrPro ? (
                      <div className="flex items-center gap-4">
                        <div className="relative w-14 h-14 shrink-0">
                          <svg width="56" height="56" viewBox="0 0 64 64" className="-rotate-90">
                            <circle cx="32" cy="32" r={RING_R} fill="none" stroke="#F3F4F6" strokeWidth="7" />
                            <circle
                              cx="32" cy="32" r={RING_R} fill="none"
                              stroke={usagePercent > 80 ? "#EF4444" : "#374151"}
                              strokeWidth="7" strokeLinecap="round"
                              strokeDasharray={RING_C}
                              strokeDashoffset={RING_C * (1 - usagePercent / 100)}
                              className="transition-all duration-700"
                            />
                          </svg>
                          <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-[11px] font-black text-gray-900">{usagePercent}%</span>
                          </div>
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-semibold text-gray-800">{billing.monthlyPageLimit - billing.pagesUsedThisPeriod} pages left</p>
                          <p className="text-xs text-gray-400 mt-0.5">{billing.pagesUsedThisPeriod} of {billing.monthlyPageLimit} used</p>
                          <p className="text-xs text-gray-400">Resets next month</p>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-1.5 mb-4">
                        {["8 pages free, forever", "CSV & Excel export", "All Indian banks"].map(f => (
                          <div key={f} className="flex items-center gap-2">
                            <CheckCircle2 size={12} className="text-emerald-500 shrink-0" />
                            <span className="text-xs text-gray-500">{f}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {billing.tier === "FREE" && (
                      <button
                        onClick={() => setTab("billing")}
                        className="mt-4 w-full py-2.5 rounded-xl text-sm font-semibold text-white bg-gray-900 hover:bg-gray-800 transition-colors"
                      >
                        Upgrade to Pro →
                      </button>
                    )}
                    {billing.tier === "PRO" && (
                      <button
                        onClick={() => setTab("billing")}
                        className="mt-4 w-full py-2 rounded-xl text-xs font-medium text-gray-500 border border-gray-200 hover:border-gray-300 hover:text-gray-700 transition-colors"
                      >
                        Manage plan
                      </button>
                    )}
                  </div>

                  {/* Quick actions */}
                  <div className="bg-white rounded-2xl border border-gray-200 p-4">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-3">Quick Actions</p>
                    <div className="space-y-0.5">
                      {[
                        { label: "Convert a statement", Icon: Upload,     dest: "upload" as Tab  },
                        { label: "View history",         Icon: History,    dest: "history" as Tab },
                        { label: "Manage billing",       Icon: CreditCard, dest: "billing" as Tab },
                        { label: "Account settings",     Icon: Settings,   dest: "settings" as Tab},
                      ].map(({ label, Icon, dest }) => (
                        <button
                          key={label}
                          onClick={() => setTab(dest)}
                          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-50 transition-colors group text-left"
                        >
                          <div className="w-7 h-7 rounded-lg bg-gray-100 flex items-center justify-center shrink-0">
                            <Icon size={13} className="text-gray-500 group-hover:text-gray-700 transition-colors" />
                          </div>
                          <span className="text-sm font-medium text-gray-600 group-hover:text-gray-900 flex-1 transition-colors">{label}</span>
                          <ChevronRight size={12} className="text-gray-300 group-hover:text-gray-500 transition-colors" />
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Pro upsell — minimal dark card */}
                  {billing.tier === "FREE" && (
                    <div className="rounded-2xl p-5 bg-gray-900 relative overflow-hidden">
                      <div
                        className="absolute top-0 right-0 w-28 h-28 rounded-full opacity-[0.06] pointer-events-none"
                        style={{ background: "radial-gradient(circle,white,transparent)", transform: "translate(30%,-30%)" }}
                      />
                      <p className="text-sm font-semibold text-white mb-1">Go Pro — 500 pages/mo</p>
                      <p className="text-xs text-white/50 mb-4 leading-relaxed">All formats, Google Sheets, priority processing</p>
                      <button
                        onClick={() => setTab("billing")}
                        className="w-full py-2.5 rounded-xl text-sm font-semibold text-gray-900 bg-white hover:bg-gray-50 transition-colors"
                      >
                        See plans →
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ═══ UPLOAD ══════════════════════════════════════════ */}
          {tab === "upload" && (
            <div className="flex flex-col h-full">
              <PageBanner
                title="Convert Statement"
                subtitle="Upload a bank PDF and download structured data in seconds"
                action={
                  <div className="flex items-center gap-1 bg-gray-100 rounded-xl p-1">
                    {(["single", "bulk"] as const).map(m => (
                      <button
                        key={m}
                        onClick={() => setUploadMode(m)}
                        className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                          uploadMode === m ? "bg-white text-gray-900 shadow-sm font-semibold" : "text-gray-500 hover:text-gray-700"
                        }`}
                      >
                        {m === "single" ? t("singleFile") : t("bulkUpload")}
                      </button>
                    ))}
                  </div>
                }
              />
              <div className="flex-1 min-h-0 flex flex-col">
                {uploadMode === "single"
                  ? <UploadCard billing={billing} onBillingUpdate={refreshBilling} userEmail={userEmail} hasSheetsAccess={hasSheetsAccess} />
                  : <BulkUploadCard billing={billing} onBillingUpdate={refreshBilling} />
                }
              </div>
            </div>
          )}

          {/* ═══ HISTORY ════════════════════════════════════════ */}
          {tab === "history" && (
            <div className="flex flex-col h-full">
              <PageBanner
                title="Conversion History"
                subtitle="All your past statements and downloaded files"
                action={
                  recentLogs.length > 0 ? (
                    <span className="text-xs font-medium text-gray-500 bg-white border border-gray-200 px-3 py-1.5 rounded-xl">
                      {recentLogs.length} total
                    </span>
                  ) : undefined
                }
              />
              <div className="p-5 lg:p-8">
                <UsageHistory logs={recentLogs} isDemo={isDemo} />
              </div>
            </div>
          )}

          {/* ═══ QUEUE ══════════════════════════════════════════ */}
          {tab === "queue" && (
            <div className="flex flex-col h-full">
              <PageBanner title="Processing Queue" subtitle="Batch jobs and queued conversions" />
              <div className="p-5 lg:p-8">
                <QueuePanel userEmail={userEmail} tier={billing.tier} />
              </div>
            </div>
          )}

          {/* ═══ BILLING ════════════════════════════════════════ */}
          {tab === "billing" && (
            <div className="flex flex-col h-full">
              <PageBanner
                title="Billing & Plans"
                subtitle="Manage your subscription and payment methods"
                action={
                  <span className={`text-xs font-semibold px-3 py-1.5 rounded-xl ${
                    billing.tier === "BUSINESS" ? "bg-indigo-50 text-indigo-600" :
                    billing.tier === "PRO"      ? "bg-violet-50 text-violet-600" :
                    "bg-gray-100 text-gray-600"
                  }`}>
                    {billing.tier} plan
                  </span>
                }
              />
              <div className="p-5 lg:p-8">
                <PricingSection currentTier={billing.tier} onTierChange={refreshBilling} />
              </div>
            </div>
          )}

          {/* ═══ PORTALS ════════════════════════════════════════ */}
          {tab === "portals" && (
            <div className="flex flex-col h-full">
              <PageBanner
                title="Quick Portals"
                subtitle="Direct links to bank netbanking and statement pages"
              />
              <div className="p-5 lg:p-8">
                <PortalsPanel />
              </div>
            </div>
          )}

          {/* ═══ TEAM ═══════════════════════════════════════════ */}
          {tab === "team" && (
            <div className="flex flex-col h-full">
              <PageBanner
                title="Team Management"
                subtitle="Invite members and manage your Business workspace"
              />
              <div className="p-5 lg:p-8">
                <TeamPanel tier={billing.tier} userEmail={userEmail} />
              </div>
            </div>
          )}

          {/* ═══ SETTINGS ═══════════════════════════════════════ */}
          {tab === "settings" && (
            <div className="flex flex-col h-full">
              <PageBanner
                title="Account Settings"
                subtitle="Update your profile, email preferences and security"
              />
              <div className="p-5 lg:p-8">
                <AccountSettings
                  userEmail={userEmail}
                  userName={userName}
                  emailVerified={emailVerified}
                  tier={billing.tier}
                  onVerificationSent={() => setVerificationSent(true)}
                />
              </div>
            </div>
          )}

        </main>
      </div>

      {/* ── MOBILE BOTTOM NAV ────────────────────────────────── */}
      <nav className="lg:hidden fixed bottom-0 inset-x-0 bg-white border-t border-gray-100 z-20 flex">
        {[
          { id: "home" as Tab,     label: "Home",    Icon: LayoutDashboard },
          { id: "upload" as Tab,   label: "Convert", Icon: Upload },
          { id: "history" as Tab,  label: "History", Icon: History },
          { id: "billing" as Tab,  label: "Billing", Icon: CreditCard },
          { id: "settings" as Tab, label: "Settings",Icon: Settings },
        ].map(({ id, label, Icon }) => {
          const active = tab === id;
          return (
            <button
              key={id}
              onClick={() => setTab(id)}
              className={`flex-1 flex flex-col items-center gap-1 py-3 text-[10px] font-semibold transition-colors ${
                active ? "text-gray-900" : "text-gray-400 hover:text-gray-600"
              }`}
            >
              <Icon size={17} />
              {label}
            </button>
          );
        })}
      </nav>
    </div>
  );
}
