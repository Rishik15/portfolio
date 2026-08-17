"use client";

import { memo, useEffect, useRef } from "react";
import type { PointerEvent } from "react";

import { NOTES_UI } from "@/components/apps/notes/notes-ui";

type NotesResizerProps = {
    onResize: (delta: number) => void;
};

function NotesResizerComponent({ onResize }: NotesResizerProps) {
    const previousXRef = useRef<number | null>(null);
    const pendingDeltaRef = useRef(0);
    const animationFrameRef = useRef(0);

    const flushPendingResize = () => {
        if (pendingDeltaRef.current === 0) {
            return;
        }

        const delta = pendingDeltaRef.current;

        pendingDeltaRef.current = 0;

        onResize(delta);
    };

    const scheduleResize = () => {
        if (animationFrameRef.current) {
            return;
        }

        animationFrameRef.current = window.requestAnimationFrame(() => {
            animationFrameRef.current = 0;

            flushPendingResize();
        });
    };

    const handlePointerDown = (event: PointerEvent<HTMLDivElement>) => {
        previousXRef.current = event.clientX;
        pendingDeltaRef.current = 0;

        event.currentTarget.setPointerCapture(event.pointerId);
    };

    const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
        const previousX = previousXRef.current;

        if (previousX === null) {
            return;
        }

        pendingDeltaRef.current += event.clientX - previousX;
        previousXRef.current = event.clientX;

        scheduleResize();
    };

    const handlePointerEnd = (event: PointerEvent<HTMLDivElement>) => {
        if (animationFrameRef.current) {
            window.cancelAnimationFrame(animationFrameRef.current);
            animationFrameRef.current = 0;
        }

        flushPendingResize();

        previousXRef.current = null;

        if (event.currentTarget.hasPointerCapture(event.pointerId)) {
            event.currentTarget.releasePointerCapture(event.pointerId);
        }
    };

    useEffect(() => {
        return () => {
            if (animationFrameRef.current) {
                window.cancelAnimationFrame(animationFrameRef.current);
            }
        };
    }, []);

    return (
        <div
            role="separator"
            aria-orientation="vertical"
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerEnd}
            onPointerCancel={handlePointerEnd}
            className={NOTES_UI.resizer.root}
        >
            <div className={NOTES_UI.resizer.hitArea} />
        </div>
    );
}

export const NotesResizer = memo(NotesResizerComponent);
