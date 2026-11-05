"use client";

import { AnimatePresence, motion } from "motion/react";

import {
    EXPERIENCE_UI,
    TYPE_STYLES,
} from "@/components/apps/experience/experience-ui";
import { matchesQuery } from "@/components/apps/experience/experience-search";
import {
    MONTH_LABELS,
    currentMonthIndex,
    formatRange,
    isOngoing,
    placeForYear,
} from "@/components/apps/experience/experience-time";
import type { Experience } from "@/config/experience";
import { cn } from "@/lib/utils";
import { useReducedMotion } from "@/lib/use-reduced-motion";

type ExperienceCalendarProps = {
    experiences: readonly Experience[];
    year: number;
    direction: number;
    query: string;
    onOpen: (id: string) => void;
};

const SLIDE_SPRING = { type: "spring", stiffness: 380, damping: 36 } as const;

export function ExperienceCalendar({
    experiences,
    year,
    direction,
    query,
    onOpen,
}: ExperienceCalendarProps) {
    const reduced = useReducedMotion();
    const now = currentMonthIndex();
    const nowColumn =
        now >= year * 12 && now < year * 12 + 12 ? now - year * 12 : -1;
    const placed = placeForYear(experiences, year);
    const laneCount = Math.max(1, ...placed.map((item) => item.lane + 1));

    return (
        <div className={EXPERIENCE_UI.calendar.root}>
            <div className={EXPERIENCE_UI.calendar.months}>
                {MONTH_LABELS.map((label, index) => (
                    <div
                        key={label}
                        className={cn(
                            EXPERIENCE_UI.calendar.month,
                            index === nowColumn &&
                                EXPERIENCE_UI.calendar.monthNow,
                        )}
                    >
                        {label}
                    </div>
                ))}
            </div>

            <div className={EXPERIENCE_UI.calendar.stage}>
                <AnimatePresence
                    mode="popLayout"
                    initial={false}
                    custom={direction}
                >
                    <motion.div
                        key={year}
                        custom={direction}
                        className={EXPERIENCE_UI.calendar.slide}
                        variants={{
                            enter: (dir: number) => ({
                                x: reduced ? 0 : dir * 48,
                                opacity: 0,
                            }),
                            center: { x: 0, opacity: 1 },
                            exit: (dir: number) => ({
                                x: reduced ? 0 : dir * -48,
                                opacity: 0,
                            }),
                        }}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        transition={reduced ? { duration: 0 } : SLIDE_SPRING}
                    >
                        <div className={EXPERIENCE_UI.calendar.columns}>
                            {MONTH_LABELS.map((label, index) => (
                                <div
                                    key={label}
                                    className={cn(
                                        EXPERIENCE_UI.calendar.column,
                                        index === nowColumn &&
                                            EXPERIENCE_UI.calendar.columnNow,
                                    )}
                                />
                            ))}
                        </div>

                        {nowColumn >= 0 ? (
                            <div
                                className={EXPERIENCE_UI.calendar.nowLine}
                                style={{
                                    left: `${((nowColumn + 0.5) / 12) * 100}%`,
                                }}
                            >
                                <div
                                    className={EXPERIENCE_UI.calendar.nowDot}
                                />
                            </div>
                        ) : null}

                        <div
                            className={EXPERIENCE_UI.calendar.lanes}
                            style={{
                                gridTemplateRows: `repeat(${laneCount}, minmax(34px, 48px))`,
                            }}
                        >
                            {placed.map((item) => {
                                const { experience } = item;
                                const matches = matchesQuery(experience, query);
                                const ongoing = isOngoing(experience);

                                return (
                                    <motion.button
                                        key={experience.id}
                                        type="button"
                                        data-role-id={experience.id}
                                        onClick={() => onOpen(experience.id)}
                                        title={`${experience.role} · ${formatRange(experience)}`}
                                        className={cn(
                                            EXPERIENCE_UI.calendar.bar,
                                            TYPE_STYLES[experience.type].bar,
                                            !item.clippedStart &&
                                                "rounded-l-lg",
                                            !item.clippedEnd && "rounded-r-lg",
                                        )}
                                        style={{
                                            gridColumn: `${item.startColumn + 1} / ${item.endColumn + 2}`,
                                            gridRow: item.lane + 1,
                                        }}
                                        initial={
                                            reduced
                                                ? false
                                                : {
                                                      clipPath:
                                                          "inset(0 100% 0 0)",
                                                  }
                                        }
                                        animate={{
                                            clipPath:
                                                "inset(-8px -8px -8px -8px)",
                                            opacity: matches ? 1 : 0.25,
                                        }}
                                        transition={{
                                            duration: 0.45,
                                            ease: [0.22, 1, 0.36, 1],
                                            delay: reduced
                                                ? 0
                                                : item.lane * 0.07,
                                        }}
                                        whileHover={
                                            reduced ? undefined : { y: -2 }
                                        }
                                        whileTap={
                                            reduced
                                                ? undefined
                                                : { scale: 0.99 }
                                        }
                                    >
                                        <span
                                            className={
                                                EXPERIENCE_UI.calendar.barRole
                                            }
                                        >
                                            {experience.role}
                                        </span>
                                        <span
                                            className={
                                                EXPERIENCE_UI.calendar.barRange
                                            }
                                        >
                                            {ongoing ? "Present · " : ""}
                                            {formatRange(experience)}
                                        </span>
                                    </motion.button>
                                );
                            })}
                        </div>
                    </motion.div>
                </AnimatePresence>
            </div>

            <motion.div
                className={EXPERIENCE_UI.calendar.hint}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
            >
                Click a role to see details
            </motion.div>
        </div>
    );
}
