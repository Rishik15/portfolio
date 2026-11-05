"use client";

import { useCallback } from "react";

import { TerminalCertificates } from "@/components/apps/terminal/terminal-certificates";
import { TerminalHelp } from "@/components/apps/terminal/terminal-help";
import { TerminalPrompt } from "@/components/apps/terminal/terminal-prompt";
import {
    PrintProvider,
    usePrintUnit,
    useReveal,
} from "@/components/apps/terminal/terminal-print";
import { TerminalSkills } from "@/components/apps/terminal/terminal-skills";
import type {
    TerminalEntry,
    TerminalResult,
} from "@/components/apps/terminal/terminal-types";
import { TERMINAL_UI } from "@/components/apps/terminal/terminal-ui";
import { getResultUnitCount } from "@/components/apps/terminal/terminal-units";
import { TerminalWelcome } from "@/components/apps/terminal/terminal-welcome";

function TextLine({ line, index }: { line: string; index: number }) {
    return <div {...usePrintUnit(index)}>{line}</div>;
}

function TextResult({ lines }: { lines: readonly string[] }) {
    return (
        <div className={TERMINAL_UI.output.textResult}>
            {lines.map((line, index) => (
                <TextLine key={`${line}-${index}`} line={line} index={index} />
            ))}
        </div>
    );
}

function Result({
    result,
    onRun,
}: {
    result: TerminalResult;
    onRun: (command: string) => void;
}) {
    switch (result.type) {
        case "help":
            return <TerminalHelp onRun={onRun} />;

        case "skills":
            return <TerminalSkills />;

        case "certificates":
            return <TerminalCertificates />;

        case "text":
            return <TextResult lines={result.lines} />;
    }
}

type EntryProps = {
    entry: TerminalEntry;
    skipToken: number;
    onPrintingChange: (id: number, printing: boolean) => void;
    onRun: (command: string) => void;
};

function Entry({ entry, skipToken, onPrintingChange, onRun }: EntryProps) {
    const report = useCallback(
        (printing: boolean) => onPrintingChange(entry.id, printing),
        [entry.id, onPrintingChange],
    );

    const total = getResultUnitCount(entry.result);

    const revealed = useReveal(total, skipToken, report);

    return (
        <div className={TERMINAL_UI.output.entry}>
            <div className={TERMINAL_UI.output.commandRow}>
                <TerminalPrompt />

                <span className="min-w-0 break-words">{entry.command}</span>
            </div>

            <div
                aria-busy={revealed < total}
                className={TERMINAL_UI.output.result}
            >
                <PrintProvider value={revealed}>
                    <Result result={entry.result} onRun={onRun} />
                </PrintProvider>
            </div>
        </div>
    );
}

type TerminalOutputProps = {
    entries: TerminalEntry[];
    showWelcome: boolean;
    skipToken: number;
    onPrintingChange: (id: number, printing: boolean) => void;
    onRun: (command: string) => void;
};

export function TerminalOutput({
    entries,
    showWelcome,
    skipToken,
    onPrintingChange,
    onRun,
}: TerminalOutputProps) {
    return (
        <div className={TERMINAL_UI.output.root}>
            {showWelcome && <TerminalWelcome />}

            {entries.length > 0 && (
                <div
                    className={
                        showWelcome
                            ? TERMINAL_UI.output.entriesWithWelcome
                            : TERMINAL_UI.output.entries
                    }
                >
                    {entries.map((entry) => (
                        <Entry
                            key={entry.id}
                            entry={entry}
                            skipToken={skipToken}
                            onPrintingChange={onPrintingChange}
                            onRun={onRun}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
