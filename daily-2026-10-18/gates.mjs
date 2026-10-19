// Quality gates 1-9 for daily pipeline 2026-10-18. Gate 10 (tsc) runs separately.
import fs from "fs";
import path from "path";

const ROOT = "/home/hatch/workspace/convertstatement/web";
const STAGE = "/home/hatch/workspace/convertstatement/daily-2026-10-18";
const { POSTS } = await import(path.join(STAGE, "articles.mjs"));

const stripTags = (html) => html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
const words = (text) => stripTags(text).split(/\s+/).filter(Boolean);

// --- existing slugs (seed + generated) ---
const slugRe = /slug:\s*"([^"]+)"/g;
const existingSlugs = new Set();
for (const f of ["lib/blog/seed.ts", "lib/blog/generated.ts"]) {
  const src = fs.readFileSync(path.join(ROOT, f), "utf8");
  let m;
  while ((m = slugRe.exec(src))) existingSlugs.add(m[1]);
}

// --- bank slugs ---
function generateBankSlug(name) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");
}
const bankSrc = fs.readFileSync(path.join(ROOT, "lib/config/banks.ts"), "utf8");
const bankSlugSet = new Set();
const pairRe = /\[\s*"[^"]*"\s*,\s*"([^"]+)"\s*\]/g;
let bm;
while ((bm = pairRe.exec(bankSrc))) bankSlugSet.add(generateBankSlug(bm[1]));

// --- posts from last 30 days (titles + first paragraphs) for gate 9 ---
const recentSig = new Set();
{
  const gen = fs.readFileSync(path.join(ROOT, "lib/blog/generated.ts"), "utf8");
  const entryRe = /id:\s*"(gen-2026-10-(?:1[0-9]|0[89])-[0-9]+)"[\s\S]*?title:\s*"([^"]+)"[\s\S]*?content:\s*`([\s\S]*?)`,/g;
  let em;
  while ((em = entryRe.exec(gen))) {
    const firstP = stripTags(em[3]).split(/\s+/).slice(0, 40).join(" ").toLowerCase();
    recentSig.add(em[2].toLowerCase() + "||" + firstP);
  }
}

const KEYWORDS = {
  "gen-2026-10-18-01": "convert PNB bank statement PDF to Excel",
  "gen-2026-10-18-02": "convert Bank of Baroda statement PDF to Excel",
  "gen-2026-10-18-03": "convert Canara Bank statement PDF to Excel",
  "gen-2026-10-18-04": "convert Union Bank of India statement PDF to Excel",
  "gen-2026-10-18-05": "convert Bank of India statement PDF to Excel",
};

const BRITISH = /\b(cheque|cheques|favourite|favourites|behaviour|organise|organised|organising|realise|realised|realising|colour|colours|centre|centres|travelling|traveller|cancelled|labour|honour|fibre|manoeuvre|instalment|enrolment|capitalise|generalise|programme|defence|offence|licence|practise|analog|checkbook|grey)\b/i;
const PLACEHOLDER = /(lorem|TODO|\[insert\]|xxx|dummy)/i;

let failures = [];
const newSlugs = new Set();

