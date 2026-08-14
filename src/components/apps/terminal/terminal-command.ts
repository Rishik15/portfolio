import { TERMINAL_COMMANDS } from "@/config/terminal";

import type { TerminalEntry } from "./terminal-types";

export function normalizeTerminalCommand(command: string) {
    const normalized = command.trim().toLowerCase();

    return normalized.startsWith("/") ? normalized : `/${normalized}`;
}

export function getTerminalSuggestions(value: string) {
    const trimmedValue = value.trim();

    if (!trimmedValue) {
        return [];
    }

    const normalized = normalizeTerminalCommand(trimmedValue);

    return TERMINAL_COMMANDS.filter(
        ({ name }) => name.startsWith(normalized) && name !== normalized,
    );
}

export function resolveTerminalCommand(command: string): TerminalEntry {
    const normalized = normalizeTerminalCommand(command);

    if (normalized === "/help") {
        return {
            command,
            result: { type: "help" },
        };
    }

    if (normalized === "/about") {
        return {
            command,
            result: {
                type: "text",
                lines: ["Opening about..."],
            },
        };
    }

    if (normalized === "/resume") {
        return {
            command,
            result: {
                type: "text",
                lines: ["Opening resume..."],
            },
        };
    }

    if (normalized === "/skills") {
        return {
            command,
            result: { type: "skills" },
        };
    }

    if (normalized === "/certificates") {
        return {
            command,
            result: { type: "certificates" },
        };
    }

    if (normalized === "/music") {
        return {
            command,
            result: {
                type: "text",
                lines: ["Toggling music..."],
            },
        };
    }

    return {
        command,
        result: {
            type: "text",
            lines: [
                `command not found: ${command}`,
                "Type /help to see available commands.",
            ],
        },
    };
}
