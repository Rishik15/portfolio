/** viewport.spec.ts exercises startup, launchers, maximize and safe window gestures at every viewport. */
import { test, expect } from "../fixtures/browser";
import { box, chromeVisible, contained, drag, inWorkArea, maximized, resize } from "../helpers/geometry";
import { apps, appWindow, closeApp, desktopReady, openApp } from "../helpers/launchers";
import { dimensions, sizeNative } from "../helpers/zoom";

test("Welcome alone opens in the work area",
    /** Takes the browser page and verifies visible startup behavior; returns completion. */
    async ({ page }) => {
        if (!await desktopReady(page)) return;
        await expect(page.locator('section[aria-label$=" window"]:visible')).toHaveCount(1);
        await inWorkArea(page, appWindow(page, "Welcome"));
        await chromeVisible(page);
    },
);

test("every desktop and dock launcher opens a contained app",
    /** Opens and closes each public app and validates contact links; returns completion. */
    async ({ page }) => {
        if (!await desktopReady(page)) return;
        await closeApp(page, "Welcome");
        for (const title of apps) {
            const window = await openApp(page, title);
            await inWorkArea(page, window);
            await closeApp(page, title);
        }
        for (const [name, href] of [
            ["Open GitHub in a new tab", "https://github.com/Rishik15"],
            ["Open LinkedIn in a new tab", "https://www.linkedin.com/in/rishikreddyyesgari/"],
            ["Email rishikreddy.yesgari@gmail.com", "https://mail.google.com/mail/?view=cm&fs=1&to=rishikreddy.yesgari%40gmail.com"],
        ]) {
            const link = page.getByRole("link", { name, exact: true });
            await expect(link).toHaveAttribute("href", href);
            await expect(link).toHaveAttribute("target", "_blank");
            await link.click({ trial: true });
        }
    },
);

test("maximize fills the full viewport and restores",
    /** Maximizes Terminal, checks it fills the viewport and restores the frame; returns completion. */
    async ({ page }) => {
        if (!await desktopReady(page)) return;
        await closeApp(page, "Welcome");
        const window = await openApp(page, "Terminal");
        const original = await box(window);
        await page.getByRole("button", { name: "Maximize Terminal", exact: true }).click();
        await maximized(page, window);
        await page.getByRole("button", { name: "Maximize Terminal", exact: true }).click();
        await expect.poll(
            /** Returns the restored width's distance from its pre-maximize value. */
            async () => Math.abs((await box(window)).width - original.width),
        ).toBeLessThanOrEqual(1);
        await contained(page, window);
        await page.getByRole("button", { name: "Maximize Terminal", exact: true }).click();
        await maximized(page, window);
    },
);

test("drag, resize and native browser resize retain reachable windows",
    /** Exercises all edges/corners, top-zone drag and top-edge maximize; returns completion. */
    async ({ page }) => {
        if (!await desktopReady(page)) return;
        await closeApp(page, "Welcome");
        const window = await openApp(page, "Terminal");
        for (const [dx, dy] of [[-10000, 0], [10000, 0], [0, 10000]]) {
            await drag(page, window, dx, dy);
            await contained(page, window);
            await window.getByRole("button", { name: "Close Terminal", exact: true }).click({ trial: true });
        }
        const rect = await box(window);
        await drag(page, window, 100 - rect.x, 12 - rect.y);
        expect((await box(window)).y).toBeLessThan(30);
        await contained(page, window);
        for (const direction of ["right", "left", "top", "bottom", "top-left", "top-right", "bottom-left", "bottom-right"]) {
            await resize(page, window, direction, direction.includes("left") ? -10000 : 10000, direction.includes("top") ? -10000 : 10000);
            await contained(page, window);
        }
        const before = await dimensions(page);
        await sizeNative(page, Math.max(720, Math.floor(before.width * 0.8)), Math.max(500, Math.floor(before.height * 0.85)));
        await contained(page, window);
        await sizeNative(page, before.width, before.height);
        await contained(page, window);
        const final = await box(window);
        await drag(page, window, 0, -final.y - 24);
        await maximized(page, window);
    },
);
