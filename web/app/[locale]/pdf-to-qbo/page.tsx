import type { Metadata } from "next";
import Link from "next/link";
import {
  FormatLanding,
  H2, H2M, H3, P, INLINE_LINK,
  type LandingFaq, type LandingStep,
} from "@/components/landing/FormatLanding";

const PAGE_URL = "https://www.convertstatement.online/pdf-to-qbo";

export const metadata: Metadata = {
  title: "PDF to QBO Converter — Bank Statement PDF to QuickBooks | Convert Statement",
  description:
    "Convert a PDF bank statement to a QuickBooks QBO (Web Connect) file with a verified balance chain and unique transaction IDs. Scanning and CSV export are free with no account; QBO download is on the Pro plan.",
  alternates: { canonical: PAGE_URL },
  openGraph: {
    title: "PDF to QBO Converter — Bank Statement PDF to QuickBooks",
    description:
      "Upload a statement PDF and download a QuickBooks-ready QBO file with a balance check and duplicate protection. Free to scan; QBO download on Pro.",
    url: PAGE_URL,
    type: "website",
  },
};

const STEPS: LandingStep[] = [
  {
    title: "Upload your statement PDF",
    body: "Drop the PDF in above, or add it from your device, Google Drive, Dropbox or a link. Password-protected statement PDFs are accepted — PDF only, up to 50 MB.",
  },
  {
    title: "Check the preview and balance check",
    body: "The converter reads the statement and shows the first transactions it found. A balance check runs on every conversion, so a missing or doubled row is flagged before the file reaches QuickBooks.",
  },
  {
    title: "Download the QBO and import it",
    body: "Download the QBO (Web Connect) file — QBO downloads are on the Pro plan — and import it into QuickBooks Online or Desktop through the bank-feed / Web Connect import.",
  },
];

const FAQS: LandingFaq[] = [
  {
    q: "How do I convert a PDF bank statement to QBO?",
    a: "Upload the statement PDF in the converter above and check the preview. The scan and the CSV export are free with no account; the QBO download is available on the Pro plan. Import the downloaded QBO through QuickBooks' bank-feed import, and QuickBooks matches it against your account.",
  },
  {
    q: "What is a QBO file?",
    a: "A QBO file is a Web Connect file — a structured text file in the OFX format that tells QuickBooks which bank account the transactions belong to, what the closing balance should be, and how to recognize each transaction if it ever sees it again. It also carries a bank ID (INTU.BID) that QuickBooks checks before accepting the file.",
  },
  {
    q: "Is the QBO download free?",
    a: "Scanning your statement and exporting it as CSV are free — your first 8 pages are free and no account is needed. QBO, QFX and OFX downloads are Pro plan features: Pro is $20/month for 500 pages, and Business ($75/month, 2,000 pages) includes them too.",
  },
  {
    q: "Will importing the same QBO file twice create duplicates?",
    a: "No. Every transaction in the converted file gets a unique transaction ID derived from its own date, payee and amount, so QuickBooks recognizes a re-imported transaction as already imported instead of posting it twice.",
  },
  {
    q: "Why does the converter check the balance chain?",
    a: "The converted QBO carries a verified balance chain: each running balance is checked against the previous balance plus the transaction. A break means the statement is missing a row or has a wrong amount — importing it would leave your QuickBooks reconciliation off by exactly that amount, so it is flagged before you import.",
  },
  {
    q: "Can I import the QBO into QuickBooks Desktop?",
    a: "Yes. In QuickBooks Desktop use File → Utilities → Import → Web Connect Files and pick the QBO file. If the bank account is already linked to online services, disconnect it first (the account shows a yellow online-linked icon) or import into a new account, otherwise Desktop may reject the file or post to the wrong place.",
  },
  {
    q: "My statement is a CSV, not a PDF. What should I use?",
    a: "Use the CSV to QBO converter instead — it takes a bank CSV export, lets you check the column mapping, and produces the same kind of QuickBooks-ready QBO file. This page is for starting from the PDF statement itself.",
  },
];

