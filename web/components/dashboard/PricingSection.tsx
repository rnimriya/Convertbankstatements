"use client";

import { useState } from"react";
import { Check, ArrowRight, AlertTriangle, Loader2, CheckCircle2 } from"lucide-react";
import { RazorpayCheckout } from"@/components/payment/RazorpayCheckout";
import type { SubTier } from"@/types/billing";
import { useRouter } from"next/navigation";

const PLANS = [
  {
    id:"FREE" as SubTier,
    name:"Free",
    price:"$0",
    period:"",
    annualPrice: null as string | null,
    annualPeriod: null as string | null,
    annualMonthlyEquiv: null as string | null,
    tagline:"Try it out — no card needed",
    highlight: false,
    badge: null as string | null,
    features: ["8 pages free, forever","CSV & Excel export","Global banks support","No credit card required"],
    notIncluded: ["OFX / QFX export","Google Sheets"],
    cta:"Free",
    monthlyPlan: null as"basic" |"pro" |"business" | null,
    annualPlan: null as"pro_annual" |"business_annual" | null,
    amountUSD: 0,
    annualAmountUSD: 0,
  },
  {
    id:"BASIC" as SubTier,
    name:"Basic",
    price:"$5",
    period:"/ mo",
    annualPrice:"$48" as string | null,
    annualPeriod:"/ year" as string | null,
    annualMonthlyEquiv:"$4/mo" as string | null,
    tagline:"For light, occasional use",
    highlight: false,
    badge: null as string | null,
    features: ["25 pages / month","CSV & Excel export","Global banks support","Email support"],
    notIncluded: ["Google Sheets","OFX / QFX export","API access"],
    cta:"Upgrade to Basic",
    monthlyPlan:"basic" as"basic" |"pro" |"business" | null,
    annualPlan:"basic_annual" as"basic_annual" |"pro_annual" |"business_annual" | null,
    amountUSD: 500,
    annualAmountUSD: 4800,
  },
  {
    id:"PRO" as SubTier,
    name:"Pro",
    price:"$20",
    period:"/ mo",
    annualPrice:"$192",
    annualPeriod:"/ year",
    annualMonthlyEquiv:"$16/mo",
    tagline:"Perfect for CAs & individuals",
    highlight: true,
    badge:"Most popular",
    features: ["500 pages / month","All export formats","Google Sheets export","Priority processing","Email support"],
    notIncluded: ["API access","Team seats"],
    cta:"Upgrade to Pro",
    monthlyPlan:"pro" as const,
    annualPlan:"pro_annual" as const,
    amountUSD: 2000,
    annualAmountUSD: 19200,
  },
  {
    id:"BUSINESS" as SubTier,
    name:"Business",
    price:"$75",
    period:"/ month",
    annualPrice:"$720",
    annualPeriod:"/ year",
    annualMonthlyEquiv:"$60/mo",
    tagline:"For CA firms & fintech teams",
    highlight: false,
    badge: null as string | null,
    features: ["2,000 pages / month","All export formats","Google Sheets export","Priority processing","API access","5 team seats","Dedicated support"],
    notIncluded: [],
    cta:"Upgrade to Business",
    monthlyPlan:"business" as const,
    annualPlan:"business_annual" as const,
    amountUSD: 7500,
    annualAmountUSD: 72000,
  },
];

interface PricingSectionProps {
  currentTier: SubTier;
  onTierChange?: () => void;
}

