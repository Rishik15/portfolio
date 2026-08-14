import { fetchAudius, getAudiusHeaders } from "@/lib/audius";

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

        const headers = getAudiusHeaders({
            Accept: "audio/*",
        });

        if (range) {
            headers.set("Range", range);
        }

        const upstream = await fetchAudius(
            `/tracks/${encodeURIComponent(trackId)}/stream`,
            {
                cache: "no-store",
                headers,
                redirect: "follow",
            },
        );

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
        console.error("Failed to stream Audius track:", error);

        return new Response("Unable to stream this track.", {
            status: 502,
        });
    }
}
