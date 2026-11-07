# Kite-surf Video Pipeline

Personal pipeline for editing kite-surf footage into a cinematic highlight reel.

Agents start at [AGENTS.md](AGENTS.md). Parameters and the gitignore contract are in [docs/manuale-pipeline.md](docs/manuale-pipeline.md). The obligation map is [docs/obblighi/matrice-preservazione-2026-11-07.md](docs/obblighi/matrice-preservazione-2026-11-07.md).

## Structure

```
raw/            Source footage. The four *.mp4 files are tracked.
                .gitignore says "Keep raw and output".
scripts/        Python processing scripts
studio/         Remotion project for preview
highlight/      v1 manifest tracked; clip mp4 files ignored
highlight_v2/   v2 manifest tracked; clip mp4 files ignored
```

The tracked source name `vifdeo_1.mp4` is the spelling used by the clip lists.

Ignored intermediates, Remotion copies, and the two full-resolution masters are listed in `.gitignore` and restated in the manual.

## Scripts

| Script | Description |
|---|---|
| `detect_scenes.py` | Detects scene boundaries and action moments in raw footage |
| `build_highlight.py` | Assembles highlight reel v1 |
| `build_highlight_v2.py` | Cinematic edit — curated clip list, slow-mo on flights and direction changes, max 1:30 |
| `upscale.py` | Upscales clips to 1080p via ffmpeg + lanczos, or via Real-ESRGAN when that binary is selected |

## How it works

The highlight v2 sequence is the current operator procedure.

1. Drop raw `.mp4` files into `raw/`
2. Run `detect_scenes.py` to identify timestamps worth keeping
3. Edit the `CLIPS` list in `build_highlight_v2.py` (source, start, end, label, speed)
4. Run `build_highlight_v2.py` — outputs clips to `highlight_v2/` and copies them to `studio/public/`
5. Open the Remotion studio for preview

The v2 copy destination is `studio/public/highlight_v2/`. `build_highlight_v2.py` reads `raw/` directly. Step 2 stays in the procedure: it writes the scene clips, `scenes/manifest.json`, and the contact sheets used to choose timestamps.

`build_highlight.py` is the current v1 assembler, with its own `CLIPS` list. It writes `highlight/` and copies clips to `studio/public/highlight/`. The full-video path continues from `detect_scenes.py` through `upscale.py` into the `KitesurfVideo` composition. No script copies scene files into `studio/public/scenes/`, which is the path that composition reads.

The Python scripts resolve directories from their own file path. From the repository root:

```
python3 scripts/detect_scenes.py
python3 scripts/build_highlight.py
python3 scripts/build_highlight_v2.py
python3 scripts/upscale.py
```

They take no arguments. Extracts drop the audio track (`-an`).

The Remotion modules in `studio/src/data/` are static copies. The Python scripts do not rewrite them. `scenes.ts` notes an intended manifest-sync script; no such script is in this checkout. The static import is the current path.

From `studio/`:

- `npm start` runs `remotion studio`
- `npm run preview` runs `remotion preview`
- `npm run build` and `npm run render` run `remotion render KitesurfVideo out/kitesurf.mp4`

`build` and `render` target `KitesurfVideo` only. The studio also registers `HighlightReel` and `HighlightV2`. Preview of v2 is step 5.

## Slow-motion

Speed is set per-clip (`speed < 1.0`).

Highlight v2 uses ffmpeg `minterpolate` (motion-compensated frame blending) for smooth slow-mo, with a simple `setpts` fallback if interpolation fails.

Highlight v1 applies `setpts` and does not call `minterpolate`.

v2 keeps the rules in the script header: max 1:30, slow-mo on flights and direction changes, no repeated footage, no flash effects. v1 is a separate edit and its composition uses flash transitions.

## Real-ESRGAN

`upscale.py` prints `Install Real-ESRGAN for better quality: see README` when it does not select the AI path. The selection rule is:

- Binary name: `realesrgan-ncnn-vulkan`
- Search order: `PATH`, then `/usr/local/bin/realesrgan-ncnn-vulkan`, then `/root/realesrgan/realesrgan-ncnn-vulkan`
- A binary whose stderr contains `vkCreateInstance failed` is treated as unavailable
- When selected: model `realesrgan-x4plus`, scale `4`, then scale the reassembled video to height 1080
- Otherwise: ffmpeg lanczos to height 1080

The two absolute paths stay in the search on machines where those files are absent. This document does not name a download URL or an installer.

## Requirements

- Python 3.10+
- ffmpeg + ffprobe
- Node.js (for Remotion studio)

Real-ESRGAN is the optional AI branch above. The lanczos path does not require it.

## Evidence

[docs/prove/2026-11-07-ispezione-checkout.md](docs/prove/2026-11-07-ispezione-checkout.md) records the 2026-11-07 inspection, including commands that were not run. That note does not replace the procedures above, and the checkout alone is not a production render.
