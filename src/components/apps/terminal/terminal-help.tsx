import { TERMINAL_COMMANDS } from "@/config/terminal";

const HELP_COMMANDS = TERMINAL_COMMANDS.filter(
    ({ visibleInHelp }) => visibleInHelp,
);

export function TerminalHelp() {
    return (
        <div className="max-w-2xl border-y border-foreground/15 py-2">
            <p className="pb-2 text-xs uppercase tracking-[0.18em] text-foreground/40">
                Commands
            </p>

            <div className="border-y border-foreground/10">
                {HELP_COMMANDS.map((command) => (
                    <div
                        key={command.name}
                        className="grid grid-cols-[7rem_1fr] gap-4 border-b border-foreground/[0.06] py-2 last:border-b-0"
                    >
                        <span className="text-foreground/85">
                            {command.name}
                        </span>

                        <span className="text-foreground/50">
                            {command.description}
                        </span>
                    </div>
                ))}
            </div>

            <p className="pt-2 text-xs text-foreground/35">
                Tab cycle · Enter select · ↑ ↓ history · Esc clear input
            </p>
        </div>
    );
}
