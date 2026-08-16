"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { TerminalInput } from "@/components/apps/terminal/terminal-input";
import { TerminalOutput } from "@/components/apps/terminal/terminal-output";
import type { TerminalEntry } from "@/components/apps/terminal/terminal-types";
import { TERMINAL_UI } from "@/components/apps/terminal/terminal-ui";
import { useTerminal } from "@/components/apps/terminal/use-terminal";

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
            className={TERMINAL_UI.root}
        >
            <TerminalOutput
                entries={terminal.entries}
                showWelcome={terminal.showWelcome}
                onCertificatesComplete={handleCertificatesComplete}
            />

            {!isCertificatesPrinting && (
                <div
                    className={
                        hasContent
                            ? TERMINAL_UI.output.inputWithContent
                            : TERMINAL_UI.output.input
                    }
                >
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
