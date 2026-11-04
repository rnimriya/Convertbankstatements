import Link from"next/link";
import { BUILD_NONCE } from "@/lib/csp-nonce";
import { DollarSign, ArrowRight, Upload, Download, Trash2, Pencil, Layers, FileSpreadsheet } from"lucide-react";
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
  { feature:"QuickBooks bulk tools (Importer, Exporter, Deleter, Editor, Merger)", free:"✓", basic:"✓", pro:"✓", business:"✓" },
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
      <Navbar />

      <div className="relative overflow-hidden px-6 pt-[124px] pb-28 text-center" style={{ background: "linear-gradient(180deg, #E9F5E4 0%, #F4FAF1 70%, #FFFFFF 100%)" }}>
        <div className="absolute left-1/2 -translate-x-1/2 -top-[420px] w-[1100px] h-[800px] pointer-events-none" style={{ background: "radial-gradient(closest-side, rgba(44,160,28,0.18), transparent 72%)" }} />
        <p className="relative inline-flex items-center gap-2 rounded-full bg-white border border-[#D8E8D2] px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-[0.12em] text-[#007A33] mb-4 shadow-sm"><span className="w-1.5 h-1.5 rounded-full bg-[#2CA01C] shrink-0" />Pricing</p>
        <h1 className="relative font-display text-[1.8rem] sm:text-[41.6px] font-bold text-[#0B1F16] leading-[1.08]">Simple, transparent <span className="text-[#2CA01C]">pricing</span></h1>
        <p className="relative mt-3 text-sm text-zinc-600">
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
        <PricingCards />
      </div>

      {/* Comparison table */}
      <div className="bg-[#F7FAF5] px-6 py-20">
        <div className="mx-auto max-w-6xl">
          <h2 className="mb-8 text-center font-display text-2xl font-bold text-zinc-900">Full comparison</h2>
          <div className="overflow-hidden rounded-[24px] border border-[#E3EDE0] bg-white">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#E3EDE0] bg-white">
                  <th className="px-5 py-3.5 text-left text-xs font-bold uppercase tracking-wider text-zinc-500">Feature</th>
                  {["Free","Basic","Pro","Business"].map((h) => (
                    <th key={h} className={`px-4 py-3.5 text-center text-xs font-bold uppercase tracking-wider ${h ==="Pro" ?"text-[#007A33]" :"text-zinc-500"}`}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {COMPARE_ROWS.map(({ feature, free, basic, pro, business }, i) => (
                  <tr key={feature} className={"bg-white"}>
                    <td className="px-5 py-3 font-medium text-zinc-700">{feature}</td>
                    {[free, basic, pro, business].map((val, j) => (
                      <td key={j} className={`px-4 py-3 text-center ${val ==="—" ?"text-zinc-300" : val ==="✓" ?"text-[#007A33] font-bold text-base" :"text-zinc-600"}`}>{val}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Bulk suite value section */}
      <div className="bg-white px-6 py-20">
        <div className="mx-auto max-w-6xl">
          <p className="mb-4 text-center"><span className="inline-flex items-center gap-2 rounded-full bg-white border border-[#D8E8D2] px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-[0.12em] text-[#007A33] shadow-sm"><span className="w-1.5 h-1.5 rounded-full bg-[#2CA01C] shrink-0" />Included free</span></p>
          <h2 className="text-center font-display text-2xl font-bold text-zinc-900 sm:text-3xl">The QuickBooks bulk suite is free — on every plan</h2>
          <p className="mx-auto mt-4 max-w-3xl text-center text-sm leading-relaxed text-zinc-600">
            Bulk importing, exporting, deleting, editing and merging QuickBooks files is sold as a premium add-on elsewhere:
            SaasAnt&apos;s bulk tools start at <strong className="text-zinc-800">$25/month</strong>, and Transaction Pro&apos;s
            Importer, Exporter &amp; Deleter bundle runs <strong className="text-zinc-800">$250/year</strong>. Here, the same
            file-based jobs are free for every user — no plan upgrade, no signup.
          </p>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { href: "/tools/bulk-import-quickbooks", name: "Bulk Importer for QuickBooks", desc: "Merge many CSV files, map columns once, build one QBO or IIF import file.", Icon: Upload },
              { href: "/tools/bulk-export-quickbooks", name: "Bulk Exporter for QuickBooks", desc: "Combine up to 10 QBO, OFX or QFX files into one clean CSV or Excel sheet.", Icon: Download },
              { href: "/tools/bulk-deleter-quickbooks", name: "Bulk Deleter for QuickBooks", desc: "Remove duplicate or unwanted transactions from a QBO file before importing.", Icon: Trash2 },
              { href: "/tools/qbo-file-editor", name: "QBO File Editor", desc: "Edit dates, names and amounts inside a QBO file, with find-and-replace.", Icon: Pencil },
              { href: "/tools/qbo-merger", name: "QBO File Merger", desc: "Combine several QBO files from the same account into one clean file.", Icon: Layers },
              { href: "/tools/iif-to-excel", name: "IIF to Excel Converter", desc: "Turn a QuickBooks Desktop IIF export into a readable Excel or CSV sheet.", Icon: FileSpreadsheet },
            ].map(({ href, name, desc, Icon }) => (
              <Link key={href} href={href} className="group flex flex-col rounded-[22px] border border-[#E3EDE0] bg-white p-5 shadow-[0_1px_3px_rgba(11,31,22,0.05)] hover:border-[#CBE3C4]">
                <span className="mb-3 flex h-[46px] w-[46px] items-center justify-center rounded-xl bg-[#EFF7ED] text-[#2CA01C]">
                  <Icon className="h-6 w-6" strokeWidth={1.8} />
                </span>
                <span className="font-display text-[15.5px] font-bold text-[#0B1F16]">{name}</span>
                <span className="mt-1 flex-1 text-[13px] leading-relaxed text-[#5C6F5B]">{desc}</span>
                <span className="mt-3 inline-flex items-center gap-1 text-[13px] font-semibold text-[#2CA01C]">
                  Open tool <ArrowRight className="h-3.5 w-3.5" />
                </span>
              </Link>
            ))}
          </div>
          <p className="mt-8 text-center text-[13px] text-zinc-500">
            These six are part of a library of <Link href="/tools" className="font-semibold text-[#2CA01C] underline underline-offset-2">15 completely free QuickBooks tools</Link> — free with every plan, including the free one.
          </p>
        </div>
      </div>

      <Footer />
    </div>
  );
}
