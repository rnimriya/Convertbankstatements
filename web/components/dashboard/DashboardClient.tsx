"use client";

import { useState, useCallback } from"react";
import { useRouter } from "next/navigation";
import { useTranslations } from"next-intl";
import { Link } from"@/i18n/navigation";
import { UploadCard } from"@/components/upload/UploadCard";
import { BulkUploadCard } from"@/components/upload/BulkUploadCard";
import { UsageHistory } from"@/components/dashboard/UsageHistory";
import { PricingSection } from"@/components/dashboard/PricingSection";
import { PortalsPanel } from"@/components/dashboard/PortalsPanel";
import { TeamPanel } from"@/components/dashboard/TeamPanel";
import { AccountSettings } from"@/components/dashboard/AccountSettings";
import { CategoryRulesPanel } from"@/components/dashboard/CategoryRulesPanel";
import { QuickBooksPanel } from"@/components/dashboard/QuickBooksPanel";
import { QueuePanel } from"@/components/dashboard/QueuePanel";
import type { BillingContext } from"@/types/billing";
import {
  Upload, History, CreditCard, LogOut, Link2, Users, Settings,
  FileText, Menu, X, Layers, CheckCircle2, AlertTriangle,
  LayoutDashboard, TrendingUp, Clock, Zap, ChevronRight, ArrowUpRight, Search,
} from"lucide-react";