export default function PdfToQboPage() {
  return (
    <FormatLanding
      eyebrow="QuickBooks converter"
      title={<>PDF to <span className="text-[#2CA01C]">QBO</span> converter</>}
      subtitle="QuickBooks cannot read a statement PDF. Upload it here and download a QBO (Web Connect) file instead — with a verified balance chain and a unique ID on every transaction, so imports land cleanly and never duplicate. Free to scan; QBO download is on Pro."
      pageUrl={PAGE_URL}
      softwareDescription="Convert PDF bank statements to QuickBooks QBO (Web Connect) files with Convert Statement: verified balance chain and unique transaction IDs. Scanning and CSV export are free; QBO download is on the Pro plan."
      howToName="How to convert a PDF bank statement to QBO"
      steps={STEPS}
      faqs={FAQS}
      related={[
        { href: "/tools/csv-to-qbo", label: "CSV to QBO Converter", desc: "Already have a CSV? Map its columns and convert it to QBO instead of starting from the PDF." },
        { href: "/tools/ofx-to-qbo", label: "OFX to QBO Fixer", desc: "Have an OFX or QFX file QuickBooks refuses? Repair its bank ID into a valid QBO." },
        { href: "/quickbooks", label: "QuickBooks Hub", desc: "The full statement-to-QuickBooks route, plus all the free QuickBooks tools in one place." },
      ]}
    >
      <h2 className={H2}>What a QBO file is — and why QuickBooks wants one</h2>
      <p className={P}>
        QuickBooks does not import PDF bank statements. What it accepts through its bank-feed
        and Web Connect imports is a QBO file: a structured text file in the OFX format that
        states which bank account the transactions belong to, what the closing balance should
        be, and how to recognize each transaction if it ever sees it again. That structure is
        exactly what a PDF lacks — a PDF only says what the statement looks like. Converting
        the PDF to QBO first turns the picture into data QuickBooks can file, match and
        reconcile.
      </p>
      <p className={P}>
        QBO is Intuit&rsquo;s flavour of the OFX family, alongside QFX (the Quicken variant)
        and plain OFX (the generic original). A file in the wrong flavour is a common reason
        QuickBooks refuses an import: the QBO carries a bank ID (INTU.BID) that QuickBooks
        checks before accepting the file, and files from this converter write a valid one.
      </p>

      <h2 className={H2M}>Built-in checks, before the file reaches your books</h2>
      <h3 className={H3}>Verified balance chain</h3>
      <p className={P}>
        Every conversion runs a balance check: where the statement carries running balances,
        each one is verified against the previous balance plus the transaction, from the
        opening balance to the closing balance. A break means a row is missing or an amount is
        wrong — and importing anyway would leave reconciliation off by exactly that amount.
        The preview shows the check result before you download, so the fix happens here, not
        at month-end.
      </p>
      <h3 className={H3}>Unique transaction IDs — no duplicates on re-import</h3>
      <p className={P}>
        Every transaction in the QBO gets a unique transaction ID derived from its own date,
        payee and amount. QuickBooks deduplicates on that ID, so importing the same file — or
        an overlapping statement period — does not post a second copy of a transaction it has
        already seen.
      </p>

      <h2 className={H2M}>Importing the QBO into QuickBooks</h2>
      <p className={P}>
        <strong className="text-zinc-900">QuickBooks Online:</strong> upload the downloaded file
        from the Bank transactions page, choose the account it belongs to, then review,
        categorize and add the transactions from the For Review tab. Importing a file does not
        post anything to your books until you add each transaction.
      </p>
      <p className={P}>
        <strong className="text-zinc-900">QuickBooks Desktop:</strong> use{" "}
        <strong className="text-zinc-900">File → Utilities → Import → Web Connect Files</strong>{" "}
        and pick the QBO file, then review the downloaded transactions and add them to the
        register. One caution from experience: if the account is already connected to your
        bank&rsquo;s online services (its name shows a yellow online-linked icon), disconnect
        it before a Web Connect import, or import into a new account — otherwise Desktop can
        reject the file or post it to the wrong place.
      </p>

      <h2 className={H2M}>What is free, and what needs Pro</h2>
      <p className={P}>
        Scanning your statement in the converter above and exporting it as CSV or Excel are
        free — your first 8 pages are free and no account is needed. The QBO download itself
        is a Pro plan feature, the same gating as the other QuickBooks downloads on this site:
        Pro is $20/month for 500 statement pages and includes QBO, QFX and OFX downloads;
        Business ($75/month, 2,000 pages) includes them too. The pricing strip below shows all
        four plans, and the{" "}
        <Link href="/pricing" className={INLINE_LINK}>pricing page</Link>{" "}
        has the full comparison.
      </p>

      <h2 className={H2M}>Starting from something other than a PDF?</h2>
      <p className={P}>
        Already have a CSV export from your bank? Use the{" "}
        <Link href="/tools/csv-to-qbo" className={INLINE_LINK}>CSV to QBO converter</Link>{" "}
        — it maps your columns and produces the same kind of QBO file; do not re-create a PDF
        just to use this page. Have an OFX or QFX file that QuickBooks refuses? The{" "}
        <Link href="/tools/ofx-to-qbo" className={INLINE_LINK}>OFX to QBO fixer</Link>{" "}
        repairs the bank ID in place. And the{" "}
        <Link href="/quickbooks" className={INLINE_LINK}>QuickBooks hub</Link>{" "}
        collects the full statement-to-QuickBooks route and every free QuickBooks tool,
        including the duplicate finder and the import-error decoder.
      </p>
    </FormatLanding>
  );
}
