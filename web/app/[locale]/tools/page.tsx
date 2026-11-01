import { Fragment } from "react";
import type { Metadata } from "next";
import { Link } from "@/i18n/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { BUILD_NONCE } from "@/lib/csp-nonce";
import {
  ArrowRight,
  ArrowRightLeft,
  BookOpen,
  Calculator,
  ClipboardCheck,
  ClipboardList,
  CreditCard,
  FileDown,
  FileUp,
  Package,
  Receipt,
  Scale,
  ScanSearch,
  Scissors,
  ShieldCheck,
  ShoppingBag,
  ShoppingCart,
  Store,
  Wallet,
  Wrench,
  type LucideIcon,
} from "lucide-react";

const PAGE_URL = "https://www.convertstatement.online/tools";

export const metadata: Metadata = {
  title: "All QuickBooks Tools — 19 Free Converters, Checkers & Fixers | Convert Statement",
  description:
    "Every Convert Statement tool on one page: CSV to QBO, QBO to CSV, payout converters for Stripe, PayPal, Amazon, Shopify, Square and Etsy, plus QBO checkers, a reconciliation finder and more. 9 tools are completely free.",
  alternates: { canonical: PAGE_URL },
  openGraph: {
    title: "All QuickBooks Tools — Converters, Checkers & Fixers",
    description:
      "19 focused tools for QuickBooks users: file converters, payout imports and pre-import checkers. 9 are completely free, no signup needed.",
    url: PAGE_URL,
    type: "website",
  },
};

type Tool = {
  slug: string;
  name: string;
  desc: string;
  icon: LucideIcon;
  tag?: "free" | "pop";
  dark?: boolean;
};

const FEATURED: Tool = {
  slug: "csv-to-qbo",
  name: "CSV to QBO Converter",
  desc: "Convert any CSV or Excel file into a QBO file QuickBooks imports cleanly.",
  icon: ArrowRightLeft,
  tag: "pop",
};

const GROUPS: { label: string; tools: Tool[] }[] = [
  {
    label: "Converters",
    tools: [
      { slug: "qbo-to-csv", name: "QBO to CSV Converter", desc: "Turn a QBO file back into a clean CSV or Excel sheet you can edit.", icon: FileDown, tag: "free" },
      { slug: "csv-to-iif", name: "CSV to IIF Converter", desc: "Build IIF files for QuickBooks Desktop imports — no manual mapping pain.", icon: FileUp, tag: "free" },
      { slug: "ofx-to-qbo", name: "OFX to QBO + BID Fixer", desc: "Fix broken OFX/QFX files and the INTU.BID error so QuickBooks accepts them.", icon: Wrench, tag: "free" },
      { slug: "free-receipt-to-quickbooks", name: "Receipt to QuickBooks", desc: "Snap a receipt and get a QuickBooks-ready expense entry from it.", icon: Receipt },
    ],
  },
  {
    label: "Payout Converters",
    tools: [
      { slug: "free-stripe-to-quickbooks", name: "Stripe to QuickBooks", desc: "Convert Stripe payouts into QBO entries with fees split out properly.", icon: CreditCard },
      { slug: "free-paypal-to-quickbooks", name: "PayPal to QuickBooks", desc: "Turn PayPal payout files into clean QuickBooks imports.", icon: Wallet },
      { slug: "amazon-to-quickbooks", name: "Amazon to QuickBooks", desc: "Amazon seller payouts converted into QuickBooks-ready files.", icon: ShoppingCart },
      { slug: "shopify-to-quickbooks", name: "Shopify to QuickBooks", desc: "Shopify payout reports mapped and converted for QuickBooks.", icon: ShoppingBag },
      { slug: "square-to-quickbooks", name: "Square to QuickBooks", desc: "Square payouts to QBO — sales, fees and taxes in the right lines.", icon: Store, tag: "free" },
      { slug: "etsy-to-quickbooks", name: "Etsy to QuickBooks", desc: "Etsy payment files converted into QuickBooks-ready imports.", icon: Package, tag: "free" },
    ],
  },
  {
    label: "Checkers & Utilities",
    tools: [
      { slug: "free-qbo-cleanup-checker", name: "QBO Cleanup Checker", desc: "Scan your QBO file for duplicates and mess — free report, no signup.", icon: ScanSearch },
      { slug: "qbo-checker", name: "QBO File Checker", desc: "Verify a QBO file's balance chain and structure before you import it.", icon: ShieldCheck, dark: true },
      { slug: "qbo-import-errors", name: "QBO Import Error Decoder", desc: "Paste a QuickBooks import error and learn what it means and how to fix it.", icon: BookOpen },
      { slug: "reconciliation-finder", name: "Reconciliation Finder", desc: "Compare a statement against QuickBooks to find missing or duplicate entries.", icon: Scale },
      { slug: "qbo-splitter", name: "QBO File Splitter", desc: "Split a big QBO file into smaller chunks QuickBooks can handle.", icon: Scissors, tag: "free" },
      { slug: "invoice-import-checker", name: "Invoice Import Checker", desc: "Check invoice files for errors before they fail inside QuickBooks.", icon: ClipboardCheck, tag: "free" },
      { slug: "1099-checker", name: "1099 Vendor Checker", desc: "Check which vendors cross the 1099 threshold and need forms.", icon: ClipboardList, tag: "free" },
      { slug: "payroll-journal-generator", name: "Payroll Journal Generator", desc: "Build a balanced payroll journal entry for QuickBooks in minutes.", icon: Calculator, tag: "free" },
    ],
  },
];

