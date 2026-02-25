import React from "react";
import { AbsoluteFill } from "remotion";
import { TransitionSeries, linearTiming, springTiming } from "@remotion/transitions";
import { slide } from "@remotion/transitions/slide";
import { fade } from "@remotion/transitions/fade";
import { wipe } from "@remotion/transitions/wipe";

import { Scene1Hook } from "./scenes/Scene1Hook";
import { Scene2Control } from "./scenes/Scene2Control";
import { Scene3Personalized } from "./scenes/Scene3Personalized";
import { Scene4Form } from "./scenes/Scene4Form";
import { Scene5Progress } from "./scenes/Scene5Progress";
import { Scene6CTA } from "./scenes/Scene6CTA";

// Scene durations (frames @ 30fps)
export const SCENE_DURATION = {
  s1: 210, // 7s  — Hook
  s2: 210, // 7s  — Build vs Ready-Made
  s3: 210, // 7s  — Personalized
  s4: 180, // 6s  — Form / Exercise
  s5: 210, // 7s  — Progress
  s6: 180, // 6s  — CTA
};

const TRANSITION_FRAMES = 20;

// Total: 1200 - 5*20 = 1100 frames (∼36.6s after transitions)
export const TOTAL_FRAMES =
  Object.values(SCENE_DURATION).reduce((a, b) => a + b, 0) -
  5 * TRANSITION_FRAMES;

export const SetFlowPromo: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: "#0D1B2A" }}>
      <TransitionSeries>
        {/* Scene 1 — Hook */}
        <TransitionSeries.Sequence durationInFrames={SCENE_DURATION.s1}>
          <Scene1Hook />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={slide({ direction: "from-right" })}
          timing={linearTiming({ durationInFrames: TRANSITION_FRAMES })}
        />

        {/* Scene 2 — Control */}
        <TransitionSeries.Sequence durationInFrames={SCENE_DURATION.s2}>
          <Scene2Control />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={wipe({ direction: "from-right" })}
          timing={springTiming({ config: { damping: 200 }, durationInFrames: TRANSITION_FRAMES })}
        />

        {/* Scene 3 — Personalized */}
        <TransitionSeries.Sequence durationInFrames={SCENE_DURATION.s3}>
          <Scene3Personalized />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={slide({ direction: "from-right" })}
          timing={linearTiming({ durationInFrames: TRANSITION_FRAMES })}
        />

        {/* Scene 4 — Form */}
        <TransitionSeries.Sequence durationInFrames={SCENE_DURATION.s4}>
          <Scene4Form />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={wipe({ direction: "from-bottom" })}
          timing={springTiming({ config: { damping: 200 }, durationInFrames: TRANSITION_FRAMES })}
        />

        {/* Scene 5 — Progress */}
        <TransitionSeries.Sequence durationInFrames={SCENE_DURATION.s5}>
          <Scene5Progress />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: TRANSITION_FRAMES })}
        />

        {/* Scene 6 — CTA */}
        <TransitionSeries.Sequence durationInFrames={SCENE_DURATION.s6}>
          <Scene6CTA />
        </TransitionSeries.Sequence>
      </TransitionSeries>
    </AbsoluteFill>
  );
};
