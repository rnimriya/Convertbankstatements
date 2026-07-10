"use client";

import { useState } from"react";
import Link from"next/link";
import { Check, ArrowRight } from"lucide-react";

const MONTHLY_PLANS = [
  {
    name:"Free",
    price:"$0",
    period:"",
    annualPrice: null,
    annualPeriod: null,
    tagline:"Try it out — no card needed",
    highlight: false,
    badge: null,
    features: ["8 pages free, forever","CSV & Excel export","Global banks support","No credit card required"],
    notIncluded: ["OFX / QFX export","Google Sheets"],
    cta:"Start free",
    href:"/signup",
    annualHref:"/signup",
  },
  {
    name:"Basic",
    price:"$5",
    period:"/ mo",
    annualPrice:"$48",
    annualPeriod:"/ year",
    annualMonthlyEquiv:"$4/mo",
    tagline:"For light, occasional use",
    highlight: false,
    badge: null,
    features: ["25 pages / month","CSV & Excel export","Global banks support","Email support"],
    notIncluded: ["Google Sheets","OFX / QFX export"],
    cta:"Start Basic",
    href:"/signup?plan=basic",
    annualHref:"/signup?plan=basic_annual",
  },
  {
    name:"Pro",
    price:"$20",
    period:"/ mo",
    annualPrice:"$192",
    annualPeriod:"/ year",
    annualMonthlyEquiv:"$16/mo",
    tagline:"Perfect for CAs & individuals",
    highlight: true,
    badge:"Most popular",
    features: ["500 pages / month","All export formats","Google Sheets export","Priority processing","Smart Auto-Categorization (Beta)","Pre-Export Analytics (Beta)","Email support"],
    notIncluded: ["API access","Team seats"],
    cta:"Start Pro",
    href:"/signup?plan=pro",
    annualHref:"/signup?plan=pro_annual",
  },
  {
    name:"Business",
    price:"$75",
    period:"/ month",
    annualPrice:"$720",
    annualPeriod:"/ year",
    annualMonthlyEquiv:"$60/mo",
    tagline:"For CA firms & fintech teams",
    highlight: false,
    badge: null,
    features: ["2,000 pages / month","All export formats","OCR for Scanned PDFs (Coming Soon)","Direct Accounting Push (Coming Soon)","Smart Auto-Categorization (Beta)","Pre-Export Analytics (Beta)","Secure Client Portal (Beta)","API access","5 team seats","Dedicated support"],
    notIncluded: [],
    cta:"Start Business",
    href:"/signup?plan=business",
    annualHref:"/signup?plan=business_annual",
  },
];

