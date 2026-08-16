"use client";

import { ChevronRight, Folder, FolderOpen } from "lucide-react";
import {
    useMemo,
    useRef,
    useState,
    type PointerEvent as ReactPointerEvent,
} from "react";

import {
    EXPERIENCE_SIDEBAR,
    EXPERIENCE_UI,
} from "@/components/apps/experience/experience-ui";
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

function EmptySidebar() {
    return (
        <div className={EXPERIENCE_UI.sidebar.empty}>
            {[0, 1, 2].map((item) => (
                <div key={item} className={EXPERIENCE_UI.sidebar.emptyRow}>
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
        const sidebar = sidebarRef.current;

        if (!sidebar) {
            return;
        }

        event.preventDefault();

        resizeStateRef.current = {
            pointerId: event.pointerId,
            startX: event.clientX,
            startWidth: sidebar.getBoundingClientRect().width,
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

        const parentWidth =
            sidebar.parentElement?.getBoundingClientRect().width ?? 0;

        const minimumDetailWidth =
            EXPERIENCE_SIDEBAR.getMinDetailWidth(parentWidth);

        const maximumSidebarWidth = Math.min(
            EXPERIENCE_SIDEBAR.maxWidth,
            Math.max(
                EXPERIENCE_SIDEBAR.minWidth,
                parentWidth - minimumDetailWidth,
            ),
        );

        const delta = event.clientX - resizeState.startX;

        const nextWidth = Math.min(
            maximumSidebarWidth,
            Math.max(
                EXPERIENCE_SIDEBAR.minWidth,
                resizeState.startWidth + delta,
            ),
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
        <aside ref={sidebarRef} className={EXPERIENCE_UI.sidebar.root}>
            <div className={EXPERIENCE_UI.sidebar.scroller}>
                {groups.length === 0 ? (
                    <EmptySidebar />
                ) : (
                    <div className={EXPERIENCE_UI.sidebar.content}>
                        {groups.map((group) => {
                            const expanded = expandedYears.has(group.year);

                            return (
                                <div key={group.year}>
                                    <button
                                        type="button"
                                        onClick={() => toggleYear(group.year)}
                                        className={
                                            EXPERIENCE_UI.sidebar.yearButton
                                        }
                                    >
                                        <ChevronRight
                                            className={[
                                                EXPERIENCE_UI.sidebar.chevron,
                                                expanded ? "rotate-90" : "",
                                            ].join(" ")}
                                            strokeWidth={1.8}
                                        />

                                        {expanded ? (
                                            <FolderOpen
                                                className={
                                                    EXPERIENCE_UI.sidebar
                                                        .folderIcon
                                                }
                                                strokeWidth={1.6}
                                            />
                                        ) : (
                                            <Folder
                                                className={
                                                    EXPERIENCE_UI.sidebar
                                                        .folderIcon
                                                }
                                                strokeWidth={1.6}
                                            />
                                        )}

                                        <span className="font-medium">
                                            {group.year}
                                        </span>

                                        <span
                                            className={
                                                EXPERIENCE_UI.sidebar.yearCount
                                            }
                                        >
                                            {group.experiences.length}
                                        </span>
                                    </button>

                                    {expanded ? (
                                        <div
                                            className={
                                                EXPERIENCE_UI.sidebar
                                                    .experienceList
                                            }
                                        >
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
                                                            className={`
                                                                ${EXPERIENCE_UI.sidebar.experienceButton}

                                                                ${
                                                                    selected
                                                                        ? "bg-foreground/10 text-foreground"
                                                                        : "text-foreground/60 hover:bg-foreground/[0.05] hover:text-foreground"
                                                                }
                                                            `}
                                                        >
                                                            <div className="min-w-0 flex-1">
                                                                <div
                                                                    className={
                                                                        EXPERIENCE_UI
                                                                            .sidebar
                                                                            .role
                                                                    }
                                                                >
                                                                    {
                                                                        experience.role
                                                                    }
                                                                </div>

                                                                <div
                                                                    className={
                                                                        EXPERIENCE_UI
                                                                            .sidebar
                                                                            .company
                                                                    }
                                                                >
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
                className={EXPERIENCE_UI.sidebar.resizer}
            >
                <div className={EXPERIENCE_UI.sidebar.resizerLine} />
            </div>
        </aside>
    );
}
