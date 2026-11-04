import type { Metadata } from "next";
import { ToolPageLayout, type ToolFaq } from "@/components/tools/ToolPageLayout";
import { FormatConverter } from "@/components/tools/FormatConverter";

const PAGE_URL = "https://www.convertstatement.online/tools/qfx-to-ofx";

export const metadata: Metadata = {
  title: "QFX to OFX Converter — Free | Convert Statement",
  description: "Convert a Quicken QFX file back to generic OFX — the standard form other finance apps import — with the source file's bank identity kept. Fully free with no account. Files are processed in memory and never stored.",
  alternates: { canonical: PAGE_URL },
  openGraph: {
    title: "QFX to OFX Converter — Free",
    description: "Upload a QFX file and download it as OFX — dates, descriptions and amounts carried over exactly. Fully free, no account needed.",
    url: PAGE_URL,
    type: "website",
  },
};

const FAQS: ToolFaq[] = [
  {
    q: "How do I convert a QFX file to OFX?",
    a: "Upload the .qfx above and press Convert to OFX. You get the standard OFX form of the same file, transactions and bank identity intact. Fully free, no account.",
  },
  {
    q: "What is the difference between QFX and OFX?",
    a: "QFX is Quicken's variant of OFX: identical structure plus an Intuit institution ID (INTU.BID) that Quicken uses to tie the file to a bank. OFX is the generic standard other apps import.",
  },
  {
    q: "Does the OFX keep my bank identity?",
    a: "Yes — OFX-family outputs built from OFX-family inputs keep the source file's bank identity: the account number, and the INTU.BID when the source carries one. Nothing is invented.",
  },
  {
    q: "Does the closing balance carry over?",
    a: "If the source QFX carries a closing balance, it is carried over. If it does not, the output has none — a balance is never invented.",
  },
  {
    q: "Are amounts changed during conversion?",
    a: "No. Amounts are copied exactly, with no currency conversion.",
  },
  {
    q: "Is my data uploaded or stored?",
    a: "Your file is processed in memory to build the OFX and is not stored afterwards. We never sell or share your financial data, and the download is fully free with no account.",
  },
];

const HOWTO = [
  { title: "Get your QFX file", body: "Use the .qfx file you already have, or export a fresh one from the bank or app that produced it." },
  { title: "Upload it here", body: "Drop the QFX file into the converter above — one file, up to 10 MB, no account needed." },
  { title: "Convert to OFX", body: "Press Convert to OFX. The transactions are read and rebuilt in OFX format, with amounts copied exactly." },
  { title: "Download the OFX file", body: "Save the converted file — fully free — and open or import it wherever you need the OFX version." },
];

const H2 = "text-2xl font-extrabold text-zinc-900 dark:text-white";
const H2M = "text-2xl font-extrabold text-zinc-900 dark:text-white mt-12";
const H3 = "text-lg font-bold text-zinc-900 dark:text-white mt-8";
const P = "mt-3 text-zinc-600 dark:text-zinc-300 leading-relaxed";
const TH = "border border-[#E3EDE0] bg-[#EFF7ED] px-3 py-2 text-left font-semibold text-zinc-900";
const TD = "border border-[#E3EDE0] px-3 py-2 text-zinc-600 dark:text-zinc-300 align-top";

export default function QfxToOfxPage() {
  return (
    <ToolPageLayout
      fullyFree
      eyebrow="Free Tool"
      title="QFX to OFX Converter"
      subtitle="Convert a Quicken QFX file back to generic OFX — the standard form other finance apps import — with the source file's bank identity kept. Fully free with no account."
      tool={<FormatConverter tool="qfx-to-ofx" fromLabel="QFX" toLabel="OFX" accept=".qfx" outputExt="ofx" />}
      currentPath="/tools/qfx-to-ofx"
      faqs={FAQS}
      howToName="How to convert QFX to OFX"
      howToSteps={HOWTO}
      privacyLine="No account needed · Processed in memory, never stored"
      content={
        <>
          <h2 className={H2}>Why convert a QFX to OFX?</h2>
          <p className={P}>
            QFX is Quicken's variant of OFX, tuned for one app. Plenty of other finance tools import OFX — the generic Open Financial Exchange standard banks export — but do not accept the Quicken variant by name. A download that only exists as QFX is locked to Quicken until it is expressed in the generic form.
          </p>
          <p className={P}>
            This converter performs that small, precise translation: same transactions, same underlying structure, in the standard OFX wrapping the wider world reads.
          </p>
          <h2 className={H2M}>What the conversion does</h2>
          <p className={P}>
            The transaction list is carried over exactly — date, description and amount for every transaction, with no currency conversion. Because both sides are OFX-family formats, the source file's bank identity is kept: the account number, and the INTU.BID when the source carries one.
          </p>
          <p className={P}>
            The closing balance follows the family's standing rule: carried over when the source file has one, absent when it does not — never invented. Only the variant changes; the financial data does not.
          </p>
          <h2 className={H2M}>Format notes and where the OFX goes next</h2>
          <p className={P}>
            This is the reverse of the <a href="/tools/ofx-to-qfx" className="font-semibold text-pine-600 hover:underline dark:text-pine-400">OFX to QFX converter</a>, and together they make the Quicken variant a two-way door instead of a trap. From generic OFX, most destinations open up: the <a href="/tools/ofx-to-csv" className="font-semibold text-pine-600 hover:underline dark:text-pine-400">OFX to CSV converter</a> for spreadsheets, or the <a href="/tools/ofx-to-qbo" className="font-semibold text-pine-600 hover:underline dark:text-pine-400">OFX to QBO converter</a> for QuickBooks.
          </p>
          <p className={P}>
            Staying with Quicken data but heading for QuickBooks? The direct route is the <a href="/tools/qfx-to-qbo" className="font-semibold text-pine-600 hover:underline dark:text-pine-400">QFX to QBO converter</a> — no need to pass through generic OFX on the way.
          </p>
        </>
      }
    />
  );
}
