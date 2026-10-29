import { NextResponse } from "next/server";

import { MUSIC_PLAYLIST } from "@/config/music";
import { fetchAudius } from "@/lib/audius";
import type { MusicPlaylist, MusicTrack } from "@/types/music";

const NETWORK_RETRY_DELAY_MS = 250;

type AudiusUser = {
    name?: string;
    handle?: string;
};

type AudiusTrack = {
    id?: string;
    title?: string;
    user?: AudiusUser;
    is_streamable?: boolean | string;
    isStreamable?: boolean | string;
};

type AudiusPlaylist = {
    id?: string;
    playlist_name?: string;
    tracks?: AudiusTrack[];
};

type AudiusResponse<T> = {
    data?: T[];
};

function isTrackStreamable(track: AudiusTrack) {
    const value = track.is_streamable ?? track.isStreamable;

    return value !== false && value !== "false";
}

function normalizeTrack(track: AudiusTrack): MusicTrack | null {
    if (!track.id || !track.title || !isTrackStreamable(track)) {
        return null;
    }

    return {
        id: track.id,
        title: track.title,
        artist: track.user?.name ?? track.user?.handle ?? "Audius Artist",
    };
}

function wait(milliseconds: number) {
    return new Promise<void>((resolve) => {
        setTimeout(resolve, milliseconds);
    });
}

async function fetchPlaylist() {
    const encodedUrl = encodeURIComponent(MUSIC_PLAYLIST.url);

    return fetchAudius(`/resolve?url=${encodedUrl}`);
}

async function getPlaylist() {
    let response: Response;

    try {
        response = await fetchPlaylist();
    } catch {
        await wait(NETWORK_RETRY_DELAY_MS);

        response = await fetchPlaylist();
    }

    if (!response.ok) {
        const body = await response.text();

        throw new Error(
            `Audius playlist request failed with ${response.status}: ${body}`,
        );
    }

    const payload = (await response.json()) as AudiusResponse<AudiusPlaylist>;

    return payload.data?.[0] ?? null;
}

export async function GET() {
    try {
        const audiusPlaylist = await getPlaylist();

        if (!audiusPlaylist) {
            return NextResponse.json(
                {
                    error: "Audius playlist was not found.",
                },
                {
                    status: 502,
                },
            );
        }

        const tracks = (audiusPlaylist.tracks ?? [])
            .map(normalizeTrack)
            .filter((track): track is MusicTrack => track !== null);

        if (tracks.length === 0) {
            return NextResponse.json(
                {
                    error: "The Audius playlist contains no playable tracks.",
                },
                {
                    status: 502,
                },
            );
        }

        const result: MusicPlaylist = {
            name: audiusPlaylist.playlist_name ?? MUSIC_PLAYLIST.name,
            tracks,
        };

        return NextResponse.json(result, {
            headers: {
                "Cache-Control":
                    "public, s-maxage=86400, stale-while-revalidate=86400",
            },
        });
    } catch (error) {
        console.error("Failed to load Audius playlist:", error);

        return NextResponse.json(
            {
                error: "Unable to load music right now.",
            },
            {
                status: 502,
            },
        );
    }
}
