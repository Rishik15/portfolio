import { TERMINAL_UI } from "@/components/apps/terminal/terminal-ui";
import { TERMINAL_PROMPT } from "@/config/terminal";

export function TerminalPrompt() {
    return (
        <span className={TERMINAL_UI.prompt.root}>
            <span className={TERMINAL_UI.prompt.user}>
                {TERMINAL_PROMPT.user}
            </span>

            <span className={TERMINAL_UI.prompt.symbol}>
                {TERMINAL_PROMPT.symbol}
            </span>
        </span>
    );
}
