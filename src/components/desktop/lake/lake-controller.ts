import { LAKE_GRID, LAKE_LOOP } from "./lake-config";
import { createLakeGovernor } from "./lake-governor";
import { createLakeRenderer, type LakeRenderer } from "./lake-renderer";
import { createLakeSim, type LakeSim } from "./lake-sim";
import { createWindowTracker } from "./lake-window-tracker";

export type LakeController = {
    destroy: () => void;
};

export function createLakeController(
    canvas: HTMLCanvasElement,
    physics: boolean,
): LakeController {
    const root = document.documentElement;
    const tracker = createWindowTracker(LAKE_LOOP.windowSelector);
    const governor = createLakeGovernor();
    const initial = createLakeRenderer(canvas);

    if (!initial) {
        canvas.style.visibility = "hidden";
        return { destroy: () => {} };
    }

    let renderer: LakeRenderer = initial;
    canvas.style.visibility = "";
    let sim: LakeSim;
    let lowQuality = renderer.software;
    let abandoned = false;
    let lost = false;
    let dirty = true;
    let last = performance.now();
    let frame = 0;
    let timer = 0;
    let awake: number = LAKE_LOOP.awakeFrames;

    function layout() {
        const dpr = lowQuality
            ? 1
            : Math.min(window.devicePixelRatio || 1, LAKE_GRID.maxDpr);
        const cols = Math.ceil(window.innerWidth / LAKE_GRID.cellPx);
        const rows = Math.ceil(window.innerHeight / LAKE_GRID.cellPx);
        renderer.resize(
            window.innerWidth,
            window.innerHeight,
            dpr,
            LAKE_GRID.cellPx,
        );
        renderer.setGrid(cols, rows);
        sim = createLakeSim(cols, rows, LAKE_GRID.cellPx, physics);
        tracker.reset();
        dirty = true;
    }

    function stop() {
        cancelAnimationFrame(frame);
        window.clearTimeout(timer);
        frame = 0;
        timer = 0;
    }

    function abandon() {
        abandoned = true;
        stop();
        canvas.style.visibility = "hidden";
    }

    function degrade() {
        if (lowQuality) {
            abandon();
            return;
        }
        lowQuality = true;
        layout();
    }

    function tick(now: number) {
        frame = 0;
        const elapsed = now - last;
        last = now;

        const rects = tracker.read();
        if (rects) sim.setWindows(rects);

        const stepped = sim.advance(elapsed);
        if (stepped || dirty) {
            renderer.draw(sim.field, root.classList.contains("dark"));
            dirty = false;
        }

        if (!sim.asleep()) {
            awake = LAKE_LOOP.awakeFrames;
            if (physics && governor.record(elapsed)) {
                degrade();
                if (abandoned) return;
            }
        }
        schedule();
    }

    function schedule() {
        if (awake-- > 0) {
            frame = requestAnimationFrame(tick);
            return;
        }
        timer = window.setTimeout(() => {
            timer = 0;
            last = performance.now();
            frame = requestAnimationFrame(tick);
        }, LAKE_LOOP.idlePollMs);
    }

    function wake() {
        awake = LAKE_LOOP.awakeFrames;
        if (!timer) return;
        window.clearTimeout(timer);
        timer = 0;
        last = performance.now();
        frame = requestAnimationFrame(tick);
    }

    function onPointerMove(event: PointerEvent) {
        sim.setPointer(event.clientX, event.clientY);
        wake();
    }

    function onPointerDown(event: PointerEvent) {
        sim.shock(event.clientX, event.clientY);
        wake();
    }

    function onPointerLeave() {
        sim.clearPointer();
        wake();
    }

    function onContextLost(event: Event) {
        event.preventDefault();
        lost = true;
        stop();
        canvas.style.visibility = "hidden";
    }

    function onContextRestored() {
        const restored = createLakeRenderer(canvas);
        if (!restored || abandoned) return;
        renderer = restored;
        lost = false;
        canvas.style.visibility = "";
        layout();
        last = performance.now();
        awake = LAKE_LOOP.awakeFrames;
        frame = requestAnimationFrame(tick);
    }

    function onResize() {
        if (!lost) layout();
    }

    function markDirty() {
        dirty = true;
        wake();
    }

    const themeObserver = new MutationObserver(markDirty);
    themeObserver.observe(root, {
        attributes: true,
        attributeFilter: ["class"],
    });
    window.addEventListener("resize", onResize);
    canvas.addEventListener("webglcontextlost", onContextLost);
    canvas.addEventListener("webglcontextrestored", onContextRestored);
    if (physics) {
        window.addEventListener("pointermove", onPointerMove);
        window.addEventListener("pointerdown", onPointerDown);
        root.addEventListener("pointerleave", onPointerLeave);
    } else {
        window.addEventListener("pointerdown", wake);
    }
    layout();
    frame = requestAnimationFrame(tick);

    function destroy() {
        stop();
        themeObserver.disconnect();
        window.removeEventListener("resize", onResize);
        window.removeEventListener("pointermove", onPointerMove);
        window.removeEventListener("pointerdown", onPointerDown);
        window.removeEventListener("pointerdown", wake);
        root.removeEventListener("pointerleave", onPointerLeave);
        canvas.removeEventListener("webglcontextlost", onContextLost);
        canvas.removeEventListener("webglcontextrestored", onContextRestored);
    }

    return { destroy };
}
