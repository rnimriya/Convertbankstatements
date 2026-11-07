import { Link } from "@/i18n/navigation";
import { ArrowUpRight } from "lucide-react";
import { getBankBySlug, getTopBanksForSEO, type BankSEOInfo } from "@/lib/seo/banks";

// Internal-link boost (2026-11-08): bank landing pages were sitting in
// Google's "Discovered - currently not indexed" bucket with almost no
// internal links pointing at them (the homepage marquee is text-only).
// This grid gives every priority bank page a real link from the two
// strongest hub pages (home + /tools). The list is the top 50 supported
// banks plus every bank from the 2026-11-08 GSC recovery queue, deduped.
const QUEUE_SLUGS = [
  "hdfc-bank",
  "paytm-payments-bank",
  "td-bank-canada",
  "deutsche-bank",
  "natwest",
  "axis-bank",
  "bank-of-baroda",
  "barclays",
  "bbva",
  "canara-bank",
  "cibc",
  "commerzbank",
  "commonwealth-bank-cba",
  "ing-bank",
  "intesa-sanpaolo",
  "lloyds-bank",
  "national-australia-bank-nab",
  "nationwide",
  "punjab-national-bank",
  "rabobank",
  "royal-bank-of-canada-rbc",
  "royal-bank-of-scotland",
  "santander-uk",
  "scotiabank",
  "soci-t-g-n-rale",
  "standard-chartered",
  "u-s-bank",
  "unicredit",
  "union-bank-of-india",
  "westpac",
];

function bankList(): BankSEOInfo[] {
  const map = new Map<string, string>();
  for (const b of getTopBanksForSEO(50)) map.set(b.slug, b.name);
  for (const slug of QUEUE_SLUGS) {
    if (!map.has(slug)) {
      const name = getBankBySlug(slug);
      if (name) map.set(slug, name);
    }
  }
  return Array.from(map.entries())
    .map(([slug, name]) => ({ slug, name }))
    .sort((a, b) => a.name.localeCompare(b.name));
}

export default function BankLinks() {
  const banks = bankList();
  return (
    <div>
      <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight leading-[1.1] text-[#0B1F16]">
        Convert statements from <span className="text-[#2CA01C]">your bank.</span>
      </h2>
      <p className="text-[#5B665C] mt-4 leading-relaxed max-w-2xl">
        Every bank below has its own converter page with the exact steps for that bank&apos;s statement
        format — PDF to Excel, CSV, QBO, OFX or Google Sheets. Your first 8 pages are free.
      </p>
      <div className="flex flex-wrap gap-2.5 mt-8">
        {banks.map((b) => (
          <Link
            key={b.slug}
            href={`/banks/${b.slug}`}
            className="inline-flex items-center gap-1.5 rounded-full border border-[#CBE3C4] bg-white px-4 py-2 text-sm font-semibold text-[#0B1F16] transition-colors hover:border-[#2CA01C] hover:text-[#007A33]"
          >
            {b.name}
            <ArrowUpRight size={14} className="text-[#2CA01C]" />
          </Link>
        ))}
      </div>
    </div>
  );
}
