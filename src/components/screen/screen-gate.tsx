"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

import { UnsupportedScreen } from "@/components/screen/unsupported-screen";

const SUPPORTED_SCREEN_QUERY = "(min-width: 720px) and (min-height: 500px)";

function ScreenLoading() {
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

const Desktop = dynamic(
    () =>
        import("@/components/desktop/desktop").then((module) => module.Desktop),
    {
        ssr: false,
        loading: ScreenLoading,
    },
);

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
        return <ScreenLoading />;
    }

    if (!isSupported) {
        return <UnsupportedScreen />;
    }

    return <Desktop />;
}
