"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { MUSIC_STREAM_TOKEN_TTL_MS } from "@/config/music";
import type { MusicPlaylist, MusicRepeatMode } from "@/types/music";

import {
    createOrder,
    getAdjacentIndex,
    getEndedAction,
    getNextRepeatMode,
} from "./music-queue";
import { getStreamUrl, reportPlay } from "./music-play-api";
import { useMusicAudio } from "./use-music-audio";

const TOKEN_REFRESH_MARGIN_MS = 60000;

const RESTART_THRESHOLD_SECONDS = 3;

type PlayerInput = {
    playlists: readonly MusicPlaylist[];
    onLimit: (resetsAt: number) => void;
};

type Selection = {
    playlistId: string;
    index: number;
    order: readonly number[];
};

type LoadedStream = {
    trackId: string;
    expiresAt: number;
};

export function useMusicPlayer({ playlists, onLimit }: PlayerInput) {
    const [chosen, setSelection] = useState<Selection | null>(null);

    const [shuffle, setShuffle] = useState(false);

    const fallbackSelection = useMemo<Selection | null>(() => {
        const first = playlists.find((item) => item.tracks.length > 0);

        return first
            ? {
                  playlistId: first.id,
                  index: 0,
                  order: createOrder(first.tracks.length, shuffle, 0),
              }
            : null;
    }, [playlists, shuffle]);

    const selection = chosen ?? fallbackSelection;

    const [repeat, setRepeat] = useState<MusicRepeatMode>("off");

    const [isStarting, setIsStarting] = useState(false);

    const [hasPlaybackError, setHasPlaybackError] = useState(false);

    const generationRef = useRef(0);

    const loadedRef = useRef<LoadedStream | null>(null);

    const handlersRef = useRef({ onEnded: () => {}, onError: () => {} });

    const audio = useMusicAudio({
        onEnded: () => handlersRef.current.onEnded(),
        onError: () => handlersRef.current.onError(),
    });

    const {
        load: loadAudio,
        play: playAudio,
        pause: pauseAudio,
        seek: seekAudio,
        setVolume,
        getPosition,
    } = audio;

    const playlist = playlists.find(
        (item) => item.id === selection?.playlistId,
    );

    const currentTrack = playlist?.tracks[selection?.index ?? -1] ?? null;

    const startTrack = useCallback(
        async (target: Selection, startAt = 0, autoplay = true) => {
            const track = playlists.find(
                (item) => item.id === target.playlistId,
            )?.tracks[target.index];

            if (!track) {
                return;
            }

            const generation = ++generationRef.current;

            pauseAudio();

            loadedRef.current = null;

            setSelection(target);
            setIsStarting(true);
            setHasPlaybackError(false);

            const result = await reportPlay(track.id);

            if (generation !== generationRef.current) {
                return;
            }

            if (result.status === "limit") {
                setIsStarting(false);
                onLimit(result.resetsAt);

                return;
            }

            if (result.status === "error") {
                setIsStarting(false);
                setHasPlaybackError(true);

                return;
            }

            loadedRef.current = {
                trackId: track.id,
                expiresAt: Date.now() + MUSIC_STREAM_TOKEN_TTL_MS,
            };

            loadAudio(getStreamUrl(track.id, result.token), startAt);

            if (!autoplay) {
                setIsStarting(false);

                return;
            }

            const played = await playAudio();

            if (generation !== generationRef.current) {
                return;
            }

            setIsStarting(false);
            setHasPlaybackError(!played);
        },
        [pauseAudio, loadAudio, playAudio, onLimit, playlists],
    );

    const hasFreshStream = useCallback(() => {
        const loaded = loadedRef.current;

        return (
            loaded !== null &&
            loaded.trackId === currentTrack?.id &&
            loaded.expiresAt - Date.now() > TOKEN_REFRESH_MARGIN_MS
        );
    }, [currentTrack]);

    const playTrack = useCallback(
        (playlistId: string, index: number) => {
            const length =
                playlists.find((item) => item.id === playlistId)?.tracks
                    .length ?? 0;

            if (
                selection?.playlistId === playlistId &&
                selection.index === index
            ) {
                if (audio.isPlaying || isStarting) {
                    return;
                }

                if (hasFreshStream() && !hasPlaybackError) {
                    void playAudio();

                    return;
                }
            }

            const order =
                chosen?.playlistId === playlistId
                    ? chosen.order
                    : createOrder(length, shuffle, index);

            const isLoadedTrack =
                selection?.playlistId === playlistId &&
                selection.index === index &&
                loadedRef.current?.trackId === currentTrack?.id;

            void startTrack(
                { playlistId, index, order },
                isLoadedTrack ? getPosition() : 0,
            );
        },
        [
            audio.isPlaying,
            currentTrack,
            getPosition,
            playAudio,
            hasFreshStream,
            hasPlaybackError,
            isStarting,
            playlists,
            selection,
            chosen,
            shuffle,
            startTrack,
        ],
    );

    const pause = useCallback(() => {
        generationRef.current++;

        setIsStarting(false);
        pauseAudio();
    }, [pauseAudio]);

    const togglePlayback = useCallback(() => {
        if (!selection) {
            return;
        }

        if (audio.isPlaying || isStarting) {
            pause();

            return;
        }

        playTrack(selection.playlistId, selection.index);
    }, [audio.isPlaying, isStarting, pause, playTrack, selection]);

    const seek = useCallback(
        (seconds: number) => {
            if (!selection) {
                return;
            }

            if (hasFreshStream()) {
                seekAudio(seconds);

                return;
            }

            void startTrack(selection, seconds, audio.isPlaying);
        },
        [audio.isPlaying, seekAudio, hasFreshStream, selection, startTrack],
    );

    const step = useCallback(
        (direction: 1 | -1) => {
            if (!selection) {
                return;
            }

            if (direction === -1 && getPosition() > RESTART_THRESHOLD_SECONDS) {
                seek(0);

                return;
            }

            void startTrack({
                ...selection,
                index: getAdjacentIndex(
                    selection.order,
                    selection.index,
                    direction,
                ),
            });
        },
        [getPosition, seek, selection, startTrack],
    );

    const toggleShuffle = useCallback(() => {
        const next = !shuffle;

        setShuffle(next);

        setSelection((current) => {
            if (!current) {
                return current;
            }

            const length =
                playlists.find((item) => item.id === current.playlistId)?.tracks
                    .length ?? 0;

            return {
                ...current,
                order: createOrder(length, next, current.index),
            };
        });
    }, [playlists, shuffle]);

    const cycleRepeat = useCallback(() => {
        setRepeat(getNextRepeatMode);
    }, []);

    useEffect(() => {
        handlersRef.current = {
            onEnded: () => {
                if (!selection) {
                    return;
                }

                const action = getEndedAction(
                    selection.order,
                    selection.index,
                    repeat,
                );

                if (action.type === "replay") {
                    void startTrack(selection);
                } else if (action.type === "play") {
                    void startTrack({ ...selection, index: action.index });
                } else {
                    seekAudio(0);
                }
            },
            onError: () => {
                const loaded = loadedRef.current;

                if (!loaded) {
                    return;
                }

                if (
                    selection &&
                    loaded.expiresAt - Date.now() <= TOKEN_REFRESH_MARGIN_MS
                ) {
                    void startTrack(selection, getPosition());

                    return;
                }

                setIsStarting(false);
                setHasPlaybackError(true);
            },
        };
    });

    return {
        playingPlaylistId: selection?.playlistId ?? null,
        currentIndex: selection?.index ?? null,
        currentTrack,
        isPlaying: audio.isPlaying,
        isLoading: isStarting || audio.isBuffering,
        hasPlaybackError,
        position: audio.position,
        duration: audio.duration || currentTrack?.duration || 0,
        volume: audio.volume,
        shuffle,
        repeat,
        playTrack,
        togglePlayback,
        nextTrack: () => step(1),
        previousTrack: () => step(-1),
        seek,
        setVolume,
        toggleShuffle,
        cycleRepeat,
        stopForLimit: pause,
    };
}
