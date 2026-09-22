"""Encode a rendered master for the site and cut its poster.

    ~/.venvs/intro-video/Scripts/python.exe publish.py en [--poster 2.2] [--copy]

Reads out/alexey-<lang>/master-alexey-<lang>.mp4 and writes intro-<lang>.mp4
(H.264 CRF 28 in TV range BT.709, AAC 128k, faststart, about 8 MB a
minute, near the first version) and intro-<lang>.jpg next to it. --copy puts both in public/video/,
which is all the landing's intro-video.tsx reads.
"""
import argparse
import os
import shutil
import subprocess

import imageio_ffmpeg

HERE = os.path.dirname(os.path.abspath(__file__))
PUBLIC = os.path.normpath(os.path.join(HERE, "..", "..", "public", "video"))
FF = imageio_ffmpeg.get_ffmpeg_exe()

ap = argparse.ArgumentParser()
ap.add_argument("lang", choices=["en", "fr"])
ap.add_argument("--audio", help="the recording's name (default alexey-<lang>)")
ap.add_argument("--poster", type=float, default=2.2, help="second of the video to use as the poster")
ap.add_argument("--crf", default="28")
ap.add_argument("--copy", action="store_true")
a = ap.parse_args()
stem = a.audio or f"alexey-{a.lang}"
out = os.path.join(HERE, "out", stem)
master = os.path.join(out, f"master-{stem}.mp4")
video = os.path.join(out, f"intro-{a.lang}.mp4")
poster = os.path.join(out, f"intro-{a.lang}.jpg")

# Screenshots are full-range; video players expect TV range, BT.709. scale reads
# the master's own range and matrix, so this is right for either kind of master.
TV = ["-vf", "scale=out_range=tv:out_color_matrix=bt709,format=yuv420p", "-colorspace", "bt709",
      "-color_primaries", "bt709", "-color_trc", "bt709", "-color_range", "tv"]
subprocess.run([FF, "-y", "-v", "error", "-i", master, *TV, "-c:v", "libx264", "-preset", "slow", "-crf", a.crf,
                "-c:a", "aac", "-b:a", "128k", "-movflags", "+faststart", video], check=True)
subprocess.run([FF, "-y", "-v", "error", "-ss", str(a.poster), "-i", master, "-frames:v", "1",
                "-vf", "scale=1280:-2", "-q:v", "4", poster], check=True)
for f in (video, poster):
    print(f"{os.path.basename(f)}: {os.path.getsize(f) / 1e6:.2f} MB")
if a.copy:
    for f in (video, poster):
        shutil.copy2(f, os.path.join(PUBLIC, os.path.basename(f)))
    print("copied to", PUBLIC)
