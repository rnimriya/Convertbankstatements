import os
from PIL import Image
RAW = 'daily-2026-11-20/raw_images'
OUT = 'web/public/blog'
# match by name stem in filename (media tool preserves the name stem)
MAP = {
 'import-bank-statement-into-xero.webp': ('t01-feature-xeroimport', 1600),
 'import-bank-statement-into-xero-inline-1.webp': ('t01-inline-1-xeroimport', 1200),
 'import-bank-statement-into-xero-inline-2.webp': ('t01-inline-2-xeroimport', 1200),
 'csv-to-quickbooks.webp': ('t02-feature-csvqb', 1600),
 'csv-to-quickbooks-inline-1.webp': ('t02-inline-1-csvqb', 1200),
 'csv-to-quickbooks-inline-2.webp': ('t02-inline-2-csvqb', 1200),
 'small-business-tax-deductions-2026.webp': ('t03-feature-taxded', 1600),
 'small-business-tax-deductions-2026-inline-1.webp': ('t03-inline-1-taxded', 1200),
 'small-business-tax-deductions-2026-inline-2.webp': ('t03-inline-2-taxded', 1200),
 'bank-sinarmas-import-to-xero.webp': ('t04-feature-sinarmas', 1600),
 'bank-sinarmas-import-to-xero-inline-1.webp': ('t04-inline-1-sinarmas', 1200),
 'bank-sinarmas-import-to-xero-inline-2.webp': ('t04-inline-2-sinarmas', 1200),
 'bank-windhoek-import-to-xero.webp': ('t05-feature-windhoek', 1600),
 'bank-windhoek-import-to-xero-inline-1.webp': ('t05-inline-1-windhoek', 1200),
 'bank-windhoek-import-to-xero-inline-2.webp': ('t05-inline-2-windhoek', 1200),
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
