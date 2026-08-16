import { TerminalCertificates } from "@/components/apps/terminal/terminal-certificates";
import { TerminalHelp } from "@/components/apps/terminal/terminal-help";
import { TerminalPrompt } from "@/components/apps/terminal/terminal-prompt";
import { TerminalSkills } from "@/components/apps/terminal/terminal-skills";
import type {
    TerminalEntry,
    TerminalResult,
} from "@/components/apps/terminal/terminal-types";
import { TERMINAL_UI } from "@/components/apps/terminal/terminal-ui";
import { TerminalWelcome } from "@/components/apps/terminal/terminal-welcome";

function TextResult({ lines }: { lines: readonly string[] }) {
    return (
        <div className={TERMINAL_UI.output.textResult}>
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
        <div className={TERMINAL_UI.output.entry}>
            <div className={TERMINAL_UI.output.commandRow}>
                <TerminalPrompt />

                <span className="min-w-0 break-words">{entry.command}</span>
            </div>

            <div className={TERMINAL_UI.output.result}>
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
