import { useEffect, useRef, useState } from "react";

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

    const pendingMusicEntryId = useRef<number | null>(null);

    useEffect(() => {
        const pendingId = pendingMusicEntryId.current;

        if (!musicError || pendingId === null) return;

        pendingMusicEntryId.current = null;

        setEntries((current) => [
            ...current.filter((entry) => entry.id !== pendingId),
            {
                id: nextEntryId.current++,
                command: "/music",
                result: { type: "text", lines: [musicError] },
            },
        ]);
    }, [musicError]);

    function addEntry(draft: TerminalDraft) {
        const entry = { ...draft, id: nextEntryId.current++ };

        setEntries((current) => [...current, entry]);

        return entry.id;
    }

    function submitCommand(command: string) {
        const normalizedCommand = normalizeTerminalCommand(command);

        setHistory((current) => [...current, command]);

        if (normalizedCommand === "/clear") {
            setEntries([]);
            pendingMusicEntryId.current = null;
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

            const entryId = addEntry({
                command,
                result: {
                    type: "text",
                    lines: [
                        wasMusicVisible ? "Music paused." : "Starting music...",
                    ],
                },
            });

            pendingMusicEntryId.current = wasMusicVisible ? null : entryId;

            return;
        }

        addEntry(resolveTerminalCommand(command));
    }

    return {
        entries,
        history,
        showWelcome,
        submitCommand,
    };
}
