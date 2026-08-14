import { TerminalCertificates } from "./terminal-certificates";
import { TerminalHelp } from "./terminal-help";
import { TerminalPrompt } from "./terminal-prompt";
import { TerminalSkills } from "./terminal-skills";
import type { TerminalEntry, TerminalResult } from "./terminal-types";
import { TerminalWelcome } from "./terminal-welcome";

function TextResult({ lines }: { lines: readonly string[] }) {
    return (
        <div className="text-foreground/55">
            {lines.map((line, index) => (
                <div key={`${line}-${index}`}>{line}</div>
            ))}
        </div>
    );
}

type ResultProps = {
    result: TerminalResult;
    onCertificatesComplete?: () => void;
};

function Result({ result, onCertificatesComplete }: ResultProps) {
    switch (result.type) {
        case "help":
            return <TerminalHelp />;

        case "skills":
            return <TerminalSkills />;

        case "certificates":
            return <TerminalCertificates onComplete={onCertificatesComplete} />;

        case "text":
            return <TextResult lines={result.lines} />;
    }
}

type EntryProps = {
    entry: TerminalEntry;
    onCertificatesComplete: (entry: TerminalEntry) => void;
};

function Entry({ entry, onCertificatesComplete }: EntryProps) {
    return (
        <div className="w-full">
            <div className="flex items-center gap-2">
                <TerminalPrompt />
                <span>{entry.command}</span>
            </div>

            <div className="mt-2 w-full">
                <Result
                    result={entry.result}
                    onCertificatesComplete={
                        entry.result.type === "certificates"
                            ? () => onCertificatesComplete(entry)
                            : undefined
                    }
                />
            </div>
        </div>
    );
}

type TerminalOutputProps = {
    entries: TerminalEntry[];
    showWelcome: boolean;
    onCertificatesComplete: (entry: TerminalEntry) => void;
};

export function TerminalOutput({
    entries,
    showWelcome,
    onCertificatesComplete,
}: TerminalOutputProps) {
    return (
        <div className="w-full">
            {showWelcome && <TerminalWelcome />}

            {entries.length > 0 && (
                <div className={showWelcome ? "mt-2 space-y-2" : "space-y-2"}>
                    {entries.map((entry, index) => (
                        <Entry
                            key={`${entry.command}-${index}`}
                            entry={entry}
                            onCertificatesComplete={onCertificatesComplete}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
