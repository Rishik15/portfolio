import {
    PROJECTS_LIMITS,
    PROJECTS_UI,
} from "@/components/apps/projects/projects-ui";
import type { Project } from "@/config/projects";

type ProjectOverviewProps = {
    project: Project;
};

export function ProjectOverview({ project }: ProjectOverviewProps) {
    return (
        <section
            className={`
                min-w-0
                ${PROJECTS_UI.section.paddingY}
                ${PROJECTS_UI.section.overviewRightPadding}
            `}
        >
            <div
                className={`
                    font-semibold
                    uppercase
                    tracking-[0.12em]
                    text-foreground/40

                    ${PROJECTS_UI.section.titleMargin}
                    ${PROJECTS_UI.section.titleText}
                `}
            >
                Overview
            </div>

            <p
                className={`
                    max-w-4xl
                    text-foreground/65
                    ${PROJECTS_UI.section.bodyText}
                `}
            >
                {project.description}
            </p>

            {project.highlights.length > 0 && (
                <div
                    className={`
                        grid

                        ${PROJECTS_UI.highlights.marginTop}
                        ${PROJECTS_UI.highlights.grid}
                        ${PROJECTS_UI.highlights.gap}
                    `}
                >
                    {project.highlights
                        .slice(0, PROJECTS_LIMITS.highlights)
                        .map((highlight) => (
                            <div
                                key={`${highlight.label}-${highlight.value}`}
                                className={`
                                    flex
                                    flex-col
                                    justify-center
                                    rounded-lg
                                    border
                                    border-foreground/8
                                    bg-foreground/[0.02]

                                    ${PROJECTS_UI.highlights.card}
                                `}
                            >
                                <div
                                    className={`
                                        font-semibold
                                        tracking-tight
                                        text-foreground/90
                                        ${PROJECTS_UI.highlights.valueText}
                                    `}
                                >
                                    {highlight.value}
                                </div>

                                <div
                                    className={`
                                        mt-1
                                        font-medium
                                        uppercase
                                        tracking-[0.1em]
                                        text-foreground/35
                                        ${PROJECTS_UI.highlights.labelText}
                                    `}
                                >
                                    {highlight.label}
                                </div>
                            </div>
                        ))}
                </div>
            )}
        </section>
    );
}
