import React from "react";
import { AbsoluteFill } from "remotion";

type PhoneMockupProps = {
  children: React.ReactNode;
  scale?: number;
  translateY?: number;
  translateX?: number;
  rotate?: number;
  opacity?: number;
};

export const PhoneMockup: React.FC<PhoneMockupProps> = ({
  children,
  scale = 1,
  translateY = 0,
  translateX = 0,
  rotate = 0,
  opacity = 1,
}) => {
  return (
    <div
      style={{
        transform: `translate(${translateX}px, ${translateY}px) scale(${scale}) rotate(${rotate}deg)`,
        opacity,
        transformOrigin: "center center",
        width: 280,
        height: 560,
        borderRadius: 40,
        backgroundColor: "#111827",
        boxShadow:
          "0 0 0 8px #1f2937, 0 0 0 12px #374151, 0 30px 80px rgba(0,0,0,0.6)",
        position: "relative",
        overflow: "hidden",
        flexShrink: 0,
      }}
    >
      {/* Notch */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: "50%",
          transform: "translateX(-50%)",
          width: 100,
          height: 28,
          backgroundColor: "#111827",
          borderBottomLeftRadius: 14,
          borderBottomRightRadius: 14,
          zIndex: 10,
        }}
      />
      {/* Screen content */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: 40,
          overflow: "hidden",
          backgroundColor: "#0D1B2A",
        }}
      >
        {children}
      </div>
    </div>
  );
};

// Full-screen phone mockup centered on the canvas
export const CenteredPhone: React.FC<{
  children: React.ReactNode;
  scale?: number;
  translateY?: number;
  translateX?: number;
  opacity?: number;
  rotate?: number;
}> = ({ children, scale = 1, translateY = 0, translateX = 0, opacity = 1, rotate = 0 }) => {
  return (
    <AbsoluteFill
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <PhoneMockup
        scale={scale}
        translateY={translateY}
        translateX={translateX}
        opacity={opacity}
        rotate={rotate}
      >
        {children}
      </PhoneMockup>
    </AbsoluteFill>
  );
};
