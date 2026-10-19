// Feature images are per-post files at /blog/{slug}.webp (unique AI-generated
// image per article since the 2026-10-19 image overhaul). This map is kept
// empty on purpose: posts.ts enrich() only overrides a post's featureImage
// when an entry exists here, and every post now ships its own image.
export const POST_IMAGES: Record<string, string> = {};
