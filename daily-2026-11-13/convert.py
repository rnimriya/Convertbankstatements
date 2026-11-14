import os
from PIL import Image
RAW = 'daily-2026-11-13/raw_images'
OUT = 'web/public/blog'
# explicit map: target filename -> (source uuid fragment, width)
MAP = {
 'expense-report-template-excel.webp': ('fc3b44fe', 1600),
 'expense-report-template-excel-inline-1.webp': ('31204337', 1200),
 'expense-report-template-excel-inline-2.webp': ('76c9ae04', 1200),
 'small-business-saturday-2026.webp': ('87f96c39', 1600),
 'small-business-saturday-2026-inline-1.webp': ('f85ffa01', 1200),
 'small-business-saturday-2026-inline-2.webp': ('3aa0a320', 1200),
 'balance-sheet-template-excel.webp': ('35d70e5b', 1600),
 'balance-sheet-template-excel-inline-1.webp': ('d64c711b', 1200),
 'balance-sheet-template-excel-inline-2.webp': ('ce8ce3fa', 1200),
 'atlantic-union-bank-convert-to-excel.webp': ('b1164ece', 1600),
 'atlantic-union-bank-convert-to-excel-inline-1.webp': ('aa36f2bb', 1200),
 'atlantic-union-bank-convert-to-excel-inline-2.webp': ('68ba06e9', 1200),
 'quickbooks-reconciliation-report-explained.webp': ('86cfea7f', 1600),
 'quickbooks-reconciliation-report-explained-inline-1.webp': ('3963abd1', 1200),
 'quickbooks-reconciliation-report-explained-inline-2.webp': ('157ee09d', 1200),
}
files = os.listdir(RAW)
for target, (frag, w) in MAP.items():
    srcs = [f for f in files if frag in f]
    assert len(srcs) == 1, (target, srcs)
    src = os.path.join(RAW, srcs[0])
    im = Image.open(src).convert('RGB')
    ratio = w / im.width
    im2 = im.resize((w, round(im.height * ratio)), Image.LANCZOS)
    dest = os.path.join(OUT, target)
    im2.save(dest, 'WEBP', quality=80)
    print(f"{target}: {im.size} -> {im2.size}, {os.path.getsize(dest)} B")
print("converted:", len(MAP))
