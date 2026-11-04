import type { ReactNode } from "react";
import { Link } from "@/i18n/navigation";
import { BUILD_NONCE } from "@/lib/csp-nonce";

/**
 * Long-form SEO guide rendered below the tool grid on /tools.
 * Copy source: goals/convertstatement-online-seo-and-traffic-growth/hidden_files/
 * tools-page-seo-content-2026-11-04.md (US English, US audience).
 * Keep FAQ answers here in sync with the visible cards — same strings feed the schema.
 */

const FAQS: { q: string; a: string }[] = [
  {
    q: "Are these QuickBooks tools really free?",
    a: "Most of them, yes. 34 of the 44 tools on this page are completely free — no account, no signup, no time limit — including every format converter in the OFX, QFX, QBO, QIF and IIF matrix and the bulk import, export and cleanup tools. The main PDF bank statement converter is free for the first 8 pages of every statement; paid plans ($5, $20 and $75 a month) exist for people converting large PDF volumes, such as a full year of client statements at tax time.",
  },
  {
    q: "Will my bank's PDF statement work?",
    a: "Very likely. The converter supports statements from the major US banks — Chase, Bank of America, Wells Fargo, Citibank, Capital One, U.S. Bank, Truist, TD Bank, PNC and many more, including regional banks and credit unions — and there are dedicated converter pages for the top 20 US banks. The practical test is free: the first 8 pages of your statement convert at no charge, so you can check the output against your exact statement before deciding anything.",
  },
  {
    q: "What is the difference between QBO, OFX and QFX files?",
    a: "They carry the same transaction data in three different wrappers. OFX is the open standard banks use to exchange transactions. QFX is Quicken's version of OFX, with a Quicken institution ID inside. QBO is QuickBooks' version — a Web Connect file carrying an Intuit institution ID (the INTU.BID). QuickBooks reads QBO; Quicken reads QFX; most other finance software reads OFX. When a program refuses your file, it is usually the wrapper it objects to, not your transactions — which is why the converters above exist.",
  },
  {
    q: "QuickBooks rejected my file. Which tool do I need?",
    a: "Start with the QBO File Checker to see what is actually wrong. If the error mentions the bank or an unknown financial institution, that is the INTU.BID problem, and the OFX to QBO + BID Fixer is built for it. If the message is cryptic, the QBO Import Error Decoder translates QuickBooks error messages into plain English. Fixing the file first is almost always faster than fighting the import wizard.",
  },
  {
    q: "Can I import a CSV file into QuickBooks Desktop?",
    a: "Not directly — QuickBooks Desktop has no native CSV import for bank transactions. Convert the CSV first: the CSV to QBO converter builds a Web Connect file Desktop imports through File, then Utilities, then Import, then Web Connect Files, or use the CSV to IIF converter for a direct Desktop import. QuickBooks Online users can upload a clean CSV through Banking and Upload from file — or skip the column mapping with a QBO file instead.",
  },
  {
    q: "Is my financial data stored anywhere?",
    a: "No. Files are processed in memory during your session and are never stored on our servers. The free tools do not even ask for an account. When you close the tab, nothing of your statement remains with us.",
  },
  {
    q: "Do the tools work with both QuickBooks Online and QuickBooks Desktop?",
    a: "Yes. QBO files produced here import into both QuickBooks Online and QuickBooks Desktop through the normal bank feeds and Web Connect flows. IIF tools are for QuickBooks Desktop, which is the only edition that uses IIF. The payout converters output QBO files, so they work with both editions as well.",
  },
  {
    q: "I have a full year of statements to convert. Where do I start?",
    a: "Convert one month first and import it, so you can verify the mapping and the balances before doing the other eleven. Then scale up: the Bulk Importer merges many CSV files into one import, the QBO File Merger combines QBO files from the same account, and the main converter's paid plans are priced for exactly this job — a year of statements is a normal January workload here, not an edge case.",
  },
];

function H2({ children }: { children: ReactNode }) {
  return (
    <h2 className="mb-4 font-display text-[26px] font-bold leading-snug text-[#0B1F16] sm:text-[30px]">
      {children}
    </h2>
  );
}

