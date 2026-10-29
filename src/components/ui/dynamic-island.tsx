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
import {
    DYNAMIC_ISLAND_MOTION,
    DYNAMIC_ISLAND_UI,
} from "@/components/ui/dynamic-island-ui";

type View = "compact" | "music";

function MusicBars({ playing }: { playing: boolean }) {
    const shouldReduceMotion = useReducedMotion();

    return (
        <div className={DYNAMIC_ISLAND_UI.bars.root}>
            {DYNAMIC_ISLAND_MOTION.musicBarDelays.map((delay) => (
                <motion.span
                    key={delay}
                    className={DYNAMIC_ISLAND_UI.bars.bar}
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
        <div className={DYNAMIC_ISLAND_UI.player.root}>
            <Music2 className={DYNAMIC_ISLAND_UI.player.musicIcon} />

            <div className={DYNAMIC_ISLAND_UI.player.trackInfo}>
                <p className={DYNAMIC_ISLAND_UI.player.title}>
                    {currentTrack?.title ??
                        (isMusicLoading ? "Loading music..." : "Audius")}
                </p>

                <p className={DYNAMIC_ISLAND_UI.player.artist}>
                    {currentTrack?.artist ?? "Monthly Trending"}
                </p>
            </div>

            <button
                type="button"
                aria-label="Previous track"
                disabled={!currentTrack || isMusicLoading}
                onClick={previousTrack}
                className={DYNAMIC_ISLAND_UI.player.controlButton}
            >
                <SkipBack className={DYNAMIC_ISLAND_UI.player.controlIcon} />
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
                className={DYNAMIC_ISLAND_UI.player.controlButton}
            >
                {isMusicLoading ? (
                    <LoaderCircle
                        className={`
                            animate-spin
                            ${DYNAMIC_ISLAND_UI.player.controlIcon}
                        `}
                    />
                ) : isMusicPlaying ? (
                    <Pause className={DYNAMIC_ISLAND_UI.player.controlIcon} />
                ) : (
                    <Play className={DYNAMIC_ISLAND_UI.player.controlIcon} />
                )}
            </button>

            <button
                type="button"
                aria-label="Next track"
                disabled={!currentTrack || isMusicLoading}
                onClick={nextTrack}
                className={DYNAMIC_ISLAND_UI.player.controlButton}
            >
                <SkipForward className={DYNAMIC_ISLAND_UI.player.controlIcon} />
            </button>
        </div>
    );
}

type VisibleDynamicIslandProps = {
    className?: string;
};

function VisibleDynamicIsland({ className = "" }: VisibleDynamicIslandProps) {
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
            ? DYNAMIC_ISLAND_MOTION.bounce.compactToMusic
            : DYNAMIC_ISLAND_MOTION.bounce.musicToCompact;

    useEffect(() => {
        const collapseTimeout = window.setTimeout(() => {
            if (hoveredRef.current || isMusicClosing) {
                return;
            }

            setView("compact");
        }, DYNAMIC_ISLAND_MOTION.autoCollapseDelayMs);

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
        }, DYNAMIC_ISLAND_MOTION.exitToPillDelayMs);

        const hideTimeout = window.setTimeout(() => {
            finishHideMusic();
        }, DYNAMIC_ISLAND_MOTION.exitToPillDelayMs + DYNAMIC_ISLAND_MOTION.exitShrinkDurationMs);

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
        <div
            className={`
                ${DYNAMIC_ISLAND_UI.position}
                ${className}
            `}
        >
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
                              duration:
                                  DYNAMIC_ISLAND_MOTION.exitShrinkDurationMs /
                                  1000,
                              ease: [0.4, 0, 1, 1],
                          }
                }
                style={{
                    transformOrigin: "top center",
                }}
            >
                <motion.div
                    className={DYNAMIC_ISLAND_UI.island}
                    layout
                    onHoverStart={handleHoverStart}
                    onHoverEnd={handleHoverEnd}
                    style={{
                        borderRadius: 32,
                    }}
                    transition={
                        shouldReduceMotion
                            ? {
                                  duration: 0,
                              }
                            : {
                                  bounce:
                                      bounce ??
                                      DYNAMIC_ISLAND_MOTION.bounce.fallback,
                                  duration:
                                      DYNAMIC_ISLAND_MOTION.islandMorphDurationSeconds,
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
                                      bounce:
                                          bounce ??
                                          DYNAMIC_ISLAND_MOTION.bounce.fallback,
                                      duration:
                                          DYNAMIC_ISLAND_MOTION.contentMorphDurationSeconds,
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
