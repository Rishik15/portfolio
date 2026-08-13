"use client";

import { useRef, useState } from "react";

import { NoteViewer } from "@/components/apps/notes/note-viewer";
import { NotesList } from "@/components/apps/notes/notes-list";
import { NotesResizer } from "@/components/apps/notes/notes-resizer";
import { NotesSidebar } from "@/components/apps/notes/notes-sidebar";
import { useNotes } from "@/components/apps/notes/use-notes";

const DEFAULT_SIDEBAR_WIDTH = 150;
const DEFAULT_LIST_WIDTH = 220;

const MIN_SIDEBAR_WIDTH = 120;
const MAX_SIDEBAR_WIDTH = 230;

const MIN_LIST_WIDTH = 170;
const MAX_LIST_WIDTH = 360;

const MIN_VIEWER_WIDTH = 360;
const RESIZER_WIDTH = 1;

type NotesLayout = "all" | "notes" | "viewer";
type SidebarLayout = Exclude<NotesLayout, "viewer">;

export function Notes() {
    const notes = useNotes();
    const containerRef = useRef<HTMLDivElement>(null);

    const [layout, setLayout] = useState<NotesLayout>("all");
    const [previousSidebarLayout, setPreviousSidebarLayout] =
        useState<SidebarLayout>("all");

    const [sidebarWidth, setSidebarWidth] = useState(DEFAULT_SIDEBAR_WIDTH);
    const [listWidth, setListWidth] = useState(DEFAULT_LIST_WIDTH);

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

    const resizeSidebar = (delta: number) => {
        const containerWidth = containerRef.current?.clientWidth ?? 0;

        const availableWidth =
            containerWidth - listWidth - MIN_VIEWER_WIDTH - RESIZER_WIDTH * 2;

        const maxWidth = Math.min(
            MAX_SIDEBAR_WIDTH,
            Math.max(MIN_SIDEBAR_WIDTH, availableWidth),
        );

        setSidebarWidth((width) =>
            clamp(width + delta, MIN_SIDEBAR_WIDTH, maxWidth),
        );
    };

    const resizeList = (delta: number) => {
        const containerWidth = containerRef.current?.clientWidth ?? 0;

        const occupiedWidth =
            layout === "all" ? sidebarWidth + RESIZER_WIDTH * 2 : RESIZER_WIDTH;

        const availableWidth =
            containerWidth - occupiedWidth - MIN_VIEWER_WIDTH;

        const maxWidth = Math.min(
            MAX_LIST_WIDTH,
            Math.max(MIN_LIST_WIDTH, availableWidth),
        );

        setListWidth((width) => clamp(width + delta, MIN_LIST_WIDTH, maxWidth));
    };

    return (
        <div
            ref={containerRef}
            className="
                grid
                h-full
                min-h-0
                w-full
                overflow-hidden
                bg-white
                font-sans
                text-foreground
                transition-[grid-template-columns]
                duration-150
                ease-out
                dark:bg-[#1c1c1c]
            "
            style={{
                gridTemplateColumns: getGridColumns(
                    layout,
                    sidebarWidth,
                    listWidth,
                ),
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

function getGridColumns(
    layout: NotesLayout,
    sidebarWidth: number,
    listWidth: number,
) {
    switch (layout) {
        case "all":
            return `
                ${sidebarWidth}px
                ${RESIZER_WIDTH}px
                ${listWidth}px
                ${RESIZER_WIDTH}px
                minmax(0, 1fr)
            `;

        case "notes":
            return `
                0px
                0px
                ${listWidth}px
                ${RESIZER_WIDTH}px
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

function clamp(value: number, minimum: number, maximum: number) {
    return Math.min(Math.max(value, minimum), maximum);
}
