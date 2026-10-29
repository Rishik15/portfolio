const SHORT_DATE_FORMATTER = new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    timeZone: "UTC",
});

const LONG_DATE_FORMATTER = new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
});

export function formatShortNoteDate(value: string): string {
    const date = parseNoteDate(value);

    return date ? SHORT_DATE_FORMATTER.format(date) : "";
}

export function formatLongNoteDate(value: string): string {
    const date = parseNoteDate(value);

    return date ? LONG_DATE_FORMATTER.format(date) : "";
}

function parseNoteDate(value: string): Date | null {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
        return null;
    }

    const date = new Date(`${value}T00:00:00.000Z`);

    return Number.isNaN(date.getTime()) ? null : date;
}
