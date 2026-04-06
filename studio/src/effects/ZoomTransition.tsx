import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";

interface Props {
  durationFrames: number;
  transitionFrames: number;
}

/**
 * Zoom: scales up slightly as scene ends, creating an energetic push effect.
 */
export const ZoomTransition: React.FC<Props> = ({
  durationFrames,
  transitionFrames,
}) => {
  const frame = useCurrentFrame();

  const scale = interpolate(
    frame,
    [durationFrames - transitionFrames, durationFrames],
    [1, 1.15],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  const opacity = interpolate(
    frame,
    [durationFrames - transitionFrames, durationFrames],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  return (
    <AbsoluteFill
      style={{
        transform: `scale(${scale})`,
        opacity,
      }}
    />
  );
};
