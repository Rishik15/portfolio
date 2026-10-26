/**
 * cat-behavior.ts
 * Pure action tables and the weighted picker that chooses the cat's next action.
 */

export type CatPose = "sit" | "groom" | "watch" | "nap" | "walk";

export type CatTheme = "day" | "night";

export interface CatAction {
    name: string;
    pose: CatPose;
    weight: number;
    speed?: number;
    duration: readonly [number, number];
}

const DAY_ACTIONS: readonly CatAction[] = [
    { name: "sit", pose: "sit", weight: 2, duration: [3000, 6000] },
    { name: "nap", pose: "nap", weight: 2, duration: [8000, 14000] },
    { name: "groom", pose: "groom", weight: 2, duration: [4000, 7000] },
    { name: "walk", pose: "walk", weight: 4, speed: 90, duration: [0, 0] },
];

const NIGHT_ACTIONS: readonly CatAction[] = [
    { name: "sit", pose: "sit", weight: 2, duration: [3000, 6000] },
    { name: "watch", pose: "watch", weight: 3, duration: [6000, 12000] },
    { name: "stroll", pose: "walk", weight: 3, speed: 45, duration: [0, 0] },
];

/**
 * Picks the next action by weight, never repeating the previous one.
 * @param theme Which action table to use.
 * @param previous Name of the action just finished, if any.
 * @param random Random source returning [0, 1); injectable for checks.
 * @returns The chosen action.
 */
export function pickAction(
    theme: CatTheme,
    previous: string | undefined,
    random: () => number = Math.random,
): CatAction {
    const table = theme === "night" ? NIGHT_ACTIONS : DAY_ACTIONS;
    const choices = table.filter((action) => action.name !== previous);
    const total = choices.reduce((sum, action) => sum + action.weight, 0);

    let roll = random() * total;

    for (const action of choices) {
        roll -= action.weight;

        if (roll < 0) {
            return action;
        }
    }

    return choices[choices.length - 1];
}
