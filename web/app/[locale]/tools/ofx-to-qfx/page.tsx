import type { Metadata } from "next";
import { ToolPageLayout, type ToolFaq } from "@/components/tools/ToolPageLayout";
import { FormatConverter } from "@/components/tools/FormatConverter";

const PAGE_URL = "https://www.convertstatement.online/tools/ofx-to-qfx";

export const metadata: Metadata = {
  title: "OFX to QFX Converter — Free | Convert Statement",
  description: "Convert a bank OFX file into Quicken's QFX variant — same transactions, same structure, with the source file's bank identity carried over. Fully free with no account. Files are processed in memory and never stored.",
  alternates: { canonical: PAGE_URL },
  openGraph: {
    title: "OFX to QFX Converter — Free",
    description: "Upload a OFX file and download it as QFX — dates, descriptions and amounts carried over exactly. Fully free, no account needed.",
    url: PAGE_URL,
    type: "website",
  },
};

const FAQS: ToolFaq[] = [
  {
    q: "How do I convert an OFX file to QFX?",
    a: "Upload the .ofx above and press Convert to QFX. You get a Quicken-format file holding the same transactions, with the source file's bank identity carried over. Fully free, no account.",
  },
  {
    q: "What actually changes between OFX and QFX?",
    a: "The variant, not the data. QFX is Quicken's variant of OFX — identical structure plus an Intuit institution ID (INTU.BID) Quicken uses to tie the file to a bank. Transactions, amounts and dates are unchanged.",
  },
  {
    q: "Does the QFX keep my bank's INTU.BID?",
    a: "When your source OFX carries one, yes — OFX-family bank identity is kept from the source file. The converter never invents an institution ID your file does not have.",
  },
  {
    q: "Does the closing balance carry over?",
    a: "If the source OFX carries a closing balance, it is carried over. If it does not, the output has none — the converter never invents a balance.",
  },
  {
    q: "Are amounts changed during conversion?",
    a: "No. Amounts are copied exactly, with no currency conversion.",
  },
  {
    q: "Is my data uploaded or stored?",
    a: "Your file is processed in memory to build the QFX and is not stored afterwards. We never sell or share your financial data, and the download is fully free with no account.",
  },
];

const HOWTO = [
  { title: "Get your OFX file", body: "Use the .ofx file you already have, or export a fresh one from the bank or app that produced it." },
  { title: "Upload it here", body: "Drop the OFX file into the converter above — one file, up to 10 MB, no account needed." },
  { title: "Convert to QFX", body: "Press Convert to QFX. The transactions are read and rebuilt in QFX format, with amounts copied exactly." },
  { title: "Download the QFX file", body: "Save the converted file — fully free — and open or import it wherever you need the QFX version." },
];

const H2 = "text-2xl font-extrabold text-zinc-900 dark:text-white";
const H2M = "text-2xl font-extrabold text-zinc-900 dark:text-white mt-12";
const H3 = "text-lg font-bold text-zinc-900 dark:text-white mt-8";
const P = "mt-3 text-zinc-600 dark:text-zinc-300 leading-relaxed";
const TH = "border border-[#E3EDE0] bg-[#EFF7ED] px-3 py-2 text-left font-semibold text-zinc-900";
const TD = "border border-[#E3EDE0] px-3 py-2 text-zinc-600 dark:text-zinc-300 align-top";

export default function OfxToQfxPage() {
  return (
    <ToolPageLayout
      fullyFree
      eyebrow="Free Tool"
      title="OFX to QFX Converter"
      subtitle="Convert a bank OFX file into Quicken's QFX variant — same transactions, same structure, with the source file's bank identity carried over. Fully free with no account."
      tool={<FormatConverter tool="ofx-to-qfx" fromLabel="OFX" toLabel="QFX" accept=".ofx" outputExt="qfx" />}
      currentPath="/tools/ofx-to-qfx"
      faqs={FAQS}
      howToName="How to convert OFX to QFX"
      howToSteps={HOWTO}
      privacyLine="No account needed · Processed in memory, never stored"
      content={
        <>
          <h2 className={H2}>Why convert an OFX to QFX?</h2>
          <p className={P}>
            Your bank exports OFX; Quicken imports QFX. The two are nearly the same file — QFX is Quicken's variant of OFX, identical in structure plus an Intuit institution ID (INTU.BID) that Quicken uses to tie the file to a bank — but Quicken asks for its own variant by name, and a plain OFX download does not always satisfy it.
          </p>
          <p className={P}>
            This converter moves a bank OFX into the QFX form so the download your bank offers can go into the app you actually use, without touching a single transaction.
          </p>
          <h2 className={H2M}>What the conversion does</h2>
          <p className={P}>
            The transactions are carried over exactly — date, description and amount for each one, with no currency conversion. Because the input is an OFX-family file, its bank identity comes with it: the account number, and the INTU.BID when the source file carries one, are kept from your file rather than invented.
          </p>
          <p className={P}>
            The closing balance follows the same rule: if your OFX carries one, it is carried over; if it does not, the QFX has none. Nothing about the money itself changes — only the variant of the wrapping does.
          </p>
          <h2 className={H2M}>Format notes and where the QFX goes next</h2>
          <p className={P}>
            Think of OFX, QFX and QBO as three envelopes for the same letter. OFX is the generic standard banks export; QFX adds Quicken's institution tie; QBO is the Web Connect envelope QuickBooks imports, written in OFX 1.02. Converting between them is a wrapping change, never a data change.
          </p>
          <p className={P}>
            From QFX you can fan out further: the <a href="/tools/qfx-to-qbo" className="font-semibold text-pine-600 hover:underline dark:text-pine-400">QFX to QBO converter</a> continues the trip into QuickBooks, the <a href="/tools/qfx-to-csv" className="font-semibold text-pine-600 hover:underline dark:text-pine-400">QFX to CSV converter</a> lays the data out as a spreadsheet, and the <a href="/tools/ofx-to-csv" className="font-semibold text-pine-600 hover:underline dark:text-pine-400">OFX to CSV converter</a> does the same job for the file you started with.
          </p>
        </>
      }
    />
  );
}
