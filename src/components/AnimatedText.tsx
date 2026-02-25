import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";

type AnimatedTextProps = {
  text: string;
  style?: React.CSSProperties;
  delayInFrames?: number;
  color?: string;
  fontSize?: number;
  fontWeight?: string | number;
  textAlign?: "left" | "center" | "right";
};

// Word-by-word spring reveal
export const AnimatedWords: React.FC<AnimatedTextProps> = ({
  text,
  style,
  delayInFrames = 0,
  color = "#FFFFFF",
  fontSize = 48,
  fontWeight = 700,
  textAlign = "center",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const words = text.split(" ");

  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        gap: "0 12px",
        justifyContent: textAlign === "center" ? "center" : textAlign === "right" ? "flex-end" : "flex-start",
        lineHeight: 1.2,
        ...style,
      }}
    >
      {words.map((word, i) => {
        const wordDelay = delayInFrames + i * 5;
        const progress = spring({
          frame: frame - wordDelay,
          fps,
          config: { damping: 20, stiffness: 200 },
        });
        const opacity = interpolate(progress, [0, 1], [0, 1]);
        const translateY = interpolate(progress, [0, 1], [30, 0]);
        return (
          <span
            key={i}
            style={{
              display: "inline-block",
              opacity,
              transform: `translateY(${translateY}px)`,
              color,
              fontSize,
              fontWeight,
              fontFamily: "'Inter', sans-serif",
            }}
          >
            {word}
          </span>
        );
      })}
    </div>
  );
};

// Simple fade-in text
export const FadeText: React.FC<AnimatedTextProps> = ({
  text,
  style,
  delayInFrames = 0,
  color = "#FFFFFF",
  fontSize = 32,
  fontWeight = 400,
  textAlign = "center",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const opacity = interpolate(frame, [delayInFrames, delayInFrames + 1 * fps], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <p
      style={{
        opacity,
        color,
        fontSize,
        fontWeight,
        fontFamily: "'Inter', sans-serif",
        textAlign,
        margin: 0,
        ...style,
      }}
    >
      {text}
    </p>
  );
};

// Green highlight badge
export const Badge: React.FC<{ text: string; delayInFrames?: number }> = ({
  text,
  delayInFrames = 0,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const progress = spring({
    frame: frame - delayInFrames,
    fps,
    config: { damping: 20, stiffness: 300 },
  });
  const scale = interpolate(progress, [0, 1], [0.5, 1]);
  const opacity = interpolate(progress, [0, 1], [0, 1]);

  return (
    <div
      style={{
        display: "inline-block",
        transform: `scale(${scale})`,
        opacity,
        backgroundColor: "#4CAF72",
        color: "#FFFFFF",
        padding: "8px 20px",
        borderRadius: 100,
        fontSize: 22,
        fontWeight: 700,
        fontFamily: "'Inter', sans-serif",
        letterSpacing: 1,
        whiteSpace: "nowrap",
      }}
    >
      {text}
    </div>
  );
};
