import { MetadataRoute } from "next";
import { getAllPosts } from "@/lib/blog/posts";

const BASE = "https://convertstatement.online";

const STATIC_ROUTES: MetadataRoute.Sitemap = [
  { url: BASE, lastModified: new Date(), changeFrequency: "weekly", priority: 1.0 },
  { url: `${BASE}/pricing`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.9 },
  { url: `${BASE}/blog`, lastModified: new Date(), changeFrequency: "daily", priority: 0.8 },
  { url: `${BASE}/signup`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.7 },
  { url: `${BASE}/login`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.5 },
  { url: `${BASE}/privacy`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.3 },
  { url: `${BASE}/terms`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.3 },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const posts = getAllPosts().filter((p) => p.published);
  const blogEntries: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${BASE}/blog/${post.slug}`,
    lastModified: new Date(post.updatedAt || post.createdAt),
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  return [...STATIC_ROUTES, ...blogEntries];
}
