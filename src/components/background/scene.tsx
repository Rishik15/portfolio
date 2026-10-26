/**
 * scene.tsx
 * Server-rendered animated backdrop: sky, hills, grass and tree, with a day
 * and a night layer toggled by the `.dark` class.
 */

import { Landscape } from "@/components/background/landscape";
import { SkyDay } from "@/components/background/sky-day";
import { SkyNight } from "@/components/background/sky-night";

import styles from "./scene.module.css";

/**
 * Full-viewport scene behind everything else.
 * @returns The scene root element.
 */
export function Scene() {
    return (
        <div className={styles.scene} aria-hidden="true">
            <div className={styles.day}>
                <SkyDay />
            </div>

            <div className={styles.night}>
                <SkyNight />
            </div>

            <Landscape />
        </div>
    );
}
