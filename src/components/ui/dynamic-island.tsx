"use client";

import {
    LoaderCircle,
    Music2,
    Pause,
    Play,
    SkipBack,
    SkipForward,
} from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";

import { useMusic } from "@/components/providers/music-provider";

const BOUNCE_VARIANTS = {
    "compact-music": 0.42,
    "music-compact": 0.34,
} as const;

const DEFAULT_BOUNCE = 0.4;

const MUSIC_BAR_DELAYS = [0, 0.1, 0.2, 0.3] as const;

const AUTO_COLLAPSE_DELAY_MS = 1000;

const ISLAND_MORPH_DURATION_SECONDS = 0.25;

const CONTENT_MORPH_DURATION_SECONDS = 0.23;

const EXIT_TO_PILL_DELAY_MS = 130;
const EXIT_SHRINK_DURATION_MS = 120;

type View = "compact" | "music";

function MusicBars({ playing }: { playing: boolean }) {
    const shouldReduceMotion = useReducedMotion();

    return (
        <div className="flex items-center justify-center gap-1 px-3 py-2">
            {MUSIC_BAR_DELAYS.map((delay) => (
                <motion.span
                    key={delay}
                    className="h-4 w-[3px] origin-center rounded-full bg-pink-500"
                    animate={
                        shouldReduceMotion || !playing
                            ? {
                                  scaleY: 0.55,
                              }
                            : {
                                  scaleY: [0.35, 1, 0.45, 0.8, 0.35],
                              }
                    }
                    transition={
                        shouldReduceMotion || !playing
                            ? {
                                  duration: 0,
                              }
                            : {
                                  delay,
                                  duration: 0.75,
                                  ease: "easeInOut",
                                  repeat: Infinity,
                              }
                    }
                />
            ))}
        </div>
    );
}

function MusicPlayer() {
    const {
        currentTrack,
        isMusicPlaying,
        isMusicLoading,
        playMusic,
        pauseMusic,
        previousTrack,
        nextTrack,
    } = useMusic();

    return (
        <div className="flex w-72 items-center gap-3 overflow-hidden px-4 py-2 text-white dark:text-black">
            <Music2 className="h-5 w-5 shrink-0 text-pink-500" />

            <div className="min-w-0 flex-1">
                <p className="pointer-events-none truncate text-sm font-medium text-white dark:text-black">
                    {currentTrack?.title ??
                        (isMusicLoading ? "Loading music..." : "Audius")}
                </p>

                <p className="pointer-events-none truncate text-xs text-white/70 dark:text-black/60">
                    {currentTrack?.artist ?? "Monthly Trending"}
                </p>
            </div>

            <button
                type="button"
                aria-label="Previous track"
                disabled={!currentTrack || isMusicLoading}
                onClick={previousTrack}
                className="
                    rounded-full
                    p-1
                    text-white
                    transition-colors
                    hover:bg-white/30
                    disabled:cursor-default
                    disabled:opacity-35
                    dark:text-black
                    dark:hover:bg-black/10
                "
            >
                <SkipBack className="h-4 w-4" />
            </button>

            <button
                type="button"
                aria-label={
                    isMusicLoading
                        ? "Loading music"
                        : isMusicPlaying
                          ? "Pause"
                          : "Play"
                }
                disabled={!currentTrack || isMusicLoading}
                onClick={isMusicPlaying ? pauseMusic : playMusic}
                className="
                    rounded-full
                    p-1
                    text-white
                    transition-colors
                    hover:bg-white/30
                    disabled:cursor-default
                    dark:text-black
                    dark:hover:bg-black/10
                "
            >
                {isMusicLoading ? (
                    <LoaderCircle className="h-4 w-4 animate-spin" />
                ) : isMusicPlaying ? (
                    <Pause className="h-4 w-4" />
                ) : (
                    <Play className="h-4 w-4" />
                )}
            </button>

            <button
                type="button"
                aria-label="Next track"
                disabled={!currentTrack || isMusicLoading}
                onClick={nextTrack}
                className="
                    rounded-full
                    p-1
                    text-white
                    transition-colors
                    hover:bg-white/30
                    disabled:cursor-default
                    disabled:opacity-35
                    dark:text-black
                    dark:hover:bg-black/10
                "
            >
                <SkipForward className="h-4 w-4" />
            </button>
        </div>
    );
}

type VisibleDynamicIslandProps = {
    className: string;
};

