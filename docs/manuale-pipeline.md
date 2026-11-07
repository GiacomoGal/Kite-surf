# Manuale della pipeline Kite-surf

Norma operativa del checkout. Il README tiene la procedura operatore in inglese. Qui stanno i parametri, i percorsi e gli esiti già scritti nei commit. Le prove del 2026-11-07 sono in [prove/2026-11-07-ispezione-checkout.md](prove/2026-11-07-ispezione-checkout.md). La mappa degli obblighi è in [obblighi/matrice-preservazione-2026-11-07.md](obblighi/matrice-preservazione-2026-11-07.md).

Gli script non hanno argomenti. Cartelle e liste clip sono nel sorgente. Le directory di lavoro sono calcolate da `Path(__file__).parent.parent`.

## Percorsi

| Percorso | Ruolo |
|---|---|
| `raw/*.mp4` | Footage sorgente. I quattro file tracciati sono `video_2.mp4`, `video_3.mp4`, `video_4.mp4`, `vifdeo_1.mp4` |
| `scripts/detect_scenes.py` | Confini di scena, contact sheet, `scenes/` |
| `scripts/upscale.py` | Upscale delle scene verso `upscaled/` |
| `scripts/build_highlight.py` | Reel v1 |
| `scripts/build_highlight_v2.py` | Edit cinematografico v2 |
| `highlight/manifest.json` | Ultimo manifest v1 committato |
| `highlight_v2/manifest.json` | Ultimo manifest v2 committato |
| `studio/` | Progetto Remotion `kitesurf-studio` |
| `studio/src/data/*.ts` | Copie statiche dei manifest usate dalle composizioni |
| `studio/public/scenes/` | File letti da `KitesurfVideo` |
| `studio/public/highlight/` | File letti da `HighlightReel` |
| `studio/public/highlight_v2/` | File letti da `HighlightV2` |
| `studio/out/kitesurf.mp4` | Output degli script npm `build` e `render` |

Lo spelling `vifdeo_1.mp4` è quello del tree e delle liste `CLIPS`.

## Procedura highlight v2

Procedura corrente, la stessa del README:

1. Mettere i `.mp4` in `raw/`.
2. Eseguire `python3 scripts/detect_scenes.py` per i timestamp e i contact sheet.
3. Editare `CLIPS` in `scripts/build_highlight_v2.py`: source, start, end, label, speed.
4. Eseguire `python3 scripts/build_highlight_v2.py`. Scrive le clip in `highlight_v2/` e le copia in `studio/public/highlight_v2/`.
5. Aprire lo studio Remotion con `npm start` da `studio/`. La composizione registrata per questo edit è `HighlightV2`.

`build_highlight_v2.py` legge `raw/` e non legge `scenes/`. Il passo 2 resta nella procedura.

Regole nello header dello script, ancora in vigore:

- Massimo 1:30. Lo script avvisa se la somma delle durate reali supera 90 secondi.
- Slow-motion sui voli e sui cambi di direzione.
- Footage non ripetuto.
- Nessun effetto flash. La composizione `HighlightV2` non usa il flash. Il flash appartiene a v1 e al video intero.

Lista normativa: il tuple `CLIPS` nello script. Il manifest committato `highlight_v2/manifest.json` registra 17 clip e `total_duration` 89,77 secondi. Lo script, a ogni esecuzione, riscrive quel manifest. Non aggiorna `studio/src/data/highlight_v2.ts`.

Nomi file: `hl2_{nn}_{label}.mp4`.

Cinque sezioni annotate nella lista: open, build, intensity, climax, close. Velocità annotate nello script per questo edit: 0,4 sul volo, 0,5 sulle sferzate e su altri slow-mo di climax, 0,7 su alcune inquadrature del kite. Il valore che conta per una clip è il quinto campo del suo tuple.

Encode con `speed != 1`:

1. Estrazione del segmento: libx264, CRF 10, preset fast, senza audio, file temporaneo `_tmp_` nella cartella di output.
2. `setpts` con fattore `1/speed`, poi `minterpolate=fps=30:mi_mode=mci:mc_mode=aobmc:me_mode=bidir:vsbmc=1`, poi `scale=-2:1080:flags=lanczos`. Uscita libx264, CRF 14, preset slow, `yuv420p`, senza audio.
3. Se il file di uscita manca o ha dimensione 0: stesso `setpts` e lanczos, senza `minterpolate`, CRF 14.

Encode con `speed == 1`: un passaggio, `-ss` prima di `-i`, lanczos ad altezza 1080, CRF 14, preset slow, senza audio, `yuv420p`.

`TARGET_HEIGHT` è 1080.

