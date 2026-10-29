const MUSIC_PLAYBACK_STORAGE_KEY = "portfolio-music-playback";
const MUSIC_USAGE_STORAGE_KEY = "portfolio-music-usage";

const MUSIC_TRACK_START_LIMIT = 1000;

const MUSIC_USAGE_WINDOW_MS = 24 * 60 * 60 * 1000;
const MUSIC_USAGE_EXPIRATION_MS = 10 * 24 * 60 * 60 * 1000;

export type StoredPlaybackState = {
    trackId: string;
    position: number;
};

type StoredUsageState = {
    windowStartedAt: number;
    lastUsedAt: number;
    trackStarts: number;
};

function isStoredUsageState(value: unknown): value is StoredUsageState {
    if (typeof value !== "object" || value === null) {
        return false;
    }

    const candidate = value as Record<string, unknown>;

    return (
        typeof candidate.windowStartedAt === "number" &&
        typeof candidate.lastUsedAt === "number" &&
        typeof candidate.trackStarts === "number" &&
        Number.isFinite(candidate.windowStartedAt) &&
        Number.isFinite(candidate.lastUsedAt) &&
        Number.isFinite(candidate.trackStarts)
    );
}

function createFreshUsageState(now: number): StoredUsageState {
    return {
        windowStartedAt: now,
        lastUsedAt: now,
        trackStarts: 1,
    };
}

function storeUsageState(usage: StoredUsageState) {
    window.localStorage.setItem(MUSIC_USAGE_STORAGE_KEY, JSON.stringify(usage));
}

export function getStoredPlaybackState(): StoredPlaybackState | null {
    try {
        const storedValue = window.sessionStorage.getItem(
            MUSIC_PLAYBACK_STORAGE_KEY,
        );

        if (!storedValue) {
            return null;
        }

        const parsedValue = JSON.parse(
            storedValue,
        ) as Partial<StoredPlaybackState>;

        if (
            typeof parsedValue.trackId !== "string" ||
            typeof parsedValue.position !== "number" ||
            !Number.isFinite(parsedValue.position) ||
            parsedValue.position < 0
        ) {
            return null;
        }

        return {
            trackId: parsedValue.trackId,
            position: parsedValue.position,
        };
    } catch {
        return null;
    }
}

export function storePlaybackState(trackId: string, position: number) {
    try {
        window.sessionStorage.setItem(
            MUSIC_PLAYBACK_STORAGE_KEY,
            JSON.stringify({
                trackId,
                position: Math.max(0, position),
            } satisfies StoredPlaybackState),
        );
    } catch {
        // Playback persistence is optional.
    }
}

export function consumeTrackStart() {
    try {
        const now = Date.now();

        const storedValue = window.localStorage.getItem(
            MUSIC_USAGE_STORAGE_KEY,
        );

        let usage: StoredUsageState | null = null;

        if (storedValue) {
            try {
                const parsedValue: unknown = JSON.parse(storedValue);

                if (isStoredUsageState(parsedValue)) {
                    usage = parsedValue;
                }
            } catch {
                usage = null;
            }
        }

        if (!usage) {
            storeUsageState(createFreshUsageState(now));

            return true;
        }

        const usageExpired =
            now - usage.lastUsedAt >= MUSIC_USAGE_EXPIRATION_MS;

        if (usageExpired) {
            storeUsageState(createFreshUsageState(now));

            return true;
        }

        const windowExpired =
            now - usage.windowStartedAt >= MUSIC_USAGE_WINDOW_MS;

        if (windowExpired) {
            storeUsageState(createFreshUsageState(now));

            return true;
        }

        if (usage.trackStarts >= MUSIC_TRACK_START_LIMIT) {
            storeUsageState({
                ...usage,
                lastUsedAt: now,
            });

            return false;
        }

        storeUsageState({
            windowStartedAt: usage.windowStartedAt,
            lastUsedAt: now,
            trackStarts: usage.trackStarts + 1,
        });

        return true;
    } catch {
        /*
         * If browser storage is unavailable,
         * music should still remain usable.
         */
        return true;
    }
}
