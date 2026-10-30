import type { Metadata } from "next";
import { ToolPageLayout, type ToolFaq } from "@/components/tools/ToolPageLayout";
import { PayoutConverterFree } from "@/components/tools/PayoutConverterFree";

const PAGE_URL = "https://www.convertstatement.online/tools/etsy-to-quickbooks";

export const metadata: Metadata = {
  title: "Etsy to QuickBooks Converter — Free Etsy Statement to QBO | Convert Statement",
  description:
    "Free Etsy to QuickBooks converter: turn an Etsy monthly statement CSV into clearing-account entries (gross sales, refunds, fees) with a deposit tie-out check. Both the CSV and QBO downloads are free, with no account needed.",
  alternates: { canonical: PAGE_URL },
  openGraph: {
    title: "Etsy to QuickBooks Converter — Etsy Statement to QBO",
    description:
      "Upload an Etsy statement CSV — get gross, refunds, and fees split correctly for QuickBooks with a tie-out check. CSV and QBO downloads are both free.",
    url: PAGE_URL,
    type: "website",
  },
};

const FAQS: ToolFaq[] = [
  {
    q: "How do I record Etsy deposits in QuickBooks?",
    a: "Record by deposit, not by day. Each Etsy deposit bundles many sales with transaction fees, listing fees, and refunds already deducted, and the deposit date rarely matches the sale dates. This tool unpacks each deposit into gross sales, refunds, and fees through an Etsy clearing account, then transfers the net to checking — when the clearing account nets to zero, the deposit is reconciled.",
  },
  {
    q: "Which Etsy export should I upload?",
    a: "The monthly statement CSV from Etsy Shop Manager → Finance, with columns: date, type, gross, fee, and net (a deposit-id column is optional and is used to group rows by deposit when present). If your export uses different headers, rename them to match — the tool reads exactly these columns.",
  },
  {
    q: "What is the deposit tie-out check?",
    a: "The tool verifies Gross − Fees − Refunds = Deposit for every deposit, against the deposit total in your statement rows. A green 'Ties out' badge means the deposit reconciles to the penny. If it shows a difference, check Etsy for reserve holds, chargebacks, or sales from other periods swept into the deposit before importing.",
  },
  {
    q: "How are Etsy fees handled?",
    a: "Transaction fees, listing fees, and taxes are expense lines through the clearing account, refunds are contra-income lines reducing gross sales, and chargebacks appear as their own lines. The fee column in your export is taken as given — the tool does not estimate Etsy's fee schedule.",
  },
  {
    q: "How do I import the QBO into QuickBooks?",
    a: "First create a bank account in QuickBooks named 'Etsy Clearing'. Import the QBO there, then match the transfer line against the real deposit in your bank feed. When the clearing account nets to zero, the deposit is fully reconciled. The CSV works the same way through QuickBooks Online's manual upload.",
  },
  {
    q: "Is this tool really free?",
    a: "Yes. The deposit summary, the CSV download, and the QBO download are all free on this tool, and no account is needed. Your CSV is processed in memory to build the summary and is not stored afterwards — we never sell or share your financial data.",
  },
];

const HOWTO = [
  { title: "Export from Etsy", body: "In Etsy Shop Manager, go to Finance and download the monthly statement CSV, with date, type, gross, fee, and net columns." },
  { title: "Upload it here", body: "Drop the CSV in — the tool groups everything into deposits automatically." },
  { title: "Review the tie-out", body: "Check each deposit's gross, fees, and refunds, and confirm the deposit ties out to the bank deposit." },
  { title: "Import into QuickBooks", body: "Download the CSV or the QBO — both are free — and import it into an Etsy Clearing account in QuickBooks." },
];

export default function EtsyToQuickBooksPage() {
  return (
    <ToolPageLayout
      fullyFree
      eyebrow="Free Tool"
      title="Etsy Statement to QuickBooks"
      subtitle="Turn an Etsy monthly statement CSV into QuickBooks-ready books: gross sales, refunds, and fees correctly split through a clearing account — with a deposit tie-out check. Both downloads are free, no account needed."
      tool={<PayoutConverterFree provider="etsy" />}
      currentPath="/tools/etsy-to-quickbooks"
      faqs={FAQS}
      howToName="How to record Etsy deposits in QuickBooks"
      howToSteps={HOWTO}
      privacyLine="No account needed · Both downloads free · Processed in memory, never stored"
      content={
        <>
          <h2 className="text-2xl font-extrabold text-zinc-900 dark:text-white">The clearing-account method</h2>
          <p className="mt-3 text-zinc-600 dark:text-zinc-300 leading-relaxed">
            An Etsy deposit bundles many days of sales with transaction fees, listing fees,
            and refunds already deducted — the deposit date rarely matches the sale dates.
            The correct bookkeeping is to reconcile by deposit, not by day: record gross
            sales as income into a dedicated Etsy clearing account, record fees and refunds
            against the same account, then record the deposit as a transfer from the clearing
            account to your checking account. When the clearing account nets to zero, the
            deposit is reconciled to the penny.
          </p>
          <h2 className="text-2xl font-extrabold text-zinc-900 dark:text-white mt-12">What this tool handles</h2>
          <ul className="mt-4 space-y-2.5 text-zinc-600 dark:text-zinc-300 leading-relaxed">
            <li><strong className="text-zinc-900 dark:text-white">Deposit grouping</strong> — sales, refunds, chargebacks, and fees grouped by deposit ID when your statement includes one.</li>
            <li><strong className="text-zinc-900 dark:text-white">Per-deposit summaries</strong> — gross, refunds, disputes, fees, and net, per deposit.</li>
            <li><strong className="text-zinc-900 dark:text-white">Tie-out verification</strong> — Gross − Fees − Refunds = Deposit is checked against the bank deposit for every deposit.</li>
            <li><strong className="text-zinc-900 dark:text-white">Collision-proof IDs</strong> — every clearing entry carries a unique transaction ID derived from the deposit, so re-imports are deduped by QuickBooks.</li>
          </ul>
          <p className="mt-5 text-zinc-600 dark:text-zinc-300 leading-relaxed">
            Selling through other channels too? The same clearing-account model powers our{" "}
            <a href="/tools/free-stripe-to-quickbooks" className="text-pine-600 dark:text-pine-400 font-semibold hover:underline">Stripe QBO Converter</a>,{" "}
            <a href="/tools/shopify-to-quickbooks" className="text-pine-600 dark:text-pine-400 font-semibold hover:underline">Shopify Payout Converter</a>,{" "}
            <a href="/tools/square-to-quickbooks" className="text-pine-600 dark:text-pine-400 font-semibold hover:underline">Square Payout Converter</a>, and{" "}
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
