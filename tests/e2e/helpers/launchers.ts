/** launchers.ts opens real app launchers and waits for visible lazy app content. */
import { expect, test, type Page } from "@playwright/test";

import { contained, settled } from "./geometry";
import { dimensions } from "./zoom";

export const apps = ["Projects", "Experience", "Resume", "Terminal", "About Me", "Notes"];

/** Returns a named app's public window region for the supplied page and title. */
export function appWindow(page: Page, title: string) {
    return page.getByRole("region", { name: `${title} window`, exact: true });
}

/** Asserts the screen gate when unsupported, otherwise awaits hydrated Welcome; returns support. */
export async function desktopReady(page: Page) {
    const viewport = await dimensions(page);
    if (viewport.width < 720 || viewport.height < 500) {
        test.info().annotations.push({ type: "unsupported-screen", description: `${viewport.width}x${viewport.height} CSS viewport; screen-gate assertion replaces desktop interactions` });
        await expect(page.getByRole("heading", { name: "Mobile view is still in the works." })).toBeVisible();
        await expect(page.locator('section[aria-label$=" window"]')).toHaveCount(0);
        return false;
    }
    await expect(appWindow(page, "Welcome").getByRole("heading", { name: "Rishik Yesgari" })).toBeVisible();
    await settled(appWindow(page, "Welcome"));
    await contained(page, appWindow(page, "Welcome"));
    return true;
}

/** Closes a window through its named button, waiting until absent; returns nothing. */
export async function closeApp(page: Page, title: string) {
    await page.getByRole("button", { name: `Close ${title}`, exact: true }).click();
    await expect(appWindow(page, title)).toHaveCount(0);
}

/** Opens the supplied app with its existing single-click interaction and returns its loaded window. */
export async function openApp(page: Page, title: string) {
    await page.getByRole("button", { name: `Open ${title}`, exact: true }).click();
    const window = appWindow(page, title);
    await expect(window).toBeVisible();
    const content: Record<string, string> = {
        Terminal: "input", Projects: "aside", Experience: "aside", Resume: "img", "About Me": "p", Notes: "button",
    };
    await expect(window.locator(content[title]).first()).toBeVisible();
    await settled(window);
    await expect(window.getByRole("alert")).toHaveCount(0);
    await contained(page, window);
    return window;
}
