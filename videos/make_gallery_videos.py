"""Encode official SI videos for Gallery.

Keep the original 1920x1080 composition. Only re-encode for web bitrate.
Never overwrite files in videos/supp_videos.
"""

from pathlib import Path
import subprocess

import imageio_ffmpeg

ROOT = Path(__file__).resolve().parent
FFMPEG = imageio_ffmpeg.get_ffmpeg_exe()
SRC = ROOT / "supp_videos"
OUT = ROOT / "gallery"

JOBS = [
    ("supplementary video 1.mp4", "hela_web.mp4", "encode"),
    ("supplementary video 2.mp4", "zebrafish_web.mp4", "encode"),
    ("supplementary video 3.mp4", "mouse_web.mp4", "encode"),
    ("supplementary video 4.mp4", "spines_web.mp4", "encode"),
    ("supplementary video 5.mp4", "neutrophils_web.mp4", "encode"),
]


def run(cmd):
    print("+", " ".join(cmd), flush=True)
    subprocess.run(cmd, check=True)


def encode(src, dst, crf="18", maxrate="4M", profile="baseline"):
    dst.parent.mkdir(parents=True, exist_ok=True)
    cmd = [
        FFMPEG, "-y", "-hide_banner", "-loglevel", "error",
        "-i", str(src),
        "-an",
        "-c:v", "libx264",
        "-preset", "fast",
        "-crf", crf,
        "-maxrate", maxrate,
        "-bufsize", "8M",
        "-profile:v", profile,
        "-level", "3.1",
        "-g", "30",
        "-pix_fmt", "yuv420p",
        "-movflags", "+faststart",
        str(dst),
    ]
    run(cmd)


def copy_web(src, dst):
    dst.parent.mkdir(parents=True, exist_ok=True)
    run([
        FFMPEG, "-y", "-hide_banner", "-loglevel", "error",
        "-i", str(src),
        "-c", "copy",
        "-movflags", "+faststart",
        str(dst),
    ])


def poster(src, dst):
    run([
        FFMPEG, "-y", "-hide_banner", "-loglevel", "error",
        "-ss", "0.2", "-i", str(src), "-frames:v", "1", str(dst),
    ])


def main(only=None):
    for name, dest, mode in JOBS:
        if only and dest not in only and name not in only:
            continue
        src = SRC / name
        dst = OUT / dest
        print("==", name, mode, flush=True)
        # Same mild web encode for every SI clip.
        encode(src, dst, crf="18", maxrate="4M", profile="baseline")
        poster(dst, dst.with_suffix(".png"))
        print(" ", dst.name, round(dst.stat().st_size / 1024 / 1024, 2), "MB", flush=True)


if __name__ == "__main__":
    import sys
    main(sys.argv[1:] or None)