import type { MusicRepeatMode } from "@/types/music";

export type EndedAction =
    { type: "replay" } | { type: "play"; index: number } | { type: "stop" };

export function createOrder(
    length: number,
    shuffle: boolean,
    firstIndex: number,
    random: () => number = Math.random,
) {
    const order = Array.from({ length }, (_, index) => index);

    if (!shuffle) {
        return order;
    }

    const rest = order.filter((index) => index !== firstIndex);

    for (let i = rest.length - 1; i > 0; i--) {
        const j = Math.floor(random() * (i + 1));

        [rest[i], rest[j]] = [rest[j], rest[i]];
    }

    return [firstIndex, ...rest];
}

export function getAdjacentIndex(
    order: readonly number[],
    currentIndex: number,
    direction: 1 | -1,
) {
    const position = order.indexOf(currentIndex);

    const base = position === -1 ? 0 : position;

    return order[(base + direction + order.length) % order.length];
}

export function getEndedAction(
    order: readonly number[],
    currentIndex: number,
    repeat: MusicRepeatMode,
): EndedAction {
    if (repeat === "one") {
        return { type: "replay" };
    }

    const isLast = order.indexOf(currentIndex) === order.length - 1;

    if (repeat === "off" && isLast) {
        return { type: "stop" };
    }

    return { type: "play", index: getAdjacentIndex(order, currentIndex, 1) };
}

export function getNextRepeatMode(repeat: MusicRepeatMode): MusicRepeatMode {
    if (repeat === "off") return "all";

    if (repeat === "all") return "one";

    return "off";
}
