import { useState, type KeyboardEvent } from "react";

import { getTerminalSuggestions } from "./terminal-command";

function getNextSuggestion(current: number, length: number, reverse: boolean) {
    const offset = reverse ? -1 : 1;

    return (current + offset + length) % length;
}

export function useTerminalInput(history: readonly string[]) {
    const [value, setValue] = useState("");
    const [activeIndex, setActiveIndex] = useState(0);
    const [historyIndex, setHistoryIndex] = useState<number | null>(null);

    const suggestions = getTerminalSuggestions(value);

    function changeValue(nextValue: string) {
        setValue(nextValue);
        setActiveIndex(0);
        setHistoryIndex(null);
    }

    function cycleSuggestion(reverse: boolean) {
        setActiveIndex((current) =>
            getNextSuggestion(current, suggestions.length, reverse),
        );
    }

    function browseHistory(direction: number) {
        if (!history.length) return;

        const start = historyIndex ?? history.length;
        const next = Math.min(history.length, Math.max(0, start + direction));

        setHistoryIndex(next);
        setValue(next === history.length ? "" : history[next]);
    }

    function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
        if (event.key === "Tab" && suggestions.length) {
            event.preventDefault();
            cycleSuggestion(event.shiftKey);
            return;
        }

        if (event.key === "Enter" && suggestions[activeIndex]) {
            event.preventDefault();
            changeValue(suggestions[activeIndex].name);
            return;
        }

        if (event.key === "Escape") {
            changeValue("");
            return;
        }

        if (event.key === "ArrowUp" || event.key === "ArrowDown") {
            event.preventDefault();
            browseHistory(event.key === "ArrowUp" ? -1 : 1);
        }
    }

    return {
        value,
        activeIndex,
        suggestions,
        setValue: changeValue,
        handleKeyDown,
        reset: () => changeValue(""),
    };
}
