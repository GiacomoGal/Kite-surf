# Matrice di preservazione degli obblighi — 2026-11-07

Mappa redatta prima del completamento dei documenti, sul tree `0a47b6e` (`main`). Ogni riga è un obbligo o un dato operativo già scritto nel checkout. La colonna «Posizione nuova» è dove quell'obbligo resta in vigore dopo questo aggiornamento documentale.

Nessuna procedura in uso è stata spostata in una sezione storica per accorciare i testi. Le prove in `docs/prove/` registrano misure e comandi; non sostituiscono la procedura.

Verifica di chiusura: per ogni ID, la posizione nuova esiste e contiene l'obbligo. L'esito è in fondo a questo file.

| ID | Obbligo preesistente | Fonte | Posizione nuova |
|---|---|---|---|
| OB-R01 | Titolo «Kite-surf Video Pipeline» | `README.md` (7437d66) | `README.md` titolo |
| OB-R02 | Pipeline personale per montare footage kite-surf in un highlight cinematografico | `README.md` | `README.md` apertura; `AGENTS.md` scopo |
| OB-R03 | `raw/` è la cartella del footage sorgente | `README.md` struttura | `README.md` struttura; manuale «Percorsi» |
| OB-R04 | Incidentale «(not committed)» sul raw | `README.md` struttura | Corretto: i quattro mp4 sono tracciati e `.gitignore` dice «Keep raw and output». L'affermazione falsa non è più un obbligo. Nessun divieto nuovo sui raw |
| OB-R05 | `scripts/` contiene gli script Python di processing | `README.md` | `README.md`; manuale |
| OB-R06 | `studio/` è il progetto Remotion di anteprima | `README.md` | `README.md`; manuale «Studio Remotion» |
| OB-R07 | `detect_scenes.py` rileva i confini di scena e i momenti di azione nel raw | `README.md` tabella | `README.md` tabella; manuale «Rilevamento scene» |
| OB-R08 | `build_highlight.py` assembla l'highlight reel v1 | `README.md` tabella | `README.md` tabella; manuale «Procedura highlight v1» |
| OB-R09 | `build_highlight_v2.py`: edit curato, slow-mo su voli e cambi di direzione, massimo 1:30 | `README.md` tabella e header dello script | `README.md` tabella e slow-motion; manuale «Procedura highlight v2» |
| OB-R10 | `upscale.py` porta le clip a 1080p con ffmpeg e lanczos | `README.md` tabella | `README.md` tabella; manuale «Upscale» (il ramo lanczos resta) |
| OB-R11 | Mettere i `.mp4` raw in `raw/` | `README.md` passo 1 | `README.md` passo 1; manuale procedura v2 |
| OB-R12 | Eseguire `detect_scenes.py` per scegliere i timestamp | `README.md` passo 2 | `README.md` passo 2; manuale. Resta un passo della procedura anche se v2 legge `raw/` |
| OB-R13 | Editare `CLIPS` in `build_highlight_v2.py` (source, start, end, label, speed) | `README.md` passo 3 | `README.md` passo 3; manuale. La lista normativa resta nello script |
| OB-R14 | Eseguire `build_highlight_v2.py`: clip in `highlight_v2/` e copia in `studio/public/` | `README.md` passo 4 | `README.md` passo 4. Il manuale precisa la sottocartella `studio/public/highlight_v2/` |
| OB-R15 | Aprire Remotion studio per l'anteprima | `README.md` passo 5 | `README.md` passo 5; `npm start` nel manuale |
| OB-R16 | La velocità è per clip (`speed < 1.0`) | `README.md` slow-motion | `README.md`; manuale v1 e v2 |
| OB-R17 | Lo slow-mo usa ffmpeg `minterpolate` (frame blending compensato sul moto) | `README.md` | `README.md` ambito v2; manuale filtro v2 |
| OB-R18 | Fallback `setpts` se l'interpolazione fallisce | `README.md` | `README.md`; manuale v2 |
| OB-R19 | Python 3.10+ | `README.md` requisiti | `README.md` requisiti |
| OB-R20 | ffmpeg e ffprobe | `README.md` requisiti | `README.md` requisiti |
| OB-R21 | Node.js per lo studio Remotion | `README.md` requisiti | `README.md` requisiti |
| OB-G01 | Ignorare `scenes/` | `.gitignore` | Manuale «Gitignore». File non modificato |
| OB-G02 | Ignorare `upscaled/` | `.gitignore` | Manuale «Gitignore» |
| OB-G03 | Ignorare `thumbnails/` | `.gitignore` | Manuale «Gitignore» |
| OB-G04 | Ignorare `.tmp_frames/` | `.gitignore` | Manuale «Gitignore» |
| OB-G05 | Ignorare `studio/public/scenes/`, descritte dal commento come copie Remotion delle scene upscalate | `.gitignore` | Manuale «Gitignore» e «Studio» |
| OB-G06 | Ignorare `studio/node_modules/` | `.gitignore` | Manuale «Gitignore» |
| OB-G07 | Ignorare `studio/dist/` | `.gitignore` | Manuale «Gitignore» |
| OB-G08 | Tenere raw e output («Keep raw and output») | `.gitignore` | `README.md` struttura; manuale |
| OB-G09 | `analysis/`: frame di analisi scena, rigenerabili | `.gitignore` | Manuale «Gitignore». Nessuno script attuale scrive quella cartella; la regola resta |
| OB-G10 | `highlight/*.mp4` rigenerabili da `raw/` + `manifest.json` | `.gitignore` | Manuale «Gitignore» |
| OB-G11 | `highlight_v2/*.mp4` rigenerabili da `raw/` + `manifest.json` | `.gitignore` | Manuale «Gitignore» |
| OB-G12 | Ignorare `studio/public/highlight/` | `.gitignore` | Manuale |
| OB-G13 | Ignorare `studio/public/highlight_v2/` | `.gitignore` | Manuale |
| OB-G14 | `studio/out/kitesurf.mp4` resta locale: master oltre il limite file GitHub di 100 MB | `.gitignore` | Manuale «Gitignore» |
| OB-G15 | `studio/out/highlight_v2.mp4` resta locale, stesso limite | `.gitignore` | Manuale «Gitignore» |
| OB-C01 | Le versioni `_web` restano tracciate | messaggio `c5a2400` | Manuale «Esiti registrati». `.gitignore` non le esclude. In HEAD, dopo `0a47b6e`, i file non ci sono. Questa documentazione non cambia quella regola e non ripristina i binari |
| OB-C02 | 32 scene dai 4 raw | messaggio `4d2a146`; `studio/src/data/scenes.ts` | Manuale «Manifest statici»; prova del 2026-11-07 (32 durate, somma 213,11 s) |
| OB-C03 | Render finale citato 1080×1920, portrait, 3:33, compresso per il web | messaggio `4d2a146` | Manuale studio (canvas 1080×1920) ed «Esiti registrati» |
| OB-C04 | Reel v1 da circa 54 s, clip curate, slow-mo sul salto 0,6× e sui kite 0,7–0,8×, quattro transizioni | messaggio `6b3a05a`; script e `HighlightReel.tsx` | Manuale v1. Il manifest committato conta 13 clip e 54,18 s |
| OB-C05 | v2: 17 clip uniche, nessuno spezzone ripetuto, slow-mo 0,4× sul volo, 0,5× sulle sferzate, 0,7× sul kite, sei transizioni, cinque sezioni, master CRF16 e web CRF22 da circa 52 MB | messaggio `e920e37`; header e `CLIPS` di `build_highlight_v2.py` | Manuale v2 ed «Esiti registrati». Il pass CRF22 non è in uno script: resta un esito registrato, non una procedura inventata |
| OB-C06 | Dimensioni citate dei master assenti: `kitesurf.mp4` 291 MB, `highlight_v2.mp4` 137 MB | messaggio `c5a2400` | Manuale «Esiti registrati». Non rimisurate il 2026-11-07 |
| OB-C07 | Rimozione dal tree di `studio/out/highlight.mp4`, `studio/out/highlight_v2_web.mp4`, `studio/out/kitesurf_web.mp4` | `0a47b6e` (2026-10-13) | Prova e manuale «Esiti registrati». Non è una regola nuova di ignore |
| OB-S01 | Il detector descrive l'analisi del moto; il percorso eseguito è `freezedetect` | docstring e `detect_motion_changes` | Manuale «Rilevamento scene» |
| OB-S02 | Generare contact sheet per la revisione visiva | `detect_scenes.py` | Manuale: ogni 3 s, 5 colonne, scala 240, `thumbnails/{stem}_contact.jpg` |
| OB-S03 | Durata minima scena 3,0 s; segmento di fallback 8,0 s | costanti dello script | Manuale |
| OB-S04 | `freezedetect=n=0.05:d=0.8`; timestamp interni ai margini di 3 s | `detect_scenes.py` | Manuale |
| OB-S05 | Senza cambi di moto, se la durata è ≤ 25 s la clip resta intera | `detect_scenes.py` | Manuale |
| OB-S06 | Il commento del tail parla di merge; il codice fa `break` e non riscrive il segmento precedente | `split_by_segments` | Manuale, entrambi i fatti |
| OB-S07 | Estrazione scene: libx264, CRF 18, preset fast, senza audio | `detect_scenes.py` | Manuale |
| OB-S08 | Uscita 1 se in `raw/` non ci sono `.mp4` | `detect_scenes.py` | Manuale |
| OB-S09 | Manifest `scenes/manifest.json` con `total_scenes` e `scenes` | `detect_scenes.py` | Manuale |
| OB-S10 | Upscale da 480p a 1080p; percorso AI a frame, poi riassemblaggio | docstring `upscale.py` | Manuale «Upscale» |
| OB-S11 | Binario `realesrgan-ncnn-vulkan`; ricerca su `PATH`, `/usr/local/bin/realesrgan-ncnn-vulkan`, `/root/realesrgan/realesrgan-ncnn-vulkan`; `vkCreateInstance failed` seleziona il fallback | `check_realesrgan` | `README.md` «Real-ESRGAN»; manuale. I path assoluti restano anche se il file non è sulla macchina |
| OB-S12 | Modello `realesrgan-x4plus`, scala 4 eseguita, poi altezza 1080. Il commento cita anche un'ipotesi 2× non assegnata | `upscale.py` | `README.md` (scala 4); manuale (scala 4 e commento 2×) |
| OB-S13 | Se il binario non è selezionato: messaggio che rimanda al README e fallback lanczos | `upscale.py` | `README.md` sezione Real-ESRGAN, che prima mancava |
| OB-S14 | Upscale solo di `scenes/*_scene_*.mp4`; altrimenti uscita 1 e invito a eseguire `detect_scenes.py` | `upscale.py` | Manuale |
| OB-S15 | Riassemblaggio e fallback: libx264, CRF 16, preset slow, `yuv420p`, `scale=-2:1080` | `upscale.py` | Manuale |
| OB-S16 | v1: reel da 60 secondi, taglio preciso, upscale a 1080p, clip pronte per Remotion | docstring `build_highlight.py` | Manuale v1. Il manifest registrato è 54,18 s; lo script stampa il confronto con 60 s |
| OB-S17 | Commento velocità v1: 1,0 normale, 0,5 slow-mo, 1,5 veloce | `build_highlight.py` | Manuale. I valori usati nella lista attuale sono quelli dei tuple, non solo i tre esempi |
| OB-S18 | v1 con `speed != 1`: due passaggi, `setpts`, nessun `minterpolate` | `build_highlight.py` | `README.md` slow-motion; manuale |
| OB-S19 | Encode v1: estrazione CRF 14 preset fast; uscita CRF 16 preset slow, lanczos, senza audio, `yuv420p` | `build_highlight.py` | Manuale |
| OB-S20 | v2: massimo 1:30, slow-mo su voli e cambi di direzione, footage non ripetuto, nessun flash | docstring `build_highlight_v2.py` | `README.md`; manuale. v1 è un edit diverso e il flash lo usa |
| OB-S21 | Filtro v2: `setpts`, poi `minterpolate=fps=30:mi_mode=mci:mc_mode=aobmc:me_mode=bidir:vsbmc=1`, poi lanczos | `build_highlight_v2.py` | Manuale |
| OB-S22 | Fallback v2 se l'output manca o ha dimensione 0: solo `setpts` e lanczos | `build_highlight_v2.py` | `README.md`; manuale |
| OB-S23 | v2 avvisa se la durata totale supera 90 s | `build_highlight_v2.py` | Manuale. Il manifest committato è 89,77 s |
| OB-S24 | Copia v1 in `studio/public/highlight/`; copia v2 in `studio/public/highlight_v2/` | i due script di build | Manuale; frase aggiunta nel README dopo il passo 4 |
| OB-S25 | Nomi `hl_{nn}_{label}.mp4` e `hl2_{nn}_{label}.mp4` | i due script | Manuale |
| OB-S26 | Script npm: `start` = `remotion studio`; `preview` = `remotion preview`; `build` e `render` = `remotion render KitesurfVideo out/kitesurf.mp4` | `studio/package.json` | `README.md`; manuale. `build`/`render` restano sulla sola composizione `KitesurfVideo` |
| OB-S27 | Pacchetto privato `kitesurf-studio` 1.0.0; Remotion fissato a 4.0.261 | `studio/package.json` | Manuale |
| OB-S28 | `Config.setVideoImageFormat("jpeg")` e `Config.setOverwriteOutput(true)` | `studio/remotion.config.ts` | Manuale |
| OB-S29 | Composizioni `KitesurfVideo`, `HighlightReel`, `HighlightV2`; 1080×1920; 30 fps; durata = somma delle durate del manifest statico | `studio/src/Root.tsx` | Manuale |
| OB-S30 | File statici: `scenes/{file}`, `highlight/{file}`, `highlight_v2/{file}` | le tre composizioni | Manuale |
| OB-S31 | Schermate vuote: «Run detect_scenes.py first», «Run build_highlight.py first», «Run build_highlight_v2.py first» | le tre composizioni | Manuale |
| OB-S32 | Transizioni v1 per etichetta (WhipPan, FlashCut, ZoomPunch, CrossDissolve) e durate 20 / 6 / 10 frame, fade in 15, fade finale 20 | `HighlightReel.tsx` | Manuale v1 |
| OB-S33 | Transizioni v2 senza flash: CrossDissolve, ZoomPush, SlideWipe, BlurDissolve, ScaleBack, DipToBlack, con la mappa per etichetta; fade in 30 frame, fade out 45 | `HighlightV2.tsx` | Manuale v2 |
| OB-S34 | Video intero: ciclo Crossfade, Zoom, Flash; 15 frame di transizione | `KitesurfVideo.tsx` e i tre effect | Manuale |
| OB-S35 | I manifest Remotion sono import statici. Il commento in `scenes.ts` prevede uno script di sync; nel checkout quello script non c'è | `studio/src/data/scenes.ts` | `README.md`; manuale. L'import statico è la procedura. Lo script assente resta un'intenzione annotata |
| OB-S36 | Commento «portrait 612x1080 (upscaled from 480p)» | `scenes.ts` | Manuale: è il commento del file. La prova ffprobe sui raw misura 848×480. Gli upscale non sono nel checkout, quindi 612×1080 non è una misura di questa ispezione |
| OB-S37 | Gli estrattori usano `-an` | i quattro script Python | Manuale. I raw misurati hanno una traccia audio |
| OB-S38 | `objectFit: cover` sul video nelle tre composizioni | composizioni | Manuale |
| OB-S39 | Il commento del crossfade parla di overlap; l'aritmetica dei frame accoda le `Sequence` | `CrossfadeTransition.tsx`, composizioni | Manuale, entrambi i fatti |
| OB-S40 | Il sorgente si chiama `vifdeo_1.mp4` | git, `CLIPS`, manifest | `README.md`; manuale. Lo spelling è quello usato dalle liste |
| OB-S41 | Gli script non hanno argomenti: cartelle e liste sono nel sorgente | i quattro script | Manuale |
| OB-S42 | Nel percorso AI, `.tmp_frames` è cancellato dopo ogni scena | `upscale.py` | Manuale |
| OB-S43 | Estrazione frame AI: PNG, `qscale:v 2` | `upscale.py` | Manuale |
| OB-H01 | I due path assoluti di Real-ESRGAN | `upscale.py` | `README.md`; manuale; `AGENTS.md`. Assenti su questa VM il 2026-11-07: l'istruzione di ricerca resta |
| OB-H02 | Obblighi di lettura globale, persona o target | assenti in tutto il checkout ispezionato | `AGENTS.md`; `CLAUDE.md`. Nessuno è stato revocato perché nessuno era scritto |

## Verifica del 2026-11-07

Controllo eseguito sui documenti di questo aggiornamento, dopo la scrittura: ogni ID da OB-R01 a OB-H02 ha una posizione nuova nella tabella e il testo collegato contiene il fatto (comando, path, parametro o esito). I file di codice, `.gitignore`, i lockfile, i manifest JSON e i media non sono stati modificati.

La verifica non è un render. Il dettaglio dei comandi eseguiti e non eseguiti è in `docs/prove/2026-11-07-ispezione-checkout.md`.
