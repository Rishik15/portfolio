export type MusicTrack = {
    id: string;
    title: string;
    artist: string;
};

export type MusicPlaylist = {
    name: string;
    tracks: readonly MusicTrack[];
};
