import { MetadataRoute } from "next";
import { getAllPosts } from "@/lib/blog/posts";
import { locales } from "@/i18n/routing";
import { getTopBanksForSEO } from "@/lib/seo/banks";
import { getAllCompetitorSlugs } from "@/lib/seo/competitors";

const BASE = "https://convertstatement.online";

interface RouteConfig {
  path: string;
  changeFrequency: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
  priority: number;
}

const STATIC_CONFIGS: RouteConfig[] = [
  { path: "/", changeFrequency: "weekly", priority: 1.0 },
  { path: "/pricing", changeFrequency: "monthly", priority: 0.9 },
  { path: "/blog", changeFrequency: "daily", priority: 0.8 },
  { path: "/signup", changeFrequency: "yearly", priority: 0.7 },
  { path: "/login", changeFrequency: "yearly", priority: 0.5 },
  { path: "/privacy", changeFrequency: "yearly", priority: 0.3 },
  { path: "/terms", changeFrequency: "yearly", priority: 0.3 },
  { path: "/contact", changeFrequency: "monthly", priority: 0.6 },
];

const getUrl = (path: string, locale?: string) => {
  if (!locale || locale === "en") {
    return path === "/" ? BASE : `${BASE}${path}`;
  }
  return path === "/" ? `${BASE}/${locale}` : `${BASE}/${locale}${path}`;
};

const buildAlternates = (path: string) => {
  const languages: Record<string, string> = {};
  for (const locale of locales) {
    if (locale !== "en") {
      languages[locale] = getUrl(path, locale);
    }
  }
  return { languages };
};

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  // 1. Static pages (with alternate language links)
  const staticEntries: MetadataRoute.Sitemap = STATIC_CONFIGS.map((cfg) => ({
    url: getUrl(cfg.path),
    lastModified: now,
    changeFrequency: cfg.changeFrequency,
    priority: cfg.priority,
    alternates: buildAlternates(cfg.path),
  }));

  // 2. Blog posts (with alternate language links)
  const posts = getAllPosts().filter((p) => p.published);
  const blogEntries: MetadataRoute.Sitemap = posts.map((post) => {
    const blogPath = `/blog/${post.slug}`;
    return {
      url: getUrl(blogPath),
      lastModified: new Date(post.updatedAt || post.createdAt),
      changeFrequency: "monthly",
      priority: 0.7,
      alternates: buildAlternates(blogPath),
    };
  });

  // 3. Bank SEO Pages (Programmatic)
  const banks = getTopBanksForSEO(50);
  const bankEntries: MetadataRoute.Sitemap = banks.map((bank) => {
    const bankPath = `/banks/${bank.slug}`;
    return {
      url: getUrl(bankPath),
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.7,
      alternates: buildAlternates(bankPath),
    };
  });

  // 4. Competitor Comparison Pages (Programmatic)
  const competitorSlugs = getAllCompetitorSlugs();
  const compareEntries: MetadataRoute.Sitemap = competitorSlugs.map((slug) => {
    const comparePath = `/compare/${slug}`;
    return {
      url: getUrl(comparePath),
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
      alternates: buildAlternates(comparePath),
    };
  });

  return [...staticEntries, ...blogEntries, ...bankEntries, ...compareEntries];
}
