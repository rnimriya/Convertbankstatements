"use client";

import { useState } from "react";
import { CheckCircle2, AlertTriangle, Loader2 } from "lucide-react";
import { RazorpayCheckout } from "@/components/payment/RazorpayCheckout";
import type { SubTier } from "@/types/billing";
import { useRouter } from "next/navigation";

const PLANS = [
  {
    id: "FREE" as SubTier,
    name: "Free",
    price: "₹0",
    period: "",
    annualPrice: null as string | null,
    annualPeriod: null as string | null,
    annualMonthlyEquiv: null as string | null,
    tagline: "Try it out — no card needed",
    highlight: false,
    badge: null as string | null,
    features: ["8 pages free, forever", "CSV & Excel export", "All Indian banks", "No credit card required"],
    notIncluded: ["OFX / QFX export", "Google Sheets"],
    plan: null as "payg" | "pro" | "business" | "pro_annual" | "business_annual" | null,
    monthlyPlan: null as "payg" | "pro" | "business" | null,
    annualPlan: null as "pro_annual" | "business_annual" | null,
    amountINR: 0,
    annualAmountINR: 0,
  },
  {
    id: "PAYG" as SubTier,
    name: "Pay-per-doc",
    price: "₹49",
    period: "/ document",
    annualPrice: null as string | null,
    annualPeriod: null as string | null,
    annualMonthlyEquiv: null as string | null,
    tagline: "No subscription, pay only when you need",
    highlight: false,
    badge: null as string | null,
    features: ["₹49 per document", "All export formats", "UPI / Cards / NetBanking", "All Indian banks"],
    notIncluded: ["Monthly page pool"],
    plan: "payg" as const,
    monthlyPlan: "payg" as const,
    annualPlan: null as null,
    amountINR: 49,
    annualAmountINR: 49,
  },
  {
    id: "PRO" as SubTier,
    name: "Pro",
    price: "₹1,198",
    period: "/ month",
    annualPrice: "₹11,499",
    annualPeriod: "/ year",
    annualMonthlyEquiv: "₹958/mo",
    tagline: "Perfect for CAs & individuals",
    highlight: true,
    badge: "Most popular",
    features: ["500 pages / month", "All export formats", "Google Sheets export", "Priority processing", "Email support"],
    notIncluded: ["API access", "Team seats"],
    plan: "pro" as const,
    monthlyPlan: "pro" as const,
    annualPlan: "pro_annual" as const,
    amountINR: 1198,
    annualAmountINR: 11499,
  },
  {
    id: "BUSINESS" as SubTier,
    name: "Business",
    price: "₹4,498",
    period: "/ month",
    annualPrice: "₹43,178",
    annualPeriod: "/ year",
    annualMonthlyEquiv: "₹3,598/mo",
    tagline: "For CA firms & fintech teams",
    highlight: false,
    badge: null as string | null,
    features: ["2,000 pages / month", "All export formats", "Google Sheets export", "Priority processing", "API access", "5 team seats", "Dedicated support"],
    notIncluded: [],
    plan: "business" as const,
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
      <p className="text-xs text-slate-400 mb-6">
        Pay via UPI, Credit/Debit Card, Net Banking, or Wallets through Razorpay
      </p>

      {/* Monthly / Annual toggle */}
      <div className="flex items-center justify-center gap-3 mb-8">
        <span className={`text-sm font-medium transition-colors ${!annual ? "text-slate-900 dark:text-white" : "text-slate-400 dark:text-gray-500"}`}>
          Monthly
        </span>
        <button
          onClick={() => setAnnual(a => !a)}
          className={`relative w-11 h-6 rounded-full transition-colors duration-200 focus:outline-none ${annual ? "bg-navy" : "bg-slate-200 dark:bg-white/20"}`}
          role="switch"
          aria-checked={annual}
        >
          <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200 ${annual ? "translate-x-5" : "translate-x-0"}`} />
        </button>
        <span className={`text-sm font-medium transition-colors ${annual ? "text-slate-900 dark:text-white" : "text-slate-400 dark:text-gray-500"}`}>
          Annual
        </span>
        {annual && (
          <span className="bg-emerald-100 text-emerald-700 text-xs font-bold px-2 py-0.5 rounded-full dark:bg-emerald-900/40 dark:text-emerald-400">
            Save 20%
          </span>
        )}
      </div>

      {error && (
        <div className="mb-6 rounded-xl border border-red-100 dark:border-red-900 bg-red-50 dark:bg-red-900/20 px-4 py-3 text-sm text-red-700 dark:text-red-400">
          {error}
        </div>
      )}

      {/* Cards — identical layout to /pricing page */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {PLANS.map((plan) => {
          const isCurrent = currentTier === plan.id;
          const showAnnual = annual && plan.annualPrice !== null;
          const displayPrice = showAnnual ? plan.annualPrice! : plan.price;
          const displayPeriod = showAnnual ? plan.annualPeriod! : plan.period;
          const activePlan = showAnnual ? plan.annualPlan : plan.monthlyPlan;
          const activeAmount = showAnnual ? plan.annualAmountINR : plan.amountINR;

          return (
            <div
              key={plan.id}
              className={`relative flex flex-col rounded-2xl border p-6 ${
                plan.highlight
                  ? "border-brand-400 bg-brand-400 dark:bg-surface dark:border-brand-400 shadow-glow"
                  : "border-slate-200 dark:border-white/10 bg-white dark:bg-surface shadow-sm"
              } ${isCurrent ? "ring-2 ring-emerald-400" : ""}`}
            >
              {/* Most popular badge */}
              {plan.badge && !isCurrent && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-brand-400 px-3 py-1 text-xs font-bold text-black whitespace-nowrap">
                  {plan.badge}
                </div>
              )}

              {/* Current plan badge */}
              {isCurrent && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-emerald-500 px-3 py-1 text-xs font-bold text-white whitespace-nowrap">
                  Current plan
                </div>
              )}

              {/* Name + tagline */}
              <p className={`font-bold ${plan.highlight ? "text-black dark:text-white" : "text-slate-800 dark:text-white"}`}>
                {plan.name}
              </p>
              <p className={`mt-0.5 text-xs ${plan.highlight ? "text-black/70 dark:text-brand-400" : "text-slate-400 dark:text-gray-500"}`}>
                {plan.tagline}
              </p>

              {/* Price */}
              <div className="mt-3">
                <div className="flex items-end gap-0.5">
                  <span className={`text-3xl font-extrabold ${plan.highlight ? "text-black dark:text-white" : "text-slate-900 dark:text-white"}`}>
                    {displayPrice}
                  </span>
                  {displayPeriod && (
                    <span className={`mb-1 text-sm ${plan.highlight ? "text-black/60 dark:text-gray-400" : "text-slate-400 dark:text-gray-500"}`}>
                      {displayPeriod}
                    </span>
                  )}
                </div>
                {showAnnual && plan.annualMonthlyEquiv && (
                  <p className={`text-xs mt-0.5 ${plan.highlight ? "text-black/60 dark:text-gray-400" : "text-slate-400 dark:text-gray-500"}`}>
                    {plan.annualMonthlyEquiv} equivalent
                  </p>
                )}
                {!showAnnual && plan.annualPrice && (
                  <p className={`text-xs mt-0.5 ${plan.highlight ? "text-black/60 dark:text-gray-400" : "text-slate-400 dark:text-gray-500"}`}>
                    or {plan.annualPrice}/yr — save 20%
                  </p>
                )}
              </div>

              {/* Features */}
              <ul className="mt-5 flex-1 space-y-2">
                {plan.features.map((f) => (
                  <li key={f} className={`flex items-start gap-2 text-sm ${plan.highlight ? "text-black dark:text-gray-200" : "text-slate-600 dark:text-gray-300"}`}>
                    <CheckCircle2 className={`mt-0.5 h-4 w-4 shrink-0 ${plan.highlight ? "text-black/70 dark:text-brand-400" : "text-emerald-500"}`} />
                    {f}
                  </li>
                ))}
                {plan.notIncluded.map((f) => (
                  <li key={f} className={`flex items-start gap-2 text-sm line-through ${plan.highlight ? "text-black/40 dark:text-gray-600 decoration-black/30 dark:decoration-gray-700" : "text-slate-400 dark:text-gray-600 decoration-slate-300 dark:decoration-gray-700"}`}>
                    <span className="mt-0.5 h-4 w-4 shrink-0 text-center text-xs">✕</span>
                    {f}
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <div className="mt-6">
                {isCurrent ? (
                  <button
                    disabled
                    className={`flex w-full items-center justify-center rounded-xl py-2.5 text-sm font-semibold cursor-not-allowed opacity-50 ${
                      plan.highlight
                        ? "bg-black/10 dark:bg-surface text-black dark:text-gray-500"
                        : "border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-surface text-slate-400 dark:text-gray-500"
                    }`}
                  >
                    Current plan
                  </button>
                ) : plan.id === "FREE" || !activePlan ? (
                  <button
                    disabled
                    className="flex w-full items-center justify-center rounded-xl py-2.5 text-sm font-semibold cursor-not-allowed border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-surface text-slate-400 dark:text-gray-500"
                  >
                    Free
                  </button>
                ) : (
                  <RazorpayCheckout
                    plan={activePlan}
                    label={`Upgrade to ${plan.name}`}
                    amountINR={activeAmount}
                    onSuccess={() => router.refresh()}
                    onError={setError}
                    className={`flex w-full items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-semibold transition-colors ${
                      plan.highlight
                        ? "bg-black/10 dark:bg-brand-400 dark:text-black text-black hover:bg-black/20 dark:hover:bg-brand-300"
                        : "border border-slate-200 dark:border-white/10 text-slate-700 dark:text-gray-200 hover:bg-slate-50 dark:hover:bg-white/5"
                    }`}
                  />
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Cancellation */}
      {(currentTier === "PRO" || currentTier === "BUSINESS") && !cancelled && (
        <div className="mt-8 rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-surface p-5">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <p className="font-semibold text-slate-800 dark:text-gray-200">Cancel subscription</p>
              <p className="mt-0.5 text-sm text-slate-400 dark:text-gray-500">
                Your plan will revert to Free at end of current billing period.
              </p>
            </div>
            <div className="flex items-center gap-3 flex-shrink-0">
              {cancelConfirm && (
                <button
                  onClick={() => setCancelConfirm(false)}
                  className="text-sm font-medium text-slate-500 hover:text-slate-700 dark:hover:text-gray-300"
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
                    : "border border-slate-200 dark:border-white/10 text-slate-600 dark:text-gray-400 hover:border-red-300 hover:text-red-600 dark:hover:text-red-400"
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
              You will lose access to {currentTier === "PRO" ? "500" : "2,000"} pages/month, all export formats, and other Pro features. Are you sure?
            </div>
          )}
        </div>
      )}

      {cancelled && (
        <div className="mt-8 flex items-center gap-3 rounded-2xl border border-emerald-200 dark:border-emerald-900 bg-emerald-50 dark:bg-emerald-900/20 p-5">
          <CheckCircle2 size={20} className="text-emerald-600 dark:text-emerald-400 shrink-0" />
          <div>
            <p className="font-semibold text-emerald-800 dark:text-emerald-300">Subscription cancelled</p>
            <p className="text-sm text-emerald-700 dark:text-emerald-400">You've been moved to the Free plan. Your data is safe.</p>
          </div>
        </div>
      )}
    </div>
  );
}
