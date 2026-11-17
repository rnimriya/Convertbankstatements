import os
from PIL import Image
RAW = 'daily-2026-11-17/raw_images'
OUT = 'web/public/blog'
# match by name stem in filename (media tool preserves the name stem)
MAP = {
 'quickbooks-online-pricing.webp': ('t01-feature-pricing', 1600),
 'quickbooks-online-pricing-inline-1.webp': ('t01-inline-1-pricing', 1200),
 'quickbooks-online-pricing-inline-2.webp': ('t01-inline-2-pricing', 1200),
 'bank-statement-pdf-to-excel.webp': ('t02-feature-statement', 1600),
 'bank-statement-pdf-to-excel-inline-1.webp': ('t02-inline-1-statement', 1200),
 'bank-statement-pdf-to-excel-inline-2.webp': ('t02-inline-2-statement', 1200),
 'small-business-accounting-software-free.webp': ('t03-feature-free', 1600),
 'small-business-accounting-software-free-inline-1.webp': ('t03-inline-1-free', 1200),
 'small-business-accounting-software-free-inline-2.webp': ('t03-inline-2-free', 1200),
 'bank-of-scotland-statements-for-tax-filing.webp': ('t04-feature-scotland', 1600),
 'bank-of-scotland-statements-for-tax-filing-inline-1.webp': ('t04-inline-1-scotland', 1200),
 'bank-of-scotland-statements-for-tax-filing-inline-2.webp': ('t04-inline-2-scotland', 1200),
 'bank-of-the-west-statements-for-tax-filing.webp': ('t05-feature-west', 1600),
 'bank-of-the-west-statements-for-tax-filing-inline-1.webp': ('t05-inline-1-west', 1200),
 'bank-of-the-west-statements-for-tax-filing-inline-2.webp': ('t05-inline-2-west', 1200),
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
