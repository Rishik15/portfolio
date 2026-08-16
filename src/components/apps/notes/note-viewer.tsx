import type { ReactNode } from "react";

import { NotesMarkdown } from "@/components/apps/notes/notes-markdown";
import { NotesPaneToggle } from "@/components/apps/notes/notes-pane-toggle";
import { NOTES_UI } from "@/components/apps/notes/notes-ui";
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
        <section className={NOTES_UI.viewer.root}>
            <ViewerToolbar
                note={note}
                sidebarsVisible={sidebarsVisible}
                onToggleSidebars={onToggleSidebars}
            />

            <div className={NOTES_UI.viewer.scroller}>
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
        <header className={NOTES_UI.viewer.toolbar}>
            <NotesPaneToggle
                direction={sidebarsVisible ? "left" : "right"}
                label={sidebarsVisible ? "Hide sidebars" : "Show sidebars"}
                onClick={onToggleSidebars}
            />

            {note?.date ? (
                <time dateTime={note.date} className={NOTES_UI.viewer.date}>
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
        <article className={NOTES_UI.viewer.article}>
            <h1 className={NOTES_UI.viewer.title}>{note.title}</h1>

            <NotesMarkdown html={note.html} />
        </article>
    );
}

function ViewerMessage({ children }: { children: ReactNode }) {
    return <div className={NOTES_UI.viewer.message}>{children}</div>;
}
