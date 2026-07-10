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
];

export function getCompetitorBySlug(slug: string): Competitor | undefined {
  return COMPETITORS.find((c) => c.slug === slug);
}

export function getAllCompetitorSlugs(): string[] {
  return COMPETITORS.map((c) => c.slug);
}
