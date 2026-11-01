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
    a: "Record by settlement, not by day. Each settlement bundles orders with selling fees and refunds deducted, and deposit dates rarely match order dates. This tool unpacks settlements through a clearing account — gross, refunds, and fees in, net transferred to checking. A zero clearing balance means the settlement is reconciled.",
  },
  {
    q: "Which Amazon export should I upload?",
    a: "Amazon's settlement report (transaction view) as a CSV, with columns: settlement-id, date, transaction-type, order-id, amount, and fee. If your export uses different headers, rename them to match — settlement report layouts vary by marketplace and report version, so the tool reads exactly these six columns.",
  },
  {
    q: "How often does Amazon settle and pay out?",
    a: "Amazon closes a settlement every 14 days for most seller accounts, then disburses the net a few days later. That rhythm is why the deposit never matches a calendar week or month: each settlement covers its own window, and the books should follow the settlement window rather than the calendar.",
  },
  {
    q: "What is the settlement tie-out check?",
    a: "The tool verifies Gross − Fees − Refunds = Payout for every settlement, against the deposit total in the file. A green 'Ties out' badge means the settlement reconciles to the penny. If it shows a difference, check Amazon for reserve holds, chargebacks, or orders from another period swept in before importing.",
  },
  {
    q: "How are Amazon fees handled?",
    a: "Referral and fulfillment fees are expense lines through the clearing account, refunds are contra-income lines reducing gross sales, and chargebacks appear as their own lines. The fee column in your export is taken as given — the tool does not estimate Amazon's fee schedule.",
  },
  {
    q: "Why does my settlement span two calendar months?",
    a: "Because settlements run on Amazon's 14-day cycle, not on month boundaries — a settlement that opens on January 28 closes in February. Splitting it by order date to force it into one month breaks the tie-out. Record the whole settlement in its own period; the clearing account keeps the timing honest.",
  },
  {
    q: "What is the account-level reserve in my settlement?",
    a: "Amazon sometimes withholds a reserve amount from a settlement to cover possible refunds and chargebacks, releasing it in a later settlement. It is your money in transit, not a fee: the converter keeps reserve movements inside the clearing account, so they never distort sales or expenses.",
  },
  {
    q: "Can a settlement come out negative?",
    a: "Yes — a refund-heavy period, or a large chargeback, can exceed the period's sales. Amazon then deducts the shortfall from the next settlement instead of paying out. In QuickBooks the clearing account simply carries a negative balance until the next settlement covers it; no special entry is needed.",
  },
  {
    q: "How do I import the QBO into QuickBooks?",
    a: "First create a bank account in QuickBooks named 'Amazon Clearing'. Import the QBO there, then match the transfer line against the settlement deposit in your bank feed. When the clearing account nets to zero, the settlement is fully reconciled. The CSV works the same way through QuickBooks Online's manual upload.",
  },
  {
    q: "Is my data uploaded to your servers?",
    a: "No. Your CSV is processed in memory to build the settlement summary and the download files, and it is not stored on our servers afterwards. Nothing is kept between sessions, and we never sell, share, or use your financial data for anything else.",
  },
];

const HOWTO = [
  { title: "Export from Amazon", body: "In Seller Central, download the settlement report (transaction view) as a CSV, with settlement-id, date, transaction-type, order-id, amount, and fee columns." },
  { title: "Upload it here", body: "Drop the CSV in — the tool groups everything into settlements automatically." },
  { title: "Review the tie-out", body: "Check each settlement's gross, fees, and refunds, and confirm the settlement ties out to the bank deposit." },
  { title: "Import into QuickBooks", body: "Download the CSV free, or the QBO on Pro, and import it into an Amazon Clearing account in QuickBooks." },
];

