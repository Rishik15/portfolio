"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { TerminalInput } from "./terminal-input";
import { TerminalOutput } from "./terminal-output";
import type { TerminalEntry } from "./terminal-types";
import { useTerminal } from "./use-terminal";

export function Terminal() {
    const terminal = useTerminal();

    const viewportRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const [completedCertificateEntry, setCompletedCertificateEntry] =
        useState<TerminalEntry | null>(null);

    const hasContent = terminal.showWelcome || terminal.entries.length > 0;

    const latestEntry = terminal.entries.at(-1);

    const isCertificatesPrinting =
        latestEntry?.result.type === "certificates" &&
        completedCertificateEntry !== latestEntry;

    useEffect(() => {
        const viewport = viewportRef.current;

        if (viewport) {
            viewport.scrollTop = viewport.scrollHeight;
        }
    }, [terminal.entries]);

    const handleCertificatesComplete = useCallback((entry: TerminalEntry) => {
        setCompletedCertificateEntry(entry);
    }, []);

    function focusInput() {
        if (!window.getSelection()?.toString()) {
            inputRef.current?.focus();
        }
    }

    return (
        <div
            ref={viewportRef}
            onClick={focusInput}
            className="
                h-full
                w-full
                cursor-text
                overflow-x-hidden
                overflow-y-auto
                p-4
                font-mono
                text-sm
                leading-5
                text-foreground
                selection:bg-foreground/15
            "
        >
            <TerminalOutput
                entries={terminal.entries}
                showWelcome={terminal.showWelcome}
                onCertificatesComplete={handleCertificatesComplete}
            />

            {!isCertificatesPrinting && (
                <div className={hasContent ? "mt-2 w-full" : "w-full"}>
                    <TerminalInput
                        history={terminal.history}
                        inputRef={inputRef}
                        onCommand={terminal.submitCommand}
                    />
                </div>
            )}
        </div>
    );
}
