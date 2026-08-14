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

import type { MusicPlaylist, MusicTrack } from "@/types/music";

const DEFAULT_VOLUME = 0.65;

type MusicContextValue = {
    isMusicVisible: boolean;
    isMusicPlaying: boolean;
    isMusicClosing: boolean;
    isMusicLoading: boolean;

    playlistName: string | null;
    currentTrack: MusicTrack | null;

    toggleMusic: () => void;
    playMusic: () => void;
    pauseMusic: () => void;
    previousTrack: () => void;
    nextTrack: () => void;

    requestCloseMusic: () => void;
    finishHideMusic: () => void;
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

    const audioRef = useRef<HTMLAudioElement | null>(null);

    const playlistRef = useRef<MusicPlaylist | null>(null);

    const playlistPromiseRef = useRef<Promise<MusicPlaylist> | null>(null);

    const currentIndexRef = useRef(0);

    const isMusicVisibleRef = useRef(false);

    const isMusicPlayingRef = useRef(false);

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

            currentIndexRef.current = normalizedIndex;

            setCurrentIndex(normalizedIndex);

            if (audio.dataset.trackId !== track.id) {
                setIsTrackLoading(true);

                audio.pause();

                audio.dataset.trackId = track.id;

                audio.src = `/api/music/stream?trackId=${encodeURIComponent(
                    track.id,
                )}`;

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
                setIsTrackLoading(false);
            } catch (error) {
                console.warn("Browser prevented music playback:", error);

                isMusicPlayingRef.current = false;

                setIsMusicPlaying(false);
                setIsTrackLoading(false);
            }
        },
        [],
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
                        "The Audius trending list contains no playable tracks.",
                    );
                }

                playlistRef.current = nextPlaylist;

                setPlaylist(nextPlaylist);

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

        void playTrackAtIndex(
            currentIndexRef.current - 1,
            isMusicPlayingRef.current,
        );
    }, [playTrackAtIndex]);

    const nextTrack = useCallback(() => {
        if (!playlistRef.current) {
            return;
        }

        void playTrackAtIndex(
            currentIndexRef.current + 1,
            isMusicPlayingRef.current,
        );
    }, [playTrackAtIndex]);

    const pauseMusic = useCallback(() => {
        audioRef.current?.pause();

        isMusicPlayingRef.current = false;

        setIsMusicPlaying(false);
    }, []);

    const playMusic = useCallback(() => {
        isMusicVisibleRef.current = true;

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

                isMusicPlayingRef.current = false;

                setIsMusicPlaying(false);
                setIsTrackLoading(false);
            });
    }, [loadPlaylist, playTrackAtIndex]);

    const requestCloseMusic = useCallback(() => {
        audioRef.current?.pause();

        isMusicPlayingRef.current = false;

        setIsMusicPlaying(false);
        setIsMusicClosing(true);
    }, []);

    const finishHideMusic = useCallback(() => {
        audioRef.current?.pause();

        isMusicVisibleRef.current = false;

        isMusicPlayingRef.current = false;

        setIsMusicVisible(false);
        setIsMusicPlaying(false);
        setIsMusicClosing(false);
        setIsTrackLoading(false);
    }, []);

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
        audio.volume = DEFAULT_VOLUME;

        function handleLoadStart() {
            setIsTrackLoading(true);
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
        }

        function handleError() {
            isMusicPlayingRef.current = false;

            setIsMusicPlaying(false);
            setIsTrackLoading(false);
        }

        function handleEnded() {
            const currentPlaylist = playlistRef.current;

            if (!currentPlaylist || currentPlaylist.tracks.length === 0) {
                return;
            }

            void playTrackAtIndex(currentIndexRef.current + 1, true);
        }

        audio.addEventListener("loadstart", handleLoadStart);

        audio.addEventListener("canplay", handleCanPlay);

        audio.addEventListener("playing", handlePlaying);

        audio.addEventListener("waiting", handleWaiting);

        audio.addEventListener("stalled", handleStalled);

        audio.addEventListener("pause", handlePause);

        audio.addEventListener("error", handleError);

        audio.addEventListener("ended", handleEnded);

        audioRef.current = audio;

        return () => {
            audio.pause();

            audio.removeEventListener("loadstart", handleLoadStart);

            audio.removeEventListener("canplay", handleCanPlay);

            audio.removeEventListener("playing", handlePlaying);

            audio.removeEventListener("waiting", handleWaiting);

            audio.removeEventListener("stalled", handleStalled);

            audio.removeEventListener("pause", handlePause);

            audio.removeEventListener("error", handleError);

            audio.removeEventListener("ended", handleEnded);

            audio.removeAttribute("src");
            audio.load();

            audioRef.current = null;
        };
    }, [playTrackAtIndex]);

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

            toggleMusic,
            playMusic,
            pauseMusic,
            previousTrack,
            nextTrack,

            requestCloseMusic,
            finishHideMusic,
        }),
        [
            isMusicVisible,
            isMusicPlaying,
            isMusicClosing,
            isMusicLoading,
            playlist,
            currentTrack,
            toggleMusic,
            playMusic,
            pauseMusic,
            previousTrack,
            nextTrack,
            requestCloseMusic,
            finishHideMusic,
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
