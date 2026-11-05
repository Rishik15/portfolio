export function getClientIp(request: Request) {
    const realIp = request.headers.get("x-real-ip")?.trim();

    if (realIp) {
        return realIp;
    }

    const forwarded = request.headers
        .get("x-forwarded-for")
        ?.split(",")[0]
        ?.trim();

    return forwarded || "unknown";
}
