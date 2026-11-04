/**
 * Canonical tool-card data + per-page "Similar tools" picks.
 *
 * Card names, descriptions and tags mirror the /tools index page
 * (app/[locale]/tools/page.tsx); picture icons mirror the homepage
 * tools band (app/[locale]/page.tsx). Keep all three in step.
 *
 * Similarity rule: same /tools group first, ordered by format kinship
 * (same source format, then same target format). Payout converters list
 * the other payout converters first, then the CSV to QBO converter.
 * Checkers list other checkers/fixers first. Every page gets exactly
 * six cards and never lists itself.
 */

export interface ToolCardData {
  slug: string;
  name: string;
  desc: string;
  img: string;
  tag?: "free" | "pop";
}

export const TOOL_CARDS: Record<string, ToolCardData> = {
  "csv-to-qbo": { slug: "csv-to-qbo", name: "CSV to QBO Converter", desc: "Convert any CSV or Excel file into a QBO file QuickBooks imports cleanly.", img: "/tools/tool-csv.webp", tag: "pop" },
  "qbo-to-csv": { slug: "qbo-to-csv", name: "QBO to CSV Converter", desc: "Turn a QBO file back into a clean CSV or Excel sheet you can edit.", img: "/tools/tool-qbo-csv.webp", tag: "free" },
  "csv-to-iif": { slug: "csv-to-iif", name: "CSV to IIF Converter", desc: "Build IIF files for QuickBooks Desktop imports — no manual mapping pain.", img: "/tools/tool-csv-iif.webp", tag: "free" },
  "ofx-to-qbo": { slug: "ofx-to-qbo", name: "OFX to QBO + BID Fixer", desc: "Fix broken OFX/QFX files and the INTU.BID error so QuickBooks accepts them.", img: "/tools/tool-ofx-fix.webp", tag: "free" },
  "free-receipt-to-quickbooks": { slug: "free-receipt-to-quickbooks", name: "Receipt to QuickBooks", desc: "Snap a receipt and get a QuickBooks-ready expense entry from it.", img: "/tools/tool-receipt.webp" },
  "bulk-import-quickbooks": { slug: "bulk-import-quickbooks", name: "Bulk Importer for QuickBooks", desc: "Merge many CSV files, map the columns once, and build one QBO or IIF import file.", img: "/tools/tool-bulk-import.webp", tag: "free" },
  "bulk-export-quickbooks": { slug: "bulk-export-quickbooks", name: "Bulk Exporter for QuickBooks", desc: "Combine up to 10 QBO, OFX or QFX files into one clean CSV or Excel sheet.", img: "/tools/tool-bulk-export.webp", tag: "free" },
  "iif-to-excel": { slug: "iif-to-excel", name: "IIF to Excel Converter", desc: "Turn a QuickBooks Desktop IIF export into a readable Excel or CSV sheet.", img: "/tools/tool-iif-excel.webp", tag: "free" },
  "csv-to-ofx": { slug: "csv-to-ofx", name: "CSV to OFX Converter", desc: "Turn a spreadsheet of transactions into an OFX file — the format banks and finance apps exchange.", img: "/tools/tool-csv-to-ofx.webp", tag: "free" },
  "csv-to-qfx": { slug: "csv-to-qfx", name: "CSV to QFX Converter", desc: "Build a QFX file from CSV rows — Quicken's version of OFX, ready to import.", img: "/tools/tool-csv-to-qfx.webp", tag: "free" },
  "csv-to-qif": { slug: "csv-to-qif", name: "CSV to QIF Converter", desc: "Convert CSV transactions into a QIF file for older Quicken versions and legacy apps.", img: "/tools/tool-csv-to-qif.webp", tag: "free" },
  "iif-to-csv": { slug: "iif-to-csv", name: "IIF to CSV Converter", desc: "Turn a QuickBooks Desktop IIF file back into a plain CSV you can review in any spreadsheet.", img: "/tools/tool-iif-to-csv.webp", tag: "free" },
  "free-stripe-to-quickbooks": { slug: "free-stripe-to-quickbooks", name: "Stripe to QuickBooks", desc: "Convert Stripe payouts into QBO entries with fees split out properly.", img: "/tools/tool-stripe.webp" },
  "free-paypal-to-quickbooks": { slug: "free-paypal-to-quickbooks", name: "PayPal to QuickBooks", desc: "Turn PayPal payout files into clean QuickBooks imports.", img: "/tools/tool-paypal.webp" },
  "amazon-to-quickbooks": { slug: "amazon-to-quickbooks", name: "Amazon to QuickBooks", desc: "Amazon seller payouts converted into QuickBooks-ready files.", img: "/tools/tool-amazon.webp" },
  "shopify-to-quickbooks": { slug: "shopify-to-quickbooks", name: "Shopify to QuickBooks", desc: "Shopify payout reports mapped and converted for QuickBooks.", img: "/tools/tool-shopify.webp" },
  "square-to-quickbooks": { slug: "square-to-quickbooks", name: "Square to QuickBooks", desc: "Square payouts to QBO — sales, fees and taxes in the right lines.", img: "/tools/tool-square.webp", tag: "free" },
  "etsy-to-quickbooks": { slug: "etsy-to-quickbooks", name: "Etsy to QuickBooks", desc: "Etsy payment files converted into QuickBooks-ready imports.", img: "/tools/tool-etsy.webp", tag: "free" },
  "ofx-to-csv": { slug: "ofx-to-csv", name: "OFX to CSV Converter", desc: "Read a bank OFX file into a clean CSV — one row per transaction.", img: "/tools/tool-ofx-to-csv.webp", tag: "free" },
  "ofx-to-qfx": { slug: "ofx-to-qfx", name: "OFX to QFX Converter", desc: "Repackage an OFX download as QFX for Quicken, keeping the bank identity from the file.", img: "/tools/tool-ofx-to-qfx.webp", tag: "free" },
  "ofx-to-pdf": { slug: "ofx-to-pdf", name: "OFX to PDF Converter", desc: "Turn an OFX statement into a tidy PDF document you can print, file or share.", img: "/tools/tool-ofx-to-pdf.webp", tag: "free" },
  "qbo-to-iif": { slug: "qbo-to-iif", name: "QBO to IIF Converter", desc: "Convert a QuickBooks Web Connect (QBO) file into IIF for QuickBooks Desktop.", img: "/tools/tool-qbo-to-iif.webp", tag: "free" },
  "qbo-to-pdf": { slug: "qbo-to-pdf", name: "QBO to PDF Converter", desc: "Make a readable PDF statement from a QBO file — no QuickBooks needed to view it.", img: "/tools/tool-qbo-to-pdf.webp", tag: "free" },
  "qfx-to-csv": { slug: "qfx-to-csv", name: "QFX to CSV Converter", desc: "Open a Quicken QFX download as a spreadsheet — every transaction as a row.", img: "/tools/tool-qfx-to-csv.webp", tag: "free" },
  "qfx-to-excel": { slug: "qfx-to-excel", name: "QFX to Excel Converter", desc: "Convert a QFX file straight into an Excel workbook you can sort and filter.", img: "/tools/tool-qfx-to-excel.webp", tag: "free" },
  "qfx-to-ofx": { slug: "qfx-to-ofx", name: "QFX to OFX Converter", desc: "Convert Quicken's QFX back into plain OFX for other finance software.", img: "/tools/tool-qfx-to-ofx.webp", tag: "free" },
  "qfx-to-pdf": { slug: "qfx-to-pdf", name: "QFX to PDF Converter", desc: "Turn a QFX download into a clean PDF statement for your records.", img: "/tools/tool-qfx-to-pdf.webp", tag: "free" },
  "qfx-to-qbo": { slug: "qfx-to-qbo", name: "QFX to QBO Converter", desc: "Convert a Quicken QFX file into QBO so QuickBooks can import it.", img: "/tools/tool-qfx-to-qbo.webp", tag: "free" },
  "qfx-to-qif": { slug: "qfx-to-qif", name: "QFX to QIF Converter", desc: "Convert QFX transactions into legacy QIF for older apps that still read it.", img: "/tools/tool-qfx-to-qif.webp", tag: "free" },
  "qif-to-csv": { slug: "qif-to-csv", name: "QIF to CSV Converter", desc: "Rescue legacy QIF data into a modern CSV spreadsheet.", img: "/tools/tool-qif-to-csv.webp", tag: "free" },
  "qif-to-excel": { slug: "qif-to-excel", name: "QIF to Excel Converter", desc: "Convert a QIF file into an Excel workbook you can sort and filter.", img: "/tools/tool-qif-to-excel.webp", tag: "free" },
  "qif-to-pdf": { slug: "qif-to-pdf", name: "QIF to PDF Converter", desc: "Turn a QIF file into a readable PDF statement you can print or share.", img: "/tools/tool-qif-to-pdf.webp", tag: "free" },
  "qif-to-qbo": { slug: "qif-to-qbo", name: "QIF to QBO Converter", desc: "Bring old Quicken QIF transactions into QuickBooks as a QBO file.", img: "/tools/tool-qif-to-qbo.webp", tag: "free" },
  "free-qbo-cleanup-checker": { slug: "free-qbo-cleanup-checker", name: "QBO Cleanup Checker", desc: "Scan your QBO file for duplicates and mess — free report, no signup.", img: "/tools/tool-duplicates.webp" },
  "qbo-checker": { slug: "qbo-checker", name: "QBO File Checker", desc: "Verify a QBO file's balance chain and structure before you import it.", img: "/tools/tool-checker.webp" },
  "qbo-import-errors": { slug: "qbo-import-errors", name: "QBO Import Error Decoder", desc: "Paste a QuickBooks import error and learn what it means and how to fix it.", img: "/tools/tool-errors.webp" },
  "reconciliation-finder": { slug: "reconciliation-finder", name: "Reconciliation Finder", desc: "Compare a statement against QuickBooks to find missing or duplicate entries.", img: "/tools/tool-recon.webp" },
  "qbo-splitter": { slug: "qbo-splitter", name: "QBO File Splitter", desc: "Split a big QBO file into smaller chunks QuickBooks can handle.", img: "/tools/tool-splitter.webp", tag: "free" },
  "bulk-deleter-quickbooks": { slug: "bulk-deleter-quickbooks", name: "Bulk Deleter for QuickBooks", desc: "Remove duplicate or unwanted transactions from a QBO file before you import it.", img: "/tools/tool-bulk-delete.webp", tag: "free" },
  "qbo-file-editor": { slug: "qbo-file-editor", name: "QBO File Editor", desc: "Edit dates, names and amounts inside a QBO file, with find-and-replace for payees.", img: "/tools/tool-editor.webp", tag: "free" },
  "qbo-merger": { slug: "qbo-merger", name: "QBO File Merger", desc: "Combine several QBO files from the same account into one clean file.", img: "/tools/tool-merger.webp", tag: "free" },
  "invoice-import-checker": { slug: "invoice-import-checker", name: "Invoice Import Checker", desc: "Check invoice files for errors before they fail inside QuickBooks.", img: "/tools/tool-invoice.webp", tag: "free" },
  "1099-checker": { slug: "1099-checker", name: "1099 Vendor Checker", desc: "Check which vendors cross the 1099 threshold and need forms.", img: "/tools/tool-1099.webp", tag: "free" },
  "payroll-journal-generator": { slug: "payroll-journal-generator", name: "Payroll Journal Generator", desc: "Build a balanced payroll journal entry for QuickBooks in minutes.", img: "/tools/tool-payroll.webp", tag: "free" },
};

