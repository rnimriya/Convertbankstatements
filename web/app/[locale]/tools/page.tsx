import { Fragment } from "react";
import type { Metadata } from "next";
import { Link } from "@/i18n/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { BUILD_NONCE } from "@/lib/csp-nonce";
import { TOOL_CARDS } from "@/lib/tools/similar";
import ToolsGuideContent from "@/components/tools/ToolsGuideContent";
import BankLinks from "@/components/banks/BankLinks";
import { ArrowRight } from "lucide-react";

const PAGE_URL = "https://www.convertstatement.online/tools";

export const metadata: Metadata = {
  title: "All QuickBooks Tools — 44 Converters, Checkers & Fixers | Convert Statement",
  description:
    "Every Convert Statement tool on one page: CSV to QBO, QBO to CSV, payout converters for Stripe, PayPal, Amazon, Shopify, Square and Etsy, plus QBO checkers, a reconciliation finder and more. 34 tools are completely free.",
  alternates: { canonical: PAGE_URL },
  openGraph: {
    title: "All QuickBooks Tools — Converters, Checkers & Fixers",
    description:
      "44 focused tools for QuickBooks users: file converters, payout imports and pre-import checkers. 34 are completely free, no signup needed.",
    url: PAGE_URL,
    type: "website",
  },
};

type Tool = {
  slug: string;
  name: string;
  desc: string;
  tag?: "free" | "pop";
  dark?: boolean;
};

const FEATURED: Tool = {
  slug: "csv-to-qbo",
  name: "CSV to QBO Converter",
  desc: "Convert any CSV or Excel file into a QBO file QuickBooks imports cleanly.",
  tag: "pop",
};

