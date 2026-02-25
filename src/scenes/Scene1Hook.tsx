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
import { AnimatedWords, FadeText } from "../components/AnimatedText";
import { CenteredPhone } from "../components/PhoneMockup";

// Scene 1: The Hook — confused notes app → SetFlow opens
export const Scene1Hook: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Background fade in
  const bgOpacity = interpolate(frame, [0, 20], [0, 1], {
    extrapolateRight: "clamp",
  });

  // Confused notes panel fades out at frame 60
  const notesOpacity = interpolate(frame, [0, 15, 80, 110], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const notesY = interpolate(frame, [80, 110], [0, -60], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // SetFlow phone slides up from bottom
  const phoneProgress = spring({
    frame: frame - 90,
    fps,
    config: { damping: 200 },
  });
  const phoneY = interpolate(phoneProgress, [0, 1], [300, 0]);
  const phoneOpacity = interpolate(phoneProgress, [0, 1], [0, 1]);

  // Headline appears after phone
  const headlineDelay = 120;

  // Question marks float up
  const q1 = spring({ frame: frame - 5, fps, config: { damping: 12 } });
  const q2 = spring({ frame: frame - 18, fps, config: { damping: 10 } });
  const q3 = spring({ frame: frame - 30, fps, config: { damping: 14 } });

  return (
    <AbsoluteFill
      style={{
        background: "linear-gradient(160deg, #0D1B2A 0%, #1a2e40 100%)",
        opacity: bgOpacity,
        fontFamily: "'Inter', sans-serif",
        overflow: "hidden",
      }}
    >
      {/* Green particle dots */}
      {[...Array(8)].map((_, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            width: 6,
            height: 6,
            borderRadius: "50%",
            backgroundColor: "#4CAF72",
            opacity: 0.3,
            left: `${10 + i * 12}%`,
            top: `${20 + (i % 3) * 20}%`,
          }}
        />
      ))}

      {/* Confused notes mockup — top half */}
      <div
        style={{
          position: "absolute",
          top: "10%",
          left: "50%",
          transform: `translateX(-50%) translateY(${notesY}px)`,
          opacity: notesOpacity,
          width: 320,
          backgroundColor: "#1c1c1e",
          borderRadius: 16,
          padding: "24px 20px",
          boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
        }}
      >
        <div style={{ color: "#aaa", fontSize: 14, marginBottom: 10, fontFamily: "monospace" }}>📝 Notes</div>
        {["- chest?? back?? idk", "- 3 sets... or 4?", "- skip legs again lol", "- what did I do Monday?", "- push pull legs? maybe?"].map((line, i) => (
          <div key={i} style={{ color: "#666", fontSize: 16, padding: "4px 0", borderBottom: "1px solid #2a2a2a" }}>
            {line}
          </div>
        ))}
        {/* Floating question marks */}
        <div style={{ position: "absolute", top: -30, right: 20, color: "#ef4444", fontSize: 32, opacity: q1, transform: `translateY(${interpolate(q1, [0,1],[10,0])}px)` }}>?</div>
        <div style={{ position: "absolute", top: -50, right: 60, color: "#f97316", fontSize: 24, opacity: q2, transform: `translateY(${interpolate(q2,[0,1],[10,0])}px)` }}>?</div>
        <div style={{ position: "absolute", top: -20, right: 100, color: "#ef4444", fontSize: 18, opacity: q3, transform: `translateY(${interpolate(q3,[0,1],[10,0])}px)`}}>?</div>
      </div>

      {/* Arrow pointing down to SetFlow */}
      <div
        style={{
          position: "absolute",
          top: "44%",
          left: "50%",
          transform: "translateX(-50%)",
          opacity: interpolate(frame, [95, 115], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
          color: "#4CAF72",
          fontSize: 36,
        }}
      >
        ↓
      </div>

      {/* SetFlow Phone */}
      <div
        style={{
          position: "absolute",
          bottom: "18%",
          left: "50%",
          transform: `translateX(-50%) translateY(${phoneY}px)`,
          opacity: phoneOpacity,
        }}
      >
        <CenteredPhone>
          <Img
            src={staticFile("screen_workout_list.png")}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        </CenteredPhone>
      </div>

      {/* Headline */}
      <div
        style={{
          position: "absolute",
          bottom: "6%",
          left: 0,
          right: 0,
          textAlign: "center",
          padding: "0 40px",
        }}
      >
        <AnimatedWords
          text="Stop guessing. Start tracking."
          delayInFrames={headlineDelay}
          fontSize={52}
          fontWeight={800}
          color="#FFFFFF"
        />
      </div>
    </AbsoluteFill>
  );
};
