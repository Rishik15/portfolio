"use client";

import { useSyncExternalStore } from "react";
import { useTheme } from "next-themes";

import { LiveClock } from "@/components/desktop/live-clock";
import { TOP_BAR_UI } from "@/components/desktop/top-bar-ui";
import { AnimatedThemeToggler } from "@/components/ui/animated-theme-toggler";

const emptySubscribe = () => () => {};

export function TopBar() {
    const mounted = useSyncExternalStore(
        emptySubscribe,
        () => true,
        () => false,
    );

    const { resolvedTheme, setTheme } = useTheme();

    return (
        <header className={TOP_BAR_UI.root}>
            <div>
                <h1 className={TOP_BAR_UI.identity.name}>Rishik</h1>

                <p className={TOP_BAR_UI.identity.role}>Software Engineer</p>
            </div>

            <div className={TOP_BAR_UI.right.root}>
                <LiveClock />

                <div className={TOP_BAR_UI.right.themeWrapper}>
                    {mounted && (
                        <AnimatedThemeToggler
                            theme={resolvedTheme === "dark" ? "dark" : "light"}
                            onThemeChange={setTheme}
                            duration={600}
                            aria-label="Toggle theme"
                            className={TOP_BAR_UI.right.themeButton}
                        />
                    )}
                </div>
            </div>
        </header>
    );
}
