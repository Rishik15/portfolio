import { EXPERIENCE_UI } from "@/components/apps/experience/experience-ui";
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
        <div className={EXPERIENCE_UI.status.root}>
            <span className="shrink-0 tabular-nums">
                {count} {count === 1 ? "experience" : "experiences"}
            </span>

            {experience ? (
                <div className={EXPERIENCE_UI.status.stats}>
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
