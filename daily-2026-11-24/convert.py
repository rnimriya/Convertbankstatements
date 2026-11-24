import os
from PIL import Image
RAW = 'daily-2026-11-24/raw_images'
OUT = 'web/public/blog'
# match by name stem in filename (media tool preserves the name stem)
MAP = {
 'chime-bank-statement.webp': ('t01-feature-chime', 1600),
 'chime-bank-statement-inline-1.webp': ('t01-inline-1-chime', 1200),
 'chime-bank-statement-inline-2.webp': ('t01-inline-2-chime', 1200),
 'how-to-get-a-bank-statement.webp': ('t02-feature-getstatement', 1600),
 'how-to-get-a-bank-statement-inline-1.webp': ('t02-inline-1-getstatement', 1200),
 'how-to-get-a-bank-statement-inline-2.webp': ('t02-inline-2-getstatement', 1200),
 'bank-statement-pdf-to-csv.webp': ('t03-feature-pdftocsv', 1600),
 'bank-statement-pdf-to-csv-inline-1.webp': ('t03-inline-1-pdftocsv', 1200),
 'bank-statement-pdf-to-csv-inline-2.webp': ('t03-inline-2-pdftocsv', 1200),
 'b-bank-convert-to-csv-quickbooks.webp': ('t04-feature-bbank', 1600),
 'b-bank-convert-to-csv-quickbooks-inline-1.webp': ('t04-inline-1-bbank', 1200),
 'b-bank-convert-to-csv-quickbooks-inline-2.webp': ('t04-inline-2-bbank', 1200),
 'benchmark-community-bank-convert-to-csv-quickbooks.webp': ('t05-feature-benchmark', 1600),
 'benchmark-community-bank-convert-to-csv-quickbooks-inline-1.webp': ('t05-inline-1-benchmark', 1200),
 'benchmark-community-bank-convert-to-csv-quickbooks-inline-2.webp': ('t05-inline-2-benchmark', 1200),
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