for (const p of POSTS) {
  const errs = [];
  const wid = p.id;

  // Gate 1: slug unique
  if (existingSlugs.has(p.slug) || newSlugs.has(p.slug)) errs.push(`G1 slug not unique: ${p.slug}`);
  newSlugs.add(p.slug);
  if (!/^[a-z0-9-]+$/.test(p.slug)) errs.push(`G1 slug format invalid: ${p.slug}`);

  // Gate 2: title/excerpt lengths
  if (p.title.length < 40 || p.title.length > 70)
    errs.push(`G2 title length ${p.title.length} (need 40-70): ${p.title}`);
  if (p.excerpt.length < 120 || p.excerpt.length > 170)
    errs.push(`G2 excerpt length ${p.excerpt.length} (need 120-170)`);

  // Gate 3: words + h2 count
  const wc = words(p.content).length;
  const h2c = (p.content.match(/<h2>/g) || []).length;
  if (wc < 800) errs.push(`G3 word count ${wc} (need >=800)`);
  if (h2c < 4) errs.push(`G3 h2 count ${h2c} (need >=4)`);
  if (!/<h2>Frequently asked questions<\/h2>/.test(p.content)) errs.push("G3 missing FAQ h2");

  // Gate 4: placeholders
  if (PLACEHOLDER.test(p.content) || PLACEHOLDER.test(p.title) || PLACEHOLDER.test(p.excerpt))
    errs.push("G4 placeholder text found");

  // Gate 5: US English
  const bhit = p.content.match(BRITISH);
  if (bhit) errs.push(`G5 British spelling found: ${bhit[0]}`);

  // Gate 6: keyword in title + first 100 words
  const kw = KEYWORDS[p.id].toLowerCase();
  const first100 = stripTags(p.content).split(/\s+/).slice(0, 100).join(" ").toLowerCase();
  if (!p.title.toLowerCase().includes(kw.split(" ").slice(0, 4).join(" ")))
    errs.push(`G6 keyword not in title`);
  if (!first100.includes(kw)) errs.push(`G6 keyword not in first 100 words`);

  // Gate 7: internal links resolve
  const linkRe = /href="(\/[^"]*)"/g;
  let lm, linkErrs = [];
  while ((lm = linkRe.exec(p.content))) {
    const href = lm[1];
    if (href.startsWith("/banks/")) {
      const s = href.split("/banks/")[1].split(/[?#]/)[0];
      if (!bankSlugSet.has(s)) linkErrs.push(`/banks/${s}`);
    } else if (href.startsWith("/blog/")) {
      const s = href.split("/blog/")[1].split(/[?#]/)[0];
      // allow today's own new slugs (they will exist after publish)
      if (!existingSlugs.has(s) && !newSlugs.has(s)) linkErrs.push(`/blog/${s}`);
    } else if (!["/", "/pricing"].includes(href)) {
      linkErrs.push(href);
    }
  }
  // min 3 internal links: bank page + 2 others
  const internalCount = (p.content.match(/href="(\/banks\/|\/blog\/|\/pricing|\/")/g) || []).length;
  if (internalCount < 3) linkErrs.push(`only ${internalCount} internal links (need >=3)`);
  if (linkErrs.length) errs.push(`G7 bad links: ${linkErrs.join(", ")}`);

  // Gate 8: images exist (staging dir; copied to public/blog before append)
  const feat = path.join(STAGE, "images", path.basename(p.featureImage));
  const inl = [1, 2].map((n) =>
    path.join(STAGE, "images", `${p.slug}-inline-${n}.jpg`)
  );
  for (const f of [feat, ...inl]) {
    if (!fs.existsSync(f)) errs.push(`G8 missing image: ${path.basename(f)}`);
  }
  if (!/<a href="\/">/.test(p.content) && !/<a href="\/pricing">/.test(p.content))
    errs.push("G8b missing CTA link to / or /pricing");

  // Gate 9: not a duplicate of last 30 days
  const firstP = stripTags(p.content).split(/\s+/).slice(0, 40).join(" ").toLowerCase();
  if (recentSig.has(p.title.toLowerCase() + "||" + firstP))
    errs.push("G9 duplicate of a recent article");

  console.log(`${wid}: ${p.slug}`);
  console.log(`  words=${wc} h2=${h2c} title=${p.title.length} excerpt=${p.excerpt.length}`);
  if (errs.length) {
    console.log(`  FAILED: ${errs.join(" | ")}`);
    failures.push({ post: p, errs });
  } else {
    console.log(`  PASS`);
  }
}

// write review notes for failures
if (failures.length) {
  const dir = path.join(ROOT, "data/blog-review/2026-10-18");
  fs.mkdirSync(dir, { recursive: true });
  for (const { post, errs } of failures) {
    fs.writeFileSync(
      path.join(dir, `${post.slug}.md`),
      `# REVIEW — ${post.id}\n\nSlug: ${post.slug}\nTitle: ${post.title}\n\n## Failed gates\n\n${errs.map((e) => `- ${e}`).join("\n")}\n`
    );
  }
  fs.writeFileSync(
    path.join(dir, "REVIEW_NOTES.md"),
    `# Review notes — 2026-10-18\n\n${failures.map((f) => `- ${f.post.id} (${f.post.slug}): ${f.errs.join("; ")}`).join("\n")}\n`
  );
  console.log(`\n${failures.length} article(s) failed — saved to data/blog-review/2026-10-18/`);
} else {
  console.log("\nALL 5 ARTICLES PASS gates 1-9.");
}
process.exit(failures.length ? 1 : 0);
