import Link from"next/link";
import { headers } from"next/headers";
import { DollarSign, ArrowRight } from"lucide-react";
import { Navbar } from"@/components/layout/Navbar";
import { Footer } from"@/components/layout/Footer";
import { PricingCards } from"@/components/PricingCards";

export const metadata = {
  title:"Pricing — Convert Statement",
  description:"Start free with 8 pages, then choose a Pro plan at $20/month (500 pages) or Business at $75/month (2,000 pages) for CAs and teams.",
  alternates: { canonical:"https://convertstatement.online/pricing" },
  openGraph: {
    title:"Pricing — Convert Statement",
    description:"8 pages free · Pro $20/mo · Business $75/mo",
    url:"https://convertstatement.online/pricing",
  },
};


const COMPARE_ROWS = [
  { feature:"Pages included", free:"8 total", pro:"500 / mo", business:"2,000 / mo" },
  { feature:"Price per document", free:"Free", pro:"Included", business:"Included" },
  { feature:"CSV export", free:"✓", pro:"✓", business:"✓" },
  { feature:"Excel export", free:"✓", pro:"✓", business:"✓" },
  { feature:"OFX / QFX export", free:"—", pro:"✓", business:"✓" },
  { feature:"Google Sheets", free:"—", pro:"✓", business:"✓" },
  { feature:"API access", free:"—", pro:"—", business:"✓" },
  { feature:"Team seats", free:"1", pro:"1", business:"5" },
  { feature:"Payment methods", free:"—", pro:"UPI/Card/NB", business:"UPI/Card/NB" },
];

const pricingSchema = {"@context":"https://schema.org","@type":"Product",
  name:"Convert Statement",
  description:"Convert bank statement PDFs from Wells Fargo, Citibank, U.S. Bank, Cadence Bank, Kotak and 400+ more into CSV, Excel, OFX for Tally, or Google Sheets.",
  url:"https://convertstatement.online",
  brand: {"@type":"Brand", name:"Convert Statement" },
  offers: [
    {"@type":"Offer",
      name:"Free",
      price:"0",
      priceCurrency:"USD",
      description:"8 pages free forever, no credit card required",
      availability:"https://schema.org/InStock",
      url:"https://convertstatement.online/signup",
    },
    {"@type":"Offer",
      name:"Basic",
      price:"5",
      priceCurrency:"USD",
      priceSpecification: {"@type":"UnitPriceSpecification",
        price:"5",
        priceCurrency:"USD",
        unitText:"month",
      },
      description:"25 pages/month, standard processing",
      availability:"https://schema.org/InStock",
      url:"https://convertstatement.online/signup?plan=basic",
    },
    {"@type":"Offer",
      name:"Pro",
      price:"20",
      priceCurrency:"USD",
      priceSpecification: {"@type":"UnitPriceSpecification",
        price:"20",
        priceCurrency:"USD",
        unitText:"month",
      },
      description:"500 pages/month, Google Sheets, priority processing",
      availability:"https://schema.org/InStock",
      url:"https://convertstatement.online/signup?plan=pro",
    },
    {"@type":"Offer",
      name:"Business",
      price:"75",
      priceCurrency:"USD",
      priceSpecification: {"@type":"UnitPriceSpecification",
        price:"75",
        priceCurrency:"USD",
        unitText:"month",
      },
      description:"2,000 pages/month for CA firms and fintech teams",
      availability:"https://schema.org/InStock",
      url:"https://convertstatement.online/signup?plan=business",
    },
  ],
};

export default async function PricingPage() {
  const nonce = (await headers()).get("x-nonce") ?? undefined;
  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950">
      <script
        nonce={nonce}
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(pricingSchema) }}
      />
      <Navbar />

      <div className="border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 px-6 py-8">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-extrabold text-zinc-900 dark:text-white">Simple, transparent pricing</h1>
            <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
              Start free · All prices in USD · No hidden charges
            </p>
          </div>
          <div className="flex items-center gap-1.5 rounded-full border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-4 py-2 text-xs font-medium text-zinc-500 dark:text-zinc-400 shadow-sm w-fit">
            <DollarSign className="h-3.5 w-3.5 text-violet-500 text-rose-500 dark:text-rose-400" />
            UPI · Cards · Net Banking · Wallets
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-6 pb-20 pt-8">
        <PricingCards />
      </div>

      {/* Comparison table */}
      <div className="bg-zinc-50 dark:bg-zinc-950 px-6 py-20">
        <div className="mx-auto max-w-5xl">
          <h2 className="mb-8 text-center text-2xl font-extrabold text-zinc-900 dark:text-white">Full comparison</h2>
          <div className="overflow-hidden rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 shadow-sm">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950">
                  <th className="px-5 py-3.5 text-left text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">Feature</th>
                  {["Free","Pro","Business"].map((h) => (
                    <th key={h} className={`px-4 py-3.5 text-center text-xs font-bold uppercase tracking-wider ${h ==="Pro" ?"text-violet-500 dark:text-violet-400" :"text-zinc-500 dark:text-zinc-400"}`}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {COMPARE_ROWS.map(({ feature, free, pro, business }, i) => (
                  <tr key={feature} className={i % 2 === 0 ?"bg-white dark:bg-zinc-950" :"bg-zinc-50 dark:bg-zinc-900/50 dark:bg-zinc-950/50"}>
                    <td className="px-5 py-3 font-medium text-zinc-700 dark:text-zinc-300">{feature}</td>
                    {[free, pro, business].map((val, j) => (
                      <td key={j} className={`px-4 py-3 text-center ${val ==="—" ?"text-zinc-300 dark:text-zinc-700" : val ==="✓" ?"text-emerald-500 font-bold text-base" :"text-zinc-600 dark:text-zinc-300"}`}>{val}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <section className="py-24 bg-zinc-900 dark:bg-zinc-950 relative overflow-hidden">
        <div
          className="absolute inset-0 pointer-events-none opacity-10"
          style={{
            backgroundImage:"linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
            backgroundSize:"40px 40px",
          }}
        />
        <div className="relative max-w-3xl mx-auto px-6 text-center">
          <p className="text-xs font-semibold text-white/50 uppercase tracking-widest mb-4">Get started today</p>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-white mb-4 leading-tight">Start with 8 free pages today</h2>
          <p className="text-white/60 mb-8 max-w-lg mx-auto leading-relaxed text-sm">No credit card required · Pay via UPI when you need more · Cancel anytime</p>
          <Link href="/signup" className="inline-flex items-center gap-2 px-7 py-4 rounded-xl text-sm font-bold transition-colors shadow-xl dark:shadow-none bg-black text-white hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200 border-0 shadow-none">
            Create free account
            <ArrowRight className="h-4 w-4 text-amber-500 dark:text-amber-400" />
          </Link>
          <p className="mt-5 text-xs text-white/40">No credit card required · Pay via UPI if you need more</p>
        </div>
      </section>
      <Footer />
    </div>
  );
}
