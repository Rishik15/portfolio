/**
 * cat.tsx
 * Client component that renders the cat layer and starts its roam loop.
 */

"use client";

import { useEffect, useRef } from "react";

import { CatSprites } from "@/components/background/cat-sprites";
import { startCatRoam } from "@/components/background/cat-roam";

import styles from "./cat.module.css";

/**
 * Roaming cat on a pointer-events-none layer.
 * @returns The cat layer element.
 */
export function Cat() {
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => (ref.current ? startCatRoam(ref.current) : undefined), []);

    return (
        <div className={styles.layer}>
            <div ref={ref} className={styles.cat} data-pose="sit" data-dir="right">
                <CatSprites />
            </div>
        </div>
    );
}
