import { useMemo, useState } from "react";

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
    "/projects": WINDOW_IDS.projects,
    "/experience": WINDOW_IDS.experience,
};

export function useTerminal() {
    const { activateWindow } = useWindowManager();

    const { isMusicVisible, toggleMusic, musicError } = useMusic();

    const [entries, setEntries] = useState<TerminalEntry[]>([]);

    const [history, setHistory] = useState<string[]>([]);

    const [showWelcome, setShowWelcome] = useState(true);

    const displayedEntries = useMemo(() => {
        if (!musicError) {
            return entries;
        }

        let hasUpdatedMusicEntry = false;

        return entries.map((entry, index) => {
            if (hasUpdatedMusicEntry) {
                return entry;
            }

            const remainingEntries = entries.slice(index + 1);

            const hasLaterMusicEntry = remainingEntries.some(
                (nextEntry) =>
                    normalizeTerminalCommand(nextEntry.command) === "/music",
            );

            if (
                normalizeTerminalCommand(entry.command) !== "/music" ||
                hasLaterMusicEntry
            ) {
                return entry;
            }

            hasUpdatedMusicEntry = true;

            return {
                ...entry,
                result: {
                    type: "text" as const,
                    lines: [musicError],
                },
            };
        });
    }, [entries, musicError]);

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
            const wasMusicVisible = isMusicVisible;

            toggleMusic();

            setEntries((current) => [
                ...current,
                {
                    command,
                    result: {
                        type: "text",
                        lines: [
                            wasMusicVisible
                                ? "Music paused."
                                : "Starting music...",
                        ],
                    },
                },
            ]);

            return;
        }

        setEntries((current) => [...current, resolveTerminalCommand(command)]);
    }

    return {
        entries: displayedEntries,
        history,
        showWelcome,
        submitCommand,
    };
}
