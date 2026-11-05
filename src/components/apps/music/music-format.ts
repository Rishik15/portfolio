export function formatDuration(totalSeconds: number) {
    const seconds = Math.max(0, Math.floor(totalSeconds));

    const hours = Math.floor(seconds / 3600);

    const minutes = Math.floor((seconds % 3600) / 60);

    const rest = String(seconds % 60).padStart(2, "0");

    if (hours > 0) {
        return `${hours}:${String(minutes).padStart(2, "0")}:${rest}`;
    }

    return `${minutes}:${rest}`;
}

export function formatTotalDuration(totalSeconds: number) {
    const minutes = Math.round(totalSeconds / 60);

    if (minutes < 60) {
        return `${minutes} min`;
    }

    return `${Math.floor(minutes / 60)} hr ${minutes % 60} min`;
}
