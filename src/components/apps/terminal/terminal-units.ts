import type { TerminalResult } from "@/components/apps/terminal/terminal-types";
import { CERTIFICATES } from "@/config/certificates";
import { SKILL_GROUPS } from "@/config/skills";
import { TERMINAL_COMMANDS } from "@/config/terminal";

export const HELP_COMMANDS = TERMINAL_COMMANDS.filter(
    ({ visibleInHelp }) => visibleInHelp,
);

export const HELP_FOOTER_COUNT = 3;

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
