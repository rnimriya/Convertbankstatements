import type { Metadata } from "next";
import { ToolPageLayout, type ToolFaq } from "@/components/tools/ToolPageLayout";
import { FormatConverter } from "@/components/tools/FormatConverter";

const PAGE_URL = "https://www.convertstatement.online/tools/csv-to-qif";

export const metadata: Metadata = {
  title: "CSV to QIF Converter — Free | Convert Statement",
  description: "Turn a spreadsheet of transactions into a QIF file for the older and specialist apps that still import Quicken's legacy format. Fully free with no account. Files are processed in memory and never stored.",
  alternates: { canonical: PAGE_URL },
  openGraph: {
    title: "CSV to QIF Converter — Free",
    description: "Upload a CSV file and download it as QIF — dates, descriptions and amounts carried over exactly. Fully free, no account needed.",
    url: PAGE_URL,
    type: "website",
  },
};

const FAQS: ToolFaq[] = [
  {
    q: "How do I convert a CSV file to QIF?",
    a: "Export a CSV with a header row, drop it into the converter above (one .csv file, up to 10 MB), and press Convert to QIF. The QIF downloads automatically and the confirmation shows how many transactions were converted. Fully free, no account, and your file is processed in memory and never stored.",
  },
  {
    q: "What do the letters at the start of each QIF line mean?",
    a: "QIF is plain text where each line's first letter is a field tag. The records built here use D for the date, T for the amount, P for the payee, and M for a memo when your CSV has one, with each record closed by a line containing only ^. The format also defines an L tag for category — this converter does not write categories, because a bank CSV's columns do not map to them reliably, so categorize after import instead.",
  },
  {
    q: "What happens if I import the same QIF file twice?",
    a: "You get every transaction twice. QIF carries no transaction IDs and no statement identity, so the receiving software has no way to recognize a file it has already imported — there is no duplicate protection of any kind. Import each converted file once, into the correct account, and if you convert overlapping date ranges, expect to delete the overlap by hand.",
  },
  {
    q: "Which programs still read QIF?",
    a: "Older Quicken versions from before QIF was retired in favor of QFX, GnuCash — whose QIF import remains a standard way to bring in bank data — and a tail of long-lived personal-finance and bookkeeping apps that never adopted OFX. If a program's import menu lists QIF, it is asking for exactly this format. Current Quicken is not one of them: it is built around QFX, so use the CSV to QFX converter for Quicken instead.",
  },
  {
    q: "Why does the file start with !Type:Bank?",
    a: "That header tells the reader what kind of account the records belong to, and this converter writes bank-account records, because that is the statement shape it builds. A credit card CSV will convert, but it will be declared as a bank account in the header — check that your software offers you the right destination account at import, and keep the original CSV as the record of what the data really was.",
  },
  {
    q: "Is this converter free, and what happens to my data?",
    a: "Yes — fully free, no account, no paid tier behind the download. Your file is processed in memory to build the QIF and is never stored, sold or shared.",
  },
];

const HOWTO = [
  { title: "Get the CSV you need converted", body: "Export the transactions from your bank or current app as CSV, keeping the header row — Date, Description and Amount (or a Debit/Credit pair)." },
  { title: "Upload it here", body: "Drop the .csv file into the converter above — one file, up to 10 MB, no account needed. Files are processed in memory and never stored." },
  { title: "Convert to QIF", body: "Press Convert to QIF. Each readable row becomes a QIF record — D date, T amount, P payee, M memo — under a !Type:Bank header." },
  { title: "Download and import once, carefully", body: "Save the .qif file — fully free — and import it into the account it belongs to. QIF has no duplicate protection, so import each file exactly once." },
];

const H2 = "text-2xl font-extrabold text-zinc-900 dark:text-white";
const H2M = "text-2xl font-extrabold text-zinc-900 dark:text-white mt-12";
const H3 = "text-lg font-bold text-zinc-900 dark:text-white mt-8";
const P = "mt-3 text-zinc-600 dark:text-zinc-300 leading-relaxed";
const TH = "border border-[#E3EDE0] bg-[#EFF7ED] px-3 py-2 text-left font-semibold text-zinc-900";
const TD = "border border-[#E3EDE0] px-3 py-2 text-zinc-600 dark:text-zinc-300 align-top";

