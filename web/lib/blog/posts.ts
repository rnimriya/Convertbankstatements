import fs from "fs";
import path from "path";
import { BlogPost } from "./types";
import { SEED_POSTS } from "./seed";
import { POST_IMAGES } from "./images";
import { RELATED_MAP } from "./related";

const DATA_FILE =
  process.env.NODE_ENV === "production"
    ? "/tmp/blog-posts.json"
    : path.join(process.cwd(), "data", "blog-posts.json");

function readCustomPosts(): BlogPost[] {
  try {
    if (!fs.existsSync(DATA_FILE)) return [];
    const raw = fs.readFileSync(DATA_FILE, "utf-8");
    return JSON.parse(raw) as BlogPost[];
  } catch {
    return [];
  }
}

function writeCustomPosts(posts: BlogPost[]): void {
  const dir = path.dirname(DATA_FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(DATA_FILE, JSON.stringify(posts, null, 2), "utf-8");
}

function buildRelatedLine(slug: string): string {
  const related = RELATED_MAP[slug];
  if (!related || related.length === 0) return "";
  const links = related
    .slice(0, 3)
    .map((s) => {
      const title = ALL_TITLES[s];
      return title ? `<a href="/blog/${s}">${title}</a>` : null;
    })
    .filter(Boolean)
    .join(", ");
  if (!links) return "";
  return `<p class="mt-6 text-sm text-slate-500 dark:text-gray-400 border-t border-slate-100 dark:border-white/10 pt-4">Related reading: ${links}.</p>`;
}

function enrich(post: BlogPost): BlogPost {
  const image = POST_IMAGES[post.slug];
  const relatedLine = buildRelatedLine(post.slug);
  return {
    ...post,
    featureImage: image ?? post.featureImage,
    content: relatedLine ? post.content + relatedLine : post.content,
  };
}

// Module-level cache — avoids reading from disk on every request.
// TTL of 60 s so new posts published via the admin API become visible quickly.
let _cache: BlogPost[] | null = null;
let _cacheExpiresAt = 0;
const CACHE_TTL_MS = 60_000;

export function getAllPosts(): BlogPost[] {
  const now = Date.now();
  if (_cache && now < _cacheExpiresAt) return _cache;

  const custom = readCustomPosts();
  const sorted = [...SEED_POSTS, ...custom]
    .map(enrich)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  _cache = sorted;
  _cacheExpiresAt = now + CACHE_TTL_MS;
  return sorted;
}

/** Bust the in-memory cache — call after any write (create/update/delete). */
function invalidateCache() {
  _cache = null;
  _cacheExpiresAt = 0;
}

export function getPublishedPosts(
  page = 1,
  limit = 12
): { posts: BlogPost[]; total: number; pages: number } {
  const all = getAllPosts().filter((p) => p.published);
  const total = all.length;
  const pages = Math.ceil(total / limit);
  const posts = all.slice((page - 1) * limit, page * limit);
  return { posts, total, pages };
}

export function getPostBySlug(slug: string): BlogPost | null {
  const all = getAllPosts();
  return all.find((p) => p.slug === slug) ?? null;
}

export function createPost(
  data: Omit<BlogPost, "id" | "createdAt" | "updatedAt">
): BlogPost {
  const custom = readCustomPosts();
  const post: BlogPost = {
    ...data,
    id: `custom-${Date.now()}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  custom.push(post);
  writeCustomPosts(custom);
  invalidateCache();
  return post;
}

export function updatePost(id: string, data: Partial<BlogPost>): BlogPost | null {
  const custom = readCustomPosts();
  const idx = custom.findIndex((p) => p.id === id);
  if (idx === -1) return null;
  custom[idx] = { ...custom[idx], ...data, updatedAt: new Date().toISOString() };
  writeCustomPosts(custom);
  invalidateCache();
  return custom[idx];
}

export function deletePost(id: string): boolean {
  const custom = readCustomPosts();
  const filtered = custom.filter((p) => p.id !== id);
  if (filtered.length === custom.length) return false;
  writeCustomPosts(filtered);
  invalidateCache();
  return true;
}

const ALL_TITLES: Record<string, string> = {
  "how-to-read-indian-bank-statement": "How to Read an Indian Bank Statement",
  "sbi-bank-statement-download-guide": "How to Download Your SBI Bank Statement",
  "hdfc-bank-statement-download": "How to Download Your HDFC Bank Statement",
  "icici-bank-statement-download": "How to Download Your ICICI Bank Statement",
  "axis-bank-statement-download": "How to Download Your Axis Bank Statement",
  "kotak-bank-statement-download": "How to Download Your Kotak Bank Statement",
  "bank-statement-for-income-tax-return": "Bank Statement for Income Tax Return",
  "bank-statement-for-visa-application": "Bank Statement for Visa Applications",
  "bank-statement-for-home-loan": "Bank Statement for Home Loan",
  "convert-bank-statement-pdf-to-excel": "Convert Bank Statement PDF to Excel",
  "understanding-upi-transactions-bank-statement": "Understanding UPI Transactions in Your Bank Statement",
  "bank-statement-analysis-for-accountants": "Bank Statement Analysis for Accountants",
  "how-to-reconcile-bank-statement": "How to Reconcile Your Bank Statement",
  "understanding-bank-charges-on-statement": "Understanding Bank Charges on Your Statement",
  "punjab-national-bank-statement-download": "How to Download Your PNB Bank Statement",
  "canara-bank-statement-download": "How to Download Your Canara Bank Statement",
  "bank-of-baroda-statement-download": "How to Download Your Bank of Baroda Statement",
  "yes-bank-statement-download": "How to Download Your Yes Bank Statement",
  "idfc-first-bank-statement-download": "How to Download Your IDFC FIRST Bank Statement",
  "indusind-bank-statement-download": "How to Download Your IndusInd Bank Statement",
  "federal-bank-statement-download": "How to Download Your Federal Bank Statement",
  "bank-statement-for-personal-loan": "Bank Statement for Personal Loan Applications",
  "what-is-neft-rtgs-imps-in-bank-statement": "NEFT, RTGS, and IMPS Explained",
  "how-to-spot-fraudulent-transactions-bank-statement": "How to Spot Fraudulent Transactions",
  "how-to-track-expenses-using-bank-statement": "How to Track Expenses Using Your Bank Statement",
  "gst-and-bank-statements-what-businesses-need-to-know": "GST and Bank Statements for Businesses",
  "how-to-get-certified-bank-statement": "How to Get a Certified Bank Statement",
  "how-to-download-statement-for-all-accounts": "How to Download Statements for All Your Accounts",
  "account-aggregator-framework-india": "The Account Aggregator Framework India",
  "bank-statement-for-rent-agreement": "Bank Statement for Rent Agreements",
  "how-bank-statements-work-for-freelancers": "How Bank Statements Work for Freelancers",
  "bank-statement-password-removal-guide": "How to Remove the Password from a Bank Statement PDF",
  "indian-bank-statement-formats-differences": "Indian Bank Statement Formats Compared",
  "how-to-use-bank-statement-for-budgeting": "Using Your Bank Statement for Monthly Budgeting",
  "nri-bank-account-statement-india": "NRI Bank Account Statements: NRE vs NRO",
  "how-to-read-hdfc-bank-statement-pdf": "How to Read an HDFC Bank Statement",
  "how-to-read-sbi-bank-statement": "How to Read an SBI Bank Statement",
  "bank-statement-for-startup-funding": "Bank Statement for Startup Funding",
  "bank-statement-for-education-loan": "Bank Statement for Education Loan",
  "saving-bank-account-vs-current-account-statement": "Savings Account vs Current Account",
  "kotak-811-account-statement": "Kotak 811 Zero Balance Account Guide",
  "small-finance-bank-statement-guide": "Small Finance Bank Statements Guide",
  "how-to-read-icici-bank-statement": "How to Read an ICICI Bank Statement",
  "bank-statement-data-security-best-practices": "Bank Statement Data Security Best Practices",
  "how-to-use-bank-statement-for-gst-filing": "Using Bank Statements for GST Return Filing",
  "paytm-payments-bank-statement-guide": "Paytm Payments Bank Statement Guide",
  "understanding-emi-entries-bank-statement": "Understanding EMI Entries in Your Bank Statement",
  "how-to-use-bank-statement-api": "Using Bank Statement APIs",
  "how-to-prepare-bank-statement-for-ca": "How to Prepare Bank Statements for Your CA",
  "future-of-bank-statements-india": "The Future of Bank Statements in India",
};
