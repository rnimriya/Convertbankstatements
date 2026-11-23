import os
from PIL import Image
RAW = 'daily-2026-11-23/raw_images'
OUT = 'web/public/blog'
# match by name stem in filename (media tool preserves the name stem)
MAP = {
 'bank-statement-for-proof-of-address.webp': ('t01-feature-proofaddress', 1600),
 'bank-statement-for-proof-of-address-inline-1.webp': ('t01-inline-1-proofaddress', 1200),
 'bank-statement-for-proof-of-address-inline-2.webp': ('t01-inline-2-proofaddress', 1200),
 'bookkeeping-for-beginners.webp': ('t02-feature-bookkeeping', 1600),
 'bookkeeping-for-beginners-inline-1.webp': ('t02-inline-1-bookkeeping', 1200),
 'bookkeeping-for-beginners-inline-2.webp': ('t02-inline-2-bookkeeping', 1200),
 'quickbooks-payroll-pricing.webp': ('t03-feature-payroll', 1600),
 'quickbooks-payroll-pricing-inline-1.webp': ('t03-inline-1-payroll', 1200),
 'quickbooks-payroll-pricing-inline-2.webp': ('t03-inline-2-payroll', 1200),
 'banque-populaire-convert-to-excel.webp': ('t04-feature-banque-populaire', 1600),
 'banque-populaire-convert-to-excel-inline-1.webp': ('t04-inline-1-banque-populaire', 1200),
 'banque-populaire-convert-to-excel-inline-2.webp': ('t04-inline-2-banque-populaire', 1200),
 'banque-populaire-doujda-convert-to-excel.webp': ('t05-feature-doujda', 1600),
 'banque-populaire-doujda-convert-to-excel-inline-1.webp': ('t05-inline-1-doujda', 1200),
 'banque-populaire-doujda-convert-to-excel-inline-2.webp': ('t05-inline-2-doujda', 1200),
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
