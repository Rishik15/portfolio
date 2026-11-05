import { MUSIC_LIBRARY_TTL_MS, MUSIC_PLAYLISTS } from "@/config/music";
import type { MusicLibrary, MusicPlaylist } from "@/types/music";

import { fetchAudiusPlaylist } from "./audius-playlist";

type Snapshot = {
    library: MusicLibrary;
    trackIds: ReadonlySet<string>;
    expiresAt: number;
};

let snapshot: Snapshot | null = null;

let inflight: Promise<Snapshot> | null = null;

async function loadSnapshot(): Promise<Snapshot> {
    const results = await Promise.allSettled(
        MUSIC_PLAYLISTS.map(({ id, url }) => fetchAudiusPlaylist(id, url)),
    );

    const playlists: MusicPlaylist[] = [];

    for (const result of results) {
        if (result.status === "fulfilled") {
            playlists.push(result.value);
        } else {
            console.error("Failed to load Audius playlist:", result.reason);
        }
    }

    if (playlists.length === 0) {
        throw new Error("No Audius playlist could be loaded.");
    }

    return {
        library: { playlists },
        trackIds: new Set(
            playlists.flatMap((playlist) =>
                playlist.tracks.map((track) => track.id),
            ),
        ),
        expiresAt: Date.now() + MUSIC_LIBRARY_TTL_MS,
    };
}

async function getSnapshot() {
    if (snapshot && snapshot.expiresAt > Date.now()) {
        return snapshot;
    }

    inflight ??= loadSnapshot()
        .then((next) => {
            snapshot = next;

            return next;
        })
        .finally(() => {
            inflight = null;
        });

    try {
        return await inflight;
    } catch (error) {
        if (snapshot) {
            return snapshot;
        }

        throw error;
    }
}

export async function getMusicLibrary() {
    return (await getSnapshot()).library;
}

export async function isKnownTrackId(trackId: string) {
    return (await getSnapshot()).trackIds.has(trackId);
}
