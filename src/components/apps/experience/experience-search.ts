import type { Experience } from "@/config/experience";

export function matchesQuery(experience: Experience, query: string) {
    const needle = query.trim().toLowerCase();

    if (!needle) {
        return true;
    }

    return [experience.role, experience.company, ...experience.technologies]
        .join("\n")
        .toLowerCase()
        .includes(needle);
}