Transizioni in `studio/src/compositions/HighlightV2.tsx`, applicate in coda a ogni clip tranne l'ultima. Sequenze accodate: la transizione occupa gli ultimi frame della clip, non aggiunge secondi alla somma. Fade globale dall'nero: 30 frame. Fade al nero in chiusura: 45 frame. A 30 fps sono 1 secondo e 1,5 secondi.

Mappa attuale, durata in frame:

| Etichetta | Effetto | Frame |
|---|---|---|
| `s1_kite_establish` | BlurDissolve | 12 |
| `s1_close_launch` | CrossDissolve | 15 |
| `s1_sferzata_1` | ZoomPush | 10 |
| `s1_ride_away` | SlideWipe | 10 |
| `s2_mid_ride` | CrossDissolve | 12 |
| `s2_kite_aero` | BlurDissolve | 15 |
| `s2_approach` | ZoomPush | 10 |
| `s2_panoramic` | ScaleBack | 12 |
| `s2_multi_kiters` | CrossDissolve | 10 |
| `s3_audience` | SlideWipe | 6 |
| `s3_sferzata_2` | BlurDissolve | 15 |
| `s3_ride_alt` | ZoomPush | 10 |
| `s4_kite_spin` | BlurDissolve | 18 |
| `s4_pre_flight` | DipToBlack | 12 |
| `s4_the_flight` | CrossDissolve | 20 |
| `s5_ride_out` | BlurDissolve | 15 |
| `s5_kite_finale` | CrossDissolve | 24 |

Etichetta assente dalla mappa: CrossDissolve, 12 frame. Schermata senza clip: «Run build_highlight_v2.py first». Video da `staticFile("highlight_v2/" + file)` con `objectFit: cover`.

## Procedura highlight v1

`python3 scripts/build_highlight.py` è l'assemblatore corrente del reel v1. Non è sostituito da v2.

La docstring punta a un reel di 60 secondi, con taglio, upscale a 1080p e clip pronte per Remotion. Lo script stampa il totale reale accanto al target di 60 secondi. Il commento in testa alla lista stima circa 54 secondi più le transizioni. Il manifest committato ha 13 clip e 54,18 secondi. Le transizioni Remotion non allungano la somma delle durate, perché le `Sequence` sono accodate.

Lista normativa: `CLIPS` in `scripts/build_highlight.py`. Il commento delle velocità di esempio è 1,0 normale, 0,5 slow-mo, 1,5 veloce. I valori in uso sono quelli scritti nei tuple di quella lista. Il manifest e il commit `6b3a05a` registrano slow-mo 0,6 sul salto e 0,7–0,8 sui dettagli del kite.

Nomi file: `hl_{nn}_{label}.mp4` in `highlight/`, copia in `studio/public/highlight/`.

Encode con `speed != 1`: estrazione CRF 14 preset fast senza audio, poi `setpts` e lanczos ad altezza 1080, CRF 16 preset slow, `yuv420p`, senza audio. v1 non chiama `minterpolate`. Encode a velocità 1: un passaggio, CRF 16, preset slow, lanczos, senza audio.

Transizioni in `HighlightReel.tsx`:

| Etichetta | Effetto |
|---|---|
| `kite_open`, `kite_cut1`, `audience`, `kite_spin` | FlashCut |
| `close_start`, `mid_ride` | WhipPan |
| `first_ride`, `intense_ride`, `wave_ride` | ZoomPunch |
| `wide_panoramic`, `the_jump`, `ride_out`, `kite_finale` | CrossDissolve |

Durate transizione: `the_jump` 20 frame, `audience` e `kite_cut1` 6 frame, le altre 10 frame. Fade in globale: 15 frame. Fade della clip finale: 20 frame. Schermata senza clip: «Run build_highlight.py first». Video da `staticFile("highlight/" + file)` con `objectFit: cover`.

## Rilevamento scene

`python3 scripts/detect_scenes.py`.

La docstring parla di cambi di direzione e di optical flow. La funzione eseguita è `freezedetect` di ffmpeg, soglia di rumore `n=0.05` e durata `d=0.8`. I timestamp accettati sono quelli maggiori di 3 secondi e minori di `durata - 3`.

Contact sheet per la revisione visiva: un fotogramma ogni 3 secondi, 5 colonne, scala larghezza 240, un JPEG in `thumbnails/{stem}_contact.jpg`.

Se ci sono timestamp, il taglio è sui cambi. I tratti più corti di 3 secondi non vengono scritti.

Se non ci sono timestamp e la durata è minore o uguale a 25 secondi, la clip resta un solo segmento. Altrimenti i segmenti sono da 8 secondi. Il commento del tratto finale più corto di 3 secondi dice di unirlo al precedente. Il codice esegue `break` e non riscrive il segmento già scritto: quel tratto non produce un file.

