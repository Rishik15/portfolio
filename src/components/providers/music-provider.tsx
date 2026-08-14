"use client";

import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useRef,
    useState,
    type ReactNode,
} from "react";

import {
    consumeTrackStart,
    getStoredPlaybackState,
    storePlaybackState,
} from "@/components/providers/music-storage";
import type { MusicPlaylist, MusicTrack } from "@/types/music";

const MUSIC_LIMIT_MESSAGE =
    "Music limit reached for this browser. Please try again later.";

const MUSIC_UNAVAILABLE_MESSAGE =
    "Music is temporarily unavailable. Please try again later.";

type PendingSeek = {
    trackId: string;
    position: number;
};

type MusicContextValue = {
    isMusicVisible: boolean;
    isMusicPlaying: boolean;
    isMusicClosing: boolean;
    isMusicLoading: boolean;

    playlistName: string | null;
    currentTrack: MusicTrack | null;
    musicError: string | null;

    toggleMusic: () => void;
    playMusic: () => void;
    pauseMusic: () => void;
    previousTrack: () => void;
    nextTrack: () => void;

    requestCloseMusic: () => void;
    finishHideMusic: () => void;
    clearMusicError: () => void;
};

type MusicProviderProps = {
    children: ReactNode;
};

const MusicContext = createContext<MusicContextValue | null>(null);

