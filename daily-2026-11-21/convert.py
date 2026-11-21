import os
from PIL import Image
RAW = 'daily-2026-11-21/raw_images'
OUT = 'web/public/blog'
# match by name stem in filename (media tool preserves the name stem)
MAP = {
 'small-business-accounting-software-without-subscription.webp': ('t01-feature-nosub', 1600),
 'small-business-accounting-software-without-subscription-inline-1.webp': ('t01-inline-1-nosub', 1200),
 'small-business-accounting-software-without-subscription-inline-2.webp': ('t01-inline-2-nosub', 1200),
 'business-expense-tracker-excel.webp': ('t02-feature-exptrack', 1600),
 'business-expense-tracker-excel-inline-1.webp': ('t02-inline-1-exptrack', 1200),
 'business-expense-tracker-excel-inline-2.webp': ('t02-inline-2-exptrack', 1200),
 'receipt-scanner-for-taxes.webp': ('t03-feature-receiptscan', 1600),
 'receipt-scanner-for-taxes-inline-1.webp': ('t03-inline-1-receiptscan', 1200),
 'receipt-scanner-for-taxes-inline-2.webp': ('t03-inline-2-receiptscan', 1200),
 'banner-bank-password-protected-pdf.webp': ('t04-feature-banner', 1600),
 'banner-bank-password-protected-pdf-inline-1.webp': ('t04-inline-1-banner', 1200),
 'banner-bank-password-protected-pdf-inline-2.webp': ('t04-inline-2-banner', 1200),
 'banorte-password-protected-pdf.webp': ('t05-feature-banorte', 1600),
 'banorte-password-protected-pdf-inline-1.webp': ('t05-inline-1-banorte', 1200),
 'banorte-password-protected-pdf-inline-2.webp': ('t05-inline-2-banorte', 1200),
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
