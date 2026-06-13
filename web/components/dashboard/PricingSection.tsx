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
    cta: "Free",
    monthlyPlan: null as "pro" | "business" | null,
    annualPlan: null as "pro_annual" | "business_annual" | null,
    amountINR: 0,
    annualAmountINR: 0,
  },
  {
    id: "PRO" as SubTier,
    name: "Pro",
    price: "₹1,198",
    period: "/ mo",
    annualPrice: "₹11,499",
    annualPeriod: "/ year",
    annualMonthlyEquiv: "₹958/mo",
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
      <p className="text-xs text-slate-400 dark:text-gray-500 mb-6">
        Pay via UPI, Credit/Debit Card, Net Banking, or Wallets through Razorpay
      </p>

      {/* Monthly / Annual toggle */}
      <div className="flex items-center justify-center gap-3 mb-10">
        <span className={`text-sm font-medium transition-colors ${!annual ? "text-slate-900 dark:text-white" : "text-slate-400 dark:text-gray-500"}`}>
          Monthly
        </span>
        <button
          onClick={() => setAnnual(a => !a)}
          className={`relative w-11 h-6 rounded-full transition-colors duration-200 focus:outline-none ${annual ? "bg-[#3B5BFC]" : "bg-slate-200 dark:bg-white/20"}`}
          role="switch"
          aria-checked={annual}
        >
          <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200 ${annual ? "translate-x-5" : "translate-x-0"}`} />
        </button>
        <span className={`text-sm font-medium transition-colors ${annual ? "text-slate-900 dark:text-white" : "text-slate-400 dark:text-gray-500"}`}>
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
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 items-start">
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
              <div key={plan.id} className="relative pt-5">
                {/* Badge */}
                <div className="absolute -top-0 left-1/2 -translate-x-1/2 z-10">
                  {isCurrent ? (
                    <span className="inline-block bg-emerald-500 rounded-full px-5 py-1.5 text-xs font-black text-white shadow-md whitespace-nowrap">
                      Current plan
                    </span>
                  ) : (
                    <span className="inline-block bg-white rounded-full px-5 py-1.5 text-xs font-black text-[#3B5BFC] shadow-md whitespace-nowrap border border-white">
                      {plan.badge}
                    </span>
                  )}
                </div>

                <div
                  className="relative flex flex-col rounded-3xl p-7 overflow-hidden"
                  style={{
                    background: "linear-gradient(160deg,#3B5BFC 0%,#2645e0 100%)",
                    boxShadow: "0 20px 60px rgba(59,91,252,0.40), 0 4px 20px rgba(59,91,252,0.20)",
                  }}
                >
                  {/* Orb */}
                  <div className="absolute top-0 right-0 w-40 h-40 rounded-full opacity-10 pointer-events-none" style={{ background: "radial-gradient(circle,white,transparent)", transform: "translate(30%,-30%)" }} />

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
                  <div className="h-px bg-white/15 my-5" />

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
                      className="flex w-full items-center justify-center rounded-2xl py-3.5 text-sm font-black bg-white/20 text-white cursor-not-allowed opacity-70"
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
                      className="flex w-full items-center justify-center gap-2 rounded-2xl py-3.5 text-sm font-black text-[#3B5BFC] bg-white hover:bg-slate-50 transition-colors shadow-lg"
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
              className={`relative flex flex-col rounded-3xl border bg-white dark:bg-surface p-7 shadow-sm hover:shadow-md transition-shadow ${
                isCurrent
                  ? "border-emerald-400 dark:border-emerald-500 ring-2 ring-emerald-400"
                  : "border-slate-200 dark:border-white/10"
              }`}
            >
              {isCurrent && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-emerald-500 px-4 py-1 text-xs font-black text-white whitespace-nowrap shadow-sm">
                  Current plan
                </div>
              )}

              <p className="font-black text-slate-900 dark:text-white text-lg mb-0.5">{plan.name}</p>
              <p className="text-slate-400 dark:text-gray-500 text-xs mb-5">{plan.tagline}</p>

              {/* Price */}
              <div className="mb-1">
                <div className="flex items-end gap-1.5">
                  <span className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">{displayPrice}</span>
                  {displayPeriod && <span className="text-slate-400 dark:text-gray-500 text-sm mb-1">{displayPeriod}</span>}
                </div>
                {showAnnual && plan.annualMonthlyEquiv && (
                  <p className="text-slate-400 dark:text-gray-500 text-xs mt-1">{plan.annualMonthlyEquiv} equivalent</p>
                )}
                {!showAnnual && plan.annualPrice && (
                  <p className="text-slate-400 dark:text-gray-500 text-xs mt-1">or {plan.annualPrice}/yr — save 20%</p>
                )}
              </div>

              <div className="h-px bg-slate-100 dark:bg-white/10 my-5" />

              {/* Features */}
              <ul className="space-y-3 flex-1 mb-8">
                {plan.features.map(f => (
                  <li key={f} className="flex items-center gap-3 text-sm text-slate-600 dark:text-gray-300">
                    <div className="w-5 h-5 rounded-full border-2 border-emerald-400 flex items-center justify-center shrink-0">
                      <Check size={11} className="text-emerald-500" />
                    </div>
                    {f}
                  </li>
                ))}
                {plan.notIncluded.map(f => (
                  <li key={f} className="flex items-center gap-3 text-sm text-slate-300 dark:text-gray-600 line-through">
                    <div className="w-5 h-5 rounded-full border-2 border-slate-200 dark:border-white/10 flex items-center justify-center shrink-0">
                      <span className="text-[9px] text-slate-300">✕</span>
                    </div>
                    {f}
                  </li>
                ))}
              </ul>

              {/* CTA */}
              {isCurrent ? (
                <button
                  disabled
                  className="flex w-full items-center justify-center rounded-2xl py-3.5 text-sm font-bold border-2 border-slate-200 dark:border-white/10 text-slate-400 dark:text-gray-500 cursor-not-allowed opacity-60"
                >
                  Current plan
                </button>
              ) : plan.id === "FREE" || !activePlan ? (
                <button
                  disabled
                  className="flex w-full items-center justify-center rounded-2xl py-3.5 text-sm font-bold border-2 border-slate-200 dark:border-white/10 text-slate-400 dark:text-gray-500 cursor-not-allowed opacity-60"
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
                  className="flex w-full items-center justify-center gap-2 rounded-2xl py-3.5 text-sm font-bold border-2 border-slate-200 dark:border-white/10 text-slate-700 dark:text-gray-200 hover:border-[#3B5BFC] hover:text-[#3B5BFC] dark:hover:border-brand-400 dark:hover:text-brand-400 transition-all"
                />
              )}
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
            <p className="text-sm text-emerald-700 dark:text-emerald-400">You&apos;ve been moved to the Free plan. Your data is safe.</p>
          </div>
        </div>
      )}
    </div>
  );
}