/** Six similar-tool slugs per page slug — same family first, never itself. */
export const SIMILAR_TOOLS: Record<string, string[]> = {
  // ── Converters ──────────────────────────────────────────────────
  "csv-to-qbo": ["csv-to-ofx", "csv-to-qfx", "csv-to-iif", "qbo-to-csv", "ofx-to-qbo", "qbo-checker"],
  "qbo-to-csv": ["qbo-to-iif", "qbo-to-pdf", "ofx-to-csv", "qfx-to-csv", "bulk-export-quickbooks", "csv-to-qbo"],
  "csv-to-iif": ["csv-to-qbo", "csv-to-ofx", "csv-to-qfx", "csv-to-qif", "iif-to-csv", "iif-to-excel"],
  "ofx-to-qbo": ["qfx-to-qbo", "csv-to-qbo", "qif-to-qbo", "ofx-to-csv", "ofx-to-qfx", "qbo-checker"],
  "free-receipt-to-quickbooks": ["invoice-import-checker", "csv-to-qbo", "bulk-import-quickbooks", "free-stripe-to-quickbooks", "free-paypal-to-quickbooks", "payroll-journal-generator"],
  "bulk-import-quickbooks": ["bulk-export-quickbooks", "bulk-deleter-quickbooks", "qbo-merger", "csv-to-qbo", "csv-to-iif", "invoice-import-checker"],
  "bulk-export-quickbooks": ["qbo-to-csv", "ofx-to-csv", "qfx-to-csv", "qfx-to-excel", "bulk-import-quickbooks", "qbo-merger"],
  "iif-to-excel": ["iif-to-csv", "csv-to-iif", "qbo-to-iif", "qfx-to-excel", "csv-to-qbo", "qbo-to-csv"],
  "csv-to-ofx": ["csv-to-qfx", "csv-to-qbo", "csv-to-qif", "csv-to-iif", "ofx-to-csv", "ofx-to-qbo"],
  "csv-to-qfx": ["csv-to-ofx", "csv-to-qbo", "csv-to-qif", "csv-to-iif", "qfx-to-qbo", "qfx-to-csv"],
  "csv-to-qif": ["csv-to-qbo", "csv-to-ofx", "csv-to-qfx", "csv-to-iif", "qif-to-qbo", "qif-to-csv"],
  "iif-to-csv": ["iif-to-excel", "csv-to-iif", "qbo-to-iif", "csv-to-qbo", "qbo-to-csv", "ofx-to-csv"],

  // ── Payout Converters — the other payouts first, then CSV to QBO ─
  "free-stripe-to-quickbooks": ["free-paypal-to-quickbooks", "amazon-to-quickbooks", "shopify-to-quickbooks", "square-to-quickbooks", "etsy-to-quickbooks", "csv-to-qbo"],
  "free-paypal-to-quickbooks": ["free-stripe-to-quickbooks", "amazon-to-quickbooks", "shopify-to-quickbooks", "square-to-quickbooks", "etsy-to-quickbooks", "csv-to-qbo"],
  "amazon-to-quickbooks": ["shopify-to-quickbooks", "square-to-quickbooks", "etsy-to-quickbooks", "free-stripe-to-quickbooks", "free-paypal-to-quickbooks", "csv-to-qbo"],
  "shopify-to-quickbooks": ["square-to-quickbooks", "amazon-to-quickbooks", "etsy-to-quickbooks", "free-stripe-to-quickbooks", "free-paypal-to-quickbooks", "csv-to-qbo"],
  "square-to-quickbooks": ["shopify-to-quickbooks", "amazon-to-quickbooks", "etsy-to-quickbooks", "free-stripe-to-quickbooks", "free-paypal-to-quickbooks", "csv-to-qbo"],
  "etsy-to-quickbooks": ["shopify-to-quickbooks", "square-to-quickbooks", "amazon-to-quickbooks", "free-stripe-to-quickbooks", "free-paypal-to-quickbooks", "csv-to-qbo"],

  // ── File Converters — same source format first, then same target ─
  "ofx-to-csv": ["ofx-to-qfx", "ofx-to-pdf", "ofx-to-qbo", "qbo-to-csv", "qfx-to-csv", "bulk-export-quickbooks"],
  "ofx-to-qfx": ["ofx-to-csv", "ofx-to-pdf", "qfx-to-ofx", "qfx-to-qbo", "qfx-to-csv", "csv-to-qfx"],
  "ofx-to-pdf": ["ofx-to-csv", "ofx-to-qfx", "qbo-to-pdf", "qfx-to-pdf", "qif-to-pdf", "ofx-to-qbo"],
  "qbo-to-iif": ["qbo-to-csv", "qbo-to-pdf", "csv-to-iif", "iif-to-csv", "iif-to-excel", "csv-to-qbo"],
  "qbo-to-pdf": ["qbo-to-csv", "qbo-to-iif", "ofx-to-pdf", "qfx-to-pdf", "qif-to-pdf", "qbo-checker"],
  "qfx-to-csv": ["qfx-to-excel", "qfx-to-ofx", "qfx-to-pdf", "qfx-to-qbo", "qfx-to-qif", "ofx-to-csv"],
  "qfx-to-excel": ["qfx-to-csv", "qfx-to-ofx", "qfx-to-pdf", "qfx-to-qbo", "qfx-to-qif", "iif-to-excel"],
  "qfx-to-ofx": ["qfx-to-csv", "qfx-to-excel", "qfx-to-qbo", "qfx-to-pdf", "qfx-to-qif", "ofx-to-qfx"],
  "qfx-to-pdf": ["qfx-to-csv", "qfx-to-excel", "qfx-to-ofx", "qfx-to-qbo", "qbo-to-pdf", "ofx-to-pdf"],
  "qfx-to-qbo": ["qfx-to-ofx", "qfx-to-csv", "qfx-to-qif", "csv-to-qbo", "ofx-to-qbo", "qif-to-qbo"],
  "qfx-to-qif": ["qfx-to-csv", "qfx-to-ofx", "qfx-to-qbo", "qif-to-csv", "qif-to-qbo", "csv-to-qif"],
  "qif-to-csv": ["qif-to-excel", "qif-to-pdf", "qif-to-qbo", "csv-to-qif", "ofx-to-csv", "qbo-to-csv"],
  "qif-to-excel": ["qif-to-csv", "qif-to-pdf", "qif-to-qbo", "csv-to-qif", "iif-to-excel", "qfx-to-excel"],
  "qif-to-pdf": ["qif-to-csv", "qif-to-excel", "qif-to-qbo", "ofx-to-pdf", "qbo-to-pdf", "qfx-to-pdf"],
  "qif-to-qbo": ["qif-to-csv", "qif-to-excel", "qif-to-pdf", "csv-to-qbo", "qbo-to-csv", "ofx-to-qbo"],

  // ── Checkers & Utilities — checkers/fixers first ────────────────
  "free-qbo-cleanup-checker": ["qbo-checker", "bulk-deleter-quickbooks", "qbo-import-errors", "reconciliation-finder", "qbo-file-editor", "qbo-merger"],
  "qbo-checker": ["free-qbo-cleanup-checker", "qbo-import-errors", "qbo-file-editor", "bulk-deleter-quickbooks", "reconciliation-finder", "ofx-to-qbo"],
  "qbo-import-errors": ["qbo-checker", "ofx-to-qbo", "free-qbo-cleanup-checker", "invoice-import-checker", "csv-to-qbo", "qbo-file-editor"],
  "reconciliation-finder": ["qbo-checker", "free-qbo-cleanup-checker", "bulk-export-quickbooks", "qbo-to-csv", "bulk-deleter-quickbooks", "qbo-import-errors"],
  "qbo-splitter": ["qbo-merger", "qbo-file-editor", "bulk-deleter-quickbooks", "qbo-checker", "qbo-to-csv", "bulk-export-quickbooks"],
  "bulk-deleter-quickbooks": ["free-qbo-cleanup-checker", "qbo-file-editor", "qbo-merger", "qbo-splitter", "bulk-import-quickbooks", "bulk-export-quickbooks"],
  "qbo-file-editor": ["qbo-merger", "qbo-splitter", "bulk-deleter-quickbooks", "qbo-checker", "free-qbo-cleanup-checker", "qbo-to-csv"],
  "qbo-merger": ["qbo-splitter", "qbo-file-editor", "bulk-import-quickbooks", "bulk-export-quickbooks", "bulk-deleter-quickbooks", "qbo-checker"],
  "invoice-import-checker": ["qbo-import-errors", "1099-checker", "free-receipt-to-quickbooks", "csv-to-qbo", "payroll-journal-generator", "qbo-checker"],
  "1099-checker": ["payroll-journal-generator", "invoice-import-checker", "qbo-import-errors", "qbo-checker", "free-qbo-cleanup-checker", "reconciliation-finder"],
  "payroll-journal-generator": ["1099-checker", "invoice-import-checker", "csv-to-qbo", "bulk-import-quickbooks", "qbo-checker", "reconciliation-finder"],
};

