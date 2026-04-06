#!/usr/bin/env python3
"""
Kite-surf Highlight Builder
Extracts curated clips from raw footage for a 60-second highlight reel.
Each clip is cut precisely, upscaled to 1080p, and tagged for the Remotion composition.
"""

import subprocess
import json
from pathlib import Path

RAW_DIR = Path(__file__).parent.parent / "raw"
HIGHLIGHT_DIR = Path(__file__).parent.parent / "highlight"
PUBLIC_DIR = Path(__file__).parent.parent / "studio" / "public" / "highlight"

TARGET_HEIGHT = 1080

# Curated clip list: (source_file, start_sec, end_sec, label, speed)
# speed: 1.0 = normal, 0.5 = slow-mo, 1.5 = fast
CLIPS = [
    # 1. OPEN — Kite close-up in sky, dramatic establishing (3s)
    ("video_4.mp4",     0.0,   3.0,  "kite_open",        1.0),

    # 2. HIT — Kiter close to camera, dynamic start (4s)
    ("vifdeo_1.mp4",    0.5,   4.5,  "close_start",      1.0),

    # 3. RIDE — First ride, water spray (4s)
    ("vifdeo_1.mp4",    5.0,   9.0,  "first_ride",       1.0),

    # 4. KITE CUTAWAY — Quick kite shot (2s)
    ("video_4.mp4",     7.0,   9.0,  "kite_cut1",        1.0),

    # 5. ACTION — Riding on water, energy (5s)
    ("vifdeo_1.mp4",   42.5,  47.5,  "mid_ride",         1.0),

    # 6. WIDE — Panoramic with kite and rider (3s)
    ("video_2.mp4",     0.0,   3.0,  "wide_panoramic",   1.0),

    # 7. CLOSE RIDING — Intense water action (4s)
    ("vifdeo_1.mp4",   53.0,  57.0,  "intense_ride",     1.0),

    # 8. AUDIENCE — Flash of people watching (1.5s)
    ("video_3.mp4",     0.5,   2.0,  "audience",         1.0),

    # 9. BUILD — Riding through waves, building to climax (5s)
    ("vifdeo_1.mp4",   85.5,  90.5,  "wave_ride",        1.0),

    # 10. KITE SPIN — Dynamic kite movement, slow-mo (~3.6s)
    ("video_4.mp4",    12.0,  14.5,  "kite_spin",        0.7),

    # 11. JUMP — THE MAIN EVENT — slow motion (~10s output from 6s raw)
    ("vifdeo_1.mp4",  138.0, 144.0,  "the_jump",         0.6),

    # 12. RIDE OUT — Post-jump riding, energetic (4s)
    ("vifdeo_1.mp4",  147.0, 151.0,  "ride_out",         1.0),

    # 13. CLOSE — Kite against sky, gentle slow fade (~5s)
    ("video_4.mp4",    15.0,  19.0,  "kite_finale",      0.8),
]
# Expected total: 3+4+4+2+5+3+4+1.5+5+3.6+10+4+5 = ~54s + transitions


def extract_clip(source: Path, start: float, end: float, output: Path, speed: float):
    """Extract and upscale a clip with optional speed change."""
    duration = end - start

    if speed != 1.0:
        # Two-pass: first extract segment, then apply speed + upscale
        tmp_path = output.parent / f"_tmp_{output.name}"
        # Pass 1: extract raw segment
        cmd1 = [
            "ffmpeg", "-y",
            "-ss", f"{start:.3f}",
            "-i", str(source),
            "-t", f"{duration:.3f}",
            "-c:v", "libx264", "-crf", "14", "-preset", "fast", "-an",
            str(tmp_path)
        ]
        subprocess.run(cmd1, capture_output=True)
        # Pass 2: apply speed change + upscale
        pts_factor = 1.0 / speed
        vf = f"setpts={pts_factor}*PTS,scale=-2:{TARGET_HEIGHT}:flags=lanczos"
        cmd2 = [
            "ffmpeg", "-y",
            "-i", str(tmp_path),
            "-vf", vf,
            "-c:v", "libx264", "-crf", "16", "-preset", "slow",
            "-an", "-pix_fmt", "yuv420p",
            str(output)
        ]
        subprocess.run(cmd2, capture_output=True)
        tmp_path.unlink(missing_ok=True)
    else:
        vf = f"scale=-2:{TARGET_HEIGHT}:flags=lanczos"
        cmd = [
            "ffmpeg", "-y",
            "-ss", f"{start:.3f}",
            "-i", str(source),
            "-t", f"{duration:.3f}",
            "-vf", vf,
            "-c:v", "libx264",
            "-crf", "16",
            "-preset", "slow",
            "-an",
            "-pix_fmt", "yuv420p",
            str(output)
        ]
        subprocess.run(cmd, capture_output=True)


def get_clip_duration(path: Path) -> float:
    """Get actual duration of rendered clip."""
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

    print(f"Building {len(CLIPS)} clips for highlight reel...\n")

    for i, (source_name, start, end, label, speed) in enumerate(CLIPS, 1):
        source_path = RAW_DIR / source_name
        output_name = f"hl_{i:02d}_{label}.mp4"
        output_path = HIGHLIGHT_DIR / output_name
        public_path = PUBLIC_DIR / output_name

        raw_duration = end - start
        expected_duration = raw_duration / speed

        print(f"  [{i:02d}] {label}: {source_name} {start:.1f}-{end:.1f}s "
              f"(speed {speed}x → ~{expected_duration:.1f}s)")

        extract_clip(source_path, start, end, output_path, speed)

        # Copy to public dir for Remotion
        subprocess.run(["cp", str(output_path), str(public_path)], capture_output=True)

        # Get actual duration
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
        print(f"         → {actual_duration:.1f}s, {size_mb:.1f}MB")

    # Save manifest
    manifest_path = HIGHLIGHT_DIR / "manifest.json"
    data = {
        "total_clips": len(manifest),
        "total_duration": round(total_duration, 2),
        "clips": manifest,
    }
    with open(manifest_path, "w") as f:
        json.dump(data, f, indent=2)

    print(f"\n=== Highlight reel: {len(manifest)} clips, {total_duration:.1f}s total ===")
    print(f"Target: 60s | Actual: {total_duration:.1f}s")
    print(f"Manifest: {manifest_path}")


if __name__ == "__main__":
    main()
