import { useState } from "react";

import { useMusic } from "@/components/providers/music-provider";
import { useWindowManager } from "@/components/windows/window-manager";
import { WINDOW_IDS, type WindowId } from "@/config/windows";

import {
    normalizeTerminalCommand,
    resolveTerminalCommand,
} from "./terminal-command";
import type { TerminalEntry } from "./terminal-types";

const TERMINAL_WINDOW_COMMANDS: Readonly<Record<string, WindowId>> = {
    "/about": WINDOW_IDS.about,
    "/resume": WINDOW_IDS.resume,
};

export function useTerminal() {
    const { activateWindow } = useWindowManager();
    const { toggleMusic } = useMusic();

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

        const windowId = TERMINAL_WINDOW_COMMANDS[normalizedCommand];

        if (windowId) {
            activateWindow(windowId);
        }

        if (normalizedCommand === "/music") {
            toggleMusic();
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