function H3({ children }: { children: ReactNode }) {
  return <h3 className="mb-3 mt-8 font-display text-[19px] font-bold text-[#0B1F16]">{children}</h3>;
}

function P({ children }: { children: ReactNode }) {
  return <p className="mb-4 text-[15.5px] leading-[1.75] text-[#43543F]">{children}</p>;
}

function A({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link href={href} className="font-semibold text-[#2CA01C] underline underline-offset-2">
      {children}
    </Link>
  );
}

const NEED_ROWS: { have: string; need: string; tool: ReactNode }[] = [
  {
    have: "PDF bank statement",
    need: "Excel or CSV to review",
    tool: <A href="/bank-statement-to-excel">Bank statement to Excel</A>,
  },
  {
    have: "PDF bank statement",
    need: "A file QuickBooks imports directly",
    tool: <A href="/pdf-to-qbo">PDF to QBO converter</A>,
  },
  {
    have: "Bank or credit card CSV",
    need: "QuickBooks (Online or Desktop)",
    tool: <A href="/tools/csv-to-qbo">CSV to QBO converter</A>,
  },
  {
    have: "Many CSV files",
    need: "One combined QuickBooks import",
    tool: <A href="/tools/bulk-import-quickbooks">Bulk Importer</A>,
  },
  {
    have: "CSV spreadsheet",
    need: "QuickBooks Desktop (IIF)",
    tool: <A href="/tools/csv-to-iif">CSV to IIF converter</A>,
  },
  {
    have: "OFX or QFX the bank gave you",
    need: "QuickBooks",
    tool: <A href="/tools/ofx-to-qbo">OFX to QBO + BID Fixer</A>,
  },
  {
    have: "Quicken QFX file",
    need: "QuickBooks",
    tool: <A href="/tools/qfx-to-qbo">QFX to QBO converter</A>,
  },
  {
    have: "Legacy QIF export",
    need: "QuickBooks or a spreadsheet",
    tool: (
      <>
        <A href="/tools/qif-to-qbo">QIF to QBO</A> / <A href="/tools/qif-to-csv">QIF to CSV</A>
      </>
    ),
  },
  {
    have: "QBO file",
    need: "Something you can read or edit",
    tool: <A href="/tools/qbo-to-csv">QBO to CSV converter</A>,
  },
  {
    have: "QuickBooks Desktop IIF export",
    need: "Excel or CSV",
    tool: <A href="/tools/iif-to-excel">IIF to Excel converter</A>,
  },
  {
    have: "Stripe, PayPal, Shopify, Square, Etsy or Amazon payouts",
    need: "QuickBooks, fees split out",
    tool: (
      <>
        <A href="/tools/free-stripe-to-quickbooks">Stripe to QuickBooks converter</A> and its payout family
      </>
    ),
  },
  {
    have: "A QBO file that will not import",
    need: "Find and fix the problem first",
    tool: <A href="/tools/qbo-checker">QBO File Checker</A>,
  },
  {
    have: "Duplicate transactions in a QBO file",
    need: "A clean file before import",
    tool: <A href="/tools/bulk-deleter-quickbooks">Bulk Deleter</A>,
  },
];

