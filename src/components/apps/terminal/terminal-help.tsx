import { TERMINAL_COMMANDS } from "@/config/terminal";

const HELP_COMMANDS = TERMINAL_COMMANDS.filter(
    ({ visibleInHelp }) => visibleInHelp,
);

export function TerminalHelp() {
    return (
        <div
            className="
                w-full
                border
                border-foreground/25
                bg-background/20
            "
        >
            <div
                className="
                                  grid
                                  grid-cols-[12rem_minmax(0,1fr)]
                                  gap-4
                                  px-4
                                  py-1
                                  text-[10px]
                                  border-b
                                  border-foreground/15
                                  uppercase
                                  tracking-[0.16em]
                                  text-foreground/55
                              "
            >
                <span>Command</span>
                <span>What it does</span>
            </div>
            <div className="px-2 pb-2 mt-1">
                {HELP_COMMANDS.map((command) => (
                    <div
                        key={command.name}
                        className="
                            grid
                            grid-cols-[12rem_minmax(0,1fr)]
                            items-center
                            gap-4
                            px-2
                            py-1.5
                        "
                    >
                        <span
                            className="
                                text-sm
                                font-medium
                                text-foreground/90
                            "
                        >
                            {command.name}
                        </span>

                        <span className="text-sm text-foreground/50">
                            {command.description}
                        </span>
                    </div>
                ))}
            </div>

            <div
                className="
                    grid
                    grid-cols-3
                    gap-4
                    border-t
                    border-foreground/15
                    px-4
                    py-2.5
                    text-[11px]
                    text-foreground/35
                "
            >
                <div className="flex items-center gap-2">
                    <span className="text-foreground/55">↑</span>
                    <span>Up Arrow for previous command</span>
                </div>

                <div className="flex items-center gap-2">
                    <span className="text-foreground/55">↓</span>
                    <span>Down Arrow for next command</span>
                </div>

                <div className="flex items-center gap-2">
                    <span className="text-foreground/55">Esc</span>
                    <span>Clears current input</span>
                </div>
            </div>
        </div>
    );
}
