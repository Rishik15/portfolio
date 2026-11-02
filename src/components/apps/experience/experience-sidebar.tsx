"use client";

import {
    EXPERIENCE_UI,
    TYPE_STYLES,
} from "@/components/apps/experience/experience-ui";
import type { Experience, ExperienceType } from "@/config/experience";
import { cn } from "@/lib/utils";

type ExperienceSidebarProps = {
    experiences: readonly Experience[];
    hiddenTypes: ReadonlySet<ExperienceType>;
    ongoing: readonly Experience[];
    onToggleType: (type: ExperienceType) => void;
    onOpen: (id: string) => void;
};

export function ExperienceSidebar({
    experiences,
    hiddenTypes,
    ongoing,
    onToggleType,
    onOpen,
}: ExperienceSidebarProps) {
    const types = [...new Set(experiences.map((e) => e.type))];

    return (
        <aside className={EXPERIENCE_UI.sidebar.root}>
            <section className="w-full">
                <div className={EXPERIENCE_UI.sidebar.heading}>CALENDARS</div>

                {types.map((type) => {
                    const hidden = hiddenTypes.has(type);

                    return (
                        <button
                            key={type}
                            type="button"
                            aria-pressed={!hidden}
                            title={type}
                            onClick={() => onToggleType(type)}
                            className={cn(
                                EXPERIENCE_UI.sidebar.row,
                                hidden && EXPERIENCE_UI.sidebar.rowOff,
                            )}
                        >
                            <span
                                className={cn(
                                    EXPERIENCE_UI.sidebar.dot,
                                    hidden
                                        ? EXPERIENCE_UI.sidebar.dotOff
                                        : TYPE_STYLES[type].dot,
                                )}
                            />

                            <span className={EXPERIENCE_UI.sidebar.label}>
                                {type}
                            </span>

                            <span className={EXPERIENCE_UI.sidebar.count}>
                                {
                                    experiences.filter((e) => e.type === type)
                                        .length
                                }
                            </span>
                        </button>
                    );
                })}
            </section>

            {ongoing.length > 0 ? (
                <section className="w-full">
                    <div className={EXPERIENCE_UI.sidebar.heading}>ONGOING</div>

                    {ongoing.map((experience) => (
                        <button
                            key={experience.id}
                            type="button"
                            title={experience.role}
                            onClick={() => onOpen(experience.id)}
                            className={EXPERIENCE_UI.sidebar.row}
                        >
                            <span
                                className={cn(
                                    EXPERIENCE_UI.sidebar.dot,
                                    TYPE_STYLES[experience.type].dot,
                                )}
                            />

                            <span className={EXPERIENCE_UI.sidebar.label}>
                                {experience.role}
                            </span>
                        </button>
                    ))}
                </section>
            ) : null}
        </aside>
    );
}
