// terminal-print.ts: the single printing lifecycle that reveals a result unit by unit.
"use client";

import { useReducedMotion } from "motion/react";
import {
    createContext,
    useContext,
    useEffect,
    useRef,
    useState,
    type CSSProperties,
} from "react";

import { TERMINAL_MOTION } from "@/components/apps/terminal/terminal-ui";

const PrintContext = createContext<number>(Number.POSITIVE_INFINITY);

export const PrintProvider = PrintContext.Provider;

const HIDDEN_STYLE: CSSProperties = { visibility: "hidden" };

/**
 * Props for one reveal unit; hides and disables it until the printer reaches it.
 * @param index Position of the unit within its result.
 * @returns Props to spread onto the unit's element.
 */
export function usePrintUnit(index: number) {
    const revealed = useContext(PrintContext);

    return index < revealed ? {} : { inert: true, style: HIDDEN_STYLE };
}

/**
 * Reveals `total` units on a capped stagger and reports whether printing is in progress.
 * @param total Number of units in the result.
 * @param skipToken Value that changes whenever the visitor skips printing.
 * @param report Called with true while printing and false once complete or unmounted.
 * @returns The number of units revealed so far.
 */
export function useReveal(
    total: number,
    skipToken: number,
    report: (printing: boolean) => void,
) {
    const reduceMotion = useReducedMotion();
    const [revealed, setRevealed] = useState(reduceMotion ? total : 0);
    const initialSkipToken = useRef(skipToken);
    const isComplete = revealed >= total;

    useEffect(() => {
        if (reduceMotion || skipToken !== initialSkipToken.current) {
            setRevealed(total);
        }
    }, [reduceMotion, skipToken, total]);

    useEffect(() => {
        if (isComplete) return;

        const step = Math.min(
            TERMINAL_MOTION.revealStepMs,
            TERMINAL_MOTION.revealMaxTotalMs / total,
        );
        const timer = setInterval(
            () => setRevealed((current) => Math.min(total, current + 1)),
            step,
        );

        return () => clearInterval(timer);
    }, [isComplete, total]);

    useEffect(() => {
        report(!isComplete);

        return () => report(false);
    }, [isComplete, report]);

    return revealed;
}
