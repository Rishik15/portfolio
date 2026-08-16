"use client";

import {
    ChevronRight,
    Folder,
    FolderOpen,
} from "lucide-react";
import {
    useMemo,
    useRef,
    useState,
    type PointerEvent as ReactPointerEvent,
} from "react";

import type { Experience } from "@/config/experience";

type ExperienceSidebarProps = {
    experiences: readonly Experience[];
    selectedExperienceId: string | null;
    onSelectExperience: (experienceId: string) => void;
};

type YearGroup = {
    year: number;
    experiences: Experience[];
};

type ResizeState = {
    pointerId: number;
    startX: number;
    startWidth: number;
};

const DEFAULT_SIDEBAR_WIDTH = 270;
const MIN_SIDEBAR_WIDTH = 220;
const MAX_SIDEBAR_WIDTH = 380;

function EmptySidebar() {
    return (
        <div className="px-2 py-1">
            {[0, 1, 2].map((item) => (
                <div
                    key={item}
                    className="flex h-8 items-center gap-2 rounded-md px-2"
                >
                    <ChevronRight
                        className="size-3.5 shrink-0 text-foreground/15"
                        strokeWidth={1.7}
                    />

                    <Folder
                        className="size-4 shrink-0 text-foreground/20"
                        strokeWidth={1.6}
                    />

                    <div
                        className={[
                            "h-2.5 rounded-sm bg-foreground/[0.065]",
                            item === 0 ? "w-12" : item === 1 ? "w-14" : "w-10",
                        ].join(" ")}
                    />
                </div>
            ))}
        </div>
    );
}

