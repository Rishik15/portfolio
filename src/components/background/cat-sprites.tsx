/**
 * cat-sprites.tsx
 * Server-rendered SVG poses for the cat; the active pose is chosen by CSS
 * from the parent's data-pose attribute.
 */

import { Head, Limb } from "@/components/background/cat-parts";

import styles from "./cat.module.css";

interface SitProps {
    pose: string;
    headRotate?: number;
    closed?: boolean;
    groom?: boolean;
}

const BODY = `${styles.fur} ${styles.line}`;

/**
 * Upright sitting pose, optionally grooming (raised paw) or looking up.
 * @param props Pose class name and head/paw variants.
 * @returns SVG group.
 */
function Sit({ pose, headRotate = 0, closed = false, groom = false }: SitProps) {
    return (
        <g className={`${styles.pose} ${pose}`}>
            <Limb d="M30 92 C 10 94, 6 70, 18 62" thick className={styles.tailWag} />
            <ellipse cx="46" cy="68" rx="22" ry="27" className={BODY} />
            <ellipse cx="38" cy="82" rx="17" ry="13" className={BODY} />
            <ellipse cx="36" cy="94" rx="9" ry="4" className={BODY} />
            <ellipse cx="57" cy="66" rx="8" ry="16" className={styles.cream} />
            <Limb d="M64 80 L65 94" />
            {groom ? (
                <Limb d="M58 76 L66 56" className={styles.groomPaw} />
            ) : (
                <Limb d="M56 78 L56 94" />
            )}
            <Head x={62} y={38} rotate={headRotate} closed={closed} />
        </g>
    );
}

/**
 * Curled-up napping pose with slow breathing.
 * @returns SVG group.
 */
function Nap() {
    return (
        <g className={`${styles.pose} ${styles.nap}`}>
            <g className={styles.breathe}>
                <ellipse cx="56" cy="78" rx="38" ry="19" className={BODY} />
            </g>
            <Limb d="M24 88 C 40 99, 72 99, 90 92" thick />
            <Head x={88} y={80} rotate={15} closed />
            <ellipse cx="100" cy="93" rx="8" ry="4" className={BODY} />
        </g>
    );
}

/**
 * Two-frame side-view walk cycle; frames alternate via CSS.
 * @returns SVG group.
 */
function Walk() {
    return (
        <g className={`${styles.pose} ${styles.walk}`}>
            <g className={styles.bob}>
                <Limb d="M26 52 C 10 50, 6 34, 14 24" thick />
                <g className={styles.frameA}>
                    <Limb d="M68 66 L60 94" />
                    <Limb d="M46 66 L56 94" />
                    <Limb d="M76 66 L86 94" />
                    <Limb d="M36 66 L28 94" />
                </g>
                <g className={styles.frameB}>
                    <Limb d="M68 66 L78 94" />
                    <Limb d="M46 66 L38 94" />
                    <Limb d="M76 66 L68 94" />
                    <Limb d="M36 66 L44 94" />
                </g>
                <ellipse cx="54" cy="56" rx="30" ry="15" className={BODY} />
                <ellipse cx="74" cy="58" rx="8" ry="11" className={styles.cream} />
                <Head x={90} y={42} rotate={8} />
            </g>
        </g>
    );
}

/**
 * All cat poses in one SVG.
 * @returns SVG element sized by its parent.
 */
export function CatSprites() {
    return (
        <svg viewBox="0 0 120 100" className={styles.sprites} aria-hidden="true">
            <Sit pose={styles.sit} />
            <Sit pose={styles.groom} headRotate={10} closed groom />
            <Sit pose={styles.watch} headRotate={-25} />
            <Nap />
            <Walk />
        </svg>
    );
}
