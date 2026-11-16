import os
from PIL import Image
RAW = 'daily-2026-11-16/raw_images'
OUT = 'web/public/blog'
# match by name stem in filename (media tool preserves the name stem)
MAP = {
 'bank-statements-for-rental-application.webp': ('t01-feature-rental', 1600),
 'bank-statements-for-rental-application-inline-1.webp': ('t01-inline-1-rental', 1200),
 'bank-statements-for-rental-application-inline-2.webp': ('t01-inline-2-rental', 1200),
 'tax-filing-2026-deadline.webp': ('t02-feature-taxdeadline', 1600),
 'tax-filing-2026-deadline-inline-1.webp': ('t02-inline-1-taxdeadline', 1200),
 'tax-filing-2026-deadline-inline-2.webp': ('t02-inline-2-taxdeadline', 1200),
 'receipt-to-excel.webp': ('t03-feature-receipt', 1600),
 'receipt-to-excel-inline-1.webp': ('t03-inline-1-receipt', 1200),
 'receipt-to-excel-inline-2.webp': ('t03-inline-2-receipt', 1200),
 'bank-of-melbourne-password-protected-pdf.webp': ('t04-feature-melbourne', 1600),
 'bank-of-melbourne-password-protected-pdf-inline-1.webp': ('t04-inline-1-melbourne', 1200),
 'bank-of-melbourne-password-protected-pdf-inline-2.webp': ('t04-inline-2-melbourne', 1200),
 'bank-of-new-zealand-password-protected-pdf.webp': ('t05-feature-nz', 1600),
 'bank-of-new-zealand-password-protected-pdf-inline-1.webp': ('t05-inline-1-nz', 1200),
 'bank-of-new-zealand-password-protected-pdf-inline-2.webp': ('t05-inline-2-nz', 1200),
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
