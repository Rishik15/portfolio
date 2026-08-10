import Image from "next/image";

import { DesktopIcons } from "@/components/desktop/desktop-icons";
import { Dock } from "@/components/desktop/dock";
import { TopBar } from "@/components/desktop/top-bar";

import styles from "./desktop.module.css";

export function Desktop() {
    return (
        <main className={styles.desktop}>
            <Image
                src="/backgrounds/light_mode.webp"
                alt=""
                fill
                priority
                sizes="100vw"
                draggable={false}
                className={`${styles.wallpaper} ${styles.lightWallpaper}`}
            />

            <Image
                src="/backgrounds/dark_mode.webp"
                alt=""
                fill
                priority
                sizes="100vw"
                draggable={false}
                className={`${styles.wallpaper} ${styles.darkWallpaper}`}
            />

            <div className={styles.content}>
                <TopBar />
                <DesktopIcons />
                <Dock />
            </div>
        </main>
    );
}
