// 10 quality gates for the 2026-10-16 daily blog run. Usage: node gates-2026-10-16.js
const fs = require('fs');
const path = require('path');
const ROOT = path.resolve(__dirname, '..', '..', '..');

function loadPost(file) {
  // The draft files export `export const post = {...}`. Strip TS types if any.
  let src = fs.readFileSync(file, 'utf8');
  src = src.replace(/^import .*$/gm, '');
  src = src.replace(/:\s*BlogPost\b/g, '');
  src = src.replace(/export const post\s*=/, 'module.exports =');
  const mod = new (require('module'))(file, null);
  mod._compile(src, file);
  return mod.exports;
}

const stripTags = (html) => html.replace(/<[^>]*>/g, ' ').replace(/&[a-z]+;/gi, ' ').replace(/\s+/g, ' ').trim();
const words = (html) => stripTags(html).split(/\s+/).filter(Boolean);

const BRITISH = ['cheque','favourite','behaviour','behaviours','organise','organised','organize'.length?'xxxx': '','realise','realised','colour','colours','centre','centres','fibre','theatre','labour','neighbour','traveller','cancelled','modelled','finalise','personalise','optimise','minimise','maximise','prioritise','standardise','rumour','honour','armour','defence','offence','licence','practise','enrol','instalment','jewellery','pyjamas','tyre','kerb','plough','mould','draught','grey'];
const UK = ['cheque','favourite','favourites','behaviour','behaviours','organise','organised','organising','realise','realised','realising','colour','colours','coloured','centre','centres','centred','fibre','theatre','labour','neighbour','neighbours','traveller','travellers','cancelled','cancelling','modelled','finalise','finalised','personalise','optimise','minimise','maximise','prioritise','standardise','rumour','honour','armour','defence','defences','offence','licence','practise','enrol','enrolled','instalment','jewellery','pyjamas','tyre','kerb','plough','mould','draught','grey'];

// --- known slugs ---
const seedSrc = fs.readFileSync(path.join(ROOT, 'web/lib/blog/seed.ts'), 'utf8');
const genSrc = fs.readFileSync(path.join(ROOT, 'web/lib/blog/generated.ts'), 'utf8');
const slugRe = /slug:\s*"([^"]+)"/g;
const seedSlugs = new Set(), genSlugs = new Set();
let m;
while ((m = slugRe.exec(seedSrc)) !== null) seedSlugs.add(m[1]);
while ((m = slugRe.exec(genSrc)) !== null) genSlugs.add(m[1]);
const allBlogSlugs = new Set([...seedSlugs, ...genSlugs]);

// bank slugs from config
const bankSrc = fs.readFileSync(path.join(ROOT, 'web/lib/config/banks.ts'), 'utf8');
const bRe = /\[\s*"[^"]*"\s*,\s*"([^"]+)"\s*\]/g;
const bankSlugs = new Set();
while ((m = bRe.exec(bankSrc)) !== null) {
  bankSlugs.add(m[1].toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''));
}

const guideSlugs = new Set(['convert-bank-statement-to-csv','bank-statement-reconciliation-accountants','bank-statement-for-loans-and-visas']);

// last-30-day posts for gate 9 (all generated are within 30 days; seed are older)
const titleRe = /title:\s*"([^"]+)"/g;
const recentTitles = [];
let tm; const tmpSrc = genSrc;
while ((tm = titleRe.exec(tmpSrc)) !== null) recentTitles.push(tm[1].toLowerCase());