export default function ToolsGuideContent() {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQS.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  return (
    <div className="pb-24">
      <script
        nonce={BUILD_NONCE}
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      {/* ── Intro ─────────────────────────────────────────── */}
      <section className="mt-6 border-t border-[#E3EDE0] pt-14">
        <H2>One toolkit for every bank file problem — built for US bookkeepers, accountants and CPAs</H2>
        <P>
          Every month, the same problem lands on desks across the US: a client sends a Chase PDF, a
          Bank of America CSV with the columns in the wrong order, a Quicken QFX file from a bank that
          stopped supporting QuickBooks, or a QuickBooks Desktop IIF export that nobody can read. The
          books need those transactions inside QuickBooks — and QuickBooks will not take the file the
          bank handed over. This page is the toolkit built for exactly that moment. ConvertStatement
          brings together <strong>44 focused tools</strong> for bank statements and QuickBooks files: a
          full <A href="/">bank statement converter</A> for PDF statements, dedicated converters for
          every common format pair, payout converters for the platforms US businesses actually sell on,
          and a set of checkers and fixers for files that refuse to import.
        </P>
        <P>
          Here is the honest shape of the offer. <strong>34 of the 44 tools are completely free</strong>{" "}
          — no account, no trial clock, no converted-file watermark. The main PDF bank statement
          converter is free for the first <strong>8 pages</strong> of every statement, which is enough
          for a typical monthly statement from most US banks, so you can see exactly what the output
          looks like before paying anything. Every tool runs in your browser session: files are
          processed in memory and are never stored on our servers. And every tool does one job. There
          is no bloated &quot;suite&quot; to learn — you pick the file you have, pick the file you need,
          and the tool in the middle is the one you open.
        </P>
        <P>
          Who uses this page? Bookkeepers cleaning up a new client&apos;s books in January. CPAs pulling
          a full year of statements into QuickBooks during tax season. Small business owners whose bank
          feed broke and who now hold twelve months of PDFs. Accountants migrating a client from
          Quicken, or from QuickBooks Desktop to QuickBooks Online, one file at a time. If you work with
          US bank files at all, at least one of the 44 tools below was built for a file sitting on your
          computer right now.
        </P>
        <H3>Start with the statement itself</H3>
        <P>
          If your starting point is a PDF statement — the file your bank actually gives you — begin with
          the main converter. It turns PDF bank statements into Excel, CSV, OFX, QBO and Tally files, and
          it supports statements from the banks Americans use most, including Chase, Bank of America,
          Wells Fargo, Citibank, Capital One, U.S. Bank, Truist, TD Bank and PNC. Two routes get the
          most traffic. The <A href="/bank-statement-to-excel">bank statement to Excel converter</A> is
          for everyone who wants to review, sort and clean transactions in a spreadsheet first — still
          the most popular way to convert a bank statement to Excel before anything touches the books.
          The <A href="/bank-statement-to-csv">bank statement to CSV converter</A> is the direct route
          into accounting software: a clean CSV with dates, descriptions and amounts in the columns
          QuickBooks Online expects on upload. And when the destination is QuickBooks itself, the{" "}
          <A href="/pdf-to-qbo">PDF to QBO converter</A> builds a Web Connect file instead, skipping the
          column mapping entirely.
        </P>
        <H3>Per-bank converter pages</H3>
        <P>
          Every bank formats its statements a little differently, so the main converter is backed by
          dedicated pages for the top 20 US banks. The{" "}
          <A href="/banks/jpmorgan-chase">Chase statement converter</A>,{" "}
          <A href="/banks/bank-of-america">Bank of America statement converter</A> and{" "}
          <A href="/banks/wells-fargo">Wells Fargo statement converter</A> pages, for example, pair the
          same working converter with that bank&apos;s own statement-download steps and the formats it
          offers, so you are not following generic instructions written for a different bank&apos;s
          website. If your bank is one of the twenty, start on its page; if it is not, the main converter
          above still handles the statement — the bank list it supports runs well beyond the twenty with
          their own pages.
        </P>
      </section>

      {/* ── CSV & spreadsheet converters ──────────────────── */}
      <section className="mt-14">
        <H2>CSV and spreadsheet converters — the CSV to QBO problem, solved properly</H2>
        <P>
          More bookkeeping time is lost to CSV files than to any other format, because every US bank
          exports a slightly different one. Chase gives you one layout, Wells Fargo another, and a credit
          union&apos;s &quot;download transactions&quot; button produces a third. QuickBooks Online will
          accept a CSV upload — but only a clean one: dates in a single consistent format, debits and
          credits handled the way QuickBooks expects, no stray zeros, no totals rows hiding at the
          bottom. QuickBooks Desktop is stricter still: it has no native CSV bank import at all, so a
          CSV has to become a QBO or IIF file before Desktop will take it. That conversion step is where
          this family of tools lives.
        </P>
        <P>
          The <A href="/tools/csv-to-qbo">CSV to QBO converter</A> is the flagship. It reads any CSV or
          Excel file, maps the columns, and builds a valid .qbo Web Connect file that QuickBooks Online
          and QuickBooks Desktop import through the normal bank feeds center — no manual column mapping
          inside QuickBooks, and no retyping. If one CSV is not the whole story, the{" "}
          <A href="/tools/bulk-import-quickbooks">Bulk Importer for QuickBooks</A> merges many CSV files
          together, maps the columns once, and builds a single QBO or IIF import file — the tool you want
          for a year of monthly exports or a drawer of client files. Working the other direction, the{" "}
          <A href="/tools/qbo-to-csv">QBO to CSV converter</A> turns a QBO file back into a clean CSV or
          Excel sheet you can edit, audit or share with a client who does not use QuickBooks.
        </P>
        <P>
          Desktop users get their own routes. The <A href="/tools/csv-to-iif">CSV to IIF converter</A>{" "}
          builds IIF files for QuickBooks Desktop imports without the manual IIF formatting pain — IIF is
          a tab-delimited format with strict header rows, and one wrong column makes Desktop reject the
          whole file. And the converters below cover the rest of the CSV map: turn a spreadsheet into an
          OFX file with the <A href="/tools/csv-to-ofx">CSV to OFX converter</A>, build a Quicken-ready
          file with the <A href="/tools/csv-to-qfx">CSV to QFX converter</A>, or produce the legacy format
          older software still asks for with the <A href="/tools/csv-to-qif">CSV to QIF converter</A>.
          Whatever direction your CSV problem runs, there is a single-purpose tool for it above — which
          is the point of this page. Instead of one converter with forty settings, you get the exact pair
          you searched for.
        </P>
      </section>

      {/* ── Payout converters ─────────────────────────────── */}
      <section className="mt-14">
        <H2>Payout converters — Stripe, PayPal and marketplace money into QuickBooks</H2>
        <P>
          A bank statement shows money arriving. A payout file explains it. When Stripe sends a
          $1,240.18 payout, that number is really a bundle: gross sales, Stripe fees, refunds and
          sometimes sales tax, all netted into one deposit. Book it as a single deposit and the books are
          wrong in three places at once — revenue is understated, fees vanish, and the sales tax
          liability never appears. Fixing that by hand, payout by payout, is the kind of work that eats a
          bookkeeper&apos;s Friday afternoon. These converters exist to do the split properly, once, at
          import time.
        </P>
        <P>
          The <A href="/tools/free-stripe-to-quickbooks">Stripe to QuickBooks converter</A> turns Stripe
          payout files into QBO entries with the fees split out into their own lines, so the deposit in
          QuickBooks matches the deposit at the bank and the fee lands in the right expense account. The{" "}
          <A href="/tools/free-paypal-to-quickbooks">PayPal to QuickBooks converter</A> does the same job
          for PayPal payout files, which arrive in PayPal&apos;s own layout and need the same treatment.
          For marketplace and point-of-sale sellers, the pattern repeats: the{" "}
          <A href="/tools/shopify-to-quickbooks">Shopify to QuickBooks converter</A>,{" "}
          <A href="/tools/square-to-quickbooks">Square to QuickBooks converter</A>,{" "}
          <A href="/tools/etsy-to-quickbooks">Etsy to QuickBooks converter</A> and{" "}
          <A href="/tools/amazon-to-quickbooks">Amazon to QuickBooks converter</A> each take that
          platform&apos;s payout export and produce a QuickBooks-ready import with sales, fees and taxes
          in the right lines. Rounding out the family, the{" "}
          <A href="/tools/free-receipt-to-quickbooks">Receipt to QuickBooks tool</A> turns a photo of a
          receipt into a QuickBooks-ready expense entry, for the shoebox-of-receipts clients every US
          bookkeeper knows.
        </P>
        <P>
          The common thread matters more than any single platform: a payout is not a deposit, and tools
          that treat it as one quietly corrupt the books. These converters are built by people who
          reconcile — every output is shaped so the bank side and the books side can actually be matched
          at month-end, which is the whole reason the reconciliation exists.
        </P>
      </section>

      {/* ── File converters matrix ────────────────────────── */}
      <section className="mt-14">
        <H2>File converters — the OFX, QFX, QBO, QIF and IIF matrix</H2>
        <P>
          Underneath the brand names, almost every bank file in the US is one of five formats. OFX is the
          open standard banks use to exchange transactions. QFX is Quicken&apos;s version of OFX, carrying
          a Quicken institution ID. QBO is QuickBooks&apos; version — a Web Connect file with an Intuit
          institution ID (the INTU.BID) inside. QIF is Quicken&apos;s older text format, still produced
          by legacy software and old exports. IIF is Intuit&apos;s tab-delimited format for QuickBooks
          Desktop. The formats are cousins, not strangers — which means most &quot;my software won&apos;t
          accept this file&quot; problems are really a repackaging problem: the transactions are fine,
          the wrapper is wrong. This family of 19 converters does nothing but repackage, in every
          direction, for free.
        </P>
        <P>
          Going into QuickBooks: the <A href="/tools/ofx-to-qbo">OFX to QBO converter</A> fixes broken
          OFX and QFX files — including the famous INTU.BID error that makes QuickBooks reject a file
          that looks perfectly fine — and the <A href="/tools/qfx-to-qbo">QFX to QBO converter</A> turns
          a Quicken download into a file QuickBooks imports, the standard rescue when a bank drops
          QuickBooks support but keeps Quicken. Old data gets the same respect: the{" "}
          <A href="/tools/qif-to-qbo">QIF to QBO converter</A> brings legacy Quicken transactions into
          QuickBooks, and the <A href="/tools/qbo-to-iif">QBO to IIF converter</A> converts a Web Connect
          file into IIF for QuickBooks Desktop workflows.
        </P>
        <P>
          Coming out of the bank formats into something readable: read any OFX download as a spreadsheet
          with the <A href="/tools/ofx-to-csv">OFX to CSV converter</A>, repurpose a Quicken file as the{" "}
          <A href="/tools/qfx-to-csv">QFX to CSV converter</A> or straight into a workbook with the{" "}
          <A href="/tools/qfx-to-excel">QFX to Excel converter</A>, and rescue legacy data with the{" "}
          <A href="/tools/qif-to-csv">QIF to CSV converter</A> and{" "}
          <A href="/tools/qif-to-excel">QIF to Excel converter</A>. Cross-format moves are covered too —{" "}
          <A href="/tools/ofx-to-qfx">OFX to QFX</A>, <A href="/tools/qfx-to-ofx">QFX to OFX</A> and{" "}
          <A href="/tools/qfx-to-qif">QFX to QIF</A> — and when a human needs to read the file rather
          than a program, the <A href="/tools/ofx-to-pdf">OFX to PDF</A>,{" "}
          <A href="/tools/qbo-to-pdf">QBO to PDF</A>, <A href="/tools/qfx-to-pdf">QFX to PDF</A> and{" "}
          <A href="/tools/qif-to-pdf">QIF to PDF</A> converters produce a tidy, printable PDF statement
          from files that normally open as raw markup. Finally, the Desktop side of the matrix: open any
          QuickBooks Desktop export in a spreadsheet with the{" "}
          <A href="/tools/iif-to-excel">IIF to Excel converter</A> or the{" "}
          <A href="/tools/iif-to-csv">IIF to CSV converter</A>, and when the job is bigger than one file,
          the <A href="/tools/bulk-export-quickbooks">Bulk Exporter</A> combines up to ten QBO, OFX or
          QFX files into one clean CSV or Excel sheet. Nineteen converters, one rule: your transactions
          do not change — only the wrapper does.
        </P>
      </section>

      {/* ── Checkers, fixers & bulk suite ─────────────────── */}
      <section className="mt-14">
        <H2>Checkers, fixers and the bulk suite — clean the file before QuickBooks sees it</H2>
        <P>
          The cheapest place to fix a bad import is before the import. Once duplicate or broken
          transactions are inside QuickBooks, removing them is slow, manual work — and some of it cannot
          be undone at all. This family checks and repairs the file itself, while it is still just a
          file, and it is where cleanup-season work (January catch-up, year-end close, a new
          client&apos;s messy first import) gets done.
        </P>
        <P>
          Start with diagnosis. The <A href="/tools/qbo-checker">QBO File Checker</A> examines a QBO file
          for the problems that make QuickBooks reject or misread it, and the free{" "}
          <A href="/tools/free-qbo-cleanup-checker">QBO Cleanup Checker</A> scans for duplicates and
          general mess and reports what it finds — no signup, just the report. When QuickBooks has
          already said no, the <A href="/tools/qbo-import-errors">QBO Import Error Decoder</A> translates
          its error messages into plain English and tells you what to fix. Then come the repairs: edit
          dates, names and amounts inside a file — with find-and-replace for payees — in the{" "}
          <A href="/tools/qbo-file-editor">QBO File Editor</A>; remove duplicate or unwanted transactions
          from a QBO file before it is imported with the{" "}
          <A href="/tools/bulk-deleter-quickbooks">Bulk Deleter for QuickBooks</A> (to be clear about
          what it does: it cleans the file, so the bad transactions never reach QuickBooks in the first
          place — it does not reach into a live QuickBooks company); combine several QBO files from the
          same account into one with the <A href="/tools/qbo-merger">QBO File Merger</A>; or split an
          oversized file into chunks QuickBooks can handle with the{" "}
          <A href="/tools/qbo-splitter">QBO File Splitter</A>. Two specialists finish the set: the{" "}
          <A href="/tools/reconciliation-finder">Reconciliation Finder</A> helps track down why a
          reconciliation is off, and the{" "}
          <A href="/tools/invoice-import-checker">Invoice Import Checker</A> catches invoice-file errors
          before they fail inside QuickBooks.
        </P>
        <P>
          Tax season has its own pair. The <A href="/tools/1099-checker">1099 Vendor Checker</A> shows
          which vendors cross the IRS reporting threshold — in general, vendors you paid $600 or more
          during the year for services — so January&apos;s 1099-NEC filings start from a list instead of
          a panic. And the <A href="/tools/payroll-journal-generator">Payroll Journal Generator</A>{" "}
          builds a balanced payroll journal entry for QuickBooks, debits equaling credits, for the many
          US small businesses whose payroll provider and QuickBooks never quite talk to each other. Check
          first, fix second, import once: that order is the difference between a ten-minute cleanup and a
          ten-hour one.
        </P>
      </section>

      {/* ── How it works ──────────────────────────────────── */}
      <section className="mt-14">
        <H2>How every tool on this page works</H2>
        <P>
          One design decision runs through the whole page: one tool per job. A converter that tries to
          handle every format usually handles each of them awkwardly, with settings screens standing
          between you and the file you need. Here, the tool named for your exact pair — QFX to QBO, IIF
          to Excel, QBO to PDF — does that pair and nothing else, which is why most of them finish in the
          same three steps. It also means the toolkit connects: the output of one tool is the input of
          the next, so a real workflow (convert a payout, check the file, merge it with last
          month&apos;s, then import) stays on one site instead of across five browser tabs. The full
          QuickBooks collection also lives on its own hub page at{" "}
          <A href="/quickbooks">QuickBooks tools</A> if you want the family without the rest of the
          toolkit.
        </P>
        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          <div className="rounded-[20px] border border-[#E3EDE0] bg-white p-5">
            <span className="mb-3 flex h-9 w-9 items-center justify-center rounded-full bg-[#2CA01C] font-display text-[15px] font-bold text-white">
              1
            </span>
            <h3 className="mb-2 font-display text-[16px] font-bold text-[#0B1F16]">Drop in your file</h3>
            <p className="text-sm leading-relaxed text-[#5C6F5B]">
              Drag your PDF, CSV, QBO, OFX, QFX, QIF or IIF file into the tool, or pull it straight from
              Google Drive or Dropbox. Nothing to install, and the free tools need no account.
            </p>
          </div>
          <div className="rounded-[20px] border border-[#E3EDE0] bg-white p-5">
            <span className="mb-3 flex h-9 w-9 items-center justify-center rounded-full bg-[#2CA01C] font-display text-[15px] font-bold text-white">
              2
            </span>
            <h3 className="mb-2 font-display text-[16px] font-bold text-[#0B1F16]">
              Review what the tool found
            </h3>
            <p className="text-sm leading-relaxed text-[#5C6F5B]">
              Converters show you the transactions before anything is final — dates, descriptions,
              amounts — and checkers show you a report of what is wrong. Fix column mapping or deselect
              rows here, not after the import.
            </p>
          </div>
          <div className="rounded-[20px] border border-[#E3EDE0] bg-white p-5">
            <span className="mb-3 flex h-9 w-9 items-center justify-center rounded-full bg-[#2CA01C] font-display text-[15px] font-bold text-white">
              3
            </span>
            <h3 className="mb-2 font-display text-[16px] font-bold text-[#0B1F16]">Download and import</h3>
            <p className="text-sm leading-relaxed text-[#5C6F5B]">
              Download the finished file and import it into QuickBooks Online, QuickBooks Desktop, Quicken
              or your spreadsheet the normal way — Banking, then Upload from file. Your file was processed
              in memory and is not kept.
            </p>
          </div>
        </div>
      </section>

      {/* ── Privacy ───────────────────────────────────────── */}
      <section className="mt-14">
        <H2>Your clients&apos; financial data stays private</H2>
        <P>
          These are bank files — among the most sensitive documents a business has — so the rules here
          are simple and strict. Files are processed <strong>in memory</strong> during your session and
          are <strong>never stored</strong> on our servers. The free tools run without an account, which
          means most of the tools on this page work without us knowing who you are at all. We do not sell
          data, we do not train anything on your statements, and there is no statement history sitting in
          a database waiting to be breached. When you close the tab, the file is gone. For accountants
          handling dozens of client files, that design is deliberate: the safest data to protect is data
          a service never keeps.
        </P>
      </section>

      {/* ── Which tool do I need? ─────────────────────────── */}
      <section className="mt-14">
        <H2>Which tool do I need?</H2>
        <P>
          Find the file you have in the left column. The middle column is the job; the right column is
          the tool US bookkeepers reach for first.
        </P>
        <div className="overflow-x-auto rounded-[20px] border border-[#E3EDE0] bg-white">
          <table className="w-full min-w-[560px] text-left text-sm">
            <thead>
              <tr className="bg-[#EFF7ED]">
                <th className="px-4 py-3 text-[12px] font-bold uppercase tracking-wide text-[#5C6F5B]">
                  You have
                </th>
                <th className="px-4 py-3 text-[12px] font-bold uppercase tracking-wide text-[#5C6F5B]">
                  You need
                </th>
                <th className="px-4 py-3 text-[12px] font-bold uppercase tracking-wide text-[#5C6F5B]">
                  Start here
                </th>
              </tr>
            </thead>
            <tbody>
              {NEED_ROWS.map((row) => (
                <tr key={row.have + row.need} className="border-t border-[#E3EDE0]">
                  <td className="px-4 py-3 font-semibold text-[#0B1F16]">{row.have}</td>
                  <td className="px-4 py-3 text-[#43543F]">{row.need}</td>
                  <td className="px-4 py-3">{row.tool}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* ── FAQ ───────────────────────────────────────────── */}
      <section className="mt-20">
        <div className="mb-12 text-center">
          <span className="mb-3 inline-flex items-center gap-2 rounded-full bg-[#E3F2DF] px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-[0.12em] text-[#007A33]">
            <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#2CA01C]" />
            FAQ
          </span>
          <h2 className="font-display text-3xl font-bold text-[#0B1F16] sm:text-4xl">
            Frequently asked questions
          </h2>
        </div>
        <div className="grid gap-4 text-left sm:grid-cols-2 lg:grid-cols-3">
          {FAQS.map((f) => (
            <div key={f.q} className="rounded-[24px] border border-[#E3EDE0] bg-white p-6">
              <h3 className="text-[15px] font-bold leading-snug text-[#0B1F16]">{f.q}</h3>
              <p className="mt-2 text-sm leading-relaxed text-[#5B665C]">{f.a}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
