"use client";

import { motion, useReducedMotion } from "motion/react";

import { DYNAMIC_ISLAND_MOTION } from "@/components/ui/dynamic-island-ui";

import { MUSIC_UI } from "./music-ui";

type MusicBarsProps = {
    playing: boolean;
};

export function MusicBars({ playing }: MusicBarsProps) {
    const shouldReduceMotion = useReducedMotion();

    const isStatic = shouldReduceMotion || !playing;

    return (
        <div className={MUSIC_UI.bars.root} aria-hidden>
            {DYNAMIC_ISLAND_MOTION.musicBarDelays.slice(0, 3).map((delay) => (
                <motion.span
                    key={delay}
                    className={MUSIC_UI.bars.bar}
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
