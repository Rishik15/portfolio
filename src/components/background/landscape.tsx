/**
 * landscape.tsx
 * Hills, grass band and the swaying tree shared by the day and night scenes.
 */

import styles from "./scene.module.css";

/**
 * Hills, tree and grass.
 * @returns Fragment of positioned scenery.
 */
export function Landscape() {
    return (
        <>
            <svg
                viewBox="0 0 100 24"
                preserveAspectRatio="none"
                className={styles.hills}
            >
                <path
                    d="M0 24 L0 12 C14 2 30 4 44 12 C58 18 70 8 100 10 L100 24 Z"
                    className={styles.hillFar}
                />
                <path
                    d="M0 24 L0 18 C20 10 40 16 60 18 C80 20 90 14 100 16 L100 24 Z"
                    className={styles.hillNear}
                />
            </svg>

            <svg
                viewBox="0 0 260 360"
                width="260"
                height="360"
                className={styles.tree}
            >
                <path
                    d="M112 360 C118 300 116 250 108 200 L152 200 C144 250 142 300 150 360 Z"
                    className={styles.trunk}
                />
                <g className={styles.canopy}>
                    <circle cx="130" cy="120" r="70" className={styles.leaves} />
                    <circle cx="80" cy="160" r="48" className={styles.leaves} />
                    <circle cx="182" cy="158" r="50" className={styles.leaves} />
                    <circle cx="130" cy="70" r="46" className={styles.leavesLight} />
                </g>
            </svg>

            <div className={styles.grass} />
        </>
    );
}
