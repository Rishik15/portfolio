import { Dock } from "@/components/desktop/dock";
import { LakeBackground } from "@/components/desktop/lake/lake-background";
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
            <LakeBackground />

            <WindowManagerProvider configs={WINDOW_CONFIGS}>
                <MusicProvider>
                    <div className={styles.content}>
                        <TopBar />

                        <DynamicIsland />

                        <WindowLayer />
                        <Dock />
                    </div>
                </MusicProvider>
            </WindowManagerProvider>
        </main>
    );
}
