export function ProjectsEmptyWorkspace() {
    return (
        <section className="flex min-w-0 flex-1 flex-col">
            <header className="flex h-14 shrink-0 items-center justify-between border-b border-foreground/10 px-5">
                <div className="space-y-1">
                    <div className="h-3 w-32 rounded-full bg-foreground/15" />
                    <div className="h-2 w-20 rounded-full bg-foreground/7" />
                </div>

                <div className="flex items-center gap-2">
                    <div className="h-7 w-16 rounded-md border border-foreground/10 bg-foreground/[0.025]" />

                    <div className="h-7 w-7 rounded-md border border-foreground/10 bg-foreground/[0.025]" />
                </div>
            </header>

            <div className="min-h-0 flex-1 overflow-auto">
                <div className="flex min-h-full flex-col p-5">
                    <div
                        className="relative w-full overflow-hidden rounded-xl border border-foreground/10 bg-foreground/[0.025] shadow-sm"
                        style={{
                            aspectRatio: "16 / 8.5",
                        }}
                    >
                        <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-[11px] font-medium uppercase tracking-[0.12em] text-foreground/25">
                                Project Preview
                            </span>
                        </div>
                    </div>

                    <div className="mt-5 grid grid-cols-[minmax(0,1.45fr)_minmax(220px,0.8fr)] border-t border-foreground/10">
                        <section className="min-w-0 py-5 pr-6">
                            <div className="mb-4 text-[10px] font-semibold uppercase tracking-[0.12em] text-foreground/40">
                                Overview
                            </div>

                            <div className="space-y-3">
                                <div className="h-3 w-[86%] rounded-full bg-foreground/10" />
                                <div className="h-3 w-full rounded-full bg-foreground/7" />
                                <div className="h-3 w-[72%] rounded-full bg-foreground/7" />
                            </div>

                            <div className="mt-6 grid grid-cols-3 gap-3">
                                <div className="h-16 rounded-lg border border-foreground/8 bg-foreground/[0.02]" />
                                <div className="h-16 rounded-lg border border-foreground/8 bg-foreground/[0.02]" />
                                <div className="h-16 rounded-lg border border-foreground/8 bg-foreground/[0.02]" />
                            </div>
                        </section>

                        <aside className="min-w-0 border-l border-foreground/10 py-5 pl-6">
                            <div className="mb-4 text-[10px] font-semibold uppercase tracking-[0.12em] text-foreground/40">
                                Project Details
                            </div>

                            <div className="space-y-4">
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

            <footer className="flex h-9 shrink-0 items-center justify-between border-t border-foreground/10 px-4">
                <div className="flex items-center gap-3">
                    <div className="h-1.5 w-12 rounded-full bg-foreground/10" />
                    <div className="h-1.5 w-16 rounded-full bg-foreground/10" />
                    <div className="h-1.5 w-10 rounded-full bg-foreground/10" />
                </div>

                <div className="h-1.5 w-20 rounded-full bg-foreground/10" />
            </footer>
        </section>
    );
}
