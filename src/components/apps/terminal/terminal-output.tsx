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

function Result({ result }: { result: TerminalResult }) {
    switch (result.type) {
        case "help":
            return <TerminalHelp />;

        case "skills":
            return <TerminalSkills />;

        case "certificates":
            return <TerminalCertificates />;

        case "text":
            return <TextResult lines={result.lines} />;
    }
}

function Entry({ entry }: { entry: TerminalEntry }) {
    return (
        <div className="w-full">
            <div className="flex items-center gap-2">
                <TerminalPrompt />
                <span>{entry.command}</span>
            </div>

            <div className="mt-2 w-full">
                <Result result={entry.result} />
            </div>
        </div>
    );
}

type TerminalOutputProps = {
    entries: TerminalEntry[];
    showWelcome: boolean;
};

export function TerminalOutput({ entries, showWelcome }: TerminalOutputProps) {
    return (
        <div className="w-full">
            {showWelcome && <TerminalWelcome />}

            {entries.length > 0 && (
                <div className={showWelcome ? "mt-2 space-y-2" : "space-y-2"}>
                    {entries.map((entry, index) => (
                        <Entry
                            key={`${entry.command}-${index}`}
                            entry={entry}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
