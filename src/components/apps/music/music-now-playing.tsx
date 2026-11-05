"use client";

import {
    LoaderCircle,
    Pause,
    Play,
    Repeat,
    Repeat1,
    Shuffle,
    SkipBack,
    SkipForward,
    Volume2,
    VolumeX,
} from "lucide-react";
import { useRef } from "react";

import {
    useMusic,
    useMusicProgress,
} from "@/components/providers/music-provider";

import { formatDuration } from "./music-format";
import { MusicCover } from "@/components/ui/music-cover";
import { MusicSlider } from "./music-slider";
import { MUSIC_UI } from "./music-ui";

const REPEAT_LABELS = {
    off: "Repeat: off",
    all: "Repeat: all",
    one: "Repeat: one",
} as const;

export function MusicNowPlaying() {
    const {
        currentTrack,
        isPlaying,
        isLoading,
        volume,
        shuffle,
        repeat,
        togglePlayback,
        nextTrack,
        previousTrack,
        seek,
        setVolume,
        toggleShuffle,
        cycleRepeat,
    } = useMusic();

    const { position, duration } = useMusicProgress();

    const mutedVolumeRef = useRef(1);

    const hasTrack = currentTrack !== null;

    const RepeatIcon = repeat === "one" ? Repeat1 : Repeat;

    function toggleMute() {
        if (volume > 0) {
            mutedVolumeRef.current = volume;
            setVolume(0);

            return;
        }

        setVolume(mutedVolumeRef.current);
    }

    return (
        <section aria-label="Now playing" className={MUSIC_UI.nowPlaying.root}>
            <p aria-live="polite" className="sr-only">
                {currentTrack
                    ? `Now playing: ${currentTrack.title} by ${currentTrack.artist}`
                    : ""}
            </p>

            <div className={MUSIC_UI.nowPlaying.info}>
                <MusicCover
                    src={currentTrack?.coverUrl ?? null}
                    className={MUSIC_UI.nowPlaying.cover}
                    iconClassName="size-5 text-muted-foreground"
                />

                <div className="min-w-0">
                    <p className={MUSIC_UI.sidebar.title}>
                        {currentTrack?.title ?? "Nothing playing"}
                    </p>

                    <p className={MUSIC_UI.sidebar.artist}>
                        {currentTrack?.artist ?? "Pick a track"}
                    </p>
                </div>
            </div>

            <div className={MUSIC_UI.nowPlaying.center}>
                <div className={MUSIC_UI.nowPlaying.transport}>
                    <button
                        type="button"
                        aria-label="Shuffle"
                        aria-pressed={shuffle}
                        onClick={toggleShuffle}
                        className={`${MUSIC_UI.iconButton} ${shuffle ? MUSIC_UI.iconButtonOn : ""}`}
                    >
                        <Shuffle className="size-4" />
                    </button>

                    <button
                        type="button"
                        aria-label="Previous track"
                        disabled={!hasTrack}
                        onClick={previousTrack}
                        className={MUSIC_UI.iconButton}
                    >
                        <SkipBack className="size-4" fill="currentColor" />
                    </button>

                    <button
                        type="button"
                        aria-label={
                            isLoading ? "Loading" : isPlaying ? "Pause" : "Play"
                        }
                        disabled={!hasTrack}
                        onClick={togglePlayback}
                        className={MUSIC_UI.nowPlaying.mainButton}
                    >
                        {isLoading ? (
                            <LoaderCircle className="size-3.5 animate-spin" />
                        ) : isPlaying ? (
                            <Pause className="size-3.5" fill="currentColor" />
                        ) : (
                            <Play className="size-3.5" fill="currentColor" />
                        )}
                    </button>

                    <button
                        type="button"
                        aria-label="Next track"
                        disabled={!hasTrack}
                        onClick={nextTrack}
                        className={MUSIC_UI.iconButton}
                    >
                        <SkipForward className="size-4" fill="currentColor" />
                    </button>

                    <button
                        type="button"
                        aria-label={REPEAT_LABELS[repeat]}
                        onClick={cycleRepeat}
                        className={`${MUSIC_UI.iconButton} ${repeat !== "off" ? MUSIC_UI.iconButtonOn : ""}`}
                    >
                        <RepeatIcon className="size-4" />
                    </button>
                </div>

                <div className={MUSIC_UI.nowPlaying.seekRow}>
                    <span className={`${MUSIC_UI.nowPlaying.time} text-right`}>
                        {formatDuration(position)}
                    </span>

                    <MusicSlider
                        label="Seek"
                        value={position}
                        max={Math.max(duration, 1)}
                        step={1}
                        disabled={!hasTrack}
                        commitOnRelease
                        valueText={`${formatDuration(position)} of ${formatDuration(duration)}`}
                        onValueChange={seek}
                    />

                    <span className={MUSIC_UI.nowPlaying.time}>
                        {formatDuration(duration)}
                    </span>
                </div>
            </div>

            <div className={MUSIC_UI.nowPlaying.volume}>
                <button
                    type="button"
                    aria-label={volume > 0 ? "Mute" : "Unmute"}
                    onClick={toggleMute}
                    className={MUSIC_UI.iconButton}
                >
                    {volume > 0 ? (
                        <Volume2 className="size-4" />
                    ) : (
                        <VolumeX className="size-4" />
                    )}
                </button>

                <div className="w-24">
                    <MusicSlider
                        label="Volume"
                        value={volume}
                        max={1}
                        step={0.05}
                        valueText={`Volume ${Math.round(volume * 100)}%`}
                        onValueChange={setVolume}
                    />
                </div>
            </div>
        </section>
    );
}
