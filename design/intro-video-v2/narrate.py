"""Record the narration line by line and write the timings the video follows.

    English (Kokoro, George):   <kokoro venv>\\python narrate.py en
    French, captions only:      <kokoro venv>\\python narrate.py fr --silent
    French (Chatterbox):        <chatterbox venv>\\python narrate.py fr
    Redo some lines only:       ... narrate.py fr --redo 3,5 --seed 11
    Reassemble without TTS:     ... narrate.py fr --assemble

--silent records nothing: each line is timed for reading its captions (15
characters a second, never shorter than the same English line, so both cuts
keep one rhythm) and the track is silence. The French cut is made this way
until it has a voice the user likes (2026-09-22).

Each line is recorded on its own into audio/lines/, trimmed, and laid end to
end with fixed pauses, so every line's start and end is known exactly. Inside a
line, the pauses the voice makes at commas are found in the audio and matched
to the commas in the text; that is how the video knows, for instance, when
"Model rating" is said. Writes audio/<lang>.wav and audio/<lang>.timing.json.
"""
import argparse
import json
import os
import re

import numpy as np
import soundfile as sf

HERE = os.path.dirname(os.path.abspath(__file__))
AUDIO = os.path.join(HERE, "audio")
LINES = os.path.join(AUDIO, "lines")
CACHE = os.path.expanduser(r"~\.cache\intro-video")
CHATTERBOX = os.path.expanduser(
    r"~\.cache\huggingface\hub\models--ResembleAI--chatterbox\snapshots\5bb1f6ee58e50c3b8d408bc82a6d3740c2db6e18")
SR = 24000

LEAD_IN = 1.4        # title animation before the first word
GAP = 0.45           # between two lines in the same scene
SCENE_GAP = 0.9      # between scenes, room for the transition
OUTRO = 3.6          # end card after the last word

# Chatterbox reads the French in George's voice, cloned from this clip of
# Kokoro's George (Apache-2.0). cfg_weight 0 keeps his English accent out.
FR_REF = os.path.join(AUDIO, "george-ref.wav")
FR_CFG = 0.0


def load_script(lang, name="script.json"):
    with open(os.path.join(HERE, name), encoding="utf-8") as f:
        return json.load(f)[lang]


def tts_kokoro(lines, todo, seed):
    from kokoro_onnx import Kokoro
    k = Kokoro(os.path.join(CACHE, "kokoro-v1.0.int8.onnx"), os.path.join(CACHE, "voices-v1.0.bin"))
    for i in todo:
        audio, sr = k.create(lines[i]["text"], voice="bm_george", speed=1.0, lang="en-gb")
        assert sr == SR, sr
        yield i, audio


def tts_chatterbox(lines, todo, seed):
    import torch
    from chatterbox.mtl_tts import ChatterboxMultilingualTTS
    from pathlib import Path
    model = ChatterboxMultilingualTTS.from_local(Path(CHATTERBOX), "cpu")
    assert model.sr == SR, model.sr
    model.prepare_conditionals(FR_REF)
    for i in todo:
        torch.manual_seed(seed + i)
        wav = model.generate(lines[i]["text"], language_id="fr", cfg_weight=FR_CFG)
        yield i, wav.squeeze(0).numpy()


def rms_frames(x, hop=None):
    hop = hop or SR // 100
    n = len(x) // hop
    return np.sqrt(np.mean(x[: n * hop].reshape(n, hop) ** 2, axis=1)), hop


def trim(x):
    r, hop = rms_frames(x)
    on = np.where(r > 0.08 * r.max())[0]
    a = max(0, on[0] * hop - int(0.04 * SR))
    b = min(len(x), (on[-1] + 1) * hop + int(0.08 * SR))
    return x[a:b]


def gaps(x):
    """Silent stretches of at least 90 ms inside the line, as (start, end) seconds."""
    r, hop = rms_frames(x)
    quiet = r < 0.06 * r.max()
    out, i = [], 0
    while i < len(quiet):
        if quiet[i]:
            j = i
            while j < len(quiet) and quiet[j]:
                j += 1
            if (j - i) * hop >= 0.09 * SR and i > 0 and j < len(quiet):
                out.append((i * hop / SR, j * hop / SR))
            i = j
        else:
            i += 1
    return out


