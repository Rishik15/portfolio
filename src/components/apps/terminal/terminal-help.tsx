import { TERMINAL_UI } from "@/components/apps/terminal/terminal-ui";
import { TERMINAL_COMMANDS } from "@/config/terminal";

const HELP_COMMANDS = TERMINAL_COMMANDS.filter(
    ({ visibleInHelp }) => visibleInHelp,
);

export function TerminalHelp() {
    return (
        <div className={TERMINAL_UI.help.root}>
            <div className={TERMINAL_UI.help.header}>
                <span>Command</span>
                <span>What it does</span>
            </div>

            <div className={TERMINAL_UI.help.body}>
                {HELP_COMMANDS.map((command) => (
                    <div key={command.name} className={TERMINAL_UI.help.row}>
                        <span className={TERMINAL_UI.help.command}>
                            {command.name}
                        </span>

                        <span className={TERMINAL_UI.help.description}>
                            {command.description}
                        </span>
                    </div>
                ))}
            </div>

            <div className={TERMINAL_UI.help.footer}>
                <div className={TERMINAL_UI.help.footerItem}>
                    <span className={TERMINAL_UI.help.footerKey}>↑</span>

                    <span>Up Arrow for previous command</span>
                </div>

                <div className={TERMINAL_UI.help.footerItem}>
                    <span className={TERMINAL_UI.help.footerKey}>↓</span>

                    <span>Down Arrow for next command</span>
                </div>

                <div className={TERMINAL_UI.help.footerItem}>
                    <span className={TERMINAL_UI.help.footerKey}>Esc</span>

                    <span>Clears current input</span>
                </div>
            </div>
        </div>
    );
}
