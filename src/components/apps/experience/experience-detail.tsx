import { ArrowUpRight } from "lucide-react";

import {
    EXPERIENCE_UI,
    TYPE_STYLES,
} from "@/components/apps/experience/experience-ui";
import { formatRange } from "@/components/apps/experience/experience-time";
import type { Experience } from "@/config/experience";
import { cn } from "@/lib/utils";

type ExperienceDetailProps = {
    experience: Experience;
    onSelectTechnology: (technology: string) => void;
};

export function ExperienceDetail({
    experience,
    onSelectTechnology,
}: ExperienceDetailProps) {
    return (
        <div className={EXPERIENCE_UI.detail.root}>
            <div className={EXPERIENCE_UI.detail.content}>
                <div className="flex min-w-0 flex-col gap-6">
                    <section>
                        <div className={EXPERIENCE_UI.detail.sectionTitle}>
                            ABOUT
                        </div>

                        <p className={EXPERIENCE_UI.detail.body}>
                            {experience.summary}
                        </p>
                    </section>

                    <section>
                        <div className={EXPERIENCE_UI.detail.sectionTitle}>
                            HIGHLIGHTS
                        </div>

                        <div className={EXPERIENCE_UI.detail.highlights}>
                            {experience.highlights.map((highlight) => (
                                <div
                                    key={highlight}
                                    className={
                                        EXPERIENCE_UI.detail.highlightRow
                                    }
                                >
                                    <div
                                        className={
                                            EXPERIENCE_UI.detail.highlightDot
                                        }
                                    />

                                    <p>{highlight}</p>
                                </div>
                            ))}
                        </div>
                    </section>
                </div>

                <aside className={EXPERIENCE_UI.detail.side}>
                    <div>
                        <div className={EXPERIENCE_UI.detail.label}>DATES</div>

                        <div className={EXPERIENCE_UI.detail.value}>
                            {formatRange(experience)}
                        </div>
                    </div>

                    <div>
                        <div className={EXPERIENCE_UI.detail.label}>
                            LOCATION
                        </div>

                        <div className={EXPERIENCE_UI.detail.value}>
                            {experience.location}
                        </div>
                    </div>

                    <div>
                        <div className={EXPERIENCE_UI.detail.label}>TYPE</div>

                        <div className={EXPERIENCE_UI.detail.value}>
                            <span
                                className={cn(
                                    "size-2 shrink-0 translate-y-px rounded-full",
                                    TYPE_STYLES[experience.type].dot,
                                )}
                            />

                            {experience.type}
                        </div>
                    </div>

                    {experience.companyUrl ? (
                        <div>
                            <div className={EXPERIENCE_UI.detail.label}>
                                COMPANY
                            </div>

                            <a
                                href={experience.companyUrl}
                                target="_blank"
                                rel="noreferrer"
                                className={cn(
                                    EXPERIENCE_UI.detail.value,
                                    "transition-colors duration-100 hover:text-foreground",
                                )}
                            >
                                <span className="truncate">
                                    {experience.company}
                                </span>

                                <ArrowUpRight
                                    className="size-3 shrink-0"
                                    strokeWidth={1.6}
                                />
                            </a>
                        </div>
                    ) : null}

                    <div>
                        <div className={EXPERIENCE_UI.detail.label}>
                            TECHNOLOGIES
                        </div>

                        <div className={EXPERIENCE_UI.detail.chips}>
                            {experience.technologies.map((technology) => (
                                <button
                                    key={technology}
                                    type="button"
                                    onClick={() =>
                                        onSelectTechnology(technology)
                                    }
                                    className={EXPERIENCE_UI.detail.chip}
                                >
                                    {technology}
                                </button>
                            ))}
                        </div>
                    </div>
                </aside>
            </div>
        </div>
    );
}
