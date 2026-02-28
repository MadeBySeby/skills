import React from "react";
import { AbsoluteFill } from "remotion";
import {
  TransitionSeries,
  linearTiming,
  springTiming,
} from "@remotion/transitions";
import { slide } from "@remotion/transitions/slide";
import { fade } from "@remotion/transitions/fade";
import { wipe } from "@remotion/transitions/wipe";

import { LariScene1Hook } from "./scenes/LariScene1Hook";
import { LariScene2Converter } from "./scenes/LariScene2Converter";
import { LariScene3Currencies } from "./scenes/LariScene3Currencies";
import { LariScene4Outro } from "./scenes/LariScene4Outro";

// Scene durations (frames @ 30 fps)
const SCENE = {
  s1: 90, // 3 s  — Hook
  s2: 80, // <2 s — Screenshot overlay (typing anim)
  s3: 100, // 4 s  — Multiple Currencies
  s4: 90, // 3 s  — Outro
};

const TRANSITION_FRAMES = 20;

// 450 frames = 15 s (minus overlap from transitions)
export const LARI_TOTAL_FRAMES =
  Object.values(SCENE).reduce((a, b) => a + b, 0) - 3 * TRANSITION_FRAMES; // 450 - 60 = 390 rendered frames

export const LariPromo: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: "#162445" }}>
      <TransitionSeries>
        {/* Scene 1 — The Hook */}
        <TransitionSeries.Sequence durationInFrames={SCENE.s1}>
          <LariScene1Hook />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={slide({ direction: "from-bottom" })}
          timing={springTiming({
            config: { damping: 200 },
            durationInFrames: TRANSITION_FRAMES,
          })}
        />

        {/* Scene 2 — Core Functionality */}
        <TransitionSeries.Sequence durationInFrames={SCENE.s2}>
          <LariScene2Converter />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={wipe({ direction: "from-right" })}
          timing={springTiming({
            config: { damping: 200 },
            durationInFrames: TRANSITION_FRAMES,
          })}
        />

        {/* Scene 3 — Multiple Currencies */}
        <TransitionSeries.Sequence durationInFrames={SCENE.s3}>
          <LariScene3Currencies />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: TRANSITION_FRAMES })}
        />

        {/* Scene 4 — Outro */}
        <TransitionSeries.Sequence durationInFrames={SCENE.s4}>
          <LariScene4Outro />
        </TransitionSeries.Sequence>
      </TransitionSeries>
    </AbsoluteFill>
  );
};
