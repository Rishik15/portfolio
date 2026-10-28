/** playwright.config.ts runs desktop and Terminal coverage against a production server. */
import { defineConfig, type Project, type PlaywrightTestOptions } from "@playwright/test";

import type { BrowserOptions } from "./tests/e2e/fixtures/browser";

const projects: Project<BrowserOptions & PlaywrightTestOptions>[] = [];
for (const [width, height] of [[1280, 720], [1366, 768], [1440, 900], [1536, 864], [1920, 1080], [2560, 1440]]) {
    for (const zoomFactor of [1, 1.25, 2]) {
        projects.push({ name: `desktop-${width}x${height}-z${zoomFactor}`, testMatch: "**/desktop/*.spec.ts", use: { viewport: { width, height }, zoomFactor } });
    }
}
for (const zoomFactor of [1, 1.25, 2]) {
    projects.push({ name: `terminal-z${zoomFactor}`, testMatch: "**/terminal/*.spec.ts", use: { viewport: { width: 3200, height: 2000 }, zoomFactor } });
}

export default defineConfig<BrowserOptions>({
    testDir: "./tests/e2e", projects, workers: 1, fullyParallel: false,
    forbidOnly: !!process.env.CI, retries: process.env.CI ? 1 : 0,
    timeout: 60_000, expect: { timeout: 5_000 }, outputDir: "test-results",
    reporter: [["list"], ["html", { open: "never" }]],
    use: { browserName: "chromium", channel: "chromium", baseURL: "http://127.0.0.1:3107", reducedMotion: "reduce", trace: "off", screenshot: "off" },
    webServer: {
        command: "npm run build && npm run start -- --hostname 127.0.0.1 --port 3107",
        wait: { stdout: /Ready in/ }, reuseExistingServer: false, timeout: 180_000,
        gracefulShutdown: { signal: "SIGTERM", timeout: 5_000 },
    },
});
