/**
 * cat-config.ts
 * Numeric constants shared by the cat sprites, styles and roam controller.
 */

export const CAT_CONFIG = {
    width: 120,
    height: 100,
    groundRatio: 0.84,
    footSink: 4,
    firstXRatio: 0.3,
    edgeMargin: 80,
    minWalkDistance: 160,
    firstActionDelay: 1500,
} as const;