const GROUPS: { label: string; tools: Tool[] }[] = [
  {
    label: "Converters",
    tools: [
      { slug: "qbo-to-csv", name: "QBO to CSV Converter", desc: "Turn a QBO file back into a clean CSV or Excel sheet you can edit.", tag: "free" },
      { slug: "csv-to-iif", name: "CSV to IIF Converter", desc: "Build IIF files for QuickBooks Desktop imports — no manual mapping pain.", tag: "free" },
      { slug: "ofx-to-qbo", name: "OFX to QBO + BID Fixer", desc: "Fix broken OFX/QFX files and the INTU.BID error so QuickBooks accepts them.", tag: "free" },
      { slug: "free-receipt-to-quickbooks", name: "Receipt to QuickBooks", desc: "Snap a receipt and get a QuickBooks-ready expense entry from it." },
      { slug: "bulk-import-quickbooks", name: "Bulk Importer for QuickBooks", desc: "Merge many CSV files, map the columns once, and build one QBO or IIF import file.", tag: "free" },
      { slug: "bulk-export-quickbooks", name: "Bulk Exporter for QuickBooks", desc: "Combine up to 10 QBO, OFX or QFX files into one clean CSV or Excel sheet.", tag: "free" },
      { slug: "iif-to-excel", name: "IIF to Excel Converter", desc: "Turn a QuickBooks Desktop IIF export into a readable Excel or CSV sheet.", tag: "free" },
      { slug: "csv-to-ofx", name: "CSV to OFX Converter", desc: "Turn a spreadsheet of transactions into an OFX file — the format banks and finance apps exchange.", tag: "free" },
      { slug: "csv-to-qfx", name: "CSV to QFX Converter", desc: "Build a QFX file from CSV rows — Quicken's version of OFX, ready to import.", tag: "free" },
      { slug: "csv-to-qif", name: "CSV to QIF Converter", desc: "Convert CSV transactions into a QIF file for older Quicken versions and legacy apps.", tag: "free" },
      { slug: "iif-to-csv", name: "IIF to CSV Converter", desc: "Turn a QuickBooks Desktop IIF file back into a plain CSV you can review in any spreadsheet.", tag: "free" },
    ],
  },
  {
    label: "Payout Converters",
    tools: [
      { slug: "free-stripe-to-quickbooks", name: "Stripe to QuickBooks", desc: "Convert Stripe payouts into QBO entries with fees split out properly." },
      { slug: "free-paypal-to-quickbooks", name: "PayPal to QuickBooks", desc: "Turn PayPal payout files into clean QuickBooks imports." },
      { slug: "amazon-to-quickbooks", name: "Amazon to QuickBooks", desc: "Amazon seller payouts converted into QuickBooks-ready files." },
      { slug: "shopify-to-quickbooks", name: "Shopify to QuickBooks", desc: "Shopify payout reports mapped and converted for QuickBooks." },
      { slug: "square-to-quickbooks", name: "Square to QuickBooks", desc: "Square payouts to QBO — sales, fees and taxes in the right lines.", tag: "free" },
      { slug: "etsy-to-quickbooks", name: "Etsy to QuickBooks", desc: "Etsy payment files converted into QuickBooks-ready imports.", tag: "free" },
    ],
  },
  {
    label: "File Converters",
    tools: [
      { slug: "ofx-to-csv", name: "OFX to CSV Converter", desc: "Read a bank OFX file into a clean CSV — one row per transaction.", tag: "free" },
      { slug: "ofx-to-qfx", name: "OFX to QFX Converter", desc: "Repackage an OFX download as QFX for Quicken, keeping the bank identity from the file.", tag: "free" },
      { slug: "ofx-to-pdf", name: "OFX to PDF Converter", desc: "Turn an OFX statement into a tidy PDF document you can print, file or share.", tag: "free" },
      { slug: "qbo-to-iif", name: "QBO to IIF Converter", desc: "Convert a QuickBooks Web Connect (QBO) file into IIF for QuickBooks Desktop.", tag: "free" },
      { slug: "qbo-to-pdf", name: "QBO to PDF Converter", desc: "Make a readable PDF statement from a QBO file — no QuickBooks needed to view it.", tag: "free" },
      { slug: "qfx-to-csv", name: "QFX to CSV Converter", desc: "Open a Quicken QFX download as a spreadsheet — every transaction as a row.", tag: "free" },
      { slug: "qfx-to-excel", name: "QFX to Excel Converter", desc: "Convert a QFX file straight into an Excel workbook you can sort and filter.", tag: "free" },
      { slug: "qfx-to-ofx", name: "QFX to OFX Converter", desc: "Convert Quicken's QFX back into plain OFX for other finance software.", tag: "free" },
      { slug: "qfx-to-pdf", name: "QFX to PDF Converter", desc: "Turn a QFX download into a clean PDF statement for your records.", tag: "free" },
      { slug: "qfx-to-qbo", name: "QFX to QBO Converter", desc: "Convert a Quicken QFX file into QBO so QuickBooks can import it.", tag: "free" },
      { slug: "qfx-to-qif", name: "QFX to QIF Converter", desc: "Convert QFX transactions into legacy QIF for older apps that still read it.", tag: "free" },
      { slug: "qif-to-csv", name: "QIF to CSV Converter", desc: "Rescue legacy QIF data into a modern CSV spreadsheet.", tag: "free" },
      { slug: "qif-to-excel", name: "QIF to Excel Converter", desc: "Convert a QIF file into an Excel workbook you can sort and filter.", tag: "free" },
      { slug: "qif-to-pdf", name: "QIF to PDF Converter", desc: "Turn a QIF file into a readable PDF statement you can print or share.", tag: "free" },
      { slug: "qif-to-qbo", name: "QIF to QBO Converter", desc: "Bring old Quicken QIF transactions into QuickBooks as a QBO file.", tag: "free" },
    ],
  },
  {
    label: "Checkers & Utilities",
    tools: [
      { slug: "free-qbo-cleanup-checker", name: "QBO Cleanup Checker", desc: "Scan your QBO file for duplicates and mess — free report, no signup." },
      { slug: "qbo-checker", name: "QBO File Checker", desc: "Verify a QBO file's balance chain and structure before you import it." },
      { slug: "qbo-import-errors", name: "QBO Import Error Decoder", desc: "Paste a QuickBooks import error and learn what it means and how to fix it." },
      { slug: "reconciliation-finder", name: "Reconciliation Finder", desc: "Compare a statement against QuickBooks to find missing or duplicate entries." },
      { slug: "qbo-splitter", name: "QBO File Splitter", desc: "Split a big QBO file into smaller chunks QuickBooks can handle.", tag: "free" },
      { slug: "bulk-deleter-quickbooks", name: "Bulk Deleter for QuickBooks", desc: "Remove duplicate or unwanted transactions from a QBO file before you import it.", tag: "free" },
      { slug: "qbo-file-editor", name: "QBO File Editor", desc: "Edit dates, names and amounts inside a QBO file, with find-and-replace for payees.", tag: "free" },
      { slug: "qbo-merger", name: "QBO File Merger", desc: "Combine several QBO files from the same account into one clean file.", tag: "free" },
      { slug: "invoice-import-checker", name: "Invoice Import Checker", desc: "Check invoice files for errors before they fail inside QuickBooks.", tag: "free" },
      { slug: "1099-checker", name: "1099 Vendor Checker", desc: "Check which vendors cross the 1099 threshold and need forms.", tag: "free" },
      { slug: "payroll-journal-generator", name: "Payroll Journal Generator", desc: "Build a balanced payroll journal entry for QuickBooks in minutes.", tag: "free" },
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
  const dark = tool.dark;
  const img = TOOL_CARDS[tool.slug]?.img;
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
      <img
        src={img}
        alt=""
        width={52}
        height={52}
        loading="lazy"
        className="mb-3 h-[52px] w-[52px] shrink-0 rounded-[14px] bg-[#F2F4EC] object-contain"
      />
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
      <main>
        {/* ── Hero ── */}
        <section className="relative overflow-hidden bg-gradient-to-b from-[#EFF7ED] to-[#F7FAF5] px-6 pt-[124px] pb-16 text-center">
          <div className="mx-auto w-full max-w-6xl">
          <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#D8E8D2] bg-white px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-[0.12em] text-[#007A33] shadow-sm">
            <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#2CA01C]" />
            The Toolbox
          </span>
          <h1 className="mx-auto mb-3 max-w-[760px] font-display font-bold leading-[1.08] tracking-tight text-[#0B1F16]" style={{ fontSize: "clamp(1.6rem, 3.2vw, 2.4rem)" }}>
            Small tools. <span className="text-[#2CA01C]">Big bookkeeping headaches,</span> gone.
          </h1>
          <p className="mx-auto max-w-[620px] text-base text-[#50614F]">
            Forty-four focused tools for QuickBooks users — each one does a single job properly, right in your browser.
          </p>
          <div className="mt-6 flex justify-center gap-10">
            <div>
              <span className="block font-display text-2xl font-bold text-[#0B1F16]">44</span>
              <span className="text-xs text-[#6B7D6A]">tools</span>
            </div>
            <div>
              <span className="block font-display text-2xl font-bold text-[#0B1F16]">34</span>
              <span className="text-xs text-[#6B7D6A]">completely free</span>
            </div>
            <div>
              <span className="block font-display text-2xl font-bold text-[#0B1F16]">4</span>
              <span className="text-xs text-[#6B7D6A]">categories</span>
            </div>
          </div>
          </div>
        </section>

        <div className="mx-auto w-full max-w-6xl px-6">
        {/* ── Bento grid ── */}
        <section className="grid grid-cols-1 gap-4 pb-4 pt-12 sm:grid-cols-2 lg:grid-cols-4">
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

        <ToolsGuideContent />

        <section className="mx-auto max-w-6xl px-6 pb-24 pt-4">
          <BankLinks />
        </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
