import { PROJECTS_UI } from "@/components/apps/projects/projects-ui";
import type { Project } from "@/config/projects";

type ProjectsSidebarProps = {
    projects: readonly Project[];
    selectedProjectId: string | null;
    onSelectProject: (projectId: string) => void;
};

function EmptySidebarItems() {
    return (
        <div className={PROJECTS_UI.sidebar.listGap}>
            <div
                className={`
                    rounded-md
                    bg-foreground/[0.07]
                    ${PROJECTS_UI.sidebar.emptyItemHeight}
                `}
            />

            <div
                className={`
                    rounded-md
                    bg-foreground/[0.025]
                    ${PROJECTS_UI.sidebar.emptyItemHeight}
                `}
            />

            <div
                className={`
                    rounded-md
                    bg-foreground/[0.025]
                    ${PROJECTS_UI.sidebar.emptyItemHeight}
                `}
            />

            <div
                className={`
                    rounded-md
                    bg-foreground/[0.025]
                    ${PROJECTS_UI.sidebar.emptyItemHeight}
                `}
            />
        </div>
    );
}

export function ProjectsSidebar({
    projects,
    selectedProjectId,
    onSelectProject,
}: ProjectsSidebarProps) {
    return (
        <aside
            className={`
                flex
                shrink-0
                flex-col
                border-r
                border-foreground/10
                bg-foreground/[0.025]
                ${PROJECTS_UI.sidebar.width}
            `}
        >
            <div
                className={`
                    flex
                    shrink-0
                    items-center
                    border-b
                    border-foreground/10
                    ${PROJECTS_UI.chrome.headerHeight}
                    ${PROJECTS_UI.sidebar.headerPadding}
                `}
            >
                <span
                    className={`
                        font-semibold
                        tracking-tight
                        ${PROJECTS_UI.sidebar.headerText}
                    `}
                >
                    Projects
                </span>
            </div>

            <div
                className={`
                    min-h-0
                    flex-1
                    overflow-auto
                    ${PROJECTS_UI.sidebar.bodyPadding}
                `}
            >
                {projects.length === 0 ? (
                    <EmptySidebarItems />
                ) : (
                    <div className={PROJECTS_UI.sidebar.listGap}>
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
                                        text-left
                                        transition-colors
                                        duration-100

                                        ${PROJECTS_UI.sidebar.itemPadding}

                                        ${
                                            selected
                                                ? "bg-foreground/[0.08]"
                                                : "hover:bg-foreground/[0.045]"
                                        }
                                    `}
                                >
                                    <div
                                        className={`
                                            truncate
                                            font-medium
                                            text-foreground/85
                                            ${PROJECTS_UI.sidebar.itemNameText}
                                        `}
                                    >
                                        {project.name}
                                    </div>

                                    <div
                                        className={`
                                            mt-0.5
                                            truncate
                                            text-foreground/40
                                            ${PROJECTS_UI.sidebar.itemCategoryText}
                                        `}
                                    >
                                        {project.category}
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                )}
            </div>

            <div
                className={`
                    flex
                    shrink-0
                    items-center
                    border-t
                    border-foreground/10
                    text-foreground/40

                    ${PROJECTS_UI.chrome.statusHeight}
                    ${PROJECTS_UI.sidebar.footerPadding}
                    ${PROJECTS_UI.sidebar.footerText}
                `}
            >
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
