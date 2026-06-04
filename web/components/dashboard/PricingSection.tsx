"use client";

import { useState } from "react";
import { Check, IndianRupee } from "lucide-react";
import { RazorpayCheckout } from "@/components/payment/RazorpayCheckout";
import type { SubTier } from "@/types/billing";
import { useRouter } from "next/navigation";

const PLANS = [
  {
    id: "FREE" as SubTier,
    name: "Free",
    price: "₹0",
    period: "",
    highlight: false,
    features: ["8 pages total, forever", "CSV & Excel export", "All Indian banks"],
    plan: null,
    amountINR: 0,
  },
  {
    id: "PAYG" as SubTier,
    name: "Pay-per-doc",
    price: "₹49",
    period: "/ document",
    highlight: false,
    features: ["No subscription", "All export formats", "UPI / Card / NetBanking"],
    plan: "payg" as const,
    amountINR: 49,
  },
  {
    id: "PRO" as SubTier,
    name: "Pro",
    price: "₹399",
    period: "/ month",
    highlight: true,
    features: ["200 pages / month", "All export formats", "Google Sheets", "Priority processing"],
    plan: "pro" as const,
    amountINR: 399,
  },
  {
    id: "BUSINESS" as SubTier,
    name: "Business",
    price: "₹999",
    period: "/ month",
    highlight: false,
    features: ["500 pages / month", "All export formats", "API access", "5 team seats"],
    plan: "business" as const,
    amountINR: 999,
  },
];

export function PricingSection({ currentTier }: { currentTier: SubTier }) {
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  return (
    <div>
      <div className="mb-4 flex items-center gap-2 text-sm text-slate-500 dark:text-gray-400">
        <IndianRupee className="h-4 w-4 text-brand-500 dark:text-brand-400" />
        Pay via UPI, Credit/Debit Card, Net Banking, or Wallets through Razorpay
      </div>

      {error && (
        <div className="mb-4 rounded-xl border border-red-100 dark:border-red-900 bg-red-50 dark:bg-red-900/20 px-4 py-3 text-sm text-red-700 dark:text-red-400">
          {error}
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {PLANS.map((plan) => {
          const isCurrent = currentTier === plan.id;

          return (
            <div
              key={plan.id}
              className={`relative rounded-2xl border p-5 ${
                plan.highlight
                  ? "border-brand-500 bg-brand-600 dark:bg-brand-700 shadow-lg shadow-brand-100 dark:shadow-brand-900/30"
                  : "border-slate-200 dark:border-gray-800 bg-white dark:bg-gray-800 shadow-sm"
              } ${isCurrent ? "ring-2 ring-brand-500" : ""}`}
            >
              {plan.highlight && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-brand-600 dark:bg-brand-500 px-3 py-0.5 text-xs font-bold text-white whitespace-nowrap">
                  Most popular
                </span>
              )}
              {isCurrent && (
                <span className="absolute -top-3 right-3 rounded-full bg-emerald-500 px-2 py-0.5 text-xs font-bold text-white">
                  Current
                </span>
              )}

              <p className={`font-bold ${plan.highlight ? "text-white" : "text-slate-800 dark:text-gray-200"}`}>{plan.name}</p>
              <p className="mt-1 flex items-end gap-0.5">
                <span className={`text-2xl font-extrabold ${plan.highlight ? "text-white" : "text-slate-900 dark:text-white"}`}>{plan.price}</span>
                {plan.period && <span className={`mb-0.5 text-xs ${plan.highlight ? "text-brand-200" : "text-slate-400 dark:text-gray-500"}`}>{plan.period}</span>}
              </p>

              <ul className="mt-4 space-y-2">
                {plan.features.map((f) => (
                  <li key={f} className={`flex items-center gap-2 text-xs ${plan.highlight ? "text-brand-100" : "text-slate-600 dark:text-gray-300"}`}>
                    <Check className={`h-3.5 w-3.5 shrink-0 ${plan.highlight ? "text-brand-200" : "text-emerald-500"}`} />
                    {f}
                  </li>
                ))}
              </ul>

              {isCurrent || !plan.plan ? (
                <button
                  disabled
                  className={`mt-5 w-full rounded-xl border py-2 text-sm font-semibold cursor-not-allowed ${
                    plan.highlight
                      ? "border-brand-400 bg-brand-500 text-brand-100"
                      : "border-slate-100 dark:border-gray-800 bg-slate-50 dark:bg-gray-800 text-slate-400 dark:text-gray-500"
                  }`}
                >
                  {isCurrent ? "Current plan" : "Free"}
                </button>
              ) : (
                <RazorpayCheckout
                  plan={plan.plan}
                  label={`Upgrade to ${plan.name}`}
                  amountINR={plan.amountINR}
                  onSuccess={() => {
                    router.refresh();
                  }}
                  onError={setError}
                  className={`mt-5 flex w-full items-center justify-center gap-2 rounded-xl py-2 text-sm font-semibold transition-colors ${
                    plan.highlight
                      ? "bg-white text-brand-700 hover:bg-brand-50"
                      : "border border-slate-200 dark:border-gray-800 bg-white dark:bg-gray-800 text-slate-700 dark:text-gray-200 hover:bg-slate-50 dark:hover:bg-gray-800"
                  }`}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
