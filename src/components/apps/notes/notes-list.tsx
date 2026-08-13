import { NotesListItem } from "@/components/apps/notes/notes-list-item";
import { NotesPaneToggle } from "@/components/apps/notes/notes-pane-toggle";
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
        <section
            className="
                flex
                min-h-0
                min-w-0
                flex-col
                overflow-hidden
                bg-[#fafafa]
                dark:bg-[#202020]
            "
        >
            <header
                className="
                    shrink-0
                    border-b
                    border-black/8
                    px-4
                    py-3
                    dark:border-white/8
                "
            >
                <div
                    className="
                        flex
                        min-w-0
                        items-start
                        justify-between
                        gap-2
                    "
                >
                    <NotesPaneToggle
                        direction={foldersVisible ? "left" : "right"}
                        label={foldersVisible ? "Hide folders" : "Show folders"}
                        onClick={onToggleFolders}
                    />

                    <div className="min-w-0 flex-1 text-right">
                        <h2
                            className="
                                truncate
                                text-[17px]
                                font-semibold
                                tracking-tight
                            "
                        >
                            {title}
                        </h2>

                        <p
                            className="
                                mt-0.5
                                text-[11px]
                                text-foreground/40
                            "
                        >
                            {notes.length}{" "}
                            {notes.length === 1 ? "note" : "notes"}
                        </p>
                    </div>
                </div>
            </header>

            <div
                className="
                    min-h-0
                    flex-1
                    overflow-y-auto
                    p-2
                "
            >
                {status === "loading" && (
                    <p
                        className="
                            px-3
                            py-4
                            text-sm
                            text-foreground/40
                        "
                    >
                        Loading notes…
                    </p>
                )}

                {status === "ready" && notes.length === 0 && (
                    <p
                        className="
                            px-3
                            py-4
                            text-sm
                            text-foreground/40
                        "
                    >
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
