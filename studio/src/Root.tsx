import { Composition } from "remotion";
import { KitesurfVideo } from "./compositions/KitesurfVideo";
import { sceneManifest } from "./data/scenes";

// Calculate total duration from manifest (30fps)
const FPS = 30;
const TRANSITION_FRAMES = 15; // 0.5s per transition

export const RemotionRoot: React.FC = () => {
  const totalScenes = sceneManifest.scenes.length;
  const totalDurationSec = sceneManifest.scenes.reduce(
    (sum, s) => sum + s.duration,
    0
  );
  // Total frames = scene durations - overlap from transitions
  const totalFrames = Math.ceil(totalDurationSec * FPS);

  return (
    <>
      <Composition
        id="KitesurfVideo"
        component={KitesurfVideo}
        durationInFrames={Math.max(totalFrames, 1)}
        fps={FPS}
        width={1080}
        height={1920}
        defaultProps={{
          scenes: sceneManifest.scenes,
        }}
      />
    </>
  );
};
