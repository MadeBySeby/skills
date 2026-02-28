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
// POSITION TUNING — all values in canvas pixels (canvas = 1080 × 1920)
//
// The screenshot (473px wide native) is displayed via objectFit:"contain" at
// full canvas height 1920px.  Scale factor = 1920 / 1024 ≈ 1.875.
// Horizontal offset to centre the narrower image = (1080 - 887) / 2 ≈ 97px.
//
// Tweak these numbers live in Remotion Studio until the overlays sit inside
// the correct input boxes.
// ─────────────────────────────────────────────────────────────────────────────
const OV = {
  // Row 1 vertical centre — top of the overlay div
  row1Top: 184, // canvas px from top  ← tweak vertically here
  row1Height: 96, // how tall the overlay boxes are

  // Left (GEL) box  — expand 4 px on every edge to fully hide existing text
  gelLeft: 144, // canvas px from left edge
  gelWidth: 320, // canvas px wide

  // Right (USD) box
  usdLeft: 600, // canvas px from left edge
  usdWidth: 320, // canvas px wide

  // Card background colour — sampled from IMG_5855 card region.
  // If a faint rectangle is still visible, nudge this value darker or lighter.
  coverBg: "#23427f",

  // Cover corner radius — match the app screenshot's card rounding
  coverRadius: 18,

  fontSize: 36,
};

// ─── Animated typing cursor ───────────────────────────────────────────────────
const Cursor: React.FC<{ visible: boolean }> = ({ visible }) => (
  <span
    style={{
      display: "inline-block",
      width: 3,
      height: OV.fontSize * 1.1,
      backgroundColor: "#FFFFFF",
      marginLeft: 3,
      verticalAlign: "middle",
      opacity: visible ? 1 : 0,
    }}
  />
);

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

// ─── Scene 2: Screenshot Overlay – 6 s (180 frames @ 30 fps) ─────────────────
export const LariScene2Converter: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Timing
  const STATIC_END = 0.3 * fps; // 9  hold before typing
  const TYPE_END = 1.3 * fps; // 39  typing done
  const SCALE_START = 1.3 * fps; // 39  scale-down begins
  const LABEL_IN = Math.round(1.5 * fps); // 45 label fades in

  // ── Typing: "$ 200" ────────────────────────────────────────────────────────
  const TYPED = "$ 200";
  const charProgress = interpolate(
    frame,
    [STATIC_END, TYPE_END],
    [0, TYPED.length],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    },
  );
  const typedText = TYPED.slice(0, Math.ceil(charProgress));
  const showCursor = frame >= STATIC_END && frame <= TYPE_END + 15;

  // ── GEL counter: ₾ 0.00 → ₾ 534.84 in sync with typing ──────────────────
  const GEL_TARGET = 534.84;
  const gelProgress = interpolate(
    frame,
    [STATIC_END, TYPE_END],
    [0, GEL_TARGET],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    },
  );
  // Before typing starts show nothing; once typing begins, count up
  const gelText = frame < STATIC_END ? "₾ 0.00" : `₾ ${gelProgress.toFixed(2)}`;

  // ── Spring scale-down: whole phone shrinks to 82% ─────────────────────────
  const scaleSpring = spring({
    frame: frame - SCALE_START,
    fps,
    config: { damping: 200 },
  });
  const scale = interpolate(scaleSpring, [0, 1], [1, 0.82]);

  // ── Label fades in below the phone ────────────────────────────────────────
  const labelOpacity = interpolate(frame, [LABEL_IN, LABEL_IN + 20], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const labelY = interpolate(frame, [LABEL_IN, LABEL_IN + 20], [24, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Shared text style for both overlays
  const textStyle: React.CSSProperties = {
    fontFamily: IOS_FONT,
    fontSize: OV.fontSize,
    fontWeight: 700,
    color: "#FFFFFF",
    letterSpacing: -0.4,
    whiteSpace: "nowrap",
  };

  return (
    <AbsoluteFill style={{ backgroundColor: "#162445" }}>
      {/* ── Scaled group (screenshot + overlays shrink together) ── */}
      <AbsoluteFill
        style={{
          transform: `scale(${scale})`,
          transformOrigin: "50% 42%",
        }}
      >
        {/* Full-screen app screenshot */}
        <Img
          src={staticFile("lari-screen-keyboard.png")}
          style={{ width: "100%", height: "100%", objectFit: "contain" }}
        />
        {/*
          ── COVER LAYERS ──────────────────────────────────────────────────────
          Opaque rects that hide the pre-filled row-1 values in the screenshot.
          Tweak OV.coverBg if a faint colour difference is still visible.
        */}
        {/* Cover GEL box */}
        <div
          style={{
            position: "absolute",
            top: OV.row1Top,
            left: OV.gelLeft,
            width: OV.gelWidth,
            height: OV.row1Height,
            backgroundColor: OV.coverBg,
            borderRadius: OV.coverRadius,
          }}
        />
        {/* Cover USD box */}
        <div
          style={{
            position: "absolute",
            top: OV.row1Top,
            left: OV.usdLeft,
            width: OV.usdWidth,
            height: OV.row1Height,
            backgroundColor: OV.coverBg,
            borderRadius: OV.coverRadius,
          }}
        />
        {/* ── GEL animated text ── */}
        <div
          style={{
            position: "absolute",
            top: OV.row1Top,
            left: OV.gelLeft,
            width: OV.gelWidth,
            height: OV.row1Height,
            display: "flex",
            alignItems: "center",
            paddingLeft: 18,
          }}
        >
          <span style={textStyle}>{gelText}</span>
        </div>
        {/* ── USD animated text ── */}
        <div
          style={{
            position: "absolute",
            top: OV.row1Top,
            left: OV.usdLeft,
            width: OV.usdWidth,
            height: OV.row1Height,
            display: "flex",
            alignItems: "center",
            paddingLeft: 18,
          }}
        >
          <span style={textStyle}>
            {typedText}
            <Cursor visible={showCursor} />
          </span>
        </div>
        {/* ── Keyboard Click Animations ── */}
        {/*
          Typing sequence is "$ 200"
          Length of TYPED is 5
          Frames allocated: 30 (frame 9 to 39), so 6 frames per character.
          char 0 ($) at 9
          char 1 ( ) at 15
          char 2 (2) at 21
          char 3 (0) at 27
          char 4 (0) at 33

          Start the click roughly 2-3 frames before the character appears.
        */}
        <KeyClick activeFrame={frame} targetFrame={19} keyX={540} keyY={1320} />
        {/* 2 */}
        <KeyClick activeFrame={frame} targetFrame={25} keyX={540} keyY={1780} />
        {/* 0 */}
        <KeyClick activeFrame={frame} targetFrame={31} keyX={540} keyY={1780} />
        {/* 0 */}
      </AbsoluteFill>

      {/* ── Label (outside scale group so it doesn't shrink with the phone) ── */}
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
            ეროვნული ბანკის კურსით.
          </span>
        </div>
      </div>
    </AbsoluteFill>
  );
};
