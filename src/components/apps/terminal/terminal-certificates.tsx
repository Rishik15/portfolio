"use client";

import { motion, useReducedMotion, type MotionProps } from "motion/react";
import { useEffect, type ReactNode } from "react";

import {
    TERMINAL_MOTION,
    TERMINAL_UI,
} from "@/components/apps/terminal/terminal-ui";
import { CERTIFICATES } from "@/config/certificates";

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
              initial: {
                  opacity: 0,
              },

              animate: {
                  opacity: 1,
              },

              transition: {
                  duration: TERMINAL_MOTION.certificateLineDurationSeconds,

                  delay: index * TERMINAL_MOTION.certificateLineDelaySeconds,
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
        <div className={TERMINAL_UI.certificates.root}>
            <PrintedLine
                index={0}
                reduceMotion={reduceMotion}
                onComplete={lastLineIndex === 0 ? onComplete : undefined}
                className={TERMINAL_UI.certificates.heading}
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
                            className={TERMINAL_UI.certificates.certificateLine}
                        >
                            <span
                                aria-hidden="true"
                                className={TERMINAL_UI.certificates.branch}
                            >
                                {branch}
                            </span>

                            <span
                                className={
                                    TERMINAL_UI.certificates.certificateName
                                }
                            >
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
                            className={TERMINAL_UI.certificates.detailLine}
                        >
                            <span
                                aria-hidden="true"
                                className={TERMINAL_UI.certificates.branch}
                            >
                                {`${childPrefix}${issuerBranch}`}
                            </span>

                            <span
                                className={TERMINAL_UI.certificates.detailLabel}
                            >
                                issuer
                            </span>

                            <span
                                className={TERMINAL_UI.certificates.detailValue}
                            >
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
                                    className={
                                        TERMINAL_UI.certificates.detailLine
                                    }
                                >
                                    <span
                                        aria-hidden="true"
                                        className={
                                            TERMINAL_UI.certificates.branch
                                        }
                                    >
                                        {`${childPrefix}└──`}
                                    </span>

                                    <span
                                        className={
                                            TERMINAL_UI.certificates
                                                .credentialLabel
                                        }
                                    >
                                        credential
                                    </span>

                                    <a
                                        href={certificate.credentialUrl}
                                        target="_blank"
                                        rel="noreferrer"
                                        className={
                                            TERMINAL_UI.certificates
                                                .credentialLink
                                        }
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