const H2 = "text-2xl font-extrabold text-zinc-900 dark:text-white";
const H2M = "text-2xl font-extrabold text-zinc-900 dark:text-white mt-12";
const H3 = "text-lg font-bold text-zinc-900 dark:text-white mt-8";
const P = "mt-3 text-zinc-600 dark:text-zinc-300 leading-relaxed";
const TH = "border border-[#E3EDE0] bg-[#EFF7ED] px-3 py-2 text-left font-semibold text-zinc-900";
const TD = "border border-[#E3EDE0] px-3 py-2 text-zinc-600 dark:text-zinc-300 align-top";

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
      privacyLine="No account needed · Processed in memory, never stored"
      content={
        <>
          <h2 className={H2}>Why your Amazon deposit is not your sales</h2>
          <p className={P}>
            Amazon does not pay you per order. Roughly every two weeks it closes a settlement:
            thousands of order lines, refunds, referral fees, and FBA charges are netted against
            each other, and only the remainder reaches your bank. Sellers who book that deposit as
            revenue understate sales by every fee and refund inside it — on Amazon those deductions
            routinely run to a third of gross — and they keep nothing they can reconcile against
            when a settlement looks wrong.
          </p>
          <p className={P}>
            The settlement report itself tells the full story, line by line; it is just written in
            Amazon's dialect rather than your chart of accounts. This converter translates it:
            gross in as income, fees out as expenses, refunds against sales, and the deposit as the
            transfer that clears the account. Settlement by settlement, the books end up showing
            what Amazon actually did with your money.
          </p>

          <h2 className={H2M}>Inside an Amazon settlement report</h2>
          <p className={P}>
            The settlement flat file groups every financial event of the period into a handful of
            line types. Each belongs in a different place in QuickBooks:
          </p>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr>
                  <th className={TH}>Line group</th>
                  <th className={TH}>What it really is</th>
                  <th className={TH}>How it should be booked</th>
                </tr>
              </thead>
              <tbody>
                <tr><td className={TD}><strong>Product charges</strong></td><td className={TD}>Item prices and shipping charged to buyers, order by order</td><td className={TD}>Income, into the clearing account</td></tr>
                <tr><td className={TD}><strong>Refunds</strong></td><td className={TD}>Money returned to buyers for returned or cancelled items</td><td className={TD}>Contra-income, reducing gross sales</td></tr>
                <tr><td className={TD}><strong>Selling / referral fees</strong></td><td className={TD}>Amazon's percentage commission on each sale</td><td className={TD}>Marketplace fees expense</td></tr>
                <tr><td className={TD}><strong>FBA fees</strong></td><td className={TD}>Fulfilment, storage, and related fulfilment-by-Amazon charges</td><td className={TD}>Fulfilment expense, kept separate from referral fees</td></tr>
                <tr><td className={TD}><strong>Shipping credits &amp; charges</strong></td><td className={TD}>Shipping amounts Amazon collected from buyers and passed through</td><td className={TD}>Offsetting income and expense lines</td></tr>
                <tr><td className={TD}><strong>Chargebacks &amp; adjustments</strong></td><td className={TD}>Reversals and corrections Amazon posts against the account</td><td className={TD}>Their own lines, tracked separately</td></tr>
                <tr><td className={TD}><strong>Settlement total</strong></td><td className={TD}>The net Amazon will actually deposit</td><td className={TD}>Transfer from clearing to checking</td></tr>
              </tbody>
            </table>
          </div>

          <h2 className={H2M}>Reading Amazon's fees like a seller</h2>
          <p className={P}>
            The two big fee families behave differently, and the difference is diagnostic. Referral
            fees are a percentage of the sale price, set by category — most categories sit in the
            low-to-mid teens — so they rise and fall with your prices. FBA fees are physical: they
            follow a unit's size and weight, plus how long it sits in a fulfilment centre, so they
            rise with slow inventory even when sales are flat.
          </p>
          <p className={P}>
            That is why this converter keeps the families on separate expense lines instead of
            merging them into one "Amazon fees" figure. When referral fees creep, the cause is
            pricing or category mix; when FBA fees creep, the cause is the catalogue itself. One
            combined number hides both stories — and with them, the fix for either.
          </p>

          <h2 className={H2M}>How this converter unpacks a settlement</h2>
          <p className={P}>
            Upload the settlement CSV and the tool groups every row by its settlement ID, then
            totals each family separately — product charges, refunds, referral fees, FBA fees,
            shipping lines, chargebacks — instead of collapsing them into one net figure. From
            those totals it builds the clearing-account entries: income, contra-income, and expense
            lines into an Amazon Clearing account, followed by the transfer line for the deposit.
            Each entry carries a unique transaction ID derived from the settlement, so re-importing
            a file cannot double the books.
          </p>
          <p className={P}>
            Before you download anything, the tie-out check re-adds the settlement: gross minus
            fees minus refunds must equal the deposit total in the file. A difference means
            something real — a reserve amount, a post-cutoff chargeback — and it is far cheaper to
            find it here than inside a bank reconciliation. The per-settlement summary is free to
            view with no account; the CSV download is free, and the QBO file is on Pro.
          </p>
          <p className={P}>
            Because grouping is by settlement ID rather than by date, a file that happens to
            contain two settlements is handled correctly: each one is totalled, tied out, and
            imported on its own. A settlement downloaded twice under different file names shows up
            as a visible duplicate in the summary instead of quietly doubling the books.
          </p>

          <h2 className={H2M}>The clearing-account method for Amazon</h2>
          <p className={P}>
            Because a settlement is a bundle with its own dates, the books should reconcile the
            bundle, not the days inside it. A dedicated clearing account makes that mechanical:
          </p>
          <ol className="mt-3 list-decimal space-y-2 pl-5 leading-relaxed text-zinc-600 dark:text-zinc-300 marker:font-bold marker:text-[#007A33]">
            <li>Create a bank account in QuickBooks named <strong className="text-zinc-900 dark:text-white">Amazon Clearing</strong> (one-time setup).</li>
            <li>Record the settlement's gross product charges as income into Amazon Clearing.</li>
            <li>Record referral and FBA fees as expenses, and refunds as contra-income, against the same account.</li>
            <li>Record the settlement deposit as a transfer from Amazon Clearing to your checking account.</li>
            <li>Match the transfer against the deposit in your bank feed.</li>
          </ol>
          <p className={P}>
            A settlement that comes out negative simply leaves the clearing account negative until
            the next settlement covers the shortfall — which is exactly how Amazon itself carries
            it.
          </p>

          <h2 className={H2M}>Downloading the settlement report from Seller Central</h2>
          <p className={P}>
            In Seller Central, go to <strong className="text-zinc-900 dark:text-white">Reports → Payments</strong> and open the settlement (statement)
            view for the period, then download the report as a CSV. The converter reads six columns
            — settlement-id, date, transaction-type, order-id, amount, and fee — so if your
            marketplace's export names them differently, rename the headers to match before
            uploading. Download each settlement once and keep the originals: Amazon's archive keeps
            past settlements available, and the original file is your evidence if a number is ever
            questioned.
          </p>
          <p className={P}>
            One warning about report flavours: the transaction view lists every order, refund, and
            fee as its own row — that is the file this converter reads. The summary view shows
            totals only. It is useful for a glance, but there is nothing in it to split, tie out,
            or audit, so when Seller Central offers both, always download the transaction view.
          </p>

          <figure className="mt-10">
            <img src="/tools/csv-to-qbo-review.webp" alt="A seller reviewing an Amazon settlement breakdown against the deposit that reached the bank" className="w-full rounded-[20px] border border-[#E3EDE0]" loading="lazy" />
            <figcaption className="mt-2 text-center text-xs text-zinc-400">Illustration: reviewing one settlement's sales, refunds, and fees before it is imported.</figcaption>
          </figure>

          <h2 className={H2M}>A worked example: one settlement, tied out</h2>
          <p className={P}>
            Sample figures, rounded on purpose. One ordinary two-week settlement for a small
            catalogue:
          </p>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr><th className={TH}>Line</th><th className={TH}>Amount</th></tr>
              </thead>
              <tbody>
                <tr><td className={TD}>Gross product sales</td><td className={TD}>$4,200.00</td></tr>
                <tr><td className={TD}>Refunds</td><td className={TD}>−$300.00</td></tr>
                <tr><td className={TD}>Referral (selling) fees</td><td className={TD}>−$630.00</td></tr>
                <tr><td className={TD}>FBA fees</td><td className={TD}>−$470.00</td></tr>
                <tr><td className={TD}><strong>Settlement deposit</strong></td><td className={TD}><strong>$2,800.00</strong></td></tr>
              </tbody>
            </table>
          </div>
          <p className={P}>
            The tie-out: $4,200.00 − $300.00 − $630.00 − $470.00 = $2,800.00. In the clearing account
            that is $4,200.00 of income, $300.00 of contra-income, and $1,100.00 of fees — more than
            a quarter of everything sold — leaving exactly $2,800.00 for the transfer to checking.
            Booked as a single deposit-as-sale, the same settlement would understate revenue by
            $1,400.00 and hide the entire fee bill. (Sample figures, shown for illustration.)
          </p>

          <h2 className={H2M}>Amazon mistakes that distort the books</h2>
          <h3 className={H3}>Booking the settlement total as sales</h3>
          <p className={P}>
            The deposit is what is left after Amazon has paid itself. Treating it as revenue makes
            your top line a fiction — too low by every refund and fee — and leaves no fee expense to
            analyze, negotiate, or price against. Sellers routinely discover their "profitable"
            product line was never profitable only when the fees finally get their own lines.
          </p>
          <h3 className={H3}>Letting the fee lines vanish — or lumping them together</h3>
          <p className={P}>
            Referral fees scale with price; FBA fees scale with size, weight, and storage time. In
            one vague "Amazon fees" account they are unmanageable; on separate lines they tell you
            which products carry their fulfilment costs and which quietly lose money on every unit.
          </p>
          <h3 className={H3}>Double-counting overlapping settlements</h3>
          <p className={P}>
            Date-range transaction reports can re-include orders that already appeared inside a
            settlement file. Import both and those orders exist twice. Work settlement by
            settlement — one file, one settlement ID, one import — and the overlap cannot happen.
          </p>
          <h3 className={H3}>Forcing settlements into calendar months</h3>
          <p className={P}>
            Splitting a settlement at the month boundary to make reports look tidy breaks its
            tie-out and strands half-entries in two periods. A settlement that spans two months
            belongs to its own settlement period; monthly reports can still be produced from the
            clearing account's dated lines.
          </p>

          <h2 className={H2M}>When a settlement will not tie out</h2>
          <p className={P}>
            The usual suspects are timing, not errors. An account-level reserve was withheld and
            will release in a later settlement. A chargeback was posted just after the settlement
            cutoff. Amazon split one settlement into two disbursements. Or orders from the tail of
            the previous period were swept into this one. The tie-out names the difference per
            settlement so you can match it to one of these; if QuickBooks and the bank still
            disagree after importing, the{" "}
            <a href="/tools/reconciliation-finder" className="font-semibold text-pine-600 hover:underline dark:text-pine-400">Reconciliation Difference Finder</a>{" "}
            compares your statement against QuickBooks entry by entry.
          </p>

          <h2 className={H2M}>Make it a system, not a monthly rescue</h2>
          <p className={P}>
            Twenty-six settlements a year, each with the same anatomy, is a routine waiting to be
            standardized. A free account keeps every conversion in one searchable history, so the
            settlement behind any number is findable months later. The dashboard adds bulk
            conversion when several settlements land at once, and client portals if you run books
            for other sellers — each client uploads through their own link. QBO downloads sit on{" "}
            <a href="/pricing" className="font-semibold text-pine-600 hover:underline dark:text-pine-400">Pro</a>,
            and the same clearing model covers your other channels through the{" "}
            <a href="/tools/shopify-to-quickbooks" className="font-semibold text-pine-600 hover:underline dark:text-pine-400">Shopify Payout Converter</a>.
            Before importing, the{" "}
            <a href="/tools/free-qbo-cleanup-checker" className="font-semibold text-pine-600 hover:underline dark:text-pine-400">QBO Duplicate Finder</a>{" "}
            will scan any file for repeated transaction IDs — cheap insurance against the overlap
            mistake above.
          </p>
        </>
      }
    />
  );
}
