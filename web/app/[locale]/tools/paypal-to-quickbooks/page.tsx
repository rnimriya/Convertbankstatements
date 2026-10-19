import type { Metadata } from "next";
import { ToolPageLayout, type ToolFaq } from "@/components/tools/ToolPageLayout";
import { PayoutConverter } from "@/components/tools/PayoutConverter";

const PAGE_URL = "https://convertstatement.online/tools/paypal-to-quickbooks";

export const metadata: Metadata = {
  title: "Free PayPal to QuickBooks Converter (Payout to QBO) | Convert Statement",
  description:
    "Turn a PayPal activity CSV into QuickBooks-ready books: gross sales, refunds, and fees split through a clearing account with a payout tie-out check. Free, no signup, files never stored.",
  alternates: { canonical: PAGE_URL },
  openGraph: {
    title: "Free PayPal to QuickBooks Payout Converter",
    description:
      "Upload a PayPal activity CSV — get gross, fees, and refunds split correctly for QuickBooks with a tie-out check. Free.",
    url: PAGE_URL,
    type: "website",
  },
};

const FAQS: ToolFaq[] = [
  {
    q: "How do I record PayPal payouts in QuickBooks correctly?",
    a: "Don't book the net transfer as sales — it understates revenue and hides fees. The correct method is a clearing account: gross payments as income into a PayPal clearing account, refunds against it, fees as an expense against it, then each bank transfer as a move from the clearing account to checking. This tool builds exactly that split from your PayPal activity CSV.",
  },
  {
    q: "Which PayPal export should I upload?",
    a: "In PayPal, go to Activity → Statements → Activity download and choose CSV. That file has the Date, Type, Gross, Fee, and Net columns the tool needs. Bank transfers in the file are used to split activity into payout periods.",
  },
  {
    q: "How are PayPal fees and refunds handled?",
    a: "Processing fees become expense lines, refunds reduce gross sales (PayPal keeps its fixed fee on refunded payments, and that flows through to the fee line), and chargebacks are broken out separately. The tie-out check verifies everything nets to the transfer amount.",
  },
  {
    q: "How do I import the QBO into QuickBooks?",
    a: "First create a bank account in QuickBooks named 'PayPal Clearing'. Import the QBO there, then match each transfer line against the real PayPal transfer deposit in your bank feed. When the clearing account nets to zero, the period is fully reconciled.",
  },
  {
    q: "What's the difference from the Stripe converter?",
    a: "The accounting is the same clearing-account model, but the parsing is built for PayPal's activity export — including its transfer-to-bank rows, which the tool uses to split your activity into payout periods automatically.",
  },
  {
    q: "Is my data uploaded to your servers?",
    a: "No. Your CSV is processed in memory to build the payout summary and is not stored afterwards. We never sell or share your financial data.",
  },
];

const HOWTO = [
  { title: "Download from PayPal", body: "In PayPal, go to Activity → Statements → Activity download and choose CSV." },
  { title: "Upload it here", body: "Drop the CSV in — the tool parses it and splits activity into payout periods at each bank transfer." },
  { title: "Review the tie-out", body: "Check gross, fees, and refunds per period, and confirm each period ties out to its transfer." },
  { title: "Import into QuickBooks", body: "Download the CSV free, or the QBO on Pro, and import it into a PayPal Clearing account in QuickBooks." },
];

export default function PayPalToQuickBooksPage() {
  return (
    <ToolPageLayout
      eyebrow="Free Tool"
      title="PayPal to QuickBooks Payout Converter"
      subtitle="Turn a PayPal activity CSV into QuickBooks-ready books: gross sales, refunds, and fees correctly split through a clearing account — with a payout tie-out check."
      tool={<PayoutConverter provider="paypal" />}
      currentPath="/tools/paypal-to-quickbooks"
      faqs={FAQS}
      howToName="How to record PayPal payouts in QuickBooks"
      howToSteps={HOWTO}
      content={
        <>
          <h2 className="text-2xl font-extrabold text-zinc-900 dark:text-white">The clearing-account method</h2>
          <p className="mt-3 text-zinc-600 dark:text-zinc-300 leading-relaxed">
            PayPal pays you in net transfers — sales minus fees minus refunds. If you book each
            transfer as “sales,” your revenue is understated and your fees vanish from the P&L.
            The correct bookkeeping: record gross payments as income into a dedicated PayPal
            clearing account, fees and refunds against the same account, and each transfer to your
            bank as a move from clearing to checking. This tool reads your activity CSV, splits it
            into payout periods at each transfer, and builds that exact split.
          </p>
          <h2 className="text-2xl font-extrabold text-zinc-900 dark:text-white mt-12">What this tool handles</h2>
          <ul className="mt-4 space-y-2.5 text-zinc-600 dark:text-zinc-300 leading-relaxed">
            <li><strong className="text-zinc-900 dark:text-white">PayPal activity exports</strong> — Date, Type, Gross, Fee, Net columns are recognized automatically.</li>
            <li><strong className="text-zinc-900 dark:text-white">Payout-period splitting</strong> — transfer-to-bank rows split your activity into periods, each tied out separately.</li>
            <li><strong className="text-zinc-900 dark:text-white">Tie-out verification</strong> — Gross − Fees − Refunds = Transfer is checked against every bank transfer.</li>
            <li><strong className="text-zinc-900 dark:text-white">Collision-proof IDs</strong> — every clearing entry carries a unique transaction ID, so re-imports are deduped by QuickBooks.</li>
          </ul>
          <p className="mt-5 text-zinc-600 dark:text-zinc-300 leading-relaxed">
            Taking Stripe too? Try the{" "}
            <a href="/tools/stripe-to-quickbooks" className="text-violet-600 dark:text-violet-400 font-semibold hover:underline">Stripe to QuickBooks converter</a>,
            and run the{" "}
            <a href="/tools/qbo-cleanup-checker" className="text-violet-600 dark:text-violet-400 font-semibold hover:underline">duplicate finder</a>{" "}
            before month-end to keep the books clean.
          </p>
        </>
      }
    />
  );
}
