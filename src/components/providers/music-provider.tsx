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

import { useMusicLibrary, type LibraryStatus } from "@/components/providers/music/use-music-library";
import { useMusicPill, type PillMode } from "@/components/providers/music/use-music-pill";
import { useMusicPlayer } from "@/components/providers/music/use-music-player";
import { useWindowManager } from "@/components/windows/window-manager";
import { WINDOW_IDS } from "@/config/windows";
import type {
    MusicPlaylist,
    MusicRepeatMode,
    MusicTrack,
} from "@/types/music";

const LIMIT_NOTICE_MS = 5000;

type MusicContextValue = {
    libraryStatus: LibraryStatus;
    playlists: readonly MusicPlaylist[];
    loadLibrary: () => void;

    playingPlaylistId: string | null;
    currentIndex: number | null;
    currentTrack: MusicTrack | null;

    isPlaying: boolean;
    isLoading: boolean;
    hasPlaybackError: boolean;
    volume: number;
    shuffle: boolean;
    repeat: MusicRepeatMode;
    limitedUntil: number | null;
    pillMode: PillMode;

    playTrack: (playlistId: string, index: number) => void;
    togglePlayback: () => void;
    nextTrack: () => void;
    previousTrack: () => void;
    seek: (seconds: number) => void;
    setVolume: (value: number) => void;
    toggleShuffle: () => void;
    cycleRepeat: () => void;
    openMusicWindow: () => void;
};

type MusicProgressValue = {
    position: number;
    duration: number;
};

type MusicProviderProps = {
    children: ReactNode;
};

const MusicContext = createContext<MusicContextValue | null>(null);

const MusicProgressContext = createContext<MusicProgressValue | null>(null);

export function MusicProvider({ children }: MusicProviderProps) {
    const { windows, activateWindow, closeWindow } = useWindowManager();

    const library = useMusicLibrary();

    const [limitedUntil, setLimitedUntil] = useState<number | null>(null);

    const [isLimitNotice, setIsLimitNotice] = useState(false);

    const noticeTimeoutRef = useRef<number | null>(null);

    const handleLimit = useCallback(
        (resetsAt: number) => {
            setLimitedUntil(resetsAt);
            setIsLimitNotice(true);
            closeWindow(WINDOW_IDS.music);

            if (noticeTimeoutRef.current !== null) {
                window.clearTimeout(noticeTimeoutRef.current);
            }

            noticeTimeoutRef.current = window.setTimeout(
                () => setIsLimitNotice(false),
                LIMIT_NOTICE_MS,
            );
        },
        [closeWindow],
    );

    useEffect(
        () => () => {
            if (noticeTimeoutRef.current !== null) {
                window.clearTimeout(noticeTimeoutRef.current);
            }
        },
        [],
    );

    const player = useMusicPlayer({
        playlists: library.playlists,
        onLimit: handleLimit,
    });

    const isWindowOpen =
        windows.get(WINDOW_IDS.music)?.state.status === "open";

    const pillMode = useMusicPill({
        isWindowOpen,
        isPlaying: player.isPlaying,
        isLimitNotice,
    });

    const openMusicWindow = useCallback(() => {
        activateWindow(WINDOW_IDS.music);
    }, [activateWindow]);

    const {
        position,
        duration,
        isPlaying,
        isLoading,
        hasPlaybackError,
        volume,
        shuffle,
        repeat,
        playingPlaylistId,
        currentIndex,
        currentTrack,
        playTrack,
        togglePlayback,
        nextTrack,
        previousTrack,
        seek,
        setVolume,
        toggleShuffle,
        cycleRepeat,
    } = player;

    const value = useMemo<MusicContextValue>(
        () => ({
            libraryStatus: library.status,
            playlists: library.playlists,
            loadLibrary: library.load,
            playingPlaylistId,
            currentIndex,
            currentTrack,
            isPlaying,
            isLoading,
            hasPlaybackError,
            volume,
            shuffle,
            repeat,
            limitedUntil,
            pillMode,
            playTrack,
            togglePlayback,
            nextTrack,
            previousTrack,
            seek,
            setVolume,
            toggleShuffle,
            cycleRepeat,
            openMusicWindow,
        }),
        [
            library.status,
            library.playlists,
            library.load,
            playingPlaylistId,
            currentIndex,
            currentTrack,
            isPlaying,
            isLoading,
            hasPlaybackError,
            volume,
            shuffle,
            repeat,
            limitedUntil,
            pillMode,
            playTrack,
            togglePlayback,
            nextTrack,
            previousTrack,
            seek,
            setVolume,
            toggleShuffle,
            cycleRepeat,
            openMusicWindow,
        ],
    );

    const progress = useMemo(() => ({ position, duration }), [position, duration]);

    return (
        <MusicContext.Provider value={value}>
            <MusicProgressContext.Provider value={progress}>
                {children}
            </MusicProgressContext.Provider>
        </MusicContext.Provider>
    );
}

export function useMusic() {
    const context = useContext(MusicContext);

    if (!context) {
        throw new Error("useMusic must be used inside MusicProvider.");
    }

    return context;
}

export function useMusicProgress() {
    const context = useContext(MusicProgressContext);

    if (!context) {
        throw new Error("useMusicProgress must be used inside MusicProvider.");
    }

    return context;
}
