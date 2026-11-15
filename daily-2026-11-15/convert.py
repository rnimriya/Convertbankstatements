import os
from PIL import Image
RAW = 'daily-2026-11-15/raw_images'
OUT = 'web/public/blog'
# match by name stem in filename (media tool preserves the name stem)
MAP = {
 'small-business-taxes-for-beginners.webp': ('t01-feature-sbtax', 1600),
 'small-business-taxes-for-beginners-inline-1.webp': ('t01-inline-1-sbtax', 1200),
 'small-business-taxes-for-beginners-inline-2.webp': ('t01-inline-2-sbtax', 1200),
 'estimated-tax-payments-2026.webp': ('t02-feature-esttax', 1600),
 'estimated-tax-payments-2026-inline-1.webp': ('t02-inline-1-esttax', 1200),
 'estimated-tax-payments-2026-inline-2.webp': ('t02-inline-2-esttax', 1200),
 'bank-statement-meaning.webp': ('t03-feature-bankstmt', 1600),
 'bank-statement-meaning-inline-1.webp': ('t03-inline-1-bankstmt', 1200),
 'bank-statement-meaning-inline-2.webp': ('t03-inline-2-bankstmt', 1200),
 'bank-of-kigali-import-to-xero.webp': ('t04-feature-kigali', 1600),
 'bank-of-kigali-import-to-xero-inline-1.webp': ('t04-inline-1-kigali', 1200),
 'bank-of-kigali-import-to-xero-inline-2.webp': ('t04-inline-2-kigali', 1200),
 'bank-of-maharashtra-import-to-xero.webp': ('t05-feature-maha', 1600),
 'bank-of-maharashtra-import-to-xero-inline-1.webp': ('t05-inline-1-maha', 1200),
 'bank-of-maharashtra-import-to-xero-inline-2.webp': ('t05-inline-2-maha', 1200),
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
