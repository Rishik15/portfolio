"use client";

import { useEffect } from "react";

import { useMusic } from "@/components/providers/music-provider";

import { MusicNowPlaying } from "./music-now-playing";
import { MusicPlaylistHeader } from "./music-playlist-header";
import { MusicSearch } from "./music-search";
import { MusicSidebar } from "./music-sidebar";
import {
    MusicEmptySearch,
    MusicErrorState,
    MusicLoadingState,
    MusicPlaybackBanner,
} from "./music-states";
import { MusicTrackHead, MusicTrackTable } from "./music-track-table";
import { MUSIC_UI } from "./music-ui";
import { useMusicView } from "./use-music-view";

export function Music() {
    const {
        libraryStatus,
        playlists,
        loadLibrary,
        playingPlaylistId,
        currentIndex,
        isPlaying,
        hasPlaybackError,
        shuffle,
        playTrack,
        togglePlayback,
        toggleShuffle,
    } = useMusic();

    const view = useMusicView(playlists, playingPlaylistId);

    useEffect(() => {
        if (libraryStatus === "idle") {
            loadLibrary();
        }
    }, [libraryStatus, loadLibrary]);

    const { playlist } = view;

    const isPlayingHere =
        playlist !== null && playlist.id === playingPlaylistId;

    function togglePlaylistPlayback() {
        if (!playlist) {
            return;
        }

        if (isPlayingHere) {
            togglePlayback();

            return;
        }

        playTrack(playlist.id, 0);
    }

    function renderMain() {
        if (libraryStatus === "error") {
            return <MusicErrorState onRetry={loadLibrary} />;
        }

        if (!playlist) {
            return <MusicLoadingState />;
        }

        return (
            <>
                <MusicPlaylistHeader
                    playlist={playlist}
                    isPlayingHere={isPlayingHere && isPlaying}
                    shuffle={shuffle}
                    onTogglePlay={togglePlaylistPlayback}
                    onToggleShuffle={toggleShuffle}
                />

                {hasPlaybackError ? <MusicPlaybackBanner /> : null}

                <div className={MUSIC_UI.stickyBar}>
                    <MusicSearch
                        value={view.query}
                        resultCount={view.entries.length}
                        onChange={view.setQuery}
                    />

                    {view.entries.length > 0 ? <MusicTrackHead /> : null}
                </div>

                {view.entries.length === 0 ? (
                    <MusicEmptySearch
                        query={view.query}
                        onClear={() => view.setQuery("")}
                    />
                ) : (
                    <MusicTrackTable
                        entries={view.entries}
                        currentIndex={isPlayingHere ? currentIndex : null}
                        isPlaying={isPlaying}
                        onPlay={(index) => playTrack(playlist.id, index)}
                    />
                )}
            </>
        );
    }

    return (
        <div className={MUSIC_UI.root}>
            <div className={MUSIC_UI.body}>
                <MusicSidebar
                    playlists={playlists}
                    selectedId={playlist?.id ?? null}
                    onSelect={view.selectPlaylist}
                />

                <main
                    aria-busy={libraryStatus === "loading"}
                    className={MUSIC_UI.main}
                >
                    {renderMain()}
                </main>
            </div>

            <MusicNowPlaying />
        </div>
    );
}
