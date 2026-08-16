"use client";

import { useRef } from "react";
import type { PointerEvent } from "react";

import { NOTES_UI } from "@/components/apps/notes/notes-ui";

type NotesResizerProps = {
    onResize: (delta: number) => void;
};

export function NotesResizer({ onResize }: NotesResizerProps) {
    const previousX = useRef<number | null>(null);

    const handlePointerDown = (event: PointerEvent<HTMLDivElement>) => {
        previousX.current = event.clientX;

        event.currentTarget.setPointerCapture(event.pointerId);
    };

    const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
        if (previousX.current === null) {
            return;
        }

        const delta = event.clientX - previousX.current;

        previousX.current = event.clientX;

        onResize(delta);
    };

    const handlePointerEnd = (event: PointerEvent<HTMLDivElement>) => {
        previousX.current = null;

        if (event.currentTarget.hasPointerCapture(event.pointerId)) {
            event.currentTarget.releasePointerCapture(event.pointerId);
        }
    };

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
