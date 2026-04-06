#!/usr/bin/env python3
"""
Kite-surf Highlight v2 — Cinematic Edit
Max 1:30, slow-mo on flights and direction changes, no repeated footage,
maximum quality transitions. No flash effects.
"""

import subprocess
import json
from pathlib import Path

RAW_DIR = Path(__file__).parent.parent / "raw"
HIGHLIGHT_DIR = Path(__file__).parent.parent / "highlight_v2"
PUBLIC_DIR = Path(__file__).parent.parent / "studio" / "public" / "highlight_v2"

TARGET_HEIGHT = 1080

# CURATED CLIP LIST — every second is unique, no footage reused
# (source, start, end, label, speed)
# speed < 1.0 = slow motion
CLIPS = [
    # === SECTION 1: OPEN — Dramatic kite + close action ===

    # Kite sweeping across sky — establishing shot
    ("video_4.mp4",      0.0,   2.5,  "s1_kite_establish",   1.0),   # 2.5s

    # Kiter close to camera launching — SLOW MO for impact
    ("vifdeo_1.mp4",     0.5,   4.0,  "s1_close_launch",     0.5),   # → 7s

    # First direction change near shore — SLOW MO sferzata
    ("vifdeo_1.mp4",     5.0,   7.0,  "s1_sferzata_1",       0.5),   # → 4s

    # Ride away after change — normal speed, energy
    ("vifdeo_1.mp4",     7.5,  10.5,  "s1_ride_away",        1.0),   # 3s

    # === SECTION 2: BUILD — Varied perspectives, building rhythm ===

    # Riding mid-distance, kite visible
    ("vifdeo_1.mp4",    17.0,  21.0,  "s2_mid_ride",         1.0),   # 4s

    # Kite aerobatics cutaway — slight slow for beauty
    ("video_4.mp4",      5.0,   8.5,  "s2_kite_aero",        0.7),   # → 5s

    # Approaching shore, dynamic angle
    ("vifdeo_1.mp4",    30.0,  34.0,  "s2_approach",         1.0),   # 4s

    # Wide panoramic — different perspective (video_2)
    ("video_2.mp4",      0.0,   3.5,  "s2_panoramic",        1.0),   # 3.5s

    # Multiple kiters on water — unique wide shot
    ("vifdeo_1.mp4",    70.0,  75.0,  "s2_multi_kiters",     1.0),   # 5s

    # === SECTION 3: INTENSITY — Tighter cuts, rising energy ===

    # Quick audience reaction
    ("video_3.mp4",      0.5,   2.0,  "s3_audience",         1.0),   # 1.5s

    # Direction change with spray — SLOW MO sferzata
    ("vifdeo_1.mp4",    86.0,  89.0,  "s3_sferzata_2",       0.5),   # → 6s

    # Different riding angle from video_2
    ("video_2.mp4",     55.0,  59.0,  "s3_ride_alt",         1.0),   # 4s

    # === SECTION 4: CLIMAX — The flight ===

    # Kite spinning dramatic — SLOW MO buildup
    ("video_4.mp4",     11.0,  15.0,  "s4_kite_spin",        0.5),   # → 8s

    # SFERZATA before the flight — SLOW MO
    ("vifdeo_1.mp4",   134.0, 138.0,  "s4_pre_flight",       0.5),   # → 8s

    # THE FLIGHT — Maximum slow motion, the hero moment
    ("vifdeo_1.mp4",   138.0, 145.0,  "s4_the_flight",       0.4),   # → 17.5s

    # === SECTION 5: CLOSE — Gentle wind-down ===

    # Ride out after flight — normal speed
    ("vifdeo_1.mp4",   146.0, 149.0,  "s5_ride_out",         1.0),   # 3s

    # Kite finale against sky — SLOW MO beauty shot
    ("video_4.mp4",     16.0,  19.0,  "s5_kite_finale",      0.7),   # → 4.3s
]
# Estimated total: 2.5+7+4+3+4+5+4+3.5+5+1.5+6+4+8+8+17.5+3+4.3 ≈ 90s


