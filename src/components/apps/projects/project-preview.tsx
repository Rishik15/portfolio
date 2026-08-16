"use client";

/* eslint-disable @next/next/no-img-element */

import { useState } from "react";

import {
    PROJECT_PREVIEW_ASPECT_RATIO,
    PROJECTS_UI,
} from "@/components/apps/projects/projects-ui";
import type { Project } from "@/config/projects";

type ProjectPreviewProps = {
    project: Project;
};

export function ProjectPreview({ project }: ProjectPreviewProps) {
    const [loadedImageSrc, setLoadedImageSrc] = useState<string | null>(null);
    const [failedImageSrc, setFailedImageSrc] = useState<string | null>(null);

    const imageSrc = project.image.src;

    const isLoaded = loadedImageSrc === imageSrc;
    const hasFailed = failedImageSrc === imageSrc;

    return (
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
                aspectRatio: PROJECT_PREVIEW_ASPECT_RATIO,
            }}
        >
            {!isLoaded && !hasFailed && (
                <div
                    className={`
                        absolute
                        inset-0
                        flex
                        items-center
                        justify-center
                        gap-2
                        font-medium
                        text-foreground/35
                        ${PROJECTS_UI.preview.loadingText}
                    `}
                    role="status"
                    aria-live="polite"
                >
                    <span
                        className={`
                            shrink-0
                            animate-spin
                            rounded-full
                            border-2
                            border-foreground/15
                            border-t-foreground/45
                            motion-reduce:animate-none
                            ${PROJECTS_UI.preview.spinner}
                        `}
                        aria-hidden="true"
                    />

                    <span>Loading preview</span>
                </div>
            )}

            {hasFailed && (
                <div
                    className={`
                        absolute
                        inset-0
                        flex
                        items-center
                        justify-center
                        px-4
                        text-center
                        font-medium
                        text-foreground/35
                        ${PROJECTS_UI.preview.loadingText}
                    `}
                    role="status"
                >
                    Preview unavailable
                </div>
            )}

            <img
                key={imageSrc}
                src={imageSrc}
                alt={project.image.alt}
                loading="lazy"
                decoding="async"
                draggable={false}
                onLoad={() => {
                    setLoadedImageSrc(imageSrc);
                    setFailedImageSrc(null);
                }}
                onError={() => {
                    setFailedImageSrc(imageSrc);
                }}
                className={`
                    absolute
                    inset-0
                    h-full
                    w-full
                    object-contain

                    transition-opacity
                    duration-175
                    ease-out

                    motion-reduce:transition-none

                    ${isLoaded && !hasFailed ? "opacity-100" : "opacity-0"}
                `}
            />
        </div>
    );
}
