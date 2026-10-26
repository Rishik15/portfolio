/**
 * cat-roam.ts
 * Drives the cat element: picks actions, walks it along the ground with a
 * delta-time rAF loop that only runs while it walks, and pauses when hidden.
 */

import { CAT_CONFIG } from "@/components/background/cat-config";
import { pickAction, type CatAction } from "@/components/background/cat-behavior";

/**
 * Starts the roam loop for a cat element.
 * @param el Cat element; moved with transform and posed via data attributes.
 * @returns Cleanup function that stops every timer and listener.
 */
export function startCatRoam(el: HTMLElement): () => void {
    const reduced = matchMedia("(prefers-reduced-motion: reduce)");
    const coarse = matchMedia("(pointer: coarse)");

    if (reduced.matches || coarse.matches) {
        el.hidden = true;
        return () => {};
    }

    const { width, height, groundRatio, footSink, edgeMargin } = CAT_CONFIG;

    let x = innerWidth * CAT_CONFIG.firstXRatio;
    let previous: string | undefined;
    let timer = 0;
    let frame = 0;

    /** Moves the cat to its x position on the ground line. */
    const place = () => {
        const y = innerHeight * groundRatio - height + footSink;
        el.style.transform = `translate3d(${x}px, ${y}px, 0)`;
    };

    /** Cancels any pending idle timer and walk frame. */
    const stop = () => {
        clearTimeout(timer);
        cancelAnimationFrame(frame);
    };

    /** Right edge of the roam range for the current viewport. */
    const maxX = () => Math.max(innerWidth - width - edgeMargin, 0);

    /**
     * Walks to a random ground spot, then picks the next action.
     * @param action Walk or stroll action supplying the speed.
     */
    const walk = (action: CatAction) => {
        const min = Math.min(edgeMargin, maxX());
        let target = min + Math.random() * (maxX() - min);

        if (Math.abs(target - x) < CAT_CONFIG.minWalkDistance) {
            target = x < (min + maxX()) / 2 ? maxX() : min;
        }

        el.dataset.dir = target > x ? "right" : "left";
        el.dataset.pose = action.pose;

        let last = performance.now();

        /**
         * Advances the walk by one frame.
         * @param now rAF timestamp in ms.
         */
        const step = (now: number) => {
            target = Math.min(target, maxX());
            const move = (action.speed ?? 0) * (Math.min(now - last, 50) / 1000);
            last = now;

            if (Math.abs(target - x) <= move) {
                x = target;
                place();
                next();
                return;
            }

            x += Math.sign(target - x) * move;
            place();
            frame = requestAnimationFrame(step);
        };

        frame = requestAnimationFrame(step);
    };

    /** Picks and starts the next action. */
    const next = () => {
        stop();

        const night = document.documentElement.classList.contains("dark");
        const action = pickAction(night ? "night" : "day", previous);
        previous = action.name;

        if (action.speed) {
            walk(action);
            return;
        }

        el.dataset.pose = action.pose;

        const [low, high] = action.duration;
        timer = window.setTimeout(next, low + Math.random() * (high - low));
    };

    /** Pauses while the tab is hidden and resumes when it shows. */
    const onVisibility = () => {
        if (document.hidden) {
            stop();
        } else {
            next();
        }
    };

    /** Keeps the cat inside the viewport after a resize. */
    const onResize = () => {
        x = Math.min(x, maxX());
        place();
    };

    /** Freezes and hides the cat when motion is reduced at runtime. */
    const onMotionChange = () => {
        if (reduced.matches) {
            stop();
            el.hidden = true;
        } else {
            el.hidden = false;
            next();
        }
    };

    place();

    if (!document.hidden) {
        timer = window.setTimeout(next, CAT_CONFIG.firstActionDelay);
    }

    document.addEventListener("visibilitychange", onVisibility);
    addEventListener("resize", onResize);
    reduced.addEventListener("change", onMotionChange);

    return () => {
        stop();
        reduced.removeEventListener("change", onMotionChange);
        document.removeEventListener("visibilitychange", onVisibility);
        removeEventListener("resize", onResize);
    };
}
