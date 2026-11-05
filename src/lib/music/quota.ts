export type QuotaResult = { ok: true } | { ok: false; resetsAt: number };

export type PlayQuota = {
    consume: (key: string, now: number) => QuotaResult;
};

type QuotaOptions = {
    limit: number;
    maxEntries: number;
};

function getMonthIndex(now: number) {
    const date = new Date(now);

    return date.getUTCFullYear() * 12 + date.getUTCMonth();
}

export function getNextMonthStart(now: number) {
    const date = new Date(now);

    return Date.UTC(date.getUTCFullYear(), date.getUTCMonth() + 1, 1);
}

export function createPlayQuota({ limit, maxEntries }: QuotaOptions): PlayQuota {
    const counts = new Map<string, number>();

    let currentMonth = -1;

    function consume(key: string, now: number): QuotaResult {
        const month = getMonthIndex(now);

        if (month !== currentMonth) {
            counts.clear();

            currentMonth = month;
        }

        const count = counts.get(key) ?? 0;

        if (count >= limit) {
            return { ok: false, resetsAt: getNextMonthStart(now) };
        }

        if (count === 0 && counts.size >= maxEntries) {
            const oldest = counts.keys().next().value;

            if (oldest !== undefined) {
                counts.delete(oldest);
            }
        }

        counts.set(key, count + 1);

        return { ok: true };
    }

    return { consume };
}
