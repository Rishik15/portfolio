import type { MusicLimitResponse, MusicPlayResponse } from "@/types/music";

export type PlayResult =
    | { status: "ok"; token: string }
    | { status: "limit"; resetsAt: number }
    | { status: "error" };

export async function reportPlay(trackId: string): Promise<PlayResult> {
    try {
        const response = await fetch("/api/music/play", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ trackId }),
        });

        if (response.status === 429) {
            const body = (await response.json()) as MusicLimitResponse;

            return { status: "limit", resetsAt: body.resetsAt };
        }

        if (!response.ok) {
            return { status: "error" };
        }

        const body = (await response.json()) as MusicPlayResponse;

        return { status: "ok", token: body.token };
    } catch {
        return { status: "error" };
    }
}

export function getStreamUrl(trackId: string, token: string) {
    return `/api/music/stream?trackId=${encodeURIComponent(trackId)}&token=${encodeURIComponent(token)}`;
}
