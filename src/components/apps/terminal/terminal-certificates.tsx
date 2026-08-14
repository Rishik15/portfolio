"use client";

import { useEffect } from "react";
import { motion, useReducedMotion, type MotionProps } from "motion/react";
import type { ReactNode } from "react";

import { CERTIFICATES } from "@/config/certificates";

const LINE_DELAY_SECONDS = 0.04;

type PrintedLineProps = {
    children: ReactNode;
    index: number;
    className?: string;
    reduceMotion: boolean | null;
    onComplete?: () => void;
};

function PrintedLine({
    children,
    index,
    className,
    reduceMotion,
    onComplete,
}: PrintedLineProps) {
    const animation: MotionProps = reduceMotion
        ? {
              initial: false,
          }
        : {
              initial: { opacity: 0 },
              animate: { opacity: 1 },
              transition: {
                  duration: 0.01,
                  delay: index * LINE_DELAY_SECONDS,
              },
              onAnimationComplete: onComplete,
          };

    return (
        <motion.div {...animation} className={className}>
            {children}
        </motion.div>
    );
}

type TerminalCertificatesProps = {
    onComplete?: () => void;
};

export function TerminalCertificates({
    onComplete,
}: TerminalCertificatesProps) {
    const reduceMotion = useReducedMotion();

    const lastLineIndex = CERTIFICATES.reduce(
        (count, certificate) => count + 2 + (certificate.credentialUrl ? 1 : 0),
        0,
    );

    useEffect(() => {
        if (reduceMotion) {
            onComplete?.();
        }
    }, [reduceMotion]);

    let lineIndex = 1;

    return (
        <div className="w-full py-1 font-mono text-sm leading-6">
            <PrintedLine
                index={0}
                reduceMotion={reduceMotion}
                onComplete={lastLineIndex === 0 ? onComplete : undefined}
                className="text-blue-500/80 dark:text-blue-400/80"
            >
                certificates/
            </PrintedLine>

            {CERTIFICATES.map((certificate, index) => {
                const isLast = index === CERTIFICATES.length - 1;
                const hasCredential = Boolean(certificate.credentialUrl);

                const certificateLineIndex = lineIndex++;
                const issuerLineIndex = lineIndex++;
                const credentialLineIndex = hasCredential
                    ? lineIndex++
                    : undefined;

                const branch = isLast ? "└──" : "├──";
                const childPrefix = isLast ? "    " : "│   ";
                const issuerBranch = hasCredential ? "├──" : "└──";

                return (
                    <div key={certificate.name}>
                        <PrintedLine
                            index={certificateLineIndex}
                            reduceMotion={reduceMotion}
                            onComplete={
                                certificateLineIndex === lastLineIndex
                                    ? onComplete
                                    : undefined
                            }
                            className="grid grid-cols-[4ch_minmax(0,1fr)]"
                        >
                            <span
                                aria-hidden="true"
                                className="select-none text-foreground/25"
                            >
                                {branch}
                            </span>

                            <span className="min-w-0 text-foreground/95">
                                {certificate.name}
                            </span>
                        </PrintedLine>

                        <PrintedLine
                            index={issuerLineIndex}
                            reduceMotion={reduceMotion}
                            onComplete={
                                issuerLineIndex === lastLineIndex
                                    ? onComplete
                                    : undefined
                            }
                            className="grid grid-cols-[7ch_7rem_minmax(0,1fr)]"
                        >
                            <span
                                aria-hidden="true"
                                className="select-none whitespace-pre text-foreground/25"
                            >
                                {`${childPrefix}${issuerBranch}`}
                            </span>

                            <span className="select-none text-foreground/55">
                                issuer
                            </span>

                            <span className="min-w-0 text-foreground/75">
                                {certificate.issuer}
                            </span>
                        </PrintedLine>

                        {certificate.credentialUrl &&
                            credentialLineIndex !== undefined && (
                                <PrintedLine
                                    index={credentialLineIndex}
                                    reduceMotion={reduceMotion}
                                    onComplete={
                                        credentialLineIndex === lastLineIndex
                                            ? onComplete
                                            : undefined
                                    }
                                    className="grid grid-cols-[7ch_7rem_minmax(0,1fr)]"
                                >
                                    <span
                                        aria-hidden="true"
                                        className="select-none whitespace-pre text-foreground/25"
                                    >
                                        {`${childPrefix}└──`}
                                    </span>

                                    <span className="select-none text-foreground/35">
                                        credential
                                    </span>

                                    <a
                                        href={certificate.credentialUrl}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="
                                            w-fit
                                            text-blue-500/80
                                            transition-colors
                                            hover:text-blue-500
                                            dark:text-blue-400/80
                                            dark:hover:text-blue-400
                                        "
                                    >
                                        verify ↗
                                    </a>
                                </PrintedLine>
                            )}
                    </div>
                );
            })}
        </div>
    );
}