function VisibleDynamicIsland({ className }: VisibleDynamicIslandProps) {
    const {
        isMusicPlaying,
        isMusicClosing,
        requestCloseMusic,
        finishHideMusic,
    } = useMusic();

    const [view, setView] = useState<View>("music");

    const [isDisappearing, setIsDisappearing] = useState(false);

    const hoveredRef = useRef(false);

    const shouldReduceMotion = useReducedMotion();

    const visibleView: View = isMusicClosing ? "compact" : view;

    const bounce =
        visibleView === "music"
            ? BOUNCE_VARIANTS["compact-music"]
            : BOUNCE_VARIANTS["music-compact"];

    useEffect(() => {
        const collapseTimeout = window.setTimeout(() => {
            if (hoveredRef.current || isMusicClosing) {
                return;
            }

            setView("compact");
        }, AUTO_COLLAPSE_DELAY_MS);

        return () => {
            window.clearTimeout(collapseTimeout);
        };
    }, [isMusicClosing]);

    useEffect(() => {
        if (!isMusicClosing) {
            return;
        }

        if (shouldReduceMotion) {
            const hideTimeout = window.setTimeout(() => {
                finishHideMusic();
            }, 0);

            return () => {
                window.clearTimeout(hideTimeout);
            };
        }

        const disappearTimeout = window.setTimeout(() => {
            setIsDisappearing(true);
        }, EXIT_TO_PILL_DELAY_MS);

        const hideTimeout = window.setTimeout(() => {
            finishHideMusic();
        }, EXIT_TO_PILL_DELAY_MS + EXIT_SHRINK_DURATION_MS);

        return () => {
            window.clearTimeout(disappearTimeout);

            window.clearTimeout(hideTimeout);
        };
    }, [finishHideMusic, isMusicClosing, shouldReduceMotion]);

    function handleHoverStart() {
        hoveredRef.current = true;

        if (isMusicClosing) {
            return;
        }

        setView("music");
    }

    function handleHoverEnd() {
        hoveredRef.current = false;

        if (isMusicClosing) {
            return;
        }

        if (!isMusicPlaying) {
            requestCloseMusic();
            return;
        }

        setView("compact");
    }

    return (
        <div className={className}>
            <motion.div
                animate={
                    isDisappearing
                        ? {
                              opacity: 0,
                              scale: 0.35,
                          }
                        : {
                              opacity: 1,
                              scale: 1,
                          }
                }
                transition={
                    shouldReduceMotion
                        ? {
                              duration: 0,
                          }
                        : {
                              duration: EXIT_SHRINK_DURATION_MS / 1000,
                              ease: [0.4, 0, 1, 1],
                          }
                }
                style={{
                    transformOrigin: "top center",
                }}
            >
                <motion.div
                    className="
                        mx-auto
                        w-fit
                        min-w-25
                        overflow-hidden
                        rounded-[32px]
                        bg-black
                        dark:bg-white
                    "
                    layout
                    onHoverStart={handleHoverStart}
                    onHoverEnd={handleHoverEnd}
                    style={{
                        borderRadius: 48,
                    }}
                    transition={
                        shouldReduceMotion
                            ? {
                                  duration: 0,
                              }
                            : {
                                  bounce: bounce ?? DEFAULT_BOUNCE,
                                  duration: ISLAND_MORPH_DURATION_SECONDS,
                                  type: "spring" as const,
                              }
                    }
                >
                    <motion.div
                        key={visibleView}
                        animate={
                            shouldReduceMotion
                                ? {
                                      opacity: 1,
                                      scale: 1,
                                  }
                                : {
                                      filter: "blur(0px)",
                                      opacity: 1,
                                      originX: 0.5,
                                      originY: 0.5,
                                      scale: 1,
                                  }
                        }
                        initial={
                            shouldReduceMotion
                                ? false
                                : {
                                      filter: "blur(4px)",
                                      opacity: 0,
                                      originX: 0.5,
                                      originY: 0.5,
                                      scale: 0.94,
                                  }
                        }
                        transition={
                            shouldReduceMotion
                                ? {
                                      duration: 0,
                                  }
                                : {
                                      bounce: bounce ?? DEFAULT_BOUNCE,
                                      duration: CONTENT_MORPH_DURATION_SECONDS,
                                      type: "spring" as const,
                                  }
                        }
                    >
                        {visibleView === "music" ? (
                            <MusicPlayer />
                        ) : (
                            <MusicBars playing={isMusicPlaying} />
                        )}
                    </motion.div>
                </motion.div>
            </motion.div>
        </div>
    );
}

export interface DynamicIslandProps {
    className?: string;
}

export default function DynamicIsland({ className = "" }: DynamicIslandProps) {
    const { isMusicVisible } = useMusic();

    if (!isMusicVisible) {
        return null;
    }

    return <VisibleDynamicIsland className={className} />;
}
