import { TERMINAL_COMMANDS } from "@/config/terminal";

const MAX_TYPO_DISTANCE = 2;

function getEditDistance(a: string, b: string) {
    let previous = Array.from({ length: b.length + 1 }, (_, index) => index);

    for (let i = 1; i <= a.length; i++) {
        const current = [i];

        for (let j = 1; j <= b.length; j++) {
            const cost = a[i - 1] === b[j - 1] ? 0 : 1;

            current[j] = Math.min(
                previous[j] + 1,
                current[j - 1] + 1,
                previous[j - 1] + cost,
            );
        }

        previous = current;
    }

    return previous[b.length];
}

export function getClosestCommand(normalized: string) {
    let best: string | null = null;
    let bestDistance = MAX_TYPO_DISTANCE + 1;

    for (const { name } of TERMINAL_COMMANDS) {
        const distance = getEditDistance(normalized, name);

        if (distance < bestDistance) {
            best = name;
            bestDistance = distance;
        }
    }

    return best;
}
