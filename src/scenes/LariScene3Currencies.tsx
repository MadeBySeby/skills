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

// ─────────────────────────────────────────────────────────────────────────────
// Scene 3 shows two real screenshots in sequence:
//   Phase A (0 – ~60 frames): lari-screen-keyboard.png — app in use, keyboard up
//   Phase B (~60 – end):      lari-screen-modal.png    — Add Currency modal
//
// An overlay banner slides in at the end: "ყველა ვალუტა ერთ ადგილას."
// ─────────────────────────────────────────────────────────────────────────────
export const LariScene3Currencies: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Phase A: keyboard screenshot slides in from left
  const slideA = spring({ frame, fps, config: { damping: 200 } });
  const xA = interpolate(slideA, [0, 1], [-900, 0]);

  // Phase B: modal screenshot slides up over keyboard screenshot
  const MODAL_START = 55;
  const slideB = spring({ frame: frame - MODAL_START, fps, config: { damping: 200 } });
  const yB = interpolate(slideB, [0, 1], [1200, 0]);
  const opB = Math.min(slideB * 2, 1);

  // Label fades in near end
  const LABEL_START = 85;
  const labelOpacity = interpolate(frame, [LABEL_START, LABEL_START + 20], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const labelY = interpolate(frame, [LABEL_START, LABEL_START + 20], [24, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const imgStyle: React.CSSProperties = {
    width: "100%",
    height: "100%",
    objectFit: "contain",
  };

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#162445",
        overflow: "hidden",
        fontFamily: IOS_FONT,
      }}
    >
      {/* Phase A: keyboard screenshot */}
      <AbsoluteFill style={{ transform: `translateX(${xA}px)` }}>
        <Img src={staticFile("lari-screen-keyboard.png")} style={imgStyle} />
      </AbsoluteFill>

      {/* Phase B: modal screenshot slides up */}
      <AbsoluteFill
        style={{ transform: `translateY(${yB}px)`, opacity: opB }}
      >
        <Img src={staticFile("lari-screen-modal.png")} style={imgStyle} />
      </AbsoluteFill>

      {/* Overlay label — outside both phases so it's always on top */}
      <div
        style={{
          position: "absolute",
          bottom: "5%",
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "center",
          opacity: labelOpacity,
          transform: `translateY(${labelY}px)`,
        }}
      >
        <div
          style={{
            backgroundColor: "rgba(212,175,55,0.16)",
            border: "1px solid rgba(212,175,55,0.45)",
            borderRadius: 60,
            paddingTop: 16,
            paddingBottom: 16,
            paddingLeft: 50,
            paddingRight: 50,
          }}
        >
          <span
            style={{
              fontFamily: IOS_FONT,
              fontSize: 34,
              fontWeight: 600,
              color: "#FFFFFF",
              letterSpacing: -0.5,
            }}
          >
            ყველა ვალუტა ერთ ადგილას.
          </span>
        </div>
      </div>
    </AbsoluteFill>
  );
};