def decode(path):
    """Any audio or video file -> mono float32 at SR, through ffmpeg."""
    import subprocess
    import imageio_ffmpeg
    raw = subprocess.run([imageio_ffmpeg.get_ffmpeg_exe(), "-v", "error", "-i", path, "-vn", "-ac", "1",
                          "-ar", str(SR), "-f", "f32le", "-"], capture_output=True, check=True).stdout
    return np.frombuffer(raw, dtype=np.float32).copy()


def split_take(x, texts):
    """Cut a take recorded as one piece into its sentences, at the pauses.

    Each boundary is the pause nearest where the sentence should end by its
    share of the characters, with longer pauses preferred: a voice pauses
    longer between sentences than at a comma. Prints what it chose."""
    r, hop = rms_frames(x)
    loud = np.where(r > 0.06 * r.max())[0]
    s0, s1 = loud[0] * hop / SR, (loud[-1] + 1) * hop / SR
    quiet = r < 0.06 * r.max()
    found, i = [], 0
    while i < len(quiet):
        if quiet[i]:
            j = i
            while j < len(quiet) and quiet[j]:
                j += 1
            a, b = i * hop / SR, j * hop / SR
            if b - a >= 0.12 and a > s0 and b < s1:
                found.append((a, b))
            i = j
        else:
            i += 1
    chars = np.cumsum([len(t) for t in texts])
    expect = [s0 + (s1 - s0) * c / chars[-1] for c in chars[:-1]]
    n, g = len(expect), len(found)
    cost = lambda j, k: ((found[k][0] + found[k][1]) / 2 - expect[j]) ** 2 - 3.0 * (found[k][1] - found[k][0])
    INF = float("inf")
    best = [[INF] * g for _ in range(n)]
    back = [[-1] * g for _ in range(n)]
    for k in range(g):
        best[0][k] = cost(0, k)
    for j in range(1, n):
        run, arg = INF, -1
        for k in range(g):
            if k - 1 >= 0 and best[j - 1][k - 1] < run:
                run, arg = best[j - 1][k - 1], k - 1
            if arg >= 0:
                best[j][k] = run + cost(j, k)
                back[j][k] = arg
    k = min(range(g), key=lambda k: best[n - 1][k])
    picks = []
    for j in range(n - 1, -1, -1):
        picks.append(k)
        k = back[j][k]
    picks.reverse()
    cuts = [s0 - 0.05] + [(found[k][0] + found[k][1]) / 2 for k in picks] + [s1 + 0.1]
    for j, k in enumerate(picks):
        print(f"  after line {j + 1}: pause {found[k][0]:.2f}-{found[k][1]:.2f} ({found[k][1] - found[k][0]:.2f}s), "
              f"expected near {expect[j]:.2f}")
    left = sorted((b - a, a) for m, (a, b) in enumerate(found) if m not in picks and b - a >= 0.35)
    if left:
        print("  long pauses not used:", ", ".join(f"{a:.2f} ({d:.2f}s)" for d, a in left))
    return [x[int(max(0, cuts[m]) * SR):int(cuts[m + 1] * SR)] for m in range(len(texts))]


def pieces_of(text):
    cuts = [m.end() for m in re.finditer(r"[,;:.?!](?=\s)", text)]
    pieces, prev = [], 0
    for c in cuts + [len(text)]:
        pieces.append(text[prev:c].strip())
        prev = c
    return cuts, pieces


READ_CPS = 15.0      # captions-only: characters read per second
READ_PAUSE = 0.2     # between two pieces of one line


def silent_line(text, min_dur):
    """A silent stretch long enough to read the line, and its pieces' times."""
    _, pieces = pieces_of(text)
    dur = max(sum(len(p) for p in pieces) / READ_CPS + READ_PAUSE * (len(pieces) - 1), min_dur)
    speak = dur - READ_PAUSE * (len(pieces) - 1)
    total = sum(len(p) for p in pieces)
    segs, t = [], 0.0
    for p in pieces:
        d = speak * len(p) / total
        segs.append({"text": p, "start": round(t, 3), "end": round(t + d, 3)})
        t += d + READ_PAUSE
    return np.zeros(int(dur * SR), np.float32), segs


