"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { NoteViewer } from "@/components/apps/notes/note-viewer";
import { NotesList } from "@/components/apps/notes/notes-list";
import {
    getNotesPaneProfile,
    getNotesPreferredPaneWidths,
    NOTES_LAYOUT,
    NOTES_UI,
    type NotesPaneWidths,
} from "@/components/apps/notes/notes-ui";
import { NotesResizer } from "@/components/apps/notes/notes-resizer";
import { NotesSidebar } from "@/components/apps/notes/notes-sidebar";
import { useNotes } from "@/components/apps/notes/use-notes";

type NotesLayout = "all" | "notes" | "viewer";
type SidebarLayout = Exclude<NotesLayout, "viewer">;

const INITIAL_PANE_WIDTHS = getNotesPreferredPaneWidths(
    NOTES_LAYOUT.fallbackContainerWidth,
);

export function Notes() {
    const notes = useNotes();

    const containerRef = useRef<HTMLDivElement>(null);

    const adjustedPanesRef = useRef({
        sidebar: false,
        list: false,
    });

    const desiredPaneWidthsRef = useRef<NotesPaneWidths>(INITIAL_PANE_WIDTHS);

    const [layout, setLayout] = useState<NotesLayout>("all");

    const [previousSidebarLayout, setPreviousSidebarLayout] =
        useState<SidebarLayout>("all");

    const [paneWidths, setPaneWidths] =
        useState<NotesPaneWidths>(INITIAL_PANE_WIDTHS);

    useEffect(() => {
        const container = containerRef.current;

        if (!container || typeof ResizeObserver === "undefined") {
            return;
        }

        let frameId = 0;

        const applyContainerWidth = (containerWidth: number) => {
            const preferred = getNotesPreferredPaneWidths(containerWidth);

            if (!adjustedPanesRef.current.sidebar) {
                desiredPaneWidthsRef.current.sidebar = preferred.sidebar;
            }

            if (!adjustedPanesRef.current.list) {
                desiredPaneWidthsRef.current.list = preferred.list;
            }

            setPaneWidths((current) => {
                const next = fitPaneWidths(
                    desiredPaneWidthsRef.current,
                    containerWidth,
                    layout,
                );

                if (samePaneWidths(current, next)) {
                    return current;
                }

                return next;
            });
        };

        applyContainerWidth(container.clientWidth);

        const resizeObserver = new ResizeObserver((entries) => {
            const containerWidth =
                entries[0]?.contentRect.width ?? container.clientWidth;

            window.cancelAnimationFrame(frameId);

            frameId = window.requestAnimationFrame(() => {
                applyContainerWidth(containerWidth);
            });
        });

        resizeObserver.observe(container);

        return () => {
            window.cancelAnimationFrame(frameId);
            resizeObserver.disconnect();
        };
    }, [layout]);

    const toggleFolders = () => {
        if (layout === "all") {
            setLayout("notes");
            setPreviousSidebarLayout("notes");
            return;
        }

        if (layout === "notes") {
            setLayout("all");
            setPreviousSidebarLayout("all");
        }
    };

    const toggleSidebars = () => {
        if (layout === "viewer") {
            setLayout(previousSidebarLayout);
            return;
        }

        setPreviousSidebarLayout(layout);
        setLayout("viewer");
    };

    const resizeSidebar = useCallback(
        (delta: number) => {
            if (layout !== "all") {
                return;
            }

            const containerWidth =
                containerRef.current?.clientWidth ??
                NOTES_LAYOUT.fallbackContainerWidth;

            const profile = getNotesPaneProfile(containerWidth);

            setPaneWidths((current) => {
                const availableMaximum =
                    containerWidth -
                    current.list -
                    profile.viewerMin -
                    NOTES_LAYOUT.resizerWidth * 2;

                const maximum = Math.min(
                    profile.sidebar.max,
                    Math.max(profile.sidebar.min, availableMaximum),
                );

                const nextSidebar = clamp(
                    current.sidebar + delta,
                    profile.sidebar.min,
                    maximum,
                );

                if (nextSidebar === current.sidebar) {
                    return current;
                }

                adjustedPanesRef.current.sidebar = true;
                desiredPaneWidthsRef.current.sidebar = nextSidebar;

                return {
                    ...current,
                    sidebar: nextSidebar,
                };
            });
        },
        [layout],
    );

    const resizeList = useCallback(
        (delta: number) => {
            if (layout === "viewer") {
                return;
            }

            const containerWidth =
                containerRef.current?.clientWidth ??
                NOTES_LAYOUT.fallbackContainerWidth;

            const profile = getNotesPaneProfile(containerWidth);

            setPaneWidths((current) => {
                const occupiedWidth =
                    layout === "all"
                        ? current.sidebar + NOTES_LAYOUT.resizerWidth * 2
                        : NOTES_LAYOUT.resizerWidth;

                const availableMaximum =
                    containerWidth - occupiedWidth - profile.viewerMin;

                const maximum = Math.min(
                    profile.list.max,
                    Math.max(profile.list.min, availableMaximum),
                );

                const nextList = clamp(
                    current.list + delta,
                    profile.list.min,
                    maximum,
                );

                if (nextList === current.list) {
                    return current;
                }

                adjustedPanesRef.current.list = true;
                desiredPaneWidthsRef.current.list = nextList;

                return {
                    ...current,
                    list: nextList,
                };
            });
        },
        [layout],
    );

    return (
        <div
            ref={containerRef}
            className={NOTES_UI.root}
            style={{
                gridTemplateColumns: getGridColumns(layout, paneWidths),
            }}
        >
            <NotesSidebar
                folders={notes.library.folders}
                totalCount={notes.library.notes.length}
                selectedFolder={notes.selectedFolder}
                onSelectFolder={notes.selectFolder}
            />

            <NotesResizer onResize={resizeSidebar} />

            <NotesList
                title={notes.selectedFolderTitle}
                notes={notes.visibleNotes}
                selectedNoteId={notes.selectedNoteId}
                status={notes.status}
                foldersVisible={layout === "all"}
                onToggleFolders={toggleFolders}
                onSelectNote={notes.selectNote}
            />

            <NotesResizer onResize={resizeList} />

            <NoteViewer
                note={notes.selectedNote}
                status={notes.status}
                sidebarsVisible={layout !== "viewer"}
                onToggleSidebars={toggleSidebars}
            />
        </div>
    );
}

