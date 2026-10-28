/** geometry.ts checks painted geometry and drives real window pointer gestures. */
import { expect, type Locator, type Page } from "@playwright/test";

import { dimensions } from "./zoom";

/** Waits for three unchanged paint-frame rectangles of the supplied element; returns nothing. */
export async function settled(locator: Locator) {
    const stable = await locator.evaluate(
        /** Samples the supplied element across bounded animation frames and returns stability. */
        async (element) => {
            let previous = "";
            let matching = 0;
            for (let frame = 0; frame < 90; frame++) {
                await new Promise<void>(
                    /** Accepts the resolver and completes at the next paint opportunity. */
                    (resolve) => requestAnimationFrame(
                        /** Resolves the frame wait; accepts no inputs and returns nothing. */
                        () => resolve(),
                    ),
                );
                const rect = element.getBoundingClientRect();
                const current = JSON.stringify([rect.x, rect.y, rect.width, rect.height]);
                matching = current === previous ? matching + 1 : 0;
                if (matching >= 3) return true;
                previous = current;
            }
            return false;
        },
    );
    expect(stable, "Window geometry settles across paint frames").toBe(true);
}

/** Takes a locator and returns a finite, positive bounding rectangle or throws. */
export async function box(locator: Locator) {
    const rect = await locator.boundingBox();
    expect(rect, "Rendered rectangle").not.toBeNull();
    expect(Object.values(rect!).every(Number.isFinite)).toBe(true);
    expect(rect!.width).toBeGreaterThan(0);
    expect(rect!.height).toBeGreaterThan(0);
    return rect!;
}

/** Checks the supplied element stays entirely inside the current CSS viewport; returns nothing. */
export async function contained(page: Page, locator: Locator) {
    await expect.poll(
        /** Rereads geometry and returns whether all edges are inside the viewport. */
        async () => {
            const rect = await box(locator);
            const viewport = await dimensions(page);
            return rect.x >= -1 && rect.y >= -1 && rect.x + rect.width <= viewport.width + 1 && rect.y + rect.height <= viewport.height + 1;
        },
    ).toBe(true);
}

/** Verifies full viewport maximize for the supplied window; returns nothing. */
export async function maximized(page: Page, window: Locator) {
    await expect.poll(
        /** Returns the largest absolute distance between window and viewport edges. */
        async () => {
            const rect = await box(window);
            const viewport = await dimensions(page);
            return Math.max(Math.abs(rect.x), Math.abs(rect.y), Math.abs(rect.width - viewport.width), Math.abs(rect.height - viewport.height));
        },
    ).toBeLessThanOrEqual(1);
}

/** Takes an element and verifies sampled painted points are unobscured, restoring pointer styles. */
export async function painted(locator: Locator) {
    await expect(locator).toBeVisible();
    const clear = await locator.evaluate(
        /** Samples element bounds with temporary hit testing; returns whether foreground belongs to it. */
        (element) => {
            const node = element as HTMLElement;
            const original = node.style.pointerEvents;
            node.style.pointerEvents = "auto";
            try {
                const rect = node.getBoundingClientRect();
                return [0.2, 0.5, 0.8].every(
                    /** Returns whether a fractional interior point hits this element or its descendants. */
                    (fraction) => {
                        const top = document.elementsFromPoint(rect.x + rect.width * fraction, rect.y + rect.height / 2)[0];
                        return top === node || node.contains(top);
                    },
                );
            } finally { node.style.pointerEvents = original; }
        },
    );
    expect(clear, "Chrome must be painted above the window").toBe(true);
}

/** Returns the painted dock container via its named launcher and fixed ancestor; accepts a page. */
export function dock(page: Page) {
    return page.getByRole("button", { name: "Open About Me", exact: true }).locator('xpath=ancestor::div[contains(@class,"fixed")][1]').locator(":scope > div").first();
}

/** Verifies top bar text, clock and every dock control remain painted and operable. */
export async function chromeVisible(page: Page) {
    const header = page.locator("header").filter({ has: page.getByRole("heading", { name: "Rishik", exact: true }) });
    await painted(header.getByRole("heading", { name: "Rishik", exact: true }));
    await painted(page.getByLabel("Current date and time in New York"));
    await page.getByRole("button", { name: "Toggle theme", exact: true }).click({ trial: true });
    for (const control of await dock(page).locator("button, a").all()) {
        await painted(control);
        await control.click({ trial: true });
    }
}

/** Checks default placement between measured top bar and dock; accepts page/window, returns nothing. */
export async function inWorkArea(page: Page, window: Locator) {
    await contained(page, window);
    const rect = await box(window);
    const header = page.locator("header").filter({ has: page.getByRole("heading", { name: "Rishik", exact: true }) });
    const paintedBottoms: number[] = [];
    for (const child of await header.locator(":scope > div").all()) {
        const bounds = await box(child);
        paintedBottoms.push(bounds.y + bounds.height);
    }
    const bottom = await box(dock(page));
    const title = await window.getAttribute("aria-label");
    expect.soft(rect.y, `${title} must start below the painted header`).toBeGreaterThanOrEqual(Math.max(...paintedBottoms) - 1);
    expect.soft(rect.y + rect.height, `${title} must end above the painted dock`).toBeLessThanOrEqual(bottom.y + 1);
}

/** Performs a pointer gesture from supplied coordinates by a delta; returns completion. */
export async function gesture(page: Page, x: number, y: number, dx: number, dy: number) {
    await page.mouse.move(x, y);
    await page.mouse.down();
    await page.mouse.move(x + dx, y + dy, { steps: 12 });
    await page.mouse.up();
    await page.mouse.move(0, 0);
}

/** Drags the supplied window from a title point away from controls by a delta; returns nothing. */
export async function drag(page: Page, window: Locator, dx: number, dy: number) {
    const rect = await box(window);
    await gesture(page, rect.x + rect.width * 0.6, rect.y + 24, dx, dy);
}

/** Resizes through an existing cursor handle with a delta; returns nothing. */
export async function resize(page: Page, window: Locator, direction: string, dx: number, dy: number) {
    const selectors: Record<string, string> = {
        right: ".cursor-ew-resize.right-0", left: ".cursor-ew-resize.left-0",
        top: ".cursor-ns-resize.top-0", bottom: ".cursor-ns-resize.bottom-0",
        "top-left": ".cursor-nwse-resize.left-0", "bottom-right": ".cursor-nwse-resize.right-0",
        "top-right": ".cursor-nesw-resize.right-0", "bottom-left": ".cursor-nesw-resize.left-0",
    };
    const handle = await box(window.locator(selectors[direction]));
    await gesture(page, handle.x + handle.width / 2, handle.y + handle.height / 2, dx, dy);
}
