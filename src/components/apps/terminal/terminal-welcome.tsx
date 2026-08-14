import { TERMINAL_WELCOME } from "@/config/terminal";

export function TerminalWelcome() {
    return (
        <div className="w-full border border-foreground/25">
            <div className="px-4 py-3">
                <p className="text-[15px] font-medium text-foreground/90">
                    {TERMINAL_WELCOME.title}
                </p>

            </div>

            <div className="border-t border-foreground/10 px-4 py-2 text-sm">
                <span className="text-foreground/45">
                    {TERMINAL_WELCOME.help.prefix}
                </span>

                <span className="mx-1.5 font-semibold text-foreground/90">
                    {TERMINAL_WELCOME.help.command}
                </span>

                <span className="text-foreground/45">
                    {TERMINAL_WELCOME.help.suffix}
                </span>
            </div>
        </div>
    );
}
