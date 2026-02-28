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

// ─── Key Click Animation ──────────────────────────────────────────────────────
const KeyClick: React.FC<{
  activeFrame: number;
  targetFrame: number;
  keyX: number;
  keyY: number;
}> = ({ activeFrame, targetFrame, keyX, keyY }) => {
  // A quick 10-frame pulse that starts exactly on targetFrame
  const progress = interpolate(
    activeFrame,
    [targetFrame, targetFrame + 5, targetFrame + 10],
    [0, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  if (progress === 0) return null;

  return (
    <div
      style={{
        position: "absolute",
        left: keyX - 60, // center the 120px ripple
        top: keyY - 60,
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: "rgba(255, 255, 255, 0.3)",
        opacity: progress,
        transform: `scale(${interpolate(progress, [0, 1], [0.5, 1.2])})`,
        pointerEvents: "none",
      }}
    />
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// Scene 3 shows two real screenshots in sequence:
//   Phase A (0 – ~60 frames): IMG_6232.png — app in use, showing new worldwide icon
//   Phase B (~60 – end):      lari-screen-modal.png    — Add Currency modal
//
// An overlay banner slides in at the end: "ყველა ვალუტა ერთ ადგილას."
// ─────────────────────────────────────────────────────────────────────────────
export const LariScene3Currencies: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Phase A: screenshot slides in from left
  const slideA = spring({ frame, fps, config: { damping: 200 } });
  const xA = interpolate(slideA, [0, 1], [-900, 0]);

  // Phase B: modal screenshot slides up over screenshot
  const MODAL_START = 20;
  const slideB = spring({
    frame: frame - MODAL_START,
    fps,
    config: { damping: 200 },
  });
  const yB = interpolate(slideB, [0, 1], [1200, 0]);
  const opB = Math.min(slideB * 2, 1);

  // Label fades in near end
  const LABEL_START = 35;
  const labelOpacity = interpolate(
    frame,
    [LABEL_START, LABEL_START + 20],
    [0, 1],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    },
  );
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
      {/* Phase A: screenshot */}
      <AbsoluteFill style={{ transform: `translateX(${xA}px)` }}>
        <Img src={staticFile("IMG_6232.png")} style={imgStyle} />
        {/*
          Click on the "+ Add Currency" / Worldwide icon button
          MODAL_START is 20. The click should happen just before it (e.g., frame 14).
          Positioned on the right bottom side: X=900, Y=1750 (adjust if needed)
        */}
        <KeyClick activeFrame={frame} targetFrame={14} keyX={870} keyY={1800} />
      </AbsoluteFill>

      {/* Phase B: modal screenshot slides up */}
      <AbsoluteFill style={{ transform: `translateY(${yB}px)`, opacity: opB }}>
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
