import { TERMINAL_UI } from "@/components/apps/terminal/terminal-ui";
import { TERMINAL_WELCOME } from "@/config/terminal";

export function TerminalWelcome() {
    return (
        <div className={TERMINAL_UI.welcome.root}>
            <div className={TERMINAL_UI.welcome.body}>
                <p className={TERMINAL_UI.welcome.title}>
                    {TERMINAL_WELCOME.title}
                </p>
            </div>

            <div className={TERMINAL_UI.welcome.helpRow}>
                <span className={TERMINAL_UI.welcome.muted}>
                    {TERMINAL_WELCOME.help.prefix}
                </span>

                <span className={TERMINAL_UI.welcome.command}>
                    {TERMINAL_WELCOME.help.command}
                </span>

                <span className={TERMINAL_UI.welcome.muted}>
                    {TERMINAL_WELCOME.help.suffix}
                </span>
            </div>
        </div>
    );
}
