/** browser.ts isolates native zoom contexts and records explicit failure artifacts. */
import path from "node:path";

import { test as base, chromium, expect, type Worker } from "@playwright/test";

import { dimensions, sizeNative, verifyZoom } from "../helpers/zoom";

export type BrowserOptions = { zoomFactor: number };

export const test = base.extend<BrowserOptions & { zoomWorker: Worker }>({
    zoomFactor: [1, { option: true }],
    /** Creates a persistent context from project options, yields it, and closes it with artifacts. */
    context: async ({ headless, baseURL, reducedMotion, colorScheme }, provide, testInfo) => {
        const extension = path.resolve("tests/e2e/extensions/zoom");
        const context = await chromium.launchPersistentContext("", {
            channel: "chromium", headless, viewport: null, baseURL, reducedMotion,
            colorScheme: colorScheme ?? "light", locale: "en-US", timezoneId: "America/New_York",
            args: [`--disable-extensions-except=${extension}`, `--load-extension=${extension}`],
        });
        try {
            await context.tracing.start({ screenshots: true, snapshots: true, sources: true });
            await provide(context);
        } finally {
            if (testInfo.status !== testInfo.expectedStatus) {
                for (const [index, page] of context.pages().entries()) {
                    if (!page.isClosed()) await testInfo.attach(`failure-${index}`, { body: await page.screenshot(), contentType: "image/png" });
                }
                const trace = testInfo.outputPath("trace.zip");
                await context.tracing.stop({ path: trace });
                await testInfo.attach("trace", { path: trace, contentType: "application/zip" });
            } else await context.tracing.stop();
            await context.close();
        }
    },
    /** Takes the persistent context and yields its bounded extension worker. */
    zoomWorker: async ({ context }, provide) => {
        const worker = context.serviceWorkers()[0] ?? await context.waitForEvent("serviceworker", { timeout: 10_000 });
        await provide(worker);
    },
    /** Creates the page, sizes its native window, and yields it after verified zoom. */
    page: async ({ context, viewport, zoomFactor, zoomWorker }, provide, testInfo) => {
        for (const page of context.pages()) await page.close();
        const page = await context.newPage();
        const errors: string[] = [];
        page.on("pageerror",
            /** Collects an uncaught page error and returns nothing. */
            (error) => { errors.push(error.message); },
        );
        await page.clock.setFixedTime(new Date("2026-10-27T16:00:00Z"));
        await sizeNative(page, viewport!.width, viewport!.height);
        await page.goto("/");
        const baseline = await dimensions(page);
        const measurements = await verifyZoom(page, zoomWorker, zoomFactor, baseline);
        await testInfo.attach("native-zoom", { body: JSON.stringify(measurements, null, 2), contentType: "application/json" });
        await page.evaluate(
            /** Waits for document fonts to load; accepts no inputs and returns completion. */
            () => document.fonts.ready.then(
                /** Completes the font wait; accepts no inputs and returns undefined. */
                () => undefined,
            ),
        );
        await provide(page);
        expect(errors, "Uncaught application errors").toEqual([]);
    },
});

export { expect };