Estrazione: libx264, CRF 18, preset fast, senza audio. Nomi `{stem}_scene_{nnn}.mp4` in `scenes/`. Manifest `scenes/manifest.json` con `total_scenes` e `scenes` (`file`, `source`, `start`, `end`, `duration`). Senza `.mp4` in `raw/` il processo esce con codice 1.

Costanti: `MIN_SCENE_DURATION = 3.0`, `SEGMENT_DURATION = 8.0`.

## Upscale

`python3 scripts/upscale.py` dopo il rilevamento. Legge solo `scenes/*_scene_*.mp4`. Se non ne trova, esce con codice 1 e indica di eseguire `detect_scenes.py`. Scrive in `upscaled/` con lo stesso nome file. Non copia in `studio/public/scenes/`.

La docstring descrive il passaggio da 480p a 1080p HD, con Real-ESRGAN a frame e riassemblaggio. Il ramo lanczos è il fallback già nel README.

Selezione di Real-ESRGAN:

- Binario `realesrgan-ncnn-vulkan`.
- Ordine: `PATH`, `/usr/local/bin/realesrgan-ncnn-vulkan`, `/root/realesrgan/realesrgan-ncnn-vulkan`.
- Se lo stderr di prova contiene `vkCreateInstance failed`, il binario è trattato come assente.
- Binario assente o scartato: messaggio `Install Real-ESRGAN for better quality: see README` e lanczos.
- Binario selezionato: estrazione PNG con `qscale:v 2`, `realesrgan` con modello `realesrgan-x4plus`, scala `4`, formato png, poi riassemblaggio all'fps della sorgente, `scale=-2:1080`, libx264, CRF 16, preset slow, `yuv420p`. `.tmp_frames` è cancellato dopo ogni scena.
- Il commento sopra `SCALE_FACTOR` cita anche un'ipotesi 2× da 480p (960p) con pad o crop a 1080p. Il valore assegnato ed eseguito è `4` (4×, poi scala ad altezza 1080).

Fallback lanczos: `scale=-2:1080:flags=lanczos`, libx264, CRF 16, preset slow, `yuv420p`. L'argv di `upscale_ffmpeg_only` non contiene `-an`. Nemmeno `reassemble_video`.

Altezza target: 1080. Il fattore `-2` conserva il rapporto e arrotonda la larghezza. Questo manuale non aggiunge un URL di download né un installer.

I due path assoluti restano nell'ordine di ricerca anche quando su una macchina quei file non esistono.

## Studio Remotion

Pacchetto privato `kitesurf-studio` versione 1.0.0. Dipendenze Remotion fissate a 4.0.261 in `studio/package.json`. React 19 e TypeScript 5.7 sono indicati con intervallo nel `package.json`. `studio/remotion.config.ts` imposta il formato immagine jpeg e la sovrascrittura dell'output.

Comandi, da `studio/`:

| Script npm | Comando |
|---|---|
| `start` | `remotion studio` |
| `preview` | `remotion preview` |
| `build` | `remotion render KitesurfVideo out/kitesurf.mp4` |
| `render` | `remotion render KitesurfVideo out/kitesurf.mp4` |

`build` e `render` producono `studio/out/kitesurf.mp4` e nominano solo `KitesurfVideo`. `HighlightReel` e `HighlightV2` sono registrate in `studio/src/Root.tsx`. L'anteprima indicata dal README è `npm start`.

Tre composizioni, tutte a 30 fps, canvas 1080×1920.

In `studio/src/Root.tsx` la `durationInFrames` di ciascuna composizione è `Math.ceil` della somma delle durate del manifest statico moltiplicata per 30, poi `Math.max` con 1. L'arrotondamento sul totale è uno solo (`Root.tsx`, calcolo nelle righe 12-22).

