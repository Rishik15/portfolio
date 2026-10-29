import { PROJECTS_UI } from "@/components/apps/projects/projects-ui";

export function ProjectsEmptyWorkspace() {
    return (
        <section className="flex min-w-0 flex-1 flex-col">
            <header
                className={`
                    flex
                    shrink-0
                    items-center
                    justify-between
                    border-b
                    border-foreground/10

                    ${PROJECTS_UI.chrome.headerHeight}
                    ${PROJECTS_UI.workspace.headerPadding}
                `}
            >
                <div className="space-y-1">
                    <div className="h-3 w-32 rounded-full bg-foreground/15" />
                    <div className="h-2 w-20 rounded-full bg-foreground/7" />
                </div>

                <div className="flex items-center gap-2">
                    <div className="h-7 w-16 rounded-md border border-foreground/10 bg-foreground/[0.025] @6xl/projects:h-8 @6xl/projects:w-20" />

                    <div className="size-7 rounded-md border border-foreground/10 bg-foreground/[0.025] @6xl/projects:size-8" />
                </div>
            </header>

            <div className="min-h-0 flex-1 overflow-auto">
                <div
                    className={`
                        flex
                        min-h-full
                        flex-col
                        ${PROJECTS_UI.workspace.contentPadding}
                    `}
                >
                    <div
                        className="
                            relative
                            w-full
                            overflow-hidden
                            rounded-xl
                            border
                            border-foreground/10
                            bg-foreground/[0.025]
                            shadow-sm
                        "
                        style={{
                            aspectRatio: "16 / 8.5",
                        }}
                    >
                        <div className="absolute inset-0 flex items-center justify-center">
                            <span
                                className={`
                                    font-medium
                                    uppercase
                                    tracking-[0.12em]
                                    text-foreground/25
                                    ${PROJECTS_UI.preview.loadingText}
                                `}
                            >
                                Project Preview
                            </span>
                        </div>
                    </div>

                    <div
                        className={`
                            grid
                            border-t
                            border-foreground/10

                            ${PROJECTS_UI.workspace.sectionMargin}
                            ${PROJECTS_UI.workspace.sectionGrid}
                        `}
                    >
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

                            <div className="space-y-3">
                                <div className="h-3 w-[86%] rounded-full bg-foreground/10" />
                                <div className="h-3 w-full rounded-full bg-foreground/7" />
                                <div className="h-3 w-[72%] rounded-full bg-foreground/7" />
                            </div>

                            <div
                                className={`
                                    grid

                                    ${PROJECTS_UI.highlights.marginTop}
                                    ${PROJECTS_UI.highlights.grid}
                                    ${PROJECTS_UI.highlights.gap}
                                `}
                            >
                                <div
                                    className={`
                                        rounded-lg
                                        border
                                        border-foreground/8
                                        bg-foreground/[0.02]
                                        ${PROJECTS_UI.highlights.card}
                                    `}
                                />

                                <div
                                    className={`
                                        rounded-lg
                                        border
                                        border-foreground/8
                                        bg-foreground/[0.02]
                                        ${PROJECTS_UI.highlights.card}
                                    `}
                                />

                                <div
                                    className={`
                                        rounded-lg
                                        border
                                        border-foreground/8
                                        bg-foreground/[0.02]
                                        ${PROJECTS_UI.highlights.card}
                                    `}
                                />
                            </div>
                        </section>

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

                            <div className={PROJECTS_UI.details.grid}>
                                <div>
                                    <div className="mb-2 h-2 w-14 rounded-full bg-foreground/8" />
                                    <div className="h-3 w-[85%] rounded-full bg-foreground/12" />
                                </div>

                                <div>
                                    <div className="mb-2 h-2 w-16 rounded-full bg-foreground/8" />
                                    <div className="h-3 w-[70%] rounded-full bg-foreground/12" />
                                </div>

                                <div>
                                    <div className="mb-2 h-2 w-12 rounded-full bg-foreground/8" />
                                    <div className="h-3 w-[92%] rounded-full bg-foreground/12" />
                                </div>
                            </div>
                        </aside>
                    </div>
                </div>
            </div>

            <footer
                className={`
                    flex
                    shrink-0
                    items-center
                    justify-between
                    border-t
                    border-foreground/10

                    ${PROJECTS_UI.chrome.statusHeight}
                    ${PROJECTS_UI.status.padding}
                `}
            >
                <div className="flex items-center gap-3">
                    <div
                        className={`
                            rounded-full
                            bg-foreground/10
                            ${PROJECTS_UI.status.languageBar}
                        `}
                    />

                    <div className="hidden items-center gap-3 @5xl/projects:flex">
                        <div className="h-1.5 w-12 rounded-full bg-foreground/10" />
                        <div className="h-1.5 w-16 rounded-full bg-foreground/10" />
                        <div className="h-1.5 w-10 rounded-full bg-foreground/10" />
                    </div>
                </div>

                <div className="h-1.5 w-20 shrink-0 rounded-full bg-foreground/10" />
            </footer>
        </section>
    );
}
