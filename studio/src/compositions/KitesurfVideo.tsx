import { AbsoluteFill, OffthreadVideo, Sequence, staticFile, useCurrentFrame } from "remotion";
import { Scene } from "../data/scenes";
import { CrossfadeTransition } from "../effects/CrossfadeTransition";
import { ZoomTransition } from "../effects/ZoomTransition";
import { FlashTransition } from "../effects/FlashTransition";

const FPS = 30;
const TRANSITION_FRAMES = 15; // 0.5s crossfade overlap

interface Props {
  scenes: Scene[];
}

// Cycle through different transition effects
const transitions = [CrossfadeTransition, ZoomTransition, FlashTransition];

export const KitesurfVideo: React.FC<Props> = ({ scenes }) => {
  if (scenes.length === 0) {
    return (
      <AbsoluteFill style={{ backgroundColor: "#0a1628", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ color: "#fff", fontSize: 48, fontFamily: "sans-serif" }}>
          Run detect_scenes.py first
        </div>
      </AbsoluteFill>
    );
  }

  // Calculate frame offsets for each scene
  let frameOffset = 0;
  const sceneFrames = scenes.map((scene, i) => {
    const durationFrames = Math.ceil(scene.duration * FPS);
    const entry = { scene, startFrame: frameOffset, durationFrames };
    frameOffset += durationFrames;
    return entry;
  });

  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      {sceneFrames.map(({ scene, startFrame, durationFrames }, index) => (
        <Sequence
          key={scene.file}
          from={startFrame}
          durationInFrames={durationFrames}
          name={scene.file}
        >
          <AbsoluteFill>
            <OffthreadVideo
              src={staticFile(`scenes/${scene.file}`)}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </AbsoluteFill>

          {/* Transition effect at the end of each scene (except last) */}
          {index < sceneFrames.length - 1 && (() => {
            const TransitionEffect = transitions[index % transitions.length];
            return (
              <TransitionEffect
                durationFrames={durationFrames}
                transitionFrames={TRANSITION_FRAMES}
              />
            );
          })()}
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
