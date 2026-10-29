// terminal-units.ts: counts the reveal units of each terminal result type.
import type { TerminalResult } from "@/components/apps/terminal/terminal-types";
import { CERTIFICATES } from "@/config/certificates";
import { SKILL_GROUPS } from "@/config/skills";
import { TERMINAL_COMMANDS } from "@/config/terminal";

export const HELP_COMMANDS = TERMINAL_COMMANDS.filter(
    ({ visibleInHelp }) => visibleInHelp,
);

export const HELP_FOOTER_COUNT = 3;

/**
 * Counts how many units a result reveals while printing.
 * @param result The command result to print.
 * @returns Lines for text, certificates and help; rows for skills.
 */
export function getResultUnitCount(result: TerminalResult) {
    switch (result.type) {
        case "help":
            return 1 + HELP_COMMANDS.length + HELP_FOOTER_COUNT;

        case "skills":
            return SKILL_GROUPS.length;

        case "certificates":
            return CERTIFICATES.reduce(
                (count, { credentialUrl }) =>
                    count + 2 + (credentialUrl ? 1 : 0),
                1,
            );

        case "text":
            return result.lines.length;
    }
}
