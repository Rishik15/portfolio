/* eslint-disable @next/next/no-img-element */

"use client";

import { useState } from "react";

import {
    RESUME_ASSET,
    RESUME_UI,
    RESUME_ZOOM,
} from "@/components/apps/resume/resume-ui";

export function Resume() {
    const [zoom, setZoom] = useState<number>(RESUME_ZOOM.default);
    const [isLoaded, setIsLoaded] = useState(false);
    const [hasFailed, setHasFailed] = useState(false);

    function zoomIn() {
        setZoom((current) =>
            Math.min(current + RESUME_ZOOM.step, RESUME_ZOOM.max),
        );
    }

    function zoomOut() {
        setZoom((current) =>
            Math.max(current - RESUME_ZOOM.step, RESUME_ZOOM.min),
        );
    }

    function resetZoom() {
        setZoom(RESUME_ZOOM.default);
    }

    return (
        <div className={RESUME_UI.root}>
            <div className={RESUME_UI.scroller}>
                <div
                    className={RESUME_UI.document}
                    style={{
                        width: `${zoom}%`,
                        aspectRatio: RESUME_ASSET.aspectRatio,
                    }}
                >
                    {!isLoaded && !hasFailed && (
                        <div
                            className={`
                                ${RESUME_UI.loading.wrapper}
                                ${RESUME_UI.loading.text}
                            `}
                            role="status"
                            aria-live="polite"
                        >
                            <span
                                className={RESUME_UI.loading.spinner}
                                aria-hidden="true"
                            />

                            <span>Loading resume</span>
                        </div>
                    )}

                    {hasFailed && (
                        <div
                            className={`
                                ${RESUME_UI.loading.wrapper}
                                ${RESUME_UI.loading.text}
                            `}
                            role="status"
                        >
                            Resume preview unavailable
                        </div>
                    )}

                    <img
                        src={RESUME_ASSET.imageSrc}
                        alt={RESUME_ASSET.alt}
                        width={RESUME_ASSET.width}
                        height={RESUME_ASSET.height}
                        loading="eager"
                        fetchPriority="high"
                        decoding="async"
                        draggable={false}
                        onLoad={() => {
                            setIsLoaded(true);
                            setHasFailed(false);
                        }}
                        onError={() => {
                            setIsLoaded(false);
                            setHasFailed(true);
                        }}
                        className={`
                            ${RESUME_UI.image}

                            ${
                                isLoaded && !hasFailed
                                    ? "opacity-100"
                                    : "opacity-0"
                            }
                        `}
                    />
                </div>
            </div>

            <div
                className={`
                    ${RESUME_UI.controls.position}
                    ${RESUME_UI.controls.panel}
                `}
            >
                <button
                    type="button"
                    onClick={zoomOut}
                    disabled={zoom === RESUME_ZOOM.min}
                    aria-label="Zoom out"
                    className={RESUME_UI.controls.iconButton}
                >
                    −
                </button>

                <button
                    type="button"
                    onClick={resetZoom}
                    aria-label="Reset zoom"
                    className={RESUME_UI.controls.percentageButton}
                >
                    {zoom}%
                </button>

                <button
                    type="button"
                    onClick={zoomIn}
                    disabled={zoom === RESUME_ZOOM.max}
                    aria-label="Zoom in"
                    className={RESUME_UI.controls.iconButton}
                >
                    +
                </button>
            </div>

            <a
                href={RESUME_ASSET.pdfSrc}
                download={RESUME_ASSET.downloadName}
                aria-label="Download resume"
                className={`
                    ${RESUME_UI.download.position}
                    ${RESUME_UI.download.button}
                `}
            >
                <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                    className={RESUME_UI.download.icon}
                >
                    <path d="M12 3v12" />
                    <path d="m7 10 5 5 5-5" />
                    <path d="M5 21h14" />
                </svg>

                <span className={RESUME_UI.download.label}>
                    Download Resume
                </span>
            </a>
        </div>
    );
}
