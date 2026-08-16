"use client";

import { useState } from "react";

import { ProjectsEmptyWorkspace } from "@/components/apps/projects/projects-empty";
import { ProjectsSidebar } from "@/components/apps/projects/projects-sidebar";
import { PROJECTS_UI } from "@/components/apps/projects/projects-ui";
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
        <div className={PROJECTS_UI.root}>
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
