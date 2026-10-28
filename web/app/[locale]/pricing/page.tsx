import Link from"next/link";
import { BUILD_NONCE } from "@/lib/csp-nonce";
import { DollarSign, ArrowRight } from"lucide-react";
import { Navbar } from"@/components/layout/Navbar";
import { Footer } from"@/components/layout/Footer";
import { PricingCards } from"@/components/PricingCards";

export const metadata = {
  title:"Pricing — Convert Statement",
  description:"Start free with 8 pages, then choose a Pro plan at $20/month (500 pages) or Business at $75/month (2,000 pages) for CAs and teams.",
  alternates: { canonical:"https://www.convertstatement.online/pricing" },
  openGraph: {
    title:"Pricing — Convert Statement",
    description:"8 pages free · Pro $20/mo · Business $75/mo",
    url:"https://www.convertstatement.online/pricing",
  },
};


const COMPARE_ROWS = [
  { feature:"Pages included", free:"8 total", basic:"25 / mo", pro:"500 / mo", business:"2,000 / mo" },
  { feature:"CSV export", free:"✓", basic:"✓", pro:"✓", business:"✓" },
  { feature:"Excel export", free:"✓", basic:"✓", pro:"✓", business:"✓" },
  { feature:"OFX / QFX export", free:"—", basic:"—", pro:"✓", business:"✓" },
  { feature:"QBO export (QuickBooks)", free:"—", basic:"—", pro:"✓", business:"✓" },
  { feature:"Google Sheets", free:"—", basic:"—", pro:"✓", business:"✓" },
  { feature:"API access", free:"—", basic:"—", pro:"—", business:"✓" },
  { feature:"Team seats", free:"1", basic:"1", pro:"1", business:"5" },
  { feature:"Payment methods", free:"—", basic:"Card", pro:"Card", business:"Card" },
  { feature:"Smart Auto-Categorization (Beta)", free:"✓", basic:"✓", pro:"✓", business:"✓" },
  { feature:"OCR for Scanned PDFs", free:"✓", basic:"✓", pro:"✓", business:"✓" },
  { feature:"Balance-Check reconciliation", free:"✓", basic:"✓", pro:"✓", business:"✓" },
  { feature:"Direct Accounting Push (Coming Soon)", free:"—", basic:"—", pro:"—", business:"Coming Soon" },
  { feature:"Pre-Export Analytics (Beta)", free:"✓", basic:"✓", pro:"✓", business:"✓" },
  { feature:"Secure Client Upload Portal (Beta)", free:"—", basic:"—", pro:"—", business:"✓" },
  { feature:"Multi-Client Workspace (Beta)", free:"—", basic:"—", pro:"—", business:"✓" },
];

const pricingSchema = {"@context":"https://schema.org","@type":"Product",
  name:"Convert Statement",
  description:"Convert bank statement PDFs from Wells Fargo, Citibank, U.S. Bank, Cadence Bank, Kotak and 400+ more into CSV, Excel, OFX for Tally, or Google Sheets.",
  url:"https://www.convertstatement.online",
  brand: {"@type":"Brand", name:"Convert Statement" },
  offers: [
    {"@type":"Offer",
      name:"Free",
      price:"0",
      priceCurrency:"USD",
      description:"8 pages free forever, no credit card required",
      availability:"https://schema.org/InStock",
      url:"https://www.convertstatement.online/signup",
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
      url:"https://www.convertstatement.online/signup?plan=basic",
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
      url:"https://www.convertstatement.online/signup?plan=pro",
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
      url:"https://www.convertstatement.online/signup?plan=business",
    },
  ],
};

export default async function PricingPage() {
  const nonce = BUILD_NONCE;
  return (
    <div className="agri-sans min-h-screen bg-white">
      <script
        nonce={nonce}
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(pricingSchema) }}
      />
      <Navbar dark />

      <div className="relative overflow-hidden bg-[#071106] px-6 pt-10 pb-28 text-center">
        <div className="absolute left-1/2 -translate-x-1/2 -top-[420px] w-[1100px] h-[800px] pointer-events-none" style={{ background: "radial-gradient(closest-side, rgba(100,203,72,0.38), rgba(19,84,28,0.28) 55%, transparent 75%)" }} />
        <p className="agri-mono relative inline-flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.16em] text-[#B9D6B2] mb-3"><span className="w-1.5 h-1.5 rounded-full bg-[#64CB48] shrink-0" />Pricing</p>
        <h1 className="relative text-4xl sm:text-[52px] font-extrabold text-white leading-[1.05]">Simple, transparent <span className="agri-serif">pricing</span></h1>
        <p className="relative mt-3 text-sm text-zinc-300">
          Start free · All prices in USD · No hidden charges
        </p>
        <div className="relative mt-5 flex justify-center">
          <div className="flex items-center gap-1.5 rounded-full border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-4 py-2 text-xs font-medium text-zinc-500 dark:text-zinc-400 shadow-sm w-fit">
            <DollarSign className="h-3.5 w-3.5 text-pine-500 text-rose-500 dark:text-rose-400" />
            UPI · Cards · Net Banking · Wallets
          </div>
        </div>
      </div>

      <div className="relative z-20 mx-auto max-w-6xl px-6 pb-20 -mt-20">
        <PricingCards toggleDark />
      </div>

      {/* Comparison table */}
      <div className="bg-[#F2F4EC] px-6 py-20">
        <div className="mx-auto max-w-6xl">
          <h2 className="mb-8 text-center text-2xl font-extrabold text-zinc-900">Full comparison</h2>
          <div className="overflow-hidden rounded-[24px] border border-[#D8DEC9] bg-white">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#D8DEC9] bg-[#F2F4EC]">
                  <th className="px-5 py-3.5 text-left text-xs font-bold uppercase tracking-wider text-zinc-500">Feature</th>
                  {["Free","Basic","Pro","Business"].map((h) => (
                    <th key={h} className={`px-4 py-3.5 text-center text-xs font-bold uppercase tracking-wider ${h ==="Pro" ?"text-[#13541C]" :"text-zinc-500"}`}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {COMPARE_ROWS.map(({ feature, free, basic, pro, business }, i) => (
                  <tr key={feature} className={i % 2 === 0 ?"bg-white" :"bg-[#F2F4EC]"}>
                    <td className="px-5 py-3 font-medium text-zinc-700">{feature}</td>
                    {[free, basic, pro, business].map((val, j) => (
                      <td key={j} className={`px-4 py-3 text-center ${val ==="—" ?"text-zinc-300" : val ==="✓" ?"text-[#13541C] font-bold text-base" :"text-zinc-600"}`}>{val}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <section className="py-24 bg-gradient-to-b from-[#0E3D15] to-[#13541C] relative overflow-hidden">
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
          <p className="text-white/60 mb-8 max-w-lg mx-auto leading-relaxed text-sm">No credit card required · Pay securely when you need more · Cancel anytime</p>
          <Link href="/signup" className="inline-flex items-center gap-2 px-7 py-4 rounded-full text-sm font-bold bg-[#64CB48] text-[#071106] border-0">
            Create free account
            <ArrowRight className="h-4 w-4 text-[#072b18]" />
          </Link>
          <p className="mt-5 text-xs text-white/40">No credit card required · Pay securely if you need more</p>
        </div>
      </section>
      <Footer />
    </div>
  );
}
