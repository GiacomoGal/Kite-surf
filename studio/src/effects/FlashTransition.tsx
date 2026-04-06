import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";

interface Props {
  durationFrames: number;
  transitionFrames: number;
}

/**
 * Flash: bright white flash between scenes — high energy kitesurf feel.
 */
export const FlashTransition: React.FC<Props> = ({
  durationFrames,
  transitionFrames,
}) => {
  const frame = useCurrentFrame();

  // Flash peaks at the transition point, then fades
  const flashOpacity = interpolate(
    frame,
    [
      durationFrames - transitionFrames,
      durationFrames - transitionFrames / 2,
      durationFrames,
    ],
    [0, 0.9, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "white",
        opacity: flashOpacity,
      }}
    />
  );
};
