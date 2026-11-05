import { NextResponse } from "next/server";

import { getMusicLibrary } from "@/lib/music/library";

export async function GET() {
    try {
        return NextResponse.json(await getMusicLibrary(), {
            headers: {
                "Cache-Control":
                    "public, s-maxage=86400, stale-while-revalidate=86400",
            },
        });
    } catch (error) {
        console.error("Failed to load music library:", error);

        return NextResponse.json(
            { error: "Unable to load music right now." },
            { status: 502 },
        );
    }
}
