import React from "react";
import {
  AbsoluteFill,
  Img,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

const IOS_FONT =
  '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif';

const BG = "#162445";

// ─── Scene 1: Hook (0 – 3 s, 90 frames) ──────────────────────────────────────
export const LariScene1Hook: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // App icon springs in
  const iconSpring = spring({
    frame,
    fps,
    config: { damping: 18, stiffness: 180 },
    durationInFrames: 45,
  });
  const iconScale = interpolate(iconSpring, [0, 1], [0, 1]);
  const iconOpacity = interpolate(iconSpring, [0, 1], [0, 1]);

  // "გაიცანი ლარი." fades in at frame 20, fades out at frame 48
  const meetOpacity = interpolate(frame, [20, 35, 48, 58], [0, 1, 1, 0], {
    extrapolateRight: "clamp",
    extrapolateLeft: "clamp",
  });

  // Tagline words stagger in
  const taglineWords = ["სწრაფი.", "მარტივი.", "ზუსტი."];
  const taglineColors = ["#FFFFFF", "#D4AF37", "rgba(255,255,255,0.7)"];
  const taglineWordOpacities = taglineWords.map((_, i) => {
    const delay = 60 + i * 8;
    return spring({ frame: frame - delay, fps, config: { damping: 200 } });
  });
  const taglineVisible = frame >= 58;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: BG,
        alignItems: "center",
        justifyContent: "center",
        fontFamily: IOS_FONT,
        overflow: "hidden",
      }}
    >
      {/* App icon */}
      <div
        style={{
          transform: `scale(${iconScale})`,
          opacity: iconOpacity,
          marginBottom: 60,
        }}
      >
        <Img
          src={staticFile("lari-icon.jpg")}
          style={{
            width: 260,
            height: 260,
            borderRadius: 56,
          }}
        />
      </div>

      {/* "გაიცანი ლარი." */}
      <div
        style={{
          position: "absolute",
          opacity: meetOpacity,
          fontSize: 80,
          fontWeight: 800,
          color: "#FFFFFF",
          letterSpacing: -2,
          textAlign: "center",
        }}
      >
        გაიცანი ლარი.
      </div>

      {/* Tagline: "სწრაფი. მარტივი. ზუსტი." */}
      {taglineVisible && (
        <div
          style={{
            position: "absolute",
            bottom: "28%",
            display: "flex",
            gap: 24,
            alignItems: "center",
          }}
        >
          {taglineWords.map((word, i) => (
            <span
              key={word}
              style={{
                opacity: taglineWordOpacities[i],
                transform: `translateY(${interpolate(taglineWordOpacities[i], [0, 1], [20, 0])}px)`,
                fontSize: 52,
                fontWeight: 700,
                color: taglineColors[i],
                letterSpacing: -1,
              }}
            >
              {word}
            </span>
          ))}
        </div>
      )}
    </AbsoluteFill>
  );
};
