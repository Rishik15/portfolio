import { TERMINAL_UI } from "@/components/apps/terminal/terminal-ui";
import type { TerminalCommand } from "@/config/terminal";

type TerminalSuggestionsProps = {
    suggestions: readonly TerminalCommand[];
    activeIndex: number;
    onSelect: (command: string) => void;
};

export function TerminalSuggestions({
    suggestions,
    activeIndex,
    onSelect,
}: TerminalSuggestionsProps) {
    if (!suggestions.length) {
        return null;
    }

    return (
        <div className={TERMINAL_UI.suggestions.root}>
            {suggestions.map((suggestion, index) => {
                const active = index === activeIndex;

                return (
                    <button
                        key={suggestion.name}
                        type="button"
                        onMouseDown={(event) => event.preventDefault()}
                        onClick={() => onSelect(suggestion.name)}
                        className={`
                            ${TERMINAL_UI.suggestions.row}

                            ${
                                active
                                    ? TERMINAL_UI.suggestions.active
                                    : TERMINAL_UI.suggestions.inactive
                            }
                        `}
                    >
                        <span className={TERMINAL_UI.suggestions.command}>
                            {suggestion.name}
                        </span>

                        <span className={TERMINAL_UI.suggestions.description}>
                            {suggestion.description}
                        </span>
                    </button>
                );
            })}

            <div className={TERMINAL_UI.suggestions.hint}>
                Press Tab to cycle · Press Enter to select
            </div>
        </div>
    );
}
