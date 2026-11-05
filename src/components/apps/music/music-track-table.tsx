import type { KeyboardEvent } from "react";

import type { MusicTrack } from "@/types/music";

import { MusicTrackRow } from "./music-track-row";
import { MUSIC_UI } from "./music-ui";

export type MusicTrackEntry = {
    track: MusicTrack;
    index: number;
};

type MusicTrackTableProps = {
    entries: readonly MusicTrackEntry[];
    currentIndex: number | null;
    isPlaying: boolean;
    onPlay: (index: number) => void;
};

function moveRowFocus(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key !== "ArrowDown" && event.key !== "ArrowUp") {
        return;
    }

    const rows = Array.from(
        event.currentTarget.querySelectorAll<HTMLElement>("[data-music-row]"),
    );

    const active = rows.indexOf(document.activeElement as HTMLElement);

    if (active === -1) {
        return;
    }

    event.preventDefault();

    rows[active + (event.key === "ArrowDown" ? 1 : -1)]?.focus();
}

export function MusicTrackHead() {
    return (
        <div
            aria-hidden
            className={`${MUSIC_UI.table.columns} ${MUSIC_UI.table.head}`}
        >
            <span />
            <span>Title</span>
            <span className="hidden @min-[640px]/music:block">Artist</span>
            <span className="text-right">Time</span>
        </div>
    );
}

export function MusicTrackTable({
    entries,
    currentIndex,
    isPlaying,
    onPlay,
}: MusicTrackTableProps) {
    const currentPosition = entries.findIndex(
        (entry) => entry.index === currentIndex,
    );

    const tabStop = Math.max(0, currentPosition);

    return (
        <div role="list" onKeyDown={moveRowFocus} className="pb-6">
            {entries.map((entry, position) => (
                <div role="listitem" key={entry.track.id}>
                    <MusicTrackRow
                        track={entry.track}
                        number={entry.index + 1}
                        isCurrent={entry.index === currentIndex}
                        isPlaying={isPlaying}
                        tabIndex={position === tabStop ? 0 : -1}
                        onPlay={() => onPlay(entry.index)}
                    />
                </div>
            ))}
        </div>
    );
}
