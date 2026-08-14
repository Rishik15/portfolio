import { TERMINAL_PROMPT } from "@/config/terminal";

export function TerminalPrompt() {
    return (
        <span className="flex shrink-0 items-center whitespace-nowrap">
            <span className="font-medium text-red-400 dark:text-red-400">
                {TERMINAL_PROMPT.user}
            </span>

            <span className="ml-1 text-foreground/90">
                {TERMINAL_PROMPT.symbol}
            </span>
        </span>
    );
}
