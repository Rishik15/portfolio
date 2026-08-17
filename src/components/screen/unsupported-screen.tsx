"use client";

import {
    Laptop,
    Monitor,
    MonitorUp,
    Tablet,
    type LucideIcon,
} from "lucide-react";
import { useTheme } from "next-themes";
import { useSyncExternalStore } from "react";

import { UNSUPPORTED_SCREEN_UI } from "@/components/screen/unsupported-screen-ui";
import { AnimatedThemeToggler } from "@/components/ui/animated-theme-toggler";

type SupportedDevice = {
    label: string;
    size: string;
    description: string;
    icon: LucideIcon;
};

const emptySubscribe = () => () => {};

const SUPPORTED_DEVICES: readonly SupportedDevice[] = [
    {
        label: "Tablet",
        size: "720px+",
        description: "Large tablet displays",
        icon: Tablet,
    },
    {
        label: "Laptop",
        size: "1024px+",
        description: "Laptops and notebooks",
        icon: Laptop,
    },
    {
        label: "Desktop",
        size: "1440px+",
        description: "Desktop and larger displays",
        icon: Monitor,
    },
];

export function UnsupportedScreen() {
    const mounted = useSyncExternalStore(
        emptySubscribe,
        () => true,
        () => false,
    );

    const { resolvedTheme, setTheme } = useTheme();

    return (
        <main className={UNSUPPORTED_SCREEN_UI.root}>
            <div className={UNSUPPORTED_SCREEN_UI.theme.position}>
                <div className={UNSUPPORTED_SCREEN_UI.theme.wrapper}>
                    {mounted && (
                        <AnimatedThemeToggler
                            theme={resolvedTheme === "dark" ? "dark" : "light"}
                            onThemeChange={setTheme}
                            duration={600}
                            aria-label="Toggle theme"
                            className={UNSUPPORTED_SCREEN_UI.theme.button}
                        />
                    )}
                </div>
            </div>

            <div className={UNSUPPORTED_SCREEN_UI.layout}>
                <div className={UNSUPPORTED_SCREEN_UI.content}>
                    <div className="mb-5 text-center">
                        <p className="text-[15px] font-semibold text-foreground">
                            Rishik Yesgari
                        </p>

                        <p className="mt-0.5 text-[12px] text-foreground/60">
                            Software Engineer
                        </p>
                    </div>

                    <h1 className={UNSUPPORTED_SCREEN_UI.hero.heading}>
                        A little more room, please.
                    </h1>

                    <p className={UNSUPPORTED_SCREEN_UI.hero.description}>
                        This portfolio is built as an interactive desktop
                        experience. Open
                        it on a larger screen to explore everything properly.
                    </p>

                    <nav
                        className="mt-5 flex items-center justify-center gap-2"
                        aria-label="Rishik Yesgari profiles"
                    >
                        <a
                            href="https://github.com/Rishik15"
                            target="_blank"
                            rel="noreferrer"
                            className="
                                inline-flex
                                items-center
                                rounded-lg
                                border
                                border-foreground/15
                                px-3
                                py-2
                                text-[12px]
                                font-medium
                                text-foreground/75
                                transition-colors
                                duration-150
                                hover:bg-foreground/5
                                hover:text-foreground
                            "
                        >
                            GitHub
                        </a>

                        <a
                            href="https://www.linkedin.com/in/rishikreddyyesgari"
                            target="_blank"
                            rel="noreferrer"
                            className="
                                inline-flex
                                items-center
                                rounded-lg
                                border
                                border-foreground/15
                                px-3
                                py-2
                                text-[12px]
                                font-medium
                                text-foreground/75
                                transition-colors
                                duration-150
                                hover:bg-foreground/5
                                hover:text-foreground
                            "
                        >
                            LinkedIn
                        </a>
                    </nav>

                    <section
                        className={UNSUPPORTED_SCREEN_UI.support.section}
                        aria-labelledby="supported-devices"
                    >
                        <p
                            id="supported-devices"
                            className={UNSUPPORTED_SCREEN_UI.support.label}
                        >
                            Designed for
                        </p>

                        <div className={UNSUPPORTED_SCREEN_UI.support.grid}>
                            {SUPPORTED_DEVICES.map((device) => {
                                const Icon = device.icon;

                                return (
                                    <div
                                        key={device.label}
                                        className={
                                            UNSUPPORTED_SCREEN_UI.support.card
                                        }
                                    >
                                        <div
                                            className={
                                                UNSUPPORTED_SCREEN_UI.support
                                                    .iconWrapper
                                            }
                                        >
                                            <Icon
                                                className={
                                                    UNSUPPORTED_SCREEN_UI
                                                        .support.icon
                                                }
                                                strokeWidth={1.6}
                                                aria-hidden="true"
                                            />
                                        </div>

                                        <div
                                            className={
                                                UNSUPPORTED_SCREEN_UI.support
                                                    .info
                                            }
                                        >
                                            <div
                                                className={
                                                    UNSUPPORTED_SCREEN_UI
                                                        .support.device
                                                }
                                            >
                                                {device.label}
                                            </div>

                                            <div
                                                className={
                                                    UNSUPPORTED_SCREEN_UI
                                                        .support.size
                                                }
                                            >
                                                {device.size}
                                            </div>

                                            <div
                                                className={
                                                    UNSUPPORTED_SCREEN_UI
                                                        .support.description
                                                }
                                            >
                                                {device.description}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </section>

                    <div className={UNSUPPORTED_SCREEN_UI.footer.root}>
                        
                        <span>
                            Try a tablet, laptop, desktop, or larger display.
                        </span>
                    </div>
                </div>
            </div>
        </main>
    );
}
