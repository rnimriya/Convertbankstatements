import type { Metadata } from "next";
import { ToolPageLayout, type ToolFaq } from "@/components/tools/ToolPageLayout";
import { PayoutConverter } from "@/components/tools/PayoutConverter";

const PAGE_URL = "https://www.convertstatement.online/tools/shopify-to-quickbooks";

export const metadata: Metadata = {
  title: "Shopify to QuickBooks Converter — Free Shopify Payout to QBO | Convert Statement",
  description:
    "Free Shopify payout to QuickBooks converter: turn a Shopify Payments payout CSV into clearing-account entries (gross sales, refunds, fees) with a payout tie-out check. Free per-payout summary with no account; QBO download is on Pro.",
  alternates: { canonical: PAGE_URL },
  openGraph: {
    title: "Shopify to QuickBooks Converter — Shopify Payout to QBO",
    description:
      "Upload a Shopify Payments payout CSV — get gross, refunds, and fees split correctly for QuickBooks with a tie-out check. Free to scan.",
    url: PAGE_URL,
    type: "website",
  },
};

const FAQS: ToolFaq[] = [
  {
    q: "How do I record Shopify payouts in QuickBooks?",
    a: "Record by payout, not by day. Each Shopify Payments payout bundles many orders with processing fees and refunds already deducted, and the deposit date rarely matches the order dates. This tool unpacks each payout into gross sales, refunds, and fees through a Shopify clearing account, then transfers the net to checking — when the clearing account nets to zero, the payout is reconciled.",
  },
  {
    q: "Which Shopify export should I upload?",
    a: "The Shopify Payments payout export as a CSV, with columns: payout-id, date, type, gross, fee, and net. In Shopify admin, go to Settings → Payments → Shopify Payments → View payouts, open a payout, and export its transactions.",
  },
  {
    q: "What is the payout tie-out check?",
    a: "The tool verifies Gross − Fees − Refunds = Payout for every payout, against the deposit total in your payout rows. A green 'Ties out' badge means the payout reconciles to the penny. If it shows a difference, check Shopify for reserves, chargebacks, or orders from other days swept into the payout before importing.",
  },
  {
    q: "Does this handle Shopify's own fees and third-party gateways?",
    a: "It handles what is in the Shopify Payments export: Shopify Payments processing fees, refunds, and chargebacks. Sales taken through a third-party gateway (Stripe, PayPal, and others) settle through that gateway, not through Shopify Payments — convert those with the matching tool (Stripe or PayPal) so each deposit is reconciled against the right clearing account.",
  },
  {
    q: "How do I import the QBO into QuickBooks?",
    a: "First create a bank account in QuickBooks named 'Shopify Clearing'. Import the QBO there, then match the transfer line against the real payout deposit in your bank feed. When the clearing account nets to zero, the payout is fully reconciled. The CSV works the same way through QuickBooks Online's manual upload.",
  },
  {
    q: "Is my data uploaded to your servers?",
    a: "No. Your CSV is processed in memory to build the payout summary and is not stored afterwards. We never sell or share your financial data.",
  },
];

const HOWTO = [
  { title: "Export from Shopify", body: "In Shopify admin, open a Shopify Payments payout and export its transactions as a CSV (payout-id, date, type, gross, fee, net)." },
  { title: "Upload it here", body: "Drop the CSV in — the tool groups everything into payouts automatically." },
  { title: "Review the tie-out", body: "Check each payout's gross, fees, and refunds, and confirm the payout ties out to the bank deposit." },
  { title: "Import into QuickBooks", body: "Download the CSV free, or the QBO on Pro, and import it into a Shopify Clearing account in QuickBooks." },
];

export default function ShopifyToQuickBooksPage() {
  return (
    <ToolPageLayout
      eyebrow="Free Tool"
      title="Shopify Payout to QuickBooks"
      subtitle="Turn a Shopify Payments payout CSV into QuickBooks-ready books: gross sales, refunds, and fees correctly split through a clearing account — with a payout tie-out check."
      tool={<PayoutConverter provider="shopify" />}
      currentPath="/tools/shopify-to-quickbooks"
      faqs={FAQS}
      howToName="How to record Shopify payouts in QuickBooks"
      howToSteps={HOWTO}
      privacyLine="No account needed to scan · Processed in memory, never stored"
      content={
        <>
          <h2 className="text-2xl font-extrabold text-zinc-900 dark:text-white">The clearing-account method</h2>
          <p className="mt-3 text-zinc-600 dark:text-zinc-300 leading-relaxed">
            A Shopify payout bundles many days of orders with processing fees and refunds
            already deducted — the deposit date rarely matches the order dates. The correct
            bookkeeping is to reconcile by payout, not by day: record gross orders as income
            into a dedicated Shopify clearing account, record fees and refunds against the
            same account, then record the payout as a transfer from the clearing account to
            your checking account. When the clearing account nets to zero, the payout is
            reconciled to the penny.
          </p>
          <h2 className="text-2xl font-extrabold text-zinc-900 dark:text-white mt-12">What this tool handles</h2>
          <ul className="mt-4 space-y-2.5 text-zinc-600 dark:text-zinc-300 leading-relaxed">
            <li><strong className="text-zinc-900 dark:text-white">Payout grouping</strong> — charges, refunds, chargebacks, and fees grouped by payout ID.</li>
            <li><strong className="text-zinc-900 dark:text-white">Per-payout summaries</strong> — gross, refunds, disputes, fees, and net, per payout.</li>
            <li><strong className="text-zinc-900 dark:text-white">Tie-out verification</strong> — Gross − Fees − Refunds = Payout is checked against the bank deposit for every payout.</li>
            <li><strong className="text-zinc-900 dark:text-white">Collision-proof IDs</strong> — every clearing entry carries a unique transaction ID derived from the payout, so re-imports are deduped by QuickBooks.</li>
          </ul>
          <p className="mt-5 text-zinc-600 dark:text-zinc-300 leading-relaxed">
            Selling through other channels too? The same clearing-account model powers our{" "}
            <a href="/tools/free-stripe-to-quickbooks" className="text-emerald-600 dark:text-emerald-400 font-semibold hover:underline">Stripe QBO Converter</a>,{" "}
            <a href="/tools/amazon-to-quickbooks" className="text-emerald-600 dark:text-emerald-400 font-semibold hover:underline">Amazon Settlement Converter</a>, and{" "}
            <a href="/tools/free-paypal-to-quickbooks" className="text-emerald-600 dark:text-emerald-400 font-semibold hover:underline">PayPal Payout Converter</a>.
            {" "}If QuickBooks refuses a file, the{" "}
            <a href="/tools/qbo-import-errors" className="text-emerald-600 dark:text-emerald-400 font-semibold hover:underline">QBO import-error decoder</a>{" "}
            explains the error and its fix.
          </p>
        </>
      }
    />
  );
}
