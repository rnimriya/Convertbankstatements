import type { Metadata } from "next";
import { ToolPageLayout, type ToolFaq } from "@/components/tools/ToolPageLayout";
import { FormatConverter } from "@/components/tools/FormatConverter";

const PAGE_URL = "https://www.convertstatement.online/tools/qfx-to-qbo";

export const metadata: Metadata = {
  title: "QFX to QBO Converter — Free | Convert Statement",
  description: "Move a Quicken QFX download into QuickBooks as a QBO Web Connect file — same OFX family, with the source file's bank identity kept. Fully free with no account. Files are processed in memory and never stored.",
  alternates: { canonical: PAGE_URL },
  openGraph: {
    title: "QFX to QBO Converter — Free",
    description: "Upload a QFX file and download it as QBO — dates, descriptions and amounts carried over exactly. Fully free, no account needed.",
    url: PAGE_URL,
    type: "website",
  },
};

const FAQS: ToolFaq[] = [
  {
    q: "How do I convert a QFX file to QBO?",
    a: "Upload the .qfx above and press Convert to QBO. You download a Web Connect file holding the same transactions, ready to import into QuickBooks. Fully free, no account.",
  },
  {
    q: "Why can QuickBooks not just open my QFX?",
    a: "QuickBooks imports its own Web Connect variant, QBO. The good news is the formats are one family — QFX is Quicken's OFX variant and QBO is OFX 1.02 underneath — so converting changes the wrapping, not your transactions.",
  },
  {
    q: "Does the QBO keep my bank identity?",
    a: "Yes — the account number, and the INTU.BID when the source file carries one, are kept from your QFX. The converter never invents a bank identity.",
  },
  {
    q: "Does the closing balance carry over?",
    a: "If the source QFX carries one, yes. If it does not, the QBO has none — a closing balance is never invented.",
  },
  {
    q: "Are amounts changed during conversion?",
    a: "No. Amounts are copied exactly, with no currency conversion.",
  },
  {
    q: "Is my data uploaded or stored?",
    a: "Your file is processed in memory to build the QBO and is not stored afterwards. We never sell or share your financial data, and the download is fully free with no account.",
  },
];

const HOWTO = [
  { title: "Get your QFX file", body: "Use the .qfx file you already have, or export a fresh one from the bank or app that produced it." },
  { title: "Upload it here", body: "Drop the QFX file into the converter above — one file, up to 10 MB, no account needed." },
  { title: "Convert to QBO", body: "Press Convert to QBO. The transactions are read and rebuilt in QBO format, with amounts copied exactly." },
  { title: "Download the QBO file", body: "Save the converted file — fully free — and open or import it wherever you need the QBO version." },
];

const H2 = "text-2xl font-extrabold text-zinc-900 dark:text-white";
const H2M = "text-2xl font-extrabold text-zinc-900 dark:text-white mt-12";
const H3 = "text-lg font-bold text-zinc-900 dark:text-white mt-8";
const P = "mt-3 text-zinc-600 dark:text-zinc-300 leading-relaxed";
const TH = "border border-[#E3EDE0] bg-[#EFF7ED] px-3 py-2 text-left font-semibold text-zinc-900";
const TD = "border border-[#E3EDE0] px-3 py-2 text-zinc-600 dark:text-zinc-300 align-top";

export default function QfxToQboPage() {
  return (
    <ToolPageLayout
      fullyFree
      eyebrow="Free Tool"
      title="QFX to QBO Converter"
      subtitle="Move a Quicken QFX download into QuickBooks as a QBO Web Connect file — same OFX family, with the source file's bank identity kept. Fully free with no account."
      tool={<FormatConverter tool="qfx-to-qbo" fromLabel="QFX" toLabel="QBO" accept=".qfx" outputExt="qbo" />}
      currentPath="/tools/qfx-to-qbo"
      faqs={FAQS}
      howToName="How to convert QFX to QBO"
      howToSteps={HOWTO}
      privacyLine="No account needed · Processed in memory, never stored"
      content={
        <>
          <h2 className={H2}>Why convert a QFX to QBO?</h2>
          <p className={P}>
            This is the classic mid-migration problem: your bank offers downloads in Quicken's format, or your history lives in QFX files from your Quicken years, but the books now live in QuickBooks — and QuickBooks imports QBO Web Connect files, not QFX. Re-downloading is often impossible for older periods, so the files you have must change format.
          </p>
          <p className={P}>
            Fortunately the two formats are close family. QFX is Quicken's variant of OFX, and a QBO is OFX 1.02 underneath — so the conversion is a change of envelope, not of data, and your transactions cross over intact.
          </p>
          <h2 className={H2M}>What the conversion does</h2>
          <p className={P}>
            Every transaction is carried over exactly — date, description and amount, with no currency conversion — and because the input is an OFX-family file, its bank identity is kept: the account number, and the INTU.BID when the source file carries one, so the QBO identifies the same bank and account the QFX did.
          </p>
          <p className={P}>
            If the source carries a closing balance, it is carried over; if it does not, the QBO has none — a balance is never invented. Before importing, you can run the result through the <a href="/tools/qbo-checker" className="font-semibold text-pine-600 hover:underline dark:text-pine-400">QBO File Checker</a> to verify its structure without changing a byte.
          </p>
          <h2 className={H2M}>Format notes and where the QBO goes next</h2>
          <p className={P}>
            Import the QBO through QuickBooks' normal Web Connect or bank-feed import, exactly like a file downloaded from the bank. If QuickBooks pushes back, the <a href="/tools/ofx-to-qbo" className="font-semibold text-pine-600 hover:underline dark:text-pine-400">OFX to QBO converter and fixer</a> rebuilds OFX-family files as clean OFX 1.02 and explains the common refusal messages.
          </p>
          <p className={P}>
            Other exits from QFX: the <a href="/tools/qfx-to-ofx" className="font-semibold text-pine-600 hover:underline dark:text-pine-400">QFX to OFX converter</a> for generic OFX readers, the <a href="/tools/qfx-to-csv" className="font-semibold text-pine-600 hover:underline dark:text-pine-400">QFX to CSV converter</a> for spreadsheets, and the <a href="/tools/qfx-to-pdf" className="font-semibold text-pine-600 hover:underline dark:text-pine-400">QFX to PDF converter</a> when you need a printable statement instead of data.
          </p>
        </>
      }
    />
  );
}