export function MusicProvider({ children }: MusicProviderProps) {
    const [playlist, setPlaylist] = useState<MusicPlaylist | null>(null);

    const [currentIndex, setCurrentIndex] = useState(0);

    const [isMusicVisible, setIsMusicVisible] = useState(false);

    const [isMusicPlaying, setIsMusicPlaying] = useState(false);

    const [isMusicClosing, setIsMusicClosing] = useState(false);

    const [isPlaylistLoading, setIsPlaylistLoading] = useState(false);

    const [isTrackLoading, setIsTrackLoading] = useState(false);

    const [musicError, setMusicError] = useState<string | null>(null);

    const audioRef = useRef<HTMLAudioElement | null>(null);

    const playlistRef = useRef<MusicPlaylist | null>(null);

    const playlistPromiseRef = useRef<Promise<MusicPlaylist> | null>(null);

    const pendingSeekRef = useRef<PendingSeek | null>(null);

    const currentIndexRef = useRef(0);

    const isMusicVisibleRef = useRef(false);

    const isMusicPlayingRef = useRef(false);

    const clearMusicError = useCallback(() => {
        setMusicError(null);
    }, []);

    const saveCurrentPlayback = useCallback(() => {
        const audio = audioRef.current;

        const trackId = audio?.dataset.trackId;

        if (!audio || !trackId) {
            return;
        }

        storePlaybackState(trackId, audio.currentTime);
    }, []);

    const failMusic = useCallback((message: string) => {
        const audio = audioRef.current;

        audio?.pause();

        isMusicPlayingRef.current = false;

        setIsMusicPlaying(false);
        setIsTrackLoading(false);
        setMusicError(message);

        if (isMusicVisibleRef.current) {
            setIsMusicClosing(true);
        }
    }, []);

    const playTrackAtIndex = useCallback(
        async (index: number, shouldPlay: boolean) => {
            const audio = audioRef.current;

            const currentPlaylist = playlistRef.current;

            if (
                !audio ||
                !currentPlaylist ||
                currentPlaylist.tracks.length === 0
            ) {
                return;
            }

            const trackCount = currentPlaylist.tracks.length;

            const normalizedIndex =
                ((index % trackCount) + trackCount) % trackCount;

            const track = currentPlaylist.tracks[normalizedIndex];

            const isNewTrack = audio.dataset.trackId !== track.id;

            if (isNewTrack && !consumeTrackStart()) {
                failMusic(MUSIC_LIMIT_MESSAGE);

                return;
            }

            currentIndexRef.current = normalizedIndex;

            setCurrentIndex(normalizedIndex);

            if (isNewTrack) {
                const previousTrackId = audio.dataset.trackId;

                if (previousTrackId) {
                    storePlaybackState(previousTrackId, audio.currentTime);
                }

                setIsTrackLoading(true);

                audio.pause();

                const pendingSeek =
                    pendingSeekRef.current?.trackId === track.id
                        ? pendingSeekRef.current
                        : null;

                audio.dataset.trackId = track.id;

                audio.src = `/api/music/stream?trackId=${encodeURIComponent(
                    track.id,
                )}`;

                if (!pendingSeek) {
                    storePlaybackState(track.id, 0);
                }

                audio.load();
            }

            if (!shouldPlay) {
                isMusicPlayingRef.current = false;

                setIsMusicPlaying(false);

                return;
            }

            try {
                await audio.play();

                isMusicPlayingRef.current = true;

                setIsMusicPlaying(true);
            } catch (error) {
                console.warn("Unable to play music:", error);

                failMusic(MUSIC_UNAVAILABLE_MESSAGE);
            }
        },
        [failMusic],
    );

    const loadPlaylist = useCallback(async () => {
        if (playlistRef.current) {
            return playlistRef.current;
        }

        if (playlistPromiseRef.current) {
            return playlistPromiseRef.current;
        }

        setIsPlaylistLoading(true);

        const request = fetch("/api/music/playlist")
            .then(async (response) => {
                if (!response.ok) {
                    throw new Error(
                        `Music playlist request failed with ${response.status}.`,
                    );
                }

                return (await response.json()) as MusicPlaylist;
            })
            .then((nextPlaylist) => {
                if (nextPlaylist.tracks.length === 0) {
                    throw new Error(
                        "The Audius playlist contains no playable tracks.",
                    );
                }

                playlistRef.current = nextPlaylist;

                setPlaylist(nextPlaylist);

                const storedPlayback = getStoredPlaybackState();

                if (storedPlayback) {
                    const storedTrackIndex = nextPlaylist.tracks.findIndex(
                        (track) => track.id === storedPlayback.trackId,
                    );

                    if (storedTrackIndex >= 0) {
                        currentIndexRef.current = storedTrackIndex;

                        setCurrentIndex(storedTrackIndex);

                        pendingSeekRef.current = {
                            trackId: storedPlayback.trackId,
                            position: storedPlayback.position,
                        };
                    }
                }

                return nextPlaylist;
            })
            .finally(() => {
                playlistPromiseRef.current = null;

                setIsPlaylistLoading(false);
            });

        playlistPromiseRef.current = request;

        return request;
    }, []);

    const previousTrack = useCallback(() => {
        if (!playlistRef.current) {
            return;
        }

        saveCurrentPlayback();

        pendingSeekRef.current = null;

        void playTrackAtIndex(
            currentIndexRef.current - 1,
            isMusicPlayingRef.current,
        );
    }, [playTrackAtIndex, saveCurrentPlayback]);

    const nextTrack = useCallback(() => {
        if (!playlistRef.current) {
            return;
        }

        saveCurrentPlayback();

        pendingSeekRef.current = null;

        void playTrackAtIndex(
            currentIndexRef.current + 1,
            isMusicPlayingRef.current,
        );
    }, [playTrackAtIndex, saveCurrentPlayback]);

    const pauseMusic = useCallback(() => {
        audioRef.current?.pause();

        saveCurrentPlayback();

        isMusicPlayingRef.current = false;

        setIsMusicPlaying(false);
    }, [saveCurrentPlayback]);

    const playMusic = useCallback(() => {
        isMusicVisibleRef.current = true;

        setMusicError(null);
        setIsMusicVisible(true);
        setIsMusicClosing(false);

        if (playlistRef.current) {
            void playTrackAtIndex(currentIndexRef.current, true);

            return;
        }

        void loadPlaylist()
            .then(() => {
                if (!isMusicVisibleRef.current) {
                    return;
                }

                return playTrackAtIndex(currentIndexRef.current, true);
            })
            .catch((error) => {
                console.error("Unable to start Audius playback:", error);

                failMusic(MUSIC_UNAVAILABLE_MESSAGE);
            });
    }, [failMusic, loadPlaylist, playTrackAtIndex]);

    const requestCloseMusic = useCallback(() => {
        audioRef.current?.pause();

        saveCurrentPlayback();

        isMusicPlayingRef.current = false;

        setIsMusicPlaying(false);
        setIsMusicClosing(true);
    }, [saveCurrentPlayback]);

    const finishHideMusic = useCallback(() => {
        audioRef.current?.pause();

        saveCurrentPlayback();

        isMusicVisibleRef.current = false;

        isMusicPlayingRef.current = false;

        setIsMusicVisible(false);
        setIsMusicPlaying(false);
        setIsMusicClosing(false);
        setIsTrackLoading(false);
    }, [saveCurrentPlayback]);

    const toggleMusic = useCallback(() => {
        if (isMusicVisibleRef.current) {
            requestCloseMusic();

            return;
        }

        playMusic();
    }, [playMusic, requestCloseMusic]);

    useEffect(() => {
        const audio = new Audio();

        audio.preload = "none";

        function handleLoadStart() {
            setIsTrackLoading(true);
        }

        function handleLoadedMetadata() {
            const pendingSeek = pendingSeekRef.current;

            const trackId = audio.dataset.trackId;

            if (!pendingSeek || pendingSeek.trackId !== trackId) {
                return;
            }

            const maxPosition =
                Number.isFinite(audio.duration) && audio.duration > 0
                    ? Math.max(0, audio.duration - 0.25)
                    : pendingSeek.position;

            audio.currentTime = Math.min(pendingSeek.position, maxPosition);

            pendingSeekRef.current = null;
        }

        function handleCanPlay() {
            setIsTrackLoading(false);
        }

        function handlePlaying() {
            isMusicPlayingRef.current = true;

            setIsMusicPlaying(true);
            setIsTrackLoading(false);
        }

        function handleWaiting() {
            setIsTrackLoading(true);
        }

        function handleStalled() {
            setIsTrackLoading(true);
        }

        function handlePause() {
            isMusicPlayingRef.current = false;

            setIsMusicPlaying(false);

            const trackId = audio.dataset.trackId;

            if (trackId) {
                storePlaybackState(trackId, audio.currentTime);
            }
        }

        function handleError() {
            failMusic(MUSIC_UNAVAILABLE_MESSAGE);
        }

        function handleEnded() {
            const currentPlaylist = playlistRef.current;

            if (!currentPlaylist || currentPlaylist.tracks.length === 0) {
                return;
            }

            pendingSeekRef.current = null;

            void playTrackAtIndex(currentIndexRef.current + 1, true);
        }

        function handlePageHide() {
            const trackId = audio.dataset.trackId;

            if (trackId) {
                storePlaybackState(trackId, audio.currentTime);
            }
        }

        audio.addEventListener("loadstart", handleLoadStart);

        audio.addEventListener("loadedmetadata", handleLoadedMetadata);

        audio.addEventListener("canplay", handleCanPlay);

        audio.addEventListener("playing", handlePlaying);

        audio.addEventListener("waiting", handleWaiting);

        audio.addEventListener("stalled", handleStalled);

        audio.addEventListener("pause", handlePause);

        audio.addEventListener("error", handleError);

        audio.addEventListener("ended", handleEnded);

        window.addEventListener("pagehide", handlePageHide);

        audioRef.current = audio;

        return () => {
            const trackId = audio.dataset.trackId;

            if (trackId) {
                storePlaybackState(trackId, audio.currentTime);
            }

            audio.pause();

            audio.removeEventListener("loadstart", handleLoadStart);

            audio.removeEventListener("loadedmetadata", handleLoadedMetadata);

            audio.removeEventListener("canplay", handleCanPlay);

            audio.removeEventListener("playing", handlePlaying);

            audio.removeEventListener("waiting", handleWaiting);

            audio.removeEventListener("stalled", handleStalled);

            audio.removeEventListener("pause", handlePause);

            audio.removeEventListener("error", handleError);

            audio.removeEventListener("ended", handleEnded);

            window.removeEventListener("pagehide", handlePageHide);

            audio.removeAttribute("src");
            audio.load();

            audioRef.current = null;
        };
    }, [failMusic, playTrackAtIndex]);

    const currentTrack = playlist?.tracks[currentIndex] ?? null;

    const isMusicLoading = isPlaylistLoading || isTrackLoading;

    const value = useMemo<MusicContextValue>(
        () => ({
            isMusicVisible,
            isMusicPlaying,
            isMusicClosing,
            isMusicLoading,

            playlistName: playlist?.name ?? null,

            currentTrack,
            musicError,

            toggleMusic,
            playMusic,
            pauseMusic,
            previousTrack,
            nextTrack,

            requestCloseMusic,
            finishHideMusic,
            clearMusicError,
        }),
        [
            isMusicVisible,
            isMusicPlaying,
            isMusicClosing,
            isMusicLoading,
            playlist,
            currentTrack,
            musicError,
            toggleMusic,
            playMusic,
            pauseMusic,
            previousTrack,
            nextTrack,
            requestCloseMusic,
            finishHideMusic,
            clearMusicError,
        ],
    );

    return (
        <MusicContext.Provider value={value}>{children}</MusicContext.Provider>
    );
}

export function useMusic() {
    const context = useContext(MusicContext);

    if (!context) {
        throw new Error("useMusic must be used inside MusicProvider.");
    }

    return context;
}
