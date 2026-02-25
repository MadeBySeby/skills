import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
  Img,
  staticFile,
} from "remotion";
import { AnimatedWords, Badge } from "../components/AnimatedText";

// Scene 2: Split screen — Build Your Own vs Ready-Made Programs
export const Scene2Control: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Divider slides in from center
  const dividerProgress = spring({ frame, fps, config: { damping: 200 } });
  const dividerHeight = interpolate(dividerProgress, [0, 1], [0, 100]);

  // Left side slides in from left
  const leftProgress = spring({ frame: frame - 10, fps, config: { damping: 200 } });
  const leftX = interpolate(leftProgress, [0, 1], [-400, 0]);
  const leftOpacity = interpolate(leftProgress, [0, 1], [0, 1]);

  // Right side slides in from right
  const rightProgress = spring({ frame: frame - 20, fps, config: { damping: 200 } });
  const rightX = interpolate(rightProgress, [0, 1], [400, 0]);
  const rightOpacity = interpolate(rightProgress, [0, 1], [0, 1]);

  // Phones scale in
  const leftPhoneProgress = spring({ frame: frame - 30, fps, config: { damping: 20, stiffness: 200 } });
  const rightPhoneProgress = spring({ frame: frame - 45, fps, config: { damping: 20, stiffness: 200 } });
  const leftPhoneScale = interpolate(leftPhoneProgress, [0, 1], [0.6, 1]);
  const rightPhoneScale = interpolate(rightPhoneProgress, [0, 1], [0.6, 1]);

  // Bottom message
  const msgDelay = 90;

  return (
    <AbsoluteFill
      style={{
        background: "#0D1B2A",
        fontFamily: "'Inter', sans-serif",
        overflow: "hidden",
      }}
    >
      {/* Left panel — Build Your Own */}
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          width: "50%",
          height: "100%",
          transform: `translateX(${leftX}px)`,
          opacity: leftOpacity,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          paddingTop: 40,
          gap: 24,
          background: "linear-gradient(180deg, #0D1B2A 0%, #0f2235 100%)",
        }}
      >
        <Badge text="BUILD YOUR OWN" delayInFrames={30} />

        {/* Phone with workouts screen */}
        <div
          style={{
            transform: `scale(${leftPhoneScale})`,
            transformOrigin: "center center",
            width: 200,
            height: 400,
            borderRadius: 30,
            backgroundColor: "#111827",
            boxShadow: "0 0 0 6px #1f2937, 0 20px 60px rgba(0,0,0,0.5)",
            overflow: "hidden",
          }}
        >
          <Img
            src={staticFile("screen_workout_list.png")}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        </div>

        {/* Feature bullets */}
        {["Choose any exercise", "Set reps & sets", "Build your split"].map((t, i) => {
          const p = spring({ frame: frame - (50 + i * 12), fps, config: { damping: 20, stiffness: 150 } });
          return (
            <div
              key={i}
              style={{
                opacity: interpolate(p, [0, 1], [0, 1]),
                transform: `translateX(${interpolate(p, [0, 1], [-20, 0])}px)`,
                color: "#9CA3AF",
                fontSize: 20,
                display: "flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              <span style={{ color: "#4CAF72" }}>✓</span> {t}
            </div>
          );
        })}
      </div>

      {/* Center divider */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: `${(100 - dividerHeight) / 2}%`,
          transform: "translateX(-50%)",
          width: 3,
          height: `${dividerHeight}%`,
          background: "linear-gradient(180deg, transparent, #4CAF72, transparent)",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          transform: "translate(-50%, -50%)",
          backgroundColor: "#4CAF72",
          color: "#0D1B2A",
          borderRadius: "50%",
          width: 52,
          height: 52,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 22,
          fontWeight: 900,
          opacity: dividerProgress,
          zIndex: 5,
          boxShadow: "0 4px 20px rgba(76,175,114,0.5)",
        }}
      >
        OR
      </div>

      {/* Right panel — Ready-Made */}
      <div
        style={{
          position: "absolute",
          right: 0,
          top: 0,
          width: "50%",
          height: "100%",
          transform: `translateX(${rightX}px)`,
          opacity: rightOpacity,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          paddingTop: 40,
          gap: 24,
          background: "linear-gradient(180deg, #0D2A1A 0%, #0a1f14 100%)",
        }}
      >
        <Badge text="READY-MADE" delayInFrames={45} />

        {/* Phone with programs screen */}
        <div
          style={{
            transform: `scale(${rightPhoneScale})`,
            transformOrigin: "center center",
            width: 200,
            height: 400,
            borderRadius: 30,
            backgroundColor: "#111827",
            boxShadow: "0 0 0 6px #1f2937, 0 20px 60px rgba(0,0,0,0.5)",
            overflow: "hidden",
          }}
        >
          <Img
            src={staticFile("screen_programs.png")}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        </div>

        {/* Feature bullets */}
        {["Expert-designed plans", "Every fitness level", "Tap & start instantly"].map((t, i) => {
          const p = spring({ frame: frame - (60 + i * 12), fps, config: { damping: 20, stiffness: 150 } });
          return (
            <div
              key={i}
              style={{
                opacity: interpolate(p, [0, 1], [0, 1]),
                transform: `translateX(${interpolate(p, [0, 1], [20, 0])}px)`,
                color: "#9CA3AF",
                fontSize: 20,
                display: "flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              <span style={{ color: "#4CAF72" }}>✓</span> {t}
            </div>
          );
        })}
      </div>

      {/* Bottom headline */}
      <div
        style={{
          position: "absolute",
          bottom: "5%",
          left: 0,
          right: 0,
          textAlign: "center",
          padding: "0 60px",
        }}
      >
        <AnimatedWords
          text="Whether you're a beginner or a pro — SetFlow adapts to you."
          delayInFrames={msgDelay}
          fontSize={34}
          color="#FFFFFF"
        />
      </div>
    </AbsoluteFill>
  );
};
