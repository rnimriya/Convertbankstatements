import type { Metadata } from "next";
import { ToolPageLayout, type ToolFaq } from "@/components/tools/ToolPageLayout";
import { PayoutConverter } from "@/components/tools/PayoutConverter";

const PAGE_URL = "https://www.convertstatement.online/tools/amazon-to-quickbooks";

export const metadata: Metadata = {
  title: "Amazon to QuickBooks Converter — Free Amazon Settlement to QBO | Convert Statement",
  description:
    "Free Amazon settlement to QuickBooks converter: turn an Amazon settlement CSV into clearing-account entries (gross sales, refunds, fees) with a settlement tie-out check. Free per-settlement summary with no account; QBO download is on Pro.",
  alternates: { canonical: PAGE_URL },
  openGraph: {
    title: "Amazon to QuickBooks Converter — Amazon Settlement to QBO",
    description:
      "Upload an Amazon settlement CSV — get gross, refunds, and fees split correctly for QuickBooks with a tie-out check. Free to scan.",
    url: PAGE_URL,
    type: "website",
  },
};

const FAQS: ToolFaq[] = [
  {
    q: "How do I record Amazon settlements in QuickBooks?",
    a: "Record by settlement, not by day. Each settlement bundles many orders with selling fees and refunds already deducted, and the deposit date rarely matches the order dates. This tool unpacks each settlement into gross sales, refunds, and fees through an Amazon clearing account, then transfers the net to checking — when the clearing account nets to zero, the settlement is reconciled.",
  },
  {
    q: "Which Amazon export should I upload?",
    a: "Amazon's settlement report (transaction view) as a CSV, with columns: settlement-id, date, transaction-type, order-id, amount, and fee. If your export uses different headers, rename them to match — settlement report layouts vary by marketplace and report version, so the tool reads exactly these six columns.",
  },
  {
    q: "What is the settlement tie-out check?",
    a: "The tool verifies Gross − Fees − Refunds = Payout for every settlement, against the deposit total in your settlement rows. A green 'Ties out' badge means the settlement reconciles to the penny. If it shows a difference, check Amazon for reserve holds, chargebacks, or orders from other periods swept into the settlement before importing.",
  },
  {
    q: "How are Amazon fees handled?",
    a: "Referral and fulfillment fees are expense lines through the clearing account, refunds are contra-income lines reducing gross sales, and chargebacks appear as their own lines. The fee column in your export is taken as given — the tool does not estimate Amazon's fee schedule.",
  },
  {
    q: "How do I import the QBO into QuickBooks?",
    a: "First create a bank account in QuickBooks named 'Amazon Clearing'. Import the QBO there, then match the transfer line against the real settlement deposit in your bank feed. When the clearing account nets to zero, the settlement is fully reconciled. The CSV works the same way through QuickBooks Online's manual upload.",
  },
  {
    q: "Is my data uploaded to your servers?",
    a: "No. Your CSV is processed in memory to build the settlement summary and is not stored afterwards. We never sell or share your financial data.",
  },
];

const HOWTO = [
  { title: "Export from Amazon", body: "In Seller Central, download the settlement report (transaction view) as a CSV, with settlement-id, date, transaction-type, order-id, amount, and fee columns." },
  { title: "Upload it here", body: "Drop the CSV in — the tool groups everything into settlements automatically." },
  { title: "Review the tie-out", body: "Check each settlement's gross, fees, and refunds, and confirm the settlement ties out to the bank deposit." },
  { title: "Import into QuickBooks", body: "Download the CSV free, or the QBO on Pro, and import it into an Amazon Clearing account in QuickBooks." },
];

export default function AmazonToQuickBooksPage() {
  return (
    <ToolPageLayout
      eyebrow="Free Tool"
      title="Amazon Settlement to QuickBooks"
      subtitle="Turn an Amazon settlement CSV into QuickBooks-ready books: gross sales, refunds, and fees correctly split through a clearing account — with a settlement tie-out check."
      tool={<PayoutConverter provider="amazon" />}
      currentPath="/tools/amazon-to-quickbooks"
      faqs={FAQS}
      howToName="How to record Amazon settlements in QuickBooks"
      howToSteps={HOWTO}
      privacyLine="No account needed to scan · Processed in memory, never stored"
      heroImage={{ src: "/images/tools/amazon-hero.webp", alt: "Illustrative photo: a seller packing parcels at a desk with a laptop" }}
      sectionImage={{ src: "/images/tools/amazon-section.webp", alt: "Illustrative photo: hands labelling a parcel beside a laptop" }}
      content={
        <>
          <h2 className="text-2xl font-extrabold text-zinc-900 dark:text-white">The clearing-account method</h2>
          <p className="mt-3 text-zinc-600 dark:text-zinc-300 leading-relaxed">
            An Amazon settlement bundles many days of orders with referral fees, fulfillment
            fees, and refunds already deducted — the deposit date rarely matches the order
            dates. The correct bookkeeping is to reconcile by settlement, not by day: record
            gross orders as income into a dedicated Amazon clearing account, record fees and
            refunds against the same account, then record the settlement as a transfer from
            the clearing account to your checking account. When the clearing account nets to
            zero, the settlement is reconciled to the penny.
          </p>
          <h2 className="text-2xl font-extrabold text-zinc-900 dark:text-white mt-12">What this tool handles</h2>
          <ul className="mt-4 space-y-2.5 text-zinc-600 dark:text-zinc-300 leading-relaxed">
            <li><strong className="text-zinc-900 dark:text-white">Settlement grouping</strong> — orders, refunds, chargebacks, and fees grouped by settlement ID.</li>
            <li><strong className="text-zinc-900 dark:text-white">Per-settlement summaries</strong> — gross, refunds, disputes, fees, and net, per settlement.</li>
            <li><strong className="text-zinc-900 dark:text-white">Tie-out verification</strong> — Gross − Fees − Refunds = Payout is checked against the bank deposit for every settlement.</li>
            <li><strong className="text-zinc-900 dark:text-white">Collision-proof IDs</strong> — every clearing entry carries a unique transaction ID derived from the settlement, so re-imports are deduped by QuickBooks.</li>
          </ul>
          <p className="mt-5 text-zinc-600 dark:text-zinc-300 leading-relaxed">
            Selling through other channels too? The same clearing-account model powers our{" "}
            <a href="/tools/free-stripe-to-quickbooks" className="text-blue-600 dark:text-blue-400 font-semibold hover:underline">Stripe QBO Converter</a>,{" "}
            <a href="/tools/shopify-to-quickbooks" className="text-blue-600 dark:text-blue-400 font-semibold hover:underline">Shopify Payout Converter</a>, and{" "}
            <a href="/tools/free-paypal-to-quickbooks" className="text-blue-600 dark:text-blue-400 font-semibold hover:underline">PayPal Payout Converter</a>.
            {" "}If QuickBooks refuses a file, the{" "}
            <a href="/tools/qbo-import-errors" className="text-blue-600 dark:text-blue-400 font-semibold hover:underline">QBO import-error decoder</a>{" "}
            explains the error and its fix.
          </p>
        </>
      }
    />
  );
}
