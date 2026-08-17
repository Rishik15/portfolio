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

function InitialScreen() {
    return (
        <>
            <div className="screen-gate-unsupported">
                <UnsupportedScreen />
            </div>

            <div className="screen-gate-supported-loading">
                <ScreenLoading />
            </div>

            <style>{`
                .screen-gate-supported-loading {
                    display: none;
                }

                @media (min-width: 720px) and (min-height: 500px) {
                    .screen-gate-unsupported {
                        display: none;
                    }

                    .screen-gate-supported-loading {
                        display: block;
                    }
                }
            `}</style>
        </>
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
        return <InitialScreen />;
    }

    if (!isSupported) {
        return <UnsupportedScreen />;
    }

    return <Desktop />;
}
