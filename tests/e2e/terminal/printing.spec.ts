/** printing.spec.ts checks progressive reveal, Escape, replay and scroll-follow behavior. */
import { test, expect } from "../fixtures/browser";
import { resize } from "../helpers/geometry";
import { commandInput, reachablePrompt, startTerminal, submit, terminalViewport, watchCompleted } from "../helpers/terminal";

test.use({ reducedMotion: "no-preference" });

test("Escape finishes printing while preserving a typed draft",
    /** Pauses reveal timers while typing and skips output through the real Escape key. */
    async ({ page }) => {
        await page.clock.install();
        await startTerminal(page);
        await page.clock.pauseAt(new Date(Date.now() + 2000));
        const result = await submit(page, "/skills");
        await expect(result).toHaveAttribute("aria-busy", "true");
        await commandInput(page).fill("keep this draft");
        await commandInput(page).press("Escape");
        await page.clock.runFor(32);
        await expect(result).toHaveAttribute("aria-busy", "false");
        await expect(result.locator("tr").last()).toBeVisible();
        await expect(commandInput(page)).toHaveValue("keep this draft");
    },
);

test("commands finish within the reveal cap and completed output never replays",
    /** Checks four output types, resize, second command and history against a mutation observer. */
    async ({ page }) => {
        await page.clock.install();
        const window = await startTerminal(page);
        await page.clock.pauseAt(new Date(Date.now() + 2000));
        for (const command of ["/skills", "/help", "/certificates", "/unknown"]) {
            const result = await submit(page, command);
            await expect(result).toHaveAttribute("aria-busy", "true");
            await page.clock.runFor(1400);
            await expect(result).toHaveAttribute("aria-busy", "false");
            await expect(result.locator('[inert], [style*="visibility: hidden"]')).toHaveCount(0);
        }
        const old = page.locator('[aria-busy]').first();
        const assertNoReplay = await watchCompleted(old);
        await resize(page, window, "right", -100, 0);
        await page.clock.runFor(300);
        await submit(page, "/help");
        await commandInput(page).press("ArrowUp");
        await commandInput(page).press("ArrowDown");
        await page.clock.runFor(1500);
        await assertNoReplay();
        await reachablePrompt(page);
    },
);

test("scrolling up suppresses follow and Jump to latest restores focus",
    /** Generates overflow, scrolls locally with the wheel, then verifies jump and bottom following. */
    async ({ page }) => {
        await page.clock.install();
        await startTerminal(page);
        for (let index = 0; index < 5; index++) {
            const result = await submit(page, "/help");
            await expect(result).toHaveAttribute("aria-busy", "false");
        }
        await page.clock.pauseAt(new Date(Date.now() + 2000));
        const printing = await submit(page, "/certificates");
        await expect(printing).toHaveAttribute("aria-busy", "true");
        const viewport = terminalViewport(page);
        await viewport.hover();
        await page.mouse.wheel(0, -10000);
        const jump = page.getByRole("button", { name: "Jump to latest", exact: true });
        await expect(jump).toBeVisible();
        const top = await viewport.evaluate(
            /** Returns local scroll position of the supplied viewport. */
            (element) => element.scrollTop,
        );
        await page.clock.runFor(1400);
        await expect(printing).toHaveAttribute("aria-busy", "false");
        await expect.poll(
            /** Returns whether the viewport remains near the visitor's chosen position. */
            async () => Math.abs(await viewport.evaluate(
                /** Returns the supplied viewport's current scroll offset. */
                (element) => element.scrollTop,
            ) - top),
        ).toBeLessThanOrEqual(2);
        await jump.click();
        await expect(commandInput(page)).toBeFocused();
        const result = await submit(page, "/skills");
        await page.clock.runFor(1400);
        await expect(result).toHaveAttribute("aria-busy", "false");
        await expect.poll(
            /** Returns remaining scroll distance to the bottom of Terminal. */
            () => viewport.evaluate(
                /** Takes the viewport and returns its remaining vertical scroll distance. */
                (element) => element.scrollHeight - element.scrollTop - element.clientHeight,
            ),
        ).toBeLessThanOrEqual(24);
        await reachablePrompt(page);
    },
);
