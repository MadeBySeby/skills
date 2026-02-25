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

export const LariScene4Outro: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // App icon springs in from centre
  const iconSpring = spring({
    frame,
    fps,
    config: { damping: 18, stiffness: 180 },
    durationInFrames: 45,
  });
  const iconScale = interpolate(iconSpring, [0, 1], [0, 1]);
  const iconOpacity = interpolate(iconSpring, [0, 1], [0, 1]);

  // App name fades up
  const nameSpring = spring({ frame: frame - 25, fps, config: { damping: 200 } });
  const nameOpacity = nameSpring;
  const nameY = interpolate(nameSpring, [0, 1], [28, 0]);

  // Subtitle fades up after name
  const subtitleSpring = spring({ frame: frame - 36, fps, config: { damping: 200 } });
  const subtitleOpacity = subtitleSpring;
  const subtitleY = interpolate(subtitleSpring, [0, 1], [18, 0]);

  // App Store badge
  const badgeOpacity = interpolate(frame, [52, 72], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const badgeY = interpolate(frame, [52, 72], [20, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#162445",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: IOS_FONT,
        overflow: "hidden",
      }}
    >
      {/* Real app icon */}
      <div
        style={{
          transform: `scale(${iconScale})`,
          opacity: iconOpacity,
          marginBottom: 52,
        }}
      >
        <Img
          src={staticFile("lari-icon.jpg")}
          style={{
            width: 220,
            height: 220,
            borderRadius: 50,
          }}
        />
      </div>

      {/* App name */}
      <div
        style={{
          opacity: nameOpacity,
          transform: `translateY(${nameY}px)`,
          fontSize: 88,
          fontWeight: 800,
          color: "#FFFFFF",
          letterSpacing: -3,
        }}
      >
        ლარი
      </div>

      {/* Subtitle */}
      <div
        style={{
          opacity: subtitleOpacity,
          transform: `translateY(${subtitleY}px)`,
          fontSize: 36,
          fontWeight: 400,
          color: "rgba(255,255,255,0.55)",
          letterSpacing: -0.3,
          marginTop: 10,
        }}
      >
        ქართული ვალუტა · ეროვნული კურსი
      </div>

      {/* App Store badge */}
      <div
        style={{
          opacity: badgeOpacity,
          transform: `translateY(${badgeY}px)`,
          marginTop: 70,
          display: "flex",
          alignItems: "center",
          gap: 16,
          backgroundColor: "#FFFFFF",
          borderRadius: 20,
          paddingTop: 16,
          paddingBottom: 16,
          paddingLeft: 36,
          paddingRight: 36,
        }}
      >
        <svg width="32" height="38" viewBox="0 0 814 1000" fill="#162445">
          <path d="M788.1 340.9c-5.8 4.5-108.2 62.2-108.2 190.5 0 148.4 130.3 200.9 134.2 202.2-.6 3.2-20.7 71.9-68.7 141.9-42.8 61.6-87.5 123.1-155.5 123.1s-85.5-39.5-164-39.5c-76.5 0-103.7 40.8-165.9 40.8s-105-37.3-155.8-113.4C46.6 732.9 0 604.7 0 481.3 0 307 106.7 214.2 211.6 214.2c66.8 0 122.2 43.5 163.9 43.5 39.4 0 101.9-46.1 178.7-46.1 28.5 0 130.9 2.6 198.3 99.2zm-234-181.5c31.1-36.9 53.1-88.1 53.1-139.3 0-7.1-.6-14.3-1.9-20.1-50.6 1.9-110.8 33.7-147.1 75.8-28.5 32.4-55.1 83.6-55.1 135.5 0 7.8 1.3 15.6 1.9 18.1 3.2.6 8.4 1.3 13.6 1.3 45.4 0 102.5-30.4 135.5-71.3z" />
        </svg>
        <div>
          <div
            style={{
              fontSize: 15,
              color: "#6B7A8D",
              fontFamily: IOS_FONT,
              fontWeight: 400,
            }}
          >
            გადმოიწერე
          </div>
          <div
            style={{
              fontSize: 30,
              fontWeight: 700,
              color: "#162445",
              fontFamily: IOS_FONT,
              letterSpacing: -0.5,
            }}
          >
            App Store
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
