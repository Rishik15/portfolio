"use client";

import type { ReactNode } from "react";

import { usePrintUnit } from "@/components/apps/terminal/terminal-print";
import { TERMINAL_UI } from "@/components/apps/terminal/terminal-ui";
import { CERTIFICATES } from "@/config/certificates";

type PrintedLineProps = {
    children: ReactNode;
    index: number;
    className?: string;
};

function PrintedLine({ children, index, className }: PrintedLineProps) {
    return (
        <div {...usePrintUnit(index)} className={className}>
            {children}
        </div>
    );
}

export function TerminalCertificates() {
    let lineIndex = 1;

    return (
        <div className={TERMINAL_UI.certificates.root}>
            <PrintedLine index={0} className={TERMINAL_UI.certificates.heading}>
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
