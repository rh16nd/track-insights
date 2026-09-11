"""Render one version of the PodiumCall intro video.

Runs inside Higgsfield's sandbox from /home/user/final:
    python3 render.py <en|fr> <phone|desk>

Needs:  <lang>.mp3                narration
        cap/<lang>-<fmt>/01..09   the nine screens, in narration order
Writes: out/<lang>-<fmt>/final_captioned.mp4  (plus final.mp4 without captions)

Screens change on the sentence each one belongs to, timed from a word-level
Whisper transcript of the narration. Captions take their WORDS from the approved
script and only their timing from Whisper, so a misheard word can never reach
the screen.
"""
import difflib, json, os, re, subprocess, sys, unicodedata
from PIL import Image, ImageDraw, ImageFilter

LANG, FMT = sys.argv[1], sys.argv[2]
os.chdir("/home/user/final")
HF = os.environ["HF_WORKFLOWS"] + "/ugc-website-video/scripts/"
AUDIO, CAP, OUT = f"{LANG}.mp3", f"cap/{LANG}-{FMT}", f"out/{LANG}-{FMT}"
os.makedirs(OUT, exist_ok=True)

SCRIPTS = {
    "en": "This is PodiumCall. It shows who is most likely to finish in the top three at the next big athletics championship, using real results from World Athletics. Start on the Dashboard. Each card is the athlete our model rates highest in one event. Open Track or Field to see the top 20 in any event. By points ranks them on their best performance this season. Model rating shows who the model thinks will reach the podium. When the two lists disagree, take a closer look. Choose a name to open that athlete's page. You'll see their best marks, their races this year, and their chance of a top-three finish. That's not a chance of winning. Press the little i next to any number to see what it means. Use search to find any ranked athlete, even if they're not competing. Results shows what we predicted before each championship, and what really happened. Spotted a mistake? Press Send feedback at the bottom of any page.",
    "fr": "Voici PodiumCall. Le site montre qui a le plus de chances de finir dans le top trois du prochain grand championnat d'athlétisme, à partir des vrais résultats de World Athletics. Commencez par le Tableau de bord. Chaque carte montre l'athlète que notre modèle place en tête dans une épreuve. Ouvrez Piste ou Concours pour voir le top 20 de chaque épreuve. Avec Par points, les athlètes sont classés selon leur meilleure performance de la saison. Avec Évaluation du modèle, vous voyez qui, selon le modèle, montera sur le podium. Quand les deux classements ne sont pas d'accord, regardez de plus près. Choisissez un nom pour ouvrir la fiche de l'athlète : ses meilleures marques, ses courses de l'année et sa chance de finir dans le top trois. Pas sa chance de gagner. Appuyez sur le petit i à côté d'un chiffre pour savoir ce qu'il veut dire. La recherche trouve n'importe quel athlète classé, même ceux qui ne sont pas engagés. Résultats montre ce que nous avions prévu avant chaque championnat, et ce qui s'est vraiment passé. Une erreur ? Appuyez sur Envoyer un retour, en bas de chaque page.",
}
# The sentence each of the 9 screens starts on: dashboard, favourites, by points,
# model rating, athlete page, info tip, search, results, feedback.
BEATS = {"en": [0, 2, 4, 6, 8, 11, 12, 13, 14], "fr": [0, 2, 4, 6, 8, 10, 11, 12, 13]}
W, H = (1080, 1920) if FMT == "phone" else (1920, 1080)
BOX = (40, 40, 1000, 1549) if FMT == "phone" else (140, 36, 1640, 891)
CAPS = dict(size=54, lr=90, v=120) if FMT == "phone" else dict(size=42, lr=220, v=40)
FPS, FADE, LEAD, TAIL = 30, 0.4, 0.15, 0.7
BG = (58, 25, 16)

def run(cmd):
    p = subprocess.run(cmd, capture_output=True, text=True)
    if p.returncode != 0:
        print("CMD FAILED:", " ".join(cmd)[:220]); print(p.stdout[-400:], p.stderr[-900:]); sys.exit(p.returncode)
    return p

def norm(t):
    t = unicodedata.normalize("NFKD", t.lower())
    return re.sub(r"[^a-z0-9]", "", "".join(c for c in t if not unicodedata.combining(c)))

script = SCRIPTS[LANG]
open(f"{OUT}/script.txt", "w", encoding="utf-8").write(script + "\n")
sents = [s for s in re.split(r"(?<=[.?!])\s+", script.strip()) if s]
assert len(sents) == BEATS[LANG][-1] + 2, f"{LANG}: {len(sents)} sentences, beats expect {BEATS[LANG][-1] + 2}"
tok, tok_sent = [], []
for si, s in enumerate(sents):
    for w in s.split():
        if norm(w):
            tok.append(norm(w)); tok_sent.append(si)

