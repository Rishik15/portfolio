"use client";

import { AnimatePresence, motion } from "motion/react";

import { ProjectDetails } from "@/components/apps/projects/project-details";
import { ProjectOverview } from "@/components/apps/projects/project-overview";
import { ProjectPreview } from "@/components/apps/projects/project-preview";
import { ProjectRepositoryLinks } from "@/components/apps/projects/project-repository-links";
import { ProjectStatusBar } from "@/components/apps/projects/project-status-bar";
import type { Project } from "@/config/projects";

type ProjectWorkspaceProps = {
    project: Project;
};

export function ProjectWorkspace({ project }: ProjectWorkspaceProps) {
    return (
        <section className="flex min-w-0 flex-1 flex-col">
            <header className="flex h-14 shrink-0 items-center justify-between gap-4 border-b border-foreground/10 px-5">
                <div className="min-w-0">
                    <div className="truncate text-[13px] font-semibold tracking-tight text-foreground/90">
                        {project.name}
                    </div>

                    <div className="mt-0.5 truncate text-[10px] text-foreground/40">
                        {project.category}
                    </div>
                </div>

                <ProjectRepositoryLinks repositories={project.repositories} />
            </header>

            <div className="relative min-h-0 flex-1 overflow-auto">
                <AnimatePresence initial={false} mode="wait">
                    <motion.div
                        key={project.id}
                        initial={{
                            opacity: 0,
                            y: 4,
                        }}
                        animate={{
                            opacity: 1,
                            y: 0,
                        }}
                        exit={{
                            opacity: 0,
                            y: -2,
                        }}
                        transition={{
                            duration: 0.13,
                            ease: "easeOut",
                        }}
                        className="flex min-h-full flex-col p-5"
                    >
                        <ProjectPreview project={project} />

                        <div className="mt-5 grid grid-cols-[minmax(0,1.45fr)_minmax(220px,0.8fr)] border-t border-foreground/10">
                            <ProjectOverview project={project} />
                            <ProjectDetails project={project} />
                        </div>
                    </motion.div>
                </AnimatePresence>
            </div>

            <ProjectStatusBar project={project} />
        </section>
    );
}
