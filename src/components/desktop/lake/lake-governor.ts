import { LAKE_GOVERNOR } from "./lake-config";

export type LakeGovernor = {
    record: (frameMs: number) => boolean;
};

export function createLakeGovernor(): LakeGovernor {
    let activeMs = 0;
    let windowMs = 0;
    let frames = 0;
    let slow = 0;

    function record(frameMs: number) {
        if (frameMs > LAKE_GOVERNOR.gapMs) return false;

        activeMs += frameMs;
        if (activeMs < LAKE_GOVERNOR.warmupMs) return false;

        windowMs += frameMs;
        frames++;
        if (frameMs > LAKE_GOVERNOR.slowFrameMs) slow++;
        if (windowMs < LAKE_GOVERNOR.windowMs) return false;

        const overloaded = slow / frames > LAKE_GOVERNOR.slowRatio;
        windowMs = 0;
        frames = 0;
        slow = 0;
        return overloaded;
    }

    return { record };
}
