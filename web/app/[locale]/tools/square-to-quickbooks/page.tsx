import type { Metadata } from "next";
import { ToolPageLayout, type ToolFaq } from "@/components/tools/ToolPageLayout";
import { PayoutConverterFree } from "@/components/tools/PayoutConverterFree";

const PAGE_URL = "https://www.convertstatement.online/tools/square-to-quickbooks";

export const metadata: Metadata = {
  title: "Square to QuickBooks Converter — Free Square Payout to QBO | Convert Statement",
  description:
    "Free Square to QuickBooks converter: turn a Square payout CSV into clearing-account entries (gross sales, refunds, fees) with a payout tie-out check. Both the CSV and QBO downloads are free, with no account needed.",
  alternates: { canonical: PAGE_URL },
  openGraph: {
    title: "Square to QuickBooks Converter — Square Payout to QBO",
    description:
      "Upload a Square payout CSV — get gross, refunds, and fees split correctly for QuickBooks with a tie-out check. CSV and QBO downloads are both free.",
    url: PAGE_URL,
    type: "website",
  },
};

const FAQS: ToolFaq[] = [
  {
    q: "How do I record Square payouts in QuickBooks?",
    a: "Record by payout, not by day. Each Square payout bundles many sales with processing fees and refunds already deducted, and the deposit date rarely matches the sale dates. This tool unpacks each payout into gross sales, refunds, and fees through a Square clearing account, then transfers the net to checking — when the clearing account nets to zero, the payout is reconciled.",
  },
  {
    q: "Which Square export should I upload?",
    a: "A Square payout CSV with columns: payout-id, date, type, gross, fee, and net. In Square Dashboard, open your reports and export the payout detail as a CSV. If your export uses different headers, rename them to match — the tool reads exactly these six columns.",
  },
  {
    q: "What is the payout tie-out check?",
    a: "The tool verifies Gross − Fees − Refunds = Payout for every payout, against the deposit total in your payout rows. A green 'Ties out' badge means the payout reconciles to the penny. If it shows a difference, check Square for reserve holds, chargebacks, or sales from other periods swept into the payout before importing.",
  },
  {
    q: "How are Square fees handled?",
    a: "Processing fees are expense lines through the clearing account, refunds are contra-income lines reducing gross sales, and chargebacks appear as their own lines. The fee column in your export is taken as given — the tool does not estimate Square's fee schedule.",
  },
  {
    q: "How do I import the QBO into QuickBooks?",
    a: "First create a bank account in QuickBooks named 'Square Clearing'. Import the QBO there, then match the transfer line against the real payout deposit in your bank feed. When the clearing account nets to zero, the payout is fully reconciled. The CSV works the same way through QuickBooks Online's manual upload.",
  },
  {
    q: "Is this tool really free?",
    a: "Yes. The payout summary, the CSV download, and the QBO download are all free on this tool, and no account is needed. Your CSV is processed in memory to build the summary and is not stored afterwards — we never sell or share your financial data.",
  },
];

const HOWTO = [
  { title: "Export from Square", body: "In Square Dashboard, open your reports, export the payout detail as a CSV, with payout-id, date, type, gross, fee, and net columns." },
  { title: "Upload it here", body: "Drop the CSV in — the tool groups everything into payouts automatically." },
  { title: "Review the tie-out", body: "Check each payout's gross, fees, and refunds, and confirm the payout ties out to the bank deposit." },
  { title: "Import into QuickBooks", body: "Download the CSV or the QBO — both are free — and import it into a Square Clearing account in QuickBooks." },
];

export default function SquareToQuickBooksPage() {
  return (
    <ToolPageLayout
      fullyFree
      eyebrow="Free Tool"
      title="Square Payout to QuickBooks"
      subtitle="Turn a Square payout CSV into QuickBooks-ready books: gross sales, refunds, and fees correctly split through a clearing account — with a payout tie-out check. Both downloads are free, no account needed."
      tool={<PayoutConverterFree provider="square" />}
      currentPath="/tools/square-to-quickbooks"
      faqs={FAQS}
      howToName="How to record Square payouts in QuickBooks"
      howToSteps={HOWTO}
      privacyLine="No account needed · Both downloads free · Processed in memory, never stored"
      content={
        <>
          <h2 className="text-2xl font-extrabold text-zinc-900 dark:text-white">The clearing-account method</h2>
          <p className="mt-3 text-zinc-600 dark:text-zinc-300 leading-relaxed">
            A Square payout bundles many days of sales with processing fees and refunds
            already deducted — the deposit date rarely matches the sale dates. The correct
            bookkeeping is to reconcile by payout, not by day: record gross sales as income
            into a dedicated Square clearing account, record fees and refunds against the
            same account, then record the payout as a transfer from the clearing account to
            your checking account. When the clearing account nets to zero, the payout is
            reconciled to the penny.
          </p>
          <h2 className="text-2xl font-extrabold text-zinc-900 dark:text-white mt-12">What this tool handles</h2>
          <ul className="mt-4 space-y-2.5 text-zinc-600 dark:text-zinc-300 leading-relaxed">
            <li><strong className="text-zinc-900 dark:text-white">Payout grouping</strong> — sales, refunds, chargebacks, and fees grouped by payout ID.</li>
            <li><strong className="text-zinc-900 dark:text-white">Per-payout summaries</strong> — gross, refunds, disputes, fees, and net, per payout.</li>
            <li><strong className="text-zinc-900 dark:text-white">Tie-out verification</strong> — Gross − Fees − Refunds = Payout is checked against the bank deposit for every payout.</li>
            <li><strong className="text-zinc-900 dark:text-white">Collision-proof IDs</strong> — every clearing entry carries a unique transaction ID derived from the payout, so re-imports are deduped by QuickBooks.</li>
          </ul>
          <p className="mt-5 text-zinc-600 dark:text-zinc-300 leading-relaxed">
            Selling through other channels too? The same clearing-account model powers our{" "}
            <a href="/tools/free-stripe-to-quickbooks" className="text-pine-600 dark:text-pine-400 font-semibold hover:underline">Stripe QBO Converter</a>,{" "}
            <a href="/tools/shopify-to-quickbooks" className="text-pine-600 dark:text-pine-400 font-semibold hover:underline">Shopify Payout Converter</a>,{" "}
            <a href="/tools/etsy-to-quickbooks" className="text-pine-600 dark:text-pine-400 font-semibold hover:underline">Etsy Payout Converter</a>, and{" "}
            <a href="/tools/free-paypal-to-quickbooks" className="text-pine-600 dark:text-pine-400 font-semibold hover:underline">PayPal Payout Converter</a>.
            {" "}If QuickBooks refuses a file, the{" "}
            <a href="/tools/qbo-import-errors" className="text-pine-600 dark:text-pine-400 font-semibold hover:underline">QBO import-error decoder</a>{" "}
            explains the error and its fix.
          </p>
        </>
      }
    />
  );
}
