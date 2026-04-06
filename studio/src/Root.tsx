import { Composition } from "remotion";
import { KitesurfVideo } from "./compositions/KitesurfVideo";
import { HighlightReel } from "./compositions/HighlightReel";
import { HighlightV2 } from "./compositions/HighlightV2";
import { sceneManifest } from "./data/scenes";
import { highlightManifest } from "./data/highlight";
import { highlightV2Manifest } from "./data/highlight_v2";

const FPS = 30;

export const RemotionRoot: React.FC = () => {
  const fullDurationFrames = Math.ceil(
    sceneManifest.scenes.reduce((sum, s) => sum + s.duration, 0) * FPS
  );

  const highlightDurationFrames = Math.ceil(
    highlightManifest.clips.reduce((sum, c) => sum + c.duration, 0) * FPS
  );

  const v2DurationFrames = Math.ceil(
    highlightV2Manifest.clips.reduce((sum, c) => sum + c.duration, 0) * FPS
  );

  return (
    <>
      {/* Full video — all 32 scenes */}
      <Composition
        id="KitesurfVideo"
        component={KitesurfVideo}
        durationInFrames={Math.max(fullDurationFrames, 1)}
        fps={FPS}
        width={1080}
        height={1920}
        defaultProps={{ scenes: sceneManifest.scenes }}
      />

      {/* Highlight reel v1 — 54s quick edit */}
      <Composition
        id="HighlightReel"
        component={HighlightReel}
        durationInFrames={Math.max(highlightDurationFrames, 1)}
        fps={FPS}
        width={1080}
        height={1920}
        defaultProps={{ clips: highlightManifest.clips }}
      />

      {/* Highlight v2 — 90s cinematic, slow-mo flights + sferzate */}
      <Composition
        id="HighlightV2"
        component={HighlightV2}
        durationInFrames={Math.max(v2DurationFrames, 1)}
        fps={FPS}
        width={1080}
        height={1920}
        defaultProps={{ clips: highlightV2Manifest.clips }}
      />
    </>
  );
};
