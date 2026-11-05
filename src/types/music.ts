export type MusicTrack = {
    id: string;
    title: string;
    artist: string;
    duration: number;
    coverUrl: string | null;
};

export type MusicPlaylist = {
    id: string;
    name: string;
    artist: string;
    coverUrl: string | null;
    tracks: readonly MusicTrack[];
};

export type MusicLibrary = {
    playlists: readonly MusicPlaylist[];
};

export type MusicRepeatMode = "off" | "all" | "one";

export type MusicPlayResponse = {
    token: string;
};

export type MusicLimitResponse = {
    error: "limit";
    resetsAt: number;
};
