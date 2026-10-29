import { useEffect, useMemo, useState } from "react";

import {
    getCachedNotesLibrary,
    loadNotesLibrary,
} from "@/components/apps/notes/notes-cache";
import type { NotesLibrary, NotesLoadStatus } from "@/lib/notes/notes-types";

const EMPTY_LIBRARY: NotesLibrary = {
    folders: [],
    notes: [],
};

export function useNotes() {
    const cachedLibrary = getCachedNotesLibrary();

    const [library, setLibrary] = useState<NotesLibrary>(
        cachedLibrary ?? EMPTY_LIBRARY,
    );

    const [status, setStatus] = useState<NotesLoadStatus>(
        cachedLibrary ? "ready" : "loading",
    );

    const [selectedFolder, setSelectedFolder] = useState<string | null>(null);

    const [selectedNoteId, setSelectedNoteId] = useState<string | null>(
        cachedLibrary?.notes[0]?.id ?? null,
    );

    useEffect(() => {
        if (getCachedNotesLibrary()) {
            return;
        }

        let active = true;

        loadNotesLibrary()
            .then((nextLibrary) => {
                if (!active) {
                    return;
                }

                setLibrary(nextLibrary);
                setSelectedNoteId(nextLibrary.notes[0]?.id ?? null);
                setStatus("ready");
            })
            .catch(() => {
                if (active) {
                    setStatus("error");
                }
            });

        return () => {
            active = false;
        };
    }, []);

    const visibleNotes = useMemo(() => {
        if (selectedFolder === null) {
            return library.notes;
        }

        return library.notes.filter(
            (note) =>
                note.folderPath === selectedFolder ||
                note.folderPath.startsWith(`${selectedFolder}/`),
        );
    }, [library.notes, selectedFolder]);

    const selectedNote = useMemo(
        () =>
            visibleNotes.find((note) => note.id === selectedNoteId) ??
            visibleNotes[0] ??
            null,
        [selectedNoteId, visibleNotes],
    );

    const selectedFolderTitle = useMemo(() => {
        if (selectedFolder === null) {
            return "All Notes";
        }

        return (
            library.folders.find((folder) => folder.path === selectedFolder)
                ?.name ?? "Notes"
        );
    }, [library.folders, selectedFolder]);

    function selectFolder(folderPath: string | null) {
        const nextNotes =
            folderPath === null
                ? library.notes
                : library.notes.filter(
                      (note) =>
                          note.folderPath === folderPath ||
                          note.folderPath.startsWith(`${folderPath}/`),
                  );

        setSelectedFolder(folderPath);
        setSelectedNoteId(nextNotes[0]?.id ?? null);
    }

    return {
        library,
        status,
        selectedFolder,
        selectedFolderTitle,
        selectedNote,
        selectedNoteId: selectedNote?.id ?? null,
        visibleNotes,
        selectFolder,
        selectNote: setSelectedNoteId,
    };
}
