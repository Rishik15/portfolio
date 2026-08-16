import { NOTES_UI } from "@/components/apps/notes/notes-ui";
import type { NoteDocument } from "@/lib/notes/notes-types";

type NotesListItemProps = {
    note: NoteDocument;
    selected: boolean;
    onSelect: () => void;
};

export function NotesListItem({
    note,
    selected,
    onSelect,
}: NotesListItemProps) {
    return (
        <button
            type="button"
            onClick={onSelect}
            aria-pressed={selected}
            className={`
                ${NOTES_UI.list.item}

                ${
                    selected
                        ? "bg-[#ffe59a] text-black dark:bg-[#755d27] dark:text-white"
                        : "hover:bg-black/[0.035] dark:hover:bg-white/4.5"
                }
            `}
        >
            <p className={NOTES_UI.list.itemTitle}>{note.title}</p>
        </button>
    );
}
