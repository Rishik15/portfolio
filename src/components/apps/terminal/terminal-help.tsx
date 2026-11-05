import { usePrintUnit } from "@/components/apps/terminal/terminal-print";
import { TERMINAL_UI } from "@/components/apps/terminal/terminal-ui";
import { HELP_COMMANDS } from "@/components/apps/terminal/terminal-units";

function HelpUnit({
    index,
    className,
    onRun,
    children,
}: {
    index: number;
    className: string;
    onRun?: () => void;
    children: React.ReactNode;
}) {
    const interactive = onRun
        ? {
              role: "button",
              tabIndex: 0,
              onClick: onRun,
              onKeyDown: (event: React.KeyboardEvent) => {
                  if (event.key === "Enter") onRun();
              },
          }
        : {};

    return (
        <div {...usePrintUnit(index)} {...interactive} className={className}>
            {children}
        </div>
    );
}

export function TerminalHelp({ onRun }: { onRun: (command: string) => void }) {
    return (
        <div className={TERMINAL_UI.help.root}>
            <HelpUnit index={0} className={TERMINAL_UI.help.header}>
                <span>Command</span>
                <span>What it does</span>
            </HelpUnit>

            <div className={TERMINAL_UI.help.body}>
                {HELP_COMMANDS.map((command, index) => (
                    <HelpUnit
                        key={command.name}
                        index={1 + index}
                        className={TERMINAL_UI.help.row}
                        onRun={() => onRun(command.name)}
                    >
                        <span className={TERMINAL_UI.help.command}>
                            {command.name}
                        </span>

                        <span className={TERMINAL_UI.help.description}>
                            {command.description}
                        </span>
                    </HelpUnit>
                ))}
            </div>
        </div>
    );
}