type Tab ="home" |"upload" |"history" |"billing" |"portals" |"team" |"settings" |"queue";

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
    <div className="shrink-0 px-5 sm:px-6 lg:px-8 pt-6 pb-1">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center shrink-0 bg-pine-100">
            <Icon size={18} className="text-pine-700" />
          </div>
          <div>
            <h2 className="text-lg sm:text-[22px] font-black text-brand-text leading-tight tracking-tight">{title}</h2>
            <p className="text-[12px] sm:text-[13px] text-brand-muted mt-0.5 hidden sm:block">{subtitle}</p>
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
  const [uploadMode, setUploadMode] = useState<"single" |"bulk">("single");
  const [billing, setBilling] = useState(initialBilling);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [verificationSent, setVerificationSent] = useState(false);
  const [sendingVerification, setSendingVerification] = useState(false);
  const [verificationError, setVerificationError] = useState<string | null>(null);

  const router = useRouter();
  const refreshBilling = useCallback(async () => {
    try {
      const res = await fetch("/api/billing-context");
      if (res.ok) setBilling(await res.json());
    } catch { /* non-fatal */ }
    // recentLogs is a server-rendered prop: refresh so the History tab and
    // Overview counts include conversions finished in this session.
    router.refresh();
  }, [router]);

  const handleSignOut = async () => {
    try { await fetch("/api/auth/logout", { method:"POST" }); } catch { /* ignore */ }
    window.location.href ="/login";
  };

  const sendVerificationEmail = async () => {
    setSendingVerification(true);
    setVerificationError(null);
    try {
      const res = await fetch("/api/auth/send-verification", { method:"POST" });
      if (res.ok) {
        setVerificationSent(true);
      } else {
        const data = (await res.json().catch(() => null)) as { error?: string } | null;
        setVerificationError(data?.error ?? "We couldn't send the verification email right now. Please try again later.");
      }
    } catch {
      setVerificationError("We couldn't send the verification email right now. Please try again later.");
    } finally { setSendingVerification(false); }
  };

  const displayName = userName ?? userEmail.split("@")[0];
  const initial = displayName[0]?.toUpperCase();
  const isPaid = billing.tier !=="FREE"; // Basic / Pro / Business all have a monthly quota
  const isBusiness = billing.tier ==="BUSINESS";

  const usagePercent = billing.monthlyPageLimit > 0
    ? Math.min(100, Math.round((billing.pagesUsedThisPeriod / billing.monthlyPageLimit) * 100))
    : 0;

  const totalDocs = recentLogs.length;
  const totalPages = recentLogs.reduce((s, l) => s + l.pageCount, 0);
  const totalTxns = recentLogs.reduce((s, l) => s + l.transactionCount, 0);

  const navSections = [
    {
      label:"Workspace",
      items: [
        { id:"home" as Tab,    label:"Overview",  Icon: LayoutDashboard },
        { id:"upload" as Tab,  label:"Convert",   Icon: Upload },
        { id:"history" as Tab, label:"History",   Icon: History },
        { id:"queue" as Tab,   label:"Queue",     Icon: Layers },
      ],
    },
    {
      label:"Account",
      items: [
        { id:"billing" as Tab,  label:"Billing",  Icon: CreditCard },
        ...(isBusiness ? [{ id:"team" as Tab, label:"Team", Icon: Users }] : []),
        { id:"settings" as Tab, label:"Settings", Icon: Settings },
      ],
    },
    {
      label:"Tools",
      items: [
        { id:"portals" as Tab, label:"Portals", Icon: Link2 },
      ],
    },
  ];

  return (
    <div className="flex h-screen overflow-hidden bg-[#F7F7FA]">

      {/* ── SIDEBAR OVERLAY (mobile) ─────────────────────────── */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/40 z-20 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* ── SIDEBAR ─────────────────────────────────────────── */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-30 w-[264px] flex flex-col bg-brand-surface border-r border-brand-border/80 transition-transform duration-200 lg:translate-x-0 ${sidebarOpen ?"translate-x-0" :"-translate-x-full"}`}
      >
        {/* Logo */}
        <div className="flex items-center gap-2.5 px-5 py-[18px] border-b border-zinc-100 dark:border-zinc-800">
          <a href="/" className="flex items-center gap-2.5">
            <img src="/logo.svg" alt="Convert Statement" className="h-8 w-8" />
            <span className="font-display font-bold text-brand-text text-[16px] tracking-tight">Convert<span className="text-pine-600">Statement</span></span>
          </a>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto px-3 py-2 space-y-4">
          {navSections.map(section => (
            <div key={section.label}>
              <p className="px-3 mb-1 text-[9px] font-bold uppercase tracking-[0.16em] text-brand-muted">
                {section.label}
              </p>
              <div className="space-y-0.5">
                {section.items.map(({ id, label, Icon }) => {
                  const active = tab === id;
                  return (
                    <button
                      key={id}
                      onClick={() => { setTab(id); setSidebarOpen(false); }}
                      className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-[13.5px] font-semibold transition-all text-left group ${
                        active
                          ?"bg-pine-100 text-pine-700"
                          :"text-brand-muted hover:bg-zinc-50 hover:text-brand-text"
                      }`}
                    >
                      <Icon
                        size={16}
                        className={`shrink-0 transition-colors ${active ?"text-pine-600" :"text-brand-muted group-hover:text-brand-text"}`}
                      />
                      <span className="flex-1 truncate">{label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Plan card + user (bottom, per approved layout) */}
        <div className="px-3 pb-2 space-y-3">
          {(!emailVerified || verificationSent) && (
            <div className="flex items-center gap-2">
              {!emailVerified && !verificationSent && (
                <span className="w-full text-[10px] font-semibold px-2 py-1.5 rounded-lg bg-amber-50 border border-amber-100 text-amber-700 flex items-center justify-center gap-1.5">
                  <AlertTriangle size={10} /> Email unverified
                </span>
              )}
              {verificationSent && (
                <span className="w-full text-[10px] font-semibold px-2 py-1.5 rounded-lg bg-pine-50 border border-pine-100 text-pine-700 flex items-center justify-center gap-1.5">
                  <CheckCircle2 size={10} /> Verification sent
                </span>
              )}
            </div>
          )}

          <div className="rounded-2xl bg-[#0B1F16] text-white p-4">
            <div className="flex items-center justify-between gap-2">
              <p className="text-[14px] font-bold capitalize">{billing.tier.toLowerCase()} plan</p>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/10 text-white/80 uppercase tracking-wider">
                {billing.tier === "FREE" ? "Free" : "Active"}
              </span>
            </div>
            <p className="text-[12px] text-white/60 mt-1">
              {Math.max(0, billing.monthlyPageLimit - billing.pagesUsedThisPeriod)} of {billing.monthlyPageLimit} pages left this period
            </p>
            <div className="h-1.5 w-full bg-white/15 rounded-full overflow-hidden mt-3">
              <div
                className="h-full rounded-full transition-all duration-700 ease-out"
                style={{ width: `${usagePercent}%`, background: usagePercent > 80 ? "#ef4444" : "linear-gradient(90deg, #007A33, #2CA01C)" }}
              />
            </div>
            <button
              onClick={() => setTab("billing")}
              className="mt-3.5 w-full py-2 rounded-full text-[13px] font-bold bg-white text-[#0B1F16] hover:bg-pine-100 transition-colors"
            >
              {billing.tier === "FREE" ? "Upgrade plan" : "Manage plan"}
            </button>
          </div>

          <div className="flex items-center gap-2.5 px-1.5 py-1">
            <div className="h-9 w-9 rounded-full flex items-center justify-center text-[13px] font-black bg-[#2CA01C] text-white shrink-0">
              {initial}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[13px] font-bold text-brand-text truncate tracking-tight">{displayName}</p>
              <p className="text-[11px] text-brand-muted truncate">{userEmail}</p>
            </div>
          </div>
        </div>

        {/* Sign out */}
        <div className="p-3 border-t border-zinc-100 dark:border-zinc-800">
          <button
            onClick={handleSignOut}
            className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-[20px] text-[13px] font-medium text-brand-muted hover:bg-red-50 hover:text-red-600 transition-all"
          >
            <LogOut className="text-rose-500 dark:text-rose-400"  size={14} />
            {isDemo ? t("goHome") : t("signOut")}
          </button>
        </div>
      </aside>

      {/* ── RIGHT PANEL ─────────────────────────────────────── */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">

        {/* Top bar */}
        <header className="flex items-center gap-3 px-4 lg:px-6 py-3 bg-brand-surface border-b border-brand-border shrink-0">
          <button
            className="lg:hidden flex items-center justify-center w-8 h-8 rounded-lg hover:bg-brand-surface transition-colors shrink-0"
            onClick={() => setSidebarOpen(v => !v)}
            aria-label="Toggle sidebar"
          >
            {sidebarOpen ? <X className="text-rose-500 dark:text-rose-400"  size={17} /> : <Menu className="text-pine-500 dark:text-pine-400"  size={17} />}
          </button>
          <a href="/" className="lg:hidden shrink-0">
            <img src="/logo.svg" alt="" className="h-7 w-7" />
          </a>
          <button
            onClick={() => setTab("history")}
            className="hidden md:flex items-center gap-2 flex-1 max-w-[340px] bg-white border border-[#EBEBF0] rounded-full px-4 py-2 text-[13px] text-brand-muted hover:border-pine-300 transition-colors"
          >
            <Search size={14} className="shrink-0" />
            <span className="truncate">Search conversions, files…</span>
          </button>
          <div className="flex-1 min-w-0" />
          <div className="flex items-center gap-2 shrink-0">
            <span className="hidden sm:inline-flex items-center gap-1.5 bg-pine-50 border border-pine-100 text-pine-700 text-[12.5px] font-semibold rounded-full px-3 py-1.5">
              <b className="font-black">{Math.max(0, billing.monthlyPageLimit - billing.pagesUsedThisPeriod)}</b> pages left
            </span>
            {tab !=="upload" && (
              <button
                onClick={() => setTab("upload")}
                className="flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-bold bg-[#2CA01C] text-white hover:bg-[#238a17] transition-colors"
              >
                <Upload size={13} />
                <span className="hidden sm:inline">Convert</span>
              </button>
            )}
            <div className="flex items-center gap-2 bg-brand-surface border border-brand-border rounded-full pl-1 pr-2 sm:pr-3 py-1">
              <div
                className="h-6 w-6 rounded-full flex items-center justify-center text-[10px] font-black bg-[#2CA01C] text-white shrink-0"
              >
                {initial}
              </div>
              <span className="text-sm text-brand-muted font-medium truncate hidden sm:block max-w-[120px]">{displayName}</span>
            </div>
          </div>
        </header>

        {/* System banners */}
        {isDemo && (
          <div className="bg-amber-50 dark:bg-amber-500/10 border-b border-amber-200 dark:border-amber-500/20 py-2 text-center text-sm text-amber-800 dark:text-amber-200 px-4 shrink-0">
            Demo mode —{""}
            <Link href="/signup" className="font-bold underline hover:no-underline">Sign up free</Link>{""}
            to save history and unlock full features.
          </div>
        )}
        {!emailVerified && !isDemo && (
          <div className="bg-brand-surface border-b border-brand-border px-6 py-2.5 flex items-center gap-3 flex-wrap shrink-0">
            <AlertTriangle size={14} className="dark:shrink-0 text-amber-500 dark:text-amber-400" />
            <p className="text-sm text-brand-text flex-1">Please verify your email to unlock all features.</p>
            {verificationSent ? (
              <span className="text-sm font-medium text-pine-600 flex items-center gap-1">
                <CheckCircle2 className="text-pine-500 dark:text-pine-400"  size={13} /> Check your inbox
              </span>
            ) : (
              <>
                {verificationError && (
                  <span className="text-sm font-medium text-red-600 dark:text-red-400">{verificationError}</span>
                )}
                <button
                  onClick={sendVerificationEmail}
                  disabled={sendingVerification}
                  className="text-sm font-semibold text-amber-700 underline hover:no-underline disabled:opacity-50"
                >
                  {sendingVerification ?"Sending…" :"Resend link"}
                </button>
              </>
            )}
          </div>
        )}

        {/* ── PAGE CONTENT ─────────────────────────────────── */}
        <main className="flex-1 overflow-y-auto pb-20 lg:pb-0">

          {/* ═══ HOME / OVERVIEW ═══════════════════════════════ */}
          {tab ==="home" && (
            <div className="p-5 lg:p-7 space-y-5 max-w-[1400px]">

              {/* Greeting header */}
              <div className="flex items-end justify-between gap-4 flex-wrap px-1 pt-1">
                <div>
                  <p className="text-brand-muted text-xs font-medium mb-1">
                    {new Date().toLocaleDateString("en-IN", { weekday:"long", month:"long", day:"numeric" })}
                  </p>
                  <h2 className="text-[24px] lg:text-[28px] font-black text-brand-text leading-tight tracking-tight">
                    {(() => { const h = new Date().getHours(); return h < 12 ? "Good morning" : h < 17 ? "Good afternoon" : "Good evening"; })()}, {displayName}
                  </h2>
                  <p className="text-brand-muted text-sm mt-1">Here&apos;s what&apos;s happening with your conversions.</p>
                </div>
                <button
                  onClick={() => setTab("upload")}
                  className="shrink-0 flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold bg-[#2CA01C] text-white hover:bg-[#238a17] transition-colors"
                >
                  <Upload size={14} />
                  New conversion
                </button>
              </div>

              {/* ── STATS ── */}
              <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
                {[
                  {
                    label:"Docs Converted",
                    value: String(totalDocs),
                    sub: totalDocs === 0 ?"No files yet" : `${totalDocs} file${totalDocs !== 1 ?"s" :""} converted`,
                    Icon: FileText,
                  },
                  {
                    label:"Pages Processed",
                    value: billing.pagesUsedThisPeriod.toLocaleString("en-IN"),
                    sub: billing.pagesUsedThisPeriod === 0
                      ?"No pages yet"
                      : `of ${billing.monthlyPageLimit} ${isPaid ?"this period" :"free"}`,
                    Icon: TrendingUp,
                  },
                  {
                    label:"Transactions",
                    value: totalTxns.toLocaleString("en-IN"),
                    sub: totalTxns > 0 ?"Auto-extracted" :"Upload to start",
                    Icon: Zap,
                  },
                  {
                    label:"Plan Usage",
                    value: isPaid ? `${usagePercent}%` : billing.tier,
                    sub: isPaid
                      ? `${billing.pagesUsedThisPeriod} / ${billing.monthlyPageLimit} pages used`
                      : billing.tier ==="FREE"
                        ? `${Math.max(0, billing.monthlyPageLimit - billing.pagesUsedThisPeriod)} of ${billing.monthlyPageLimit} pages left`
                        :"Pay per doc",
                    Icon: Clock,
                  },
                ].map(card => (
                  <div key={card.label} className="bg-white rounded-[20px] border border-[#EBEBF0] shadow-[0_1px_2px_rgba(16,24,40,0.04)] p-5 relative overflow-hidden group hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-3">
                      <p className="text-[13px] font-semibold text-brand-muted">{card.label}</p>
                      <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-pine-50">
                        <card.Icon size={16} className="text-pine-600" />
                      </div>
                    </div>
                    <p className="text-[26px] lg:text-[30px] font-black text-brand-text tracking-tight leading-none">{card.value}</p>
                    <p className="text-xs text-brand-muted mt-2">{card.sub}</p>
                  </div>
                ))}
              </div>

              {/* ── MID SECTION ── */}
              <div className="grid xl:grid-cols-3 gap-5">

                {/* Recent conversions */}
                <div className="xl:col-span-2 bg-white rounded-[20px] border border-[#EBEBF0] shadow-[0_1px_2px_rgba(16,24,40,0.04)] overflow-hidden">
                  <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-100 dark:border-zinc-800">
                    <div>
                      <h3 className="text-sm font-bold text-brand-text">Recent Conversions</h3>
                      <p className="text-xs text-brand-muted mt-0.5">
                        {recentLogs.length === 0 ?"No documents yet" : `Last ${Math.min(5, recentLogs.length)} processed`}
                      </p>
                    </div>
                    {recentLogs.length > 5 && (
                      <button
                        onClick={() => setTab("history")}
                        className="flex items-center gap-1 text-xs font-semibold text-brand-text hover:text-brand-text/80 transition-colors"
                      >
                        View all <ArrowUpRight className="text-pine-500 dark:text-pine-400"  size={12} />
                      </button>
                    )}
                  </div>

                  {recentLogs.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
                      <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4 bg-pine-50">
                        <FileText size={24} className="text-pine-600" />
                      </div>
                      <p className="font-bold text-brand-text text-base">No documents yet</p>
                      <p className="text-sm text-brand-muted mt-1 max-w-xs">
                        Upload your first bank statement PDF to get started.
                      </p>
                      <button
                        onClick={() => setTab("upload")}
                        className="mt-5 px-6 py-2.5 rounded-full text-sm font-bold bg-[#2CA01C] text-white hover:bg-[#238a17] transition-colors"
                      >
                        Convert your first statement →
                      </button>
                    </div>
                  ) : (
                    <div>
                      <div className="grid grid-cols-12 px-5 py-2.5 bg-brand-surface border-b border-brand-border text-[10px] font-bold uppercase tracking-widest text-brand-muted">
                        <div className="col-span-5">File</div>
                        <div className="col-span-2 hidden sm:block">Bank</div>
                        <div className="col-span-2 text-center">Pages</div>
                        <div className="col-span-2 text-center">Txns</div>
                        <div className="col-span-1 text-right hidden sm:block">Date</div>
                      </div>
                      <div className="divide-y divide-zinc-200 dark:divide-zinc-800">
                        {recentLogs.slice(0, 5).map(log => (
                          <div key={log.id} className="grid grid-cols-12 items-center gap-2 px-5 py-3.5 hover:bg-brand-surface/60 transition-colors">
                            <div className="col-span-5 flex items-center gap-3 min-w-0">
                              <div className="w-8 h-8 rounded-lg bg-pine-50 flex items-center justify-center shrink-0">
                                <FileText size={14} className="text-pine-600" />
                              </div>
                              <div className="min-w-0">
                                <p className="text-sm font-semibold text-brand-text truncate">{log.fileName}</p>
                                <div className="flex gap-1 mt-0.5">
                                  {log.exportFormats.slice(0, 2).map(f => (
                                    <span key={f} className="text-[9px] font-bold px-1.5 py-0.5 rounded-md bg-brand-surface text-brand-muted uppercase">{f}</span>
                                  ))}
                                </div>
                              </div>
                            </div>
                            <div className="col-span-2 hidden sm:block">
                              <span className="text-xs text-brand-muted truncate">{log.bankName ??"—"}</span>
                            </div>
                            <div className="col-span-2 text-center">
                              <span className="text-sm font-semibold text-brand-text">{log.pageCount}</span>
                            </div>
                            <div className="col-span-2 text-center">
                              <span
                                className="text-sm font-bold px-2 py-0.5 rounded-lg bg-zinc-100 text-zinc-900 dark:bg-zinc-800 dark:text-zinc-100"
                              >
                                {log.transactionCount}
                              </span>
                            </div>
                            <div className="col-span-1 text-right hidden sm:block">
                              <span className="text-xs text-brand-muted">
                                {new Date(log.createdAt).toLocaleDateString("en-IN", { month:"short", day:"numeric" })}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                      {recentLogs.length > 5 && (
                        <div className="px-5 py-3 border-t border-zinc-100 dark:border-zinc-800 text-center">
                          <button onClick={() => setTab("history")} className="text-xs font-semibold text-brand-text hover:text-brand-text/80 transition-colors">
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
                  <div className="bg-white rounded-[20px] border border-[#EBEBF0] shadow-[0_1px_2px_rgba(16,24,40,0.04)] p-5">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-brand-muted mb-1">Current Plan</p>
                        <p className="text-xl font-black text-brand-text">{billing.tier}</p>
                      </div>
                      <span className={`text-[11px] font-bold px-2.5 py-1 rounded-lg ${
                        billing.tier ==="BUSINESS" ?"bg-pine-100 text-pine-700" :
                        billing.tier ==="PRO"      ?"bg-pine-100 text-pine-700" :
                        billing.tier ==="BASIC"    ?"bg-pine-100 text-pine-700" :"bg-brand-surface text-brand-muted"
                      }`}>
                        {billing.tier ==="FREE" ?"Free forever" :"Active"}
                      </span>
                    </div>

                    {isPaid ? (
                      <div className="flex items-center gap-4">
                        <div className="relative w-16 h-16 shrink-0">
                          <svg width="64" height="64" viewBox="0 0 64 64" className="-rotate-90">
                            <circle cx="32" cy="32" r={RING_R} fill="none" className="stroke-zinc-100 dark:stroke-zinc-800" strokeWidth="8" />
                            <circle
                              cx="32" cy="32" r={RING_R} fill="none"
                              stroke={usagePercent > 80 ?"#ef4444" :"currentColor"}
                              strokeWidth="8" strokeLinecap="round"
                              strokeDasharray={RING_C}
                              strokeDashoffset={RING_C * (1 - usagePercent / 100)}
                              className="transition-all duration-700 text-[#2CA01C]"
                            />
                          </svg>
                          <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-xs font-black text-brand-text">{usagePercent}%</span>
                          </div>
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-bold text-brand-text">{billing.monthlyPageLimit - billing.pagesUsedThisPeriod} pages left</p>
                          <p className="text-xs text-brand-muted mt-0.5">{billing.pagesUsedThisPeriod} of {billing.monthlyPageLimit} used</p>
                          <p className="text-xs text-brand-muted">Resets next month</p>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-1.5 mb-4">
                        {["8 pages free, forever","CSV & Excel export","Global banks support"].map(f => (
                          <div key={f} className="flex items-center gap-2">
                            <CheckCircle2 size={12} className="text-pine-500 shrink-0 text-pine-500 dark:text-pine-400" />
                            <span className="text-xs text-brand-muted">{f}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {billing.tier ==="FREE" && (
                      <button
                        onClick={() => setTab("billing")}
                        className="mt-4 w-full py-2.5 rounded-full text-sm font-bold bg-[#2CA01C] text-white hover:bg-[#238a17] transition-colors"
                      >
                        Upgrade to Pro →
                      </button>
                    )}
                    {billing.tier ==="PRO" && (
                      <button
                        onClick={() => setTab("billing")}
                        className="mt-4 w-full py-2 rounded-[20px] text-xs font-semibold text-brand-muted border border-brand-border hover:border-brand-border transition-colors"
                      >
                        Manage plan
                      </button>
                    )}
                  </div>

                  {/* Quick actions */}
                  <div className="bg-white rounded-[20px] border border-[#EBEBF0] shadow-[0_1px_2px_rgba(16,24,40,0.04)] p-4">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-brand-muted mb-3">Quick Actions</p>
                    <div className="space-y-0.5">
                      {[
                        { label:"Convert a statement", Icon: Upload,     dest:"upload" as Tab },
                        { label:"View history",         Icon: History,    dest:"history" as Tab },
                        { label:"Manage billing",       Icon: CreditCard, dest:"billing" as Tab },
                        { label:"Account settings",     Icon: Settings,   dest:"settings" as Tab },
                      ].map(({ label, Icon, dest }) => (
                        <button
                          key={label}
                          onClick={() => setTab(dest)}
                          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-[20px] hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors group text-left"
                        >
                          <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 bg-pine-50">
                            <Icon size={13} className="text-pine-600" />
                          </div>
                          <span className="text-sm font-medium text-brand-muted group-hover:text-zinc-900 dark:group-hover:text-zinc-100 flex-1">{label}</span>
                          <ChevronRight size={12} className="group-hover:dark:transition-colors text-rose-500 dark:text-rose-400" />
                        </button>
                      ))}
                    </div>
                  </div>

                  {billing.tier ==="FREE" && (
                    <div className="rounded-[20px] p-5 relative overflow-hidden bg-[#0B1F16] text-white">
                      <div className="absolute top-0 right-0 w-24 h-24 rounded-full opacity-5 bg-white dark:bg-black" style={{ transform:"translate(30%,-30%)" }} />
                      <p className="text-sm font-bold mb-1">Go Pro — 500 pages/mo</p>
                      <p className="text-xs opacity-60 mb-4">All formats, Google Sheets, priority processing</p>
                      <button
                        onClick={() => setTab("billing")}
                        className="w-full py-2.5 rounded-full text-sm font-bold bg-[#2CA01C] text-white hover:bg-[#238a17] transition-colors"
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
          {tab ==="upload" && (
            <div className="flex flex-col h-full">
              <PageBanner
                icon={Upload}
                title="Convert Statement"
                subtitle="Upload a bank PDF and download structured data in seconds"
                iconColor="#f97316"
                iconBg="#fff7ed"
                action={
                  /* Mode toggle — lives in the banner action slot */
                  <div className="flex items-center gap-1 bg-brand-surface border border-brand-border rounded-[20px] p-1">
                    {(["single","bulk"] as const).map(m => (
                      <button
                        key={m}
                        onClick={() => setUploadMode(m)}
                        className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition-all whitespace-nowrap ${
                          uploadMode === m ?"bg-brand-surface text-brand-text shadow-sm" :"text-brand-muted hover:text-brand-text"
                        }`}
                      >
                        {m ==="single" ? t("singleFile") : t("bulkUpload")}
                      </button>
                    ))}
                  </div>
                }
              />
              {/* No padding — UploadCard fills the remaining height */}
              <div className="flex-1 min-h-0 flex flex-col">
                {uploadMode ==="single" ? (
                  <UploadCard 
                    billing={billing} 
                    onBillingUpdate={refreshBilling} 
                    userEmail={userEmail} 
                    hasSheetsAccess={hasSheetsAccess}
                    fullWidth={false}
                  />
                ) : (
                  <BulkUploadCard billing={billing} onBillingUpdate={refreshBilling} />
                )}
              </div>
            </div>
          )}

          {/* ═══ HISTORY ═══════════════════════════════════════ */}
          {tab ==="history" && (
            <div className="flex flex-col h-full">
              <PageBanner
                icon={History}
                title="Conversion History"
                subtitle="All your past statements and downloaded files"
                iconColor="#3b82f6"
                iconBg="#eff6ff"
                action={
                  recentLogs.length > 0 ? (
                    <span className="text-xs font-semibold text-brand-muted bg-brand-surface border border-brand-border px-3 py-1.5 rounded-[20px]">
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
          {tab ==="queue" && (
            <div className="flex flex-col h-full">
              <PageBanner
                icon={Layers}
                title="Processing Queue"
                subtitle="Batch jobs and queued conversions"
                iconColor="#007A33"
                iconBg="#f0ffee"
              />
              <div className="p-5 lg:p-8">

                <QueuePanel userEmail={userEmail} tier={billing.tier} />
              </div>
            </div>
          )}

          {/* ═══ BILLING ══════════════════════════════════════ */}
          {tab ==="billing" && (
            <div className="flex flex-col h-full">
              <PageBanner
                icon={CreditCard}
                title="Billing & Plans"
                subtitle="Manage your subscription and payment methods"
                iconColor="#1A47C8"
                iconBg="#eff6ff"
                action={
                  <span className={`text-xs font-bold px-3 py-1.5 rounded-[20px] ${
                    billing.tier ==="BUSINESS" ?"bg-pine-100 text-pine-700" :
                    billing.tier ==="PRO"      ?"bg-pine-100 text-pine-700" :"bg-brand-surface text-brand-muted"
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
          {tab ==="portals" && (
            <div className="flex flex-col h-full">
              <PageBanner
                icon={Link2}
                title="Client Upload Portals"
                subtitle="Share a link — clients upload statements straight to your account"
                iconColor="#0891b2"
                iconBg="#ecfeff"
              />
              <div className="p-5 lg:p-8">
                <PortalsPanel />
              </div>
            </div>
          )}

          {/* ═══ TEAM ════════════════════════════════════════ */}
          {tab ==="team" && (
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
          {tab ==="settings" && (
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
                <CategoryRulesPanel />
                <QuickBooksPanel />
              </div>
            </div>
          )}

        </main>
      </div>

      {/* ── MOBILE BOTTOM NAV ──────────────────────────────── */}
      <nav className="lg:hidden fixed bottom-0 inset-x-0 bg-brand-surface border-t border-brand-border z-20 flex">
        {[
          { id:"home" as Tab,     label:"Home",    Icon: LayoutDashboard },
          { id:"upload" as Tab,   label:"Convert", Icon: Upload },
          { id:"history" as Tab,  label:"History", Icon: History },
          { id:"billing" as Tab,  label:"Billing", Icon: CreditCard },
          { id:"settings" as Tab, label:"Settings",Icon: Settings },
        ].map(({ id, label, Icon }) => {
          const active = tab === id;
          return (
            <button
              key={id}
              onClick={() => setTab(id)}
              className={`flex-1 flex flex-col items-center gap-1 py-3 text-[10px] font-semibold transition-colors ${
                active ?"text-pine-600" :"text-brand-muted hover:text-brand-text"
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
