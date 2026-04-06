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
  speed: number;
}

interface Props {
  clips: Clip[];
}

// ========== TRANSITION EFFECTS (no flash, all smooth/cinematic) ==========

/** Smooth cross dissolve with slight brightness lift */
const CrossDissolve: React.FC<{ frames: number; t: number }> = ({ frames, t }) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [frames - t, frames], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.ease),
  });
  return <AbsoluteFill style={{ opacity }} />;
};

/** Gentle zoom push — feels like camera moving forward */
const ZoomPush: React.FC<{ frames: number; t: number }> = ({ frames, t }) => {
  const frame = useCurrentFrame();
  const progress = interpolate(frame, [frames - t, frames], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.in(Easing.cubic),
  });
  const scale = 1 + progress * 0.12;
  const opacity = interpolate(progress, [0.6, 1], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return <AbsoluteFill style={{ transform: `scale(${scale})`, opacity }} />;
};

/** Horizontal wipe — smooth slide reveal */
const SlideWipe: React.FC<{ frames: number; t: number }> = ({ frames, t }) => {
  const frame = useCurrentFrame();
  const progress = interpolate(frame, [frames - t, frames], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.cubic),
  });
  const translateX = -progress * 100;
  return (
    <AbsoluteFill
      style={{
        transform: `translateX(${translateX}%)`,
      }}
    />
  );
};

/** Blur dissolve — dreamy transition, great for slow-mo */
const BlurDissolve: React.FC<{ frames: number; t: number }> = ({ frames, t }) => {
  const frame = useCurrentFrame();
  const progress = interpolate(frame, [frames - t, frames], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.ease),
  });
  const blur = progress * 12;
  const opacity = interpolate(progress, [0.3, 1], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <AbsoluteFill style={{ filter: `blur(${blur}px)`, opacity }} />
  );
};

/** Scale down + fade — cinematic pull-back */
const ScaleBack: React.FC<{ frames: number; t: number }> = ({ frames, t }) => {
  const frame = useCurrentFrame();
  const progress = interpolate(frame, [frames - t, frames], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const scale = 1 - progress * 0.08;
  const opacity = 1 - progress;
  return <AbsoluteFill style={{ transform: `scale(${scale})`, opacity }} />;
};

/** Dip to black — brief dark moment between scenes */
const DipToBlack: React.FC<{ frames: number; t: number }> = ({ frames, t }) => {
  const frame = useCurrentFrame();
  const blackOpacity = interpolate(
    frame,
    [frames - t, frames - t * 0.5, frames],
    [0, 1, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  return (
    <AbsoluteFill style={{ backgroundColor: "#000", opacity: blackOpacity }} />
  );
};

// Transition map — each clip gets a specific transition style
// Pattern: vary between smooth, energetic, and dreamy
const TRANSITION_CONFIG: Record<string, {
  effect: React.FC<{ frames: number; t: number }>;
  duration: number; // frames
}> = {
  // Section 1: Open
  s1_kite_establish: { effect: BlurDissolve, duration: 12 },
  s1_close_launch:   { effect: CrossDissolve, duration: 15 },
  s1_sferzata_1:     { effect: ZoomPush, duration: 10 },
  s1_ride_away:      { effect: SlideWipe, duration: 10 },

  // Section 2: Build
  s2_mid_ride:       { effect: CrossDissolve, duration: 12 },
  s2_kite_aero:      { effect: BlurDissolve, duration: 15 },
  s2_approach:       { effect: ZoomPush, duration: 10 },
  s2_panoramic:      { effect: ScaleBack, duration: 12 },
  s2_multi_kiters:   { effect: CrossDissolve, duration: 10 },

  // Section 3: Intensity
  s3_audience:       { effect: SlideWipe, duration: 6 },  // snap
  s3_sferzata_2:     { effect: BlurDissolve, duration: 15 },
  s3_ride_alt:       { effect: ZoomPush, duration: 10 },

  // Section 4: Climax
  s4_kite_spin:      { effect: BlurDissolve, duration: 18 }, // long dreamy
  s4_pre_flight:     { effect: DipToBlack, duration: 12 },   // dramatic pause
  s4_the_flight:     { effect: CrossDissolve, duration: 20 }, // smooth out

  // Section 5: Close
  s5_ride_out:       { effect: BlurDissolve, duration: 15 },
  s5_kite_finale:    { effect: CrossDissolve, duration: 24 }, // long fade out
};

const DEFAULT_TRANSITION = { effect: CrossDissolve, duration: 12 };

/** Fade in from black */
const FadeFromBlack: React.FC<{ durationFrames: number }> = ({ durationFrames }) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, durationFrames], [1, 0], {
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.ease),
  });
  return <AbsoluteFill style={{ backgroundColor: "#000", opacity }} />;
};

/** Fade to black at end */
const FadeToBlack: React.FC<{ totalFrames: number; fadeFrames: number }> = ({
  totalFrames,
  fadeFrames,
}) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(
    frame,
    [totalFrames - fadeFrames, totalFrames],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.in(Easing.ease) }
  );
  return <AbsoluteFill style={{ backgroundColor: "#000", opacity }} />;
};

// ========== MAIN COMPOSITION ==========

export const HighlightV2: React.FC<Props> = ({ clips }) => {
  if (clips.length === 0) {
    return (
      <AbsoluteFill style={{ backgroundColor: "#0a1628", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ color: "#fff", fontSize: 40, fontFamily: "sans-serif" }}>
          Run build_highlight_v2.py first
        </div>
      </AbsoluteFill>
    );
  }

  // Calculate timeline
  let frameOffset = 0;
  const timeline = clips.map((clip) => {
    const durationFrames = Math.ceil(clip.duration * FPS);
    const entry = { clip, startFrame: frameOffset, durationFrames };
    frameOffset += durationFrames;
    return entry;
  });

  const totalFrames = frameOffset;

  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      {timeline.map(({ clip, startFrame, durationFrames }, index) => {
        const config = TRANSITION_CONFIG[clip.label] || DEFAULT_TRANSITION;
        const TransitionEffect = config.effect;
        const transitionDuration = config.duration;
        const isLast = index === clips.length - 1;

        return (
          <Sequence
            key={clip.file}
            from={startFrame}
            durationInFrames={durationFrames}
            name={clip.label}
          >
            {/* Video layer */}
            <AbsoluteFill>
              <OffthreadVideo
                src={staticFile(`highlight_v2/${clip.file}`)}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
              />
            </AbsoluteFill>

            {/* Transition to next clip (not on last) */}
            {!isLast && (
              <TransitionEffect frames={durationFrames} t={transitionDuration} />
            )}
          </Sequence>
        );
      })}

      {/* Global fade in from black — 1s */}
      <Sequence from={0} durationInFrames={30}>
        <FadeFromBlack durationFrames={30} />
      </Sequence>

      {/* Global fade to black — 1.5s at end */}
      <Sequence from={0} durationInFrames={totalFrames}>
        <FadeToBlack totalFrames={totalFrames} fadeFrames={45} />
      </Sequence>
    </AbsoluteFill>
  );
};