export function PricingSection({ currentTier, onTierChange }: PricingSectionProps) {
  const [annual, setAnnual] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cancelling, setCancelling] = useState(false);
  const [cancelConfirm, setCancelConfirm] = useState(false);
  const [cancelled, setCancelled] = useState(false);
  const router = useRouter();

  const handleCancel = async () => {
    if (!cancelConfirm) { setCancelConfirm(true); return; }
    setCancelling(true);
    try {
      const res = await fetch("/api/cancel-subscription", { method:"POST" });
      if (!res.ok) {
        const d = await res.json();
        setError(d.error ??"Failed to cancel.");
      } else {
        setCancelled(true);
        onTierChange?.();
        router.refresh();
      }
    } catch {
      setError("Network error — please try again.");
    } finally {
      setCancelling(false);
      setCancelConfirm(false);
    }
  };

  return (
    <div>
      {/* Payment note */}
      <p className="text-xs text-brand-muted mb-6">
        Pay via UPI, Credit/Debit Card, Net Banking, or Wallets through Razorpay
      </p>

      {/* Monthly / Annual toggle */}
      <div className="flex items-center justify-center gap-3 mb-10">
        <span className={`text-sm font-medium transition-colors ${!annual ?"text-brand-text" :"text-brand-muted"}`}>
          Monthly
        </span>
        <button
          onClick={() => setAnnual(a => !a)}
          className={`relative w-11 h-6 rounded-full transition-colors duration-200 focus:outline-none ${annual ?"bg-zinc-900 dark:bg-zinc-100" :"bg-brand-border"}`}
          role="switch"
          aria-checked={annual}
        >
          <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-brand-surface rounded-full shadow transition-transform duration-200 ${annual ?"translate-x-5" :"translate-x-0"}`} />
        </button>
        <span className={`text-sm font-medium transition-colors ${annual ?"text-brand-text" :"text-brand-muted"}`}>
          Annual
        </span>
        {annual && (
          <span className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400 text-xs font-bold px-2.5 py-1 rounded-full">
            Save 20%
          </span>
        )}
      </div>

      {error && (
        <div className="mb-6 rounded-xl border border-red-100 dark:border-red-900 bg-red-50 dark:bg-red-900/20 px-4 py-3 text-sm text-red-700 dark:text-red-400">
          {error}
        </div>
      )}

      {/* Cards */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 items-stretch max-w-6xl mx-auto">
        {PLANS.map((plan) => {
          const isCurrent = currentTier === plan.id;
          const showAnnual = annual && plan.annualPrice !== null;
          const displayPrice = showAnnual ? plan.annualPrice! : plan.price;
          const displayPeriod = showAnnual ? plan.annualPeriod! : plan.period;
          const activePlan = showAnnual ? plan.annualPlan : plan.monthlyPlan;
          const activeAmount = showAnnual ? plan.annualAmountUSD : plan.amountUSD;

          if (plan.highlight) {
            /* ── PRO — featured card (blue gradient) ── */
            return (
              <div key={plan.id} className="relative pt-5 h-full">
                {/* Badge */}
                <div className="absolute -top-0 left-1/2 -translate-x-1/2 z-10">
                  {isCurrent ? (
                    <span className="inline-block bg-zinc-900 dark:bg-zinc-100 rounded-full px-5 py-1.5 text-xs font-black text-white dark:text-black shadow-md whitespace-nowrap border border-brand-border">
                      Current plan
                    </span>
                  ) : (
                    <span className="inline-block bg-brand-surface rounded-full px-5 py-1.5 text-xs font-black text-brand-text shadow-md whitespace-nowrap border border-brand-border">
                      {plan.badge}
                    </span>
                  )}
                </div>

                <div
                  className="relative flex flex-col h-full rounded-3xl p-7 overflow-hidden bg-zinc-900"
                >
                  {/* Orb */}
                  <div className="absolute top-0 right-0 w-40 h-40 rounded-full opacity-5 pointer-events-none bg-white" style={{ transform:"translate(30%,-30%)" }} />

                  <p className="font-black text-white text-lg mb-0.5">{plan.name}</p>
                  <p className="text-white/60 text-xs mb-5">{plan.tagline}</p>

                  {/* Price */}
                  <div className="mb-1">
                    <div className="flex items-end gap-1.5">
                      <span className="text-5xl font-black text-white tracking-tight">{displayPrice}</span>
                      {displayPeriod && <span className="text-white/60 text-base mb-1">{displayPeriod}</span>}
                    </div>
                    {showAnnual && plan.annualMonthlyEquiv && (
                      <p className="text-white/55 text-xs mt-1">{plan.annualMonthlyEquiv} equivalent</p>
                    )}
                    {!showAnnual && plan.annualPrice && (
                      <p className="text-white/55 text-xs mt-1">or {plan.annualPrice}/yr — save 20%</p>
                    )}
                  </div>

                  {/* Divider */}
                  <div className="h-px bg-brand-bg/15 my-5" />

                  {/* Features */}
                  <ul className="space-y-3 flex-1 mb-8">
                    {plan.features.map(f => (
                      <li key={f} className="flex items-center gap-3 text-sm text-white">
                        <div className="w-5 h-5 rounded-full border-2 border-white/40 flex items-center justify-center shrink-0">
                          <Check size={11} className="text-white text-emerald-500 dark:text-emerald-400" />
                        </div>
                        {f}
                      </li>
                    ))}
                    {plan.notIncluded.map(f => (
                      <li key={f} className="flex items-center gap-3 text-sm text-white/30 line-through">
                        <div className="w-5 h-5 rounded-full border-2 border-white/15 flex items-center justify-center shrink-0">
                          <span className="text-[9px] text-white/30">✕</span>
                        </div>
                        {f}
                      </li>
                    ))}
                  </ul>

                  {/* CTA */}
                  {isCurrent ? (
                    <button
                      disabled
                      className="flex w-full items-center justify-center rounded-2xl py-3.5 text-sm font-black bg-brand-surface/20 text-white cursor-not-allowed opacity-70"
                    >
                      Current plan
                    </button>
                  ) : !activePlan ? null : (
                    <RazorpayCheckout
                      plan={activePlan}
                      label={plan.cta}
                      amountUSD={activeAmount}
                      onSuccess={() => router.refresh()}
                      onError={setError}
                      className="flex w-full items-center justify-center gap-2 rounded-2xl py-3.5 text-sm font-bold bg-white text-black hover:bg-zinc-100 transition-colors shadow-sm"
                    />
                  )}
                </div>
              </div>
            );
          }

          /* ── Non-featured cards ── */
          return (
            <div
              key={plan.id}
              className={`relative flex flex-col h-full rounded-3xl border bg-brand-surface p-7 shadow-sm hover:shadow-md transition-shadow ${
                isCurrent ?"border-zinc-900 dark:border-zinc-100 ring-2 ring-zinc-900 dark:ring-zinc-100" :"border-brand-border"
              }`}
            >
              {isCurrent && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-zinc-900 dark:bg-zinc-100 px-4 py-1 text-xs font-bold text-white dark:text-black whitespace-nowrap shadow-sm border border-brand-border">
                  Current plan
                </div>
              )}

              <p className="font-black text-brand-text text-lg mb-0.5">{plan.name}</p>
              <p className="text-brand-muted text-xs mb-5">{plan.tagline}</p>

              {/* Price */}
              <div className="mb-1">
                <div className="flex items-end gap-1.5">
                  <span className="text-4xl font-black text-brand-text tracking-tight">{displayPrice}</span>
                  {displayPeriod && <span className="text-brand-muted text-sm mb-1">{displayPeriod}</span>}
                </div>
                {showAnnual && plan.annualMonthlyEquiv && (
                  <p className="text-brand-muted text-xs mt-1">{plan.annualMonthlyEquiv} equivalent</p>
                )}
                {!showAnnual && plan.annualPrice && (
                  <p className="text-brand-muted text-xs mt-1">or {plan.annualPrice}/yr — save 20%</p>
                )}
                {/* Reserve the sub-line height (e.g. Free has no annual price) so all dividers align */}
                {!plan.annualPrice && <p className="text-xs mt-1 invisible" aria-hidden="true">.</p>}
              </div>

              <div className="h-px bg-zinc-100 dark:bg-brand-bg/10 my-5" />

              {/* Features */}
              <ul className="space-y-3 flex-1 mb-8">
                {plan.features.map(f => (
                  <li key={f} className="flex items-center gap-3 text-sm text-zinc-600 dark:text-zinc-300">
                    <div className="w-5 h-5 rounded-full border border-brand-border flex items-center justify-center shrink-0">
                      <Check size={11} className="text-emerald-500 dark:text-emerald-400" />
                    </div>
                    {f}
                  </li>
                ))}
                {plan.notIncluded.map(f => (
                  <li key={f} className="flex items-center gap-3 text-sm text-zinc-300 dark:text-zinc-600 line-through">
                    <div className="w-5 h-5 rounded-full border-2 border-brand-border flex items-center justify-center shrink-0">
                      <span className="text-[9px] text-zinc-300">✕</span>
                    </div>
                    {f}
                  </li>
                ))}
              </ul>

              {/* CTA */}
              {isCurrent ? (
                <button
                  disabled
                  className="flex w-full items-center justify-center rounded-2xl py-3.5 text-sm font-bold bg-brand-surface text-brand-muted cursor-not-allowed"
                >
                  Current plan
                </button>
              ) : plan.id ==="FREE" || !activePlan ? (
                <button
                  disabled
                  className="flex w-full items-center justify-center rounded-2xl py-3.5 text-sm font-bold bg-brand-surface text-brand-muted cursor-not-allowed"
                >
                  Free
                </button>
              ) : (
                <RazorpayCheckout
                  plan={activePlan}
                  label={plan.cta}
                  amountUSD={activeAmount}
                  onSuccess={() => router.refresh()}
                  onError={setError}
                  className="flex w-full items-center justify-center gap-2 rounded-2xl py-3.5 text-sm font-bold bg-black text-white hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200 border-0 shadow-none"
                />
              )}
            </div>
          );
        })}
      </div>

      {/* Cancellation */}
      {currentTier !=="FREE" && !cancelled && (
        <div className="mt-8 rounded-2xl border border-brand-border bg-brand-surface p-5">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <p className="font-semibold text-brand-text">Cancel subscription</p>
              <p className="mt-0.5 text-sm text-brand-muted">
                Your plan will revert to Free at end of current billing period.
              </p>
            </div>
            <div className="flex items-center gap-3 flex-shrink-0">
              {cancelConfirm && (
                <button
                  onClick={() => setCancelConfirm(false)}
                  className="text-sm font-medium text-brand-muted hover:text-brand-text dark:hover:text-gray-300"
                >
                  Keep plan
                </button>
              )}
              <button
                onClick={handleCancel}
                disabled={cancelling}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-colors ${
                  cancelConfirm
                    ?"bg-red-600 text-white hover:bg-red-700"
                    :"border border-brand-border text-brand-muted hover:border-red-300 hover:text-red-600 dark:hover:text-red-400"
                } disabled:opacity-50`}
              >
                {cancelling && <Loader2 size={14} className="animate-spin text-purple-500 dark:text-purple-400" />}
                {cancelConfirm ?"Confirm cancellation" :"Cancel subscription"}
              </button>
            </div>
          </div>
          {cancelConfirm && (
            <div className="mt-3 flex items-start gap-2 text-sm text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 rounded-xl px-4 py-3">
              <AlertTriangle size={14} className="shrink-0 mt-0.5 text-amber-500 dark:text-amber-400" />
              You will lose access to {currentTier ==="PRO" ?"500" : currentTier ==="BUSINESS" ?"2,000" :"25"} pages/month and your paid features. Are you sure?
            </div>
          )}
        </div>
      )}

      {cancelled && (
        <div className="mt-8 flex items-center gap-3 rounded-2xl border border-emerald-200 dark:border-emerald-900 bg-emerald-50 dark:bg-emerald-900/20 p-5">
          <CheckCircle2 size={20} className="text-emerald-600 dark:text-emerald-400 shrink-0 text-emerald-500 dark:text-emerald-400" />
          <div>
            <p className="font-semibold text-emerald-800 dark:text-emerald-300">Subscription cancelled</p>
            <p className="text-sm text-emerald-700 dark:text-emerald-400">You&apos;ve been moved to the Free plan. Your data is safe.</p>
          </div>
        </div>
      )}
    </div>
  );
}