def extract_clip(source: Path, start: float, end: float, output: Path, speed: float):
    """Extract and upscale a clip with optional speed change. Two-pass for speed."""
    duration = end - start

    if speed != 1.0:
        tmp_path = output.parent / f"_tmp_{output.name}"
        # Pass 1: extract raw segment at high quality
        cmd1 = [
            "ffmpeg", "-y",
            "-ss", f"{start:.3f}",
            "-i", str(source),
            "-t", f"{duration:.3f}",
            "-c:v", "libx264", "-crf", "10", "-preset", "fast", "-an",
            str(tmp_path)
        ]
        subprocess.run(cmd1, capture_output=True)

        # Pass 2: speed change + upscale with motion interpolation
        pts_factor = 1.0 / speed
        # Use minterpolate for smooth slow-mo (frame blending)
        vf = (
            f"setpts={pts_factor}*PTS,"
            f"minterpolate=fps=30:mi_mode=mci:mc_mode=aobmc:me_mode=bidir:vsbmc=1,"
            f"scale=-2:{TARGET_HEIGHT}:flags=lanczos"
        )
        cmd2 = [
            "ffmpeg", "-y",
            "-i", str(tmp_path),
            "-vf", vf,
            "-c:v", "libx264", "-crf", "14", "-preset", "slow",
            "-an", "-pix_fmt", "yuv420p",
            str(output)
        ]
        result = subprocess.run(cmd2, capture_output=True, text=True)

        # Fallback: if minterpolate fails, use simple setpts
        if not output.exists() or output.stat().st_size == 0:
            vf_simple = f"setpts={pts_factor}*PTS,scale=-2:{TARGET_HEIGHT}:flags=lanczos"
            cmd3 = [
                "ffmpeg", "-y",
                "-i", str(tmp_path),
                "-vf", vf_simple,
                "-c:v", "libx264", "-crf", "14", "-preset", "slow",
                "-an", "-pix_fmt", "yuv420p",
                str(output)
            ]
            subprocess.run(cmd3, capture_output=True)

        tmp_path.unlink(missing_ok=True)
    else:
        vf = f"scale=-2:{TARGET_HEIGHT}:flags=lanczos"
        cmd = [
            "ffmpeg", "-y",
            "-ss", f"{start:.3f}",
            "-i", str(source),
            "-t", f"{duration:.3f}",
            "-vf", vf,
            "-c:v", "libx264", "-crf", "14", "-preset", "slow",
            "-an", "-pix_fmt", "yuv420p",
            str(output)
        ]
        subprocess.run(cmd, capture_output=True)


def get_clip_duration(path: Path) -> float:
    cmd = [
        "ffprobe", "-v", "quiet",
        "-print_format", "json",
        "-show_format", str(path)
    ]
    result = subprocess.run(cmd, capture_output=True, text=True)
    data = json.loads(result.stdout)
    return float(data["format"]["duration"])


def main():
    HIGHLIGHT_DIR.mkdir(exist_ok=True)
    PUBLIC_DIR.mkdir(parents=True, exist_ok=True)

    manifest = []
    total_duration = 0.0

    print(f"Building {len(CLIPS)} clips for cinematic highlight v2...\n")

    for i, (source_name, start, end, label, speed) in enumerate(CLIPS, 1):
        source_path = RAW_DIR / source_name
        output_name = f"hl2_{i:02d}_{label}.mp4"
        output_path = HIGHLIGHT_DIR / output_name
        public_path = PUBLIC_DIR / output_name

        raw_duration = end - start
        expected_duration = raw_duration / speed

        speed_tag = f" [SLOW {speed}x]" if speed < 1.0 else ""
        print(f"  [{i:02d}/{len(CLIPS)}] {label}: {source_name} {start:.1f}-{end:.1f}s"
              f"{speed_tag} → ~{expected_duration:.1f}s")

        extract_clip(source_path, start, end, output_path, speed)

        # Copy to Remotion public dir
        subprocess.run(["cp", str(output_path), str(public_path)], capture_output=True)

        actual_duration = get_clip_duration(output_path)
        total_duration += actual_duration

        manifest.append({
            "file": output_name,
            "label": label,
            "source": source_name,
            "start": start,
            "end": end,
            "speed": speed,
            "duration": round(actual_duration, 3),
        })

        size_mb = output_path.stat().st_size / (1024 * 1024)
        print(f"           → {actual_duration:.1f}s, {size_mb:.1f}MB")

    # Save manifest
    manifest_path = HIGHLIGHT_DIR / "manifest.json"
    data = {
        "total_clips": len(manifest),
        "total_duration": round(total_duration, 2),
        "clips": manifest,
    }
    with open(manifest_path, "w") as f:
        json.dump(data, f, indent=2)

    print(f"\n{'='*60}")
    print(f"Highlight v2: {len(manifest)} clips, {total_duration:.1f}s")
    print(f"Target: ≤90s | Actual: {total_duration:.1f}s")
    if total_duration > 90:
        print(f"⚠ Over target by {total_duration - 90:.1f}s — trim needed")
    print(f"Manifest: {manifest_path}")


if __name__ == "__main__":
    main()
