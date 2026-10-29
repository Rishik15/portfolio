"use client";

import { useEffect, useRef } from "react";

import { useReducedMotion } from "@/lib/use-reduced-motion";

import { createLakeRenderer } from "./lake-renderer";
import { createLakeSim, type LakeSim, type Rect } from "./lake-sim";

const CELL_PX = 8;
const STEP_MS = 1000 / 60;
const IDLE_POLL_MS = 250;
const AWAKE_FRAMES = 90;
const WINDOW_SELECTOR = 'section[aria-label$=" window"]';

function readRect(element: Element): Rect | null {
    const { left, top, right, bottom, width } = element.getBoundingClientRect();
    return width > 0 ? { left, top, right, bottom } : null;
}

function sameRect(a: Rect | null, b: Rect | null) {
    return !!a && !!b && a.left === b.left && a.top === b.top && a.right === b.right && a.bottom === b.bottom;
}

export function LakeBackground() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const reducedMotion = useReducedMotion();

    useEffect(() => {
        const canvas = canvasRef.current;
        const renderer = canvas && createLakeRenderer(canvas);
        if (!canvas || !renderer) return;

        const root = document.documentElement;
        const known = new Map<Element, Rect | null>();
        let sim: LakeSim;
        let dirty = true;
        let moving = false;
        let last = performance.now();
        let lag = 0;
        let frame = 0;
        let timer = 0;
        let awake = AWAKE_FRAMES;

        function layout() {
            const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
            renderer!.resize(window.innerWidth, window.innerHeight, dpr, CELL_PX);
            sim = createLakeSim(Math.ceil(window.innerWidth / CELL_PX), Math.ceil(window.innerHeight / CELL_PX), CELL_PX);
            known.clear();
            dirty = true;
        }

        function trackWindows() {
            const rects = new Map<Element, Rect | null>();
            document.querySelectorAll(WINDOW_SELECTOR).forEach((element) => rects.set(element, readRect(element)));

            let changed = rects.size !== known.size;
            rects.forEach((rect, element) => {
                if (!known.has(element) || !sameRect(known.get(element) ?? null, rect)) changed = true;
            });
            if (!changed) return;

            known.clear();
            rects.forEach((rect, element) => known.set(element, rect));
            sim.setWindows([...rects.values()].filter((rect): rect is Rect => rect !== null));
            moving = true;
        }

        function tick(now: number) {
            lag = Math.min(lag + now - last, STEP_MS * 3);
            last = now;

            if (!reducedMotion) trackWindows();

            if (moving) {
                for (; lag >= STEP_MS; lag -= STEP_MS) moving = sim.step();
                dirty = true;
            } else {
                lag = 0;
            }

            if (dirty) {
                renderer!.draw(sim, root.classList.contains("dark"));
                dirty = false;
            }

            if (moving || dirty) awake = AWAKE_FRAMES;
            if (awake-- > 0) {
                frame = requestAnimationFrame(tick);
            } else {
                timer = window.setTimeout(() => {
                    timer = 0;
                    frame = requestAnimationFrame(tick);
                }, IDLE_POLL_MS);
            }
        }

        function wake() {
            awake = AWAKE_FRAMES;
            if (!timer) return;
            window.clearTimeout(timer);
            timer = 0;
            frame = requestAnimationFrame(tick);
        }

        function onPointerMove(event: PointerEvent) {
            if (reducedMotion) return;
            sim.setPointer(event.clientX, event.clientY);
            moving = true;
            wake();
        }

        function onPointerLeave() {
            sim.clearPointer();
            moving = true;
            wake();
        }

        const themeObserver = new MutationObserver(() => (dirty = true));
        themeObserver.observe(root, { attributes: true, attributeFilter: ["class"] });
        window.addEventListener("resize", layout);
        window.addEventListener("pointermove", onPointerMove);
        window.addEventListener("pointerdown", wake);
        document.documentElement.addEventListener("pointerleave", onPointerLeave);
        layout();
        frame = requestAnimationFrame(tick);

        return () => {
            cancelAnimationFrame(frame);
            window.clearTimeout(timer);
            themeObserver.disconnect();
            window.removeEventListener("resize", layout);
            window.removeEventListener("pointermove", onPointerMove);
            window.removeEventListener("pointerdown", wake);
            document.documentElement.removeEventListener("pointerleave", onPointerLeave);
        };
    }, [reducedMotion]);

    return <canvas ref={canvasRef} aria-hidden className="pointer-events-none absolute inset-0 -z-10 size-full" />;
}
