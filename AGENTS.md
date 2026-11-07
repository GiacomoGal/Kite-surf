# AGENTS.md — Kite-surf

Ingresso orientativo. Le procedure stanno nel README e nel manuale. Questo file dice l'ordine di lettura e i vincoli di tenuta. Non sostituisce quei testi.

## Leggere in ordine

1. [README.md](README.md) — procedura operatore, slow-motion, requisiti, Real-ESRGAN.
2. [docs/manuale-pipeline.md](docs/manuale-pipeline.md) — parametri, percorsi, composizioni, gitignore, esiti già registrati.
3. [docs/obblighi/matrice-preservazione-2026-11-07.md](docs/obblighi/matrice-preservazione-2026-11-07.md) — obbligo precedente e posizione attuale.
4. [docs/prove/2026-11-07-ispezione-checkout.md](docs/prove/2026-11-07-ispezione-checkout.md) — misure e comandi del 2026-11-07.

[CLAUDE.md](CLAUDE.md) è l'adattatore: rimanda qui.

## Scopo

Pipeline personale per montare footage di kite-surf in un highlight cinematografico. Processing Python in `scripts/`. Anteprima e render Remotion in `studio/`.

Sorgenti tracciate: `raw/video_2.mp4`, `raw/video_3.mp4`, `raw/video_4.mp4`, `raw/vifdeo_1.mp4`.

## Procedure correnti

Restano procedure:

- La sequenza highlight v2 del README: raw in `raw/`, `detect_scenes.py`, edit di `CLIPS`, `build_highlight_v2.py`, studio Remotion.
- L'assemblatore v1 `scripts/build_highlight.py`, con la propria lista `CLIPS`.
- Rilevamento scene e `upscale.py` per la composizione `KitesurfVideo`.
- Slow-motion v2 con `minterpolate` e fallback `setpts`. Slow-motion v1 con `setpts`.
- Regole v2: massimo 1:30, slow-mo su voli e cambi di direzione, footage non ripetuto, nessun flash.

Le liste clip normative sono i tuple `CLIPS` nei due script di build. I parametri sono nel manuale.

## Comandi

Dalla radice:

```
python3 scripts/detect_scenes.py
python3 scripts/upscale.py
python3 scripts/build_highlight.py
python3 scripts/build_highlight_v2.py
```

Da `studio/`:

```
npm start
npm run preview
npm run build
npm run render
```

`build` e `render` eseguono `remotion render KitesurfVideo out/kitesurf.mp4`. Le altre composizioni registrate sono `HighlightReel` e `HighlightV2`.

## Artefatti e path host

`.gitignore` tiene i raw e definisce intermedi, copie Remotion e i due master full-res oltre il limite di 100 MB. Il manuale ripete quella lista.

`upscale.py` cerca `realesrgan-ncnn-vulkan` su `PATH`, poi in `/usr/local/bin/realesrgan-ncnn-vulkan`, poi in `/root/realesrgan/realesrgan-ncnn-vulkan`. Quei path restano nella ricerca anche se su una macchina i file non ci sono.

## Letture fuori dal repository

In questo checkout non c'è un obbligo di lettura di file globali, di persona o di target. Non risulta alcun obbligo del genere da revocare.

## Segreti

Nel tree non ci sono file di segreti. Categorie assenti: `.env`, chiavi API, token, password. Nei documenti si scrivono categorie e path, mai valori.

## Aggiornare le istruzioni

Spostare un obbligo solo insieme alla matrice. Una procedura in uso resta nel README o nel manuale. Le prove datate non sostituiscono la procedura. Il checkout, da solo, non dimostra un render di produzione.
