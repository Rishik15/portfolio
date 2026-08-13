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
                mb-1
                w-full
                rounded-xl
                px-3
                py-2.5
                text-left
                transition-colors
                duration-100

                ${
                    selected
                        ? "bg-[#ffe59a] text-black dark:bg-[#755d27] dark:text-white"
                        : "hover:bg-black/[0.035] dark:hover:bg-white/4.5"
                }
            `}
        >
            <p
                className="
                    truncate
                    text-[14px]
                    font-semibold
                "
            >
                {note.title}
            </p>
        </button>
    );
}
