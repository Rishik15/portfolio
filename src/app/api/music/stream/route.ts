import {
    fetchAudius,
    getAudiusBearerToken,
    getAudiusHeaders,
} from "@/lib/audius";
import { getClientIp } from "@/lib/music/client-ip";
import { verifyStreamToken } from "@/lib/music/stream-token";

const STREAM_RETRY_DELAYS_MS = [250, 600] as const;

const PRIVATE_CACHE_CONTROL = "private, no-store";

const PASSTHROUGH_HEADERS = [
    "accept-ranges",
    "content-length",
    "content-range",
    "content-type",
    "etag",
    "last-modified",
] as const;

function createResponseHeaders(upstream?: Response) {
    const headers = new Headers({ "Cache-Control": PRIVATE_CACHE_CONTROL });

    for (const name of PASSTHROUGH_HEADERS) {
        const value = upstream?.headers.get(name);

        if (value) {
            headers.set(name, value);
        }
    }

    return headers;
}

function fail(message: string, status: number) {
    return new Response(message, {
        status,
        headers: createResponseHeaders(),
    });
}

function wait(milliseconds: number) {
    return new Promise<void>((resolve) => {
        setTimeout(resolve, milliseconds);
    });
}

async function fetchTrackStream(trackId: string, range: string | null) {
    const headers = getAudiusHeaders({
        Accept: "audio/*",
    });

    if (range) {
        headers.set("Range", range);
    }

    return fetchAudius(`/tracks/${encodeURIComponent(trackId)}/stream`, {
        cache: "no-store",
        headers,
        redirect: "follow",
    });
}

async function fetchTrackStreamWithRetry(
    trackId: string,
    range: string | null,
) {
    try {
        return await fetchTrackStream(trackId, range);
    } catch (firstError) {
        for (const delay of STREAM_RETRY_DELAYS_MS) {
            await wait(delay);

            try {
                return await fetchTrackStream(trackId, range);
            } catch {}
        }

        throw firstError;
    }
}

function isAuthorized(request: Request, trackId: string, token: string) {
    return verifyStreamToken(getAudiusBearerToken(), token, {
        trackId,
        ip: getClientIp(request),
        now: Date.now(),
    });
}

export async function GET(request: Request) {
    const url = new URL(request.url);
    const trackId = url.searchParams.get("trackId");
    const token = url.searchParams.get("token");

    if (!trackId || !token) {
        return fail("Missing trackId or token.", 400);
    }

    try {
        if (!isAuthorized(request, trackId, token)) {
            return fail("Stream not authorized.", 403);
        }

        const range = request.headers.get("range");

        const upstream = await fetchTrackStreamWithRetry(trackId, range);

        if (!upstream.ok && upstream.status !== 206) {
            console.error(
                "Audius stream request failed:",
                upstream.status,
                trackId,
            );

            return fail("Unable to stream this track.", upstream.status);
        }

        return new Response(upstream.body, {
            status: upstream.status,
            headers: createResponseHeaders(upstream),
        });
    } catch (error) {
        console.error("Failed to stream Audius track after retries:", error);

        return fail("Unable to stream this track.", 502);
    }
}
