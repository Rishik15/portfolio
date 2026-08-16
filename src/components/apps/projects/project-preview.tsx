/* eslint-disable @next/next/no-img-element */
import type { Project } from "@/config/projects";

type ProjectPreviewProps = {
    project: Project;
};

export function ProjectPreview({ project }: ProjectPreviewProps) {
    return (
        <div
            className="relative w-full overflow-hidden rounded-xl border border-foreground/10 bg-foreground/[0.025] shadow-sm"
            style={{
                aspectRatio: "16 / 8.5",
            }}
        >
            <img
                key={project.image.src}
                src={project.image.src}
                alt={project.image.alt}
                loading="lazy"
                draggable={false}
                className="absolute inset-0 h-full w-full object-contain"
            />
        </div>
    );
}