/** One honest subline per family — names the formats the page works with. */
export const SIMILAR_SUBLINES: Record<string, string> = {
  "csv-to-qbo": "More converters and checkers that work with CSV and QBO files.",
  "csv-to-ofx": "More converters that work with CSV and OFX files.",
  "csv-to-qfx": "More converters that work with CSV and QFX files.",
  "csv-to-qif": "More converters that work with CSV and QIF files.",
  "csv-to-iif": "More converters that work with CSV and IIF files.",
  "qbo-to-csv": "More converters that work with QBO and spreadsheet files.",
  "qbo-to-iif": "More converters that work with QBO and QuickBooks Desktop files.",
  "qbo-to-pdf": "More ways to view and convert QBO and statement files.",
  "ofx-to-qbo": "More converters and fixers that work with OFX and QBO files.",
  "ofx-to-csv": "More converters that work with OFX and bank files.",
  "ofx-to-qfx": "More converters that work with OFX and QFX files.",
  "ofx-to-pdf": "More ways to read and convert OFX statement files.",
  "qfx-to-csv": "More converters that work with QFX and spreadsheet files.",
  "qfx-to-excel": "More converters that work with QFX and spreadsheet files.",
  "qfx-to-ofx": "More converters that work with QFX and OFX files.",
  "qfx-to-pdf": "More ways to read and convert QFX statement files.",
  "qfx-to-qbo": "More converters that work with QFX and QBO files.",
  "qfx-to-qif": "More converters that work with QFX and QIF files.",
  "qif-to-qbo": "More converters that work with QIF and QuickBooks files.",
  "qif-to-csv": "More converters that work with QIF and spreadsheet files.",
  "qif-to-excel": "More converters that work with QIF and spreadsheet files.",
  "qif-to-pdf": "More ways to read and convert QIF files.",
  "iif-to-excel": "More converters that work with IIF and QuickBooks Desktop files.",
  "iif-to-csv": "More converters that work with IIF and spreadsheet files.",
  "bulk-import-quickbooks": "More bulk and single-file tools for QuickBooks imports.",
  "bulk-export-quickbooks": "More bulk and single-file tools for QuickBooks files.",
  "bulk-deleter-quickbooks": "More tools to clean up and fix QBO files before importing.",
  "free-receipt-to-quickbooks": "More ways to get receipts, invoices and payouts into QuickBooks.",
  "free-stripe-to-quickbooks": "More payout converters for QuickBooks — fees and taxes handled.",
  "free-paypal-to-quickbooks": "More payout converters for QuickBooks — fees and taxes handled.",
  "amazon-to-quickbooks": "More payout converters for QuickBooks — fees and taxes handled.",
  "shopify-to-quickbooks": "More payout converters for QuickBooks — fees and taxes handled.",
  "square-to-quickbooks": "More payout converters for QuickBooks — fees and taxes handled.",
  "etsy-to-quickbooks": "More payout converters for QuickBooks — fees and taxes handled.",
  "free-qbo-cleanup-checker": "More checkers and fixers for QBO files before you import.",
  "qbo-checker": "More checkers and fixers for QBO files before you import.",
  "qbo-import-errors": "More checkers and fixers for QBO files before you import.",
  "reconciliation-finder": "More checkers and finders for matching QuickBooks to your statements.",
  "qbo-splitter": "More utilities for editing and reshaping QBO files.",
  "qbo-file-editor": "More utilities for editing and reshaping QBO files.",
  "qbo-merger": "More utilities for editing and reshaping QBO files.",
  "invoice-import-checker": "More checkers for files headed into QuickBooks.",
  "1099-checker": "More checkers and generators for QuickBooks paperwork.",
  "payroll-journal-generator": "More checkers and generators for QuickBooks paperwork.",
};

const FALLBACK_SUBLINE = "More converters, checkers and fixers for QuickBooks files.";
const FALLBACK_PICKS = [
  "csv-to-qbo",
  "qbo-to-csv",
  "csv-to-iif",
  "ofx-to-qbo",
  "qbo-checker",
  "bulk-import-quickbooks",
];

/**
 * Resolve the six similar-tool cards + subline for a tool page.
 * `currentPath` is the page's own path, e.g. "/tools/csv-to-qbo".
 */
export function getSimilarTools(currentPath: string): {
  subline: string;
  tools: ToolCardData[];
} {
  const slug = currentPath.replace(/^\/tools\//, "");
  const picks = (SIMILAR_TOOLS[slug] ?? FALLBACK_PICKS).filter(
    (s) => s !== slug && TOOL_CARDS[s],
  );
  // Top up from the fallback list if a family ever yields fewer than six.
  for (const s of FALLBACK_PICKS) {
    if (picks.length >= 6) break;
    if (s !== slug && !picks.includes(s)) picks.push(s);
  }
  return {
    subline: SIMILAR_SUBLINES[slug] ?? FALLBACK_SUBLINE,
    tools: picks.slice(0, 6).map((s) => TOOL_CARDS[s]),
  };
}
