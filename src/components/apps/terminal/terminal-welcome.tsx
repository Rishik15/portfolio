import { TERMINAL_WELCOME } from "@/config/terminal";

export function TerminalWelcome() {
    return (
        <div className="max-w-2xl border-y border-foreground/15 py-3">
            <p className="font-medium text-foreground/90">
                {TERMINAL_WELCOME.title}
            </p>

            <p className="mt-1 text-xs text-foreground/45">
                {TERMINAL_WELCOME.hint}
            </p>
        </div>
    );
}
