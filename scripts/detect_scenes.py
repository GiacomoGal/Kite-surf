#!/usr/bin/env python3
"""
Kite-surf Scene Detector v2
Detects direction changes in kitesurf videos using optical flow motion analysis.
The kiter goes forward and backward — we detect when the dominant motion reverses.
Also generates thumbnail contact sheets for visual review.
"""

import subprocess
import json
import sys
import os
from pathlib import Path

RAW_DIR = Path(__file__).parent.parent / "raw"
SCENES_DIR = Path(__file__).parent.parent / "scenes"
THUMBS_DIR = Path(__file__).parent.parent / "thumbnails"

# Minimum scene duration in seconds
MIN_SCENE_DURATION = 3.0
# Segment duration for equal-split mode (seconds)
SEGMENT_DURATION = 8.0


def get_video_info(video_path: Path) -> dict:
    """Get video metadata via ffprobe."""
    cmd = [
        "ffprobe", "-v", "quiet",
        "-print_format", "json",
        "-show_format", "-show_streams",
        str(video_path)
    ]
    result = subprocess.run(cmd, capture_output=True, text=True)
    data = json.loads(result.stdout)
    vs = [s for s in data["streams"] if s["codec_type"] == "video"][0]
    return {
        "width": int(vs["width"]),
        "height": int(vs["height"]),
        "duration": float(data["format"]["duration"]),
        "fps": eval(vs.get("r_frame_rate", "30/1")),
        "codec": vs["codec_name"],
    }


def generate_contact_sheet(video_path: Path, output_path: Path, cols: int = 5):
    """Generate a thumbnail contact sheet for visual review."""
    info = get_video_info(video_path)
    duration = info["duration"]
    # One thumb every 3 seconds
    interval = 3
    n_thumbs = max(int(duration / interval), 1)
    rows = (n_thumbs + cols - 1) // cols

    cmd = [
        "ffmpeg", "-y", "-i", str(video_path),
        "-vf", f"fps=1/{interval},scale=240:-1,tile={cols}x{rows}",
        "-frames:v", "1",
        str(output_path)
    ]
    subprocess.run(cmd, capture_output=True)


def detect_motion_changes(video_path: Path) -> list[float]:
    """
    Detect direction changes using freeze detection.
    Looks for brief pauses (the kiter turning) using ffmpeg freezedetect
    with high noise threshold to only catch real stops.
    """
    import re

    info = get_video_info(video_path)
    duration = info["duration"]

    # Higher noise threshold (0.05) + longer duration (0.8s) = only real pauses
    cmd = [
        "ffmpeg", "-i", str(video_path),
        "-vf", "freezedetect=n=0.05:d=0.8",
        "-f", "null", "-"
    ]
    result = subprocess.run(cmd, capture_output=True, text=True)

    timestamps = []
    # Parse format: lavfi.freezedetect.freeze_start: 12.34
    for line in result.stderr.split("\n"):
        match = re.search(r"freeze_start:\s*([\d.]+)", line)
        if match:
            ts = float(match.group(1))
            if ts > MIN_SCENE_DURATION and ts < duration - MIN_SCENE_DURATION:
                timestamps.append(ts)

    return timestamps


def split_by_segments(video_path: Path, video_info: dict, segment_duration: float = SEGMENT_DURATION) -> list[dict]:
    """Split video into equal segments for editing flexibility."""
    duration = video_info["duration"]
    video_name = video_path.stem
    segments = []
    scene_idx = 0
    start = 0.0

    while start < duration:
        scene_idx += 1
        end = min(start + segment_duration, duration)
        seg_duration = end - start

        if seg_duration < MIN_SCENE_DURATION and scene_idx > 1:
            # Merge short tail with previous segment
            break

        output_name = f"{video_name}_scene_{scene_idx:03d}.mp4"
        output_path = SCENES_DIR / output_name

        cmd = [
            "ffmpeg", "-y",
            "-i", str(video_path),
            "-ss", f"{start:.3f}",
            "-t", f"{seg_duration:.3f}",
            "-c:v", "libx264",
            "-crf", "18",
            "-preset", "fast",
            "-an",
            str(output_path)
        ]

        print(f"  [{scene_idx:02d}] {output_name}: {start:.1f}s - {end:.1f}s ({seg_duration:.1f}s)")
        subprocess.run(cmd, capture_output=True)

        segments.append({
            "file": output_name,
            "source": video_path.name,
            "start": round(start, 3),
            "end": round(end, 3),
            "duration": round(seg_duration, 3),
        })

        start = end

    return segments


