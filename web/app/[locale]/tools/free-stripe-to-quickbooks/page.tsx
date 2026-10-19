import type { Metadata } from "next";
import { ToolPageLayout, type ToolFaq } from "@/components/tools/ToolPageLayout";
import { PayoutConverter } from "@/components/tools/PayoutConverter";

const PAGE_URL = "https://convertstatement.online/tools/free-stripe-to-quickbooks";

export const metadata: Metadata = {
  title: "Free Stripe to QuickBooks Converter (Payout to QBO) | Convert Statement",
  description:
    "Turn a Stripe payout CSV into QuickBooks-ready books: gross sales, refunds, and fees split through a clearing account with a payout tie-out check. Free per-payout summary with a free account, files never stored.",
  alternates: { canonical: PAGE_URL },
  openGraph: {
    title: "Free Stripe to QuickBooks Payout Converter",
    description:
      "Upload a Stripe payout CSV — get gross, fees, and refunds split correctly for QuickBooks with a tie-out check. Free.",
    url: PAGE_URL,
    type: "website",
  },
};

const FAQS: ToolFaq[] = [
  {
    q: "Why doesn't my Stripe payout match my sales in QuickBooks?",
    a: "A payout is not a sale — it's gross sales minus Stripe's fees minus refunds, bundled together. Your bank feed only shows the net deposit, so recording just the net understates revenue and hides fees. This tool unpacks each payout into its parts (gross, refunds, fees) through a clearing account, then transfers the net to checking — the same method paid tools like Synder use.",
  },
  {
    q: "Which Stripe export should I upload?",
    a: "The Payout Reconciliation (itemized) report for one payout gives the full breakdown. Stripe's Balance transactions CSV also works. The Payouts list alone only has payout totals — the tool will list them but can't build the clearing entries without the itemized detail.",
  },
  {
    q: "How do refunds and disputes appear in the export?",
    a: "Refunds appear as contra-income lines (reducing gross sales), processing fees as expense lines, and disputes as their own lines plus the $15 dispute fee Stripe charges (returned only if you win). A fully refunded transaction still costs you Stripe's $0.30 fixed fee — that's in the data and flows through to the fee line.",
  },
  {
    q: "What is the payout tie-out check?",
    a: "The tool verifies Gross − Fees − Refunds − Disputes = Payout for every payout. A green 'Ties out' badge means the payout reconciles to the penny. If it shows a difference, check Stripe for reserve holds, instant-payout fees, or activity from other days swept into the payout before importing.",
  },
  {
    q: "How do I import the QBO into QuickBooks?",
    a: "First create a bank account in QuickBooks named 'Stripe Clearing'. Import the QBO there, then match the transfer line against the real payout deposit in your bank feed. When the clearing account nets to zero, the payout is fully reconciled. The CSV works the same way through QuickBooks Online's manual upload.",
  },
  {
    q: "Is my data uploaded to your servers?",
    a: "No. Your CSV is processed in memory to build the payout summary and is not stored afterwards. We never sell or share your financial data.",
  },
];

const HOWTO = [
  { title: "Export from Stripe", body: "In Stripe, export the Payout Reconciliation (itemized) report or Balance transactions as CSV." },
  { title: "Upload it here", body: "Drop the CSV in — the tool auto-detects the format and groups everything into payouts." },
  { title: "Review the tie-out", body: "Check each payout's gross, fees, and refunds, and confirm the payout ties out to the bank deposit." },
  { title: "Import into QuickBooks", body: "Download the CSV free, or the QBO on Pro, and import it into a Stripe Clearing account in QuickBooks." },
];

export default function StripeToQuickBooksPage() {
  return (
    <ToolPageLayout
      eyebrow="Free Tool"
      title="Stripe to QuickBooks Payout Converter"
      subtitle="Turn a Stripe payout CSV into QuickBooks-ready books: gross sales, refunds, and fees correctly split through a clearing account — with a payout tie-out check."
      tool={<PayoutConverter provider="stripe" />}
      currentPath="/tools/free-stripe-to-quickbooks"
      faqs={FAQS}
      howToName="How to record Stripe payouts in QuickBooks"
      howToSteps={HOWTO}
      privacyLine="Free account · Processed in memory, never stored"
      content={
        <>
          <h2 className="text-2xl font-extrabold text-zinc-900 dark:text-white">The clearing-account method</h2>
          <p className="mt-3 text-zinc-600 dark:text-zinc-300 leading-relaxed">
            A Stripe payout bundles many days of sales with fees and refunds already deducted —
            the deposit date rarely matches the sale dates. The correct bookkeeping is to reconcile
            by payout, not by day: record gross charges as income into a dedicated Stripe clearing
            account, record fees and refunds against the same account, then record the payout as a
            transfer from the clearing account to your checking account. When the clearing account
            nets to zero, the payout is reconciled to the penny.
          </p>
          <h2 className="text-2xl font-extrabold text-zinc-900 dark:text-white mt-12">What this tool handles</h2>
          <ul className="mt-4 space-y-2.5 text-zinc-600 dark:text-zinc-300 leading-relaxed">
            <li><strong className="text-zinc-900 dark:text-white">Auto-detects Stripe exports</strong> — Balance transactions, Payouts, and itemized payout reports are all recognized.</li>
            <li><strong className="text-zinc-900 dark:text-white">Per-payout summaries</strong> — gross, refunds, disputes, dispute fees, processing fees, adjustments, and net, per payout.</li>
            <li><strong className="text-zinc-900 dark:text-white">Tie-out verification</strong> — Gross − Fees − Refunds = Payout is checked against the bank deposit for every payout.</li>
            <li><strong className="text-zinc-900 dark:text-white">Collision-proof IDs</strong> — every clearing entry carries a unique transaction ID derived from the payout, so re-imports are deduped by QuickBooks.</li>
          </ul>
          <p className="mt-5 text-zinc-600 dark:text-zinc-300 leading-relaxed">
            Already converting bank statements for QuickBooks? The payout converter pairs with our{" "}
            <a href="/quickbooks" className="text-blue-600 dark:text-blue-400 font-semibold hover:underline">statement-to-QBO converter</a>{" "}
            and the{" "}
            <a href="/tools/free-qbo-cleanup-checker" className="text-blue-600 dark:text-blue-400 font-semibold hover:underline">duplicate finder</a>{" "}
            to keep the whole month clean.
          </p>
        </>
      }
    />
  );
}
