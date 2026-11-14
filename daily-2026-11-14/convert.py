import os
from PIL import Image
RAW = 'daily-2026-11-14/raw_images'
OUT = 'web/public/blog'
# match by name stem in filename (media tool preserves the name stem)
MAP = {
 '1099-k-threshold-2026.webp': ('t01-feature-1099k', 1600),
 '1099-k-threshold-2026-inline-1.webp': ('t01-inline-1-1099k', 1200),
 '1099-k-threshold-2026-inline-2.webp': ('t01-inline-2-1099k', 1200),
 'home-office-deduction-2026.webp': ('t02-feature-homeoffice', 1600),
 'home-office-deduction-2026-inline-1.webp': ('t02-inline-1-homeoffice', 1200),
 'home-office-deduction-2026-inline-2.webp': ('t02-inline-2-homeoffice', 1200),
 'payroll-tax-cap-2026.webp': ('t03-feature-payroll', 1600),
 'payroll-tax-cap-2026-inline-1.webp': ('t03-inline-1-payroll', 1200),
 'payroll-tax-cap-2026-inline-2.webp': ('t03-inline-2-payroll', 1200),
 'bank-of-ireland-convert-to-csv-quickbooks.webp': ('t04-feature-boi', 1600),
 'bank-of-ireland-convert-to-csv-quickbooks-inline-1.webp': ('t04-inline-1-boi', 1200),
 'bank-of-ireland-convert-to-csv-quickbooks-inline-2.webp': ('t04-inline-2-boi', 1200),
 'how-to-reconcile-in-quickbooks-online.webp': ('t05-feature-qb', 1600),
 'how-to-reconcile-in-quickbooks-online-inline-1.webp': ('t05-inline-1-qb', 1200),
 'how-to-reconcile-in-quickbooks-online-inline-2.webp': ('t05-inline-2-qb', 1200),
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
