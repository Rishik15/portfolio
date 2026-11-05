"use client";

import { useEffect, useRef } from "react";

import { useReducedMotion } from "@/lib/use-reduced-motion";

import { LAKE_PHYSICS_ENABLED } from "./lake-config";
import { createLakeController } from "./lake-controller";

export function LakeBackground() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const reducedMotion = useReducedMotion();

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        return createLakeController(
            canvas,
            LAKE_PHYSICS_ENABLED && !reducedMotion,
        ).destroy;
    }, [reducedMotion]);

    return (
        <div
            aria-hidden
            className="pointer-events-none absolute inset-0 -z-10 size-full bg-[linear-gradient(to_bottom,#f4f3f0,#f6e6e1_55%,#ead9ea)] dark:bg-[linear-gradient(to_bottom,#1e1d20,#2b2427_55%,#402b2b)]"
        >
            <canvas ref={canvasRef} className="size-full" />
        </div>
    );
}
