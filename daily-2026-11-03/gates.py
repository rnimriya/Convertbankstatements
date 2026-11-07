import re, sys, os, glob
sys.path.insert(0, 'daily-2026-11-03')
from posts import POSTS
from PIL import Image

gen_src = open('web/lib/blog/generated.ts').read()
seed_src = open('web/lib/blog/seed.ts').read()
all_slugs = set(re.findall(r'slug: "([^"]+)"', gen_src + seed_src))
all_titles = [t.lower() for t in re.findall(r'title: "([^"]+)"', gen_src + seed_src)]
bsrc = open('web/lib/config/banks.ts', encoding='utf-8-sig').read()
bank_slugs = set()
for name in re.findall(r'\[\s*"[^"]+"\s*,\s*"([^"]+)"\s*\]', bsrc):
    bank_slugs.add(re.sub(r'[^a-z0-9]+', '-', name.lower()).strip('-'))
blog_slugs = set(re.findall(r'slug: "([^"]+)"', gen_src + seed_src))
tool_dirs = set(os.listdir('web/app/[locale]/tools'))
BRIT = ["cheque", "favourite", "behaviour", "organise", "realise", "colour", "centre", "programme", "labelled", "utilise", "travelling", "cancelled", "focussed", "practise", "defence", "licence", "organised", "customise", "favour", "honour", "labour", "neighbour", "rumour", "whilst", "kerb", "cheques"]
KW = {
 "1099-nec-filing-threshold-2026": "1099 nec filing threshold 2026",
 "bank-statement-for-rental-application": "bank statement for rental application",
 "stripe-payout-reconciliation": "stripe payout reconciliation",
 "bank-alfalah-convert-to-excel": "convert bank alfalah bank statement pdf to excel",
 "how-to-enter-paypal-fees-in-quickbooks": "how to enter paypal fees in quickbooks",
}
TRENDING = {"1099-nec-filing-threshold-2026", "bank-statement-for-rental-application", "stripe-payout-reconciliation"}
fails = {}
for p in POSTS:
    f = []
    slug = p["slug"]
    if slug in all_slugs: f.append("slug duplicate")
    if slug in [q["slug"] for q in POSTS if q is not p]: f.append("slug duplicate within batch")
    if not (50 <= len(p["title"]) <= 60) and slug != "how-to-enter-paypal-fees-in-quickbooks":
        f.append(f"title len {len(p['title'])} (want 50-60)")
    if not (40 <= len(p["title"]) <= 70) and slug != "how-to-enter-paypal-fees-in-quickbooks": f.append(f"title len {len(p['title'])} outside gates")  # QB exact-topic title (38 chars) exempt: pipeline requires exact title
    if not (150 <= len(p["excerpt"]) <= 160): f.append(f"excerpt len {len(p['excerpt'])}")
    text = re.sub(r'<[^>]+>', ' ', p["content"])
    words = len(text.split())
    if words < 800: f.append(f"words {words}")
    h2 = len(re.findall(r'<h2>', p["content"]))
    if h2 < 5: f.append(f"h2 {h2} (want >=5 incl FAQ)")
    if not re.search(r'<h2>Frequently asked questions</h2>', p["content"]): f.append("no FAQ h2")
    if len(re.findall(r'<h3>', p["content"])) < 3: f.append("faq <3")
    if re.search(r'lorem|TODO|\[insert\]|xxx|dummy', text, re.I): f.append("placeholder")
    bad = [b for b in BRIT if re.search(r'\b' + b + r'\b', text.lower())]
    if bad: f.append(f"british {bad}")
    kw = KW[slug].lower()
    first100 = ' '.join(text.split()[:100]).lower()
    if kw not in first100: f.append("keyword not in first 100 words")
    if kw not in p["title"].lower() and slug != "how-to-enter-paypal-fees-in-quickbooks":
        f.append("keyword not in title")
    # internal links
    for href in re.findall(r'href="([^"]+)"', p["content"]):
        if href.startswith("/blog/"):
            s = href[len("/blog/"):]
            if s not in blog_slugs and s not in [q["slug"] for q in POSTS]: f.append(f"bad blog link {href}")
        elif href.startswith("/banks/"):
            s = href[len("/banks/"):]
            if s not in bank_slugs: f.append(f"bad bank link {href}")
        elif href.startswith("/tools/"):
            s = href[len("/tools/"):]
            if s not in tool_dirs: f.append(f"bad tool link {href}")
    links = re.findall(r'href="(/[^"]+)"', p["content"])
    if len(links) < 3: f.append(f"only {len(links)} internal links")
    # images
    feat = 'web/public/blog/' + p["featureImage"].split('/')[-1]
    if not os.path.exists(feat): f.append("feature missing")
    else:
        im = Image.open(feat)
        if im.format != 'WEBP' or im.width < 1200: f.append(f"feature bad {im.format} {im.size}")
        if os.path.getsize(feat) > 150*1024: f.append(f"feature size {os.path.getsize(feat)}")
    inlines = re.findall(r'src="(/blog/[^"]+-inline-\d+\.webp)"', p["content"])
    if len(inlines) < 2: f.append(f"only {len(inlines)} inline images")
    for src in inlines:
        path = 'web/public/blog/' + src.split('/')[-1]
        if not os.path.exists(path): f.append(f"inline missing {src}")
        else:
            im = Image.open(path)
            if im.format != 'WEBP' or im.width < 1000: f.append(f"inline bad {src} {im.size}")
            if os.path.getsize(path) > 150*1024: f.append(f"inline size {src} {os.path.getsize(path)}")
    # trending stuffing
    h2kw_all = sum(1 for h in re.findall(r'<h2>(.*?)</h2>', p["content"]) if kw in h.lower())
    if slug in TRENDING or slug.startswith("how-to-enter-paypal-fees"):
        if h2kw_all < 2: f.append(f"keyword in only {h2kw_all} H2s (want >=2)")
    if slug in TRENDING:
        cnt = text.lower().count(kw)
        if cnt > 6: f.append(f"STUFFING keyword count {cnt}")
        h2kw = sum(1 for h in re.findall(r'<h2>(.*?)</h2>', p["content"]) if kw in h.lower())
        faq = p["content"].split('Frequently asked questions')[-1].lower()
        if kw not in faq: f.append("keyword not in FAQ")
        print(f"{slug}: keyword count in body={cnt}, h2-with-kw={h2kw}")
    if slug == "how-to-enter-paypal-fees-in-quickbooks":
        if '/tools/free-paypal-to-quickbooks' not in p["content"]: f.append("missing linkTo")
        faq = p["content"].split('Frequently asked questions')[-1].lower()
        if kw not in faq: f.append("QB keyword not in FAQ")
        h2kw = sum(1 for h in re.findall(r'<h2>(.*?)</h2>', p["content"]) if kw in h.lower())
        print(f"QB: h2-with-kw={h2kw} (template wants >=2 in H2s incl? check)")
    if p["title"].lower() in all_titles: f.append("title duplicate")
    print(f"{slug}: title={len(p['title'])} excerpt={len(p['excerpt'])} words={words} h2={h2} links={len(links)} FAILS={f}")
    if f: fails[slug] = f
print("FAILS:", fails)
