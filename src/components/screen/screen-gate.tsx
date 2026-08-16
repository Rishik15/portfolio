"use client";

import { useEffect, useState } from "react";

import { Desktop } from "@/components/desktop/desktop";
import { UnsupportedScreen } from "@/components/screen/unsupported-screen";

const SUPPORTED_SCREEN_QUERY = "(min-width: 720px) and (min-height: 500px)";

export function ScreenGate() {
    const [isSupported, setIsSupported] = useState<boolean | null>(null);

    useEffect(() => {
        const mediaQuery = window.matchMedia(SUPPORTED_SCREEN_QUERY);

        const updateSupport = () => {
            setIsSupported(mediaQuery.matches);
        };

        updateSupport();

        mediaQuery.addEventListener("change", updateSupport);

        return () => {
            mediaQuery.removeEventListener("change", updateSupport);
        };
    }, []);

    if (isSupported === null) {
        return (
            <main
                className="
                    h-dvh
                    w-full
                    bg-background
                "
                aria-hidden="true"
            />
        );
    }

    if (!isSupported) {
        return <UnsupportedScreen />;
    }

    return <Desktop />;
}
