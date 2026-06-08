import { MetadataRoute } from "next";

const BASE = "https://convertstatement.online";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      // Allow all crawlers including AI bots
      { userAgent: "*", allow: "/" },
      // Explicitly allow known AI crawlers
      { userAgent: "GPTBot", allow: "/" },
      { userAgent: "ChatGPT-User", allow: "/" },
      { userAgent: "Claude-Web", allow: "/" },
      { userAgent: "ClaudeBot", allow: "/" },
      { userAgent: "anthropic-ai", allow: "/" },
      { userAgent: "PerplexityBot", allow: "/" },
      { userAgent: "Perplexity-User", allow: "/" },
      { userAgent: "CCBot", allow: "/" },
      { userAgent: "cohere-ai", allow: "/" },
      { userAgent: "Google-Extended", allow: "/" },
      { userAgent: "Applebot", allow: "/" },
      // Block admin and API routes from all bots
      { userAgent: "*", disallow: ["/admin", "/api/", "/dashboard"] },
    ],
    sitemap: `${BASE}/sitemap.xml`,
    host: BASE,
  };
}
