import { fetchAudius, getAudiusHeaders } from "@/lib/audius";

const STREAM_RETRY_DELAYS_MS = [250, 600] as const;

const PASSTHROUGH_HEADERS = [
    "accept-ranges",
    "cache-control",
    "content-length",
    "content-range",
    "content-type",
    "etag",
    "last-modified",
] as const;

function createResponseHeaders(upstream: Response) {
    const headers = new Headers();

    for (const name of PASSTHROUGH_HEADERS) {
        const value = upstream.headers.get(name);

        if (value) {
            headers.set(name, value);
        }
    }

    return headers;
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
            } catch {
                // Try the next retry delay.
            }
        }

        throw firstError;
    }
}

export async function GET(request: Request) {
    const url = new URL(request.url);
    const trackId = url.searchParams.get("trackId");

    if (!trackId) {
        return new Response("Missing trackId.", {
            status: 400,
        });
    }

    try {
        const range = request.headers.get("range");

        const upstream = await fetchTrackStreamWithRetry(trackId, range);

        if (!upstream.ok && upstream.status !== 206) {
            console.error(
                "Audius stream request failed:",
                upstream.status,
                trackId,
            );

            return new Response("Unable to stream this track.", {
                status: upstream.status,
            });
        }

        return new Response(upstream.body, {
            status: upstream.status,
            headers: createResponseHeaders(upstream),
        });
    } catch (error) {
        console.error("Failed to stream Audius track after retries:", error);

        return new Response("Unable to stream this track.", {
            status: 502,
        });
    }
}
