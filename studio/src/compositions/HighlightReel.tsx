import {
  AbsoluteFill,
  Easing,
  interpolate,
  OffthreadVideo,
  Sequence,
  staticFile,
  useCurrentFrame,
} from "remotion";

const FPS = 30;

interface Clip {
  file: string;
  label: string;
  duration: number;
}

interface Props {
  clips: Clip[];
}

/**
 * WhipPan — fast horizontal blur/slide transition
 */
const WhipPan: React.FC<{ durationFrames: number; transitionFrames: number }> = ({
  durationFrames,
  transitionFrames,
}) => {
  const frame = useCurrentFrame();

  const progress = interpolate(
    frame,
    [durationFrames - transitionFrames, durationFrames],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  const translateX = interpolate(progress, [0, 0.5, 1], [0, -30, 0]);
  const blur = interpolate(progress, [0, 0.5, 1], [0, 8, 0]);
  const opacity = interpolate(progress, [0, 0.4, 0.6, 1], [1, 0.7, 0.7, 0]);

  return (
    <AbsoluteFill
      style={{
        transform: `translateX(${translateX}px)`,
        filter: `blur(${blur}px)`,
        opacity,
      }}
    />
  );
};

/**
 * FlashCut — bright white/cyan flash for energy
 */
const FlashCut: React.FC<{ durationFrames: number; transitionFrames: number }> = ({
  durationFrames,
  transitionFrames,
}) => {
  const frame = useCurrentFrame();

  const flashOpacity = interpolate(
    frame,
    [
      durationFrames - transitionFrames,
      durationFrames - transitionFrames * 0.4,
      durationFrames,
    ],
    [0, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  return (
    <AbsoluteFill
      style={{
        background: "linear-gradient(180deg, rgba(255,255,255,0.95), rgba(180,230,255,0.8))",
        opacity: flashOpacity,
      }}
    />
  );
};

/**
 * ZoomPunch — quick zoom-in for impact
 */
const ZoomPunch: React.FC<{ durationFrames: number; transitionFrames: number }> = ({
  durationFrames,
  transitionFrames,
}) => {
  const frame = useCurrentFrame();

  const scale = interpolate(
    frame,
    [durationFrames - transitionFrames, durationFrames],
    [1, 1.3],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.in(Easing.cubic),
    }
  );

  const opacity = interpolate(
    frame,
    [durationFrames - transitionFrames * 0.6, durationFrames],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  return (
    <AbsoluteFill style={{ transform: `scale(${scale})`, opacity }} />
  );
};

/**
 * CrossDissolve — smooth classic dissolve
 */
const CrossDissolve: React.FC<{ durationFrames: number; transitionFrames: number }> = ({
  durationFrames,
  transitionFrames,
}) => {
  const frame = useCurrentFrame();

  const opacity = interpolate(
    frame,
    [durationFrames - transitionFrames, durationFrames],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  return <AbsoluteFill style={{ opacity }} />;
};

// Transition pattern: vary by clip position for rhythm
const transitionMap: Record<string, React.FC<{ durationFrames: number; transitionFrames: number }>> = {
  kite_open: FlashCut,       // dramatic open → flash into action
  close_start: WhipPan,      // fast whip to next
  first_ride: ZoomPunch,     // zoom punch for energy
  kite_cut1: FlashCut,       // flash back to action
  mid_ride: WhipPan,         // whip pan
  wide_panoramic: CrossDissolve, // smooth dissolve from wide
  intense_ride: ZoomPunch,   // punch into audience
  audience: FlashCut,        // flash to build
  wave_ride: ZoomPunch,      // zoom into kite spin
  kite_spin: FlashCut,       // FLASH into the jump
  the_jump: CrossDissolve,   // smooth out of slow-mo
  ride_out: CrossDissolve,   // gentle to finale
  kite_finale: CrossDissolve, // fade out
};

/**
 * FadeIn — gentle opacity ramp at start of composition
 */
const FadeIn: React.FC = () => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 15], [0, 1], {
    extrapolateRight: "clamp",
  });
  return (
    <AbsoluteFill style={{ backgroundColor: "#000", opacity: 1 - opacity }} />
  );
};

export const HighlightReel: React.FC<Props> = ({ clips }) => {
  if (clips.length === 0) {
    return (
      <AbsoluteFill
        style={{
          backgroundColor: "#0a1628",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div style={{ color: "#fff", fontSize: 48, fontFamily: "sans-serif" }}>
          Run build_highlight.py first
        </div>
      </AbsoluteFill>
    );
  }

  // Transition duration varies by energy level
  const getTransitionFrames = (label: string): number => {
    if (label === "the_jump") return 20; // longer transition into/out of slow-mo
    if (label === "audience") return 6;  // snap cut
    if (label === "kite_cut1") return 6; // snap cut
    return 10; // default ~0.33s
  };

  // Calculate frame offsets
  let frameOffset = 0;
  const clipFrames = clips.map((clip) => {
    const durationFrames = Math.ceil(clip.duration * FPS);
    const entry = { clip, startFrame: frameOffset, durationFrames };
    frameOffset += durationFrames;
    return entry;
  });

  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      {clipFrames.map(({ clip, startFrame, durationFrames }, index) => {
        const transitionFrames = getTransitionFrames(clip.label);
        const TransitionEffect =
          transitionMap[clip.label] || CrossDissolve;

        return (
          <Sequence
            key={clip.file}
            from={startFrame}
            durationInFrames={durationFrames}
            name={clip.label}
          >
            <AbsoluteFill>
              <OffthreadVideo
                src={staticFile(`highlight/${clip.file}`)}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
              />
            </AbsoluteFill>

            {/* Transition at end (except last clip) */}
            {index < clipFrames.length - 1 && (
              <TransitionEffect
                durationFrames={durationFrames}
                transitionFrames={transitionFrames}
              />
            )}

            {/* Fade to black at the very end */}
            {index === clipFrames.length - 1 && (() => {
              const fadeFrames = 20;
              return <CrossDissolve durationFrames={durationFrames} transitionFrames={fadeFrames} />;
            })()}
          </Sequence>
        );
      })}

      {/* Global fade-in from black */}
      <Sequence from={0} durationInFrames={15}>
        <FadeIn />
      </Sequence>
    </AbsoluteFill>
  );
};
