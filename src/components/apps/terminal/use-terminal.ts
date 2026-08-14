import { useState } from "react";

import { useWindowManager } from "@/components/windows/window-manager";
import { WINDOW_IDS } from "@/config/windows";

import {
    normalizeTerminalCommand,
    resolveTerminalCommand,
} from "./terminal-command";
import type { TerminalEntry } from "./terminal-types";

export function useTerminal() {
    const { activateWindow } = useWindowManager();

    const [entries, setEntries] = useState<TerminalEntry[]>([]);
    const [history, setHistory] = useState<string[]>([]);
    const [showWelcome, setShowWelcome] = useState(true);

    function submitCommand(command: string) {
        const normalizedCommand = normalizeTerminalCommand(command);

        setHistory((current) => [...current, command]);

        if (normalizedCommand === "/clear") {
            setEntries([]);
            setShowWelcome(false);
            return;
        }

        if (normalizedCommand === "/resume") {
            activateWindow(WINDOW_IDS.resume);
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
