"use client";

import { useCallback, useRef, useState } from "react";

import type { MusicLibrary, MusicPlaylist } from "@/types/music";

export type LibraryStatus = "idle" | "loading" | "ready" | "error";

export function useMusicLibrary() {
    const [status, setStatus] = useState<LibraryStatus>("idle");

    const [playlists, setPlaylists] = useState<readonly MusicPlaylist[]>([]);

    const loadingRef = useRef(false);

    const load = useCallback(async () => {
        if (loadingRef.current) {
            return;
        }

        loadingRef.current = true;

        setStatus("loading");

        try {
            const response = await fetch("/api/music/playlist");

            if (!response.ok) {
                throw new Error(`Playlist request failed: ${response.status}`);
            }

            const library = (await response.json()) as MusicLibrary;

            setPlaylists(library.playlists);
            setStatus("ready");
        } catch (error) {
            console.error("Unable to load music library:", error);

            setStatus("error");
        } finally {
            loadingRef.current = false;
        }
    }, []);

    return { status, playlists, load };
}
