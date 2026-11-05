import type { Rect } from "./lake-rest";

export type WindowTracker = {
    read: () => Rect[] | null;
    reset: () => void;
};

function readRect(element: Element): Rect | null {
    const { left, top, right, bottom, width } = element.getBoundingClientRect();
    return width > 0 ? { left, top, right, bottom } : null;
}

function sameRect(a: Rect | null, b: Rect | null) {
    return (
        a === b ||
        (!!a &&
            !!b &&
            a.left === b.left &&
            a.top === b.top &&
            a.right === b.right &&
            a.bottom === b.bottom)
    );
}

export function createWindowTracker(selector: string): WindowTracker {
    const known = new Map<Element, Rect | null>();

    function read() {
        const current = new Map<Element, Rect | null>();
        document
            .querySelectorAll(selector)
            .forEach((element) => current.set(element, readRect(element)));

        let changed = current.size !== known.size;
        current.forEach((rect, element) => {
            if (
                !known.has(element) ||
                !sameRect(known.get(element) ?? null, rect)
            )
                changed = true;
        });
        if (!changed) return null;

        known.clear();
        current.forEach((rect, element) => known.set(element, rect));
        return [...current.values()].filter(
            (rect): rect is Rect => rect !== null,
        );
    }

    function reset() {
        known.clear();
    }

    return { read, reset };
}
