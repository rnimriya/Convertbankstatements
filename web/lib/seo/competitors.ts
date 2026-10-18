export interface Competitor {
  slug: string;
  name: string;
  url: string;
  tagline: string;
  freePages: string;
  paidStartsAt: string;
  outputFormats: string[];
  bankCoverage: string;
  speed: string;
  privacy: string;
  hasAPI: boolean;
  hasGoogleSheets: boolean;
  hasOFX: boolean;
  hasBulkProcessing: boolean;
  weaknesses: string[];
}

export const COMPETITORS: Competitor[] = [
  {
    slug: "nanonets",
    name: "Nanonets",
    url: "https://nanonets.com/bank-statement-converter/",
    tagline: "AI-powered document processing platform with bank statement conversion as one feature.",
    freePages: "Unknown (SPA, no public pricing on page)",
    paidStartsAt: "Custom / Enterprise pricing",
    outputFormats: ["Excel (XLS)"],
    bankCoverage: "1000s of banks (claimed)",
    speed: "Not specified",
    privacy: "Enterprise-grade (claims banking compliance)",
    hasAPI: true,
    hasGoogleSheets: false,
    hasOFX: false,
    hasBulkProcessing: true,
    weaknesses: [
      "No transparent public pricing — requires contacting sales",
      "Bank statement converter is a side feature of a broader AI document platform",
      "No OFX/QFX export for accounting software like Tally or QuickBooks",
      "No Google Sheets integration",
      "Heavy enterprise focus — not built for individual CPAs or small firms",
    ],
  },
  {
    slug: "bankstatementconverter",
    name: "Bank Statement Converter",
    url: "https://bankstatementconverter.com/",
    tagline: "The world's most trusted bank statement converter. Convert PDFs to Excel.",
    freePages: "1 page / 24 hours (anonymous), more with free registration",
    paidStartsAt: "Subscription (pricing behind login)",
    outputFormats: ["Excel (XLS)", "CSV"],
    bankCoverage: "1000s of banks worldwide (claimed)",
    speed: "Not specified",
    privacy: "Years of banking experience (claimed)",
    hasAPI: true,
    hasGoogleSheets: false,
    hasOFX: false,
    hasBulkProcessing: false,
    weaknesses: [
      "Only 1 free page per day without registration — very restrictive free tier",
      "No OFX/QFX export for Tally or QuickBooks",
      "No Google Sheets integration",
      "No bulk/batch processing on standard plans",
      "Basic UI — no dark mode, no modern design",
      "Run by a single developer (less enterprise trust)",
    ],
  },
  {
    slug: "bankstatementconverters-ai",
    name: "BankStatementConverters.ai",
    url: "https://bankstatementconverters.ai/",
    tagline: "AI-powered free bank statement converter. PDF to CSV/Excel/JSON.",
    freePages: "Limited free pages daily",
    paidStartsAt: "From $15/month",
    outputFormats: ["CSV", "Excel", "JSON"],
    bankCoverage: "10,000+ banks (claimed)",
    speed: "Lightning fast (claimed)",
    privacy: "Files processed and deleted immediately (claimed)",
    hasAPI: true,
    hasGoogleSheets: false,
    hasOFX: false,
    hasBulkProcessing: true,
    weaknesses: [
      "Founded in 2025 — very new with unproven track record",
      "No OFX/QFX export for Tally or QuickBooks",
      "No Google Sheets integration",
      "Pricing starts at $15/mo for 500 pages — more expensive than Convert Statement Pro ($20 for 500 pages with more features)",
      "No physical address or company registration visible",
      "Claims 10,000+ banks supported but no verifiable list",
    ],
  },
  {
    slug: "docuclipper",
    name: "DocuClipper",
    url: "https://www.docuclipper.com/",
    tagline: "Document automation for finance teams — bank statements, invoices and receipts to QuickBooks, Xero or Excel.",
    freePages: "14-day free trial (up to 120 pages processed, no credit card)",
    paidStartsAt: "From $29/month for 60 pages (monthly billing)",
    outputFormats: ["Excel (XLSX)", "CSV", "QBO", "IIF", "OFX", "QFX", "QIF"],
    bankCoverage: "Any bank format (claimed) — US, Canada, UK, Australia, South Africa",
    speed: "Not specified",
    privacy: "SOC 2 Type II certified; documents stored on their servers with user-controlled retention",
    hasAPI: true,
    hasGoogleSheets: false,
    hasOFX: true,
    hasBulkProcessing: true,
    weaknesses: [
      "Just 60 pages on the $29/month Starter plan — heavy statement volume gets expensive fast (640 pages costs $159/month monthly-billed)",
      "Documents are uploaded and stored on their servers (with retention controls) rather than processed in memory with zero storage",
      "Built for broad document automation (invoices, receipts, fraud analysis) — more product than a bookkeeper who only converts statements needs",
      "No Google Sheets export",
      "No permanent free tier — after the 14-day trial, everything is paid",
    ],
  },
  {
    slug: "properconvert",
    name: "ProperConvert (ProperSoft)",
    url: "https://www.properconvert.com/",
    tagline: "Desktop converter apps (PDF2QBO and siblings) that turn statement files into QBO, OFX, QFX and IIF for QuickBooks and Quicken.",
    freePages: "Free trial / demo versions of the desktop apps",
    paidStartsAt: "Paid desktop licenses and subscriptions (see vendor site)",
    outputFormats: ["QBO", "OFX", "QFX", "IIF", "CSV"],
    bankCoverage: "Works with files from any bank (manual file-based workflow)",
    speed: "Desktop-speed (runs on your own computer)",
    privacy: "Files stay on your desktop — nothing uploaded",
    hasAPI: false,
    hasGoogleSheets: false,
    hasOFX: true,
    hasBulkProcessing: true,
    weaknesses: [
      "Desktop software — install, license and update it on every machine; no web access from anywhere",
      "Separate apps for different conversions (PDF2QBO, CSV2QBO, PDF2OFX…) instead of one converter",
      "No cloud workflow for firms: no client upload portals, no shared team workspace",
      "No Google Sheets export",
      "Dated interface and a per-computer licensing model that predates modern SaaS",
    ],
  },
  {
    slug: "moneythumb",
    name: "MoneyThumb",
    url: "https://moneythumb.com/",
    tagline: "PDF-to-accounting converters (pdf2qbo, pdf2csv) plus a fraud-detection API for lenders, priced per conversion.",
    freePages: "Free trial available",
    paidStartsAt: "Consumption pricing — bundles of conversions, charged per monthly statement",
    outputFormats: ["QBO", "OFX", "QFX", "CSV", "IIF"],
    bankCoverage: "US-focused bank and credit card statements",
    speed: "Not specified",
    privacy: "Cloud processing; company also markets statement fraud detection to lenders",
    hasAPI: true,
    hasGoogleSheets: false,
    hasOFX: true,
    hasBulkProcessing: true,
    weaknesses: [
      "Per-conversion pricing is hard to predict for bookkeeping firms — a multi-month PDF counts as multiple conversions",
      "Product line is split across many single-purpose tools (pdf2qbo, pdf2csv, pdf2ofx…) rather than one converter",
      "Company focus has shifted toward lender fraud detection (Thumbprint) — converters are no longer the headline product",
      "No Google Sheets export",
      "No permanent free tier for ongoing small-volume use",
    ],
  },
];

export function getCompetitorBySlug(slug: string): Competitor | undefined {
  return COMPETITORS.find((c) => c.slug === slug);
}

export function getAllCompetitorSlugs(): string[] {
  return COMPETITORS.map((c) => c.slug);
}