def segments(text, x):
    """Split the line at its inner punctuation and time each piece from the
    pauses in the audio; a comma the voice ran through is placed by length."""
    dur = len(x) / SR
    cuts, pieces = pieces_of(text)
    found = gaps(x)
    bounds = []
    for c in cuts:
        guess = dur * c / len(text)
        near = [g for g in found if not bounds or g[0] > bounds[-1][1]]
        best = min(near, key=lambda g: abs((g[0] + g[1]) / 2 - guess), default=None)
        if best is not None and abs((best[0] + best[1]) / 2 - guess) < 0.25 * dur:
            bounds.append(best)
            found.remove(best)
        else:
            bounds.append((guess, guess))
    out, start = [], 0.0
    for k, piece in enumerate(pieces):
        end = bounds[k][0] if k < len(bounds) else dur
        out.append({"text": piece, "start": round(start, 3), "end": round(end, 3)})
        if k < len(bounds):
            start = bounds[k][1]
    return out


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("lang", choices=["en", "fr"])
    ap.add_argument("--redo", default="")
    ap.add_argument("--seed", type=int, default=7)
    ap.add_argument("--assemble", action="store_true")
    ap.add_argument("--silent", action="store_true")
    ap.add_argument("--take", help="a finished recording of the whole script, to cut into lines")
    ap.add_argument("--script", default="script.json")
    ap.add_argument("--out", help="name for this recording's files (default: the language)")
    a = ap.parse_args()
    global SR
    if a.take:
        SR = 44100
    lines = load_script(a.lang, a.script)
    os.makedirs(LINES, exist_ok=True)
    stem = a.out or a.lang
    path = lambda i: os.path.join(LINES, f"{stem}-{i}.wav")
    en_durs = {}
    if a.silent:
        en_path = os.path.join(AUDIO, "en.timing.json")
        if os.path.exists(en_path):
            with open(en_path, encoding="utf-8") as f:
                en_durs = {l["line"]: l["end"] - l["start"] for l in json.load(f)["lines"]}

    if a.take:
        for i, piece in enumerate(split_take(decode(a.take), [l["text"] for l in lines])):
            piece = trim(piece)
            sf.write(path(i), piece, SR)
            print(f"  line {i + 1}: {len(piece) / SR:.2f}s  {lines[i]['text'][:60]}")
    elif not a.assemble and not a.silent:
        todo = [int(s) for s in a.redo.split(",") if s] or \
               [i for i in range(len(lines)) if not os.path.exists(path(i))]
        engine = tts_kokoro if a.lang == "en" else tts_chatterbox
        for i, audio in engine(lines, todo, a.seed):
            audio = trim(np.asarray(audio, dtype=np.float32))
            sf.write(path(i), audio, SR)
            print(f"  line {i + 1}: {len(audio) / SR:.2f}s", flush=True)

    parts, timing, t = [np.zeros(int(LEAD_IN * SR), np.float32)], [], LEAD_IN
    for i, line in enumerate(lines):
        if a.silent:
            x, segs = silent_line(line["text"], en_durs.get(i, 0.0))
        else:
            x, sr = sf.read(path(i), dtype="float32")
            assert sr == SR
            segs = segments(line["text"], x)
        if i:
            pause = SCENE_GAP if line["scene"] != lines[i - 1]["scene"] else GAP
            parts.append(np.zeros(int(pause * SR), np.float32))
            t += pause
        timing.append({"line": i, "scene": line["scene"], "text": line["text"],
                       "start": round(t, 3), "end": round(t + len(x) / SR, 3),
                       "segments": [{**s, "start": round(t + s["start"], 3), "end": round(t + s["end"], 3)}
                                    for s in segs]})
        parts.append(x)
        t += len(x) / SR
    parts.append(np.zeros(int(OUTRO * SR), np.float32))
    audio = np.concatenate(parts)
    peak = np.max(np.abs(audio))
    audio = audio * (0.89 / peak) if peak > 0 else audio
    sf.write(os.path.join(AUDIO, f"{stem}.wav"), audio, SR)
    total = len(audio) / SR
    with open(os.path.join(AUDIO, f"{stem}.timing.json"), "w", encoding="utf-8") as f:
        json.dump({"lang": a.lang, "script": a.script, "duration": round(total, 3), "voice": not a.silent, "lines": timing},
              f, ensure_ascii=False, indent=1)
    print(f"{stem}: {total:.1f}s, {len(lines)} lines")
    for line in timing:
        print(f"  {line['start']:6.2f}-{line['end']:6.2f} [{line['scene']}] "
              + " | ".join(f"{s['start']:.2f} {s['text'][:28]}" for s in line["segments"]))


if __name__ == "__main__":
    main()