Le timeline interne accumulano un `Math.ceil(durata * 30)` per clip: `KitesurfVideo` (righe 30-34), `HighlightReel` (righe 193-196), `HighlightV2` (righe 192-196, con `totalFrames` uguale a quell'accumulo alla riga 199).

Le due quantità restano distinte. Questo manuale non le dichiara uguali e non certifica da qui una durata di render.

`KitesurfVideo` legge `staticFile("scenes/" + file)`. Senza scene mostra «Run detect_scenes.py first». Transizioni in ciclo: `CrossfadeTransition`, `ZoomTransition`, `FlashTransition`, 15 frame in coda a ogni scena tranne l'ultima. Il commento in `CrossfadeTransition.tsx` descrive un overlap con la scena successiva. Il calcolo dei frame accoda le `Sequence`: la transizione agisce sugli ultimi frame della scena uscente.

Nessuno script copia `scenes/` o `upscaled/` in `studio/public/scenes/`. Il commento in `.gitignore` chiama quella cartella «Remotion bundled assets (copies of upscaled scenes)». È il percorso letto dalla composizione ed è ignorato da git.

Presentazione delle clip: `objectFit: cover` sul rettangolo 1080×1920.

## Manifest statici

`studio/src/data/scenes.ts`, `highlight.ts` e `highlight_v2.ts` sono la fonte letta da Remotion. Gli script Python aggiornano i JSON di `scenes/`, `highlight/` e `highlight_v2/` quando vengono eseguiti, e non aggiornano i moduli TypeScript.

`scenes.ts` dice che il caricamento da `manifest.json` è previsto e che per ora l'import è statico, in attesa di uno script di sync. Nel checkout quello script non c'è. La procedura attuale è l'import statico. L'intenzione annotata resta annotata.

`scenes.ts` elenca 32 scene. Il commento del file parla di portrait 612×1080 ottenuto da footage 480p. È il testo del commento. I file upscalati non sono in questo checkout. La misura ffprobe dei raw, datata nella prova, è 848×480.

`highlight.ts` copia file, etichetta e durata. `highlight_v2.ts` copia anche `speed`. I JSON committati hanno in più source, start, end e, per v1, speed.

## Gitignore

`.gitignore` non è stato modificato da questo aggiornamento. Regole in vigore:

- Intermedi: `scenes/`, `upscaled/`, `thumbnails/`, `.tmp_frames/`.
- `studio/public/scenes/` (commento: «Remotion bundled assets (copies of upscaled scenes)»), `studio/node_modules/`, `studio/dist/`.
- Commento «Keep raw and output»: i raw restano nel repository.
- `analysis/`: frame di analisi, descritti come rigenerabili. Nessuno script attuale scrive `analysis/`. La regola di ignore resta.
- `highlight/*.mp4` e `highlight_v2/*.mp4`: rigenerabili da `raw/` più il `manifest.json` della cartella. I manifest JSON restano tracciati.
- Copie Remotion: `studio/public/highlight/`, `studio/public/highlight_v2/`.
- Master full-res locali, perché oltre il limite di 100 MB di GitHub: `studio/out/kitesurf.mp4`, `studio/out/highlight_v2.mp4`.

`.gitignore` non elenca i nomi `_web` né `studio/out/highlight.mp4`.

## Esiti registrati

Questi fatti sono nei commit. Gli script del checkout non contengono un passaggio di encode web a CRF 22. Il passaggio non viene qui riscritto come procedura nuova, e non viene ritirato come informazione.

- `4d2a146` (2026-04-06): 32 scene da 4 raw; upscale 480p verso 1080p con lanczos; tre transizioni crossfade, zoom, flash; render citato 1080×1920, portrait, 3:33, compresso per il web. La somma delle 32 durate in `scenes.ts` è 213,11 secondi, cioè 3:33,11.
- `6b3a05a` (2026-04-06): reel v1, clip curate, effetti WhipPan, FlashCut, ZoomPunch, CrossDissolve.
- `e920e37` (2026-04-06): v2, 17 clip, nessuno spezzone ripetuto, slow-mo interpolato, sei tipi di transizione, cinque sezioni, master CRF 16 e versione web CRF 22 da circa 52 MB.
- `c5a2400` (2026-08-24): le versioni web restano tracciate. Nello stesso messaggio i master full-res sono citati come `kitesurf.mp4` 291 MB e `highlight_v2.mp4` 137 MB. Quelle due dimensioni non sono state rimisurate il 2026-11-07: i file non sono nel checkout.
- `0a47b6e` (2026-10-13) toglie da HEAD `studio/out/highlight.mp4`, `studio/out/highlight_v2_web.mp4` e `studio/out/kitesurf_web.mp4`. Le dimensioni registrate da git in quel commit sono 68798374, 53881419 e 93080239 byte. L'assenza in HEAD è lo stato del tree. Non è una riga nuova di `.gitignore`. La frase del 2026-08-24 sulle versioni web resta nel messaggio di quel commit. Questo aggiornamento documentale non ripristina i binari.

## Audio

`detect_scenes.py`, `build_highlight.py` e `build_highlight_v2.py` passano `-an` sugli ffmpeg che estraggono o ricodificano il video.

`upscale.py` non passa `-an`: né `reassemble_video` né `upscale_ffmpeg_only` lo includono nell'argv. Il percorso AI riassembla PNG, quindi l'ingresso di quel ffmpeg sono frame, non il filmato di scena.

Le scene scritte da `detect_scenes.py` sono già senza audio, perché quello script passa `-an`. Un upscale di quelle scene può uscire senza traccia audio per questo motivo. Il fatto vale per quell'ingresso. Non è un flag dentro `upscale.py` e non descrive un input qualunque.

I raw misurati il 2026-11-07 hanno una traccia audio ciascuno.

## Segreti

Nel checkout non ci sono `.env`, chiavi API, token o password in file di progetto. I documenti indicano categorie e path, mai valori.
