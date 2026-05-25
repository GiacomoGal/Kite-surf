# Kite-surf Video Pipeline

Personal pipeline for editing kite-surf footage into a cinematic highlight reel.

## Structure

```
raw/          Source footage (not committed)
scripts/      Python processing scripts
studio/       Remotion project for preview
```

## Scripts

| Script | Description |
|---|---|
| `detect_scenes.py` | Detects scene boundaries and action moments in raw footage |
| `build_highlight.py` | Assembles highlight reel v1 |
| `build_highlight_v2.py` | Cinematic edit — curated clip list, slow-mo on flights and direction changes, max 1:30 |
| `upscale.py` | Upscales clips to 1080p via ffmpeg + lanczos |

## How it works

1. Drop raw `.mp4` files into `raw/`
2. Run `detect_scenes.py` to identify timestamps worth keeping
3. Edit the `CLIPS` list in `build_highlight_v2.py` (source, start, end, label, speed)
4. Run `build_highlight_v2.py` — outputs clips to `highlight_v2/` and copies them to `studio/public/`
5. Open the Remotion studio for preview

## Slow-motion

Speed is set per-clip (`speed < 1.0`). The pipeline uses ffmpeg `minterpolate` (motion-compensated frame blending) for smooth slow-mo, with a simple `setpts` fallback if interpolation fails.

## Requirements

- Python 3.10+
- ffmpeg + ffprobe
- Node.js (for Remotion studio)