export function ExperienceSidebar({
    experiences,
    selectedExperienceId,
    onSelectExperience,
}: ExperienceSidebarProps) {
    const sidebarRef = useRef<HTMLElement>(null);
    const resizeStateRef = useRef<ResizeState | null>(null);

    const groups = useMemo<YearGroup[]>(() => {
        const grouped = new Map<number, Experience[]>();

        for (const experience of experiences) {
            const current = grouped.get(experience.year);

            if (current) {
                current.push(experience);
            } else {
                grouped.set(experience.year, [experience]);
            }
        }

        return Array.from(grouped.entries())
            .sort(([yearA], [yearB]) => yearB - yearA)
            .map(([year, groupedExperiences]) => ({
                year,
                experiences: groupedExperiences,
            }));
    }, [experiences]);

    const [expandedYears, setExpandedYears] = useState<Set<number>>(
        () => new Set(groups[0] ? [groups[0].year] : []),
    );

    function toggleYear(year: number) {
        setExpandedYears((current) => {
            const next = new Set(current);

            if (next.has(year)) {
                next.delete(year);
            } else {
                next.add(year);
            }

            return next;
        });
    }

    function handleResizeStart(event: ReactPointerEvent<HTMLDivElement>) {
        if (!sidebarRef.current) {
            return;
        }

        event.preventDefault();

        resizeStateRef.current = {
            pointerId: event.pointerId,
            startX: event.clientX,
            startWidth: sidebarRef.current.getBoundingClientRect().width,
        };

        event.currentTarget.setPointerCapture(event.pointerId);
    }

    function handleResizeMove(event: ReactPointerEvent<HTMLDivElement>) {
        const resizeState = resizeStateRef.current;
        const sidebar = sidebarRef.current;

        if (
            !resizeState ||
            !sidebar ||
            resizeState.pointerId !== event.pointerId
        ) {
            return;
        }

        const delta = event.clientX - resizeState.startX;

        const nextWidth = Math.min(
            MAX_SIDEBAR_WIDTH,
            Math.max(MIN_SIDEBAR_WIDTH, resizeState.startWidth + delta),
        );

        sidebar.style.width = `${nextWidth}px`;
    }

    function handleResizeEnd(event: ReactPointerEvent<HTMLDivElement>) {
        const resizeState = resizeStateRef.current;

        if (!resizeState || resizeState.pointerId !== event.pointerId) {
            return;
        }

        resizeStateRef.current = null;

        if (event.currentTarget.hasPointerCapture(event.pointerId)) {
            event.currentTarget.releasePointerCapture(event.pointerId);
        }
    }

    return (
        <aside
            ref={sidebarRef}
            className="relative flex h-full shrink-0 flex-col border-r border-foreground/10 bg-foreground/[0.025]"
            style={{
                width: DEFAULT_SIDEBAR_WIDTH,
            }}
        >
            <div className="min-h-0 flex-1 overflow-y-auto py-1.5">
                {groups.length === 0 ? (
                    <EmptySidebar />
                ) : (
                    <div className="px-1.5">
                        {groups.map((group) => {
                            const expanded = expandedYears.has(group.year);

                            return (
                                <div key={group.year}>
                                    <button
                                        type="button"
                                        onClick={() => toggleYear(group.year)}
                                        className="
                                            flex h-8 w-full items-center gap-1.5
                                            rounded-md px-1.5 text-left
                                            text-[13px] text-foreground/75
                                            transition-colors duration-100
                                            hover:bg-foreground/[0.055]
                                            hover:text-foreground
                                        "
                                    >
                                        <ChevronRight
                                            className={[
                                                "size-3.5 shrink-0 text-foreground/45",
                                                "transition-transform duration-150",
                                                expanded ? "rotate-90" : "",
                                            ].join(" ")}
                                            strokeWidth={1.8}
                                        />

                                        {expanded ? (
                                            <FolderOpen
                                                className="size-4 shrink-0 text-foreground/55"
                                                strokeWidth={1.6}
                                            />
                                        ) : (
                                            <Folder
                                                className="size-4 shrink-0 text-foreground/55"
                                                strokeWidth={1.6}
                                            />
                                        )}

                                        <span className="font-medium">
                                            {group.year}
                                        </span>

                                        <span className="ml-auto pr-1 text-[10px] tabular-nums text-foreground/30">
                                            {group.experiences.length}
                                        </span>
                                    </button>

                                    {expanded ? (
                                        <div className="pb-1 pl-5 flex flex-col gap-1">
                                            {group.experiences.map(
                                                (experience) => {
                                                    const selected =
                                                        experience.id ===
                                                        selectedExperienceId;

                                                    return (
                                                        <button
                                                            key={experience.id}
                                                            type="button"
                                                            onClick={() =>
                                                                onSelectExperience(
                                                                    experience.id,
                                                                )
                                                            }
                                                            className={[
                                                                "flex min-h-9 w-full items-center gap-2",
                                                                "rounded-md px-4 py-2 text-left",
                                                                "transition-colors duration-100",
                                                                selected
                                                                    ? "bg-foreground/10 text-foreground"
                                                                    : "text-foreground/60 hover:bg-foreground/[0.05] hover:text-foreground",
                                                            ].join(" ")}
                                                        >
                                                            <div className="min-w-0 flex-1">
                                                                <div className="truncate text-[12px] font-medium">
                                                                    {
                                                                        experience.role
                                                                    }
                                                                </div>

                                                                <div className="truncate text-[11px] text-foreground/55">
                                                                    {
                                                                        experience.company
                                                                    }
                                                                </div>
                                                            </div>
                                                        </button>
                                                    );
                                                },
                                            )}
                                        </div>
                                    ) : null}
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            <div
                role="separator"
                aria-orientation="vertical"
                aria-label="Resize experience sidebar"
                onPointerDown={handleResizeStart}
                onPointerMove={handleResizeMove}
                onPointerUp={handleResizeEnd}
                onPointerCancel={handleResizeEnd}
                className="
                    group absolute right-[-3px] top-0 z-20 h-full w-[6px]
                    cursor-col-resize touch-none
                "
            >
                <div
                    className="
                        absolute right-[2px] top-0 h-full w-px
                        bg-transparent
                        transition-colors duration-100
                        group-hover:bg-foreground/20
                    "
                />
            </div>
        </aside>
    );
}
