"""Make web-embeddable demo clips.

Policy (grain / pixel visibility first):
1. Prefer integer neighbor downsampling over bitrate caps.
   Noise is almost incompressible; a maxrate ceiling crushes grain first.
2. Encode with x264 tune=grain + moderate CRF, no maxrate.
3. Same settings for Raw / DeepPhD / GT in a scene (never crush clean
   lanes harder than noisy Raw).
"""

from pathlib import Path
import re
import subprocess
import sys

import imageio_ffmpeg

ROOT = Path(__file__).resolve().parent
FFMPEG = imageio_ffmpeg.get_ffmpeg_exe()

# Downsample-first, then near-lossless-ish encode (no bitrate cap).
CRF = "14"
PRESET = "slow"
PROFILE = "high"
TUNE = "grain"
# Keep ~512-class resolution (revert from TARGET_MAX=400 which looked too soft).
TARGET_MAX = 520


JOBS = [
    {
        "scene": "hela",
        "duration": None,
        "raw": ROOT / "Hela" / "Raw_ds8.mp4",
        "phd": ROOT / "Hela" / "DeepPhD_ds8.mp4",
        "ref": ROOT / "Hela" / "GT_ds8.mp4",
    },
    {
        "scene": "zebrafish",
        "duration": 12,
        "fps": 25,
        "raw": ROOT / "Zebrafish" / "Raw_MC-RGB.mp4",
        "phd": ROOT / "Zebrafish" / "Denoised_MC-RGB.mp4",
    },
    {
        "scene": "mouse",
        "duration": 12,
        "fps": 30,
        "raw": ROOT / "Mouse" / "fig4-Raw-crop-RGB.mp4",
        "phd": ROOT / "Mouse" / "fig4-DeepPhD-16bit_crop-RGB.mp4",
    },
    {
        "scene": "spines",
        "start": 5,
        "duration": 12,
        "fps": 25,
        "raw": ROOT / "Dendritic spines" / "Raw-fig5_full-1.mp4",
        "phd": ROOT / "Dendritic spines" / "DeepPhD-fig5_full-1.mp4",
        "ref": ROOT / "Dendritic spines" / "HighSNR-5_full.mp4",
    },
    {
        "scene": "neutrophils",
        "start": 20,
        "duration": 12,
        "fps": 20,
        "raw": ROOT / "Neutrophils" / "Raw_01_crop-colored.mp4",
        "phd": ROOT / "Neutrophils" / "DeepPhD_01_crop-colored.mp4",
        "ref": ROOT / "Neutrophils" / "High_SNR_01_crop-colored.mp4",
    },
]


def run(cmd):
    print("+", " ".join(cmd), flush=True)
    subprocess.run(cmd, check=True)


def probe_wh(src):
    r = subprocess.run(
        [FFMPEG, "-hide_banner", "-i", str(src)],
        capture_output=True,
        text=True,
        encoding="utf-8",
        errors="replace",
    )
    m = re.search(r"(\d{2,5})x(\d{2,5})", r.stderr or "")
    if not m:
        raise RuntimeError(f"Cannot probe size: {src}")
    return int(m.group(1)), int(m.group(2))


def pick_tile(width, height, target=TARGET_MAX):
    """Smallest power-of-two tile so max(side) <= target (or tile=1)."""
    m = max(width, height)
    tile = 1
    while m / tile > target and tile < 16:
        tile *= 2
    return tile


def tile_filter(factor):
    if factor <= 1:
        return None
    steps = []
    n = 1
    while n < factor:
        steps.append("scale=iw/2:ih/2:flags=neighbor")
        n *= 2
    steps.append("crop=trunc(iw/2)*2:trunc(ih/2)*2:0:0")
    return ",".join(steps)


def x264_args():
    return [
        "-c:v", "libx264",
        "-preset", PRESET,
        "-tune", TUNE,
        "-crf", CRF,
        "-profile:v", PROFILE,
        "-level", "4.1",
        "-g", "30",
        "-pix_fmt", "yuv420p",
        "-movflags", "+faststart",
    ]


