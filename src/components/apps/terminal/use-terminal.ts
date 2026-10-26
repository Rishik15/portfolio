import { useMemo, useRef, useState } from "react";

import { useMusic } from "@/components/providers/music-provider";
import { useWindowManager } from "@/components/windows/window-manager";
import { WINDOW_IDS, type WindowId } from "@/config/windows";

import {
    normalizeTerminalCommand,
    resolveTerminalCommand,
} from "./terminal-command";
import type { TerminalDraft, TerminalEntry } from "./terminal-types";

const TERMINAL_WINDOW_COMMANDS: Readonly<Record<string, WindowId>> = {
    "/about": WINDOW_IDS.about,
    "/resume": WINDOW_IDS.resume,
    "/projects": WINDOW_IDS.projects,
    "/experience": WINDOW_IDS.experience,
};

export function useTerminal() {
    const { activateWindow } = useWindowManager();

    const { isMusicVisible, toggleMusic, musicError } = useMusic();

    const nextEntryId = useRef(0);

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

    function addEntry(draft: TerminalDraft) {
        const entry = { ...draft, id: nextEntryId.current++ };

        setEntries((current) => [...current, entry]);
    }

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

            addEntry({
                command,
                result: {
                    type: "text",
                    lines: [
                        wasMusicVisible ? "Music paused." : "Starting music...",
                    ],
                },
            });

            return;
        }

        addEntry(resolveTerminalCommand(command));
    }

    return {
        entries: displayedEntries,
        history,
        showWelcome,
        submitCommand,
    };
}
