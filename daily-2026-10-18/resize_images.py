#!/usr/bin/env python3
"""Center-crop to 3:2 and resize blog images. Feature -> 1920x1280, inline -> 1200x800, JPEG q85."""
import os, glob
from PIL import Image, ImageOps

OUT_DIR = "/home/hatch/workspace/convertstatement/daily-2026-10-18/images"

def fit(img, tw, th):
    img = ImageOps.exif_transpose(img)
    target_ratio = tw / th
    w, h = img.size
    ratio = w / h
    if ratio > target_ratio:  # too wide -> crop sides
        nw = int(h * target_ratio)
        x0 = (w - nw) // 2
        img = img.crop((x0, 0, x0 + nw, h))
    elif ratio < target_ratio:  # too tall -> crop top/bottom
        nh = int(w / target_ratio)
        y0 = (h - nh) // 2
        img = img.crop((0, y0, w, y0 + nh))
    return img.resize((tw, th), Image.LANCZOS)

done, skipped = [], []
for path in sorted(glob.glob(os.path.join(OUT_DIR, "*.jpg"))):
    base = os.path.basename(path)
    if base.startswith("media-generation-"):
        continue  # leftover raw download, not a final image
    try:
        img = Image.open(path)
        w0, h0 = img.size
        if "-inline-" in base:
            out = fit(img, 1200, 800)
        else:
            out = fit(img, 1920, 1280)
        out.save(path, "JPEG", quality=85, optimize=True)
        done.append(f"{base}: {w0}x{h0} -> {out.size[0]}x{out.size[1]}")
        print(done[-1], flush=True)
    except Exception as e:
        skipped.append(f"{base}: {e}")
        print("SKIP", skipped[-1], flush=True)
print("DONE:", len(done), "SKIPPED:", len(skipped))
for s in skipped:
    print("SKIP:", s)
