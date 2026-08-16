import Image from "next/image";

import { DesktopIcons } from "@/components/desktop/desktop-icons";
import { Dock } from "@/components/desktop/dock";
import { TopBar } from "@/components/desktop/top-bar";
import { MusicProvider } from "@/components/providers/music-provider";
import DynamicIsland from "@/components/ui/dynamic-island";
import { WindowLayer } from "@/components/windows/window-layer";
import { WindowManagerProvider } from "@/components/windows/window-manager";
import { WINDOW_CONFIGS } from "@/config/windows";

import styles from "./desktop.module.css";

export function Desktop() {
    return (
        <main className={styles.desktop}>
            <Image
                src="/backgrounds/tree-light.webp"
                alt=""
                fill
                sizes="100vw"
                loading="eager"
                draggable={false}
                className={`${styles.wallpaper} ${styles.lightWallpaper}`}
            />

            <Image
                src="/backgrounds/tree-dark.webp"
                alt=""
                fill
                sizes="100vw"
                loading="eager"
                draggable={false}
                className={`${styles.wallpaper} ${styles.darkWallpaper}`}
            />

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
