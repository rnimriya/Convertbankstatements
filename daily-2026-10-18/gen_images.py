#!/usr/bin/env python3
"""Generate 15 blog images for convertstatement daily-2026-10-18 pipeline via media-generation CLI."""
import json, os, shutil, subprocess, sys, time
from concurrent.futures import ThreadPoolExecutor

OUT_DIR = "/home/hatch/workspace/convertstatement/daily-2026-10-18/images"
os.makedirs(OUT_DIR, exist_ok=True)

ITEMS = [
 ("punjab-national-bank-statements-for-tax-filing.jpg",
  "Photorealistic DSLR photograph of a home office desk at tax time: an open laptop with a softly blurred spreadsheet on the screen, printed bank statement pages slightly out of focus beside it, a calculator, reading glasses and a pen on a warm wooden desk, evening lamp light, shallow depth of field. No readable text, no logos. Wide landscape composition."),
 ("punjab-national-bank-statements-for-tax-filing-inline-1.jpg",
  "Photorealistic DSLR photograph: close-up of hands sorting a stack of printed bank statement pages on a wooden home-office desk, a folder and pen nearby, shallow depth of field, warm natural light. No readable text, no logos, no faces. Wide landscape composition."),
 ("punjab-national-bank-statements-for-tax-filing-inline-2.jpg",
  "Photorealistic DSLR photograph of a laptop keyboard in the foreground with a softly blurred spreadsheet on screen, a printed bank statement and pen beside it on a desk, morning window light, shallow depth of field. No readable text, no logos. Wide landscape composition."),
 ("bank-of-baroda-statements-for-tax-filing.jpg",
  "Photorealistic DSLR photograph of a freelancer's small-business desk: a notebook open with handwritten expense categories out of focus, a calculator, a small pile of printed receipts, a laptop with a blurred accounting screen, a coffee cup, warm desk lamp light, shallow depth of field. No readable text, no logos. Wide landscape composition."),
 ("bank-of-baroda-statements-for-tax-filing-inline-1.jpg",
  "Photorealistic DSLR photograph: a calculator beside a neat pile of printed receipts and invoices on a desk, shallow depth of field, soft daylight. No readable text, no logos. Wide landscape composition."),
 ("bank-of-baroda-statements-for-tax-filing-inline-2.jpg",
  "Photorealistic DSLR photograph of hands typing on a laptop with a softly blurred spreadsheet on screen, an open accounting notebook and pen beside the laptop, shallow depth of field. No readable text, no logos, no faces. Wide landscape composition."),
 ("canara-bank-statements-for-tax-filing.jpg",
  "Photorealistic DSLR photograph of a young professional's bright home desk: a tidy stack of printed bank statements with a yellow highlighter on top, an open laptop with a blurred spreadsheet on screen, a small potted plant in the background, morning sunlight through a window, shallow depth of field. No readable text, no logos. Wide landscape composition."),
 ("canara-bank-statements-for-tax-filing-inline-1.jpg",
  "Photorealistic DSLR photograph: close-up of a yellow highlighter resting across printed bank statement pages on a desk, pages slightly fanned, shallow depth of field, bright daylight. No readable text, no logos. Wide landscape composition."),
 ("canara-bank-statements-for-tax-filing-inline-2.jpg",
  "Photorealistic DSLR photograph of a smartphone and an open laptop on a clean white desk, a coffee cup beside them, the laptop screen softly blurred, bright airy daylight, shallow depth of field. No readable text, no logos. Wide landscape composition."),
 ("union-bank-of-india-statements-for-tax-filing.jpg",
  "Photorealistic DSLR photograph of a retiree's tidy wooden desk: reading glasses resting on a printed bank statement, an open laptop with a softly blurred screen, a pen and a small notebook, a warm cup of tea, gentle morning window light, shallow depth of field. No readable text, no logos. Wide landscape composition."),
 ("union-bank-of-india-statements-for-tax-filing-inline-1.jpg",
  "Photorealistic DSLR photograph: reading glasses resting on top of printed bank statement pages on a wooden desk, soft morning light, shallow depth of field. No readable text, no logos. Wide landscape composition."),
 ("union-bank-of-india-statements-for-tax-filing-inline-2.jpg",
  "Photorealistic DSLR photograph of a desk calendar page with a pen resting on it, a small stack of printed statements beside it, soft daylight, shallow depth of field. No readable text on the calendar, no logos. Wide landscape composition."),
 ("bank-of-india-statements-for-tax-filing.jpg",
  "Photorealistic DSLR photograph of a landlord's desk: a manila folder of rental documents, an open laptop with a softly blurred spreadsheet on screen, a calculator, a set of house keys, warm desk lamp light, shallow depth of field. No readable text, no logos. Wide landscape composition."),
 ("bank-of-india-statements-for-tax-filing-inline-1.jpg",
  "Photorealistic DSLR photograph: a manila folder with rental paperwork on a desk, a calculator and pen beside it, warm lamplight, shallow depth of field. No readable text, no logos. Wide landscape composition."),
 ("bank-of-india-statements-for-tax-filing-inline-2.jpg",
  "Photorealistic DSLR photograph of a calculator next to a printed list of transactions on a desk, the page slightly out of focus, a pen on top, soft daylight, shallow depth of field. No readable text, no logos. Wide landscape composition."),
]

def generate_one(item):
    fname, prompt = item
    dest = os.path.join(OUT_DIR, fname)
    if os.path.exists(dest) and os.path.getsize(dest) > 10000:
        return (fname, "exists", "")
    convo = json.dumps([{"text": prompt}])
    last_err = ""
    for attempt in (1, 2):
        try:
            p = subprocess.run(
                ["/opt/hatch/bin/media-generation",
                 "--media-subagent-output-type", "image",
                 "--conversation-json", convo,
                 "--image-output-format", "jpg",
                 "--orientation", "landscape",
                 "--output-dir", OUT_DIR,
                 "--timeout-secs", "300"],
                capture_output=True, text=True, timeout=320)
            # stdout is a single JSON line (plus possible trailing lines); find JSON object
            out = p.stdout.strip()
            obj = None
            for line in out.splitlines():
                line = line.strip()
                if line.startswith("{"):
                    try:
                        cand = json.loads(line)
                        if cand.get("tool") == "media_subagent":
                            obj = cand
                            break
                    except Exception:
                        pass
            if obj and obj.get("ok") and obj.get("media_paths"):
                src = obj["media_paths"][0]
                if os.path.exists(src):
                    shutil.move(src, dest)
                    # cleanup json payload for this run
                    jpath = obj.get("output_path")
                    if jpath and os.path.exists(jpath):
                        os.remove(jpath)
                    return (fname, "ok", "")
                last_err = f"media path missing: {src}"
            else:
                last_err = (p.stdout + p.stderr)[-400:]
        except Exception as e:
            last_err = repr(e)[-400:]
        time.sleep(5)
    return (fname, "failed", last_err)

results = []
with ThreadPoolExecutor(max_workers=4) as ex:
    for res in ex.map(generate_one, ITEMS):
        results.append(res)
        print(json.dumps({"file": res[0], "status": res[1]}), flush=True)

failed = [r for r in results if r[1] == "failed"]
print("SUMMARY: %d ok, %d failed" % (len(results) - len(failed), len(failed)))
for f in failed:
    print("FAILED:", f[0], f[2][-200:])
with open(os.path.join(OUT_DIR, "gen-results.json"), "w") as f:
    json.dump(results, f, indent=2)
