import type { Project } from "@/config/projects";

type ProjectOverviewProps = {
    project: Project;
};

export function ProjectOverview({ project }: ProjectOverviewProps) {
    return (
        <section className="min-w-0 py-5 pr-6">
            <div className="mb-4 text-[10px] font-semibold uppercase tracking-[0.12em] text-foreground/40">
                Overview
            </div>

            <p className="max-w-3xl text-[13px] leading-6 text-foreground/65">
                {project.description}
            </p>

            {project.highlights.length > 0 && (
                <div className="mt-6 grid grid-cols-3 gap-3">
                    {project.highlights.slice(0, 3).map((highlight) => (
                        <div
                            key={`${highlight.label}-${highlight.value}`}
                            className="flex min-h-16 flex-col justify-center rounded-lg border border-foreground/8 bg-foreground/[0.02] px-3"
                        >
                            <div className="text-[15px] font-semibold tracking-tight text-foreground/90">
                                {highlight.value}
                            </div>

                            <div className="mt-1 text-[9px] font-medium uppercase tracking-[0.1em] text-foreground/35">
                                {highlight.label}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </section>
    );
}
