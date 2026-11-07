import re, sys, json, pickle
from PIL import Image
from datetime import date

POSTS = pickle.load(open('daily-2026-10-30/posts.pkl','rb'))
gen_src = open('web/lib/blog/generated.ts').read()
seed_src = open('web/lib/blog/seed.ts').read()
all_slugs = set(re.findall(r'slug: "([^"]+)"', gen_src + seed_src))
all_titles = re.findall(r'title: "([^"]+)"', gen_src + seed_src)
# first paragraphs of recent posts (approx: content start)
import os
bank_slugs = set()
bsrc = open('web/lib/config/banks.ts').read()
for name in re.findall(r'\[\s*"[^"]+"\s*,\s*"([^"]+)"\s*\]', bsrc):
    bank_slugs.add(re.sub(r'[^a-z0-9]+','-',name.lower()).strip('-'))
blog_slugs = set(re.findall(r'slug: "([^"]+)"', gen_src + seed_src))
tool_dirs = set(os.listdir('web/app/[locale]/tools'))
BRIT = ["cheque","favourite","behaviour","organise","realise","colour","centre","programme","labelled","utilise","travelling","cancelled","focussed","practise","defence","licence","organised","customise","favour","honour","labour","neighbour","rumour","whilst","kerb","cheques"]
KW = {
 "bancfirst-convert-to-csv-quickbooks": "convert BancFirst bank statement PDF to CSV for QuickBooks",
 "banco-av-villas-convert-to-csv-quickbooks": "convert Banco AV Villas bank statement PDF to CSV for QuickBooks",
 "banco-bpm-convert-to-csv-quickbooks": "convert Banco BPM bank statement PDF to CSV for QuickBooks",
 "banco-bradesco-convert-to-csv-quickbooks": "convert Banco Bradesco bank statement PDF to CSV for QuickBooks",
 "does-stripe-integrate-with-quickbooks-online": "does Stripe integrate with QuickBooks Online",
}
fails = {}
for p in POSTS:
    f = []
    slug = p["slug"]
    if slug in all_slugs: f.append("slug duplicate")
    if not (40 <= len(p["title"]) <= 70): f.append(f"title len {len(p['title'])}")
    if not (120 <= len(p["excerpt"]) <= 170): f.append(f"excerpt len {len(p['excerpt'])}")
    text = re.sub(r'<[^>]+>', ' ', p["content"])
    words = len(text.split())
    if words < 800: f.append(f"words {words}")
    h2 = len(re.findall(r'<h2>', p["content"]))
    if h2 < 4: f.append(f"h2 {h2}")
    if not re.search(r'<h2>Frequently asked questions</h2>', p["content"]): f.append("no FAQ h2")
    if re.search(r'lorem|TODO|\[insert\]|xxx|dummy', text, re.I): f.append("placeholder")
    bad = [b for b in BRIT if re.search(r'\b'+b+r'\b', text.lower())]
    if bad: f.append(f"british {bad}")
    kw = KW[slug]
    first100 = ' '.join(text.split()[:100])
    if kw not in first100: f.append("keyword not in first 100 words")
    # title keyword: bank posts -> bank name tokens + convert/csv/quickbooks present
    tl = p["title"].lower()
    if slug.startswith("does-"):
        if kw.lower() not in tl: f.append("keyword not in title")
    else:
        bank = slug.rsplit('-convert-to-csv-quickbooks',1)[0].replace('-',' ')
        if bank not in tl or 'csv' not in tl or 'quickbooks' not in tl: f.append("title keyword tokens missing")
    # internal links
    for href in re.findall(r'href="([^"]+)"', p["content"]):
        if href.startswith('/banks/'):
            if href[7:] not in bank_slugs: f.append(f"bad bank link {href}")
        elif href.startswith('/blog/'):
            if href[6:] not in blog_slugs and href[6:] not in [q["slug"] for q in POSTS]: f.append(f"bad blog link {href}")
        elif href.startswith('/tools/'):
            if href[7:] not in tool_dirs: f.append(f"bad tool link {href}")
        elif href not in ('/','/pricing','/quickbooks'):
            f.append(f"unverified link {href}")
    if p["title"] in all_titles: f.append("duplicate title")
    # images
    feat = f"web/public/blog/{slug}.webp"
    try:
        im = Image.open(feat); assert im.format=='WEBP' and im.size[0] >= 1200
    except Exception as e: f.append(f"feature image bad: {e}")
    inlines = re.findall(r'src="(/blog/[^"]+-inline-\d\.webp)"', p["content"])
    if len(inlines) < 2: f.append(f"only {len(inlines)} inline images")
    for src in inlines:
        path = 'web/public/blog/' + src.split('/')[-1]
        try:
            im = Image.open(path); assert im.format=='WEBP' and im.size[0] >= 1000
        except Exception as e: f.append(f"inline bad {src}: {e}")
    for alt in re.findall(r'<img[^>]+alt="([^"]+)"', p["content"]):
        wc = len(alt.split())
        if not (10 <= wc <= 16): f.append(f"inline alt {wc} words: {alt[:60]}")
    # QB extra: linkTo with keyword anchor
    if slug.startswith("does-"):
        if not re.search(r'<a href="/tools/free-stripe-to-quickbooks">[^<]*Stripe to QuickBooks converter[^<]*</a>', p["content"]):
            f.append("linkTo anchor missing")
        if kw not in first100: f.append("qb keyword intro missing")
        h2texts = re.findall(r'<h2>(.*?)</h2>', p["content"])
        if sum(1 for h in h2texts if 'stripe' in h.lower()) < 2: f.append("qb keyword in <2 H2s")
        faq = p["content"].split('Frequently asked questions')[1]
        if 'integrate with QuickBooks Online' not in faq: f.append("qb keyword not in FAQ")
    fails[slug] = f
    print(slug, "PASS" if not f else "FAIL: " + "; ".join(f))
sys.exit(1 if any(fails.values()) else 0)
