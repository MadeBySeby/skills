import { Composition } from "remotion";
import { SetFlowPromo, TOTAL_FRAMES } from "./SetFlowPromo";
import { LariPromo, LARI_TOTAL_FRAMES } from "./LariPromo";

export const RemotionRoot = () => {
  return (
    <>
      <Composition
        id="SetFlowPromo"
        component={SetFlowPromo}
        durationInFrames={TOTAL_FRAMES}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="LariPromo"
        component={LariPromo}
        durationInFrames={LARI_TOTAL_FRAMES}
        fps={30}
        width={1080}
        height={1920}
      />
    </>
  );
};
