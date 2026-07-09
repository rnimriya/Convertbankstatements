"use client";

import { useState } from "react";
import { Check, ArrowRight, AlertTriangle, Loader2, CheckCircle2 } from "lucide-react";
import { RazorpayCheckout } from "@/components/payment/RazorpayCheckout";
import type { SubTier } from "@/types/billing";
import { useRouter } from "next/navigation";

const PLANS = [
  {
    id: "FREE" as SubTier,
    name: "Free",
    price: "$0",
    period: "",
    annualPrice: null as string | null,
    annualPeriod: null as string | null,
    annualMonthlyEquiv: null as string | null,
    tagline: "Try it out — no card needed",
    highlight: false,
    badge: null as string | null,
    features: ["8 pages free, forever", "CSV & Excel export", "Global banks support", "No credit card required"],
    notIncluded: ["OFX / QFX export", "Google Sheets"],
    cta: "Free",
    monthlyPlan: null as "basic" | "pro" | "business" | null,
    annualPlan: null as "pro_annual" | "business_annual" | null,
    amountINR: 0,
    annualAmountINR: 0,
  },
  {
    id: "BASIC" as SubTier,
    name: "Basic",
    price: "$5",
    period: "/ mo",
    annualPrice: "$48" as string | null,
    annualPeriod: "/ year" as string | null,
    annualMonthlyEquiv: "$4/mo" as string | null,
    tagline: "For light, occasional use",
    highlight: false,
    badge: null as string | null,
    features: ["25 pages / month", "CSV & Excel export", "Global banks support", "Email support"],
    notIncluded: ["Google Sheets", "OFX / QFX export", "API access"],
    cta: "Upgrade to Basic",
    monthlyPlan: "basic" as "basic" | "pro" | "business" | null,
    annualPlan: "basic_annual" as "basic_annual" | "pro_annual" | "business_annual" | null,
    amountINR: 25,
    annualAmountINR: 248,
  },
  {
    id: "PRO" as SubTier,
    name: "Pro",
    price: "$20",
    period: "/ mo",
    annualPrice: "$192",
    annualPeriod: "/ year",
    annualMonthlyEquiv: "$16/mo",
    tagline: "Perfect for CAs & individuals",
    highlight: true,
    badge: "Most popular",
    features: ["500 pages / month", "All export formats", "Google Sheets export", "Priority processing", "Email support"],
    notIncluded: ["API access", "Team seats"],
    cta: "Upgrade to Pro",
    monthlyPlan: "pro" as const,
    annualPlan: "pro_annual" as const,
    amountINR: 1198,
    annualAmountINR: 11499,
  },
  {
    id: "BUSINESS" as SubTier,
    name: "Business",
    price: "$75",
    period: "/ month",
    annualPrice: "$720",
    annualPeriod: "/ year",
    annualMonthlyEquiv: "$60/mo",
    tagline: "For CA firms & fintech teams",
    highlight: false,
    badge: null as string | null,
    features: ["2,000 pages / month", "All export formats", "Google Sheets export", "Priority processing", "API access", "5 team seats", "Dedicated support"],
    notIncluded: [],
    cta: "Upgrade to Business",
    monthlyPlan: "business" as const,
    annualPlan: "business_annual" as const,
    amountINR: 4498,
    annualAmountINR: 43178,
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
      const res = await fetch("/api/cancel-subscription", { method: "POST" });
      if (!res.ok) {
        const d = await res.json();
        setError(d.error ?? "Failed to cancel.");
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
      <p className="text-xs text-zinc-400 dark:text-zinc-500 mb-6">
        Pay via UPI, Credit/Debit Card, Net Banking, or Wallets through Razorpay
      </p>

      {/* Monthly / Annual toggle */}
      <div className="flex items-center justify-center gap-3 mb-10">
        <span className={`text-sm font-medium transition-colors ${!annual ? "text-zinc-900 dark:text-white" : "text-zinc-400 dark:text-zinc-500"}`}>
          Monthly
        </span>
        <button
          onClick={() => setAnnual(a => !a)}
          className={`relative w-11 h-6 rounded-full transition-colors duration-200 focus:outline-none ${annual ? "bg-zinc-900 dark:bg-zinc-100" : "bg-zinc-200 dark:bg-zinc-800"}`}
          role="switch"
          aria-checked={annual}
        >
          <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white dark:bg-zinc-900 rounded-full shadow transition-transform duration-200 ${annual ? "translate-x-5" : "translate-x-0"}`} />
        </button>
        <span className={`text-sm font-medium transition-colors ${annual ? "text-zinc-900 dark:text-white" : "text-zinc-400 dark:text-zinc-500"}`}>
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
          const activeAmount = showAnnual ? plan.annualAmountINR : plan.amountINR;

          if (plan.highlight) {
            /* ── PRO — featured card (blue gradient) ── */
            return (
              <div key={plan.id} className="relative pt-5 h-full">
                {/* Badge */}
                <div className="absolute -top-0 left-1/2 -translate-x-1/2 z-10">
                  {isCurrent ? (
                    <span className="inline-block bg-zinc-900 dark:bg-zinc-100 rounded-full px-5 py-1.5 text-xs font-black text-white dark:text-black shadow-md whitespace-nowrap border border-zinc-200 dark:border-zinc-800">
                      Current plan
                    </span>
                  ) : (
                    <span className="inline-block bg-white dark:bg-zinc-950 rounded-full px-5 py-1.5 text-xs font-black text-zinc-900 dark:text-zinc-100 shadow-md whitespace-nowrap border border-zinc-200 dark:border-zinc-800">
                      {plan.badge}
                    </span>
                  )}
                </div>

                <div
                  className="relative flex flex-col h-full rounded-3xl p-7 overflow-hidden bg-zinc-900"
                >
                  {/* Orb */}
                  <div className="absolute top-0 right-0 w-40 h-40 rounded-full opacity-5 pointer-events-none bg-white" style={{ transform: "translate(30%,-30%)" }} />

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
                  <div className="h-px bg-white dark:bg-zinc-950/15 my-5" />

                  {/* Features */}
                  <ul className="space-y-3 flex-1 mb-8">
                    {plan.features.map(f => (
                      <li key={f} className="flex items-center gap-3 text-sm text-white">
                        <div className="w-5 h-5 rounded-full border-2 border-white/40 flex items-center justify-center shrink-0">
                          <Check size={11} className="text-white" />
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
                      className="flex w-full items-center justify-center rounded-2xl py-3.5 text-sm font-black bg-white dark:bg-zinc-950/20 text-white cursor-not-allowed opacity-70"
                    >
                      Current plan
                    </button>
                  ) : !activePlan ? null : (
                    <RazorpayCheckout
                      plan={activePlan}
                      label={plan.cta}
                      amountINR={activeAmount}
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
              className={`relative flex flex-col h-full rounded-3xl border bg-white dark:bg-zinc-950 p-7 shadow-sm hover:shadow-md transition-shadow ${
                isCurrent ? "border-zinc-900 dark:border-zinc-100 ring-2 ring-zinc-900 dark:ring-zinc-100" : "border-zinc-200 dark:border-zinc-800"
              }`}
            >
              {isCurrent && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-zinc-900 dark:bg-zinc-100 px-4 py-1 text-xs font-bold text-white dark:text-black whitespace-nowrap shadow-sm border border-zinc-200 dark:border-zinc-800">
                  Current plan
                </div>
              )}

              <p className="font-black text-zinc-900 dark:text-white text-lg mb-0.5">{plan.name}</p>
              <p className="text-zinc-400 dark:text-zinc-500 text-xs mb-5">{plan.tagline}</p>

              {/* Price */}
              <div className="mb-1">
                <div className="flex items-end gap-1.5">
                  <span className="text-4xl font-black text-zinc-900 dark:text-white tracking-tight">{displayPrice}</span>
                  {displayPeriod && <span className="text-zinc-400 dark:text-zinc-500 text-sm mb-1">{displayPeriod}</span>}
                </div>
                {showAnnual && plan.annualMonthlyEquiv && (
                  <p className="text-zinc-400 dark:text-zinc-500 text-xs mt-1">{plan.annualMonthlyEquiv} equivalent</p>
                )}
                {!showAnnual && plan.annualPrice && (
                  <p className="text-zinc-400 dark:text-zinc-500 text-xs mt-1">or {plan.annualPrice}/yr — save 20%</p>
                )}
                {/* Reserve the sub-line height (e.g. Free has no annual price) so all dividers align */}
                {!plan.annualPrice && <p className="text-xs mt-1 invisible" aria-hidden="true">.</p>}
              </div>

              <div className="h-px bg-zinc-100 dark:bg-white dark:bg-zinc-950/10 my-5" />

              {/* Features */}
              <ul className="space-y-3 flex-1 mb-8">
                {plan.features.map(f => (
                  <li key={f} className="flex items-center gap-3 text-sm text-zinc-600 dark:text-zinc-300">
                    <div className="w-5 h-5 rounded-full border border-zinc-300 dark:border-zinc-700 flex items-center justify-center shrink-0">
                      <Check size={11} className="text-zinc-400" />
                    </div>
                    {f}
                  </li>
                ))}
                {plan.notIncluded.map(f => (
                  <li key={f} className="flex items-center gap-3 text-sm text-zinc-300 dark:text-zinc-600 line-through">
                    <div className="w-5 h-5 rounded-full border-2 border-zinc-200 dark:border-zinc-800 flex items-center justify-center shrink-0">
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
                  className="flex w-full items-center justify-center rounded-2xl py-3.5 text-sm font-bold bg-zinc-100 dark:bg-zinc-800 text-zinc-400 dark:text-zinc-500 cursor-not-allowed"
                >
                  Current plan
                </button>
              ) : plan.id === "FREE" || !activePlan ? (
                <button
                  disabled
                  className="flex w-full items-center justify-center rounded-2xl py-3.5 text-sm font-bold bg-zinc-100 dark:bg-zinc-800 text-zinc-400 dark:text-zinc-500 cursor-not-allowed"
                >
                  Free
                </button>
              ) : (
                <RazorpayCheckout
                  plan={activePlan}
                  label={plan.cta}
                  amountINR={activeAmount}
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
      {currentTier !== "FREE" && !cancelled && (
        <div className="mt-8 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-5">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <p className="font-semibold text-zinc-800 dark:text-zinc-200">Cancel subscription</p>
              <p className="mt-0.5 text-sm text-zinc-400 dark:text-zinc-500">
                Your plan will revert to Free at end of current billing period.
              </p>
            </div>
            <div className="flex items-center gap-3 flex-shrink-0">
              {cancelConfirm && (
                <button
                  onClick={() => setCancelConfirm(false)}
                  className="text-sm font-medium text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:text-zinc-300 dark:hover:text-gray-300"
                >
                  Keep plan
                </button>
              )}
              <button
                onClick={handleCancel}
                disabled={cancelling}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-colors ${
                  cancelConfirm
                    ? "bg-red-600 text-white hover:bg-red-700"
                    : "border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:border-red-300 hover:text-red-600 dark:hover:text-red-400"
                } disabled:opacity-50`}
              >
                {cancelling && <Loader2 size={14} className="animate-spin" />}
                {cancelConfirm ? "Confirm cancellation" : "Cancel subscription"}
              </button>
            </div>
          </div>
          {cancelConfirm && (
            <div className="mt-3 flex items-start gap-2 text-sm text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 rounded-xl px-4 py-3">
              <AlertTriangle size={14} className="shrink-0 mt-0.5" />
              You will lose access to {currentTier === "PRO" ? "500" : currentTier === "BUSINESS" ? "2,000" : "25"} pages/month and your paid features. Are you sure?
            </div>
          )}
        </div>
      )}

      {cancelled && (
        <div className="mt-8 flex items-center gap-3 rounded-2xl border border-emerald-200 dark:border-emerald-900 bg-emerald-50 dark:bg-emerald-900/20 p-5">
          <CheckCircle2 size={20} className="text-emerald-600 dark:text-emerald-400 shrink-0" />
          <div>
            <p className="font-semibold text-emerald-800 dark:text-emerald-300">Subscription cancelled</p>
            <p className="text-sm text-emerald-700 dark:text-emerald-400">You&apos;ve been moved to the Free plan. Your data is safe.</p>
          </div>
        </div>
      )}
    </div>
  );
}
