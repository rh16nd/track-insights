"""Re-burn captions only, onto an already-rendered base video.

    python3 reburn.py <en|fr> <phone|desk>

Use it after changing caption grouping or style in render.py. It skips the
transcription, screen composition and encoding that render.py does, and reads
render.py's own caption block, so the two can't drift apart.

Needs out/<lang>-<fmt>/{script.txt, words.json, final.mp4} from a previous render.
"""
import difflib, json, os, re, subprocess, sys, unicodedata
LANG, FMT = sys.argv[1], sys.argv[2]
OUT = f"out/{LANG}-{FMT}"
W, H = (1080, 1920) if FMT == "phone" else (1920, 1080)
CAPS = dict(size=54, lr=90, v=120) if FMT == "phone" else dict(size=42, lr=220, v=40)

def run(cmd):
    p = subprocess.run(cmd, capture_output=True, text=True)
    if p.returncode != 0:
        print("CMD FAILED:", " ".join(cmd)[:200]); print(p.stderr[-800:]); sys.exit(p.returncode)
    return p

def norm(t):
    t = unicodedata.normalize("NFKD", t.lower())
    return re.sub(r"[^a-z0-9]", "", "".join(c for c in t if not unicodedata.combining(c)))

script = open(f"{OUT}/script.txt", encoding="utf-8").read().strip()
words = json.load(open(f"{OUT}/words.json"))
wn = [norm(w[2]) for w in words]
base = f"{OUT}/final.mp4"
src = open("render.py", encoding="utf-8").read()
exec(src[src.index("disp = []"):])
