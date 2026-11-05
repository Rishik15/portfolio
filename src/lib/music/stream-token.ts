import { createHmac, timingSafeEqual } from "node:crypto";

type TokenPayload = {
    trackId: string;
    ip: string;
    expiresAt: number;
};

type TokenExpectation = {
    trackId: string;
    ip: string;
    now: number;
};

function sign(secret: string, payload: string) {
    return createHmac("sha256", secret).update(payload).digest("base64url");
}

function parsePayload(encoded: string): TokenPayload | null {
    try {
        const [trackId, ip, expiresAt] = JSON.parse(
            Buffer.from(encoded, "base64url").toString("utf8"),
        ) as unknown[];

        if (
            typeof trackId !== "string" ||
            typeof ip !== "string" ||
            typeof expiresAt !== "number"
        ) {
            return null;
        }

        return { trackId, ip, expiresAt };
    } catch {
        return null;
    }
}

export function signStreamToken(secret: string, payload: TokenPayload) {
    const encoded = Buffer.from(
        JSON.stringify([payload.trackId, payload.ip, payload.expiresAt]),
    ).toString("base64url");

    return `${encoded}.${sign(secret, encoded)}`;
}

export function verifyStreamToken(
    secret: string,
    token: string,
    expected: TokenExpectation,
) {
    const [encoded, signature, ...rest] = token.split(".");

    if (!encoded || !signature || rest.length > 0) {
        return false;
    }

    const actual = Buffer.from(signature);
    const wanted = Buffer.from(sign(secret, encoded));

    if (actual.length !== wanted.length || !timingSafeEqual(actual, wanted)) {
        return false;
    }

    const payload = parsePayload(encoded);

    return (
        payload !== null &&
        payload.trackId === expected.trackId &&
        payload.ip === expected.ip &&
        payload.expiresAt > expected.now
    );
}
