"use client";

import { ChevronLeft, ChevronRight, Search } from "lucide-react";

import { EXPERIENCE_UI } from "@/components/apps/experience/experience-ui";

type ExperienceToolbarProps = {
    year: number;
    canGoPrevious: boolean;
    canGoNext: boolean;
    query: string;
    matchCount: number;
    onPrevious: () => void;
    onNext: () => void;
    onLatest: () => void;
    onQueryChange: (query: string) => void;
};

export function ExperienceToolbar({
    year,
    canGoPrevious,
    canGoNext,
    query,
    matchCount,
    onPrevious,
    onNext,
    onLatest,
    onQueryChange,
}: ExperienceToolbarProps) {
    return (
        <div className={EXPERIENCE_UI.toolbar.root}>
            <div className="flex items-center">
                <button
                    type="button"
                    aria-label="Previous year"
                    disabled={!canGoPrevious}
                    onClick={onPrevious}
                    className={EXPERIENCE_UI.toolbar.iconButton}
                >
                    <ChevronLeft className="size-4" strokeWidth={1.8} />
                </button>

                <button
                    type="button"
                    aria-label="Next year"
                    disabled={!canGoNext}
                    onClick={onNext}
                    className={EXPERIENCE_UI.toolbar.iconButton}
                >
                    <ChevronRight className="size-4" strokeWidth={1.8} />
                </button>
            </div>

            <h2 className={EXPERIENCE_UI.toolbar.title}>{year}</h2>

            <button
                type="button"
                onClick={onLatest}
                className={EXPERIENCE_UI.toolbar.pill}
            >
                Latest
            </button>

            <label className={EXPERIENCE_UI.toolbar.search}>
                <Search
                    className={EXPERIENCE_UI.toolbar.searchIcon}
                    strokeWidth={1.8}
                />

                <input
                    type="search"
                    value={query}
                    placeholder="Search"
                    aria-label="Search experience"
                    onChange={(event) => onQueryChange(event.target.value)}
                    className={EXPERIENCE_UI.toolbar.searchInput}
                />

                {query ? (
                    <span className={EXPERIENCE_UI.toolbar.searchCount}>
                        {matchCount}
                    </span>
                ) : null}
            </label>
        </div>
    );
}
