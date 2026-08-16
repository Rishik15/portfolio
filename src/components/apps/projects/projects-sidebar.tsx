import type { Project } from "@/config/projects";

type ProjectsSidebarProps = {
    projects: readonly Project[];
    selectedProjectId: string | null;
    onSelectProject: (projectId: string) => void;
};

function EmptySidebarItems() {
    return (
        <div className="space-y-1">
            <div className="h-10 rounded-md bg-foreground/[0.07]" />
            <div className="h-10 rounded-md bg-foreground/[0.025]" />
            <div className="h-10 rounded-md bg-foreground/[0.025]" />
            <div className="h-10 rounded-md bg-foreground/[0.025]" />
        </div>
    );
}

export function ProjectsSidebar({
    projects,
    selectedProjectId,
    onSelectProject,
}: ProjectsSidebarProps) {
    return (
        <aside className="flex w-[190px] shrink-0 flex-col border-r border-foreground/10 bg-foreground/[0.025]">
            <div className="flex h-14 shrink-0 items-center border-b border-foreground/10 px-4">
                <span className="text-xs font-semibold tracking-tight">
                    Projects
                </span>
            </div>

            <div className="min-h-0 flex-1 overflow-auto p-2">
                {projects.length === 0 ? (
                    <EmptySidebarItems />
                ) : (
                    <div className="space-y-1">
                        {projects.map((project) => {
                            const selected = project.id === selectedProjectId;

                            return (
                                <button
                                    key={project.id}
                                    type="button"
                                    onClick={() => onSelectProject(project.id)}
                                    className={`
                                        w-full
                                        rounded-md
                                        px-2.5
                                        py-2
                                        text-left
                                        transition-colors
                                        duration-100
                                        ${
                                            selected
                                                ? "bg-foreground/[0.08]"
                                                : "hover:bg-foreground/[0.045]"
                                        }
                                    `}
                                >
                                    <div className="truncate text-[12px] font-medium text-foreground/85">
                                        {project.name}
                                    </div>

                                    <div className="mt-0.5 truncate text-[10px] text-foreground/40">
                                        {project.category}
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                )}
            </div>

            <div className="flex h-10 shrink-0 items-center border-t border-foreground/10 px-4 text-[10px] text-foreground/40">
                {projects.length === 0 ? (
                    <div className="h-2 w-20 rounded-full bg-foreground/10" />
                ) : (
                    <>
                        {projects.length}{" "}
                        {projects.length === 1 ? "project" : "projects"}
                    </>
                )}
            </div>
        </aside>
    );
}