const files = ['gen-2026-10-16-01','gen-2026-10-16-02','gen-2026-10-16-03','gen-2026-10-16-04','gen-2026-10-16-05'];
let allOk = true;
for (const f of files) {
  const p = loadPost(path.join(__dirname, f + '.ts'));
  const fails = [];
  const ok = (n, cond, detail) => { if (!cond) fails.push(`GATE ${n} FAILED: ${detail}`); };
  // G1 slug unique
  ok(1, !allBlogSlugs.has(p.slug), `slug ${p.slug} already exists`);
  allBlogSlugs.add(p.slug);
  // G2 lengths
  ok(2, p.title.length >= 40 && p.title.length <= 70, `title len ${p.title.length}`);
  ok(2, p.excerpt.length >= 120 && p.excerpt.length <= 170, `excerpt len ${p.excerpt.length}`);
  // G3 words + h2
  const w = words(p.content).length;
  const h2 = (p.content.match(/<h2>/gi) || []).length;
  ok(3, w >= 800, `word count ${w}`);
  ok(3, h2 >= 4, `h2 count ${h2}`);
  ok(3, /<h2>Frequently asked questions<\/h2>/i.test(p.content), 'missing FAQ h2');
  // G4 placeholders
  ok(4, !/lorem|TODO|\[insert\]|xxx|dummy/i.test(p.content + p.title + p.excerpt), 'placeholder text found');
  // G5 US English
  const textLow = (p.title + ' ' + p.excerpt + ' ' + stripTags(p.content)).toLowerCase();
  const ukHits = UK.filter((w2) => new RegExp(`\\b${w2}\\b`).test(textLow));
  ok(5, ukHits.length === 0, `british spellings: ${ukHits.join(',')}`);
  // G6 keyword in title + first 100 words
  const kwGuess = p.title.toLowerCase().replace(/^how to /, '').replace(/:\s*full 2026 guide$/, '').replace(/\s+in 2026$/, '').replace(/\s+fast & accurately$/, '').replace(/\s+quickly$/, '');
  ok(6, p.title.toLowerCase().includes(kwGuess.split(' ').slice(0,4).join(' ')), 'keyword not in title');
  const first100 = words(p.content).slice(0, 100).join(' ').toLowerCase();
  ok(6, first100.includes(kwGuess.split(' ').slice(0,4).join(' ')), `keyword not in first 100 words (kw: ${kwGuess})`);
  // G7 internal links resolve
  const links = [...p.content.matchAll(/href="(\/[^"]*)"/g)].map((x) => x[1]);
  const bad = links.filter((l) => {
    if (l === '/' || l === '/pricing') return false;
    if (l.startsWith('/banks/')) return !bankSlugs.has(l.slice(7));
    if (l.startsWith('/blog/')) return !allBlogSlugs.has(l.slice(6));
    if (l.startsWith('/guides/')) return !guideSlugs.has(l.slice(8));
    return true;
  });
  ok(7, links.length >= 3, `only ${links.length} internal links`);
  ok(7, bad.length === 0, `unresolvable links: ${bad.join(',')}`);
  // G8 images
  const feat = p.featureImage.startsWith('http') ? null : path.join(ROOT, 'web/public', p.featureImage);
  if (feat) {
    ok(8, fs.existsSync(feat), `feature image missing: ${p.featureImage}`);
  }
  const inl = [...p.content.matchAll(/src="(\/blog\/[^"]*-inline-\d+\.jpg)"/g)].map((x) => x[1]);
  ok(8, inl.length >= 2, `only ${inl.length} inline images`);
  for (const s of inl) {
    const fp = path.join(ROOT, 'web/public', s);
    ok(8, fs.existsSync(fp), `inline image missing: ${s}`);
    if (fs.existsSync(fp) && fp.endsWith('.jpg')) {
      const buf = fs.readFileSync(fp);
      ok(8, buf[0] === 0xff && buf[1] === 0xd8, `${s} not a valid JPEG`);
      ok(8, buf.length > 10000, `${s} suspiciously small (${buf.length}b)`);
    }
  }
  // G9 no dup in last 30 days
  const dup = recentTitles.includes(p.title.toLowerCase());
  ok(9, !dup, 'duplicate title in recent posts');
  // misc template checks
  ok('T', /^gen-2026-10-16-0[1-5]$/.test(p.id), `bad id ${p.id}`);
  ok('T', p.published === true, 'not published');
  ok('T', p.createdAt === '2026-10-16T06:30:00Z', 'bad createdAt');
  console.log(`\n== ${f} (${p.slug}) ==`);
  if (fails.length === 0) {
    console.log(`PASS — title ${p.title.length}ch, excerpt ${p.excerpt.length}ch, ${w} words, ${h2} h2, ${links.length} links, ${inl.length} inline imgs`);
  } else {
    allOk = false;
    fails.forEach((x) => console.log('  ' + x));
  }
}
console.log(allOk ? '\nALL GATES PASS' : '\nSOME GATES FAILED');
process.exit(allOk ? 0 : 1);
