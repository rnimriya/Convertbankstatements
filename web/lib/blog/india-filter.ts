/**
 * India-site blog relevance filter (owner order 2026-11-27).
 *
 * On convertstatement.in (NEXT_PUBLIC_SITE_REGION=IN), blog posts that are
 * about a specific NON-Indian bank are hidden from the blog listing and
 * the sitemap. Generic posts (how-to, formats, tax, tools) and Indian-bank
 * posts stay. Post detail pages remain reachable by direct URL — hiding
 * those too is phase 2.
 *
 * Classification is name-based on slug + title + tags. A post that names
 * both an Indian and a non-Indian bank stays visible.
 */
import type { BlogPost } from "./types";

const INDIAN_BANK_WORDS = [
  "sbi", "state bank of india", "hdfc", "icici", "axis", "kotak",
  "punjab national", "pnb", "bank of baroda", "canara", "union bank",
  "idbi", "yes bank", "indusind", "federal bank", "rbl", "bandhan",
  "idfc", "au small", "indian bank", "bank of india", "central bank of india",
  "uco", "indian overseas", "punjab & sind", "punjab and sind",
  "jammu and kashmir", "karnataka bank", "karur", "tamilnad", "city union",
  "dhanlaxmi", "south indian bank", "csb", "equitas", "ujjivan",
  "esaf", "jana small", "paytm payments", "airtel payments",
  "india post", "nsdl", "bharat bank", "saraswat", "dcb bank",
];

const NON_INDIAN_BANK_WORDS = [
  "chase", "wells fargo", "bank of america", "citibank", "capital one",
  "u.s. bank", "us bank", "truist", "hsbc", "barclays", "santander",
  "bmo", "td bank", "td canada", "rbc", "royal bank of canada",
  "scotiabank", "cibc", "commbank", "anz", "nab", "westpac", "lloyds",
  "natwest", "halifax", "nationwide", "monzo", "starling", "revolut",
  "bnp", "societe generale", "rabobank", "abn amro", "deutsche",
  "commerzbank", "credit suisse", "ubs", "standard chartered", "dbs",
  "ocbc", "uob", "maybank", "cimb", "emirates nbd", "mashreq",
  "fifth third", "pnc", "regions bank", "citizens bank", "keybank",
  "huntington", "ally bank", "sofi", "chime", "navy federal", "usaa",
  "discover", "american express", "amex", "goldman", "morgan stanley",
  "schwab", "fidelity", "vanguard", "robinhood", "cadence bank",
  "bgl bnp",
];

function matches(text: string, words: string[]): boolean {
  return words.some((w) => text.includes(w));
}

/** True when the post may appear in India-site blog listings/sitemap. */
export function isIndiaRelevantPost(post: BlogPost): boolean {
  const text = `${post.slug} ${post.title} ${post.tags.join(" ")}`.toLowerCase();
  if (matches(text, INDIAN_BANK_WORDS)) return true;
  return !matches(text, NON_INDIAN_BANK_WORDS);
}
