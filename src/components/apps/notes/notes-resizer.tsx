"use client";

import { useRef } from "react";
import type { PointerEvent } from "react";

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
            className="
                group
                relative
                z-20
                h-full
                w-full
                cursor-col-resize
                touch-none
                select-none
                overflow-visible
                bg-black/10

                dark:bg-white/10
            "
        >
            <div
                className="
                    absolute
                    inset-y-0
                    left-1/2
                    w-3
                    -translate-x-1/2
                    cursor-col-resize

                    group-hover:bg-black/[0.025]
                    group-active:bg-black/[0.04]

                    dark:group-hover:bg-white/[0.025]
                    dark:group-active:bg-white/[0.04]
                "
            />
        </div>
    );
}
