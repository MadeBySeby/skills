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

// Store badge component (CSS-drawn)
const StoreBadge: React.FC<{
  store: "apple" | "google";
  delayInFrames: number;
}> = ({ store, delayInFrames }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({ frame: frame - delayInFrames, fps, config: { damping: 20, stiffness: 200 } });
  const translateY = interpolate(p, [0, 1], [60, 0]);
  const opacity = interpolate(p, [0, 1], [0, 1]);

  return (
    <div
      style={{
        transform: `translateY(${translateY}px)`,
        opacity,
        backgroundColor: "#111827",
        border: "2px solid #374151",
        borderRadius: 14,
        padding: "12px 24px",
        display: "flex",
        alignItems: "center",
        gap: 12,
        minWidth: 180,
        cursor: "pointer",
        boxShadow: "0 8px 30px rgba(0,0,0,0.4)",
      }}
    >
      <span style={{ fontSize: 30 }}>{store === "apple" ? "🍎" : "▶️"}</span>
      <div>
        <div style={{ color: "#9CA3AF", fontSize: 11, fontFamily: "'Inter', sans-serif" }}>
          {store === "apple" ? "Download on the" : "Get it on"}
        </div>
        <div style={{ color: "#FFFFFF", fontSize: 18, fontWeight: 700, fontFamily: "'Inter', sans-serif" }}>
          {store === "apple" ? "App Store" : "Google Play"}
        </div>
      </div>
    </div>
  );
};

// Particle ring animation
const ParticleRing: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({ frame, fps, config: { damping: 200 } });
  const outerScale = interpolate(p, [0, 1], [0.5, 1]);

  return (
    <>
      {[1, 1.4, 1.8].map((mult, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: `translate(-50%, -65%) scale(${outerScale * mult})`,
            width: 160,
            height: 160,
            borderRadius: "50%",
            border: `1px solid rgba(76, 175, 114, ${0.15 - i * 0.04})`,
            pointerEvents: "none",
          }}
        />
      ))}
    </>
  );
};

// Scene 6: CTA — Logo + tagline + store badges
export const Scene6CTA: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Background radial glow pulses
  const glowPulse = interpolate(frame, [0, 60, 120], [0.6, 1, 0.6], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Logo bounces in
  const logoP = spring({ frame, fps, config: { damping: 8 } });
  const logoScale = interpolate(logoP, [0, 1], [0.2, 1]);
  const logoOpacity = interpolate(logoP, [0, 0.4], [0, 1], { extrapolateRight: "clamp" });

  // WordMark fades in
  const wordP = spring({ frame: frame - 20, fps, config: { damping: 200 } });
  const wordOpacity = interpolate(wordP, [0, 1], [0, 1]);
  const wordY = interpolate(wordP, [0, 1], [20, 0]);

  // Tagline
  const tagP = spring({ frame: frame - 35, fps, config: { damping: 200 } });

  return (
    <AbsoluteFill
      style={{
        fontFamily: "'Inter', sans-serif",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 0,
      }}
    >
      {/* Radial background */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `radial-gradient(ellipse at 50% 40%, rgba(76,175,114,${0.12 * glowPulse}) 0%, #0D1B2A 60%)`,
        }}
      />

      {/* Particle rings */}
      <ParticleRing />

      {/* App Icon */}
      <div
        style={{
          transform: `scale(${logoScale})`,
          opacity: logoOpacity,
          width: 140,
          height: 140,
          borderRadius: 32,
          overflow: "hidden",
          boxShadow: "0 20px 60px rgba(76,175,114,0.3), 0 0 0 4px rgba(76,175,114,0.2)",
          marginBottom: 24,
          flexShrink: 0,
        }}
      >
        <Img
          src={staticFile("app_icon.png")}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </div>

      {/* SetFlow wordmark */}
      <div
        style={{
          transform: `translateY(${wordY}px)`,
          opacity: wordOpacity,
          color: "#FFFFFF",
          fontSize: 72,
          fontWeight: 900,
          letterSpacing: -2,
          lineHeight: 1,
        }}
      >
        SetFlow
      </div>

      {/* Subtitle */}
      <div
        style={{
          opacity: interpolate(tagP, [0, 1], [0, 1]),
          transform: `translateY(${interpolate(tagP, [0, 1], [15, 0])}px)`,
          color: "#4CAF72",
          fontSize: 22,
          fontWeight: 500,
          marginTop: 10,
          marginBottom: 50,
          letterSpacing: 1,
        }}
      >
        Train smarter. Every day.
      </div>

      {/* Store badges */}
      <div style={{ display: "flex", gap: 20, flexWrap: "wrap", justifyContent: "center" }}>
        <StoreBadge store="apple" delayInFrames={60} />
        <StoreBadge store="google" delayInFrames={75} />
      </div>

      {/* CTA headline */}
      <div style={{ position: "absolute", bottom: "6%", left: 0, right: 0, textAlign: "center" }}>
        <AnimatedWords
          text="Download SetFlow today."
          delayInFrames={90}
          fontSize={44}
          fontWeight={800}
          color="#FFFFFF"
        />
      </div>
    </AbsoluteFill>
  );
};