words_path = f"{OUT}/words.json"
run(["python3", HF + "transcribe_words.py", AUDIO, "--lang", LANG, "-o", words_path])
words = json.load(open(words_path))
wn = [norm(w[2]) for w in words]
times = [None] * len(tok)
for tag, i1, i2, j1, j2 in difflib.SequenceMatcher(a=tok, b=wn, autojunk=False).get_opcodes():
    if tag in ("equal", "replace") and j2 > j1:
        for k in range(i2 - i1):
            times[i1 + k] = words[min(j1 + (k * (j2 - j1)) // max(i2 - i1, 1), j2 - 1)][0]
last = 0.0
for i, t in enumerate(times):
    times[i] = last if t is None else t
    last = times[i]

dur = float(run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "default=nw=1:nk=1", AUDIO]).stdout.strip())
END = dur + TAIL
starts = [0.0] + [max(0.0, times[tok_sent.index(b)] - LEAD) for b in BEATS[LANG][1:]]
print(f"{LANG}-{FMT}: audio {dur:.2f}s, {len(words)} words heard, screens start at {[round(s, 2) for s in starts]}")
assert all(b > a + 1.0 for a, b in zip(starts, starts[1:])), "screen timings are not increasing -- alignment failed"

def compose(src, dst):
    shot = Image.open(src).convert("RGB")
    bx, by, bw, bh = BOX
    s = min(bw / shot.width, bh / shot.height)
    sw, sh = round(shot.width * s), round(shot.height * s)
    shot = shot.resize((sw, sh), Image.LANCZOS)
    x, y = bx + (bw - sw) // 2, by + (bh - sh) // 2
    r = 34 if FMT == "phone" else 16
    canvas = Image.new("RGBA", (W, H), BG + (255,))
    shadow = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    ImageDraw.Draw(shadow).rounded_rectangle([x, y + 16, x + sw, y + sh + 16], radius=r, fill=(0, 0, 0, 150))
    canvas = Image.alpha_composite(canvas, shadow.filter(ImageFilter.GaussianBlur(26)))
    mask = Image.new("L", (sw, sh), 0)
    ImageDraw.Draw(mask).rounded_rectangle([0, 0, sw - 1, sh - 1], radius=r, fill=255)
    canvas.paste(shot, (x, y), mask)
    canvas.convert("RGB").save(dst)

n = len(starts)
clips = []
for k in range(n):
    src = f"{CAP}/{k + 1:02d}.png"
    if not os.path.exists(src):
        print("MISSING SCREENSHOT", src); sys.exit(2)
    frame = f"{OUT}/frame{k + 1:02d}.png"
    compose(src, frame)
    if k == 0:
        L = starts[1] + FADE / 2
    elif k == n - 1:
        L = END - starts[k] + FADE / 2
    else:
        L = starts[k + 1] - starts[k] + FADE
    nf = max(2, round(L * FPS))
    clip = f"{OUT}/clip{k + 1:02d}.mp4"
    run(["ffmpeg", "-v", "error", "-y", "-loop", "1", "-framerate", str(FPS), "-i", frame, "-frames:v", str(nf),
         "-c:v", "libx264", "-tune", "stillimage", "-preset", "veryfast", "-crf", "18", "-pix_fmt", "yuv420p", clip])
    clips.append(clip)

inputs = []
for c in clips:
    inputs += ["-i", c]
inputs += ["-i", AUDIO]
fc, prev = [], "[0:v]"
for i in range(1, n):
    fc.append(f"{prev}[{i}:v]xfade=transition=fade:duration={FADE}:offset={starts[i] - FADE / 2:.3f}[v{i}]")
    prev = f"[v{i}]"
fc.append(f"[{n}:a]apad[aout]")
base = f"{OUT}/final.mp4"
run(["ffmpeg", "-v", "error", "-y", *inputs, "-filter_complex", ";".join(fc), "-map", prev, "-map", "[aout]",
     "-t", f"{END:.3f}", "-c:v", "libx264", "-preset", "veryfast", "-crf", "18", "-pix_fmt", "yuv420p",
     "-c:a", "aac", "-b:a", "192k", "-movflags", "+faststart", base])

