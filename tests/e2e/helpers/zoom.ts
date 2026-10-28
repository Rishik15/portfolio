/** zoom.ts sizes native Chromium windows and verifies real browser zoom reflow. */
import { expect, type Page, type Worker } from "@playwright/test";

/** Takes a page and returns measured CSS dimensions and device pixel ratio. */
export async function dimensions(page: Page) {
    return page.evaluate(
        /** Accepts no inputs and returns the browser's visible layout metrics. */
        () => ({ width: innerWidth, height: innerHeight, dpr: devicePixelRatio }),
    );
}

/** Sizes a native page to the supplied CSS dimensions at its current zoom; returns nothing. */
export async function sizeNative(page: Page, width: number, height: number) {
    const session = await page.context().newCDPSession(page);
    try {
        const { windowId } = await session.send("Browser.getWindowForTarget");
        for (let attempt = 0; attempt < 6; attempt++) {
            const actual = await dimensions(page);
            if (actual.width === width && actual.height === height) return;
            const { bounds } = await session.send("Browser.getWindowBounds", { windowId });
            await session.send("Browser.setWindowBounds", { windowId, bounds: {
                width: bounds.width! + Math.round((width - actual.width) * actual.dpr),
                height: bounds.height! + Math.round((height - actual.height) * actual.dpr),
            } });
            await page.evaluate(
                /** Waits two paint frames without inputs and returns completion. */
                () => new Promise<void>(
                    /** Resolves after nested animation frames; accepts the resolver. */
                    (resolve) => requestAnimationFrame(
                        /** Schedules the second frame; accepts no inputs and returns its ID. */
                        () => requestAnimationFrame(
                            /** Resolves the paint wait; accepts no inputs and returns nothing. */
                            () => resolve(),
                        ),
                    ),
                ),
            );
        }
        expect(await dimensions(page)).toMatchObject({ width, height });
    } finally {
        await session.detach();
    }
}

/** Applies a factor to the exact page URL through the extension and returns reported zoom. */
export async function nativeZoom(page: Page, worker: Worker, factor: number) {
    return worker.evaluate(
        /** Takes URL/factor, sets native zoom for its unique tab, and returns Chrome's factor. */
        async ({ url, factor }) => {
            type ChromeTabs = {
                query: (query: { url: string }) => Promise<{ id: number }[]>;
                setZoomSettings: (id: number, settings: { mode: string; scope: string }) => Promise<void>;
                setZoom: (id: number, factor: number) => Promise<void>;
                getZoom: (id: number) => Promise<number>;
            };
            const tabs = (globalThis as unknown as { chrome: { tabs: ChromeTabs } }).chrome.tabs;
            const matches = await tabs.query({ url });
            if (matches.length !== 1) throw new Error(`Expected one exact tab for ${url}, got ${matches.length}`);
            await tabs.setZoomSettings(matches[0].id, { mode: "automatic", scope: "per-tab" });
            await tabs.setZoom(matches[0].id, factor);
            return tabs.getZoom(matches[0].id);
        }, { url: page.url(), factor },
    );
}

/** Verifies requested zoom, reflow and DPR against the supplied baseline; returns measurements. */
export async function verifyZoom(page: Page, worker: Worker, factor: number, baseline: Awaited<ReturnType<typeof dimensions>>) {
    const reported = await nativeZoom(page, worker, factor);
    expect(reported).toBe(factor);
    await expect.poll(
        /** Returns whether current browser metrics match native zoom reflow. */
        async () => {
            const actual = await dimensions(page);
            return Math.abs(actual.width - baseline.width / factor) <= 2 && Math.abs(actual.height - baseline.height / factor) <= 2 && Math.abs(actual.dpr / baseline.dpr - factor) < 0.02;
        },
    ).toBe(true);
    return { baseline, factor, reported, actual: await dimensions(page) };
}
