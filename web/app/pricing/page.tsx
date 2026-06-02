import Link from "next/link";
import { CheckCircle2, ArrowRight, FileText, IndianRupee } from "lucide-react";
import { Footer } from "@/components/layout/Footer";

export const metadata = { title: "Pricing — BankStatements India" };

const PLANS = [
  {
    name: "Free",
    price: "₹0",
    period: "",
    tagline: "Try it out — no card needed",
    highlight: false,
    badge: null,
    features: ["8 pages free, forever", "CSV & Excel export", "All Indian banks", "No credit card required"],
    notIncluded: ["OFX / QFX export", "Google Sheets"],
    cta: "Start free",
    href: "/signup",
  },
  {
    name: "Pay-per-doc",
    price: "₹49",
    period: "/ document",
    tagline: "No subscription, pay only when you need",
    highlight: false,
    badge: null,
    features: ["₹49 per document", "All export formats", "UPI / Cards / NetBanking", "All Indian banks"],
    notIncluded: ["Monthly page pool"],
    cta: "Get started",
    href: "/signup",
  },
  {
    name: "Pro",
    price: "₹399",
    period: "/ month",
    tagline: "Perfect for CAs & individuals",
    highlight: true,
    badge: "Most popular",
    features: ["200 pages / month", "All export formats", "Google Sheets export", "Priority processing", "Email support"],
    notIncluded: ["API access", "Team seats"],
    cta: "Start Pro",
    href: "/signup?plan=pro",
  },
  {
    name: "Business",
    price: "₹999",
    period: "/ month",
    tagline: "For CA firms & fintech teams",
    highlight: false,
    badge: null,
    features: ["500 pages / month", "All export formats", "Google Sheets export", "Priority processing", "API access", "5 team seats", "Dedicated support"],
    notIncluded: [],
    cta: "Start Business",
    href: "/signup?plan=business",
  },
];

const COMPARE_ROWS = [
  { feature: "Pages included", free: "8 total", payg: "—", pro: "200 / mo", business: "500 / mo" },
  { feature: "Price per document", free: "Free", payg: "₹49", pro: "Included", business: "Included" },
  { feature: "CSV export", free: "✓", payg: "✓", pro: "✓", business: "✓" },
  { feature: "Excel export", free: "✓", payg: "✓", pro: "✓", business: "✓" },
  { feature: "OFX / QFX export", free: "—", payg: "✓", pro: "✓", business: "✓" },
  { feature: "Google Sheets", free: "—", payg: "✓", pro: "✓", business: "✓" },
  { feature: "API access", free: "—", payg: "—", pro: "—", business: "✓" },
  { feature: "Team seats", free: "1", payg: "1", pro: "1", business: "5" },
  { feature: "Payment methods", free: "—", payg: "UPI/Card/NB", pro: "UPI/Card/NB", business: "UPI/Card/NB" },
];

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-white">
      <nav className="sticky top-0 z-50 border-b border-slate-100 bg-white/80 backdrop-blur-sm">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-600">
              <FileText className="h-4 w-4 text-white" />
            </div>
            <span className="font-bold text-slate-800">BankStatements</span>
          </Link>
          <div className="flex items-center gap-3">
            <Link href="/login" className="text-sm font-medium text-slate-600 hover:text-slate-900">Sign in</Link>
            <Link href="/signup" className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700">Get started free</Link>
          </div>
        </div>
      </nav>

      <div className="border-b border-slate-100 bg-slate-50 px-6 py-8">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900">Simple, transparent pricing</h1>
            <p className="mt-1 text-sm text-slate-500">
              Start free · All prices in INR · No hidden charges
            </p>
          </div>
          <div className="flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-medium text-slate-500 shadow-sm w-fit">
            <IndianRupee className="h-3.5 w-3.5 text-brand-500" />
            UPI · Cards · Net Banking · Wallets
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-6 pb-20">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {PLANS.map((plan) => (
            <div
              key={plan.name}
              className={`relative flex flex-col rounded-2xl border p-6 shadow-sm ${
                plan.highlight ? "border-brand-500 shadow-lg shadow-brand-100" : "border-slate-200 bg-white"
              }`}
            >
              {plan.badge && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-brand-600 px-3 py-1 text-xs font-bold text-white whitespace-nowrap">
                  {plan.badge}
                </div>
              )}
              <p className="font-bold text-slate-800">{plan.name}</p>
              <p className="mt-0.5 text-xs text-slate-400">{plan.tagline}</p>
              <div className="mt-3 flex items-end gap-0.5">
                <span className="text-3xl font-extrabold text-slate-900">{plan.price}</span>
                {plan.period && <span className="mb-1 text-sm text-slate-400">{plan.period}</span>}
              </div>

              <ul className="mt-5 flex-1 space-y-2">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm text-slate-600">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                    {f}
                  </li>
                ))}
                {plan.notIncluded.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm text-slate-400 line-through decoration-slate-300">
                    <span className="mt-0.5 h-4 w-4 shrink-0 text-center text-xs text-slate-300">✕</span>
                    {f}
                  </li>
                ))}
              </ul>

              <Link
                href={plan.href}
                className={`mt-6 flex items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-semibold transition-colors ${
                  plan.highlight
                    ? "bg-brand-600 text-white hover:bg-brand-700"
                    : "border border-slate-200 text-slate-700 hover:bg-slate-50"
                }`}
              >
                {plan.cta} <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          ))}
        </div>
      </div>

      {/* Comparison table */}
      <div className="bg-slate-50 px-6 py-20">
        <div className="mx-auto max-w-5xl">
          <h2 className="mb-8 text-center text-2xl font-extrabold text-slate-900">Full comparison</h2>
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50">
                  <th className="px-5 py-3.5 text-left text-xs font-bold uppercase tracking-wider text-slate-500">Feature</th>
                  {["Free", "Pay-per-doc", "Pro", "Business"].map((h) => (
                    <th key={h} className={`px-4 py-3.5 text-center text-xs font-bold uppercase tracking-wider ${h === "Pro" ? "text-brand-600" : "text-slate-500"}`}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {COMPARE_ROWS.map(({ feature, free, payg, pro, business }, i) => (
                  <tr key={feature} className={i % 2 === 0 ? "bg-white" : "bg-slate-50/50"}>
                    <td className="px-5 py-3 font-medium text-slate-700">{feature}</td>
                    {[free, payg, pro, business].map((val, j) => (
                      <td key={j} className={`px-4 py-3 text-center ${val === "—" ? "text-slate-300" : val === "✓" ? "text-emerald-500 font-bold text-base" : "text-slate-600"}`}>{val}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="bg-brand-600 px-6 py-16 text-center">
        <h2 className="text-2xl font-extrabold text-white sm:text-3xl">Start with 8 free pages today</h2>
        <p className="mt-2 text-brand-100">No credit card · Pay via UPI when you need more</p>
        <Link href="/signup" className="mt-6 inline-flex items-center gap-2 rounded-xl bg-white px-8 py-3 font-bold text-brand-700 hover:bg-brand-50 transition-colors">
          Create free account <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
      <Footer />
    </div>
  );
}
