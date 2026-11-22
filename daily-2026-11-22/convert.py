import os
from PIL import Image
RAW = 'daily-2026-11-22/raw_images'
OUT = 'web/public/blog'
# match by name stem in filename (media tool preserves the name stem)
MAP = {
 'tax-season-2027.webp': ('t01-feature-taxseason', 1600),
 'tax-season-2027-inline-1.webp': ('t01-inline-1-taxseason', 1200),
 'tax-season-2027-inline-2.webp': ('t01-inline-2-taxseason', 1200),
 'bookkeeping-for-freelancers.webp': ('t02-feature-freelance', 1600),
 'bookkeeping-for-freelancers-inline-1.webp': ('t02-inline-1-freelance', 1200),
 'bookkeeping-for-freelancers-inline-2.webp': ('t02-inline-2-freelance', 1200),
 '1099-deadline-2027.webp': ('t03-feature-1099', 1600),
 '1099-deadline-2027-inline-1.webp': ('t03-inline-1-1099', 1200),
 '1099-deadline-2027-inline-2.webp': ('t03-inline-2-1099', 1200),
 'banque-cic-statements-for-tax-filing.webp': ('t04-feature-cic', 1600),
 'banque-cic-statements-for-tax-filing-inline-1.webp': ('t04-inline-1-cic', 1200),
 'banque-cic-statements-for-tax-filing-inline-2.webp': ('t04-inline-2-cic', 1200),
 'banque-laurentienne-statements-for-tax-filing.webp': ('t05-feature-laurentienne', 1600),
 'banque-laurentienne-statements-for-tax-filing-inline-1.webp': ('t05-inline-1-laurentienne', 1200),
 'banque-laurentienne-statements-for-tax-filing-inline-2.webp': ('t05-inline-2-laurentienne', 1200),
}
files = os.listdir(RAW)
for target, (stem, w) in MAP.items():
    srcs = [f for f in files if stem in f and f.endswith('.webp')]
    assert len(srcs) == 1, (target, srcs)
    src = os.path.join(RAW, srcs[0])
    im = Image.open(src).convert('RGB')
    ratio = w / im.width
    im2 = im.resize((w, round(im.height * ratio)), Image.LANCZOS)
    dest = os.path.join(OUT, target)
    im2.save(dest, 'WEBP', quality=80)
    print(f"{target}: {im.size} -> {im2.size}, {os.path.getsize(dest)} B")
print("converted:", len(MAP))
