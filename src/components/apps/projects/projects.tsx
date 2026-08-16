"use client";

import { useState } from "react";

import { ProjectsEmptyWorkspace } from "@/components/apps/projects/projects-empty";
import { ProjectsSidebar } from "@/components/apps/projects/projects-sidebar";
import { ProjectWorkspace } from "@/components/apps/projects/project-workspace";
import { PROJECTS } from "@/config/projects";

export function Projects() {
    const [selectedProjectId, setSelectedProjectId] = useState<string | null>(
        PROJECTS[0]?.id ?? null,
    );

    const selectedProject =
        PROJECTS.find((project) => project.id === selectedProjectId) ??
        PROJECTS[0] ??
        null;

    return (
        <div className="flex h-full min-h-0 w-full bg-background text-foreground">
            <ProjectsSidebar
                projects={PROJECTS}
                selectedProjectId={selectedProject?.id ?? null}
                onSelectProject={setSelectedProjectId}
            />

            {selectedProject ? (
                <ProjectWorkspace project={selectedProject} />
            ) : (
                <ProjectsEmptyWorkspace />
            )}
        </div>
    );
}
