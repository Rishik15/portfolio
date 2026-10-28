// desktop-wallpaper.tsx: Load only the wallpaper for the resolved desktop theme.

"use client";

import Image from "next/image";
import { useTheme } from "next-themes";

import styles from "./desktop.module.css";

const WALLPAPER_SOURCES = {
    light: "/backgrounds/tree-light.webp",
    dark: "/backgrounds/tree-dark.webp",
} as const;

/** Takes no props and returns one resolved-theme wallpaper, or nothing until the theme resolves. */
export function DesktopWallpaper() {
    const { resolvedTheme } = useTheme();

    if (resolvedTheme !== "light" && resolvedTheme !== "dark") {
        return null;
    }

    return (
        <Image
            src={WALLPAPER_SOURCES[resolvedTheme]}
            alt=""
            fill
            sizes="100vw"
            loading="eager"
            draggable={false}
            className={styles.wallpaper}
        />
    );
}
