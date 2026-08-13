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
        <div className="mt-2 max-w-2xl border-y border-foreground/15 py-1">
            {suggestions.map((suggestion, index) => (
                <button
                    key={suggestion.name}
                    type="button"
                    onMouseDown={(event) => event.preventDefault()}
                    onClick={() => onSelect(suggestion.name)}
                    className={`
                        grid
                        w-full
                        grid-cols-[7rem_1fr]
                        gap-4
                        px-2
                        py-1.5
                        text-left
                        transition-colors
                        ${
                            index === activeIndex
                                ? "bg-foreground/8 text-foreground"
                                : "text-foreground/45 hover:bg-foreground/4"
                        }
                    `}
                >
                    <span>{suggestion.name}</span>
                    <span>{suggestion.description}</span>
                </button>
            ))}

            <div className="border-t border-foreground/10 px-2 pt-1.5 text-xs text-foreground/30">
                Tab cycle · Enter select
            </div>
        </div>
    );
}
