import { ArrowUpRight, Building2, CalendarDays, MapPin } from "lucide-react";

import type { Experience } from "@/config/experience";

type ExperienceDetailProps = {
    experience: Experience | null;
};

function EmptyLine({ width }: { width: string }) {
    return (
        <div
            className="h-2.5 rounded-sm bg-foreground/[0.065]"
            style={{ width }}
        />
    );
}

function EmptyDetail() {
    return (
        <div className="mx-auto w-full max-w-3xl px-8 py-8">
            <div className="flex items-start gap-4">
                <div className="min-w-0 flex-1 pt-1">
                    <div className="mb-3">
                        <EmptyLine width="38%" />
                    </div>

                    <EmptyLine width="24%" />
                </div>
            </div>

            <div className="mt-8 border-t border-foreground/10 pt-6">
                <div className="grid grid-cols-2 gap-x-10 gap-y-5">
                    <div>
                        <div className="mb-2 text-[10px] font-medium tracking-[0.08em] text-foreground/35">
                            DATES
                        </div>

                        <EmptyLine width="55%" />
                    </div>

                    <div>
                        <div className="mb-2 text-[10px] font-medium tracking-[0.08em] text-foreground/35">
                            LOCATION
                        </div>

                        <EmptyLine width="50%" />
                    </div>

                    <div>
                        <div className="mb-2 text-[10px] font-medium tracking-[0.08em] text-foreground/35">
                            TYPE
                        </div>

                        <EmptyLine width="35%" />
                    </div>
                </div>
            </div>

            <div className="mt-8 border-t border-foreground/10 pt-6">
                <div className="mb-3 text-[10px] font-medium tracking-[0.08em] text-foreground/35">
                    ABOUT
                </div>

                <div className="space-y-2.5">
                    <EmptyLine width="94%" />
                    <EmptyLine width="88%" />
                    <EmptyLine width="67%" />
                </div>
            </div>

            <div className="mt-8 border-t border-foreground/10 pt-6">
                <div className="mb-3 text-[10px] font-medium tracking-[0.08em] text-foreground/35">
                    HIGHLIGHTS
                </div>

                <div className="space-y-3">
                    {[0, 1, 2].map((item) => (
                        <div key={item} className="flex items-center gap-3">
                            <div className="size-1 shrink-0 rounded-full bg-foreground/15" />

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
            </div>

            <div className="mt-8 border-t border-foreground/10 pt-6">
                <div className="mb-3 text-[10px] font-medium tracking-[0.08em] text-foreground/35">
                    TECHNOLOGIES
                </div>

                <EmptyLine width="48%" />
            </div>
        </div>
    );
}

export function ExperienceDetail({ experience }: ExperienceDetailProps) {
    if (!experience) {
        return (
            <div className="min-h-0 flex-1 overflow-y-auto">
                <EmptyDetail />
            </div>
        );
    }

    return (
        <div className="min-h-0 flex-1 overflow-y-auto">
            <div className="mx-auto w-full max-w-3xl px-8 py-8">
                <div className="flex items-start gap-4">
                    <div className="min-w-0 flex-1">
                        <div className="flex items-start gap-3">
                            <div className="min-w-0 flex-1">
                                <h2 className="truncate text-xl font-semibold tracking-[-0.02em] text-foreground">
                                    {experience.role}
                                </h2>

                                <div className="mt-1 flex items-center gap-1.5 text-[13px] text-foreground/55">
                                    <Building2
                                        className="size-3.5"
                                        strokeWidth={1.6}
                                    />

                                    {experience.companyUrl ? (
                                        <a
                                            href={experience.companyUrl}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="inline-flex min-w-0 items-center gap-1 transition-colors hover:text-foreground"
                                        >
                                            <span className="truncate">
                                                {experience.company}
                                            </span>

                                            <ArrowUpRight
                                                className="size-3"
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
                        </div>
                    </div>
                </div>

                <div className="mt-8 grid grid-cols-2 gap-x-10 gap-y-5 border-t border-foreground/10 pt-6">
                    <div>
                        <div className="mb-1.5 text-[10px] font-medium tracking-[0.08em] text-foreground/35">
                            DATES
                        </div>

                        <div className="flex items-center gap-1.5 text-[12px] text-foreground/65">
                            <CalendarDays
                                className="size-3.5 shrink-0 text-foreground/40"
                                strokeWidth={1.6}
                            />

                            <span>
                                {experience.startDate} — {experience.endDate}
                            </span>
                        </div>
                    </div>

                    <div>
                        <div className="mb-1.5 text-[10px] font-medium tracking-[0.08em] text-foreground/35">
                            LOCATION
                        </div>

                        <div className="flex items-center gap-1.5 text-[12px] text-foreground/65">
                            <MapPin
                                className="size-3.5 shrink-0 text-foreground/40"
                                strokeWidth={1.6}
                            />

                            <span>{experience.location}</span>
                        </div>
                    </div>

                    <div>
                        <div className="mb-1.5 text-[10px] font-medium tracking-[0.08em] text-foreground/35">
                            TYPE
                        </div>

                        <div className="text-[12px] text-foreground/65">
                            {experience.type}
                        </div>
                    </div>
                </div>

                <section className="mt-8 border-t border-foreground/10 pt-6">
                    <div className="mb-3 text-[10px] font-medium tracking-[0.08em] text-foreground/35">
                        ABOUT
                    </div>

                    <p className="max-w-2xl text-[13px] leading-6 text-foreground/65">
                        {experience.summary}
                    </p>
                </section>

                <section className="mt-8 border-t border-foreground/10 pt-6">
                    <div className="mb-3 text-[10px] font-medium tracking-[0.08em] text-foreground/35">
                        HIGHLIGHTS
                    </div>

                    <div className="space-y-3">
                        {experience.highlights.map((highlight) => (
                            <div
                                key={highlight}
                                className="flex items-start gap-3"
                            >
                                <div className="mt-[7px] size-1 shrink-0 rounded-full bg-foreground/35" />

                                <p className="text-[13px] leading-5 text-foreground/65">
                                    {highlight}
                                </p>
                            </div>
                        ))}
                    </div>
                </section>

                <section className="mt-8 border-t border-foreground/10 pt-6">
                    <div className="mb-3 text-[10px] font-medium tracking-[0.08em] text-foreground/35">
                        TECHNOLOGIES
                    </div>

                    <p className="text-[12px] leading-5 text-foreground/60">
                        {experience.technologies.join(" · ")}
                    </p>
                </section>
            </div>
        </div>
    );
}
