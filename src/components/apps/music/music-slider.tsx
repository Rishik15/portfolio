"use client";

import { useState } from "react";

import { MUSIC_UI } from "./music-ui";

type MusicSliderProps = {
    label: string;
    value: number;
    max: number;
    step?: number;
    disabled?: boolean;
    valueText?: string;
    commitOnRelease?: boolean;
    onValueChange: (value: number) => void;
};

export function MusicSlider({
    label,
    value,
    max,
    step = 1,
    disabled = false,
    valueText,
    commitOnRelease = false,
    onValueChange,
}: MusicSliderProps) {
    const [draft, setDraft] = useState<number | null>(null);

    const shown = draft ?? value;

    const percent = max > 0 ? Math.min(100, (shown / max) * 100) : 0;

    function commit() {
        if (draft === null) {
            return;
        }

        onValueChange(draft);
        setDraft(null);
    }

    return (
        <input
            type="range"
            aria-label={label}
            aria-valuetext={valueText}
            min={0}
            max={max}
            step={step}
            value={shown}
            disabled={disabled}
            className={MUSIC_UI.slider}
            style={{
                background: `linear-gradient(to right, var(--foreground) ${percent}%, color-mix(in oklab, var(--foreground) 15%, transparent) ${percent}%)`,
            }}
            onChange={(event) => {
                const next = Number(event.target.value);

                if (commitOnRelease) {
                    setDraft(next);

                    return;
                }

                onValueChange(next);
            }}
            onPointerUp={commit}
            onKeyUp={commit}
            onBlur={commit}
        />
    );
}
