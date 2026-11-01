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
    q: "What if the extracted total doesn't match my receipt?",
    a: "Trust the paper, not the extraction. The review screen recomputes the total live as you edit, so fix the misread line — a 3 read as an 8 is the classic — until the screen total equals the printed total to the cent. Only download once they match; that match is your proof the entry is right.",
  },
  {
    q: "Can it read receipts in other currencies?",
    a: "It reads what is printed, including foreign-currency totals on travel receipts. Check the currency in the review step: the amount is usually read correctly while the currency may be assumed from the vendor's country. Enter the expense in QuickBooks in the receipt's own currency and let QuickBooks convert at the card rate.",
  },
  {
    q: "Should I keep the paper receipt after converting?",
    a: "Yes — keep the photo or the paper. The QBO file carries the numbers into QuickBooks, but the receipt itself is the supporting document your accountant (and the IRS) wants behind the expense. Save the image with the same date and vendor name as the entry and it stays findable years later.",
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

const H2 = "text-2xl font-extrabold text-zinc-900 dark:text-white";
const H2M = "text-2xl font-extrabold text-zinc-900 dark:text-white mt-12";
const H3 = "text-lg font-bold text-zinc-900 dark:text-white mt-8";
const P = "mt-3 text-zinc-600 dark:text-zinc-300 leading-relaxed";
const TH = "border border-[#E3EDE0] bg-[#EFF7ED] px-3 py-2 text-left font-semibold text-zinc-900";
const TD = "border border-[#E3EDE0] px-3 py-2 text-zinc-600 dark:text-zinc-300 align-top";

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
          <h2 className={H2}>Why receipts still eat bookkeeping time</h2>
          <p className={P}>
            Your bank feed captures the charge, but not what was bought — and the paper receipt is
            the only record that holds the vendor, the line items, and the tax. Without it, a card
            charge is just a number you have to guess at in April. Typing receipts by hand is slow
            and error-prone, and the shoebox-at-tax-time routine is exactly how deductions get
            missed: faded thermal paper, a receipt that never made it out of a truck cab, a total
            nobody can reconstruct. This tool reads the receipt for you, suggests a category for
            each line, and hands you a file QuickBooks accepts — with you in control of every line
            before it touches your books.
          </p>
          <p className={P}>
            The honest division of labor matters: the AI drafts, you approve. Extraction from a
            photo is never perfect, so the tool is built around a review step where every field is
            editable and the total recomputes as you fix things. Two minutes of checking beats an
            hour of unwinding a wrong expense later.
          </p>

          <h2 className={H2M}>What the tool reads — and what you still check</h2>
          <p className={P}>
            A receipt carries six facts your books need. The tool extracts all six; the review step
            exists because each one has a characteristic way of going wrong:
          </p>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr>
                  <th className={TH}>Field</th>
                  <th className={TH}>Read from</th>
                  <th className={TH}>Your check</th>
                </tr>
              </thead>
              <tbody>
                <tr><td className={TD}><strong>Vendor</strong></td><td className={TD}>The store name at the top of the receipt</td><td className={TD}>It is the business you actually paid — logos and abbreviations mislead</td></tr>
                <tr><td className={TD}><strong>Date</strong></td><td className={TD}>The printed transaction date</td><td className={TD}>The purchase date, not the day the card charge posted</td></tr>
                <tr><td className={TD}><strong>Line items</strong></td><td className={TD}>Each itemized row, when the receipt is itemized</td><td className={TD}>Quantities and prices multiply out to the subtotal</td></tr>
                <tr><td className={TD}><strong>Tax</strong></td><td className={TD}>The tax line or lines</td><td className={TD}>Whether tax was added on top or included in the prices</td></tr>
                <tr><td className={TD}><strong>Total</strong></td><td className={TD}>The grand total</td><td className={TD}>Matches your bank or card charge to the cent</td></tr>
                <tr><td className={TD}><strong>Category</strong></td><td className={TD}>Suggested from the vendor, by the same rules that categorize statements</td><td className={TD}>The right account for this purchase — a suggestion, not a decision</td></tr>
              </tbody>
            </table>
          </div>
          <figure className="mt-6">
            <img src="/tools/csv-to-qbo-desk.webp" alt="A desk with paper receipts next to a laptop, being turned into QuickBooks expense entries" className="w-full rounded-[20px] border border-[#E3EDE0]" loading="lazy" />
            <figcaption className="mt-2 text-center text-xs text-zinc-400">Illustration: the paper pile every bookkeeper knows — this tool turns it into importable expenses.</figcaption>
          </figure>

          <h2 className={H2M}>The workflow: snap, review, fix, import</h2>
          <ol className="mt-3 list-decimal space-y-2 pl-5 leading-relaxed text-zinc-600 dark:text-zinc-300 marker:font-bold marker:text-[#007A33]">
            <li><strong className="text-zinc-900 dark:text-white">Snap it flat.</strong> Whole receipt in frame, straight-on, decent light — or upload the PDF version if the vendor emailed one.</li>
            <li><strong className="text-zinc-900 dark:text-white">Let it read.</strong> The vendor, date, line items and totals are extracted in seconds and laid out as editable expense lines.</li>
            <li><strong className="text-zinc-900 dark:text-white">Review like a bookkeeper.</strong> Fix any misread digit, split lines that need different categories, and confirm the on-screen total equals the printed total.</li>
            <li><strong className="text-zinc-900 dark:text-white">Download and import.</strong> The CSV is free with your account; the QBO is on Pro. Import it like any bank file and reconcile against the card charge.</li>
          </ol>
          <p className={P}>
            Receipt extraction runs on your free account — that is what keeps your processing
            history attached to you instead of floating in a browser tab. Nothing is stored after
            processing; the file you download is the record.
          </p>
          <p className={P}>
            Not every receipt is paper. Emailed receipts and vendor PDFs go through the same
            extraction — text PDFs are read directly, scans through the same vision chain as
            photos — so the pile from your inbox and the pile from your glovebox end up in one
            consistent format, with the same review step in between. That consistency is what makes
            a month of expenses import as one calm batch instead of twelve small arguments.
          </p>

          <h2 className={H2M}>A worked example: one receipt, read end to end</h2>
          <p className={P}>
            Take an ordinary office-supply run (sample receipt, shown for illustration). This is
            what the extraction produces — and what you would see in the review step:
          </p>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr><th className={TH}>Line</th><th className={TH}>Amount</th></tr>
              </thead>
              <tbody>
                <tr><td className={TD}>Copy paper, 2 × $12.99</td><td className={TD}>$25.98</td></tr>
                <tr><td className={TD}>Ink cartridge</td><td className={TD}>$34.50</td></tr>
                <tr><td className={TD}>Subtotal</td><td className={TD}>$60.48</td></tr>
                <tr><td className={TD}>Sales tax (8.25%)</td><td className={TD}>$4.99</td></tr>
                <tr><td className={TD}><strong>Total</strong></td><td className={TD}><strong>$65.47</strong></td></tr>
              </tbody>
            </table>
          </div>
          <p className={P}>
            Vendor read as the office-supply store, the date taken from the receipt, both lines
            suggested as Office Supplies. The check that matters: $25.98 + $34.50 = $60.48, plus
            $4.99 tax = $65.47 — and $65.47 is the charge on the card. When the extracted total and
            the bank charge agree to the cent, the expense can go in with confidence. When they do
            not, the difference names the misread line, and you fix it in the review step rather
            than in your books.
          </p>
          <p className={P}>
            Notice what the example did not require: no typing. The vendor, the date, both items,
            the tax and the total arrived on their own; the human work was a thirty-second
            verification against the paper. That is the realistic promise of receipt automation —
            not magic accuracy, but the removal of transcription, with a checkpoint exactly where
            judgment belongs. Receipts with more lines work the same way; the review simply has
            more rows to glance down.
          </p>

          <h2 className={H2M}>Photo problems that cause misreads</h2>
          <h3 className={H3}>Blurry or tilted photos</h3>
          <p className={P}>
            A receipt shot at an angle, in motion, or cropped at the edges defeats any reader — the
            bottom lines, where the total lives, are the first to go. Lay the receipt flat, fill
            the frame, and shoot straight down. If the total row is cut off in the photo, no
            extraction can invent it.
          </p>
          <h3 className={H3}>Faded thermal paper</h3>
          <p className={P}>
            Thermal receipts fade in weeks, faster in a hot vehicle. Photograph them the day you
            get them; a faded 8 that reads as a 3 changes the total, which is why the review step
            compares totals instead of trusting individual digits. When the paper is already pale,
            type the total in yourself and let the lines be checked against it.
          </p>
          <h3 className={H3}>When the total and the tax do not add up</h3>
          <p className={P}>
            Restaurants add tips after the printed subtotal; some prices include tax instead of
            adding it. Both make honest arithmetic look broken. Enter the final amount you actually
            paid as the total, keep the tax line as printed, and put a tip on its own line — the
            books should mirror the money, not the receipt's layout.
          </p>
          <h3 className={H3}>Wrong currency</h3>
          <p className={P}>
            Travel receipts are read in the currency they were printed in, but a symbol misread — or
            a vendor name that sounds domestic — can leave the expense in the wrong currency at the
            right number. Check the currency in the review step on any receipt earned away from
            home; a €65 expense booked as $65 is a small error that compounds across a trip.
          </p>
          <h3 className={H3}>Personal items on a business receipt</h3>
          <p className={P}>
            One store run often serves two masters. Only the business lines belong in your books:
            delete or zero the personal lines in the review step so the downloaded file totals the
            business portion only — and so the expense in QuickBooks never has to explain a line
            that was never the company's.
          </p>

          <h2 className={H2M}>What makes a receipt record audit-ready</h2>
          <p className={P}>
            A deductible expense needs four facts behind it: the amount, the date, who was paid,
            and what business purpose it served. A well-kept receipt supplies the first three on
            its face — which is why the extraction targets exactly those fields — and the fourth is
            yours to add while you still remember it: a note in QuickBooks ("client lunch — website
            project") takes ten seconds at entry time and is nearly impossible to reconstruct a
            year later. Card statements alone prove you paid someone; they do not prove what you
            bought, and on their own they are the first records challenged in an audit. The receipt
            plus the charge is the complete evidence pair: the receipt shows the goods and the tax,
            the statement shows the money moved. Converting the receipt the week you get it — while
            the paper is crisp and the purpose is obvious — is what turns a shoebox into a filing
            system.
          </p>

          <h2 className={H2M}>Match the receipt to the bank charge — do not duplicate it</h2>
          <p className={P}>
            The deeper check most people skip: if the charge is already in your bank feed, it is
            already an expense waiting to be categorized. The receipt's job in that case is
            documentation — what was bought, and the tax — not a second entry. Import the QBO lines
            when the charge is not in the feed (cash purchases, a personal card awaiting
            reimbursement), and use the extracted detail to categorize and annotate the feed
            transaction when it is. Creating both doubles the expense, and doubled expenses are
            exactly what our{" "}
            <a href="/tools/free-qbo-cleanup-checker" className="font-semibold text-pine-600 hover:underline dark:text-pine-400">QBO Duplicate Finder</a>{" "}
            hunts for at month-end.
          </p>

          <p className={P}>
            One habit ties this together: process receipts in the week they happen, in small
            batches. The photos are sharper in your camera roll than in a drawer, the business
            purpose is still in your head for the note, and the totals can be matched against card
            charges that are still on your banking app's first screen. Ten receipts a week is a
            five-minute routine; two hundred in December is a lost weekend — and the difference is
            nothing but timing.
          </p>

          <h2 className={H2M}>A shoebox every month? Make it a system</h2>
          <p className={P}>
            One receipt is a chore; a client's monthly envelope of them is a workflow. Your free
            account keeps every receipt conversion in one history alongside your statement
            conversions, so the proof behind any expense is a search away. The dashboard adds bulk
            conversion when a whole month of bank statements lands at once, and client portals if
            you collect documents from other people — each client uploads through their own link
            and the conversion bills to you. When you are ready for QBO downloads of every receipt
            and higher limits across the tools,{" "}
            <a href="/pricing" className="font-semibold text-pine-600 hover:underline dark:text-pine-400">Pro</a>{" "}
            covers it.
          </p>
          <p className={P}>
            Converting the statements those receipts belong to? Our{" "}
            <a href="/quickbooks" className="font-semibold text-pine-600 hover:underline dark:text-pine-400">statement-to-QBO converter</a>{" "}
            handles full bank statements with a balance check, and the{" "}
            <a href="/tools/csv-to-qbo" className="font-semibold text-pine-600 hover:underline dark:text-pine-400">CSV to QBO Converter</a>{" "}
            turns any bank CSV export into the same QuickBooks-ready format.
          </p>
        </>
      }
    />
  );
}
