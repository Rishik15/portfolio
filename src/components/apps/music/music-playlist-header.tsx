import { Pause, Play, Shuffle } from "lucide-react";

import type { MusicPlaylist } from "@/types/music";

import { formatTotalDuration } from "./music-format";
import { MusicCover } from "@/components/ui/music-cover";
import { MUSIC_UI } from "./music-ui";

type MusicPlaylistHeaderProps = {
    playlist: MusicPlaylist;
    isPlayingHere: boolean;
    shuffle: boolean;
    onTogglePlay: () => void;
    onToggleShuffle: () => void;
};

export function MusicPlaylistHeader({
    playlist,
    isPlayingHere,
    shuffle,
    onTogglePlay,
    onToggleShuffle,
}: MusicPlaylistHeaderProps) {
    const totalSeconds = playlist.tracks.reduce(
        (sum, track) => sum + track.duration,
        0,
    );

    return (
        <header className={MUSIC_UI.header.root}>
            <MusicCover
                src={playlist.coverUrl}
                className={MUSIC_UI.header.cover}
                iconClassName="size-8 text-muted-foreground"
            />

            <div className={MUSIC_UI.header.info}>
                <p className={MUSIC_UI.header.eyebrow}>Playlist</p>

                <h1 className={MUSIC_UI.header.title}>{playlist.name}</h1>

                <p className={MUSIC_UI.header.meta}>
                    {playlist.artist} - {playlist.tracks.length} tracks -{" "}
                    {formatTotalDuration(totalSeconds)}
                </p>

                <div className={MUSIC_UI.header.actions}>
                    <button
                        type="button"
                        onClick={onTogglePlay}
                        className={MUSIC_UI.header.playButton}
                    >
                        {isPlayingHere ? (
                            <Pause className="size-4" fill="currentColor" />
                        ) : (
                            <Play className="size-4" fill="currentColor" />
                        )}
                        {isPlayingHere ? "Pause" : "Play"}
                    </button>

                    <button
                        type="button"
                        aria-label="Shuffle"
                        aria-pressed={shuffle}
                        onClick={onToggleShuffle}
                        className={`${MUSIC_UI.iconButton} size-9 border border-border ${
                            shuffle ? MUSIC_UI.iconButtonOn : ""
                        }`}
                    >
                        <Shuffle className="size-4" />
                    </button>
                </div>
            </div>
        </header>
    );
}
