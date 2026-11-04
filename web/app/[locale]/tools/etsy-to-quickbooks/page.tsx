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
    q: "Why is my Etsy deposit so much smaller than my sales?",
    a: "Etsy settles net. Before money reaches your bank, Etsy deducts transaction fees, listing fees, any regulatory fees, and refunds from your sales — and may hold a reserve on newer shops. The statement CSV shows every deduction; this converter turns each one into its own line so the whole gap is explained.",
  },
  {
    q: "What is the difference between transaction fees and listing fees?",
    a: "A listing fee is charged per item listed, and again when a listing renews; a transaction fee is a percentage of each sale's total, including shipping. Both are costs of selling, and the converter keeps them as separate lines in your books so you can see exactly what each one costs you over a month.",
  },
  {
    q: "Can I convert a full year of Etsy statements?",
    a: "Etsy issues statements monthly, so download each month's CSV and convert them one at a time — or combine the files first if the columns match. Converting month by month keeps every deposit's tie-out separate and matches how you close the books, which makes any problem far easier to find.",
  },
  {
    q: "What if my statement is in another currency?",
    a: "Convert the statement in the currency Etsy issued it in, and let the tie-out prove the numbers before anything is translated. If your QuickBooks is in US dollars while the shop settles in another currency, keep the clearing account in the settlement currency and let QuickBooks handle the exchange on the transfer to checking.",
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

const H2 = "text-2xl font-extrabold text-zinc-900 dark:text-white";
const H2M = "text-2xl font-extrabold text-zinc-900 dark:text-white mt-12";
const H3 = "text-lg font-bold text-zinc-900 dark:text-white mt-8";
const P = "mt-3 text-zinc-600 dark:text-zinc-300 leading-relaxed";
const TH = "border border-[#E3EDE0] bg-[#EFF7ED] px-3 py-2 text-left font-semibold text-zinc-900";
const TD = "border border-[#E3EDE0] px-3 py-2 text-zinc-600 dark:text-zinc-300 align-top";

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
          <h2 className={H2}>Why your Etsy deposit is not your income</h2>
          <p className={P}>
            The deposit that arrives from Etsy is what is left of your sales after Etsy has helped
            itself: transaction fees on every order, listing fees and renewals, regulatory fees in
            the countries that charge them, and refunds you issued along the way. Newer shops may
            also have a reserve held back. The deposit date matches none of the sale dates, and the
            amount matches none of your order totals. Treat that deposit as your sales figure and
            your books understate revenue by every deduction — while the fees, which are real,
            deductible costs of selling, never appear anywhere at all.
          </p>
          <p className={P}>
            The correct unit of bookkeeping is the deposit, rebuilt from its parts. This converter
            reads your Etsy monthly statement CSV, groups the rows into deposits, and reconstructs
            each one: gross sales as income, every fee type as its own expense line, refunds against
            income, and the deposit itself as a transfer of the net. When the pieces sum exactly to
            what hit your bank, the deposit is explained — not approximated.
          </p>
          <p className={P}>
            This matters beyond tidiness. Your tax return reports gross receipts, not deposits; your
            pricing decisions depend on knowing what the channel really costs; and if your numbers
            are ever questioned, "the statement rebuilds to the deposit, every month" is an answer
            that ends the conversation. Approximations invite follow-up questions. Tie-outs close
            them.
          </p>

          <h2 className={H2M}>Every Etsy fee gets its own line</h2>
          <p className={P}>
            Etsy's fees are not one fee, and lumping them together hides which part of your pricing
            is leaking. The converter keeps each type separate, routed through an Etsy clearing
            account that exists to prove the deposit adds up:
          </p>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr>
                  <th className={TH}>Line</th>
                  <th className={TH}>What it is</th>
                  <th className={TH}>Where it lands</th>
                </tr>
              </thead>
              <tbody>
                <tr><td className={TD}><strong>Gross sales</strong></td><td className={TD}>Every order in the statement, before deductions</td><td className={TD}>Income, into Etsy Clearing</td></tr>
                <tr><td className={TD}><strong>Transaction fees</strong></td><td className={TD}>Etsy's percentage on each sale, including shipping</td><td className={TD}>A transaction-fees expense line</td></tr>
                <tr><td className={TD}><strong>Listing fees</strong></td><td className={TD}>Per-listing charges, renewals and auto-renewals</td><td className={TD}>A listing-fees expense line</td></tr>
                <tr><td className={TD}><strong>Regulatory fees</strong></td><td className={TD}>Country operating fees, where Etsy applies them</td><td className={TD}>Their own expense line, never mixed into sales</td></tr>
                <tr><td className={TD}><strong>Refunds</strong></td><td className={TD}>Money returned to buyers</td><td className={TD}>Contra-income — reduces gross sales</td></tr>
                <tr><td className={TD}><strong>Chargebacks</strong></td><td className={TD}>Payment disputes Etsy pulled back</td><td className={TD}>Their own line, so they never hide inside refunds</td></tr>
                <tr><td className={TD}><strong>Net deposit</strong></td><td className={TD}>The amount Etsy actually sent to your bank</td><td className={TD}>Transfer from Etsy Clearing to checking</td></tr>
              </tbody>
            </table>
          </div>
          <figure className="mt-6 flex flex-col gap-5 rounded-[24px] border border-[#D8E8D2] bg-[#EFF7ED] p-5 sm:flex-row sm:items-center sm:gap-6 sm:p-6">
            <img src="/tools/csv-to-qbo-review.webp" alt="A seller reviewing an Etsy monthly statement against converted QuickBooks entries before importing them" className="w-full shrink-0 rounded-[16px] sm:w-[400px]" loading="lazy" />
            <figcaption className="text-sm leading-relaxed text-[#33502F]">Reviewing the month's Etsy statement before it becomes bookkeeping.</figcaption>
          </figure>

          <h2 className={H2M}>Downloading the monthly statement from Etsy</h2>
          <ol className="mt-3 list-decimal space-y-2 pl-5 leading-relaxed text-zinc-600 dark:text-zinc-300 marker:font-bold marker:text-[#007A33]">
            <li>In Etsy Shop Manager, open <strong className="text-zinc-900 dark:text-white">Finance → Monthly statements</strong> and choose the month.</li>
            <li>Download the CSV for that month — this is the payment-account statement, the one that carries the fee detail.</li>
            <li>Check the columns: the tool reads <strong className="text-zinc-900 dark:text-white">date, type, gross, fee, net</strong>, and uses a deposit-id column to group rows when one is present.</li>
            <li>Drop the file into the converter above and review the deposit summary.</li>
          </ol>
          <p className={P}>
            Skip the order and sales reports for this job: they describe what you sold, but not what
            Etsy charged or paid. The monthly statement is the only export where sales, fees and
            deposits appear together — which is exactly what a tie-out needs.
          </p>
          <p className={P}>
            Download each month's statement when Etsy issues it, even if you convert later. Old
            statements stay available, but sellers who archive the CSV monthly never face a
            year-end scavenger hunt through Shop Manager — and the file you convert is the file
            Etsy actually settled from, not a reconstruction.
          </p>

          <h2 className={H2M}>A worked example: the sample file on this page</h2>
          <p className={P}>
            The sample statement you can download above contains one deposit. Here is what the
            converter builds from it:
          </p>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr><th className={TH}>Line</th><th className={TH}>Amount</th></tr>
              </thead>
              <tbody>
                <tr><td className={TD}>Gross sales</td><td className={TD}>$200.00</td></tr>
                <tr><td className={TD}>Refunds</td><td className={TD}>−$20.00</td></tr>
                <tr><td className={TD}>Fees (transaction, listing and regulatory, kept as separate lines)</td><td className={TD}>−$14.00</td></tr>
                <tr><td className={TD}><strong>Net deposit</strong></td><td className={TD}><strong>$166.00</strong></td></tr>
              </tbody>
            </table>
          </div>
          <p className={P}>
            Through the clearing account, that reads: $200.00 of sales in, $20.00 of refunds out,
            $14.00 of fees out, and $166.00 left — precisely the deposit in your bank feed. The
            transfer clears it to checking and the clearing account returns to zero. A seller who
            had booked the $166.00 deposit as "sales" would have understated income by $34.00 and
            lost the fee record entirely; the split takes the same file and loses nothing.
          </p>
          <p className={P}>
            Scale that one deposit up to a year of selling and the stakes grow: a shop doing $2,000
            a month in deposits can easily be understating its revenue by several thousand dollars
            a year, with a matching hole where its selling costs should be. The per-deposit split is
            also what makes fee changes visible — when a month's transaction-fee line creeps up
            faster than its sales line, you see it in the month it happens, not at tax time.
          </p>

          <h2 className={H2M}>Importing the result into QuickBooks</h2>
          <ol className="mt-3 list-decimal space-y-2 pl-5 leading-relaxed text-zinc-600 dark:text-zinc-300 marker:font-bold marker:text-[#007A33]">
            <li>Create a bank account in QuickBooks named <strong className="text-zinc-900 dark:text-white">Etsy Clearing</strong> — once only; every month reuses it.</li>
            <li>Import the QBO into that account: in Online, <strong className="text-zinc-900 dark:text-white">Bank transactions → Upload from file</strong>; in Desktop, <strong className="text-zinc-900 dark:text-white">File → Utilities → Import → Web Connect Files</strong>.</li>
            <li>Categorize the lines: sales to income, each fee line to its expense account, refunds against income.</li>
            <li>Match the transfer line against the real Etsy deposit in your checking feed. A clearing balance of zero means the deposit is reconciled.</li>
          </ol>
          <p className={P}>
            The CSV download works through QuickBooks Online's manual upload the same way — on this
            tool, both downloads are free.
          </p>

          <h2 className={H2M}>Mistakes Etsy sellers make in QuickBooks</h2>
          <h3 className={H3}>Treating the deposit as pure sales</h3>
          <p className={P}>
            The single most common Etsy bookkeeping error. The deposit is sales minus at least four
            kinds of deductions, so booking it as revenue understates your income and deletes your
            fee expenses in one move. Your reports then disagree with both your Etsy dashboard and
            your tax return's gross receipts figure.
          </p>
          <h3 className={H3}>Forgetting the fees that arrive without a sale</h3>
          <p className={P}>
            Listing renewals and auto-renewals charge your payment account even in a quiet week, and
            regulatory fees follow their own logic. A month reconstructed only from orders will
            never tie out, because some of its fees bought no sale at all. The statement — not the
            order list — is the complete record.
          </p>
          <h3 className={H3}>Letting personal and shop money share one trail</h3>
          <p className={P}>
            Paying for supplies from the account Etsy deposits into, or running two shops through
            one clearing account, makes every tie-out an argument. One shop, one clearing account,
            business spending on business rails: the monthly proof only works when the trail is
            clean.
          </p>
          <h3 className={H3}>Booking fees as cost of goods sold</h3>
          <p className={P}>
            Transaction and listing fees are selling expenses, not product costs. Inside COGS they
            distort your per-item margins — the numbers you price from. Kept as their own expense
            lines, they show the true cost of the channel, which is what you need when comparing
            Etsy against your own store or another marketplace.
          </p>

          <h2 className={H2M}>Reserves and other reasons a deposit surprises you</h2>
          <p className={P}>
            Even a perfectly kept statement can produce a deposit that looks wrong. Etsy holds a
            payment reserve on many newer or higher-risk shops, releasing earlier sales in later
            deposits — so one deposit contains money from two different selling periods, and the
            next looks short. Deposits below Etsy's minimum threshold roll forward and arrive
            combined. A sale refunded after the month closed lands in the following statement,
            where it reduces a deposit it had nothing to do with. None of these are errors; all of
            them break naive bookkeeping that expects deposits to equal a month's sales. The
            clearing-account method absorbs every one of them, because it never assumes — it
            rebuilds each deposit from the rows Etsy actually settled, and the tie-out confirms the
            rebuild to the penny.
          </p>

          <h2 className={H2M}>The tie-out is your monthly proof</h2>
          <p className={P}>
            A clearing account that returns to zero is a small monthly audit you perform on
            yourself: every cent Etsy took is named, every refund is accounted for, and the deposit
            in your bank feed has a complete explanation behind it. When it does not zero, the
            leftover is information — a reserve released late shows up as a deposit with no new
            sales behind it, and a missing fee line shows up as a difference equal to that fee.
            Chasing the difference in the statement, before importing, takes minutes; chasing it
            inside QuickBooks at tax time takes hours. If QuickBooks refuses a converted file
            outright, the{" "}
            <a href="/tools/qbo-import-errors" className="font-semibold text-pine-600 hover:underline dark:text-pine-400">QBO import-error decoder</a>{" "}
            explains the message and the fix.
          </p>

          <h2 className={H2M}>Selling every month? Make it a system</h2>
          <p className={P}>
            This converter stays free — the summary, the CSV and the QBO are all free, with no
            account needed. What an account adds is the system around it: a free account keeps every
            conversion in one searchable history, so a statement you converted in March is still
            there at tax time. The dashboard adds bulk conversion when a whole month of bank
            statements lands at once, and client portals if you keep books for other sellers — each
            client uploads through their own link and the conversion bills to you.
          </p>
          <p className={P}>
            Selling through other channels too? The same clearing-account model powers our{" "}
            <a href="/tools/free-stripe-to-quickbooks" className="font-semibold text-pine-600 hover:underline dark:text-pine-400">Stripe QBO Converter</a>,{" "}
            <a href="/tools/shopify-to-quickbooks" className="font-semibold text-pine-600 hover:underline dark:text-pine-400">Shopify Payout Converter</a>,{" "}
            <a href="/tools/square-to-quickbooks" className="font-semibold text-pine-600 hover:underline dark:text-pine-400">Square Payout Converter</a>, and{" "}
            <a href="/tools/free-paypal-to-quickbooks" className="font-semibold text-pine-600 hover:underline dark:text-pine-400">PayPal Payout Converter</a>{" "}
            — one method, learned once, applied everywhere you sell.
          </p>
        </>
      }
    />
  );
}
