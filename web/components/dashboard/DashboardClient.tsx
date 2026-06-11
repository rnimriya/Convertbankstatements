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
  LayoutDashboard, TrendingUp, Clock, Zap, ChevronRight, ArrowUpRight,
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

/* ── Shared page banner for non-overview tabs ───────────────────── */
function PageBanner({
  icon: Icon,
  title,
  subtitle,
  iconColor,
  iconBg,
  action,
}: {
  icon: React.ElementType;
  title: string;
  subtitle: string;
  iconColor: string;
  iconBg: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="shrink-0 bg-white border-b border-slate-100 px-4 sm:px-6 lg:px-8 py-3 sm:py-5">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4">
        <div className="flex items-center gap-3">
          <div
            className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl flex items-center justify-center shrink-0"
            style={{ background: iconBg }}
          >
            <Icon size={17} style={{ color: iconColor }} />
          </div>
          <div>
            <h2 className="text-[15px] sm:text-[17px] font-black text-slate-900 leading-tight">{title}</h2>
            <p className="text-[12px] sm:text-[13px] text-slate-400 mt-0.5 hidden sm:block">{subtitle}</p>
          </div>
        </div>
        {action && <div className="shrink-0 pl-12 sm:pl-0">{action}</div>}
      </div>
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
  const totalPages = recentLogs.reduce((s, l) => s + l.pageCount, 0);
  const totalTxns = recentLogs.reduce((s, l) => s + l.transactionCount, 0);

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
    <div className="flex h-screen overflow-hidden" style={{ background: "#f0f3f9" }}>

      {/* ── SIDEBAR OVERLAY (mobile) ─────────────────────────── */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/40 z-20 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* ── SIDEBAR ─────────────────────────────────────────── */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-30 w-[220px] flex flex-col bg-white border-r border-slate-200/80 transition-transform duration-200 lg:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        {/* Logo */}
        <div className="flex items-center gap-2.5 px-5 py-[18px] border-b border-slate-100">
          <a href="/" className="flex items-center gap-2.5">
            <img src="/logo.svg" alt="Convert Statement" className="h-7 w-7" />
            <div className="leading-none">
              <span className="font-display font-bold text-slate-900 text-[14px] tracking-tight block">Convert</span>
              <span className="text-[10px] font-semibold text-slate-400 tracking-[0.1em] uppercase">Statement</span>
            </div>
          </a>
        </div>

        {/* User card */}
        <div className="mx-3 mt-3 mb-2 p-3 rounded-2xl" style={{ background: "#f5f7ff", border: "1px solid #e0e7ff" }}>
          <div className="flex items-center gap-2.5 mb-2.5">
            <div
              className="h-8 w-8 rounded-xl flex items-center justify-center text-xs font-black text-white shrink-0"
              style={{ background: "linear-gradient(135deg,#1A47C8 0%,#3b6ef5 100%)" }}
            >
              {initial}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[13px] font-semibold text-slate-800 truncate leading-tight">{displayName}</p>
              <p className="text-[10px] text-slate-400 truncate leading-tight">{userEmail}</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-lg ${
              billing.tier === "BUSINESS" ? "bg-blue-100 text-blue-700" :
              billing.tier === "PRO"      ? "bg-violet-100 text-violet-700" :
              "bg-slate-200 text-slate-500"
            }`}>
              {billing.tier}
            </span>
            {!emailVerified && !verificationSent && (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-lg bg-amber-100 text-amber-700 flex items-center gap-1">
                <AlertTriangle size={8} /> Unverified
              </span>
            )}
            {verificationSent && (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-lg bg-emerald-100 text-emerald-700 flex items-center gap-1">
                <CheckCircle2 size={8} /> Email sent
              </span>
            )}
          </div>
          {isBusinessOrPro && (
            <div className="mt-2.5">
              <div className="flex justify-between text-[10px] text-slate-400 mb-1">
                <span>Pages</span>
                <span className="font-semibold text-slate-600">{billing.pagesUsedThisPeriod}/{billing.monthlyPageLimit}</span>
              </div>
              <div className="h-1 bg-white rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{ width: `${usagePercent}%`, background: usagePercent > 80 ? "#ef4444" : "linear-gradient(90deg,#1A47C8,#3b6ef5)" }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto px-3 py-2 space-y-4">
          {navSections.map(section => (
            <div key={section.label}>
              <p className="px-3 mb-1 text-[9px] font-bold uppercase tracking-[0.16em] text-slate-400">
                {section.label}
              </p>
              <div className="space-y-0.5">
                {section.items.map(({ id, label, Icon }) => {
                  const active = tab === id;
                  return (
                    <button
                      key={id}
                      onClick={() => { setTab(id); setSidebarOpen(false); }}
                      className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-[13px] font-semibold transition-all text-left group ${
                        active
                          ? "bg-slate-100 text-slate-900"
                          : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"
                      }`}
                    >
                      <Icon
                        size={14}
                        className={`shrink-0 transition-colors ${active ? "text-slate-700" : "text-slate-400 group-hover:text-slate-600"}`}
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
        <div className="p-3 border-t border-slate-100">
          <button
            onClick={handleSignOut}
            className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-[13px] font-medium text-slate-400 hover:bg-red-50 hover:text-red-600 transition-all"
          >
            <LogOut size={14} />
            {isDemo ? t("goHome") : t("signOut")}
          </button>
        </div>
      </aside>

      {/* ── RIGHT PANEL ─────────────────────────────────────── */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">

        {/* Top bar */}
        <header className="flex items-center gap-3 px-4 lg:px-6 py-3 bg-white border-b border-slate-200 shrink-0">
          <button
            className="lg:hidden flex items-center justify-center w-8 h-8 rounded-lg hover:bg-slate-100 transition-colors shrink-0"
            onClick={() => setSidebarOpen(v => !v)}
            aria-label="Toggle sidebar"
          >
            {sidebarOpen ? <X size={17} /> : <Menu size={17} />}
          </button>
          <a href="/" className="lg:hidden shrink-0">
            <img src="/logo.svg" alt="" className="h-7 w-7" />
          </a>
          <div className="flex-1 min-w-0" />
          <div className="flex items-center gap-2 shrink-0">
            {tab !== "upload" && (
              <button
                onClick={() => setTab("upload")}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-bold text-white hover:opacity-90 transition-opacity"
                style={{ background: "linear-gradient(135deg,#f97316,#ea580c)", boxShadow: "0 2px 10px rgba(249,115,22,0.30)" }}
              >
                <Upload size={13} />
                <span className="hidden sm:inline">Convert</span>
              </button>
            )}
            <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-full pl-1 pr-2 sm:pr-3 py-1">
              <div
                className="h-6 w-6 rounded-full flex items-center justify-center text-[10px] font-black text-white shrink-0"
                style={{ background: "linear-gradient(135deg,#1A47C8,#3b6ef5)" }}
              >
                {initial}
              </div>
              <span className="text-sm text-slate-600 font-medium truncate hidden sm:block max-w-[120px]">{displayName}</span>
            </div>
          </div>
        </header>

        {/* System banners */}
        {isDemo && (
          <div className="bg-amber-50 border-b border-amber-200 py-2 text-center text-sm text-amber-800 px-4 shrink-0">
            Demo mode —{" "}
            <Link href="/signup" className="font-bold underline hover:no-underline">Sign up free</Link>{" "}
            to save history and unlock full features.
          </div>
        )}
        {!emailVerified && !isDemo && (
          <div className="bg-amber-50 border-b border-amber-200 px-6 py-2.5 flex items-center gap-3 flex-wrap shrink-0">
            <AlertTriangle size={14} className="text-amber-600 shrink-0" />
            <p className="text-sm text-amber-800 flex-1">Please verify your email to unlock all features.</p>
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

        {/* ── PAGE CONTENT ─────────────────────────────────── */}
        <main className="flex-1 overflow-y-auto pb-20 lg:pb-0">

          {/* ═══ HOME / OVERVIEW ═══════════════════════════════ */}
          {tab === "home" && (
            <div className="p-5 lg:p-7 space-y-5 max-w-[1400px]">

              {/* Welcome strip */}
              <div
                className="rounded-2xl px-6 py-5 flex items-center justify-between gap-4 flex-wrap relative overflow-hidden"
                style={{ background: "linear-gradient(135deg,#0f1f5c 0%,#1A47C8 60%,#2d5ce8 100%)" }}
              >
                <div
                  className="absolute pointer-events-none"
                  style={{ right: -60, top: -60, width: 220, height: 220, borderRadius: "50%", background: "rgba(255,255,255,0.05)" }}
                />
                <div
                  className="absolute pointer-events-none"
                  style={{ right: 40, top: 20, width: 100, height: 100, borderRadius: "50%", background: "rgba(255,255,255,0.05)" }}
                />
                <div className="relative">
                  <p className="text-white/60 text-xs font-medium mb-0.5">
                    {new Date().toLocaleDateString("en-IN", { weekday: "long", month: "long", day: "numeric" })}
                  </p>
                  <h2 className="text-xl lg:text-2xl font-black text-white leading-tight">
                    Welcome back, {displayName}! 👋
                  </h2>
                  <p className="text-white/55 text-sm mt-1">Here&apos;s your statement conversion overview.</p>
                </div>
                <button
                  onClick={() => setTab("upload")}
                  className="relative shrink-0 flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold bg-white text-navy transition-all hover:bg-white/90"
                  style={{ boxShadow: "0 4px 14px rgba(0,0,0,0.18)" }}
                >
                  <Upload size={14} />
                  Start Converting
                </button>
              </div>

              {/* ── STATS ── */}
              <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
                {[
                  {
                    label: "Docs Converted",
                    value: String(totalDocs),
                    sub: totalDocs === 0 ? "No files yet" : `${totalDocs} file${totalDocs !== 1 ? "s" : ""} converted`,
                    Icon: FileText,
                    gradient: "linear-gradient(135deg,#3b82f6,#6366f1)",
                    bg: "#eff6ff",
                    iconColor: "#3b82f6",
                  },
                  {
                    label: "Pages Processed",
                    value: billing.pagesUsedThisPeriod.toLocaleString("en-IN"),
                    sub: billing.pagesUsedThisPeriod === 0
                      ? "No pages yet"
                      : `of ${billing.monthlyPageLimit} ${isBusinessOrPro ? "this period" : "free"}`,
                    Icon: TrendingUp,
                    gradient: "linear-gradient(135deg,#8b5cf6,#a855f7)",
                    bg: "#f5f3ff",
                    iconColor: "#8b5cf6",
                  },
                  {
                    label: "Transactions",
                    value: totalTxns.toLocaleString("en-IN"),
                    sub: totalTxns > 0 ? "Auto-extracted" : "Upload to start",
                    Icon: Zap,
                    gradient: "linear-gradient(135deg,#10b981,#059669)",
                    bg: "#f0fdf4",
                    iconColor: "#10b981",
                  },
                  {
                    label: "Plan Usage",
                    value: isBusinessOrPro ? `${usagePercent}%` : billing.tier,
                    sub: isBusinessOrPro
                      ? `${billing.pagesUsedThisPeriod} / ${billing.monthlyPageLimit} pages used`
                      : billing.tier === "FREE"
                        ? `${Math.max(0, billing.monthlyPageLimit - billing.pagesUsedThisPeriod)} of ${billing.monthlyPageLimit} pages left`
                        : "Pay per doc",
                    Icon: Clock,
                    gradient: usagePercent > 80 ? "linear-gradient(135deg,#ef4444,#dc2626)" : "linear-gradient(135deg,#f97316,#ea580c)",
                    bg: usagePercent > 80 ? "#fef2f2" : "#fff7ed",
                    iconColor: usagePercent > 80 ? "#ef4444" : "#f97316",
                  },
                ].map(card => (
                  <div key={card.label} className="bg-white rounded-2xl border border-slate-200/70 shadow-sm p-5 relative overflow-hidden group hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-3">
                      <div
                        className="w-9 h-9 rounded-xl flex items-center justify-center"
                        style={{ background: card.bg }}
                      >
                        <card.Icon size={16} style={{ color: card.iconColor }} />
                      </div>
                      <div
                        className="h-1 w-12 rounded-full opacity-60"
                        style={{ background: card.gradient }}
                      />
                    </div>
                    <p className="text-2xl lg:text-3xl font-black text-slate-900 tracking-tight mb-0.5">{card.value}</p>
                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">{card.label}</p>
                    <p className="text-xs text-slate-400 mt-0.5">{card.sub}</p>
                  </div>
                ))}
              </div>

              {/* ── MID SECTION ── */}
              <div className="grid xl:grid-cols-3 gap-5">

                {/* Recent conversions */}
                <div className="xl:col-span-2 bg-white rounded-2xl border border-slate-200/70 shadow-sm overflow-hidden">
                  <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
                    <div>
                      <h3 className="text-sm font-bold text-slate-900">Recent Conversions</h3>
                      <p className="text-xs text-slate-400 mt-0.5">
                        {recentLogs.length === 0 ? "No documents yet" : `Last ${Math.min(5, recentLogs.length)} processed`}
                      </p>
                    </div>
                    {recentLogs.length > 5 && (
                      <button
                        onClick={() => setTab("history")}
                        className="flex items-center gap-1 text-xs font-semibold text-navy hover:text-navy/80 transition-colors"
                      >
                        View all <ArrowUpRight size={12} />
                      </button>
                    )}
                  </div>

                  {recentLogs.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
                      <div
                        className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4"
                        style={{ background: "linear-gradient(135deg,#eff6ff,#e0e7ff)" }}
                      >
                        <FileText size={24} className="text-blue-500" />
                      </div>
                      <p className="font-bold text-slate-800 text-base">No documents yet</p>
                      <p className="text-sm text-slate-400 mt-1 max-w-xs">
                        Upload your first Indian bank statement PDF to get started.
                      </p>
                      <button
                        onClick={() => setTab("upload")}
                        className="mt-5 px-6 py-2.5 rounded-xl text-sm font-bold text-white transition-all hover:-translate-y-0.5"
                        style={{ background: "linear-gradient(135deg,#f97316,#ea580c)", boxShadow: "0 4px 14px rgba(249,115,22,0.35)" }}
                      >
                        Convert your first statement →
                      </button>
                    </div>
                  ) : (
                    <div>
                      <div className="grid grid-cols-12 px-5 py-2.5 bg-slate-50 border-b border-slate-100 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                        <div className="col-span-5">File</div>
                        <div className="col-span-2 hidden sm:block">Bank</div>
                        <div className="col-span-2 text-center">Pages</div>
                        <div className="col-span-2 text-center">Txns</div>
                        <div className="col-span-1 text-right hidden sm:block">Date</div>
                      </div>
                      <div className="divide-y divide-slate-100">
                        {recentLogs.slice(0, 5).map(log => (
                          <div key={log.id} className="grid grid-cols-12 items-center gap-2 px-5 py-3.5 hover:bg-slate-50/60 transition-colors">
                            <div className="col-span-5 flex items-center gap-3 min-w-0">
                              <div className="w-8 h-8 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
                                <FileText size={14} className="text-blue-500" />
                              </div>
                              <div className="min-w-0">
                                <p className="text-sm font-semibold text-slate-800 truncate">{log.fileName}</p>
                                <div className="flex gap-1 mt-0.5">
                                  {log.exportFormats.slice(0, 2).map(f => (
                                    <span key={f} className="text-[9px] font-bold px-1.5 py-0.5 rounded-md bg-slate-100 text-slate-500 uppercase">{f}</span>
                                  ))}
                                </div>
                              </div>
                            </div>
                            <div className="col-span-2 hidden sm:block">
                              <span className="text-xs text-slate-500 truncate">{log.bankName ?? "—"}</span>
                            </div>
                            <div className="col-span-2 text-center">
                              <span className="text-sm font-semibold text-slate-700">{log.pageCount}</span>
                            </div>
                            <div className="col-span-2 text-center">
                              <span
                                className="text-sm font-bold px-2 py-0.5 rounded-lg"
                                style={{ background: "#f0fdf4", color: "#059669" }}
                              >
                                {log.transactionCount}
                              </span>
                            </div>
                            <div className="col-span-1 text-right hidden sm:block">
                              <span className="text-xs text-slate-400">
                                {new Date(log.createdAt).toLocaleDateString("en-IN", { month: "short", day: "numeric" })}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                      {recentLogs.length > 5 && (
                        <div className="px-5 py-3 border-t border-slate-100 text-center">
                          <button onClick={() => setTab("history")} className="text-xs font-semibold text-navy hover:text-navy/80 transition-colors">
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
                  <div className="bg-white rounded-2xl border border-slate-200/70 shadow-sm p-5">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Current Plan</p>
                        <p className="text-xl font-black text-slate-900">{billing.tier}</p>
                      </div>
                      <span className={`text-[11px] font-bold px-2.5 py-1 rounded-lg ${
                        billing.tier === "BUSINESS" ? "bg-blue-100 text-blue-700" :
                        billing.tier === "PRO"      ? "bg-violet-100 text-violet-700" :
                        "bg-slate-100 text-slate-600"
                      }`}>
                        {billing.tier === "FREE" ? "Free forever" : "Active"}
                      </span>
                    </div>

                    {isBusinessOrPro ? (
                      <div className="flex items-center gap-4">
                        <div className="relative w-16 h-16 shrink-0">
                          <svg width="64" height="64" viewBox="0 0 64 64" className="-rotate-90">
                            <circle cx="32" cy="32" r={RING_R} fill="none" stroke="#f1f5f9" strokeWidth="8" />
                            <circle
                              cx="32" cy="32" r={RING_R} fill="none"
                              stroke={usagePercent > 80 ? "#ef4444" : "#1A47C8"}
                              strokeWidth="8" strokeLinecap="round"
                              strokeDasharray={RING_C}
                              strokeDashoffset={RING_C * (1 - usagePercent / 100)}
                              className="transition-all duration-700"
                            />
                          </svg>
                          <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-xs font-black text-slate-900">{usagePercent}%</span>
                          </div>
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-bold text-slate-800">{billing.monthlyPageLimit - billing.pagesUsedThisPeriod} pages left</p>
                          <p className="text-xs text-slate-400 mt-0.5">{billing.pagesUsedThisPeriod} of {billing.monthlyPageLimit} used</p>
                          <p className="text-xs text-slate-400">Resets next month</p>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-1.5 mb-4">
                        {["8 pages free, forever", "CSV & Excel export", "All Indian banks"].map(f => (
                          <div key={f} className="flex items-center gap-2">
                            <CheckCircle2 size={12} className="text-emerald-500 shrink-0" />
                            <span className="text-xs text-slate-500">{f}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {billing.tier === "FREE" && (
                      <button
                        onClick={() => setTab("billing")}
                        className="mt-4 w-full py-2.5 rounded-xl text-sm font-bold text-white transition-all hover:-translate-y-0.5"
                        style={{ background: "linear-gradient(135deg,#1A47C8,#3b6ef5)", boxShadow: "0 4px 14px rgba(26,71,200,0.30)" }}
                      >
                        Upgrade to Pro →
                      </button>
                    )}
                    {billing.tier === "PRO" && (
                      <button
                        onClick={() => setTab("billing")}
                        className="mt-4 w-full py-2 rounded-xl text-xs font-semibold text-slate-500 border border-slate-200 hover:border-slate-300 transition-colors"
                      >
                        Manage plan
                      </button>
                    )}
                  </div>

                  {/* Quick actions */}
                  <div className="bg-white rounded-2xl border border-slate-200/70 shadow-sm p-4">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-3">Quick Actions</p>
                    <div className="space-y-0.5">
                      {[
                        { label: "Convert a statement", Icon: Upload,     dest: "upload" as Tab,   color: "#f97316", bg: "#fff7ed" },
                        { label: "View history",         Icon: History,    dest: "history" as Tab,  color: "#3b82f6", bg: "#eff6ff" },
                        { label: "Manage billing",       Icon: CreditCard, dest: "billing" as Tab,  color: "#8b5cf6", bg: "#f5f3ff" },
                        { label: "Account settings",     Icon: Settings,   dest: "settings" as Tab, color: "#64748b", bg: "#f8fafc" },
                      ].map(({ label, Icon, dest, color, bg }) => (
                        <button
                          key={label}
                          onClick={() => setTab(dest)}
                          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-50 transition-colors group text-left"
                        >
                          <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0" style={{ background: bg }}>
                            <Icon size={13} style={{ color }} />
                          </div>
                          <span className="text-sm font-medium text-slate-600 group-hover:text-slate-900 flex-1">{label}</span>
                          <ChevronRight size={12} className="text-slate-300 group-hover:text-slate-500 transition-colors" />
                        </button>
                      ))}
                    </div>
                  </div>

                  {billing.tier === "FREE" && (
                    <div className="rounded-2xl p-5 relative overflow-hidden" style={{ background: "linear-gradient(135deg,#0f1f5c 0%,#1A47C8 100%)" }}>
                      <div className="absolute top-0 right-0 w-24 h-24 rounded-full opacity-10" style={{ background: "radial-gradient(circle,white,transparent)", transform: "translate(30%,-30%)" }} />
                      <p className="text-sm font-bold text-white mb-1">Go Pro — 500 pages/mo</p>
                      <p className="text-xs text-white/60 mb-4">All formats, Google Sheets, priority processing</p>
                      <button
                        onClick={() => setTab("billing")}
                        className="w-full py-2.5 rounded-xl text-sm font-bold text-navy bg-white hover:bg-white/90 transition-colors"
                      >
                        See plans →
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ═══ UPLOAD ════════════════════════════════════════ */}
          {tab === "upload" && (
            <div className="flex flex-col h-full">
              <PageBanner
                icon={Upload}
                title="Convert Statement"
                subtitle="Upload a bank PDF and download structured data in seconds"
                iconColor="#f97316"
                iconBg="#fff7ed"
                action={
                  /* Mode toggle — lives in the banner action slot */
                  <div className="flex items-center gap-1 bg-slate-100 border border-slate-200 rounded-xl p-1">
                    {(["single", "bulk"] as const).map(m => (
                      <button
                        key={m}
                        onClick={() => setUploadMode(m)}
                        className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition-all whitespace-nowrap ${
                          uploadMode === m ? "bg-white text-navy shadow-sm" : "text-slate-500 hover:text-slate-700"
                        }`}
                      >
                        {m === "single" ? t("singleFile") : t("bulkUpload")}
                      </button>
                    ))}
                  </div>
                }
              />
              {/* No padding — UploadCard fills the remaining height */}
              <div className="flex-1 min-h-0 flex flex-col">
                {uploadMode === "single"
                  ? <UploadCard billing={billing} onBillingUpdate={refreshBilling} userEmail={userEmail} hasSheetsAccess={hasSheetsAccess} />
                  : <BulkUploadCard billing={billing} onBillingUpdate={refreshBilling} />
                }
              </div>
            </div>
          )}

          {/* ═══ HISTORY ═══════════════════════════════════════ */}
          {tab === "history" && (
            <div className="flex flex-col h-full">
              <PageBanner
                icon={History}
                title="Conversion History"
                subtitle="All your past statements and downloaded files"
                iconColor="#3b82f6"
                iconBg="#eff6ff"
                action={
                  recentLogs.length > 0 ? (
                    <span className="text-xs font-semibold text-slate-500 bg-white border border-slate-200 px-3 py-1.5 rounded-xl">
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

          {/* ═══ QUEUE ════════════════════════════════════════ */}
          {tab === "queue" && (
            <div className="flex flex-col h-full">
              <PageBanner
                icon={Layers}
                title="Processing Queue"
                subtitle="Batch jobs and queued conversions"
                iconColor="#8b5cf6"
                iconBg="#f5f3ff"
              />
              <div className="p-5 lg:p-8">
                <QueuePanel userEmail={userEmail} tier={billing.tier} />
              </div>
            </div>
          )}

          {/* ═══ BILLING ══════════════════════════════════════ */}
          {tab === "billing" && (
            <div className="flex flex-col h-full">
              <PageBanner
                icon={CreditCard}
                title="Billing & Plans"
                subtitle="Manage your subscription and payment methods"
                iconColor="#1A47C8"
                iconBg="#eff6ff"
                action={
                  <span className={`text-xs font-bold px-3 py-1.5 rounded-xl ${
                    billing.tier === "BUSINESS" ? "bg-blue-100 text-blue-700" :
                    billing.tier === "PRO"      ? "bg-violet-100 text-violet-700" :
                    "bg-slate-100 text-slate-600"
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

          {/* ═══ PORTALS ══════════════════════════════════════ */}
          {tab === "portals" && (
            <div className="flex flex-col h-full">
              <PageBanner
                icon={Link2}
                title="Quick Portals"
                subtitle="Direct links to bank netbanking and statement pages"
                iconColor="#0891b2"
                iconBg="#ecfeff"
              />
              <div className="p-5 lg:p-8">
                <PortalsPanel />
              </div>
            </div>
          )}

          {/* ═══ TEAM ════════════════════════════════════════ */}
          {tab === "team" && (
            <div className="flex flex-col h-full">
              <PageBanner
                icon={Users}
                title="Team Management"
                subtitle="Invite members and manage your Business workspace"
                iconColor="#059669"
                iconBg="#f0fdf4"
              />
              <div className="p-5 lg:p-8">
                <TeamPanel tier={billing.tier} userEmail={userEmail} />
              </div>
            </div>
          )}

          {/* ═══ SETTINGS ════════════════════════════════════ */}
          {tab === "settings" && (
            <div className="flex flex-col h-full">
              <PageBanner
                icon={Settings}
                title="Account Settings"
                subtitle="Update your profile, email preferences and security"
                iconColor="#64748b"
                iconBg="#f8fafc"
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

      {/* ── MOBILE BOTTOM NAV ──────────────────────────────── */}
      <nav className="lg:hidden fixed bottom-0 inset-x-0 bg-white border-t border-slate-200 z-20 flex">
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
                active ? "text-navy" : "text-slate-400 hover:text-slate-600"
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
