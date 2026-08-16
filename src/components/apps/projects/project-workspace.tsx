"use client";

import { AnimatePresence, motion } from "motion/react";

import { ProjectDetails } from "@/components/apps/projects/project-details";
import { ProjectOverview } from "@/components/apps/projects/project-overview";
import { ProjectPreview } from "@/components/apps/projects/project-preview";
import { ProjectRepositoryLinks } from "@/components/apps/projects/project-repository-links";
import { ProjectStatusBar } from "@/components/apps/projects/project-status-bar";
import {
    PROJECTS_MOTION,
    PROJECTS_UI,
} from "@/components/apps/projects/projects-ui";
import type { Project } from "@/config/projects";

type ProjectWorkspaceProps = {
    project: Project;
};

export function ProjectWorkspace({ project }: ProjectWorkspaceProps) {
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
                    ${PROJECTS_UI.workspace.headerGap}
                `}
            >
                <div className="min-w-0 flex-1">
                    <div
                        className={`
                            truncate
                            font-semibold
                            tracking-tight
                            text-foreground/90
                            ${PROJECTS_UI.workspace.titleText}
                        `}
                    >
                        {project.name}
                    </div>

                    <div
                        className={`
                            mt-0.5
                            truncate
                            text-foreground/40
                            ${PROJECTS_UI.workspace.categoryText}
                        `}
                    >
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
                            y: PROJECTS_MOTION.enterY,
                        }}
                        animate={{
                            opacity: 1,
                            y: 0,
                        }}
                        exit={{
                            opacity: 0,
                            y: PROJECTS_MOTION.exitY,
                        }}
                        transition={{
                            duration: PROJECTS_MOTION.duration,
                            ease: "easeOut",
                        }}
                        className={`
                            flex
                            min-h-full
                            flex-col
                            ${PROJECTS_UI.workspace.contentPadding}
                        `}
                    >
                        <ProjectPreview project={project} />

                        <div
                            className={`
                                grid
                                border-t
                                border-foreground/10

                                ${PROJECTS_UI.workspace.sectionMargin}
                                ${PROJECTS_UI.workspace.sectionGrid}
                            `}
                        >
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
