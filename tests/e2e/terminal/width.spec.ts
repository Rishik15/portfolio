/** width.spec.ts validates actual usable Terminal widths at native browser zoom. */
import { test, expect } from "../fixtures/browser";
import { contained, resize } from "../helpers/geometry";
import { alignedSkills, reachablePrompt, setTextWidth, startTerminal, submit, terminalWidth } from "../helpers/terminal";
import { dimensions, sizeNative } from "../helpers/zoom";

for (const target of ["minimum", 760, 1200, 1280] as const) {
    test(`skills columns and prompt at ${target} content width`,
        /** Resizes through real handles, checks visible skills and reachable input; returns completion. */
        async ({ page }, testInfo) => {
            if (target === "minimum") await sizeNative(page, 1280, 900);
            if (target === 760) {
                const viewport = await dimensions(page);
                await sizeNative(page, Math.min(viewport.width, 2400), viewport.height);
            }
            const window = await startTerminal(page);
            if (target === "minimum") {
                await resize(page, window, "right", -10000, 0);
                const minimum = await terminalWidth(page);
                await resize(page, window, "right", -100, 0);
                expect(await terminalWidth(page)).toEqual(minimum);
            } else await setTextWidth(page, window, target);
            await testInfo.attach("terminal-width", { body: JSON.stringify(await terminalWidth(page)), contentType: "application/json" });
            const result = await submit(page, "/skills");
            await expect(result).toHaveAttribute("aria-busy", "false");
            await alignedSkills(page.getByRole("table", { name: "Skills", exact: true }));
            await reachablePrompt(page);
            await contained(page, window);
            expect(await page.evaluate(
                /** Returns global horizontal overflow in CSS pixels without inputs. */
                () => document.documentElement.scrollWidth - innerWidth,
            )).toBeLessThanOrEqual(1);
        },
    );
}

test("reduced motion reveals final output without reveal time",
    /** Pauses time before command submission and requires complete output immediately. */
    async ({ page }) => {
        await startTerminal(page);
        await page.clock.install();
        await page.clock.pauseAt(new Date(Date.now() + 1000));
        const result = await submit(page, "/skills");
        await expect(result).toHaveAttribute("aria-busy", "false");
        await expect(result.locator("tr").last()).toBeVisible();
    },
);
