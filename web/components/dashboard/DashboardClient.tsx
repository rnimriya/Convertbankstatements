"use client";

import { useState, useCallback, useEffect } from"react";
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
  Plus, HelpCircle,
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

const PLAN_INFO: Record<string, { price: number; annual: number; blurb: string }> = {
  FREE:     { price: 0,  annual: 0,   blurb: "8 pages free · CSV & Excel · no card needed" },
  BASIC:    { price: 5,  annual: 48,  blurb: "25 pages/mo · CSV & Excel · email support" },
  PRO:      { price: 20, annual: 192, blurb: "500 pages/mo · all formats · Google Sheets" },
  BUSINESS: { price: 75, annual: 720, blurb: "2,000 pages/mo · OCR · API · 5 seats" },
};

/* ── Shared page heading for non-overview tabs (mockup style) ── */
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
    <div className="shrink-0 px-5 sm:px-6 lg:px-8 pt-7 pb-2">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2 sm:gap-4">
        <div>
          <h2 className="text-[24px] sm:text-[27px] font-display font-bold text-brand-text leading-tight tracking-tight">{title}</h2>
          <p className="text-[13px] sm:text-sm text-brand-muted mt-1">{subtitle}</p>
        </div>
        {action && <div className="shrink-0">{action}</div>}
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
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  useEffect(() => {
    try { setAvatarUrl(localStorage.getItem("cs_avatar")); } catch { /* storage unavailable */ }
  }, [tab]);
  useEffect(() => {
    const p = new URLSearchParams(window.location.search).get("tab");
    if (p && ["home", "upload", "history", "billing", "portals", "team", "settings", "queue"].includes(p)) {
      setTab(p as Tab);
    }
  }, []);
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
  const firstName = displayName.split(" ")[0];
  const pagesLeft = Math.max(0, billing.monthlyPageLimit - billing.pagesUsedThisPeriod);
  const monthName = new Date().toLocaleDateString("en-IN", { month: "long" });
  const resetLabel = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1)
    .toLocaleDateString("en-IN", { month: "short", day: "numeric" });
  const planInfo = PLAN_INFO[billing.tier] ?? PLAN_INFO.FREE;

  const navSections = [
    {
      label:"Workspace",
      items: [
        { id:"home" as Tab,    label:"Overview",  Icon: LayoutDashboard },
        { id:"upload" as Tab,  label:"Converter", Icon: Upload },
        { id:"history" as Tab, label:"History",   Icon: History },
        { id:"queue" as Tab,   label:"Queue",     Icon: Layers },
        { id:"portals" as Tab, label:"Client Portals", Icon: Link2 },
      ],
    },
    {
      label:"Account",
      items: [
        { id:"billing" as Tab,  label:"Billing",  Icon: CreditCard },
        ...(isBusiness ? [{ id:"team" as Tab, label:"Team", Icon: Users }] : []),
        { id:"settings" as Tab, label:"Settings", Icon: Settings },
        { label:"Help & FAQ", Icon: HelpCircle, href:"/#faq" },
      ],
    },
  ];

  return (
    <div className="flex h-screen overflow-hidden bg-[#F7FAF5]">

      {/* ── SIDEBAR OVERLAY (mobile) ─────────────────────────── */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/40 z-20 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* ── SIDEBAR ─────────────────────────────────────────── */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-30 w-[264px] flex flex-col bg-[#0B1F16] transition-transform duration-200 lg:translate-x-0 ${sidebarOpen ?"translate-x-0" :"-translate-x-full"}`}
      >
        {/* Logo */}
        <div className="flex items-center gap-2.5 px-5 py-[18px] border-b border-white/10">
          <a href="/" className="flex items-center gap-2.5">
            <span className="bg-white rounded-[9px] p-[3px] flex items-center justify-center shrink-0">
              <img src="/logo.svg" alt="Convert Statement" className="h-6 w-6" />
            </span>
            <span className="font-display font-bold text-white text-[16px] tracking-tight">Convert<span className="text-[#4CC63F]">Statement</span></span>
          </a>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto px-3 py-2 space-y-4">
          {navSections.map(section => (
            <div key={section.label}>
              <p className="px-3 mb-1.5 text-[10px] font-bold uppercase tracking-[0.16em] text-white/35">
                {section.label}
              </p>
              <div className="space-y-0.5">
                {section.items.map((item) => {
                  const href = "href" in item ? item.href : undefined;
                  const id = "id" in item ? item.id : undefined;
                  const active = id !== undefined && tab === id;
                  const cls = `w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-[13.5px] font-semibold transition-all text-left group ${
                    active
                      ? "bg-[#2CA01C] text-white shadow-[0_6px_18px_rgba(44,160,28,0.35)]"
                      : "text-white/60 hover:bg-white/5 hover:text-white"
                  }`;
                  const inner = (
                    <>
                      <item.Icon
                        size={16}
                        className={`shrink-0 transition-colors ${active ? "text-white" : "text-white/50 group-hover:text-white"}`}
                      />
                      <span className="flex-1 truncate">{item.label}</span>
                    </>
                  );
                  return href ? (
                    <a key={item.label} href={href} className={cls} onClick={() => setSidebarOpen(false)}>
                      {inner}
                    </a>
                  ) : (
                    <button
                      key={item.label}
                      onClick={() => { if (id) setTab(id); setSidebarOpen(false); }}
                      className={cls}
                    >
                      {inner}
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
                <span className="w-full text-[10px] font-semibold px-2 py-1.5 rounded-lg bg-amber-400/15 border border-amber-300/25 text-amber-300 flex items-center justify-center gap-1.5">
                  <AlertTriangle size={10} /> Email unverified
                </span>
              )}
              {verificationSent && (
                <span className="w-full text-[10px] font-semibold px-2 py-1.5 rounded-lg bg-[#2CA01C]/25 border border-white/15 text-[#BFE3B8] flex items-center justify-center gap-1.5">
                  <CheckCircle2 size={10} /> Verification sent
                </span>
              )}
            </div>
          )}

          <div className="rounded-[18px] border border-white/15 bg-white/5 text-white p-4">
            <div className="flex items-center justify-between gap-2">
              <p className="text-[14px] font-bold capitalize">{billing.tier.toLowerCase()} plan</p>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/10 text-white/80 uppercase tracking-wider">
                {billing.tier === "FREE" ? "Free" : "Active"}
              </span>
            </div>
            <p className="text-[12px] text-white/60 mt-1">
              <span className="text-white font-bold">{pagesLeft}</span> of {billing.monthlyPageLimit} pages left this month
            </p>
            <div className="h-1.5 w-full bg-white/15 rounded-full overflow-hidden mt-3">
              <div
                className="h-full rounded-full transition-all duration-700 ease-out"
                style={{ width: `${usagePercent}%`, background: usagePercent > 80 ? "#ef4444" : "linear-gradient(90deg, #007A33, #2CA01C)" }}
              />
            </div>
            <button
              onClick={() => setTab("billing")}
              className="mt-3.5 w-full py-2 rounded-full text-[13px] font-bold bg-[#2CA01C] text-white hover:bg-[#238a17] transition-colors"
            >
              {billing.tier === "FREE" ? "Upgrade plan" : "Manage plan"}
            </button>
          </div>

          <div className="flex items-center gap-2.5 px-1.5 py-1">
            {avatarUrl ? (
              <img src={avatarUrl} alt="" className="h-9 w-9 rounded-full object-cover shrink-0" />
            ) : (
              <div className="h-9 w-9 rounded-full flex items-center justify-center text-[13px] font-black bg-[#2CA01C] text-white shrink-0">
                {initial}
              </div>
            )}
            <div className="min-w-0 flex-1">
              <p className="text-[13px] font-bold text-white truncate tracking-tight">{displayName}</p>
              <p className="text-[11px] text-white/45 truncate">{userEmail}</p>
            </div>
          </div>
        </div>

        {/* Sign out */}
        <div className="p-3 border-t border-white/10">
          <button
            onClick={handleSignOut}
            className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-[13px] font-medium text-white/60 hover:bg-white/5 hover:text-white transition-all"
          >
            <LogOut className="text-rose-400" size={14} />
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
            className="hidden md:flex items-center gap-2 flex-1 max-w-[470px] bg-white border border-[#E3EDE0] rounded-full px-4 py-2 text-[13px] text-brand-muted hover:border-pine-300 transition-colors"
          >
            <Search size={14} className="shrink-0" />
            <span className="truncate">Search conversions, files…</span>
          </button>
          <div className="flex-1 min-w-0" />
          <div className="flex items-center gap-2.5 shrink-0">
            <span className="hidden sm:inline-flex items-center gap-1.5 bg-[#0B1F16] text-white text-[12.5px] font-semibold rounded-full px-3.5 py-2">
              <b className="font-display font-bold text-[#4CC63F]">{pagesLeft}</b> pages left
            </span>
            <a
              href="/#faq"
              aria-label="Help and FAQ"
              className="hidden sm:flex w-[38px] h-[38px] items-center justify-center rounded-full bg-white border border-[#E3EDE0] text-[15px] font-extrabold text-brand-muted hover:text-brand-text transition-colors"
            >
              ?
            </a>
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
                  <h2 className="text-[24px] lg:text-[28px] font-display font-bold text-brand-text leading-tight tracking-tight">
                    {(() => { const h = new Date().getHours(); return h < 12 ? "Good morning" : h < 17 ? "Good afternoon" : "Good evening"; })()}, {firstName}
                  </h2>
                  <p className="text-brand-muted text-sm mt-1">Your books are up to date. Convert a statement, or pick up where you left off.</p>
                </div>
                <button
                  onClick={() => setTab("upload")}
                  className="shrink-0 flex items-center gap-1.5 px-5 py-2.5 rounded-full text-sm font-bold bg-[#0B1F16] text-white hover:opacity-90 transition-opacity"
                >
                  <Plus size={15} />
                  New conversion
                </button>
              </div>

              {/* ── STATS ── */}
              <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
                {[
                  {
                    label: `Pages used · ${monthName}`,
                    value: <>{billing.pagesUsedThisPeriod.toLocaleString("en-IN")} <span className="text-[16px] text-brand-muted font-medium">/ {billing.monthlyPageLimit}</span></>,
                    sub: <><b className="text-[#007A33]">{pagesLeft} left</b> · resets {resetLabel}</>,
                    Icon: FileText,
                  },
                  {
                    label: "Conversions",
                    value: String(totalDocs),
                    sub: totalDocs === 0 ? "No files yet" : <><b className="text-[#007A33]">{totalTxns.toLocaleString("en-IN")}</b> transactions extracted</>,
                    Icon: TrendingUp,
                  },
                  {
                    label: "Avg. convert time",
                    value: <>11 <span className="text-[16px] text-brand-muted font-medium">sec</span></>,
                    sub: "Across all banks",
                    Icon: Zap,
                  },
                  {
                    label: "Plan usage",
                    value: isPaid ? <>{usagePercent} <span className="text-[16px] text-brand-muted font-medium">%</span></> : billing.tier,
                    sub: isPaid
                      ? `${billing.pagesUsedThisPeriod} of ${billing.monthlyPageLimit} pages used`
                      : billing.tier === "FREE"
                        ? `${pagesLeft} of ${billing.monthlyPageLimit} pages left`
                        : "Pay per doc",
                    Icon: Clock,
                  },
                ].map(card => (
                  <div key={card.label} className="bg-white rounded-[24px] border border-[#E3EDE0] shadow-[0_2px_10px_rgba(11,31,22,0.04)] p-5 flex items-start gap-3.5">
                    <div className="w-[42px] h-[42px] rounded-[13px] flex items-center justify-center bg-[#E3F2DF] shrink-0">
                      <card.Icon size={20} className="text-[#007A33]" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[12.5px] font-semibold text-brand-muted">{card.label}</p>
                      <p className="text-[25px] lg:text-[27px] font-display font-bold text-brand-text tracking-tight leading-tight">{card.value}</p>
                      <p className="text-xs text-brand-muted mt-0.5">{card.sub}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* ── MID SECTION: converter + quick tools ── */}
              <div className="grid xl:grid-cols-3 gap-5">
                <div className="xl:col-span-2">
                  <UploadCard
                    billing={billing}
                    onBillingUpdate={refreshBilling}
                    userEmail={userEmail}
                    hasSheetsAccess={hasSheetsAccess}
                    fullWidth={false}
                  />
                </div>

                {/* Quick tools */}
                <div className="bg-white rounded-[24px] border border-[#E3EDE0] shadow-[0_2px_10px_rgba(11,31,22,0.04)] p-5 self-start w-full">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="text-[15px] font-display font-bold text-brand-text">Quick tools</h3>
                    <a href="/quickbooks" className="text-[13px] font-bold text-[#007A33] hover:underline">All 20 tools →</a>
                  </div>
                  {[
                    { img: "/tools/tool-duplicates.webp", label: "QBO Cleanup Checker", desc: "Scan before you import", href: "/tools/free-qbo-cleanup-checker" },
                    { img: "/tools/tool-stripe.webp", label: "Stripe to QuickBooks", desc: "Payouts, import-ready", href: "/tools/free-stripe-to-quickbooks" },
                    { img: "/tools/tool-receipt.webp", label: "Receipt to QuickBooks", desc: "Photo in, expense out", href: "/tools/free-receipt-to-quickbooks" },
                    { img: "/tools/tool-checker.webp", label: "QBO File Checker", desc: "Validate before import", href: "/tools/qbo-checker" },
                  ].map((tool, i, arr) => (
                    <a
                      key={tool.label}
                      href={tool.href}
                      className={`flex items-center gap-3 py-3 ${i < arr.length - 1 ? "border-b border-[#EFF4EC]" : ""}`}
                    >
                      <img src={tool.img} alt="" className="w-[38px] h-[38px] rounded-[11px] bg-[#F7FAF5] border border-[#E3EDE0] p-1 shrink-0" />
                      <span className="min-w-0 flex-1">
                        <span className="block text-sm font-bold text-brand-text truncate">{tool.label}</span>
                        <span className="block text-xs text-brand-muted truncate">{tool.desc}</span>
                      </span>
                      <span className="text-[13px] font-bold text-[#007A33] shrink-0">Open →</span>
                    </a>
                  ))}
                </div>
              </div>

              {/* ── RECENT CONVERSIONS ── */}
              <div className="bg-white rounded-[24px] border border-[#E3EDE0] shadow-[0_2px_10px_rgba(11,31,22,0.04)] overflow-hidden">
                <div className="flex items-center justify-between px-6 py-4">
                  <h3 className="text-[15px] font-display font-bold text-brand-text">Recent conversions</h3>
                  {recentLogs.length > 0 && (
                    <button onClick={() => setTab("history")} className="text-[13px] font-bold text-[#007A33] hover:underline">
                      View history →
                    </button>
                  )}
                </div>
                {recentLogs.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-14 px-6 text-center border-t border-[#EFF4EC]">
                    <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4 bg-[#EFF7ED]">
                      <FileText size={24} className="text-[#007A33]" />
                    </div>
                    <p className="font-display font-bold text-brand-text text-base">No documents yet</p>
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
                  <div className="overflow-x-auto">
                    <div className="min-w-[760px]">
                      <div className="grid grid-cols-12 px-6 py-2.5 bg-[#EFF7ED] text-[10.5px] font-bold uppercase tracking-[0.08em] text-[#007A33]">
                        <div className="col-span-4">File</div>
                        <div className="col-span-2">Bank</div>
                        <div className="col-span-2">Format</div>
                        <div className="col-span-1 text-center">Pages</div>
                        <div className="col-span-2 text-center">Status</div>
                        <div className="col-span-1 text-right">Date</div>
                      </div>
                      <div className="divide-y divide-[#EFF4EC]">
                        {recentLogs.slice(0, 5).map(log => (
                          <div key={log.id} className="grid grid-cols-12 items-center gap-2 px-6 py-3 hover:bg-[#F7FAF5] transition-colors">
                            <div className="col-span-4 flex items-center gap-3 min-w-0">
                              <div className="w-8 h-8 rounded-lg bg-[#EFF7ED] flex items-center justify-center shrink-0">
                                <FileText size={14} className="text-[#007A33]" />
                              </div>
                              <p className="text-sm font-semibold text-brand-text truncate">{log.fileName}</p>
                            </div>
                            <div className="col-span-2 min-w-0">
                              <span className="text-[13px] text-brand-muted truncate block">{log.bankName ?? "—"}</span>
                            </div>
                            <div className="col-span-2 flex gap-1 flex-wrap">
                              {log.exportFormats.slice(0, 2).map(f => (
                                <span key={f} className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-[#F7FAF5] border border-[#E3EDE0] text-brand-muted uppercase">{f}</span>
                              ))}
                            </div>
                            <div className="col-span-1 text-center">
                              <span className="text-sm font-semibold text-brand-text">{log.pageCount}</span>
                            </div>
                            <div className="col-span-2 text-center">
                              <span className="inline-flex items-center gap-1 text-[11.5px] font-bold px-2.5 py-1 rounded-full bg-[#E3F2DF] text-[#007A33]">
                                Done <CheckCircle2 size={11} />
                              </span>
                            </div>
                            <div className="col-span-1 text-right">
                              <span className="text-xs text-brand-muted">
                                {new Date(log.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ═══ UPLOAD ════════════════════════════════════════ */}
          {tab ==="upload" && (
            <div className="flex flex-col h-full">
              <PageBanner
                title="Converter"
                subtitle="Upload a statement, choose formats, download a clean file — under 15 seconds."
                action={
                  /* Mode toggle — lives in the banner action slot */
                  <div className="flex items-center gap-1 bg-[#EFF7ED] border border-[#E3EDE0] rounded-full p-1">
                    {(["single","bulk"] as const).map(m => (
                      <button
                        key={m}
                        onClick={() => setUploadMode(m)}
                        className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-all whitespace-nowrap ${
                          uploadMode === m ?"bg-[#0B1F16] text-white shadow-sm" :"text-brand-muted hover:text-brand-text"
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
                    variant="workspace"
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
                title="History"
                subtitle="Every conversion on your account. Files themselves are never stored — only the record."
                action={
                  recentLogs.length > 0 ? (
                    <span className="text-xs font-semibold text-brand-muted bg-brand-surface border border-[#E3EDE0] px-3 py-1.5 rounded-full">
                      {recentLogs.length} total
                    </span>
                  ) : undefined
                }
              />
              <div className="p-5 lg:p-8">
                <UsageHistory logs={recentLogs} isDemo={isDemo} billing={billing} />
              </div>
            </div>
          )}

          {/* ═══ QUEUE ════════════════════════════════════════ */}
          {tab ==="queue" && (
            <div className="flex flex-col h-full">
              <PageBanner
                title="Processing Queue"
                subtitle="Batch jobs and queued conversions"
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
                title="Billing"
                subtitle="Your plan, usage and invoices — no surprises, cancel anytime."
                action={
                  <span className={`text-xs font-bold px-3 py-1.5 rounded-full ${
                    billing.tier ==="BUSINESS" ?"bg-pine-100 text-pine-700" :
                    billing.tier ==="PRO"      ?"bg-pine-100 text-pine-700" :"bg-brand-surface text-brand-muted"
                  }`}>
                    {billing.tier} plan
                  </span>
                }
              />
              <div className="flex-1 overflow-y-auto p-5 lg:p-8">
                <div className="grid xl:grid-cols-2 gap-5 mb-6 max-w-[1400px]">
                  {/* Current plan */}
                  <div className="bg-white rounded-[24px] border border-[#E3EDE0] shadow-[0_2px_10px_rgba(11,31,22,0.04)] p-6">
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="text-[15px] font-display font-bold text-brand-text">Current plan</h3>
                      <span className="text-[10.5px] font-bold px-2.5 py-1 rounded-full bg-[#E3F2DF] text-[#007A33] uppercase tracking-wide">
                        {billing.tier}{billing.tier === "PRO" ? " · Most popular" : ""}
                      </span>
                    </div>
                    <p className="mt-4">
                      <span className="text-[38px] font-display font-bold text-brand-text leading-none">${planInfo.price}</span>
                      <span className="text-sm text-brand-muted"> / month{planInfo.annual ? ` · or $${planInfo.annual}/year` : ""}</span>
                    </p>
                    <p className="text-[13px] text-brand-muted mt-2.5">{planInfo.blurb}</p>
                    <p className="text-[13px] text-brand-muted mt-1">
                      {billing.tier === "FREE" ? "No card on file — upgrade anytime." : "Billed via Razorpay · cancel anytime."}
                    </p>
                    <div className="flex flex-wrap gap-2.5 mt-5">
                      <a href="#dash-plans" className="px-5 py-2.5 rounded-full bg-[#0B1F16] text-white text-sm font-bold hover:opacity-90 transition-opacity">
                        {billing.tier === "FREE" ? "Upgrade plan" : "Change plan"}
                      </a>
                      {billing.tier !== "FREE" && (
                        <a href="#dash-plans" className="px-5 py-2.5 rounded-full bg-white border border-[#E3EDE0] text-sm font-bold text-brand-text hover:border-[#2CA01C] transition-colors">
                          Cancel plan
                        </a>
                      )}
                    </div>
                  </div>

                  {/* Usage */}
                  <div className="bg-white rounded-[24px] border border-[#E3EDE0] shadow-[0_2px_10px_rgba(11,31,22,0.04)] p-6">
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="text-[15px] font-display font-bold text-brand-text">Usage · {monthName}</h3>
                      <button onClick={() => setTab("history")} className="text-[13px] font-bold text-[#007A33] hover:underline">Full usage →</button>
                    </div>
                    <div className="mt-5">
                      <div className="flex items-center justify-between text-[13px]">
                        <span className="font-semibold text-brand-text">Pages</span>
                        <span className="font-bold text-brand-text">{billing.pagesUsedThisPeriod.toLocaleString("en-IN")} / {billing.monthlyPageLimit}</span>
                      </div>
                      <div className="h-2 rounded-full bg-[#EFF7ED] mt-2 overflow-hidden">
                        <div className="h-full rounded-full bg-[#2CA01C] transition-all duration-700" style={{ width: `${usagePercent}%` }} />
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-[13px] mt-4">
                      <span className="font-semibold text-brand-text">Conversions</span>
                      <span className="font-bold text-brand-text">{totalDocs} total</span>
                    </div>
                    <div className="flex items-center justify-between text-[13px] mt-2.5">
                      <span className="font-semibold text-brand-text">Transactions extracted</span>
                      <span className="font-bold text-brand-text">{totalTxns.toLocaleString("en-IN")}</span>
                    </div>
                    <p className="text-xs text-brand-muted mt-5 pt-4 border-t border-[#EFF4EC]">
                      Need more pages or seats? Business gives 2,000 pages and 5 seats.
                    </p>
                  </div>
                </div>

                <div id="dash-plans" className="max-w-[1400px] scroll-mt-4">
                  <PricingSection currentTier={billing.tier} onTierChange={refreshBilling} />
                </div>
              </div>
            </div>
          )}

          {/* ═══ PORTALS ══════════════════════════════════════ */}
          {tab ==="portals" && (
            <div className="flex flex-col h-full">
              <PageBanner
                title="Client Portals"
                subtitle="Share a link — clients upload statements straight to your account"
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
                title="Team"
                subtitle="Invite members and manage your Business workspace"
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
                title="Settings"
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
