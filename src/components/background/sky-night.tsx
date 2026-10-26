/**
 * sky-night.tsx
 * Night sky elements: moon, twinkling stars, shooting star and fireflies.
 */

import styles from "./scene.module.css";

const STAR_COUNT = 36;
const FIREFLY_COUNT = 7;

/**
 * Deterministic pseudo-scatter so server and client markup always match.
 * @param index Item index.
 * @param step Multiplier controlling the spread.
 * @param range Upper bound of the returned percentage.
 * @returns A value in [0, range).
 */
function scatter(index: number, step: number, range: number): number {
    return (index * step) % range;
}

/**
 * Night layer contents.
 * @returns Fragment of positioned, animated elements.
 */
export function SkyNight() {
    return (
        <>
            <div className={styles.moonGlow} />
            <div className={styles.moon} />

            {Array.from({ length: STAR_COUNT }, (_, index) => (
                <span
                    key={index}
                    className={styles.star}
                    style={{
                        left: `${scatter(index, 37.7, 100)}%`,
                        top: `${scatter(index, 23.3, 58)}%`,
                        width: 2 + (index % 3),
                        height: 2 + (index % 3),
                        animationDelay: `${-scatter(index, 1.7, 5)}s`,
                        animationDuration: `${3 + (index % 4)}s`,
                    }}
                />
            ))}

            <span className={styles.shootingStar} />

            {Array.from({ length: FIREFLY_COUNT }, (_, index) => (
                <span
                    key={index}
                    className={styles.firefly}
                    style={{
                        left: `${scatter(index, 31.3, 80) + 8}%`,
                        top: `${62 + scatter(index, 7.9, 20)}%`,
                        animationDuration: `${7 + index}s`,
                        animationDelay: `${-index * 1.7}s`,
                    }}
                />
            ))}
        </>
    );
}
