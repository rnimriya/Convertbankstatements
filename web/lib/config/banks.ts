/**
 * Canonical Indian bank name list — single source of truth.
 * Used by process-statement, bulk-process, and the Python backend.
 *
 * Each entry: [keyword (lowercase), canonical display name]
 * Keywords are tested in order; first match wins.
 */
export const INDIAN_BANKS: [string, string][] = [
  // SBI must come before generic "bank of" entries
  ["state bank of india", "State Bank of India (SBI)"],
  ["state bank",          "State Bank of India (SBI)"],
  ["sbi",                 "State Bank of India (SBI)"],

  ["hdfc",                "HDFC Bank"],
  ["icici",               "ICICI Bank"],
  ["axis bank",           "Axis Bank"],
  ["axis",                "Axis Bank"],
  ["kotak mahindra",      "Kotak Mahindra Bank"],
  ["kotak",               "Kotak Mahindra Bank"],

  ["punjab national bank","Punjab National Bank"],
  ["pnb",                 "Punjab National Bank"],

  ["bank of baroda",      "Bank of Baroda"],
  ["bob",                 "Bank of Baroda"],

  ["canara bank",         "Canara Bank"],
  ["canara",              "Canara Bank"],

  ["union bank of india", "Union Bank of India"],
  ["union bank",          "Union Bank of India"],

  ["bank of india",       "Bank of India"],
  ["central bank of india","Central Bank of India"],
  ["central bank",        "Central Bank of India"],
  ["indian bank",         "Indian Bank"],
  ["uco bank",            "UCO Bank"],

  ["indusind",            "IndusInd Bank"],
  ["yes bank",            "Yes Bank"],
  ["idfc first",          "IDFC FIRST Bank"],
  ["idfc",                "IDFC FIRST Bank"],
  ["federal bank",        "Federal Bank"],
  ["south indian bank",   "South Indian Bank"],
  ["rbl bank",            "RBL Bank"],
  ["rbl",                 "RBL Bank"],
  ["bandhan",             "Bandhan Bank"],
  ["au small finance",    "AU Small Finance Bank"],
  ["au bank",             "AU Small Finance Bank"],
  ["paytm payments bank", "Paytm Payments Bank"],
  ["paytm",               "Paytm Payments Bank"],
  ["airtel payments bank","Airtel Payments Bank"],
  ["airtel",              "Airtel Payments Bank"],
];

/**
 * Infer the canonical bank name from a filename and/or PDF text snippet.
 * Returns null if no known bank is detected.
 */
export function inferBankName(filename: string, pdfTextSnippet = ""): string | null {
  const haystack = (filename + " " + pdfTextSnippet).toLowerCase();
  for (const [keyword, name] of INDIAN_BANKS) {
    if (haystack.includes(keyword)) return name;
  }
  return null;
}
