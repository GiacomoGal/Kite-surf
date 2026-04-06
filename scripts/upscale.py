#!/usr/bin/env python3
"""
Kite-surf Video Upscaler
Upscales scene clips from 480p to 1080p HD using Real-ESRGAN.
Processes frame-by-frame: extract → upscale → reassemble.
"""

import subprocess
import sys
import os
import shutil
import json
from pathlib import Path

SCENES_DIR = Path(__file__).parent.parent / "scenes"
UPSCALED_DIR = Path(__file__).parent.parent / "upscaled"
TEMP_DIR = Path(__file__).parent.parent / ".tmp_frames"

# Target resolution
TARGET_HEIGHT = 1080
# Real-ESRGAN scale factor (2x from 480p = 960p, then we pad/crop to 1080p)
# With 4x: 480 * 4 = 1920p, then downscale to 1080p for clean result
SCALE_FACTOR = 4
REALESRGAN_MODEL = "realesrgan-x4plus"


def check_realesrgan():
    """Check if realesrgan-ncnn-vulkan is available AND has GPU/Vulkan support."""
    binary = shutil.which("realesrgan-ncnn-vulkan")
    if not binary:
        for path in ["/usr/local/bin/realesrgan-ncnn-vulkan",
                     "/root/realesrgan/realesrgan-ncnn-vulkan"]:
            if os.path.exists(path):
                binary = path
                break

    if not binary:
        return None

    # Test if Vulkan/GPU actually works
    result = subprocess.run([binary, "-h"], capture_output=True, text=True)
    # Also do a quick test — vkCreateInstance fail means no GPU
    test = subprocess.run(
        [binary, "-i", "/dev/null", "-o", "/dev/null"],
        capture_output=True, text=True
    )
    if "vkCreateInstance failed" in test.stderr:
        return None  # No GPU — fall back to ffmpeg

    return binary


def extract_frames(video_path: Path, output_dir: Path) -> float:
    """Extract all frames from video, return fps."""
    output_dir.mkdir(parents=True, exist_ok=True)

    # Get fps
    cmd = [
        "ffprobe", "-v", "quiet", "-print_format", "json",
        "-show_streams", str(video_path)
    ]
    result = subprocess.run(cmd, capture_output=True, text=True)
    data = json.loads(result.stdout)
    vs = [s for s in data["streams"] if s["codec_type"] == "video"][0]
    fps = eval(vs["r_frame_rate"])

    # Extract frames
    cmd = [
        "ffmpeg", "-y", "-i", str(video_path),
        "-qscale:v", "2",
        str(output_dir / "frame_%06d.png")
    ]
    subprocess.run(cmd, capture_output=True)

    return fps


def upscale_frames(input_dir: Path, output_dir: Path, binary: str):
    """Upscale all frames using Real-ESRGAN."""
    output_dir.mkdir(parents=True, exist_ok=True)

    cmd = [
        binary,
        "-i", str(input_dir),
        "-o", str(output_dir),
        "-n", REALESRGAN_MODEL,
        "-s", str(SCALE_FACTOR),
        "-f", "png",
    ]
    subprocess.run(cmd)


def reassemble_video(frames_dir: Path, output_path: Path, fps: float):
    """Reassemble upscaled frames into video, scale to target 1080p."""
    cmd = [
        "ffmpeg", "-y",
        "-framerate", str(fps),
        "-i", str(frames_dir / "frame_%06d.png"),
        "-vf", f"scale=-2:{TARGET_HEIGHT}",
        "-c:v", "libx264",
        "-crf", "16",
        "-preset", "slow",
        "-pix_fmt", "yuv420p",
        str(output_path)
    ]
    subprocess.run(cmd, capture_output=True)


def upscale_ffmpeg_only(video_path: Path, output_path: Path):
    """Fallback: upscale using ffmpeg lanczos (no AI, but decent)."""
    cmd = [
        "ffmpeg", "-y",
        "-i", str(video_path),
        "-vf", f"scale=-2:{TARGET_HEIGHT}:flags=lanczos",
        "-c:v", "libx264",
        "-crf", "16",
        "-preset", "slow",
        "-pix_fmt", "yuv420p",
        str(output_path)
    ]
    subprocess.run(cmd, capture_output=True)


def main():
    UPSCALED_DIR.mkdir(exist_ok=True)

    realesrgan = check_realesrgan()
    use_ai = realesrgan is not None

    if use_ai:
        print(f"Using Real-ESRGAN: {realesrgan}")
    else:
        print("Real-ESRGAN not found — using ffmpeg lanczos upscaling")
        print("Install Real-ESRGAN for better quality: see README")

    # Find scene clips
    scenes = sorted(SCENES_DIR.glob("*_scene_*.mp4"))
    if not scenes:
        print("No scene clips found in scenes/. Run detect_scenes.py first.")
        sys.exit(1)

    print(f"\nUpscaling {len(scenes)} scenes to {TARGET_HEIGHT}p...\n")

    for i, scene_path in enumerate(scenes, 1):
        output_path = UPSCALED_DIR / scene_path.name
        print(f"[{i}/{len(scenes)}] {scene_path.name}")

        if use_ai:
            # AI upscale: extract → upscale → reassemble
            frames_in = TEMP_DIR / "input"
            frames_out = TEMP_DIR / "output"

            print("  Extracting frames...")
            fps = extract_frames(scene_path, frames_in)

            frame_count = len(list(frames_in.glob("*.png")))
            print(f"  Upscaling {frame_count} frames (x{SCALE_FACTOR})...")
            upscale_frames(frames_in, frames_out, realesrgan)

            print("  Reassembling video...")
            reassemble_video(frames_out, output_path, fps)

            # Cleanup temp
            shutil.rmtree(TEMP_DIR, ignore_errors=True)
        else:
            # Fallback: ffmpeg lanczos
            upscale_ffmpeg_only(scene_path, output_path)

        # Report size
        if output_path.exists():
            size_mb = output_path.stat().st_size / (1024 * 1024)
            print(f"  → {output_path.name} ({size_mb:.1f}MB)")

    print(f"\n=== Done: {len(scenes)} scenes upscaled to {UPSCALED_DIR}/ ===")


if __name__ == "__main__":
    main()
