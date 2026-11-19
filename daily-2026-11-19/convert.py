import os
from PIL import Image
RAW = 'daily-2026-11-19/raw_images'
OUT = 'web/public/blog'
# match by name stem in filename (media tool preserves the name stem)
MAP = {
 'convert-pdf-to-csv-for-quickbooks.webp': ('t01-feature-csvqb', 1600),
 'convert-pdf-to-csv-for-quickbooks-inline-1.webp': ('t01-inline-1-csvqb', 1200),
 'convert-pdf-to-csv-for-quickbooks-inline-2.webp': ('t01-inline-2-csvqb', 1200),
 'w2-form-2026.webp': ('t02-feature-w2', 1600),
 'w2-form-2026-inline-1.webp': ('t02-inline-1-w2', 1200),
 'w2-form-2026-inline-2.webp': ('t02-inline-2-w2', 1200),
 'tax-season-2026-start-date.webp': ('t03-feature-taxseason', 1600),
 'tax-season-2026-start-date-inline-1.webp': ('t03-inline-1-taxseason', 1200),
 'tax-season-2026-start-date-inline-2.webp': ('t03-inline-2-taxseason', 1200),
 'bank-polski-convert-to-csv-quickbooks.webp': ('t04-feature-polski', 1600),
 'bank-polski-convert-to-csv-quickbooks-inline-1.webp': ('t04-inline-1-polski', 1200),
 'bank-polski-convert-to-csv-quickbooks-inline-2.webp': ('t04-inline-2-polski', 1200),
 'banksa-convert-to-csv-quickbooks.webp': ('t05-feature-banksa', 1600),
 'banksa-convert-to-csv-quickbooks-inline-1.webp': ('t05-inline-1-banksa', 1200),
 'banksa-convert-to-csv-quickbooks-inline-2.webp': ('t05-inline-2-banksa', 1200),
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
