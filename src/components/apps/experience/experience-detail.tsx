import { ArrowUpRight, Building2, CalendarDays, MapPin } from "lucide-react";

import { EXPERIENCE_UI } from "@/components/apps/experience/experience-ui";
import type { Experience } from "@/config/experience";

type ExperienceDetailProps = {
    experience: Experience | null;
};

function EmptyLine({ width }: { width: string }) {
    return <div className={EXPERIENCE_UI.detail.emptyLine} style={{ width }} />;
}

function EmptyDetail() {
    return (
        <div className={EXPERIENCE_UI.detail.content}>
            <div className="min-w-0">
                <div className="mb-3">
                    <EmptyLine width="38%" />
                </div>

                <EmptyLine width="24%" />
            </div>

            <div className={EXPERIENCE_UI.detail.metadata}>
                <div>
                    <div className={EXPERIENCE_UI.detail.label}>DATES</div>

                    <EmptyLine width="55%" />
                </div>

                <div>
                    <div className={EXPERIENCE_UI.detail.label}>LOCATION</div>

                    <EmptyLine width="50%" />
                </div>

                <div>
                    <div className={EXPERIENCE_UI.detail.label}>TYPE</div>

                    <EmptyLine width="35%" />
                </div>
            </div>

            <section className={EXPERIENCE_UI.detail.section}>
                <div className={EXPERIENCE_UI.detail.sectionTitle}>ABOUT</div>

                <div className="space-y-2.5">
                    <EmptyLine width="94%" />
                    <EmptyLine width="88%" />
                    <EmptyLine width="67%" />
                </div>
            </section>

            <section className={EXPERIENCE_UI.detail.section}>
                <div className={EXPERIENCE_UI.detail.sectionTitle}>
                    HIGHLIGHTS
                </div>

                <div className={EXPERIENCE_UI.detail.highlights}>
                    {[0, 1, 2].map((item) => (
                        <div
                            key={item}
                            className={EXPERIENCE_UI.detail.highlightRow}
                        >
                            <div
                                className={EXPERIENCE_UI.detail.highlightDot}
                            />

                            <EmptyLine
                                width={
                                    item === 0
                                        ? "76%"
                                        : item === 1
                                          ? "84%"
                                          : "61%"
                                }
                            />
                        </div>
                    ))}
                </div>
            </section>

            <section className={EXPERIENCE_UI.detail.section}>
                <div className={EXPERIENCE_UI.detail.sectionTitle}>
                    TECHNOLOGIES
                </div>

                <EmptyLine width="48%" />
            </section>
        </div>
    );
}

export function ExperienceDetail({ experience }: ExperienceDetailProps) {
    if (!experience) {
        return (
            <div className={EXPERIENCE_UI.detail.root}>
                <EmptyDetail />
            </div>
        );
    }

    return (
        <div className={EXPERIENCE_UI.detail.root}>
            <div className={EXPERIENCE_UI.detail.content}>
                <div className="min-w-0">
                    <h2 className={EXPERIENCE_UI.detail.role}>
                        {experience.role}
                    </h2>

                    <div className={EXPERIENCE_UI.detail.companyRow}>
                        <Building2
                            className={EXPERIENCE_UI.detail.companyIcon}
                            strokeWidth={1.6}
                        />

                        {experience.companyUrl ? (
                            <a
                                href={experience.companyUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="
                                    inline-flex
                                    min-w-0
                                    items-center
                                    gap-1

                                    transition-colors
                                    duration-100

                                    hover:text-foreground
                                "
                            >
                                <span className="truncate">
                                    {experience.company}
                                </span>

                                <ArrowUpRight
                                    className={
                                        EXPERIENCE_UI.detail.externalIcon
                                    }
                                    strokeWidth={1.6}
                                />
                            </a>
                        ) : (
                            <span className="truncate">
                                {experience.company}
                            </span>
                        )}
                    </div>
                </div>

                <div className={EXPERIENCE_UI.detail.metadata}>
                    <div>
                        <div className={EXPERIENCE_UI.detail.label}>DATES</div>

                        <div className={EXPERIENCE_UI.detail.metadataValue}>
                            <CalendarDays
                                className={EXPERIENCE_UI.detail.metadataIcon}
                                strokeWidth={1.6}
                            />

                            <span className="min-w-0">
                                {experience.startDate} — {experience.endDate}
                            </span>
                        </div>
                    </div>

                    <div>
                        <div className={EXPERIENCE_UI.detail.label}>
                            LOCATION
                        </div>

                        <div className={EXPERIENCE_UI.detail.metadataValue}>
                            <MapPin
                                className={EXPERIENCE_UI.detail.metadataIcon}
                                strokeWidth={1.6}
                            />

                            <span className="min-w-0">
                                {experience.location}
                            </span>
                        </div>
                    </div>

                    <div>
                        <div className={EXPERIENCE_UI.detail.label}>TYPE</div>

                        <div className={EXPERIENCE_UI.detail.metadataValue}>
                            {experience.type}
                        </div>
                    </div>
                </div>

                <section className={EXPERIENCE_UI.detail.section}>
                    <div className={EXPERIENCE_UI.detail.sectionTitle}>
                        ABOUT
                    </div>

                    <p className={EXPERIENCE_UI.detail.summary}>
                        {experience.summary}
                    </p>
                </section>

                <section className={EXPERIENCE_UI.detail.section}>
                    <div className={EXPERIENCE_UI.detail.sectionTitle}>
                        HIGHLIGHTS
                    </div>

                    <div className={EXPERIENCE_UI.detail.highlights}>
                        {experience.highlights.map((highlight) => (
                            <div
                                key={highlight}
                                className={EXPERIENCE_UI.detail.highlightRow}
                            >
                                <div
                                    className={
                                        EXPERIENCE_UI.detail.highlightDot
                                    }
                                />

                                <p
                                    className={
                                        EXPERIENCE_UI.detail.highlightText
                                    }
                                >
                                    {highlight}
                                </p>
                            </div>
                        ))}
                    </div>
                </section>

                <section className={EXPERIENCE_UI.detail.section}>
                    <div className={EXPERIENCE_UI.detail.sectionTitle}>
                        TECHNOLOGIES
                    </div>

                    <p className={EXPERIENCE_UI.detail.technologies}>
                        {experience.technologies.join(" · ")}
                    </p>
                </section>
            </div>
        </div>
    );
}
