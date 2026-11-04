import type { Metadata } from "next";
import { ToolPageLayout, type ToolFaq } from "@/components/tools/ToolPageLayout";
import { QboToCsv } from "@/components/tools/QboToCsv";

const PAGE_URL = "https://www.convertstatement.online/tools/qbo-to-csv";

export const metadata: Metadata = {
  title: "QBO to CSV Converter — Free QBO / OFX to CSV & Excel | Convert Statement",
  description:
    "Free QBO to CSV converter: turn a QuickBooks Web Connect (.qbo), OFX or QFX file into a clean CSV or Excel spreadsheet with dates, descriptions, amounts and transaction IDs. Fully free, no account, files never stored.",
  alternates: { canonical: PAGE_URL },
  openGraph: {
    title: "QBO to CSV Converter — QBO / OFX to CSV & Excel",
    description:
      "Upload a QBO, OFX or QFX file and download its transactions as CSV or Excel. Fully free, no account needed.",
    url: PAGE_URL,
    type: "website",
  },
};

const FAQS: ToolFaq[] = [
  {
    q: "How do I convert a QBO file to CSV?",
    a: "Upload the .qbo file here. The tool reads the transactions inside it — date, type, description, amount, and the transaction ID (FITID) — and shows a preview with your totals. Download the CSV or the Excel file, both fully free with no account.",
  },
  {
    q: "Can I also convert OFX or QFX files?",
    a: "Yes. A QBO file is OFX format underneath, so the same converter reads .ofx files from banks and .qfx files from Quicken. All three produce the same spreadsheet every time: Date, Type, Description, Amount, Transaction ID — no rows are dropped.",
  },
  {
    q: "Why would I convert a QBO to a spreadsheet?",
    a: "Spreadsheets are easier to review, sort, filter, and share than a Web Connect file. Accountants convert QBO files to CSV or Excel to check transactions before importing, to send a client a readable copy, or to load the data into another system that does not read QBO.",
  },
  {
    q: "Are the amounts changed during conversion?",
    a: "No. Amounts are copied exactly as they appear in your file — credits stay positive and debits stay negative, the sign convention QuickBooks and spreadsheets both use. The result screen shows money in, money out, and the net change so you can tie the spreadsheet to the file.",
  },
  {
    q: "What does the Transaction ID column contain?",
    a: "It is the FITID from your file — the unique ID QuickBooks uses to detect duplicates. Keeping it in the spreadsheet makes it possible to trace any row back to the exact transaction in the original file. Rows whose file had no FITID are left blank in that column.",
  },
  {
    q: "Can I convert a credit card QBO file?",
    a: "Yes. Credit card downloads use the same QBO format with a credit-card section instead of a bank section, and this converter reads both. Charges come out negative and payments positive, matching how the card statement reads, so the spreadsheet matches the card activity you see at your bank.",
  },
  {
    q: "Do the CSV and Excel downloads contain the same data?",
    a: "Yes. The CSV and Excel downloads are two wrappings of the same conversion — identical rows, columns, and totals. Choose CSV for importing into other software and Excel when a person will read, sort, or annotate the file, since the Excel version opens formatted and ready in a spreadsheet app.",
  },
  {
    q: "What if my file will not convert, or converts with warnings?",
    a: "Most often the file was truncated during download, renamed from another format, or has a structural problem inside its OFX data. The result screen lists what was found. Run it through the QBO File Checker to diagnose it, or the OFX to QBO fixer to repair it.",
  },
  {
    q: "Can I turn the spreadsheet back into a QBO file afterwards?",
    a: "Yes — that is what the CSV to QBO converter is for. It maps your spreadsheet columns back into a Web Connect file with a balance-chain check and unique transaction IDs, so a file that started life as a QBO can round-trip through a spreadsheet and back into QuickBooks cleanly.",
  },
  {
    q: "Is my data uploaded or stored?",
    a: "Your file is processed in memory to build the conversion and is not stored afterwards. We never sell or share your financial data, and both downloads are free with no account. The whole conversion happens when you upload; nothing is kept once you leave the page.",
  },
];

const HOWTO = [
  { title: "Get your QBO file", body: "Download the .qbo, .ofx, or .qfx file from your bank, or use one you already have on your computer." },
  { title: "Upload it here", body: "Drop the file in. The tool reads its transactions and shows the statement period and totals." },
  { title: "Check the preview", body: "Review the first 50 rows and the money-in, money-out, and net totals, plus any warnings about the file itself." },
  { title: "Download CSV or Excel", body: "Save the spreadsheet — both downloads are fully free, with every row from the file included." },
];

