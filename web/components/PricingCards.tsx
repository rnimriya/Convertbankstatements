"use client";

import { useState } from "react";
import Link from "next/link";
import { CheckCircle2, ArrowRight } from "lucide-react";

const MONTHLY_PLANS = [
  {
    name: "Free",
    price: "₹0",
    period: "",
    annualPrice: null,
    annualPeriod: null,
    tagline: "Try it out — no card needed",
    highlight: false,
    badge: null,
    features: ["8 pages free, forever", "CSV & Excel export", "All Indian banks", "No credit card required"],
    notIncluded: ["OFX / QFX export", "Google Sheets"],
    cta: "Start free",
    href: "/signup",
    annualHref: "/signup",
  },
  {
    name: "Pay-per-doc",
    price: "₹49",
    period: "/ document",
    annualPrice: null,
    annualPeriod: null,
    tagline: "No subscription, pay only when you need",
    highlight: false,
    badge: null,
    features: ["₹49 per document", "All export formats", "UPI / Cards / NetBanking", "All Indian banks"],
    notIncluded: ["Monthly page pool"],
    cta: "Get started",
    href: "/signup",
    annualHref: "/signup",
  },
  {
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
    cta: "Start Pro",
    href: "/signup?plan=pro",
    annualHref: "/signup?plan=pro_annual",
  },
  {
    name: "Business",
    price: "₹4,498",
    period: "/ month",
    annualPrice: "₹43,178",
    annualPeriod: "/ year",
    annualMonthlyEquiv: "₹3,598/mo",
    tagline: "For CA firms & fintech teams",
    highlight: false,
    badge: null,
    features: ["2,000 pages / month", "All export formats", "Google Sheets export", "Priority processing", "API access", "5 team seats", "Dedicated support"],
    notIncluded: [],
    cta: "Start Business",
    href: "/signup?plan=business",
    annualHref: "/signup?plan=business_annual",
  },
];

export function PricingCards() {
  const [annual, setAnnual] = useState(false);

  return (
    <>
      {/* Billing toggle */}
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
          <span
            className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200 ${annual ? "translate-x-5" : "translate-x-0"}`}
          />
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

      {/* Cards */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {MONTHLY_PLANS.map((plan) => {
          const showAnnual = annual && plan.annualPrice !== null;
          const displayPrice = showAnnual ? plan.annualPrice! : plan.price;
          const displayPeriod = showAnnual ? plan.annualPeriod! : plan.period;
          const href = showAnnual ? plan.annualHref : plan.href;

          return (
            <div
              key={plan.name}
              className={`relative flex flex-col rounded-2xl border p-6 ${
                plan.highlight
                  ? "border-[#3B5BFC] bg-[#3B5BFC] shadow-[0_8px_40px_rgba(59,91,252,0.35)]"
                  : "border-slate-200 dark:border-white/10 bg-white dark:bg-surface shadow-sm"
              }`}
            >
              {plan.badge && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-white px-4 py-1 text-xs font-bold text-[#3B5BFC] whitespace-nowrap shadow-sm border border-white">
                  {plan.badge}
                </div>
              )}
              <p className={`font-bold ${plan.highlight ? "text-white" : "text-slate-800 dark:text-white"}`}>{plan.name}</p>
              <p className={`mt-0.5 text-xs ${plan.highlight ? "text-white/70" : "text-slate-400 dark:text-gray-500"}`}>{plan.tagline}</p>

              <div className="mt-3">
                <div className="flex items-end gap-0.5">
                  <span className={`text-3xl font-extrabold ${plan.highlight ? "text-white" : "text-slate-900 dark:text-white"}`}>
                    {displayPrice}
                  </span>
                  {displayPeriod && (
                    <span className={`mb-1 text-sm ${plan.highlight ? "text-white/70" : "text-slate-400 dark:text-gray-500"}`}>
                      {displayPeriod}
                    </span>
                  )}
                </div>
                {showAnnual && "annualMonthlyEquiv" in plan && plan.annualMonthlyEquiv && (
                  <p className={`text-xs mt-0.5 ${plan.highlight ? "text-white/70" : "text-slate-400 dark:text-gray-500"}`}>
                    {plan.annualMonthlyEquiv} equivalent
                  </p>
                )}
                {!showAnnual && plan.annualPrice && (
                  <p className={`text-xs mt-0.5 ${plan.highlight ? "text-white/70" : "text-slate-400 dark:text-gray-500"}`}>
                    or {plan.annualPrice}/yr — save 20%
                  </p>
                )}
              </div>

              <ul className="mt-5 flex-1 space-y-2">
                {plan.features.map((f) => (
                  <li key={f} className={`flex items-start gap-2 text-sm ${plan.highlight ? "text-white" : "text-slate-600 dark:text-gray-300"}`}>
                    <CheckCircle2 className={`mt-0.5 h-4 w-4 shrink-0 ${plan.highlight ? "text-white/80" : "text-emerald-500"}`} />
                    {f}
                  </li>
                ))}
                {plan.notIncluded.map((f) => (
                  <li key={f} className={`flex items-start gap-2 text-sm line-through ${plan.highlight ? "text-white/40 decoration-white/30" : "text-slate-400 dark:text-gray-600 decoration-slate-300 dark:decoration-gray-700"}`}>
                    <span className="mt-0.5 h-4 w-4 shrink-0 text-center text-xs">✕</span>
                    {f}
                  </li>
                ))}
              </ul>

              <Link
                href={href}
                className={`mt-6 flex items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold transition-all ${
                  plan.highlight
                    ? "bg-white text-[#3B5BFC] hover:bg-slate-50 shadow-sm"
                    : "border border-slate-200 dark:border-white/10 text-slate-700 dark:text-gray-200 hover:bg-slate-50 dark:hover:bg-white/5"
                }`}
              >
                {plan.cta} <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          );
        })}
      </div>
    </>
  );
}
