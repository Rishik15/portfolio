import { NextResponse } from "next/server";

import { MUSIC_STREAM_TOKEN_TTL_MS } from "@/config/music";
import { getAudiusBearerToken } from "@/lib/audius";
import { getClientIp } from "@/lib/music/client-ip";
import { isKnownTrackId } from "@/lib/music/library";
import { playQuota } from "@/lib/music/play-quota";
import { signStreamToken } from "@/lib/music/stream-token";
import type { MusicLimitResponse, MusicPlayResponse } from "@/types/music";

const NO_STORE = { "Cache-Control": "no-store" };

async function readTrackId(request: Request) {
    try {
        const body = (await request.json()) as { trackId?: unknown };

        return typeof body.trackId === "string" && body.trackId
            ? body.trackId
            : null;
    } catch {
        return null;
    }
}

export async function POST(request: Request) {
    const trackId = await readTrackId(request);

    if (!trackId) {
        return NextResponse.json(
            { error: "Missing trackId." },
            { status: 400, headers: NO_STORE },
        );
    }

    try {
        if (!(await isKnownTrackId(trackId))) {
            return NextResponse.json(
                { error: "Unknown track." },
                { status: 404, headers: NO_STORE },
            );
        }

        const ip = getClientIp(request);

        const now = Date.now();

        const result = playQuota.consume(ip, now);

        if (!result.ok) {
            return NextResponse.json(
                {
                    error: "limit",
                    resetsAt: result.resetsAt,
                } satisfies MusicLimitResponse,
                { status: 429, headers: NO_STORE },
            );
        }

        const token = signStreamToken(getAudiusBearerToken(), {
            trackId,
            ip,
            expiresAt: now + MUSIC_STREAM_TOKEN_TTL_MS,
        });

        return NextResponse.json({ token } satisfies MusicPlayResponse, {
            headers: NO_STORE,
        });
    } catch (error) {
        console.error("Failed to register music play:", error);

        return NextResponse.json(
            { error: "Unable to start music right now." },
            { status: 503, headers: NO_STORE },
        );
    }
}
