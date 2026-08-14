"use client";

import Image from "next/image";
import { useState } from "react";

const MIN_ZOOM = 50;
const MAX_ZOOM = 200;
const ZOOM_STEP = 25;

export function Resume() {
    const [zoom, setZoom] = useState(100);

    function zoomIn() {
        setZoom((current) => Math.min(current + ZOOM_STEP, MAX_ZOOM));
    }

    function zoomOut() {
        setZoom((current) => Math.max(current - ZOOM_STEP, MIN_ZOOM));
    }

    function resetZoom() {
        setZoom(100);
    }

    return (
        <div className="relative h-full w-full overflow-hidden bg-foreground/4">
            <div className="h-full w-full overflow-auto p-4 pb-20">
                <div
                    className="relative mx-auto bg-white shadow-sm"
                    style={{
                        width: `${zoom}%`,
                        aspectRatio: "8.5 / 11",
                    }}
                >
                    <Image
                        src="/resume/resume.webp"
                        alt="Rishik Resume"
                        fill
                        priority
                        sizes="90vw"
                        loading="eager"
                        draggable={false}
                        className="object-contain"
                    />
                </div>
            </div>

            <div
                className="
                    absolute
                    bottom-5
                    left-5
                    z-10
                    flex
                    items-center
                    overflow-hidden
                    rounded-xl
                    border
                    border-foreground/10
                    bg-background/95
                    text-sm
                    shadow-lg
                "
            >
                <button
                    type="button"
                    onClick={zoomOut}
                    disabled={zoom === MIN_ZOOM}
                    aria-label="Zoom out"
                    className="
                        flex
                        size-10
                        items-center
                        justify-center
                        text-lg
                        text-foreground/70
                        transition-colors
                        hover:bg-foreground/6
                        hover:text-foreground
                        disabled:pointer-events-none
                        disabled:opacity-30
                    "
                >
                    −
                </button>

                <button
                    type="button"
                    onClick={resetZoom}
                    aria-label="Reset zoom"
                    className="
                        h-10
                        min-w-16
                        border-x
                        border-foreground/10
                        px-3
                        text-xs
                        font-medium
                        text-foreground/65
                        transition-colors
                        hover:bg-foreground/[0.06]
                        hover:text-foreground
                    "
                >
                    {zoom}%
                </button>

                <button
                    type="button"
                    onClick={zoomIn}
                    disabled={zoom === MAX_ZOOM}
                    aria-label="Zoom in"
                    className="
                        flex
                        size-10
                        items-center
                        justify-center
                        text-lg
                        text-foreground/70
                        transition-colors
                        hover:bg-foreground/[0.06]
                        hover:text-foreground
                        disabled:pointer-events-none
                        disabled:opacity-30
                    "
                >
                    +
                </button>
            </div>

            <a
                href="/resume/resume.pdf"
                download="Rishik-Resume.pdf"
                aria-label="Download resume"
                className="
                    absolute
                    right-5
                    bottom-5
                    z-10
                    flex
                    items-center
                    gap-2
                    rounded-xl
                    bg-foreground
                    px-4
                    py-2.5
                    text-sm
                    font-medium
                    text-background
                    shadow-lg
                    transition-transform
                    duration-150
                    hover:scale-[1.03]
                    active:scale-[0.98]
                "
            >
                <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                    className="size-[18px]"
                >
                    <path d="M12 3v12" />
                    <path d="m7 10 5 5 5-5" />
                    <path d="M5 21h14" />
                </svg>
                Download Resume
            </a>
        </div>
    );
}
