import os
from PIL import Image
RAW = 'daily-2026-11-25/raw_images'
OUT = 'web/public/blog'
# match by name stem in filename (media tool preserves the name stem)
MAP = {
 'how-to-read-a-bank-statement.webp': ('t01-feature-readstatement', 1600),
 'how-to-read-a-bank-statement-inline-1.webp': ('t01-inline-1-readstatement', 1200),
 'how-to-read-a-bank-statement-inline-2.webp': ('t01-inline-2-readstatement', 1200),
 'bookkeeping-software-for-nonprofits.webp': ('t02-feature-nonprofit', 1600),
 'bookkeeping-software-for-nonprofits-inline-1.webp': ('t02-inline-1-nonprofit', 1200),
 'bookkeeping-software-for-nonprofits-inline-2.webp': ('t02-inline-2-nonprofit', 1200),
 'bank-statement-proof-of-income.webp': ('t03-feature-proofofincome', 1600),
 'bank-statement-proof-of-income-inline-1.webp': ('t03-inline-1-proofofincome', 1200),
 'bank-statement-proof-of-income-inline-2.webp': ('t03-inline-2-proofofincome', 1200),
 'beobank-import-to-xero.webp': ('t04-feature-beobank', 1600),
 'beobank-import-to-xero-inline-1.webp': ('t04-inline-1-beobank', 1200),
 'beobank-import-to-xero-inline-2.webp': ('t04-inline-2-beobank', 1200),
 'bergische-volksbank-import-to-xero.webp': ('t05-feature-bergische', 1600),
 'bergische-volksbank-import-to-xero-inline-1.webp': ('t05-inline-1-bergische', 1200),
 'bergische-volksbank-import-to-xero-inline-2.webp': ('t05-inline-2-bergische', 1200),
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