def encode(src, dst, duration, tile=1, start=0, fps=None):
    dst.parent.mkdir(parents=True, exist_ok=True)
    cmd = [FFMPEG, "-y", "-hide_banner", "-loglevel", "error", "-i", str(src)]
    if start:
        cmd += ["-ss", str(start)]
    if duration:
        cmd += ["-t", str(duration)]
    cmd += ["-an"]
    filters = []
    vf = tile_filter(tile)
    if vf:
        filters.append(vf)
    if fps:
        filters.append(f"fps={fps}")
    if filters:
        cmd += ["-vf", ",".join(filters)]
    cmd += x264_args()
    cmd.append(str(dst))
    run(cmd)


def poster(src, dst):
    run([
        FFMPEG, "-y", "-hide_banner", "-loglevel", "error",
        "-ss", "0.2", "-i", str(src), "-frames:v", "1", str(dst),
    ])


def make_stack(out, has_ref):
    raw = out / "raw_web.mp4"
    phd = out / "deepphd_web.mp4"
    ref = out / "ref_web.mp4"
    dst = out / "stack_web.mp4"
    inputs = [raw, phd] + ([ref] if has_ref else [])
    for p in inputs:
        if not p.exists():
            raise FileNotFoundError(p)
    n = len(inputs)
    cmd = [FFMPEG, "-y", "-hide_banner", "-loglevel", "error"]
    for p in inputs:
        cmd += ["-i", str(p)]
    parts = []
    for i in range(n):
        parts.append(
            f"[{i}:v]scale=trunc(iw/2)*2:trunc(ih/2)*2:flags=neighbor,setsar=1,format=yuv420p[v{i}]"
        )
    parts.append("".join(f"[v{i}]" for i in range(n)) + f"hstack=inputs={n}[out]")
    cmd += [
        "-filter_complex", ";".join(parts),
        "-map", "[out]",
        "-an",
    ] + x264_args() + [str(dst)]
    run(cmd)
    return dst


def encode_scene(job, out, tile):
    start = job.get("start", 0)
    fps = job.get("fps")
    encode(job["raw"], out / "raw_web.mp4", job["duration"], tile=tile, start=start, fps=fps)
    encode(job["phd"], out / "deepphd_web.mp4", job["duration"], tile=tile, start=start, fps=fps)
    if job.get("ref"):
        encode(job["ref"], out / "ref_web.mp4", job["duration"], tile=tile, start=start, fps=fps)


def main(only=None, stack_only=False, do_stack=False):
    for job in JOBS:
        if only and job["scene"] not in only:
            continue
        out = ROOT / "demo" / job["scene"]
        print("==", job["scene"], flush=True)
        if not stack_only:
            streams = [job["raw"], job["phd"]] + ([job["ref"]] if job.get("ref") else [])
            sizes = [probe_wh(p) for p in streams]
            max_w = max(w for w, _ in sizes)
            max_h = max(h for _, h in sizes)
            tile = pick_tile(max_w, max_h)
            print(
                f"  source {max_w}x{max_h} -> tile={tile} "
                f"(~{max_w // tile}x{max_h // tile}), crf={CRF}, tune={TUNE}, no maxrate",
                flush=True,
            )
            encode_scene(job, out, tile)
            poster(out / "deepphd_web.mp4", out / "poster.png")
            if job.get("ref"):
                poster(out / "ref_web.mp4", out / "poster_ref.png")
            if (out / "raw_web.mp4").exists():
                poster(out / "raw_web.mp4", out / "poster_raw.png")
        if do_stack or stack_only:
            has_ref = bool(job.get("ref")) and (out / "ref_web.mp4").exists()
            make_stack(out, has_ref)
        for f in sorted(out.iterdir()):
            if f.name == "stack_web.mp4" and not (do_stack or stack_only):
                continue
            print(" ", f.name, round(f.stat().st_size / 1024 / 1024, 2), "MB", flush=True)


if __name__ == "__main__":
    args = sys.argv[1:]
    stack_only = "--stack-only" in args
    do_stack = "--stack" in args
    args = [a for a in args if a not in ("--stack-only", "--stack")]
    main(args or None, stack_only=stack_only, do_stack=do_stack)
