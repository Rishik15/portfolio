"use client";

import { useMemo, useState } from "react";

import type { MusicPlaylist } from "@/types/music";

import type { MusicTrackEntry } from "./music-track-table";

export function useMusicView(
    playlists: readonly MusicPlaylist[],
    playingPlaylistId: string | null,
) {
    const [selectedId, setSelectedId] = useState<string | null>(null);

    const [query, setQuery] = useState("");

    const playlist =
        playlists.find((item) => item.id === selectedId) ??
        playlists.find((item) => item.id === playingPlaylistId) ??
        playlists[0] ??
        null;

    const entries = useMemo<readonly MusicTrackEntry[]>(() => {
        const needle = query.trim().toLowerCase();

        const all = (playlist?.tracks ?? []).map((track, index) => ({
            track,
            index,
        }));

        if (!needle) {
            return all;
        }

        return all.filter(
            ({ track }) =>
                track.title.toLowerCase().includes(needle) ||
                track.artist.toLowerCase().includes(needle),
        );
    }, [playlist, query]);

    function selectPlaylist(id: string) {
        setSelectedId(id);
        setQuery("");
    }

    return { playlist, entries, query, setQuery, selectPlaylist };
}
