import type { MusicPlaylist } from "@/types/music";

import { MusicCover } from "@/components/ui/music-cover";
import { MUSIC_UI } from "./music-ui";

type MusicSidebarProps = {
    playlists: readonly MusicPlaylist[];
    selectedId: string | null;
    onSelect: (id: string) => void;
};

export function MusicSidebar({
    playlists,
    selectedId,
    onSelect,
}: MusicSidebarProps) {
    return (
        <nav aria-label="Playlists" className={MUSIC_UI.sidebar.root}>
            <h2 className={MUSIC_UI.sidebar.heading}>Playlists</h2>

            {playlists.map((playlist) => (
                <button
                    key={playlist.id}
                    type="button"
                    aria-current={playlist.id === selectedId ? "page" : undefined}
                    onClick={() => onSelect(playlist.id)}
                    className={`${MUSIC_UI.sidebar.item} ${
                        playlist.id === selectedId
                            ? MUSIC_UI.sidebar.itemActive
                            : ""
                    }`}
                >
                    <MusicCover
                        src={playlist.coverUrl}
                        className={MUSIC_UI.sidebar.thumb}
                    />

                    <span className="min-w-0 flex-1">
                        <span className={`block ${MUSIC_UI.sidebar.title}`}>
                            {playlist.name}
                        </span>

                        <span className={`block ${MUSIC_UI.sidebar.artist}`}>
                            {playlist.artist}
                        </span>
                    </span>

                </button>
            ))}
        </nav>
    );
}

export function MusicPlaylistChips({
    playlists,
    selectedId,
    onSelect,
}: Pick<MusicSidebarProps, "playlists" | "selectedId" | "onSelect">) {
    return (
        <div className={MUSIC_UI.sidebar.chips}>
            {playlists.map((playlist) => (
                <button
                    key={playlist.id}
                    type="button"
                    aria-pressed={playlist.id === selectedId}
                    onClick={() => onSelect(playlist.id)}
                    className={`${MUSIC_UI.sidebar.chip} ${
                        playlist.id === selectedId
                            ? MUSIC_UI.sidebar.chipActive
                            : ""
                    }`}
                >
                    {playlist.name}
                </button>
            ))}
        </div>
    );
}
