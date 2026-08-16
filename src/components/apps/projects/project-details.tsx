import type { Project } from "@/config/projects";

type ProjectDetailsProps = {
    project: Project;
};

export function ProjectDetails({ project }: ProjectDetailsProps) {
    return (
        <aside className="min-w-0 border-l border-foreground/10 py-5 pl-6">
            <div className="mb-4 text-[10px] font-semibold uppercase tracking-[0.12em] text-foreground/40">
                Project Details
            </div>

            <dl className="space-y-4">
                <div>
                    <dt className="text-[9px] font-medium uppercase tracking-[0.08em] text-foreground/35">
                        Status
                    </dt>

                    <dd className="mt-1 text-[12px] text-foreground/70">
                        {project.status}
                    </dd>
                </div>

                <div>
                    <dt className="text-[9px] font-medium uppercase tracking-[0.08em] text-foreground/35">
                        Year
                    </dt>

                    <dd className="mt-1 text-[12px] text-foreground/70">
                        {project.year}
                    </dd>
                </div>

                <div>
                    <dt className="text-[9px] font-medium uppercase tracking-[0.08em] text-foreground/35">
                        Role
                    </dt>

                    <dd className="mt-1 text-[12px] text-foreground/70">
                        {project.role}
                    </dd>
                </div>

                <div>
                    <dt className="text-[9px] font-medium uppercase tracking-[0.08em] text-foreground/35">
                        Built With
                    </dt>

                    <dd className="mt-1.5 text-[11px] leading-5 text-foreground/60">
                        {project.technologies.join(" · ")}
                    </dd>
                </div>
            </dl>
        </aside>
    );
}
