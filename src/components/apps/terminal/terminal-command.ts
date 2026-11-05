import { TERMINAL_COMMANDS } from "@/config/terminal";

import { getClosestCommand } from "./terminal-closest";
import type { TerminalDraft } from "./terminal-types";

export function normalizeTerminalCommand(command: string) {
    const normalized = command.trim().toLowerCase();

    return normalized.startsWith("/") ? normalized : `/${normalized}`;
}

export function isMusicCommand(command: string) {
    return command.trim().toLowerCase() === "/music";
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

export function getGhostText(value: string, suggestion: string | undefined) {
    if (!suggestion || !value || value !== value.trim()) {
        return "";
    }

    return suggestion.slice(normalizeTerminalCommand(value).length);
}

export function resolveTerminalCommand(command: string): TerminalDraft {
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

    if (normalized === "/projects") {
        return {
            command,
            result: {
                type: "text",
                lines: ["Opening projects..."],
            },
        };
    }

    if (normalized === "/experience") {
        return {
            command,
            result: {
                type: "text",
                lines: ["Opening experience..."],
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

    if (isMusicCommand(command)) {
        return {
            command,
            result: {
                type: "text",
                lines: ["Opening music..."],
            },
        };
    }

    const closest = getClosestCommand(normalized);

    return {
        command,
        result: {
            type: "text",
            lines: [
                `command not found: ${command}`,
                closest
                    ? `Did you mean ${closest}?`
                    : "Type /help to see available commands.",
            ],
        },
    };
}
