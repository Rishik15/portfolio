const AUDIOUS_API_BASE_URL = "https://api.audius.co/v1";

const AUDIOUS_CACHE_SECONDS = 60 * 60 * 24;

type AudiusFetchInit = RequestInit & {
    next?: {
        revalidate?: number;
        tags?: string[];
    };
};

function getAudiusBearerToken() {
    const token = process.env.AUDIUS_BEARER_TOKEN;

    if (!token) {
        throw new Error(
            "AUDIUS_BEARER_TOKEN is not configured in the server environment.",
        );
    }

    return token;
}

export function getAudiusUrl(path: string) {
    return `${AUDIOUS_API_BASE_URL}${path}`;
}

export function getAudiusHeaders(headers?: HeadersInit) {
    const nextHeaders = new Headers(headers);

    nextHeaders.set("Authorization", `Bearer ${getAudiusBearerToken()}`);

    return nextHeaders;
}

export function fetchAudius(path: string, init: AudiusFetchInit = {}) {
    const { next, ...requestInit } = init;

    const cacheOptions =
        requestInit.cache !== undefined
            ? {}
            : {
                  next: next ?? {
                      revalidate: AUDIOUS_CACHE_SECONDS,
                  },
              };

    return fetch(getAudiusUrl(path), {
        ...requestInit,
        ...cacheOptions,
        headers: getAudiusHeaders(requestInit.headers),
    });
}
