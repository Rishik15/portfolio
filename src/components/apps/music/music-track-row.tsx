import { Play } from "lucide-react";

import type { MusicTrack } from "@/types/music";

import { MusicBars } from "./music-bars";
import { formatDuration } from "./music-format";
import { MUSIC_UI } from "./music-ui";

type MusicTrackRowProps = {
    track: MusicTrack;
    number: number;
    isCurrent: boolean;
    isPlaying: boolean;
    tabIndex: 0 | -1;
    onPlay: () => void;
};

export function MusicTrackRow({
    track,
    number,
    isCurrent,
    isPlaying,
    tabIndex,
    onPlay,
}: MusicTrackRowProps) {
    return (
        <button
            type="button"
            data-music-row
            tabIndex={tabIndex}
            aria-current={isCurrent ? "true" : undefined}
            onClick={onPlay}
            className={`${MUSIC_UI.table.columns} ${MUSIC_UI.table.row}`}
        >
            <span className={`flex items-center ${MUSIC_UI.table.number}`}>
                {isCurrent ? (
                    <MusicBars playing={isPlaying} />
                ) : (
                    <>
                        <span className="group-hover:hidden group-focus-visible:hidden">
                            {number}
                        </span>

                        <Play
                            className="hidden size-3.5 group-hover:block group-focus-visible:block"
                            fill="currentColor"
                        />
                    </>
                )}
            </span>

            <span className="min-w-0">
                <span
                    className={`block truncate font-medium ${
                        isCurrent ? MUSIC_UI.table.currentText : ""
                    }`}
                >
                    {track.title}
                </span>
            </span>

            <span className={MUSIC_UI.table.artist}>{track.artist}</span>

            <span className={MUSIC_UI.table.duration}>
                {formatDuration(track.duration)}
            </span>
        </button>
    );
}
