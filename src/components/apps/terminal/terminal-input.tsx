import type { RefObject, SyntheticEvent } from "react";

import { TerminalPrompt } from "./terminal-prompt";
import { TerminalSuggestions } from "./terminal-suggestions";
import { useTerminalInput } from "./use-terminal-input";

type TerminalInputProps = {
    history: readonly string[];
    inputRef: RefObject<HTMLInputElement | null>;
    onCommand: (command: string) => void;
};

export function TerminalInput({
    history,
    inputRef,
    onCommand,
}: TerminalInputProps) {
    const input = useTerminalInput(history);

    function handleSubmit(event: SyntheticEvent<HTMLFormElement>) {
        event.preventDefault();

        const command = input.value.trim();

        if (!command) return;

        onCommand(command);
        input.reset();
    }

    return (
        <div>
            <form onSubmit={handleSubmit} className="flex items-center gap-2">
                <TerminalPrompt />

                <input
                    ref={inputRef}
                    value={input.value}
                    onChange={(event) => input.setValue(event.target.value)}
                    onKeyDown={input.handleKeyDown}
                    aria-label="Terminal command"
                    autoComplete="off"
                    spellCheck={false}
                    autoFocus
                    className="min-w-0 flex-1 bg-transparent text-foreground caret-foreground outline-none"
                />
            </form>

            <TerminalSuggestions
                suggestions={input.suggestions}
                activeIndex={input.activeIndex}
                onSelect={input.setValue}
            />
        </div>
    );
}
