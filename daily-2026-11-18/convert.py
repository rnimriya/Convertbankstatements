import os
from PIL import Image
RAW = 'daily-2026-11-18/raw_images'
OUT = 'web/public/blog'
# match by name stem in filename (media tool preserves the name stem)
MAP = {
 'pdf-to-excel-converter-free.webp': ('t01-feature-converter', 1600),
 'pdf-to-excel-converter-free-inline-1.webp': ('t01-inline-1-converter', 1200),
 'pdf-to-excel-converter-free-inline-2.webp': ('t01-inline-2-converter', 1200),
 '1099-nec-form-2026.webp': ('t02-feature-1099', 1600),
 '1099-nec-form-2026-inline-1.webp': ('t02-inline-1-1099', 1200),
 '1099-nec-form-2026-inline-2.webp': ('t02-inline-2-1099', 1200),
 'excel-template-for-small-business-accounting.webp': ('t03-feature-template', 1600),
 'excel-template-for-small-business-accounting-inline-1.webp': ('t03-inline-1-template', 1200),
 'excel-template-for-small-business-accounting-inline-2.webp': ('t03-inline-2-template', 1200),
 'bank-of-travelers-rest-convert-to-excel.webp': ('t04-feature-travelers', 1600),
 'bank-of-travelers-rest-convert-to-excel-inline-1.webp': ('t04-inline-1-travelers', 1200),
 'bank-of-travelers-rest-convert-to-excel-inline-2.webp': ('t04-inline-2-travelers', 1200),
 'bank-pekao-convert-to-excel.webp': ('t05-feature-pekao', 1600),
 'bank-pekao-convert-to-excel-inline-1.webp': ('t05-inline-1-pekao', 1200),
 'bank-pekao-convert-to-excel-inline-2.webp': ('t05-inline-2-pekao', 1200),
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