const H2 = "text-2xl font-extrabold text-zinc-900 dark:text-white";
const H2M = "text-2xl font-extrabold text-zinc-900 dark:text-white mt-12";
const H3 = "text-lg font-bold text-zinc-900 dark:text-white mt-8";
const P = "mt-3 text-zinc-600 dark:text-zinc-300 leading-relaxed";
const TH = "border border-[#E3EDE0] bg-[#EFF7ED] px-3 py-2 text-left font-semibold text-zinc-900";
const TD = "border border-[#E3EDE0] px-3 py-2 text-zinc-600 dark:text-zinc-300 align-top";

export default function QboToCsvPage() {
  return (
    <ToolPageLayout
      fullyFree
      eyebrow="Free Tool"
      title="QBO to CSV Converter"
      subtitle="Turn a QuickBooks QBO, OFX, or QFX file into a clean CSV or Excel spreadsheet — dates, descriptions, amounts, and transaction IDs, fully free with no account."
      tool={<QboToCsv />}
      currentPath="/tools/qbo-to-csv"
      faqs={FAQS}
      howToName="How to convert a QBO to CSV"
      howToSteps={HOWTO}
      privacyLine="No account needed · Processed in memory, never stored"
      content={
        <>
          <h2 className={H2}>Why turn a QBO back into a spreadsheet?</h2>
          <p className={P}>
            A QBO file does exactly one job well: it feeds transactions into QuickBooks. For
            everything else — reviewing activity with a client, analyzing spending in a pivot
            table, handing data to software that has never heard of Web Connect, or moving away
            from QuickBooks entirely — it is the wrong shape. A QBO is a nested tag format
            written for machines. Open one and you see markup, not transactions.
          </p>
          <p className={P}>
            Converting the file to CSV or Excel turns that markup into rows anyone can read:
            one transaction per line, with its date, type, description, amount, and the
            transaction ID QuickBooks itself uses to spot duplicates. Nothing about the
            underlying data changes — only its shape does. This converter gives you both
            wrappings: a CSV for systems that will import the data again, and an Excel file
            for people who need to read, sort, and annotate it. The totals are shown before
            you download, so you can prove the spreadsheet and the file agree.
          </p>

          <h2 className={H2M}>What is actually inside a QBO file</h2>
          <p className={P}>
            A QBO is an OFX document with four parts that matter. At the top sits the statement
            header: the bank, the account, the currency, and the statement period. Below that
            comes the transaction list. Each transaction carries its posting date, its type,
            a signed amount, the payee text, and a FITID — the unique ID the bank assigned it.
            At the end, the ledger balance records the closing balance the bank says the
            account reached. Here is where each part lands when you convert:
          </p>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr>
                  <th className={TH}>Part of the file</th>
                  <th className={TH}>What it holds</th>
                  <th className={TH}>Where it lands</th>
                </tr>
              </thead>
              <tbody>
                <tr><td className={TD}><strong>Statement header</strong></td><td className={TD}>Bank, account, currency, statement period</td><td className={TD}>The preview summary, so you can confirm you converted the right file</td></tr>
                <tr><td className={TD}><strong>Transaction (STMTTRN)</strong></td><td className={TD}>Date, type, amount, payee and memo text</td><td className={TD}>One row per transaction in the spreadsheet</td></tr>
                <tr><td className={TD}><strong>FITID</strong></td><td className={TD}>The bank's unique ID for that transaction</td><td className={TD}>The Transaction ID column, kept intact</td></tr>
                <tr><td className={TD}><strong>Ledger balance (LEDGERBAL)</strong></td><td className={TD}>Closing balance for the statement period</td><td className={TD}>The totals panel, so the spreadsheet can be tied back to the bank</td></tr>
              </tbody>
            </table>
          </div>
          <figure className="mt-6 flex flex-col gap-5 rounded-[24px] border border-[#D8E8D2] bg-[#EFF7ED] p-5 sm:flex-row sm:items-center sm:gap-6 sm:p-6">
            <img src="/tools/csv-to-qbo-spreadsheet.webp" alt="A spreadsheet of bank transactions converted out of a QBO file, with date, description, amount and transaction ID columns" className="w-full shrink-0 rounded-[16px] sm:w-[400px]" loading="lazy" />
            <figcaption className="text-sm leading-relaxed text-[#33502F]">The same transactions, laid out as rows anyone can open.</figcaption>
          </figure>

          <h2 className={H2M}>The five columns you get</h2>
          <p className={P}>
            Every download — CSV or Excel — uses the same five columns, in the same order, so a
            file you convert today lines up with one you converted last quarter:
          </p>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr>
                  <th className={TH}>Column</th>
                  <th className={TH}>Contents</th>
                  <th className={TH}>Good to know</th>
                </tr>
              </thead>
              <tbody>
                <tr><td className={TD}><strong>Date</strong></td><td className={TD}>The transaction's posting date</td><td className={TD}>Written as a real date, so spreadsheets sort it correctly</td></tr>
                <tr><td className={TD}><strong>Type</strong></td><td className={TD}>CREDIT, DEBIT and the other OFX types</td><td className={TD}>The direction of the movement, as the bank recorded it</td></tr>
                <tr><td className={TD}><strong>Description</strong></td><td className={TD}>Payee and memo text from the file</td><td className={TD}>Copied word for word — nothing is cleaned up or renamed</td></tr>
                <tr><td className={TD}><strong>Amount</strong></td><td className={TD}>The signed amount</td><td className={TD}>Money in positive, money out negative</td></tr>
                <tr><td className={TD}><strong>Transaction ID</strong></td><td className={TD}>The FITID from the file</td><td className={TD}>Blank only when the original file itself carried no ID</td></tr>
              </tbody>
            </table>
          </div>

          <h2 className={H2M}>How to convert a QBO file, step by step</h2>
          <ol className="mt-3 list-decimal space-y-2 pl-5 leading-relaxed text-zinc-600 dark:text-zinc-300 marker:font-bold marker:text-[#007A33]">
            <li><strong className="text-zinc-900 dark:text-white">Get the file.</strong> Download the .qbo, .ofx or .qfx file from your bank, or find the one already sitting on your computer.</li>
            <li><strong className="text-zinc-900 dark:text-white">Drop it in above.</strong> The converter reads the OFX data and identifies the account and statement period itself — there is nothing to map.</li>
            <li><strong className="text-zinc-900 dark:text-white">Check the preview.</strong> Review the first 50 transactions, the money-in and money-out totals, the net change, and any warnings about the file.</li>
            <li><strong className="text-zinc-900 dark:text-white">Download CSV or Excel.</strong> Both files contain every transaction from the original, not just the previewed rows — and both are fully free.</li>
          </ol>

          <h2 className={H2M}>Before you trust the spreadsheet, tie it out</h2>
          <p className={P}>
            A conversion is only useful if it is provably complete, and the result screen gives
            you the three numbers that prove it. First, the row count: the spreadsheet should
            hold exactly as many transactions as the preview reports for the file. Second, the
            net change: money in minus money out should equal the net figure shown, to the
            cent. Third, the closing position: add the net change to the balance the account
            had at the start of the period and you should land on the file's ledger balance.
            When all three agree, the spreadsheet is the file — just in a shape people can
            read. If the file arrived with problems, such as a missing closing balance or
            repeated transaction IDs, those are listed as warnings rather than hidden, because
            a spreadsheet built from a flawed file inherits the flaws.
          </p>
          <p className={P}>
            The Transaction ID column earns its place during this check. Because every row
            keeps the FITID the bank assigned, any single spreadsheet row can be traced back
            to the exact transaction block inside the original file — open the QBO in a text
            editor, search for the ID, and you are looking at the source. That traceability
            is what makes the spreadsheet safe to circulate: a questioned number never has to
            be taken on trust, because its origin is one search away.
          </p>

          <h2 className={H2M}>A worked example: three transactions as spreadsheet rows</h2>
          <p className={P}>
            Here is what the middle of a converted file looks like — three ordinary
            transactions from a sample account, exactly as they appear in the download:
          </p>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr><th className={TH}>Date</th><th className={TH}>Type</th><th className={TH}>Description</th><th className={TH}>Amount</th><th className={TH}>Transaction ID</th></tr>
              </thead>
              <tbody>
                <tr><td className={TD}>11/03/2026</td><td className={TD}>CREDIT</td><td className={TD}>Client payment — invoice 1042</td><td className={TD}>1,250.00</td><td className={TD}>20261103001</td></tr>
                <tr><td className={TD}>11/04/2026</td><td className={TD}>DEBIT</td><td className={TD}>Cloud hosting</td><td className={TD}>-96.40</td><td className={TD}>20261104001</td></tr>
                <tr><td className={TD}>11/06/2026</td><td className={TD}>DEBIT</td><td className={TD}>Office rent</td><td className={TD}>-1,800.00</td><td className={TD}>20261106001</td></tr>
              </tbody>
            </table>
          </div>
          <p className={P}>
            The totals those rows produce: money in $1,250.00, money out $1,896.40, net change
            −$646.40. That is the entire conversion — three tagged blocks inside the QBO become
            three readable rows, IDs intact, ready to sort or share. (Sample data, shown for
            illustration.)
          </p>

          <h2 className={H2M}>Credit card QBO files work the same way</h2>
          <p className={P}>
            Banks issue QBO downloads for credit cards too. The file carries a credit-card
            section instead of a bank-account section, but the transactions inside are the
            same shape — date, type, amount, description, ID — so this converter reads them
            without any special handling. Charges appear as negative amounts and payments as
            positive ones, matching the way the card statement itself reads. That makes the
            spreadsheet a practical tool for expense reviews: sort a year of card activity by
            description and every recurring charge groups itself, or filter by amount to find
            the one transaction a cardholder is asking about. The totals still tie back to the
            file's closing balance, so the review rests on the bank's own numbers.
          </p>
          <p className={P}>
            Card files also expose a trap the spreadsheet defuses. Banks let you download
            overlapping ranges — this month plus a few days of last month, say — and two
            downloads stitched together by hand will double-count the overlap. In spreadsheet
            form, the overlap is easy to spot and remove: sort by Transaction ID and the
            duplicated rows sit next to each other, sharing an ID no two genuine transactions
            ever share. Delete one copy of each pair and the totals return to the bank's
            numbers.
          </p>

          <h2 className={H2M}>When the conversion does not go through</h2>
          <h3 className={H3}>The file is not a valid QBO</h3>
          <p className={P}>
            Usually the download was cut short, or the file is not OFX at all — a PDF statement
            renamed to .qbo is the classic case. A PDF cannot be converted here; download the
            Web Connect file from your bank instead. If the file genuinely is OFX and still
            fails, the{" "}
            <a href="/tools/qbo-checker" className="font-semibold text-pine-600 hover:underline dark:text-pine-400">QBO File Checker</a>{" "}
            will read it and name the problem.
          </p>
          <h3 className={H3}>The transaction list comes out empty</h3>
          <p className={P}>
            The file's statement section covers a period with no activity, or the download was
            a balance-only response rather than a transaction file. Check the period shown in
            the preview summary: if it is not the period you asked your bank for, re-download
            with the date range you actually need.
          </p>
          <h3 className={H3}>The structure inside the file is malformed</h3>
          <p className={P}>
            Some exporters write OFX with unclosed or mismatched tags. The data is usually all
            there — it is the wrapping that is broken. The{" "}
            <a href="/tools/ofx-to-qbo" className="font-semibold text-pine-600 hover:underline dark:text-pine-400">OFX to QBO fixer</a>{" "}
            rebuilds the file as clean OFX 1.02, after which it converts — and imports — the
            way it should have in the first place.
          </p>

          <h2 className={H2M}>The deeper check: warnings worth reading</h2>
          <p className={P}>
            Two warnings deserve a pause before you use the data anywhere that matters. A
            missing closing balance means the file cannot be tied back to the bank's target —
            the rows may be perfect, but you have no independent proof the set is complete. A
            repeated transaction ID means QuickBooks would have skipped a real transaction as
            a supposed duplicate had you imported the file directly; in the spreadsheet both
            rows appear, and the shared ID tells you exactly which transactions to question.
            For a full structural diagnosis before you rely on a file, the{" "}
            <a href="/tools/qbo-checker" className="font-semibold text-pine-600 hover:underline dark:text-pine-400">QBO File Checker</a>{" "}
            examines the same file without changing a byte of it.
          </p>

          <h2 className={H2M}>Doing this every month? Make it a system</h2>
          <p className={P}>
            If pulling QBO data into spreadsheets is part of your month-end — client reporting
            packs, a migration project, a year of analysis — the friction is rarely the
            conversion itself; it is finding last month's files. A free account keeps every
            conversion in one searchable history, so the spreadsheet you sent a client in
            March is two clicks away in June. The dashboard adds bulk conversion when a stack
            of statement PDFs lands at once, and client portals if other people send you
            their files — each client uploads through their own link. The downloads on this
            page stay fully free either way; the account is about the workflow around them.
          </p>
          <p className={P}>
            Need the reverse direction instead? The{" "}
            <a href="/tools/csv-to-qbo" className="font-semibold text-pine-600 hover:underline dark:text-pine-400">CSV to QBO converter</a>{" "}
            turns a bank CSV back into a QuickBooks-ready file, with the same attention to
            balances and transaction IDs.
          </p>
        </>
      }
    />
  );
}
