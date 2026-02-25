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

// Scene 4: Perfect Form — exercise card zooms in showing 3D guide
export const Scene4Form: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Phone appears first
  const phoneP = spring({ frame, fps, config: { damping: 200 } });
  const phoneScale = interpolate(phoneP, [0, 1], [0.8, 1]);
  const phoneOpacity = interpolate(phoneP, [0, 1], [0, 1]);

  // Tap ripple at frame 40
  const tapFrame = Math.max(0, frame - 40);
  const tapScale = interpolate(tapFrame, [0, 25], [0, 3], { extrapolateRight: "clamp" });
  const tapOpacity = interpolate(tapFrame, [0, 25], [0.7, 0], { extrapolateRight: "clamp" });

  // Zoom into the exercise view at frame 55
  const zoomP = spring({ frame: frame - 55, fps, config: { damping: 200 } });
  const exerciseCardY = interpolate(zoomP, [0, 1], [80, 0]);
  const exerciseCardOpacity = interpolate(zoomP, [0, 1], [0, 1]);

  // "PERFECT FORM" label
  const formLabelP = spring({ frame: frame - 70, fps, config: { damping: 20, stiffness: 300 } });

  return (
    <AbsoluteFill
      style={{
        background: "linear-gradient(170deg, #0D1B2A 0%, #1a2e40 100%)",
        fontFamily: "'Inter', sans-serif",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {/* Phone showing workout list with tap effect */}
      <div
        style={{
          position: "relative",
          transform: `scale(${phoneScale})`,
          opacity: phoneOpacity,
          width: 240,
          height: 420,
          borderRadius: 32,
          backgroundColor: "#111827",
          boxShadow: "0 0 0 6px #1f2937, 0 30px 80px rgba(0,0,0,0.6)",
          overflow: "hidden",
          marginBottom: -40,
        }}
      >
        <Img
          src={staticFile("screen_active_workout.png")}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />

        {/* Tap indicator */}
        <div
          style={{
            position: "absolute",
            top: "35%",
            left: "50%",
            transform: `translate(-50%, -50%) scale(${tapScale})`,
            width: 40,
            height: 40,
            borderRadius: "50%",
            backgroundColor: "rgba(76, 175, 114, 0.3)",
            border: "2px solid #4CAF72",
            opacity: tapOpacity,
            pointerEvents: "none",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: "35%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            opacity: interpolate(frame, [38, 45], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) *
                      interpolate(frame, [48, 55], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
            fontSize: 28,
          }}
        >
          👆
        </div>
      </div>

      {/* Exercise card slides up */}
      <div
        style={{
          transform: `translateY(${exerciseCardY}px)`,
          opacity: exerciseCardOpacity,
          width: 320,
          backgroundColor: "#1a2e40",
          borderRadius: 24,
          overflow: "hidden",
          boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
          border: "1px solid #2a4a60",
          position: "relative",
        }}
      >
        {/* Exercise image */}
        <div style={{ width: "100%", height: 200, backgroundColor: "#0f1f2e", position: "relative" }}>
          <Img
            src={staticFile("screen_exercise.png")}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
          {/* "3D GUIDE" badge */}
          <div
            style={{
              position: "absolute",
              top: 12,
              right: 12,
              backgroundColor: "#4CAF72",
              color: "#0D1B2A",
              fontSize: 12,
              fontWeight: 800,
              padding: "4px 10px",
              borderRadius: 100,
              letterSpacing: 1,
              opacity: interpolate(formLabelP, [0, 1], [0, 1]),
              transform: `scale(${interpolate(formLabelP, [0, 1], [0.5, 1])})`,
            }}
          >
            3D GUIDE
          </div>
        </div>

        {/* Exercise info */}
        <div style={{ padding: "16px 20px" }}>
          <div style={{ color: "#FFFFFF", fontSize: 20, fontWeight: 700 }}>Cable Chest Press</div>
          <div style={{ color: "#4CAF72", fontSize: 14, marginTop: 4 }}>Reps: 10 · Sets: 4</div>
          <div
            style={{
              marginTop: 12,
              backgroundColor: "#4CAF72",
              color: "#0D1B2A",
              textAlign: "center",
              padding: "10px",
              borderRadius: 12,
              fontSize: 16,
              fontWeight: 700,
              opacity: interpolate(formLabelP, [0, 1], [0, 1]),
            }}
          >
            Set 1 Done ✓
          </div>
        </div>
      </div>

      {/* Bottom headline */}
      <div style={{ position: "absolute", bottom: "5%", left: 0, right: 0, textAlign: "center", padding: "0 50px" }}>
        <AnimatedWords
          text="Never second-guess your form again."
          delayInFrames={100}
          fontSize={42}
          fontWeight={800}
          color="#FFFFFF"
        />
        <AnimatedWords
          text="Built-in 3D exercise guides."
          delayInFrames={130}
          fontSize={28}
          fontWeight={400}
          color="#4CAF72"
        />
      </div>
    </AbsoluteFill>
  );
};
