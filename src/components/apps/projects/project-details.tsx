import { PROJECTS_UI } from "@/components/apps/projects/projects-ui";
import type { Project } from "@/config/projects";

type ProjectDetailsProps = {
    project: Project;
};

export function ProjectDetails({ project }: ProjectDetailsProps) {
    return (
        <aside
            className={`
                min-w-0

                border-t
                border-foreground/10

                @4xl/projects:border-l
                @4xl/projects:border-t-0

                ${PROJECTS_UI.section.paddingY}
                ${PROJECTS_UI.section.detailsLeftPadding}
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
                Project Details
            </div>

            <dl className={PROJECTS_UI.details.grid}>
                <div>
                    <dt
                        className={`
                            font-medium
                            uppercase
                            tracking-[0.08em]
                            text-foreground/35
                            ${PROJECTS_UI.details.labelText}
                        `}
                    >
                        Status
                    </dt>

                    <dd
                        className={`
                            mt-1
                            text-foreground/70
                            ${PROJECTS_UI.details.valueText}
                        `}
                    >
                        {project.status}
                    </dd>
                </div>

                <div>
                    <dt
                        className={`
                            font-medium
                            uppercase
                            tracking-[0.08em]
                            text-foreground/35
                            ${PROJECTS_UI.details.labelText}
                        `}
                    >
                        Year
                    </dt>

                    <dd
                        className={`
                            mt-1
                            text-foreground/70
                            ${PROJECTS_UI.details.valueText}
                        `}
                    >
                        {project.year}
                    </dd>
                </div>

                <div>
                    <dt
                        className={`
                            font-medium
                            uppercase
                            tracking-[0.08em]
                            text-foreground/35
                            ${PROJECTS_UI.details.labelText}
                        `}
                    >
                        Role
                    </dt>

                    <dd
                        className={`
                            mt-1
                            text-foreground/70
                            ${PROJECTS_UI.details.valueText}
                        `}
                    >
                        {project.role}
                    </dd>
                </div>

                <div>
                    <dt
                        className={`
                            font-medium
                            uppercase
                            tracking-[0.08em]
                            text-foreground/35
                            ${PROJECTS_UI.details.labelText}
                        `}
                    >
                        Built With
                    </dt>

                    <dd
                        className={`
                            mt-1.5
                            text-foreground/60
                            ${PROJECTS_UI.details.technologyText}
                        `}
                    >
                        {project.technologies.join(" · ")}
                    </dd>
                </div>
            </dl>
        </aside>
    );
}
