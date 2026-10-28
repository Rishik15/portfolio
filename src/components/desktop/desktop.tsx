// desktop.tsx: Compose the themed desktop, launchers and managed app windows.

import { DesktopIcons } from "@/components/desktop/desktop-icons";
import { DesktopWallpaper } from "@/components/desktop/desktop-wallpaper";
import { Dock } from "@/components/desktop/dock";
import { TopBar } from "@/components/desktop/top-bar";
import { MusicProvider } from "@/components/providers/music-provider";
import DynamicIsland from "@/components/ui/dynamic-island";
import { WindowLayer } from "@/components/windows/window-layer";
import { WindowManagerProvider } from "@/components/windows/window-manager";
import { WINDOW_CONFIGS } from "@/config/windows";

import styles from "./desktop.module.css";

/** Takes no props and returns the desktop with shared window and music providers. */
export function Desktop() {
    return (
        <main className={styles.desktop}>
            <DesktopWallpaper />

            <WindowManagerProvider configs={WINDOW_CONFIGS}>
                <MusicProvider>
                    <div className={styles.content}>
                        <TopBar />

                        <DynamicIsland />

                        <DesktopIcons />
                        <WindowLayer />
                        <Dock />
                    </div>
                </MusicProvider>
            </WindowManagerProvider>
        </main>
    );
}