function getGridColumns(layout: NotesLayout, widths: NotesPaneWidths) {
    switch (layout) {
        case "all":
            return `
                ${widths.sidebar}px
                ${NOTES_LAYOUT.resizerWidth}px
                ${widths.list}px
                ${NOTES_LAYOUT.resizerWidth}px
                minmax(0, 1fr)
            `;

        case "notes":
            return `
                0px
                0px
                ${widths.list}px
                ${NOTES_LAYOUT.resizerWidth}px
                minmax(0, 1fr)
            `;

        case "viewer":
            return `
                0px
                0px
                0px
                0px
                minmax(0, 1fr)
            `;
    }
}

function fitPaneWidths(
    desiredWidths: NotesPaneWidths,
    containerWidth: number,
    layout: NotesLayout,
): NotesPaneWidths {
    const profile = getNotesPaneProfile(containerWidth);

    let sidebar = clamp(
        desiredWidths.sidebar,
        profile.sidebar.min,
        profile.sidebar.max,
    );

    let list = clamp(desiredWidths.list, profile.list.min, profile.list.max);

    if (layout === "all") {
        const availableForSidePanes =
            containerWidth - profile.viewerMin - NOTES_LAYOUT.resizerWidth * 2;

        const combinedWidth = sidebar + list;

        if (combinedWidth > availableForSidePanes) {
            let overflow = combinedWidth - availableForSidePanes;

            const sidebarShrinkCapacity = sidebar - profile.sidebar.min;

            const sidebarReduction = Math.min(overflow, sidebarShrinkCapacity);

            sidebar -= sidebarReduction;
            overflow -= sidebarReduction;

            if (overflow > 0) {
                const listShrinkCapacity = list - profile.list.min;

                const listReduction = Math.min(overflow, listShrinkCapacity);

                list -= listReduction;
            }
        }
    }

    if (layout === "notes") {
        const availableForList =
            containerWidth - profile.viewerMin - NOTES_LAYOUT.resizerWidth;

        list = Math.min(list, Math.max(profile.list.min, availableForList));
    }

    return {
        sidebar,
        list,
    };
}

function samePaneWidths(first: NotesPaneWidths, second: NotesPaneWidths) {
    return first.sidebar === second.sidebar && first.list === second.list;
}

function clamp(value: number, minimum: number, maximum: number) {
    return Math.min(Math.max(value, minimum), maximum);
}
