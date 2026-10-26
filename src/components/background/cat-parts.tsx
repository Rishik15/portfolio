/**
 * cat-parts.tsx
 * Shared SVG building blocks for the cat poses: head and outlined limb.
 */

import styles from "./cat.module.css";

interface LimbProps {
    d: string;
    thick?: boolean;
    className?: string;
}

interface HeadProps {
    x: number;
    y: number;
    rotate?: number;
    closed?: boolean;
}

/**
 * Outlined stroke used for legs and tail: dark line under a fur-coloured line.
 * @param props Path data, optional thick variant and extra class.
 * @returns SVG group with both strokes.
 */
export function Limb({ d, thick = false, className }: LimbProps) {
    const size = thick ? styles.thick : styles.thin;

    return (
        <g className={className}>
            <path d={d} className={`${styles.limbLine} ${size}`} />
            <path d={d} className={`${styles.limbFur} ${size}`} />
        </g>
    );
}

/**
 * Cat head facing right with ears, stripes, eyes and nose.
 * @param props Centre position, rotation in degrees and closed-eye flag.
 * @returns SVG group.
 */
export function Head({ x, y, rotate = 0, closed = false }: HeadProps) {
    return (
        <g transform={`translate(${x} ${y}) rotate(${rotate})`}>
            <path
                d="M-11 -7 L-10 -21 L-1 -12 Z"
                className={`${styles.fur} ${styles.line}`}
            />
            <path
                d="M3 -12 L11 -20 L13 -6 Z"
                className={`${styles.fur} ${styles.line}`}
            />
            <circle r="13" className={`${styles.fur} ${styles.line}`} />
            <ellipse cx="7" cy="6" rx="7" ry="5" className={styles.cream} />
            <path
                d="M-6 -11 l1 5 M0 -12 v6 M6 -11 l-1 5"
                className={styles.stripe}
            />
            {closed ? (
                <path d="M1 -2 q2 2 4 0 M8 -2 q2 2 4 0" className={styles.eyeLine} />
            ) : (
                <>
                    <circle cx="3" cy="-2" r="1.8" className={styles.eye} />
                    <circle cx="10" cy="-2" r="1.8" className={styles.eye} />
                </>
            )}
            <path d="M12 2 l3 0 l-1.5 2 z" className={styles.nose} />
        </g>
    );
}
