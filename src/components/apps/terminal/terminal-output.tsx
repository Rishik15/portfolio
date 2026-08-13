import { TERMINAL_WELCOME } from "@/config/terminal";

import { TerminalHelp } from "./terminal-help";
import { TerminalPrompt } from "./terminal-prompt";
import type { TerminalEntry, TerminalResult } from "./terminal-types";

function Welcome() {
    return (
        <div className="max-w-2xl border-y border-foreground/15 py-3">
            <p className="text-[15px] font-medium text-foreground/90">
                {TERMINAL_WELCOME.title}
            </p>

            <p className="mt-1.5 text-xs text-foreground/45">
                {TERMINAL_WELCOME.hint}
            </p>
        </div>
    );
}

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
    return result.type === "help" ? (
        <TerminalHelp />
    ) : (
        <TextResult lines={result.lines} />
    );
}

function Entry({ entry }: { entry: TerminalEntry }) {
    return (
        <div className="space-y-2">
            <div className="flex items-center gap-2">
                <TerminalPrompt />
                <span>{entry.command}</span>
            </div>

            <Result result={entry.result} />
        </div>
    );
}

type TerminalOutputProps = {
    entries: TerminalEntry[];
    showWelcome: boolean;
};

export function TerminalOutput({ entries, showWelcome }: TerminalOutputProps) {
    return (
        <div className="space-y-4">
            {showWelcome && <Welcome />}

            {entries.map((entry, index) => (
                <Entry key={`${entry.command}-${index}`} entry={entry} />
            ))}
        </div>
    );
}
