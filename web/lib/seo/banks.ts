import { SUPPORTED_BANKS } from "@/lib/config/banks";

export interface BankSEOInfo {
  slug: string;
  name: string;
}

export function generateBankSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

export function getTopBanksForSEO(limit: number = 50): BankSEOInfo[] {
  const uniqueBanks = new Map<string, string>(); // slug -> name

  for (const [, name] of SUPPORTED_BANKS) {
    if (uniqueBanks.size >= limit && !uniqueBanks.has(generateBankSlug(name))) {
        // If we hit the limit, don't add more, but keep iterating? No, we can just break if we hit the limit, 
        // wait, we only want to break when we have `limit` unique banks.
        continue;
    }
    const slug = generateBankSlug(name);
    if (!uniqueBanks.has(slug)) {
      uniqueBanks.set(slug, name);
    }
    if (uniqueBanks.size >= limit) break;
  }

  return Array.from(uniqueBanks.entries()).map(([slug, name]) => ({
    slug,
    name,
  }));
}

export function getBankBySlug(slug: string): string | null {
  for (const [, name] of SUPPORTED_BANKS) {
    if (generateBankSlug(name) === slug) {
      return name;
    }
  }
  return null;
}
