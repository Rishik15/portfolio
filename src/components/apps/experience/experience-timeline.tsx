"use client";

import {
    EXPERIENCE_UI,
    TYPE_STYLES,
} from "@/components/apps/experience/experience-ui";
import {
    assignLanes,
    formatRange,
    getSpan,
    toMonthIndex,
} from "@/components/apps/experience/experience-time";
import type { Experience, ExperienceType } from "@/config/experience";
import { cn } from "@/lib/utils";

type ExperienceTimelineProps = {
    experiences: readonly Experience[];
    hiddenTypes: ReadonlySet<ExperienceType>;
    year: number;
    onOpen: (id: string) => void;
    onSelectYear: (year: number) => void;
};

const STRIP_TOP = 24;
const STRIP_PITCH = 11;

export function ExperienceTimeline({
    experiences,
    hiddenTypes,
    year,
    onOpen,
    onSelectYear,
}: ExperienceTimelineProps) {
    const { first, last } = getSpan(experiences);
    const total = last - first + 1;
    const percent = (month: number) => ((month - first) / total) * 100;

    const lanes = assignLanes(
        experiences.map((experience) => ({
            experience,
            start: toMonthIndex(experience.startDate),
            end: toMonthIndex(experience.endDate),
        })),
    );

    const years: number[] = [];

    for (let y = Math.floor(first / 12); y <= Math.floor(last / 12); y++) {
        years.push(y);
    }

    return (
        <div className={EXPERIENCE_UI.timeline.root}>
            <div className={EXPERIENCE_UI.timeline.track}>
                {years.map((y) => {
                    const start = Math.max(y * 12, first);

                    return (
                        <button
                            key={y}
                            type="button"
                            aria-label={`Show ${y}`}
                            aria-current={y === year}
                            onClick={() => onSelectYear(y)}
                            className={cn(
                                EXPERIENCE_UI.timeline.year,
                                y === year && EXPERIENCE_UI.timeline.yearActive,
                            )}
                            style={{
                                left: `calc(${percent(start)}% + ${start === first ? 0 : 6}px)`,
                            }}
                        >
                            {y}
                        </button>
                    );
                })}

                {years.slice(1).map((y) => (
                    <div
                        key={y}
                        className={EXPERIENCE_UI.timeline.divider}
                        style={{ left: `${percent(y * 12)}%` }}
                    />
                ))}

                {lanes
                    .filter(
                        ({ item }) => !hiddenTypes.has(item.experience.type),
                    )
                    .map(({ item, lane }) => (
                        <div
                            key={item.experience.id}
                            className="absolute"
                            style={{
                                left: `${percent(item.start)}%`,
                                width: `${((item.end - item.start + 1) / total) * 100}%`,
                                top: STRIP_TOP + lane * STRIP_PITCH,
                            }}
                        >
                            <button
                                type="button"
                                aria-label={`${item.experience.role}, ${formatRange(item.experience)}`}
                                onClick={() => onOpen(item.experience.id)}
                                className={cn(
                                    EXPERIENCE_UI.timeline.strip,
                                    TYPE_STYLES[item.experience.type].strip,
                                )}
                            />
                        </div>
                    ))}
            </div>
        </div>
    );
}
