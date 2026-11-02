import type { Experience } from "@/config/experience";

export const MONTH_LABELS = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
] as const;

export type PlacedExperience = {
    experience: Experience;
    lane: number;
    startColumn: number;
    endColumn: number;
    clippedStart: boolean;
    clippedEnd: boolean;
};

export function toMonthIndex(iso: string) {
    const [year, month] = iso.split("-").map(Number);
    return year * 12 + month - 1;
}

export function currentMonthIndex() {
    const now = new Date();
    return now.getFullYear() * 12 + now.getMonth();
}

export function formatMonth(iso: string) {
    const [year, month] = iso.split("-").map(Number);
    return `${MONTH_LABELS[month - 1]} ${year}`;
}

export function formatRange(experience: Experience) {
    return `${formatMonth(experience.startDate)} – ${formatMonth(experience.endDate)}`;
}

export function isOngoing(experience: Experience) {
    const now = currentMonthIndex();

    return (
        toMonthIndex(experience.startDate) <= now &&
        toMonthIndex(experience.endDate) >= now
    );
}

export function getSpan(experiences: readonly Experience[]) {
    return {
        first: Math.min(...experiences.map((e) => toMonthIndex(e.startDate))),
        last: Math.max(...experiences.map((e) => toMonthIndex(e.endDate))),
    };
}

export function getLatestExperience(experiences: readonly Experience[]) {
    return experiences.reduce((latest, candidate) =>
        toMonthIndex(candidate.endDate) > toMonthIndex(latest.endDate)
            ? candidate
            : latest,
    );
}

export function assignLanes<T extends { start: number; end: number }>(
    items: readonly T[],
) {
    const laneEnds: number[] = [];

    return [...items]
        .sort((a, b) => a.start - b.start || b.end - a.end)
        .map((item) => {
            let lane = laneEnds.findIndex((end) => end < item.start);

            if (lane === -1) {
                lane = laneEnds.length;
            }

            laneEnds[lane] = item.end;

            return { item, lane };
        });
}

export function placeForYear(
    experiences: readonly Experience[],
    year: number,
): PlacedExperience[] {
    const yearStart = year * 12;
    const yearEnd = yearStart + 11;

    const visible = experiences
        .map((experience) => ({
            experience,
            start: toMonthIndex(experience.startDate),
            end: toMonthIndex(experience.endDate),
        }))
        .filter(({ start, end }) => start <= yearEnd && end >= yearStart);

    return assignLanes(visible).map(({ item, lane }) => ({
        experience: item.experience,
        lane,
        startColumn: Math.max(item.start, yearStart) - yearStart,
        endColumn: Math.min(item.end, yearEnd) - yearStart,
        clippedStart: item.start < yearStart,
        clippedEnd: item.end > yearEnd,
    }));
}
