import { Music2, SearchX } from "lucide-react";

import { MUSIC_UI } from "./music-ui";

const SKELETON_WIDTHS = ["60%", "35%", "8%"] as const;

export function MusicLoadingState() {
    return (
        <div aria-busy="true" className="px-6 pt-6">
            <div className="flex gap-5">
                <div className={`${MUSIC_UI.state.skeleton} size-36 rounded-xl`} />

                <div className="flex flex-col justify-end gap-3">
                    <div className={`${MUSIC_UI.state.skeleton} h-7 w-56`} />
                    <div className={`${MUSIC_UI.state.skeleton} h-4 w-40`} />
                </div>
            </div>

            <div className="mt-8 flex flex-col gap-3">
                {Array.from({ length: 8 }, (_, row) => (
                    <div key={row} className="flex h-9 items-center justify-between gap-6">
                        {SKELETON_WIDTHS.map((width) => (
                            <div
                                key={width}
                                className={`${MUSIC_UI.state.skeleton} h-3`}
                                style={{ width }}
                            />
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );
}

type MusicErrorStateProps = {
    onRetry: () => void;
};

export function MusicErrorState({ onRetry }: MusicErrorStateProps) {
    return (
        <div role="alert" className={MUSIC_UI.state.root}>
            <Music2 className={MUSIC_UI.state.icon} />

            <p className={MUSIC_UI.state.title}>Couldn&apos;t load music</p>

            <p className={MUSIC_UI.state.text}>
                Audius didn&apos;t respond. Check your connection and try again.
            </p>

            <button type="button" onClick={onRetry} className={MUSIC_UI.state.action}>
                Try again
            </button>
        </div>
    );
}

type MusicEmptySearchProps = {
    query: string;
    onClear: () => void;
};

export function MusicEmptySearch({ query, onClear }: MusicEmptySearchProps) {
    return (
        <div className={MUSIC_UI.state.root}>
            <SearchX className="size-7 text-muted-foreground" />

            <p className="max-w-full truncate text-[13px] font-medium">
                No matches for &quot;{query}&quot;
            </p>

            <p className={MUSIC_UI.state.text}>
                Try a different title or artist.
            </p>

            <button type="button" onClick={onClear} className={MUSIC_UI.state.action}>
                Clear search
            </button>
        </div>
    );
}

export function MusicPlaybackBanner() {
    return (
        <p role="status" className={MUSIC_UI.state.banner}>
            Couldn&apos;t play this track. Press play to try again.
        </p>
    );
}