export function PricingCards() {
  const [annual, setAnnual] = useState(false);

  return (
    <>
      {/* Billing toggle */}
      <div className="flex items-center justify-center gap-3 mb-10">
        <span className={`text-sm font-medium transition-colors ${!annual ?"text-zinc-900 dark:text-white" :"text-zinc-400"}`}>
          Monthly
        </span>
        <button
          onClick={() => setAnnual(a => !a)}
          className={`relative w-11 h-6 rounded-full transition-colors duration-200 focus:outline-none ${annual ?"bg-zinc-900 dark:bg-zinc-100" :"bg-brand-border"}`}
          role="switch"
          aria-checked={annual}
        >
          <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white dark:bg-zinc-900 rounded-full transition-transform duration-200 ${annual ?"translate-x-5" :"translate-x-0"}`} />
        </button>
        <span className={`text-sm font-medium transition-colors ${annual ?"text-zinc-900 dark:text-white" :"text-zinc-400"}`}>
          Annual
        </span>
        {annual && (
          <span className="bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 text-xs font-bold px-2.5 py-1 rounded-full border border-zinc-200 dark:border-zinc-700">
            Save 20%
          </span>
        )}
      </div>

      {/* Cards */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 items-stretch max-w-6xl mx-auto">
        {MONTHLY_PLANS.map((plan) => {
          const showAnnual = annual && plan.annualPrice !== null;
          const displayPrice = showAnnual ? plan.annualPrice! : plan.price;
          const displayPeriod = showAnnual ? plan.annualPeriod! : plan.period;
          const href = showAnnual ? plan.annualHref : plan.href;

          if (plan.highlight) {
            /* ── PRO — featured card ── */
            return (
              <div key={plan.name} className="relative pt-5 h-full">
                {/* Badge */}
                <div className="absolute -top-0 left-1/2 -translate-x-1/2 z-10">
                  <span className="inline-block bg-brand-bg rounded-full px-5 py-1.5 text-xs font-black text-zinc-900 dark:text-zinc-100 border border-brand-border whitespace-nowrap">
                    {plan.badge}
                  </span>
                </div>

                <div
                  className="relative flex flex-col h-full rounded-3xl p-7 overflow-hidden bg-zinc-900"
                >
                  <p className="font-black text-white text-lg mb-0.5">{plan.name}</p>
                  <p className="text-zinc-400 text-xs mb-5">{plan.tagline}</p>

                  {/* Price */}
                  <div className="mb-1">
                    <div className="flex items-end gap-1.5">
                      <span className="text-5xl font-black text-white tracking-tight">{displayPrice}</span>
                      {displayPeriod && <span className="text-zinc-400 text-base mb-1">{displayPeriod}</span>}
                    </div>
                    {showAnnual &&"annualMonthlyEquiv" in plan && plan.annualMonthlyEquiv && (
                      <p className="text-brand-muted text-xs mt-1">{plan.annualMonthlyEquiv} equivalent</p>
                    )}
                    {!showAnnual && plan.annualPrice && (
                      <p className="text-brand-muted text-xs mt-1">or {plan.annualPrice}/yr — save 20%</p>
                    )}
                  </div>

                  {/* Divider */}
                  <div className="h-px bg-zinc-800 my-5" />

                  {/* Features */}
                  <ul className="space-y-3 flex-1 mb-8">
                    {plan.features.map(f => (
                      <li key={f} className="flex items-center gap-3 text-sm text-zinc-300">
                        <div className="w-5 h-5 rounded-full border border-zinc-700 flex items-center justify-center shrink-0">
                          <Check size={11} className="text-emerald-500 dark:text-emerald-400" />
                        </div>
                        {f}
                      </li>
                    ))}
                    {plan.notIncluded.map(f => (
                      <li key={f} className="flex items-center gap-3 text-sm text-zinc-600 line-through">
                        <div className="w-5 h-5 rounded-full border border-zinc-800 flex items-center justify-center shrink-0">
                          <span className="text-[9px] text-zinc-600">✕</span>
                        </div>
                        {f}
                      </li>
                    ))}
                  </ul>

                  <Link
                    href={href}
                    className="flex items-center justify-center gap-2 rounded-2xl py-3.5 text-sm font-bold transition-colors shadow-sm bg-black text-white hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200 border-0 shadow-none"
                  >
                    {plan.cta} <ArrowRight className="h-3.5 w-3.5 text-amber-500 dark:text-amber-400" />
                  </Link>
                </div>
              </div>
            );
          }

          /* ── Non-featured cards ── */
          return (
            <div
              key={plan.name}
              className="relative flex flex-col h-full rounded-3xl border border-brand-border bg-brand-bg p-7 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors"
            >
              {plan.badge && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-white dark:bg-zinc-900 px-4 py-1 text-xs font-bold text-zinc-900 dark:text-zinc-100 whitespace-nowrap border border-zinc-200 dark:border-zinc-700">
                  {plan.badge}
                </div>
              )}

              <p className="font-black text-zinc-900 dark:text-white text-lg mb-0.5">{plan.name}</p>
              <p className="text-brand-muted text-xs mb-5">{plan.tagline}</p>

              <div className="mb-1">
                <div className="flex items-end gap-1.5">
                  <span className="text-4xl font-black text-zinc-900 dark:text-white tracking-tight">{displayPrice}</span>
                  {displayPeriod && <span className="text-brand-muted text-sm mb-1">{displayPeriod}</span>}
                </div>
                {showAnnual &&"annualMonthlyEquiv" in plan && (plan as typeof plan & { annualMonthlyEquiv: string }).annualMonthlyEquiv && (
                  <p className="text-brand-muted text-xs mt-1">{(plan as typeof plan & { annualMonthlyEquiv: string }).annualMonthlyEquiv} equivalent</p>
                )}
                {!showAnnual && plan.annualPrice && (
                  <p className="text-brand-muted text-xs mt-1">or {plan.annualPrice}/yr — save 20%</p>
                )}
                {/* Reserve the sub-line height (e.g. Free has no annual price) so all dividers align */}
                {!plan.annualPrice && <p className="text-xs mt-1 invisible" aria-hidden="true">.</p>}
              </div>

              <div className="h-px bg-brand-border my-5" />

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
                  <li key={f} className="flex items-center gap-3 text-sm text-zinc-400 dark:text-zinc-600 line-through">
                    <div className="w-5 h-5 rounded-full border border-brand-border flex items-center justify-center shrink-0">
                      <span className="text-[9px] text-zinc-400">✕</span>
                    </div>
                    {f}
                  </li>
                ))}
              </ul>

              <Link
                href={href}
                className="flex items-center justify-center gap-2 rounded-2xl py-3.5 text-sm font-bold transition-all shadow-sm bg-black text-white hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200 border-0 shadow-none"
              >
                {plan.cta} <ArrowRight className="h-3.5 w-3.5 text-amber-500 dark:text-amber-400" />
              </Link>
            </div>
          );
        })}
      </div>
    </>
  );
}
