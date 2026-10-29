// Quality gates for the 2026-10-29 DEMO QB post (NotebookLM video trial).
// Usage: node data/gate-demo-2026-10-29.mjs [--apply]
// Validates only without --apply; with --apply appends the post to
// lib/blog/generated.ts and advances qbTopicIndex/totalPublished only.
import fs from "fs";
import path from "path";
import { execSync } from "child_process";
import { post } from "./demo-post-2026-10-29.mjs";

const APPLY = process.argv.includes("--apply");
const failures = [];
const fail = (gate, detail) => failures.push(`Gate ${gate}: ${detail}`);

const stripHtml = (h) => h.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
const words = (t) => t.split(/\s+/).filter(Boolean);

const seedSrc = fs.readFileSync("lib/blog/seed.ts", "utf8");
const genSrc = fs.readFileSync("lib/blog/generated.ts", "utf8");
const existingSlugs = new Set(
  [...seedSrc.matchAll(/slug:\s*"([^"]+)"/g), ...genSrc.matchAll(/slug:\s*"([^"]+)"/g)].map((m) => m[1])
);
const existingTitles = [
  ...seedSrc.matchAll(/title:\s*"([^"]+)"/g),
  ...genSrc.matchAll(/title:\s*"([^"]+)"/g),
].map((m) => m[1].toLowerCase());
const firstParaOf = (c) => {
  const m = c.match(/<p>([\s\S]*?)<\/p>/);
  return m ? stripHtml(m[1]).toLowerCase().replace(/\s+/g, " ").slice(0, 200) : "";
};
const existingFirstParas = [
  ...genSrc.matchAll(/content:\s*"((?:[^"\\]|\\.)*)"/g),
  ...seedSrc.matchAll(/content:\s*"((?:[^"\\]|\\.)*)"/g),
].map((m) => firstParaOf(m[1].replace(/\\n/g, "\n").replace(/\\"/g, '"')));
const blogSlugSet = existingSlugs;

// Gate 1: slug unique
if (existingSlugs.has(post.slug)) fail(1, `slug already exists: ${post.slug}`);

// Gate 2: title 40-70, excerpt 120-170 (assignment targets excerpt 150-160)
if (post.title.length < 40 || post.title.length > 70) fail(2, `title ${post.title.length} chars`);
if (post.excerpt.length < 120 || post.excerpt.length > 170) fail(2, `excerpt ${post.excerpt.length} chars`);
if (post.excerpt.length < 150 || post.excerpt.length > 160) fail(2, `excerpt ${post.excerpt.length} not in 150-160`);

// Gate 3: >=800 words, >=4 h2
const bodyText = stripHtml(post.content);
const wc = words(bodyText).length;
const h2s = [...post.content.matchAll(/<h2>([\s\S]*?)<\/h2>/g)].map((m) => stripHtml(m[1]));
if (wc < 800) fail(3, `only ${wc} words`);
if (h2s.length < 4) fail(3, `only ${h2s.length} h2 headings`);

// Gate 4: no placeholders
if (/lorem|TODO|\[insert\]|\bxxx\b|dummy/i.test(post.content + post.excerpt)) fail(4, "placeholder text found");

// Gate 5: US English only
const BRITISH = [
  "cheque", "favourite", "favourites", "behaviour", "behaviours", "organise", "organised", "organising",
  "realise", "realised", "realising", "colour", "colours", "centre", "centres", "travelling", "cancelled",
  "labour", "honour", "fibre", "metre", "litre", "defence", "licence", "practise", "analyse", "capitalise",
  "recognise", "apologise", "customise", "optimise", "utilise", "finalise", "normalise", "specialise",
  "grey", "programme", "cheques", "instalment", "manoeuvre", "neighbour",
];
const lowerBody = bodyText.toLowerCase();
for (const w of BRITISH) {
  if (new RegExp(`\\b${w}\\b`).test(lowerBody)) fail(5, `British spelling: ${w}`);
}

// Gate 6: keyword in title + first 100 words; QB extras: >=2 H2s + one FAQ question
const KW = "stripe quickbooks integration";
if (!post.title.toLowerCase().includes(KW)) fail(6, "keyword missing from title");
const first100 = words(bodyText).slice(0, 100).join(" ").toLowerCase();
if (!first100.includes(KW)) fail(6, "keyword missing from first 100 words");
const kwH2 = h2s.filter((h) => h.toLowerCase().includes(KW)).length;
if (kwH2 < 2) fail(6, `keyword in only ${kwH2} H2s`);
const faqQs = [...post.content.matchAll(/<h3>([\s\S]*?)<\/h3>/g)].map((m) => stripHtml(m[1]));
if (!faqQs.some((q) => q.toLowerCase().includes(KW))) fail(6, "keyword missing from FAQ questions");
if (!post.content.includes("<h2>Frequently asked questions</h2>")) fail(6, "FAQ h2 missing");

// Gate 7: internal links resolve
const hrefs = [...post.content.matchAll(/href="([^"]+)"/g)].map((m) => m[1]);
for (const h of hrefs) {
  if (h.startsWith("/blog/")) {
    if (!blogSlugSet.has(h.slice(6))) fail(7, `blog link does not resolve: ${h}`);
  } else if (h.startsWith("/tools/")) {
    if (!fs.existsSync(path.join("app/[locale]/tools", h.slice(7)))) fail(7, `tool link does not resolve: ${h}`);
  } else if (h === "/quickbooks") {
    if (!fs.existsSync("app/[locale]/quickbooks")) fail(7, "/quickbooks missing");
  } else if (h === "/pricing") {
    if (!fs.existsSync("app/[locale]/pricing")) fail(7, "/pricing missing");
  } else if (h.startsWith("/")) {
    fail(7, `unverified internal link: ${h}`);
  }
}
// linkTo requirement: keyword anchor to /tools/free-stripe-to-quickbooks
const toolAnchors = [...post.content.matchAll(/<a href="\/tools\/free-stripe-to-quickbooks">([\s\S]*?)<\/a>/g)].map((m) => stripHtml(m[1]).toLowerCase());
if (!toolAnchors.some((a) => a.includes(KW))) fail(7, "no keyword anchor text to linkTo page");
const otherLinks = hrefs.filter((h) => h !== "/tools/free-stripe-to-quickbooks");
if (new Set(otherLinks).size < 2) fail(7, "fewer than 2 other internal links");

// Gate 8: images exist, valid WebP, dims, size
const imgSrcs = [...post.content.matchAll(/<img src="([^"]+)"/g)].map((m) => m[1]);
const allImgs = [post.featureImage, ...imgSrcs];
if (imgSrcs.length < 2 || imgSrcs.length > 3) fail(8, `${imgSrcs.length} inline images`);
for (const src of allImgs) {
  const fp = path.join("public", src);
  if (!fs.existsSync(fp)) { fail(8, `missing image ${src}`); continue; }
  const buf = fs.readFileSync(fp);
  if (!(buf.slice(0, 4).toString() === "RIFF" && buf.slice(8, 12).toString() === "WEBP")) fail(8, `not WebP: ${src}`);
  if (buf.length >= 150 * 1024) fail(8, `image >=150KB: ${src} (${buf.length})`);
  const dims = execSync(`python3 -c "from PIL import Image; im=Image.open('${fp}'); print(im.size[0], im.size[1])"`).toString().trim().split(" ").map(Number);
  const isFeature = src === post.featureImage;
  if (isFeature && dims[0] < 1200) fail(8, `feature only ${dims[0]}px wide`);
  if (!isFeature && dims[0] < 1000) fail(8, `inline only ${dims[0]}px wide`);
}

// Gate 9: no duplicate title / first paragraph vs published posts
if (existingTitles.includes(post.title.toLowerCase())) fail(9, "duplicate title");
if (existingFirstParas.includes(firstParaOf(post.content))) fail(9, "duplicate first paragraph");

console.log(`Post: ${post.slug}`);
console.log(`Words: ${wc} | H2s: ${h2s.length} | Title: ${post.title.length} chars | Excerpt: ${post.excerpt.length} chars`);
console.log(`Links: ${hrefs.join(", ")}`);
console.log(`Images: ${allImgs.join(", ")}`);

if (failures.length) {
  console.log("GATE FAILURES:");
  for (const f of failures) console.log(" - " + f);
  process.exit(1);
}
console.log("ALL GATES 1-9 PASS (gate 10 = tsc, run separately)");

if (APPLY) {
  const q = (v) => JSON.stringify(v);
  const entry = [
    "  {",
    `    id: ${q(post.id)},`,
    `    slug: ${q(post.slug)},`,
    `    title: ${q(post.title)},`,
    `    excerpt: ${q(post.excerpt)},`,
    `    featureImage: ${q(post.featureImage)},`,
    `    author: ${q(post.author)},`,
    `    tags: ${q(post.tags)},`,
    `    published: ${post.published},`,
    `    createdAt: ${q(post.createdAt)},`,
    `    updatedAt: ${q(post.updatedAt)},`,
    `    content: ${q(post.content)},`,
    "  },",
  ].join("\n");
  if (!/\];\s*$/.test(genSrc)) { console.error("generated.ts does not end with ];"); process.exit(1); }
  const updated = genSrc.replace(/\];\s*$/, `${entry}\n];\n`);
  fs.writeFileSync("lib/blog/generated.ts", updated);
  const rot = JSON.parse(fs.readFileSync("data/blog-rotation.json", "utf8"));
  rot.qbTopicIndex += 1;
  rot.totalPublished += 1;
  fs.writeFileSync("data/blog-rotation.json", JSON.stringify(rot, null, 2) + "\n");
  console.log(`APPLIED. rotation: qbTopicIndex=${rot.qbTopicIndex} totalPublished=${rot.totalPublished} bankIndex=${rot.bankIndex} angleIndex=${rot.angleIndex} lastRun=${rot.lastRun}`);
}
