"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type AudioCallbacks = {
    onEnded: () => void;
    onError: () => void;
};

export function useMusicAudio(callbacks: AudioCallbacks) {
    const audioRef = useRef<HTMLAudioElement | null>(null);

    const callbacksRef = useRef(callbacks);

    const pendingSeekRef = useRef(0);

    const [isPlaying, setIsPlaying] = useState(false);

    const [isBuffering, setIsBuffering] = useState(false);

    const [position, setPosition] = useState(0);

    const [duration, setDuration] = useState(0);

    const [volume, setVolumeState] = useState(1);

    useEffect(() => {
        callbacksRef.current = callbacks;
    });

    useEffect(() => {
        const audio = new Audio();

        audio.preload = "none";

        const listeners: Record<string, () => void> = {
            loadstart: () => setIsBuffering(true),
            waiting: () => setIsBuffering(true),
            stalled: () => setIsBuffering(true),
            canplay: () => setIsBuffering(false),
            playing: () => {
                setIsPlaying(true);
                setIsBuffering(false);
            },
            pause: () => setIsPlaying(false),
            timeupdate: () => setPosition(audio.currentTime),
            durationchange: () => {
                setDuration(
                    Number.isFinite(audio.duration) ? audio.duration : 0,
                );
            },
            loadedmetadata: () => {
                if (pendingSeekRef.current > 0) {
                    audio.currentTime = pendingSeekRef.current;

                    pendingSeekRef.current = 0;
                }
            },
            ended: () => callbacksRef.current.onEnded(),
            error: () => {
                setIsBuffering(false);
                callbacksRef.current.onError();
            },
        };

        for (const [name, listener] of Object.entries(listeners)) {
            audio.addEventListener(name, listener);
        }

        audioRef.current = audio;

        return () => {
            audio.pause();

            for (const [name, listener] of Object.entries(listeners)) {
                audio.removeEventListener(name, listener);
            }

            audio.removeAttribute("src");
            audio.load();

            audioRef.current = null;
        };
    }, []);

    const load = useCallback((src: string, startAt: number) => {
        const audio = audioRef.current;

        if (!audio) {
            return;
        }

        pendingSeekRef.current = startAt;

        setPosition(startAt);

        audio.src = src;
        audio.load();
    }, []);

    const play = useCallback(async () => {
        try {
            await audioRef.current?.play();

            return true;
        } catch (error) {
            if (!(
                error instanceof DOMException && error.name === "AbortError"
            )) {
                console.warn("Unable to play music:", error);
            }

            return false;
        }
    }, []);

    const pause = useCallback(() => {
        audioRef.current?.pause();
    }, []);

    const seek = useCallback((seconds: number) => {
        const audio = audioRef.current;

        if (!audio) {
            return;
        }

        audio.currentTime = seconds;

        setPosition(seconds);
    }, []);

    const setVolume = useCallback((value: number) => {
        const clamped = Math.min(1, Math.max(0, value));

        if (audioRef.current) {
            audioRef.current.volume = clamped;
        }

        setVolumeState(clamped);
    }, []);

    const getPosition = useCallback(
        () => audioRef.current?.currentTime ?? 0,
        [],
    );

    return {
        isPlaying,
        isBuffering,
        position,
        duration,
        volume,
        load,
        play,
        pause,
        seek,
        setVolume,
        getPosition,
    };
}
