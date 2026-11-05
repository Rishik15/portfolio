import { Search, X } from "lucide-react";

import { MUSIC_UI } from "./music-ui";

type MusicSearchProps = {
    value: string;
    resultCount: number;
    onChange: (value: string) => void;
};

export function MusicSearch({ value, resultCount, onChange }: MusicSearchProps) {
    return (
        <div className={MUSIC_UI.search.root}>
            <div className={MUSIC_UI.search.field}>
                <Search className={MUSIC_UI.search.icon} />

                <input
                    type="search"
                    value={value}
                    placeholder="Search this playlist"
                    aria-label="Search this playlist"
                    className={MUSIC_UI.search.input}
                    onChange={(event) => onChange(event.target.value)}
                    onKeyDown={(event) => {
                        if (event.key === "Escape") {
                            onChange("");
                        }
                    }}
                />

                {value ? (
                    <button
                        type="button"
                        aria-label="Clear search"
                        className={MUSIC_UI.search.clear}
                        onClick={() => onChange("")}
                    >
                        <X className="size-3.5" />
                    </button>
                ) : null}
            </div>

            <p aria-live="polite" className="sr-only">
                {value ? `${resultCount} results` : ""}
            </p>
        </div>
    );
}
