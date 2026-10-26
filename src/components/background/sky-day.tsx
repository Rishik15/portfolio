/**
 * sky-day.tsx
 * Day sky elements: sun, drifting clouds, falling leaves and a butterfly.
 */

import styles from "./scene.module.css";

const CLOUDS = [
    { top: 12, scale: 1, duration: 140, delay: -30 },
    { top: 24, scale: 0.7, duration: 190, delay: -120 },
    { top: 8, scale: 0.55, duration: 230, delay: -70 },
] as const;

const LEAVES = [8, 24, 41, 58, 73, 90] as const;

/**
 * Cloud silhouette.
 * @returns SVG path group.
 */
function CloudShape() {
    return (
        <svg viewBox="0 0 200 70" width="200" height="70">
            <path
                d="M30 60 C8 60 8 34 30 34 C32 14 62 8 74 26 C84 8 120 8 126 30 C150 22 170 38 160 52 C158 58 150 60 146 60 Z"
                className={styles.cloud}
            />
        </svg>
    );
}

/**
 * Day layer contents.
 * @returns Fragment of positioned, animated elements.
 */
export function SkyDay() {
    return (
        <>
            <div className={styles.sunGlow} />
            <div className={styles.sun} />

            {CLOUDS.map((cloud) => (
                <div
                    key={cloud.top}
                    className={styles.cloudDrift}
                    style={{
                        top: `${cloud.top}%`,
                        scale: cloud.scale,
                        animationDuration: `${cloud.duration}s`,
                        animationDelay: `${cloud.delay}s`,
                    }}
                >
                    <CloudShape />
                </div>
            ))}

            {LEAVES.map((left, index) => (
                <span
                    key={left}
                    className={styles.leaf}
                    style={{
                        left: `${left}%`,
                        animationDuration: `${16 + index * 2}s`,
                        animationDelay: `${-index * 3.1}s`,
                    }}
                />
            ))}

            <div className={styles.butterfly}>
                <span className={styles.wing} />
                <span className={`${styles.wing} ${styles.wingRight}`} />
            </div>
        </>
    );
}
