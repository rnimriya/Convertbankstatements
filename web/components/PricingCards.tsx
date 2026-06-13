"use client";

import { useState } from "react";
import Link from "next/link";
import { Check, ArrowRight } from "lucide-react";

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
      <div className="flex items-center justify-center gap-3 mb-10">
        <span className={`text-sm font-medium transition-colors ${!annual ? "text-slate-900 dark:text-white" : "text-slate-400"}`}>
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
        <span className={`text-sm font-medium transition-colors ${annual ? "text-slate-900 dark:text-white" : "text-slate-400"}`}>
          Annual
        </span>
        {annual && (
          <span className="bg-emerald-100 text-emerald-700 text-xs font-bold px-2.5 py-1 rounded-full">
            Save 20%
          </span>
        )}
      </div>

      {/* Cards */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 items-start">
        {MONTHLY_PLANS.map((plan) => {
          const showAnnual = annual && plan.annualPrice !== null;
          const displayPrice = showAnnual ? plan.annualPrice! : plan.price;
          const displayPeriod = showAnnual ? plan.annualPeriod! : plan.period;
          const href = showAnnual ? plan.annualHref : plan.href;

          if (plan.highlight) {
            /* ── PRO — featured card ── */
            return (
              <div key={plan.name} className="relative pt-5">
                {/* Badge */}
                <div className="absolute -top-0 left-1/2 -translate-x-1/2 z-10">
                  <span className="inline-block bg-white rounded-full px-5 py-1.5 text-xs font-black text-[#3B5BFC] shadow-md whitespace-nowrap border border-white">
                    {plan.badge}
                  </span>
                </div>

                <div
                  className="relative flex flex-col rounded-3xl p-7 overflow-hidden"
                  style={{
                    background: "linear-gradient(160deg,#3B5BFC 0%,#2645e0 100%)",
                    boxShadow: "0 20px 60px rgba(59,91,252,0.40), 0 4px 20px rgba(59,91,252,0.20)",
                  }}
                >
                  {/* Subtle orb top-right */}
                  <div className="absolute top-0 right-0 w-40 h-40 rounded-full opacity-10 pointer-events-none" style={{ background: "radial-gradient(circle,white,transparent)", transform: "translate(30%,-30%)" }} />

                  <p className="font-black text-white text-lg mb-0.5">{plan.name}</p>
                  <p className="text-white/60 text-xs mb-5">{plan.tagline}</p>

                  {/* Price */}
                  <div className="mb-1">
                    <div className="flex items-end gap-1.5">
                      <span className="text-5xl font-black text-white tracking-tight">{displayPrice}</span>
                      {displayPeriod && <span className="text-white/60 text-base mb-1">{displayPeriod}</span>}
                    </div>
                    {showAnnual && "annualMonthlyEquiv" in plan && plan.annualMonthlyEquiv && (
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

                  <Link
                    href={href}
                    className="flex items-center justify-center gap-2 rounded-2xl py-3.5 text-sm font-black text-[#3B5BFC] bg-white hover:bg-slate-50 transition-colors shadow-lg"
                  >
                    {plan.cta} <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            );
          }

          /* ── Non-featured cards ── */
          return (
            <div
              key={plan.name}
              className="relative flex flex-col rounded-3xl border border-slate-200 dark:border-white/10 bg-white dark:bg-surface p-7 shadow-sm hover:shadow-md transition-shadow"
            >
              {plan.badge && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-white px-4 py-1 text-xs font-bold text-navy whitespace-nowrap shadow-sm border border-slate-200">
                  {plan.badge}
                </div>
              )}

              <p className="font-black text-slate-900 dark:text-white text-lg mb-0.5">{plan.name}</p>
              <p className="text-slate-400 text-xs mb-5">{plan.tagline}</p>

              <div className="mb-1">
                <div className="flex items-end gap-1.5">
                  <span className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">{displayPrice}</span>
                  {displayPeriod && <span className="text-slate-400 text-sm mb-1">{displayPeriod}</span>}
                </div>
                {showAnnual && "annualMonthlyEquiv" in plan && (plan as typeof plan & { annualMonthlyEquiv: string }).annualMonthlyEquiv && (
                  <p className="text-slate-400 text-xs mt-1">{(plan as typeof plan & { annualMonthlyEquiv: string }).annualMonthlyEquiv} equivalent</p>
                )}
                {!showAnnual && plan.annualPrice && (
                  <p className="text-slate-400 text-xs mt-1">or {plan.annualPrice}/yr — save 20%</p>
                )}
              </div>

              <div className="h-px bg-slate-100 dark:bg-white/10 my-5" />

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

              <Link
                href={href}
                className="flex items-center justify-center gap-2 rounded-2xl py-3.5 text-sm font-bold border-2 border-slate-200 dark:border-white/10 text-slate-700 dark:text-gray-200 hover:border-navy hover:text-navy dark:hover:border-brand-400 dark:hover:text-brand-400 transition-all"
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
