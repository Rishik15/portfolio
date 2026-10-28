/** terminal.ts measures usable Terminal width, visible table layout and prompt reachability. */
import { expect, type Locator, type Page } from "@playwright/test";

import { box, contained, drag, resize } from "./geometry";
import { closeApp, desktopReady, openApp } from "./launchers";

/** Opens Terminal after closing hydrated Welcome and returns the frame. */
export async function startTerminal(page: Page) {
    expect(await desktopReady(page)).toBe(true);
    await closeApp(page, "Welcome");
    return openApp(page, "Terminal");
}

/** Returns the command textbox on the supplied page. */
export function commandInput(page: Page) {
    return page.getByRole("textbox", { name: "Terminal command", exact: true });
}

/** Returns the existing scroll viewport containing the command input, with no app hooks. */
export function terminalViewport(page: Page) {
    return commandInput(page).locator('xpath=ancestor::div[contains(@class,"overflow-y-auto")][1]');
}

/** Measures container, viewport and padded text width from the supplied page; returns CSS metrics. */
export async function terminalWidth(page: Page) {
    return terminalViewport(page).evaluate(
        /** Takes the rendered scrolling element and returns its usable text width and dimensions. */
        (element) => {
            const style = getComputedStyle(element);
            return { container: element.parentElement!.getBoundingClientRect().width, viewport: element.clientWidth, text: element.clientWidth - parseFloat(style.paddingLeft) - parseFloat(style.paddingRight) };
        },
    );
}

/** Uses pointer resizing to achieve supplied usable content width; returns the measured width. */
export async function setTextWidth(page: Page, window: Locator, target: number) {
    const initial = await box(window);
    await drag(page, window, 12 - initial.x, 80 - initial.y);
    for (let attempt = 0; attempt < 5; attempt++) {
        const measured = await terminalWidth(page);
        if (Math.abs(measured.text - target) <= 2) return measured;
        await resize(page, window, "right", target - measured.text, 0);
    }
    const measured = await terminalWidth(page);
    expect(Math.abs(measured.text - target), `Usable text width ${target}px`).toBeLessThanOrEqual(2);
    return measured;
}

/** Submits a public command and returns its newly rendered result locator. */
export async function submit(page: Page, command: string) {
    const results = page.locator('[aria-busy]');
    const count = await results.count();
    await commandInput(page).fill(command);
    await commandInput(page).press("Enter");
    await expect(results).toHaveCount(count + 1);
    return results.last();
}

/** Ensures draft input is preserved, focused and inside both local and screen bounds. */
export async function reachablePrompt(page: Page) {
    const jump = page.getByRole("button", { name: "Jump to latest", exact: true });
    if (await jump.isVisible()) await jump.click();
    const input = commandInput(page);
    await input.fill("draft preserved");
    await expect(input).toBeFocused();
    await expect(input).toHaveValue("draft preserved");
    await contained(page, input);
    const rect = await box(input);
    const viewport = await box(terminalViewport(page));
    expect(rect.y).toBeGreaterThanOrEqual(viewport.y - 1);
    expect(rect.y + rect.height).toBeLessThanOrEqual(viewport.y + viewport.height + 1);
}

/** Checks visible skill cells align and wrapped line starts have no generated/text separators. */
export async function alignedSkills(table: Locator) {
    await expect(table).toBeVisible();
    const layout = await table.evaluate(
        /** Measures rendered rows and list tokens, returning errors observable in their layout. */
        (element) => {
            const failures: string[] = [];
            const edges: number[][] = [];
            for (const row of element.querySelectorAll("tr")) {
                const heading = row.querySelector("th")!;
                const cell = row.querySelector("td")!;
                const h = heading.getBoundingClientRect();
                const c = cell.getBoundingClientRect();
                edges.push([h.left, c.left]);
                if (Math.abs(h.top - c.top) > 1) failures.push("row top alignment");
                let lineTop = -Infinity;
                for (const token of row.querySelectorAll("li")) {
                    const rect = token.getBoundingClientRect();
                    if (getComputedStyle(token).visibility !== "visible") failures.push("hidden final skill");
                    if (rect.top > lineTop + 1) {
                        for (const value of [token.textContent, getComputedStyle(token, "::before").content, getComputedStyle(token, "::after").content]) {
                            if (/^[\s"']*[|·•,;]/.test(value ?? "")) failures.push("line starts with separator");
                        }
                        lineTop = rect.top;
                    }
                    const range = document.createRange();
                    range.selectNodeContents(token);
                    if (rect.width <= c.width && range.getClientRects().length > 1) failures.push("split skill token");
                }
            }
            return { failures, edges };
        },
    );
    expect(layout.edges.length).toBeGreaterThan(1);
    for (const edges of layout.edges) {
        expect(Math.abs(edges[0] - layout.edges[0][0])).toBeLessThanOrEqual(1);
        expect(Math.abs(edges[1] - layout.edges[0][1])).toBeLessThanOrEqual(1);
    }
    expect(layout.failures).toEqual([]);
    for (const row of await table.getByRole("row").all()) {
        await row.scrollIntoViewIfNeeded();
        await expect(row).toBeInViewport();
    }
}

/** Watches old output for transient busy/hidden states and returns an async assertion callback. */
export async function watchCompleted(result: Locator) {
    await result.evaluate(
        /** Installs a test-side DOM observer on supplied output and returns nothing. */
        (element) => {
            const state = { errors: [] as string[], observer: null as MutationObserver | null };
            const check =
                /** Checks output and mutation records for replay; returns nothing. */
                (records: MutationRecord[] = []) => {
                    if (element.getAttribute("aria-busy") !== "false" || element.querySelector('[inert], [style*="visibility: hidden"]')) state.errors.push("output replayed");
                    for (const record of records) {
                        if (record.attributeName === "aria-busy" && record.oldValue === "true") state.errors.push("transient busy");
                        if (record.attributeName === "style" && record.oldValue?.includes("hidden")) state.errors.push("transient hidden output");
                    }
                };
            state.observer = new MutationObserver(check);
            state.observer.observe(element, { attributes: true, attributeOldValue: true, subtree: true, childList: true });
            (element as unknown as { replayWatch: typeof state }).replayWatch = state;
            check();
        },
    );
    return (
        /** Stops observation and asserts no old output replay; accepts no inputs and returns completion. */
        async () => {
            const errors = await result.evaluate(
                /** Retrieves and disconnects the supplied element's replay observation; returns errors. */
                (element) => {
                    const state = (element as unknown as { replayWatch: { observer: MutationObserver; errors: string[] } }).replayWatch;
                    state.observer.disconnect();
                    return state.errors;
                },
            );
            expect(errors).toEqual([]);
        }
    );
}
