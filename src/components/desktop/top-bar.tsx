"use client";

import { useSyncExternalStore } from "react";
import { useTheme } from "next-themes";

import { LiveClock } from "@/components/desktop/live-clock";
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
        <header
            className="
                pointer-events-none
                absolute
                inset-x-0
                top-0
                z-40
                flex
                items-center
                justify-between
                px-10
                py-8
                font-mono
                text-black
                dark:text-white
            "
        >
            <div>
                <h1 className="text-[20px] font-semibold uppercase leading-none tracking-tight">
                    Rishik
                </h1>

                <p className="mt-2 text-[14px] font-normal uppercase leading-none tracking-[0.12em]">
                    Software Engineer
                </p>
            </div>

            <div className="flex items-center gap-4 leading-none">
                <LiveClock />

                <div className="pointer-events-auto flex size-4.5 shrink-0 items-center justify-center">
                    {mounted && (
                        <AnimatedThemeToggler
                            theme={resolvedTheme === "dark" ? "dark" : "light"}
                            onThemeChange={setTheme}
                            duration={800}
                            aria-label="Toggle theme"
                            className="
                                relative
                                -top-px
                                flex
                                size-4.5
                                cursor-pointer
                                items-center
                                justify-center
                                border-0
                                bg-transparent
                                p-0
                                outline-none
                                focus:outline-none
                                focus-visible:outline-none
                                [&_svg]:block
                                [&_svg]:size-4.5
                            "
                        />
                    )}
                </div>
            </div>
        </header>
    );
}
