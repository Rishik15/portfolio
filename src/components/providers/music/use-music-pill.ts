"use client";

import { useEffect, useState } from "react";

export type PillMode = "hidden" | "player" | "limit";

type PillInput = {
    isWindowOpen: boolean;
    isPlaying: boolean;
    isLimitNotice: boolean;
};

type LingerState = {
    wasPlayingClosed: boolean;
    isLingering: boolean;
};

const PAUSE_LINGER_MS = 15000;

export function useMusicPill({
    isWindowOpen,
    isPlaying,
    isLimitNotice,
}: PillInput): PillMode {
    const [state, setState] = useState<LingerState>({
        wasPlayingClosed: false,
        isLingering: false,
    });

    const isPlayingClosed = isPlaying && !isWindowOpen;

    const isIdleClosed = !isPlaying && !isWindowOpen;

    const isLingering =
        isIdleClosed && (state.isLingering || state.wasPlayingClosed);

    if (
        isPlayingClosed !== state.wasPlayingClosed ||
        isLingering !== state.isLingering
    ) {
        setState({ wasPlayingClosed: isPlayingClosed, isLingering });
    }

    useEffect(() => {
        if (!isLingering) {
            return;
        }

        const timeout = window.setTimeout(
            () => setState((current) => ({ ...current, isLingering: false })),
            PAUSE_LINGER_MS,
        );

        return () => window.clearTimeout(timeout);
    }, [isLingering]);

    if (isLimitNotice) {
        return "limit";
    }

    if (isWindowOpen) {
        return "hidden";
    }

    return isPlaying || isLingering ? "player" : "hidden";
}
