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
import { AnimatedWords } from "../components/AnimatedText";

type IconCardProps = {
  emoji: string;
  label: string;
  value: string;
  delayInFrames: number;
};

const IconCard: React.FC<IconCardProps> = ({ emoji, label, value, delayInFrames }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const progress = spring({
    frame: frame - delayInFrames,
    fps,
    config: { damping: 8 },
  });

  const scale = interpolate(progress, [0, 1], [0.2, 1]);
  const opacity = interpolate(progress, [0, 0.3], [0, 1], { extrapolateRight: "clamp" });

  // Ripple pulse on tap
  const rippleFrame = Math.max(0, frame - delayInFrames - 10);
  const rippleScale = interpolate(rippleFrame, [0, 20], [1, 2.5], { extrapolateRight: "clamp" });
  const rippleOpacity = interpolate(rippleFrame, [0, 20], [0.5, 0], { extrapolateRight: "clamp" });

  return (
    <div style={{ position: "relative", display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
      {/* Ripple */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: `translate(-50%, -60%) scale(${rippleScale})`,
          width: 80,
          height: 80,
          borderRadius: "50%",
          backgroundColor: "#4CAF72",
          opacity: rippleOpacity,
          pointerEvents: "none",
        }}
      />
      {/* Card */}
      <div
        style={{
          transform: `scale(${scale})`,
          opacity,
          backgroundColor: "#1a2e40",
          borderRadius: 20,
          padding: "16px 20px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 6,
          border: "2px solid #2a4a60",
          width: 140,
          boxShadow: "0 8px 30px rgba(0,0,0,0.3)",
        }}
      >
        <span style={{ fontSize: 40 }}>{emoji}</span>
        <span style={{ color: "#4CAF72", fontSize: 22, fontWeight: 700, fontFamily: "'Inter', sans-serif" }}>{value}</span>
        <span style={{ color: "#9CA3AF", fontSize: 14, fontFamily: "'Inter', sans-serif" }}>{label}</span>
      </div>
    </div>
  );
};

// Scene 3: Personalized — equipment + time + goals taps → workout generated
export const Scene3Personalized: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Headline label at top
  const headerP = spring({ frame, fps, config: { damping: 200 } });

  // Phone slides up after icons appear
  const phoneP = spring({ frame: frame - 90, fps, config: { damping: 200 } });
  const phoneY = interpolate(phoneP, [0, 1], [200, 0]);
  const phoneOpacity = interpolate(phoneP, [0, 1], [0, 1]);

  return (
    <AbsoluteFill
      style={{
        background: "linear-gradient(170deg, #0D1B2A 0%, #061a12 100%)",
        fontFamily: "'Inter', sans-serif",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        overflow: "hidden",
      }}
    >
      {/* Top label */}
      <div
        style={{
          marginTop: 60,
          opacity: interpolate(headerP, [0, 1], [0, 1]),
          transform: `translateY(${interpolate(headerP, [0, 1], [-20, 0])}px)`,
          color: "#4CAF72",
          fontSize: 22,
          fontWeight: 600,
          letterSpacing: 3,
          textTransform: "uppercase",
        }}
      >
        Tell SetFlow your preferences
      </div>

      {/* Three icon cards */}
      <div
        style={{
          display: "flex",
          gap: 20,
          marginTop: 50,
          justifyContent: "center",
        }}
      >
        <IconCard emoji="🏋️" label="Equipment" value="Dumbbells" delayInFrames={15} />
        <IconCard emoji="⏱️" label="Duration" value="30 mins" delayInFrames={35} />
        <IconCard emoji="💪" label="Goal" value="Strength" delayInFrames={55} />
      </div>

      {/* Arrow down */}
      <div
        style={{
          marginTop: 30,
          opacity: interpolate(frame, [80, 100], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
          color: "#4CAF72",
          fontSize: 30,
          animation: "none",
        }}
      >
        ↓
      </div>
      <div
        style={{
          marginTop: 4,
          opacity: interpolate(frame, [80, 100], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
          color: "#4CAF72",
          fontSize: 16,
          fontWeight: 600,
          letterSpacing: 2,
        }}
      >
        YOUR WORKOUT
      </div>

      {/* Phone showing result */}
      <div
        style={{
          marginTop: 16,
          transform: `translateY(${phoneY}px)`,
          opacity: phoneOpacity,
          width: 220,
          height: 340,
          borderRadius: 28,
          backgroundColor: "#111827",
          boxShadow: "0 0 0 6px #1f2937, 0 20px 60px rgba(0,0,0,0.6)",
          overflow: "hidden",
          flexShrink: 0,
        }}
      >
        <Img
          src={staticFile("screen_workout_list.png")}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </div>

      {/* Bottom headline */}
      <div style={{ position: "absolute", bottom: "5%", left: 0, right: 0, textAlign: "center", padding: "0 50px" }}>
        <AnimatedWords
          text="Workouts built around your life, your gear, and your goals."
          delayInFrames={120}
          fontSize={36}
          color="#FFFFFF"
        />
      </div>
    </AbsoluteFill>
  );
};
