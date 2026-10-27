import type { Metadata } from "next";
import { ToolPageLayout, type ToolFaq } from "@/components/tools/ToolPageLayout";
import { ReceiptToQbo } from "@/components/tools/ReceiptToQbo";

const PAGE_URL = "https://www.convertstatement.online/tools/free-receipt-to-quickbooks";

export const metadata: Metadata = {
  title: "Receipt to QBO Converter — Free Photo Receipts for QuickBooks | Convert Statement",
  description:
    "Receipt to QBO in seconds: turn a receipt photo into QuickBooks-ready expense entries — AI reads the vendor, date, and totals, you review and edit, then download CSV free or QBO on Pro. Free account required, files never stored.",
  alternates: { canonical: PAGE_URL },
  openGraph: {
    title: "Receipt to QBO Converter — Free",
    description:
      "Snap a receipt photo — get editable, categorized expense lines ready for QuickBooks. Free CSV with a free account.",
    url: PAGE_URL,
    type: "website",
  },
};

const FAQS: ToolFaq[] = [
  {
    q: "How do I get a paper receipt into QuickBooks?",
    a: "Take a clear, straight-on photo of the full receipt and upload it here. AI reads the vendor, date, line items, and totals; you review and edit every line (and the category) before downloading. The CSV is free; a QBO of the expense lines is included on Pro.",
  },
  {
    q: "How accurate is the receipt reading?",
    a: "It handles clean printed receipts well, but handwriting, faded thermal print, folds, and glare can cause misreads — which is why every line is editable and the total is recomputed live as you fix things. Always compare the total to the receipt before importing.",
  },
  {
    q: "Are the expenses categorized automatically?",
    a: "Yes — each line gets a suggested category (Food & Dining, Fuel, Office Supplies, and so on) from the same vendor-rule engine our statement converter uses. You can change any category in the dropdown before downloading.",
  },
  {
    q: "Can I upload a PDF instead of a photo?",
    a: "Yes. PDF receipts go through the same extraction — text PDFs are read directly, scanned PDFs through AI vision.",
  },
  {
    q: "How do I import the QBO into QuickBooks?",
    a: "Import it like any bank file: QuickBooks Online via Transactions → Bank transactions → Upload a file, or Desktop via File → Utilities → Import → Web Connect Files. Each receipt line arrives as an expense transaction with a unique ID; categorize and reconcile as usual.",
  },
  {
    q: "Does QuickBooks have a receipt scanner?",
    a: "QuickBooks Online has receipt capture in its mobile app, which snaps a photo and attaches it to an expense inside QBO — handy for one-off receipts, but it only works inside QBO. This tool covers the rest of the pile: it turns any receipt photo into an importable QBO or CSV expense file with vendor, date, and totals already extracted, so it also works for QuickBooks Desktop and for shoeboxes of paper receipts a client hands you.",
  },
  {
    q: "Is my receipt uploaded to your servers?",
    a: "No. Your receipt is processed in memory to extract the line items and is not stored afterwards. We never sell or share your financial data.",
  },
];

const HOWTO = [
  { title: "Snap the receipt", body: "Take a clear, straight-on photo of the full receipt — or export it as PDF." },
  { title: "Upload it here", body: "Drop the photo in. AI reads the vendor, date, line items, and totals in seconds." },
  { title: "Review and edit", body: "Fix anything the AI misread, adjust categories, and confirm the total matches the receipt." },
  { title: "Download for QuickBooks", body: "Download the CSV free, or the QBO on Pro, and import it into QuickBooks like any bank file." },
];

export default function ReceiptToQuickBooksPage() {
  return (
    <ToolPageLayout
      eyebrow="Free Tool"
      title="Receipt to QBO Converter"
      subtitle="Snap a receipt photo and get QuickBooks-ready expense entries: vendor, date, and totals read by AI, every line editable, CSV free and QBO on Pro."
      tool={<ReceiptToQbo />}
      currentPath="/tools/free-receipt-to-quickbooks"
      faqs={FAQS}
      howToName="How to enter a receipt into QuickBooks"
      howToSteps={HOWTO}
      privacyLine="Free account · Processed in memory, never stored"
      content={
        <>
          <h2 className="text-2xl font-extrabold text-zinc-900 dark:text-white">Why receipts still eat bookkeeping time</h2>
          <p className="mt-3 text-zinc-600 dark:text-zinc-300 leading-relaxed">
            Bank feeds capture the charge, but not what was bought — and the paper receipt is the
            only record with the vendor, the line items, and the tax. Typing those by hand is
            slow and error-prone, and shoebox-at-tax-time is how deductions get missed. This tool
            reads the receipt for you, suggests a category for each line, and hands you a file
            QuickBooks accepts — with you in control of every line before it touches your books.
          </p>
          <h2 className="text-2xl font-extrabold text-zinc-900 dark:text-white mt-12">What this tool does</h2>
          <ul className="mt-4 space-y-2.5 text-zinc-600 dark:text-zinc-300 leading-relaxed">
            <li><strong className="text-zinc-900 dark:text-white">Reads photos and PDFs</strong> — receipt photos go through the same AI vision chain as our scanned-statement support; text PDFs are read directly.</li>
            <li><strong className="text-zinc-900 dark:text-white">Vendor, date, and total detection</strong> — plus individual line items when the receipt is itemized.</li>
            <li><strong className="text-zinc-900 dark:text-white">Editable everything</strong> — date, description, amount, and category can all be fixed before download; the total recomputes live.</li>
            <li><strong className="text-zinc-900 dark:text-white">Suggested categories</strong> — from the same vendor-rule engine that categorizes statement conversions.</li>
            <li><strong className="text-zinc-900 dark:text-white">QuickBooks-ready output</strong> — CSV free, QBO on Pro, each line a uniquely-identified expense transaction.</li>
          </ul>
          <p className="mt-5 text-zinc-600 dark:text-zinc-300 leading-relaxed">
            Converting statements too? Our{" "}
            <a href="/quickbooks" className="text-emerald-600 dark:text-emerald-400 font-semibold hover:underline">statement-to-QBO converter</a>{" "}
            handles full bank statements with a balance check, and the{" "}
            <a href="/tools/free-qbo-cleanup-checker" className="text-emerald-600 dark:text-emerald-400 font-semibold hover:underline">duplicate finder</a>{" "}
            keeps everything clean at month-end.
          </p>
        </>
      }
    />
  );
}