const ALL_TOOLS: Tool[] = [FEATURED, ...GROUPS.flatMap((g) => g.tools)];

function Tag({ tag, dark }: { tag?: Tool["tag"]; dark?: boolean }) {
  if (tag === "free")
    return (
      <span className="inline-block rounded-full bg-[#E4F4E0] px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wide text-[#1E7A12]">
        100% Free
      </span>
    );
  if (tag === "pop")
    return (
      <span className="inline-block rounded-full bg-[#FFF3D6] px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wide text-[#8A6100]">
        Most popular
      </span>
    );
  return <span />;
}

function ToolCard({ tool, wide }: { tool: Tool; wide?: boolean }) {
  const Icon = tool.icon;
  const dark = tool.dark;
  return (
    <Link
      href={`/tools/${tool.slug}`}
      className={`group flex flex-col rounded-[22px] border p-5 shadow-[0_1px_3px_rgba(11,31,22,0.05)] transition-colors ${
        wide
          ? "border-[#D8E8D2] bg-[#EFF7ED] sm:col-span-2"
          : dark
            ? "border-[#0B1F16] bg-[#0B1F16]"
            : "border-[#E3EDE0] bg-white hover:border-[#CBE3C4]"
      }`}
    >
      <span
        className={`mb-3 flex h-[46px] w-[46px] items-center justify-center rounded-xl ${
          dark ? "bg-[#1C3A29] text-[#7BD96F]" : wide ? "bg-white text-[#2CA01C]" : "bg-[#EFF7ED] text-[#2CA01C]"
        }`}
      >
        <Icon className="h-6 w-6" strokeWidth={1.8} />
      </span>
      <span className={`font-display text-[15.5px] font-bold ${dark ? "text-white" : "text-[#0B1F16]"}`}>{tool.name}</span>
      <span className={`mt-1 flex-1 text-[13px] leading-relaxed ${dark ? "text-[#B9CDB4]" : "text-[#5C6F5B]"}`}>{tool.desc}</span>
      <span className="mt-3 flex items-center justify-between">
        <Tag tag={tool.tag} dark={dark} />
        <span className={`inline-flex items-center gap-1 text-[13px] font-semibold ${dark ? "text-[#7BD96F]" : "text-[#2CA01C]"}`}>
          Open tool <ArrowRight className="h-3.5 w-3.5" />
        </span>
      </span>
    </Link>
  );
}

export default function ToolsIndexPage() {
  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "QuickBooks Tools by Convert Statement",
    itemListElement: ALL_TOOLS.map((tool, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: tool.name,
      url: `https://www.convertstatement.online/tools/${tool.slug}`,
    })),
  };

  return (
    <div className="min-h-screen bg-[#F7FAF5]">
      <script
        nonce={BUILD_NONCE}
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
      />
      <Navbar />
      <main className="mx-auto w-full max-w-6xl px-6">
        {/* ── Hero ── */}
        <section className="pt-[124px]">
          <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#D8E8D2] bg-white px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-[0.12em] text-[#007A33] shadow-sm">
            <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#2CA01C]" />
            The Toolbox
          </span>
          <h1 className="mb-3 max-w-[760px] font-display text-[2rem] font-bold leading-[1.12] tracking-tight text-[#0B1F16] sm:text-[2.55rem]">
            Small tools. <span className="text-[#2CA01C]">Big bookkeeping headaches,</span> gone.
          </h1>
          <p className="max-w-[620px] text-base text-[#50614F]">
            Nineteen focused tools for QuickBooks users — each one does a single job properly, right in your browser.
          </p>
          <div className="mt-6 flex gap-10">
            <div>
              <span className="block font-display text-2xl font-bold text-[#0B1F16]">19</span>
              <span className="text-xs text-[#6B7D6A]">tools</span>
            </div>
            <div>
              <span className="block font-display text-2xl font-bold text-[#0B1F16]">9</span>
              <span className="text-xs text-[#6B7D6A]">completely free</span>
            </div>
            <div>
              <span className="block font-display text-2xl font-bold text-[#0B1F16]">3</span>
              <span className="text-xs text-[#6B7D6A]">categories</span>
            </div>
          </div>
        </section>

        {/* ── Bento grid ── */}
        <section className="grid grid-cols-1 gap-4 pb-4 pt-8 sm:grid-cols-2 lg:grid-cols-4">
          <ToolCard tool={FEATURED} wide />
          {GROUPS.map((group) => (
            <Fragment key={group.label}>
              <h2 className="col-span-full pt-5 text-[13px] font-bold uppercase tracking-[0.1em] text-[#8AA086]">
                {group.label}
              </h2>
              {group.tools.map((tool) => (
                <ToolCard key={tool.slug} tool={tool} />
              ))}
            </Fragment>
          ))}
        </section>

        <p className="pb-20 pt-8 text-center text-sm text-[#6B7D6A]">
          Not sure where to start? Most bookkeepers start with the{" "}
          <Link href="/tools/csv-to-qbo" className="font-semibold text-[#2CA01C] underline underline-offset-2">
            CSV to QBO Converter
          </Link>
          .
        </p>
      </main>
      <Footer />
    </div>
  );
}
