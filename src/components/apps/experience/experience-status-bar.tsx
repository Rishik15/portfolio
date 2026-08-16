import type { Experience } from "@/config/experience";

type ExperienceStatusBarProps = {
    count: number;
    experience: Experience | null;
};

export function ExperienceStatusBar({
    count,
    experience,
}: ExperienceStatusBarProps) {
    return (
        <div className="flex h-9 shrink-0 items-center justify-between border-t border-foreground/10 px-8 text-[11px] text-foreground/35">
            <span className="shrink-0 tabular-nums">
                {count} {count === 1 ? "experience" : "experiences"}
            </span>

            {experience ? (
                <div className=" flex shrink-0 items-center gap-2 tabular-nums text-foreground/40">
                    <span>
                        {experience.highlights.length}{" "}
                        {experience.highlights.length === 1
                            ? "highlight"
                            : "highlights"}
                    </span>

                    <span className="text-foreground/20">·</span>

                    <span>
                        {experience.technologies.length}{" "}
                        {experience.technologies.length === 1
                            ? "technology"
                            : "technologies"}
                    </span>
                </div>
            ) : null}
        </div>
    );
}
