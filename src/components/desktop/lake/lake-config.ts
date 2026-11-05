export const LAKE_PHYSICS_ENABLED = true;

export const LAKE_GRID = {
    cellPx: 8,
    maxDpr: 1.5,
} as const;

export const LAKE_SPRING = {
    stiffness: 64,
    damping: 10.4,
    coupling: 36,
    stepSeconds: 1 / 120,
    maxStepsPerAdvance: 6,
    maxCatchupMs: 50,
} as const;

export const LAKE_WAVE = {
    speedSquared: 0.04,
    damping: 0.978,
    inject: 0.2,
    limit: 0.15,
    shockRing: 0.2,
    pointerWake: 0.012,
    pointerWakeMaxSteps: 12,
    edgeCells: 10,
    edgeLoss: 0.14,
} as const;

export const LAKE_REST = {
    windowSigma: 2.6,
    sigmaVariation: 0.14,
    pointerReach: 1.8,
    pointerDepth: 0.35,
} as const;

export const LAKE_SHOCK = {
    impulse: 6,
    reach: 2.2,
} as const;

export const LAKE_SLEEP = {
    velocity: 0.002,
    acceleration: 0.01,
    wave: 0.002,
    quietSteps: 8,
} as const;

export const LAKE_ENCODE = {
    gradientGain: 5,
    depthMin: -0.5,
    depthSpan: 1.5,
    wideBlurRadius: 2,
} as const;

export const LAKE_LOOP = {
    idlePollMs: 250,
    awakeFrames: 90,
    windowSelector: 'section[aria-label$=" window"]',
} as const;

export const LAKE_GOVERNOR = {
    warmupMs: 1500,
    windowMs: 2000,
    slowFrameMs: 24,
    slowRatio: 0.2,
    gapMs: 200,
} as const;
