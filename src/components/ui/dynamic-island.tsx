"use client";

import {
    Clock,
    LoaderCircle,
    Pause,
    Play,
    SkipBack,
    SkipForward,
} from "lucide-react";
import {
    AnimatePresence,
    motion,
    useIsPresent,
    useReducedMotion,
} from "motion/react";
import { useState, type MouseEvent } from "react";

import { useMusic } from "@/components/providers/music-provider";
import { MusicCover } from "@/components/ui/music-cover";
import {
    DYNAMIC_ISLAND_MOTION,
    DYNAMIC_ISLAND_UI,
} from "@/components/ui/dynamic-island-ui";

function MusicBars({ playing }: { playing: boolean }) {
    const shouldReduceMotion = useReducedMotion();

    const isStatic = shouldReduceMotion || !playing;

    return (
        <div className={DYNAMIC_ISLAND_UI.bars.root} aria-hidden>
            {DYNAMIC_ISLAND_MOTION.musicBarDelays.map((delay) => (
                <motion.span
                    key={delay}
                    className={DYNAMIC_ISLAND_UI.bars.bar}
                    animate={
                        isStatic
                            ? { scaleY: 0.55 }
                            : { scaleY: [0.35, 1, 0.45, 0.8, 0.35] }
                    }
                    transition={
                        isStatic
                            ? { duration: 0 }
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
        isPlaying,
        isLoading,
        togglePlayback,
        previousTrack,
        nextTrack,
    } = useMusic();

    function control(action: () => void) {
        return (event: MouseEvent) => {
            event.stopPropagation();
            action();
        };
    }

    return (
        <div className={DYNAMIC_ISLAND_UI.player.root}>
            <button
                type="button"
                aria-label="Open Music"
                className="flex min-w-0 flex-1 items-center gap-3 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-500"
            >
                <MusicCover
                    src={currentTrack?.coverUrl ?? null}
                    className={DYNAMIC_ISLAND_UI.player.cover}
                    iconClassName={DYNAMIC_ISLAND_UI.player.musicIcon}
                />

                <span className={DYNAMIC_ISLAND_UI.player.trackInfo}>
                    <span className={`block ${DYNAMIC_ISLAND_UI.player.title}`}>
                        {currentTrack?.title ?? "Music"}
                    </span>

                    <span
                        className={`block ${DYNAMIC_ISLAND_UI.player.artist}`}
                    >
                        {currentTrack?.artist ?? "Audius"}
                    </span>
                </span>
            </button>

            <button
                type="button"
                aria-label="Previous track"
                disabled={!currentTrack || isLoading}
                onClick={control(previousTrack)}
                className={DYNAMIC_ISLAND_UI.player.controlButton}
            >
                <SkipBack className={DYNAMIC_ISLAND_UI.player.controlIcon} />
            </button>

            <button
                type="button"
                aria-label={
                    isLoading ? "Loading music" : isPlaying ? "Pause" : "Play"
                }
                disabled={!currentTrack || isLoading}
                onClick={control(togglePlayback)}
                className={DYNAMIC_ISLAND_UI.player.controlButton}
            >
                {isLoading ? (
                    <LoaderCircle
                        className={`animate-spin ${DYNAMIC_ISLAND_UI.player.controlIcon}`}
                    />
                ) : isPlaying ? (
                    <Pause className={DYNAMIC_ISLAND_UI.player.controlIcon} />
                ) : (
                    <Play className={DYNAMIC_ISLAND_UI.player.controlIcon} />
                )}
            </button>

            <button
                type="button"
                aria-label="Next track"
                disabled={!currentTrack || isLoading}
                onClick={control(nextTrack)}
                className={DYNAMIC_ISLAND_UI.player.controlButton}
            >
                <SkipForward className={DYNAMIC_ISLAND_UI.player.controlIcon} />
            </button>
        </div>
    );
}

function PlayerPill() {
    const { isPlaying, openMusicWindow } = useMusic();

    const [isHovered, setIsHovered] = useState(false);

    const [isFocused, setIsFocused] = useState(false);

    const shouldReduceMotion = useReducedMotion();

    const isPresent = useIsPresent();

    const isExpanded = isPresent && (isHovered || isFocused);

    const bounce = isExpanded
        ? DYNAMIC_ISLAND_MOTION.bounce.compactToMusic
        : DYNAMIC_ISLAND_MOTION.bounce.musicToCompact;

    return (
        <motion.div
            layout
            className={`cursor-pointer ${DYNAMIC_ISLAND_UI.island}`}
            style={{ borderRadius: 32 }}
            onClick={openMusicWindow}
            onHoverStart={() => setIsHovered(true)}
            onHoverEnd={() => setIsHovered(false)}
            onFocus={(event) =>
                setIsFocused(event.target.matches(":focus-visible"))
            }
            onBlur={() => setIsFocused(false)}
            transition={
                shouldReduceMotion
                    ? { duration: 0 }
                    : {
                          bounce,
                          duration:
                              DYNAMIC_ISLAND_MOTION.islandMorphDurationSeconds,
                          type: "spring",
                      }
            }
        >
            {isExpanded ? (
                <MusicPlayer />
            ) : (
                <button
                    type="button"
                    aria-label="Open Music"
                    className={DYNAMIC_ISLAND_UI.openButton}
                >
                    <MusicBars playing={isPlaying} />
                </button>
            )}
        </motion.div>
    );
}

function LimitPill() {
    return (
        <div className={DYNAMIC_ISLAND_UI.island}>
            <p role="status" className={DYNAMIC_ISLAND_UI.limit}>
                <Clock className={DYNAMIC_ISLAND_UI.player.controlIcon} />
                Monthly limit reached
            </p>
        </div>
    );
}

export interface DynamicIslandProps {
    className?: string;
}

export default function DynamicIsland({ className = "" }: DynamicIslandProps) {
    const { pillMode } = useMusic();

    const shouldReduceMotion = useReducedMotion();

    const hidden = shouldReduceMotion
        ? { opacity: 0 }
        : { opacity: 0, scale: 0.35 };

    return (
        <div className={`${DYNAMIC_ISLAND_UI.position} ${className}`}>
            <AnimatePresence mode="wait">
                {pillMode !== "hidden" ? (
                    <motion.div
                        key={pillMode}
                        initial={hidden}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{
                            ...hidden,
                            transition: {
                                duration: shouldReduceMotion
                                    ? 0
                                    : DYNAMIC_ISLAND_MOTION.exitShrinkDurationMs /
                                      1000,
                                ease: [0.4, 0, 0.2, 1],
                            },
                        }}
                        style={{ transformOrigin: "top center" }}
                        transition={{
                            duration: shouldReduceMotion
                                ? 0
                                : DYNAMIC_ISLAND_MOTION.enterDurationMs / 1000,
                            ease: [0.4, 0, 1, 1],
                        }}
                    >
                        {pillMode === "limit" ? <LimitPill /> : <PlayerPill />}
                    </motion.div>
                ) : null}
            </AnimatePresence>
        </div>
    );
}
