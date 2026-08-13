import { TERMINAL_PROMPT } from "@/config/terminal";

export function TerminalPrompt() {
    return (
        <span className="flex shrink-0 items-center whitespace-nowrap">
            <span className="font-medium text-blue-500 dark:text-blue-800">
                {TERMINAL_PROMPT.user}
            </span>

            <span className="ml-2 text-foreground/45">
                {TERMINAL_PROMPT.symbol}
            </span>
        </span>
    );
}