# Captions: the WORDS come from the approved script, whisper only supplies the clock.
# Built here rather than with group_captions/make_captions: those force CAPITALS, flash
# two words at a time, and turned whisper's "Podium Call" into a stray extra "call." caption.
disp = []
for w in script.split():
    if norm(w) or not disp:
        disp.append(w)
    else:
        disp[-1] = disp[-1] + (" " if LANG == "fr" else "") + w   # glue "?" and ":" to the word before
tok_d = [norm(w) for w in disp]
d_start, d_end = [None] * len(disp), [None] * len(disp)
for tag, i1, i2, j1, j2 in difflib.SequenceMatcher(a=tok_d, b=wn, autojunk=False).get_opcodes():
    if tag in ("equal", "replace") and j2 > j1 and i2 > i1:
        span = i2 - i1
        for k in range(span):
            a = j1 + (k * (j2 - j1)) // span
            b = max(a, min(j1 + ((k + 1) * (j2 - j1)) // span - 1, j2 - 1))
            d_start[i1 + k], d_end[i1 + k] = words[a][0], words[b][1]
for i in range(len(disp)):
    if d_start[i] is None:
        d_start[i] = d_end[i - 1] if i else 0.0
    if d_end[i] is None:
        d_end[i] = d_start[i] + 0.25
MAXC = 48 if FMT == "phone" else 70
# Never end a caption on a small connecting word; carry it to the next caption instead.
WEAK = {"the", "a", "an", "our", "to", "of", "in", "at", "and", "or", "is", "are", "their", "if", "not", "each",
        "its", "any", "who", "that", "on", "for", "by", "with", "what", "we", "will", "you",
        "le", "la", "les", "de", "du", "des", "a", "et", "ou", "un", "une", "sa", "ses", "son", "qui", "que",
        "pour", "dans", "sur", "par", "au", "aux", "ce", "se", "vous", "notre", "d", "l", "n", "qu"}
def weak(tok):
    last = tok.replace("’", "'").split("'")[-1] if "'" in tok.replace("’", "'") else tok
    return norm(last) in WEAK
groups, cur = [], []
for i, w in enumerate(disp):
    if cur and (len(" ".join(disp[j] for j in cur + [i])) > MAXC or d_start[i] - d_end[cur[-1]] > 0.6):
        carry = []
        while len(cur) > 1 and weak(disp[cur[-1]]) and not re.search(r"[.?!:,]$", disp[cur[-1]]):
            carry.insert(0, cur.pop())
        groups.append(cur); cur = carry
    cur.append(i)
    if re.search(r"[.?!:]$", w) or (w.endswith(",") and len(" ".join(disp[j] for j in cur)) >= 22):
        groups.append(cur); cur = []
if cur:
    groups.append(cur)
segs = [[d_start[g[0]], d_end[g[-1]] + 0.2, " ".join(disp[j] for j in g)] for g in groups]
for k in range(len(segs) - 1):
    segs[k][1] = min(max(segs[k][1], segs[k][0] + 0.7), segs[k + 1][0] - 0.02)

def ts(t):
    t = max(0.0, t)
    return f"{int(t // 3600)}:{int(t % 3600 // 60):02d}:{t % 60:05.2f}"

ass = f"{OUT}/captions.ass"
with open(ass, "w", encoding="utf-8") as f:
    f.write("[Script Info]\nScriptType: v4.00+\n")
    f.write(f"PlayResX: {W}\nPlayResY: {H}\nWrapStyle: 0\nScaledBorderAndShadow: yes\n\n")
    f.write("[V4+ Styles]\nFormat: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding\n")
    f.write(f"Style: Cap,Metropolis,{CAPS['size']},&H00FFFFFF,&H00FFFFFF,&H00000000,&H80000000,-1,0,0,0,100,100,0,0,1,4,1,2,{CAPS['lr']},{CAPS['lr']},{CAPS['v']},1\n\n")
    f.write("[Events]\nFormat: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text\n")
    for s0, s1, text in segs:
        f.write(f"Dialogue: 0,{ts(s0)},{ts(s1)},Cap,,0,0,0,,{text}\n")

final = f"{OUT}/final_captioned.mp4"
run(["ffmpeg", "-v", "error", "-y", "-i", base, "-vf", f"ass={ass}", "-c:v", "libx264", "-preset", "veryfast",
     "-crf", "18", "-pix_fmt", "yuv420p", "-c:a", "copy", "-movflags", "+faststart", final])
out_dur = run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "default=nw=1:nk=1", final]).stdout.strip()
print(f"RENDERED {final}: {float(out_dur):.2f}s, {len(segs)} captions (script text, max {MAXC} chars), "
      f"{os.path.getsize(final) // 1024} KB; first captions: {[s[2] for s in segs[:5]]}")
