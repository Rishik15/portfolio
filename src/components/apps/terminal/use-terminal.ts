import { useState } from "react";

import {
    normalizeTerminalCommand,
    resolveTerminalCommand,
} from "./terminal-command";
import type { TerminalEntry } from "./terminal-types";

export function useTerminal() {
    const [entries, setEntries] = useState<TerminalEntry[]>([]);
    const [history, setHistory] = useState<string[]>([]);
    const [showWelcome, setShowWelcome] = useState(true);

    function submitCommand(command: string) {
        setHistory((current) => [...current, command]);

        if (normalizeTerminalCommand(command) === "/clear") {
            setEntries([]);
            setShowWelcome(false);
            return;
        }

        setEntries((current) => [...current, resolveTerminalCommand(command)]);
    }

    return {
        entries,
        history,
        showWelcome,
        submitCommand,
    };
}
