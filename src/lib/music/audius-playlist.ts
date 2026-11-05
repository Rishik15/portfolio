import { fetchAudius } from "@/lib/audius";
import type { MusicPlaylist, MusicTrack } from "@/types/music";

const NETWORK_RETRY_DELAY_MS = 250;

type AudiusArtwork = {
    "150x150"?: string;
    "480x480"?: string;
};

type AudiusUser = {
    name?: string;
    handle?: string;
};

type AudiusTrack = {
    id?: string;
    title?: string;
    duration?: number;
    artwork?: AudiusArtwork;
    user?: AudiusUser;
    is_streamable?: boolean | string;
    isStreamable?: boolean | string;
};

type AudiusPlaylist = {
    playlist_name?: string;
    artwork?: AudiusArtwork;
    user?: AudiusUser;
    tracks?: AudiusTrack[];
};

type AudiusResponse = {
    data?: AudiusPlaylist[];
};

function isTrackStreamable(track: AudiusTrack) {
    const value = track.is_streamable ?? track.isStreamable;

    return value !== false && value !== "false";
}

function getArtistName(user: AudiusUser | undefined, fallback: string) {
    return user?.name ?? user?.handle ?? fallback;
}

function normalizeTrack(track: AudiusTrack): MusicTrack | null {
    if (!track.id || !track.title || !isTrackStreamable(track)) {
        return null;
    }

    return {
        id: track.id,
        title: track.title,
        artist: getArtistName(track.user, "Audius Artist"),
        duration: track.duration ?? 0,
        coverUrl: track.artwork?.["150x150"] ?? null,
    };
}

function wait(milliseconds: number) {
    return new Promise<void>((resolve) => {
        setTimeout(resolve, milliseconds);
    });
}

async function requestPlaylist(url: string) {
    return fetchAudius(`/resolve?url=${encodeURIComponent(url)}`);
}

async function requestPlaylistWithRetry(url: string) {
    try {
        return await requestPlaylist(url);
    } catch {
        await wait(NETWORK_RETRY_DELAY_MS);

        return requestPlaylist(url);
    }
}

export async function fetchAudiusPlaylist(
    id: string,
    url: string,
): Promise<MusicPlaylist> {
    const response = await requestPlaylistWithRetry(url);

    if (!response.ok) {
        throw new Error(
            `Audius playlist ${id} failed with ${response.status}: ${await response.text()}`,
        );
    }

    const playlist = ((await response.json()) as AudiusResponse).data?.[0];

    if (!playlist) {
        throw new Error(`Audius playlist ${id} was not found.`);
    }

    const tracks = (playlist.tracks ?? [])
        .map(normalizeTrack)
        .filter((track): track is MusicTrack => track !== null);

    if (tracks.length === 0) {
        throw new Error(`Audius playlist ${id} has no playable tracks.`);
    }

    return {
        id,
        name: playlist.playlist_name ?? id,
        artist: getArtistName(playlist.user, "Audius"),
        coverUrl: playlist.artwork?.["480x480"] ?? null,
        tracks,
    };
}
