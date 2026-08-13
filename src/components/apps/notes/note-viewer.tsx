import type { ReactNode } from "react";

import { NotesMarkdown } from "@/components/apps/notes/notes-markdown";
import { NotesPaneToggle } from "@/components/apps/notes/notes-pane-toggle";
import { formatLongNoteDate } from "@/components/apps/notes/notes-utils";
import type { NoteDocument, NotesLoadStatus } from "@/lib/notes/notes-types";

type NoteViewerProps = {
    note: NoteDocument | null;
    status: NotesLoadStatus;
    sidebarsVisible: boolean;
    onToggleSidebars: () => void;
};

export function NoteViewer({
    note,
    status,
    sidebarsVisible,
    onToggleSidebars,
}: NoteViewerProps) {
    return (
        <section
            className="
                flex
                min-h-0
                min-w-0
                flex-col
                overflow-hidden
                bg-white
                dark:bg-[#1c1c1c]
            "
        >
            <ViewerToolbar
                note={note}
                sidebarsVisible={sidebarsVisible}
                onToggleSidebars={onToggleSidebars}
            />

            <div
                className="
                    min-h-0
                    flex-1
                    overflow-y-auto
                "
            >
                <ViewerContent note={note} status={status} />
            </div>
        </section>
    );
}

type ViewerToolbarProps = {
    note: NoteDocument | null;
    sidebarsVisible: boolean;
    onToggleSidebars: () => void;
};

function ViewerToolbar({
    note,
    sidebarsVisible,
    onToggleSidebars,
}: ViewerToolbarProps) {
    return (
        <header
            className="
                flex
                h-12
                shrink-0
                items-center
                justify-between
                px-5
            "
        >
            <NotesPaneToggle
                direction={sidebarsVisible ? "left" : "right"}
                label={sidebarsVisible ? "Hide sidebars" : "Show sidebars"}
                onClick={onToggleSidebars}
            />

            {note?.date ? (
                <time
                    dateTime={note.date}
                    className="
                        text-right
                        text-[12px]
                        font-medium
                        tabular-nums
                        text-foreground/40
                    "
                >
                    {formatLongNoteDate(note.date)}
                </time>
            ) : (
                <span />
            )}
        </header>
    );
}

function ViewerContent({
    note,
    status,
}: {
    note: NoteDocument | null;
    status: NotesLoadStatus;
}) {
    if (status === "loading") {
        return <ViewerMessage>Loading note…</ViewerMessage>;
    }

    if (status === "error") {
        return <ViewerMessage>Unable to load notes.</ViewerMessage>;
    }

    if (!note) {
        return <ViewerMessage>No notes yet.</ViewerMessage>;
    }

    return (
        <article
            className="
                mx-auto
                w-full
                max-w-4xl
                px-10
                pb-16
                pt-2
            "
        >
            <h1
                className="
                    text-[30px]
                    font-semibold
                    leading-tight
                    tracking-tight
                    text-foreground
                "
            >
                {note.title}
            </h1>

            <NotesMarkdown html={note.html} />
        </article>
    );
}

function ViewerMessage({ children }: { children: ReactNode }) {
    return (
        <div
            className="
                flex
                h-full
                items-center
                justify-center
                text-sm
                text-foreground/40
            "
        >
            {children}
        </div>
    );
}