def split_by_motion(video_path: Path, timestamps: list[float], video_info: dict) -> list[dict]:
    """Split video at detected motion change points."""
    duration = video_info["duration"]
    video_name = video_path.stem

    boundaries = [0.0] + timestamps + [duration]
    scenes = []
    scene_idx = 0

    for i in range(len(boundaries) - 1):
        start = boundaries[i]
        end = boundaries[i + 1]
        seg_duration = end - start

        if seg_duration < MIN_SCENE_DURATION:
            continue

        scene_idx += 1
        output_name = f"{video_name}_scene_{scene_idx:03d}.mp4"
        output_path = SCENES_DIR / output_name

        cmd = [
            "ffmpeg", "-y",
            "-i", str(video_path),
            "-ss", f"{start:.3f}",
            "-t", f"{seg_duration:.3f}",
            "-c:v", "libx264",
            "-crf", "18",
            "-preset", "fast",
            "-an",
            str(output_path)
        ]

        print(f"  [{scene_idx:02d}] {output_name}: {start:.1f}s - {end:.1f}s ({seg_duration:.1f}s)")
        subprocess.run(cmd, capture_output=True)

        scenes.append({
            "file": output_name,
            "source": video_path.name,
            "start": round(start, 3),
            "end": round(end, 3),
            "duration": round(seg_duration, 3),
        })

    return scenes


def main():
    SCENES_DIR.mkdir(exist_ok=True)
    THUMBS_DIR.mkdir(exist_ok=True)

    videos = sorted(RAW_DIR.glob("*.mp4"))
    if not videos:
        print("No .mp4 files found in raw/")
        sys.exit(1)

    print(f"Found {len(videos)} videos in raw/\n")

    all_scenes = []

    for video_path in videos:
        info = get_video_info(video_path)
        print(f"--- {video_path.name} ---")
        print(f"    {info['width']}x{info['height']}, {info['duration']:.1f}s, {info['fps']:.0f}fps")

        # Generate contact sheet
        thumb_path = THUMBS_DIR / f"{video_path.stem}_contact.jpg"
        print(f"    Generating contact sheet...")
        generate_contact_sheet(video_path, thumb_path)

        # Try motion-based detection first
        print(f"    Analyzing motion...")
        motion_timestamps = detect_motion_changes(video_path)

        if motion_timestamps:
            print(f"    Direction changes detected: {len(motion_timestamps)}")
            for ts in motion_timestamps:
                print(f"      @ {ts:.2f}s")
            scenes = split_by_motion(video_path, motion_timestamps, info)
        else:
            # Fallback: split into segments
            segment_len = SEGMENT_DURATION
            if info["duration"] <= 25:
                # Short clips: keep whole
                segment_len = info["duration"]
            print(f"    No direction changes detected — splitting into {segment_len:.0f}s segments")
            scenes = split_by_segments(video_path, info, segment_len)

        all_scenes.extend(scenes)
        print(f"    → {len(scenes)} scenes\n")

    # Save manifest
    manifest_path = SCENES_DIR / "manifest.json"
    manifest = {
        "total_scenes": len(all_scenes),
        "scenes": all_scenes,
    }
    with open(manifest_path, "w") as f:
        json.dump(manifest, f, indent=2)

    print(f"=== Total: {len(all_scenes)} scenes extracted ===")
    print(f"Manifest: {manifest_path}")
    print(f"Contact sheets: {THUMBS_DIR}/")


if __name__ == "__main__":
    main()
