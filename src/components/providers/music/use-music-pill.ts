"use client";

import { useEffect, useRef, useState } from "react";

export type PillMode = "hidden" | "player" | "limit";

type PillInput = {
    isWindowOpen: boolean;
    isPlaying: boolean;
    isLimitNotice: boolean;
};

const PAUSE_LINGER_MS = 15000;

export function useMusicPill({
    isWindowOpen,
    isPlaying,
    isLimitNotice,
}: PillInput): PillMode {
    const [isLingering, setIsLingering] = useState(false);

    const wasPlayingClosedRef = useRef(false);

    useEffect(() => {
        const isPlayingClosed = isPlaying && !isWindowOpen;

        const shouldLinger =
            !isPlaying && !isWindowOpen && wasPlayingClosedRef.current;

        wasPlayingClosedRef.current = isPlayingClosed;

        if (!shouldLinger) {
            setIsLingering(false);

            return;
        }

        setIsLingering(true);

        const timeout = window.setTimeout(
            () => setIsLingering(false),
            PAUSE_LINGER_MS,
        );

        return () => window.clearTimeout(timeout);
    }, [isPlaying, isWindowOpen]);

    if (isLimitNotice) {
        return "limit";
    }

    if (isWindowOpen) {
        return "hidden";
    }

    return isPlaying || isLingering ? "player" : "hidden";
}
