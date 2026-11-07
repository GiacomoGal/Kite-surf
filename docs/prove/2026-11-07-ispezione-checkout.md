# Ispezione del checkout — 2026-11-07

Prova datata sul tree di partenza `0a47b6e` (`main`), repository Kite-surf. I documenti aggiunti dopo questa lettura non cambiano script, configurazione, lockfile, manifest JSON o media.

Il checkout non dimostra un render di produzione. Le misure sotto sono letture locali di file già presenti. Non sono un master ricodificato il 2026-11-07.

## Comandi eseguiti

Senza rete e senza scrittura di scene, clip, frame o `node_modules`.

- `ast.parse` in memoria sui quattro script in `scripts/`. Esito: sintassi accettata. Nessun `__pycache__` scritto. Non è un'esecuzione di `main()`.
- `ffprobe` in sola lettura (`-show_format`, `-show_streams`) sui quattro mp4 in `raw/`.
- Versioni locali degli strumenti presenti sulla VM di ispezione.
- Controllo di esistenza, senza crearli, dei due path assoluti cercati da `upscale.py`.
- Somma delle 32 durate letterali in `studio/src/data/scenes.ts`.

Strumenti visti su questa VM, fatto della VM e non un nuovo requisito del repository:

- Python 3.12.3. Il requisito scritto resta Python 3.10+.
- ffmpeg 6.1.1-3ubuntu5 in `/usr/bin/ffmpeg`.
- ffprobe 6.1.1-3ubuntu5 in `/usr/bin/ffprobe`.
- Node v22.23.4, npm 10.9.9.
- `realesrgan-ncnn-vulkan` assente dal `PATH`.
- `/usr/local/bin/realesrgan-ncnn-vulkan` assente.
- `/root/realesrgan/realesrgan-ncnn-vulkan` assente.

L'assenza dei due path su questa VM non toglie la ricerca scritta in `upscale.py`.

`studio/node_modules` non è nel checkout. Gli script npm non sono stati lanciati.

## Raw misurati

ffprobe, 2026-11-07. Codec video h264. Una traccia audio per file. Altezza 480.

| File | Byte | Pixel | `r_frame_rate` | Durata (s) |
|---|---:|---|---|---:|
| `raw/video_2.mp4` | 11226107 | 848×480 | 100/3 | 69.706304 |
| `raw/video_3.mp4` | 3126510 | 848×480 | 600/19 | 19.481542 |
| `raw/video_4.mp4` | 3115738 | 848×480 | 30/1 | 19.319002 |
| `raw/vifdeo_1.mp4` | 25136133 | 848×480 | 100/3 | 156.014875 |

Il commento in `scenes.ts` («portrait 612x1080», da 480p) non è una misura di questi raw. I file in `upscaled/` e `scenes/` non sono nel checkout: non sono stati misurati.

## Manifest già nel tree

Lettura dei file, non riesecuzione degli script.

- `highlight/manifest.json`: 13 clip, `total_duration` 54.18.
- `highlight_v2/manifest.json`: 17 clip, `total_duration` 89.77.
- `studio/src/data/scenes.ts`: 32 durate, somma 213.11 secondi (3:33.11). Coincide con il «3:33» del commit `4d2a146` come somma del manifest statico, non come file `studio/out/` ripresente.

## File di output assenti da HEAD

`0a47b6e` (2026-10-13) elimina:

| Path | Byte nel commit di rimozione |
|---|---:|
| `studio/out/highlight.mp4` | 68798374 |
| `studio/out/highlight_v2_web.mp4` | 53881419 |
| `studio/out/kitesurf_web.mp4` | 93080239 |

Non sono stati ripristinati. `.gitignore` non ignora questi tre nomi. Ignora `studio/out/kitesurf.mp4` e `studio/out/highlight_v2.mp4`. Il messaggio `c5a2400` cita quei master come 291 MB e 137 MB. Non rimisurati: non sono nel checkout.

## Comandi non eseguiti

Limite di questa prova. Non è una regola nuova del repository.

- `python3 scripts/detect_scenes.py`
- `python3 scripts/upscale.py`
- `python3 scripts/build_highlight.py`
- `python3 scripts/build_highlight_v2.py`
- `npm install` in `studio/`
- `npm start`, `npm run preview`, `npm run build`, `npm run render`
- Qualsiasi `remotion render` di `HighlightReel` o `HighlightV2`
- Real-ESRGAN
- Richieste di rete, deploy, VPS, servizi, API live, invii

Gli script di processing scrivono video e frame. Per questo la loro `main()` non è stata avviata durante l'ispezione.

## Segreti

Categorie cercate nei file di progetto: `.env`, chiavi API, token, password. Nessun file di quelle categorie. Nessun valore è riportato qui.

## Letture globali

Nel checkout non compaiono obblighi di lettura di istruzioni globali, di persona o di target. Non ne è stato rimosso alcuno.