export default function CsvToQifPage() {
  return (
    <ToolPageLayout
      fullyFree
      eyebrow="Free Tool"
      title="CSV to QIF Converter"
      subtitle="Turn a spreadsheet of transactions into a QIF file for the older and specialist apps that still import Quicken's legacy format. Fully free with no account."
      tool={<FormatConverter tool="csv-to-qif" fromLabel="CSV" toLabel="QIF" accept=".csv" outputExt="qif" />}
      currentPath="/tools/csv-to-qif"
      faqs={FAQS}
      howToName="How to convert CSV to QIF"
      howToSteps={HOWTO}
      privacyLine="No account needed · Processed in memory, never stored"
      content={
        <>
          <h2 className={H2}>QIF is a legacy format that never quite went away</h2>
          <p className={P}>
            QIF — Quicken Interchange Format — was Quicken&apos;s original way of moving transactions between programs, and its design shows its age in the best and worst ways. It is plain text you can open in any editor: a header line naming the account type, then one small record per transaction, each field announced by a single letter. <strong>D</strong> is the date, <strong>T</strong> the amount, <strong>P</strong> the payee, <strong>L</strong> the category, <strong>M</strong> a memo, and a line containing only <strong>^</strong> ends the record. No XML, no bank identity, no closing balance, no transaction IDs. Intuit retired QIF in favor of QFX in the mid-2000s, but software does not die on the vendor&apos;s schedule: older Quicken versions still read it, GnuCash still imports it as a standard route for bank data, and a long tail of personal-finance tools never adopted anything newer. For those programs, a modern bank CSV is useless until it is reshaped into these tagged little records.
          </p>
          <p className={P}>
            The typical job is a migration or a rescue. You are moving years of history out of a bank or an app that only exports CSV into GnuCash or an older finance program that only imports QIF. Or a client&apos;s records live in spreadsheets and the one tool that will take them speaks QIF. Either way the data is ready and the format is the obstacle — which is exactly the part a converter should absorb.
          </p>
          <p className={P}>
            QIF&apos;s simplicity carries one safety consequence that deserves emphasis before anything else on this page: <strong>QIF has no duplicate protection.</strong> There is no FITID, no statement ID, nothing for the receiving program to recognize as “already imported.” Import the same file twice and you own two of everything, silently. The format also names no account beyond the !Type:Bank header, so the file goes into whichever account you select at import. Neither flaw is fixable by any converter — they are properties of QIF itself — so the discipline is on the workflow: convert deliberately, import once, into the right account.
          </p>

          <h2 className={H2M}>How to convert CSV to QIF with this converter</h2>
          <p className={P}>
            <strong>Step 1 — Get the CSV.</strong> Export the transactions from your bank or current app as a CSV with its header row intact. The converter reads a date column, a description or payee column, and either a single signed amount column or a debit/credit pair. Because QIF keeps so little, this is also the moment to look at the spreadsheet itself: the payee text and memo in the CSV are essentially all the context the QIF will ever carry.
          </p>
          <p className={P}>
            <strong>Step 2 — Upload it.</strong> Drop the .csv into the tool at the top of this page — one file, up to 10 MB, no account needed, processed in memory and never stored.
          </p>
          <p className={P}>
            <strong>Step 3 — Convert.</strong> Press <strong>Convert to QIF</strong>. The header row is auto-detected, debits become negative amounts and credits stay positive, and each readable row becomes one QIF record under a <strong>!Type:Bank</strong> header: a D line with the date in MM/DD/YYYY form, a T line with the amount, a P line with the payee, an M line when your CSV supplied a memo, and the closing ^ line. Two things the converter deliberately does not write: an L category line — a bank CSV&apos;s columns do not map to categories reliably, so categorization belongs after import, in the software that knows your category list — and any account identity, because QIF has nowhere honest to put it. Rows whose date or amount cannot be read are skipped rather than guessed.
          </p>
          <p className={P}>
            <strong>Step 4 — Download, then import once, into the right account.</strong> The .qif downloads automatically, fully free, with the converted transaction count in the confirmation — compare it with your CSV&apos;s rows. At import, select the destination account deliberately (the file will not correct you), and after importing, delete or archive the converted file&apos;s “already done” status in whatever way your workflow tracks it. With QIF, the second import is the accident that actually happens to people.
          </p>

          <h2 className={H2M}>When a CSV to QIF conversion goes wrong</h2>
          <h3 className={H3}>Everything imported twice</h3>
          <p className={P}>
            The format&apos;s missing duplicate protection, met in real life: a file imported once during a trial and again “for real,” or two monthly QIFs with overlapping dates. There is no fix inside QIF — prevention is the whole game. Convert one date range per file, name files by the range they cover, and if an overlap does land, delete the duplicated block in the receiving program before you categorize anything, while the duplicates are still identical and easy to spot.
          </p>
          <h3 className={H3}>Dates land swapped — the 03/04 problem</h3>
          <p className={P}>
            QIF dates are written in the US MM/DD/YYYY convention, and this converter writes them that way. Most readers expect the same. But a reader configured for day-first dates will happily interpret 03/04/2026 as 3 April instead of March 4 whenever both numbers are 12 or under — and dates with a day above 12 then fail or scatter. If imported dates look subtly wrong rather than wildly wrong, this ambiguity is the first suspect: check a transaction whose day is above 12, and if your software has a QIF date-format setting, set it to month-first before importing again.
          </p>
          <h3 className={H3}>Categories you expected never appear</h3>
          <p className={P}>
            If your CSV had a Category column, do not expect it to arrive as QIF categories: as noted above, this converter writes D, T, P and M lines only, because guessing an L value from whatever a bank puts in its extra columns corrupts more books than it helps. The practical workflow is to import the transactions uncategorized and let the receiving program&apos;s payee rules assign categories, which is where that knowledge actually lives.
          </p>
          <h3 className={H3}>The reader rejects the file or reads only part of it</h3>
          <p className={P}>
            QIF readers are old and vary. The commonest problem is a short file, not a rejected one: a source CSV row with an unreadable date or amount is skipped at conversion, so the QIF is complete for the rows that could be read but shorter than the spreadsheet — and the transaction-count confirmation is how you catch it. A file rejected outright is often a reader that expects a different !Type header than Bank. This converter writes bank records; investment QIF is a different, much larger dialect and is out of scope for it.
          </p>

          <h2 className={H2M}>QIF or a newer format? Choosing the hand-off</h2>
          <p className={P}>
            Choose QIF only when the receiving program actually asks for it — it is a door for specific, mostly older software, not a general-purpose upgrade from CSV. If the destination is current Quicken, the <a href="/tools/csv-to-qfx" className="font-semibold text-pine-600 hover:underline dark:text-pine-400">CSV to QFX converter</a> builds the format Quicken listens for, with transaction IDs QIF cannot offer. If it is QuickBooks, the <a href="/tools/csv-to-qbo" className="font-semibold text-pine-600 hover:underline dark:text-pine-400">CSV to QBO converter</a> is the right variant of the same family. And if you are rescuing data out of QIF rather than into it, the <a href="/tools/qif-to-csv" className="font-semibold text-pine-600 hover:underline dark:text-pine-400">QIF to CSV converter</a> returns legacy records to a spreadsheet, while the <a href="/tools/qif-to-qbo" className="font-semibold text-pine-600 hover:underline dark:text-pine-400">QIF to QBO converter</a> brings them forward into QuickBooks.
          </p>
          <p className={P}>
            The honest summary of the trade: what QIF gives you is reach — decades of software will read it — and what it costs you is every safeguard newer formats added. No duplicate detection, no account identity, no balance to reconcile against. For a one-way migration into software that keeps its own books from there, that trade is usually right. For an ongoing monthly feed into the same account, a format with transaction IDs will save you from yourself.
          </p>
        </>
      }
    />
  );
}
