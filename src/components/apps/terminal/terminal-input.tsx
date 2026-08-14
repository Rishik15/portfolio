import {
    useState,
    type KeyboardEvent,
    type RefObject,
    type SyntheticEvent,
} from "react";

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

    const [isFocused, setIsFocused] = useState(false);
    const [caretIndex, setCaretIndex] = useState(0);

    function updateCaretPosition() {
        const element = inputRef.current;

        if (!element) {
            return;
        }

        setCaretIndex(element.selectionStart ?? element.value.length);
    }

    function handleSubmit(event: SyntheticEvent<HTMLFormElement>) {
        event.preventDefault();

        const command = input.value.trim();

        if (!command) {
            return;
        }

        onCommand(command);
        input.reset();
        setCaretIndex(0);
    }

    function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
        input.handleKeyDown(event);

        window.requestAnimationFrame(updateCaretPosition);
    }

    function handleSuggestionSelect(command: string) {
        input.setValue(command);
        setCaretIndex(command.length);

        window.requestAnimationFrame(() => {
            const element = inputRef.current;

            if (!element) {
                return;
            }

            element.focus();
            element.setSelectionRange(command.length, command.length);
        });
    }

    const cursorCharacter = input.value[caretIndex] ?? "\u00A0";

    return (
        <div className="w-full">
            <form
                onSubmit={handleSubmit}
                className="flex w-full items-center gap-2"
            >
                <TerminalPrompt />

                <div className="relative min-w-0 flex-1">
                    <input
                        ref={inputRef}
                        value={input.value}
                        onChange={(event) => {
                            input.setValue(event.target.value);

                            setCaretIndex(
                                event.target.selectionStart ??
                                    event.target.value.length,
                            );
                        }}
                        onKeyDown={handleKeyDown}
                        onSelect={updateCaretPosition}
                        onClick={updateCaretPosition}
                        onFocus={() => {
                            setIsFocused(true);

                            window.requestAnimationFrame(updateCaretPosition);
                        }}
                        onBlur={() => setIsFocused(false)}
                        aria-label="Terminal command"
                        autoComplete="off"
                        spellCheck={false}
                        autoFocus
                        className="
                            w-full
                            min-w-0
                            bg-transparent
                            p-0
                            text-foreground
                            caret-transparent
                            outline-none
                        "
                    />

                    {isFocused && (
                        <span
                            aria-hidden="true"
                            style={{
                                left: `${caretIndex}ch`,
                            }}
                            className="
                                pointer-events-none
                                absolute
                                top-0
                                h-4.5
                                w-[0.85ch]
                                bg-foreground/60
                                text-background
                                leading-5
                            "
                        >
                            {cursorCharacter}
                        </span>
                    )}
                </div>
            </form>

            <TerminalSuggestions
                suggestions={input.suggestions}
                activeIndex={input.activeIndex}
                onSelect={handleSuggestionSelect}
            />
        </div>
    );
}
