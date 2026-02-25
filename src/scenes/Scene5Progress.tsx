import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { AnimatedWords, FadeText } from "../components/AnimatedText";

const DAYS = ["M", "T", "W", "T", "F", "S", "S"];
const WEEKS = 5;
// Which cells have a workout (row*7+col) — avoid weekends
const WORKOUT_CELLS = [1,2,3,8,9,10,15,16,17,22,23,24,26,29,30];

// Animated SVG line graph trending upward
const ProgressGraph: React.FC<{ delayInFrames: number }> = ({ delayInFrames }) => {
  const frame = useCurrentFrame();
  const progress = interpolate(frame, [delayInFrames, delayInFrames + 50], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const W = 340;
  const H = 120;
  const points = [
    [0, 110], [50, 95], [100, 80], [150, 60], [200, 45], [250, 25], [300, 10], [340, 5],
  ];

  // Draw only up to `progress` portion of the line
  const totalPoints = Math.max(2, Math.round(progress * points.length));
  const visiblePoints = points.slice(0, totalPoints);
  const polyline = visiblePoints.map((p) => p.join(",")).join(" ");

  return (
    <div style={{ opacity: interpolate(frame, [delayInFrames, delayInFrames + 10], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) }}>
      <div style={{ color: "#9CA3AF", fontSize: 14, marginBottom: 8, fontFamily: "'Inter', sans-serif" }}>
        Strength Progress
      </div>
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
        <defs>
          <linearGradient id="lineGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#4CAF72" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#4CAF72" stopOpacity="1" />
          </linearGradient>
        </defs>
        {/* Grid lines */}
        {[0, 30, 60, 90].map((y) => (
          <line key={y} x1={0} y1={y} x2={W} y2={y} stroke="#1f2937" strokeWidth={1} />
        ))}
        {/* Area fill */}
        <polygon
          points={`0,${H} ${polyline} ${visiblePoints[visiblePoints.length - 1][0]},${H}`}
          fill="url(#lineGrad)"
          opacity={0.15}
        />
        {/* Line */}
        {visiblePoints.length >= 2 && (
          <polyline
            points={polyline}
            stroke="#4CAF72"
            strokeWidth={3}
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        )}
        {/* End dot */}
        {visiblePoints.length >= 2 && (
          <circle
            cx={visiblePoints[visiblePoints.length - 1][0]}
            cy={visiblePoints[visiblePoints.length - 1][1]}
            r={6}
            fill="#4CAF72"
          />
        )}
      </svg>
      {/* Y labels */}
      <div style={{ display: "flex", justifyContent: "space-between", color: "#4B5563", fontSize: 11, fontFamily: "'Inter', sans-serif", marginTop: 4 }}>
        <span>Week 1</span><span>Week 2</span><span>Week 3</span><span>Week 4</span>
      </div>
    </div>
  );
};

// Scene 5: Progress — calendar fills up + stats graph
export const Scene5Progress: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Title in
  const titleP = spring({ frame, fps, config: { damping: 200 } });

  // How many calendar cells are checked (one cell per 4 frames)
  const checkedCount = Math.floor(interpolate(frame, [20, 20 + WORKOUT_CELLS.length * 5], [0, WORKOUT_CELLS.length], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  }));

  // Graph appears later
  const graphDelay = 20 + WORKOUT_CELLS.length * 5 + 10;

  return (
    <AbsoluteFill
      style={{
        background: "linear-gradient(170deg, #0D1B2A 0%, #06100d 100%)",
        fontFamily: "'Inter', sans-serif",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "60px 40px 0",
        overflow: "hidden",
      }}
    >
      {/* Title */}
      <div
        style={{
          opacity: interpolate(titleP, [0, 1], [0, 1]),
          transform: `translateY(${interpolate(titleP, [0, 1], [-20, 0])}px)`,
          color: "#4CAF72",
          fontSize: 22,
          fontWeight: 700,
          letterSpacing: 3,
          textTransform: "uppercase",
          marginBottom: 24,
        }}
      >
        Your Workout History
      </div>

      {/* Calendar */}
      <div
        style={{
          backgroundColor: "#111827",
          borderRadius: 20,
          padding: "20px 24px",
          width: "100%",
          maxWidth: 420,
          boxShadow: "0 10px 40px rgba(0,0,0,0.4)",
        }}
      >
        {/* Month header */}
        <div style={{ color: "#FFFFFF", fontSize: 18, fontWeight: 700, marginBottom: 16, textAlign: "center" }}>
          February 2026
        </div>

        {/* Day headers */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 4, marginBottom: 8 }}>
          {DAYS.map((d, i) => (
            <div key={i} style={{ color: "#4B5563", fontSize: 13, textAlign: "center", fontWeight: 600 }}>{d}</div>
          ))}
        </div>

        {/* Calendar grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 4 }}>
          {Array.from({ length: WEEKS * 7 }).map((_, idx) => {
            const workoutIndex = WORKOUT_CELLS.indexOf(idx);
            const isWorkoutDay = workoutIndex >= 0;
            const isChecked = isWorkoutDay && workoutIndex < checkedCount;
            const dayNum = idx - 2; // offset for Feb starting on Sunday

            const cellP = spring({
              frame: frame - (20 + workoutIndex * 5),
              fps,
              config: { damping: 8 },
            });
            const cellScale = isChecked ? interpolate(cellP, [0, 1], [0.5, 1]) : 1;

            return (
              <div
                key={idx}
                style={{
                  height: 44,
                  borderRadius: 10,
                  backgroundColor: isChecked ? "#4CAF72" : "#1f2937",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: dayNum > 0 && dayNum <= 28 ? 14 : 0,
                  color: isChecked ? "#0D1B2A" : "#6B7280",
                  fontWeight: isChecked ? 700 : 400,
                  transform: `scale(${cellScale})`,
                  transition: "none",
                }}
              >
                {isChecked ? "✓" : dayNum > 0 && dayNum <= 28 ? dayNum : ""}
              </div>
            );
          })}
        </div>
      </div>

      {/* Stats graph */}
      <div
        style={{
          marginTop: 32,
          backgroundColor: "#111827",
          borderRadius: 20,
          padding: "20px 24px",
          width: "100%",
          maxWidth: 420,
          boxShadow: "0 10px 40px rgba(0,0,0,0.4)",
        }}
      >
        <ProgressGraph delayInFrames={graphDelay} />
      </div>

      {/* Bottom headline */}
      <div style={{ position: "absolute", bottom: "4%", left: 0, right: 0, textAlign: "center", padding: "0 50px" }}>
        <AnimatedWords
          text="Track your past. Own your future."
          delayInFrames={graphDelay + 40}
          fontSize={42}
          fontWeight={800}
          color="#FFFFFF"
        />
      </div>
    </AbsoluteFill>
  );
};
