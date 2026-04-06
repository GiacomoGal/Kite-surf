import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";

interface Props {
  durationFrames: number;
  transitionFrames: number;
}

/**
 * Crossfade: fades out the current scene at the end.
 * The next scene's Sequence overlaps, creating a smooth dissolve.
 */
export const CrossfadeTransition: React.FC<Props> = ({
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

  return (
    <AbsoluteFill style={{ opacity }} />
  );
};
