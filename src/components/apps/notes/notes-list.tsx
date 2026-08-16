import { NotesListItem } from "@/components/apps/notes/notes-list-item";
import { NotesPaneToggle } from "@/components/apps/notes/notes-pane-toggle";
import { NOTES_UI } from "@/components/apps/notes/notes-ui";
import type { NoteDocument, NotesLoadStatus } from "@/lib/notes/notes-types";

type NotesListProps = {
    title: string;
    notes: readonly NoteDocument[];
    selectedNoteId: string | null;
    status: NotesLoadStatus;
    foldersVisible: boolean;
    onToggleFolders: () => void;
    onSelectNote: (noteId: string) => void;
};

export function NotesList({
    title,
    notes,
    selectedNoteId,
    status,
    foldersVisible,
    onToggleFolders,
    onSelectNote,
}: NotesListProps) {
    return (
        <section className={NOTES_UI.list.root}>
            <header className={NOTES_UI.list.header}>
                <div className={NOTES_UI.list.headerRow}>
                    <NotesPaneToggle
                        direction={foldersVisible ? "left" : "right"}
                        label={foldersVisible ? "Hide folders" : "Show folders"}
                        onClick={onToggleFolders}
                    />

                    <div className={NOTES_UI.list.titleWrapper}>
                        <h2 className={NOTES_UI.list.title}>{title}</h2>

                        <p className={NOTES_UI.list.count}>
                            {notes.length}{" "}
                            {notes.length === 1 ? "note" : "notes"}
                        </p>
                    </div>
                </div>
            </header>

            <div className={NOTES_UI.list.body}>
                {status === "loading" && (
                    <p className={NOTES_UI.list.message}>Loading notes…</p>
                )}

                {status === "ready" && notes.length === 0 && (
                    <p className={NOTES_UI.list.message}>
                        No notes in this folder.
                    </p>
                )}

                {notes.map((note) => (
                    <NotesListItem
                        key={note.id}
                        note={note}
                        selected={note.id === selectedNoteId}
                        onSelect={() => onSelectNote(note.id)}
                    />
                ))}
            </div>
        </section>
    );
}
