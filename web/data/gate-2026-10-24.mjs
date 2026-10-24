// Quality gates for 2026-10-24 daily blog run. Usage: node data/gate-2026-10-24.mjs [--apply]
// Without --apply: validates only. With --apply: appends passing posts to
// lib/blog/generated.ts and updates data/blog-rotation.json.
// Adapted from gate-2026-10-21.mjs: requires feature + inline-1 + inline-2
// (inline-3 only if referenced); bankIndex advances past actually-consumed
// raw SUPPORTED_BANKS entries (deduped by bank slug).
import fs from "fs";
import path from "path";
import { execSync } from "child_process";
import { posts } from "./posts-2026-10-24.mjs";

const ROOT = path.resolve("lib/blog");
const APPLY = process.argv.includes("--apply");
const failures = [];

const seedSrc = fs.readFileSync(path.join(ROOT, "seed.ts"), "utf8");
const genSrc = fs.readFileSync(path.join(ROOT, "generated.ts"), "utf8");
const existingSlugs = new Set(
  [...seedSrc.matchAll(/slug:\s*"([^"]+)"/g), ...genSrc.matchAll(/slug:\s*"([^"]+)"/g)].map((m) => m[1])
);
const existingTitles = [...genSrc.matchAll(/title:\s*"([^"]+)"/g)].map((m) => m[1].toLowerCase());
const existingFirstParas = [
  ...genSrc.matchAll(/content:\s*`<p>([\s\S]{0,400}?)/g),
].map((m) => m[1].replace(/<[^>]+>/g, "").toLowerCase().replace(/\s+/g, " ").slice(0, 200));

// bank slugs from config (name-based, same as generateBankSlug)
const banksSrc = fs.readFileSync("lib/config/banks.ts", "utf8");
const bankEntries = [...banksSrc.matchAll(/\["[^"]+",\s*"([^"]+)"\]/g)].map((m) => m[1]);
const bankSlugOf = (name) => name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");
const bankSlugSet = new Set(bankEntries.map(bankSlugOf));
// guide slugs
const clustersSrc = fs.readFileSync("lib/seo/clusters.ts", "utf8");
const guideSlugs = new Set([...clustersSrc.matchAll(/slug:\s*"([^"]+)"/g)].map((m) => m[1]));

const BRITISH = [
  "cheque", "favourite", "favourites", "behaviour", "behaviours", "organise", "organised", "organising",
  "realise", "realised", "realising", "colour", "colours", "centre", "centres", "travelling", "cancelled",
  "labour", "honour", "fibre", "metre", "litre", "defence", "licence", "practise", "analyse", "capitalise",
  "recognise", "apologise", "customise", "optimise", "utilise", "finalise", "normalise", "specialise",
  "grey", "programme", "cheques", "instalment", "manoeuvre", "neighbour",
];
const stripHtml = (h) => h.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
const words = (t) => t.split(/\s+/).filter(Boolean);

function fail(post, gate, detail) {
  failures.push({ post: post.slug, gate, detail });
}

// image dimensions via PIL
let imgInfo = {};
try {
  const files = posts.flatMap((p) => {
    const f = [`${p.slug}.webp`, `${p.slug}-inline-1.webp`, `${p.slug}-inline-2.webp`];
    if (p.content.includes(`${p.slug}-inline-3.webp`)) f.push(`${p.slug}-inline-3.webp`);
    return f;
  });
  const out = execSync(
    `python3 -c "
import json
from PIL import Image
info = {}
for f in ${JSON.stringify(files).replace(/"/g, "'")}:
    p = 'public/blog/' + f
    try:
        im = Image.open(p); im.load()
        info[f] = {'ok': True, 'format': im.format, 'w': im.width, 'h': im.height}
    except Exception as e:
        info[f] = {'ok': False, 'err': str(e)[:120]}
print(json.dumps(info))
"`,
    { encoding: "utf8" }
  );
  imgInfo = JSON.parse(out);
} catch (e) {
  for (const p of posts) fail(p, 8, "image check crashed: " + String(e).slice(0, 120));
}

const seenNewSlugs = new Set();
for (const post of posts) {
  const tag = `post ${post.slug}`;
  // Gate 1: unique slug
  if (existingSlugs.has(post.slug)) fail(post, 1, `${tag}: slug already exists`);
  if (seenNewSlugs.has(post.slug)) fail(post, 1, `${tag}: duplicate slug in batch`);
  seenNewSlugs.add(post.slug);

  // Gate 2: title 40-70, excerpt 120-170
  if (post.title.length < 40 || post.title.length > 70)
    fail(post, 2, `${tag}: title length ${post.title.length} (need 40-70)`);
  if (post.excerpt.length < 120 || post.excerpt.length > 170)
    fail(post, 2, `${tag}: excerpt length ${post.excerpt.length} (need 120-170)`);

  // Gate 3: >=800 words, >=4 h2, FAQ h2 present
  const text = stripHtml(post.content);
  const wc = words(text).length;
  const h2count = (post.content.match(/<h2>/g) || []).length;
  if (wc < 800) fail(post, 3, `${tag}: ${wc} words (need >=800)`);
  if (h2count < 4) fail(post, 3, `${tag}: ${h2count} h2 (need >=4)`);
  if (!/<h2>Frequently asked questions<\/h2>/.test(post.content))
    fail(post, 3, `${tag}: FAQ h2 missing`);
  // inline images referenced in content must be the figure format
  const figs = [...post.content.matchAll(/<figure><img src="\/blog\/([^"]+)" alt="([^"]+)" width="1200" height="800" loading="lazy" \/><figcaption>/g)];
  if (figs.length < 2) fail(post, 3, `${tag}: only ${figs.length} inline figures (need >=2)`);
  for (const [, , alt] of figs) {
    const aw = words(alt).length;
    if (aw < 10 || aw > 16) fail(post, 3, `${tag}: inline alt word count ${aw} (need 10-16): ${alt.slice(0, 60)}`);
  }

  // Gate 4: no placeholders
  if (/lorem|TODO|\[insert\]|xxx|dummy/i.test(post.content + post.title + post.excerpt))
    fail(post, 4, `${tag}: placeholder text found`);

  // Gate 5: US English
  const low = (post.content + " " + post.title).toLowerCase();
  const found = BRITISH.filter((w) => new RegExp(`\\b${w}\\b`).test(low));
  if (found.length) fail(post, 5, `${tag}: British spellings: ${found.join(", ")}`);

  // Gate 6: keyword in title + first 100 words
  const kw = post.keyword.toLowerCase();
  const first100 = words(text).slice(0, 100).join(" ").toLowerCase();
  if (!post.title.toLowerCase().includes(kw)) fail(post, 6, `${tag}: keyword not in title`);
  if (!first100.includes(kw)) fail(post, 6, `${tag}: keyword not in first 100 words`);

  // Gate 7: internal links resolve; >=3 internal links
  const links = [...post.content.matchAll(/href="(\/[^"]*)"/g)].map((m) => m[1]);
  const blogLinks = links.filter((l) => l.startsWith("/blog/")).map((l) => l.replace("/blog/", "").split(/[?#]/)[0]);
  const bankLinks = links.filter((l) => l.startsWith("/banks/")).map((l) => l.replace("/banks/", ""));
  const guideLinks = links.filter((l) => l.startsWith("/guides/")).map((l) => l.replace("/guides/", ""));
  const toolLinks = links.filter((l) => l.startsWith("/tools/"));
  const badBlog = blogLinks.filter((s) => !existingSlugs.has(s) && !seenNewSlugs.has(s));
  const badBank = bankLinks.filter((s) => !bankSlugSet.has(s));
  const badGuide = guideLinks.filter((s) => !guideSlugs.has(s));
  const badTool = toolLinks.filter((l) => {
    const seg = l.replace("/tools/", "").split(/[?#]/)[0];
    return !fs.existsSync(`app/[locale]/tools/${seg}/page.tsx`) && !fs.existsSync(`app/tools/${seg}/page.tsx`);
  });
  const hasQb = links.includes("/quickbooks") || links.some((l) => l.startsWith("/quickbooks/"));
  const totalInternal = blogLinks.length + bankLinks.length + guideLinks.length + toolLinks.length + (hasQb ? 1 : 0);
  if (totalInternal < 3) fail(post, 7, `${tag}: only ${totalInternal} internal links (need >=3)`);
  if (badBlog.length) fail(post, 7, `${tag}: broken blog links: ${badBlog.join(", ")}`);
  if (badBank.length) fail(post, 7, `${tag}: broken bank links: ${badBank.join(", ")}`);
  if (badGuide.length) fail(post, 7, `${tag}: broken guide links: ${badGuide.join(", ")}`);
  if (badTool.length) fail(post, 7, `${tag}: broken tool links: ${badTool.join(", ")}`);
  if (hasQb && !fs.existsSync("app/[locale]/quickbooks/page.tsx"))
    fail(post, 7, `${tag}: /quickbooks page missing`);

  // Gate 8: images exist, WebP, min widths
  const feat = imgInfo[`${post.slug}.webp`];
  if (!feat || !feat.ok) fail(post, 8, `${tag}: feature image missing/unreadable`);
  else {
    if (feat.format !== "WEBP") fail(post, 8, `${tag}: feature not WebP (${feat.format})`);
    if (feat.w < 1200) fail(post, 8, `${tag}: feature width ${feat.w} < 1200`);
  }
  for (let n = 1; n <= 3; n++) {
    const key = `${post.slug}-inline-${n}.webp`;
    const referenced = post.content.includes(key);
    const im = imgInfo[key];
    if (n <= 2 || referenced) {
      if (!im || !im.ok) fail(post, 8, `${tag}: ${key} missing/unreadable`);
      else {
        if (im.format !== "WEBP") fail(post, 8, `${tag}: ${key} not WebP (${im.format})`);
        if (im.w < 1000) fail(post, 8, `${tag}: ${key} width ${im.w} < 1000`);
      }
    }
  }

  // Gate 9: not duplicate of last 30 days
  if (existingTitles.includes(post.title.toLowerCase()))
    fail(post, 9, `${tag}: title already published`);
  const firstPara = text.toLowerCase().replace(/\s+/g, " ").slice(0, 200);
  if (existingFirstParas.includes(firstPara)) fail(post, 9, `${tag}: first paragraph duplicates a recent post`);
}

// Gate 8b: file sizes (warn only)
for (const [f, info] of Object.entries(imgInfo)) {
  if (info.ok) {
    const size = fs.statSync(`public/blog/${f}`).size;
    if (size > 150 * 1024) console.log(`WARN: ${f} is ${(size / 1024).toFixed(0)}KB (>150KB target)`);
  }
}

console.log(`\nValidated ${posts.length} posts, ${failures.length} gate failures.`);
for (const f of failures) console.log(`FAIL gate ${f.gate}: ${f.detail}`);

if (failures.length === 0 && APPLY) {
  const toTs = (p) => `  {
    id: ${JSON.stringify(p.id)},
    slug: ${JSON.stringify(p.slug)},
    title: ${JSON.stringify(p.title)},
    excerpt: ${JSON.stringify(p.excerpt)},
    featureImage: ${JSON.stringify(p.featureImage)},
    author: ${JSON.stringify(p.author)},
    tags: ${JSON.stringify(p.tags)},
    published: ${JSON.stringify(p.published)},
    createdAt: ${JSON.stringify(p.createdAt)},
    updatedAt: ${JSON.stringify(p.updatedAt)},
    content: ${JSON.stringify(p.content)},
  },`;
  const genPath = "lib/blog/generated.ts";
  let src = fs.readFileSync(genPath, "utf8");
  const marker = "\n];";
  const idx = src.lastIndexOf(marker);
  if (idx < 0) throw new Error("generated.ts closing not found");
  src = src.slice(0, idx) + "\n" + posts.map(toTs).join("\n") + marker + src.slice(idx + marker.length);
  fs.writeFileSync(genPath, src);
  console.log("Appended 5 posts to generated.ts");

  // Advance bankIndex past raw entries consumed (deduped by bank slug),
  // skipping entries whose bank+angle combo already exists (e.g. yes-bank).
  const rotPath = "data/blog-rotation.json";
  const rot = JSON.parse(fs.readFileSync(rotPath, "utf8"));
  const angle = rot.angles[rot.angleIndex];
  const publishedBankSlugs = posts
    .filter((p) => p.slug.endsWith(`-${angle}`))
    .map((p) => p.slug.slice(0, p.slug.length - angle.length - 1));
  let i = rot.bankIndex;
  const seen = new Set();
  let remaining = new Set(publishedBankSlugs);
  while (remaining.size > 0 && i < bankEntries.length + rot.bankIndex) {
    const s = bankSlugOf(bankEntries[i % bankEntries.length]);
    if (!seen.has(s)) {
      seen.add(s);
      remaining.delete(s);
    }
    i++;
  }
  // skip trailing raw entries that dedupe to an already-consumed bank
  while (seen.has(bankSlugOf(bankEntries[i % bankEntries.length]))) i++;
  rot.bankIndex = i % bankEntries.length;
  rot.angleIndex = (rot.angleIndex + 1) % rot.angles.length;
  const qbPublished = posts.some((p) => !p.slug.endsWith(`-${angle}`));
  if (qbPublished) rot.qbTopicIndex += 1;
  rot.lastRun = "2026-10-24";
  rot.totalPublished += posts.length;
  fs.writeFileSync(rotPath, JSON.stringify(rot, null, 2) + "\n");
  console.log("Updated blog-rotation.json:", JSON.stringify(rot));
}

process.exit(failures.length ? 1 : 0);
