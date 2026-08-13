import type { NotesLibrary } from "@/lib/notes/notes-types";

let cachedLibrary: NotesLibrary | null = null;
let pendingRequest: Promise<NotesLibrary> | null = null;

export function getCachedNotesLibrary() {
    return cachedLibrary;
}

export function loadNotesLibrary(): Promise<NotesLibrary> {
    if (cachedLibrary) {
        return Promise.resolve(cachedLibrary);
    }

    if (pendingRequest) {
        return pendingRequest;
    }

    pendingRequest = fetch("/api/notes")
        .then((response) => {
            if (!response.ok) {
                throw new Error(`Notes request failed: ${response.status}`);
            }

            return response.json() as Promise<NotesLibrary>;
        })
        .then((library) => {
            cachedLibrary = library;
            return library;
        })
        .catch((error) => {
            pendingRequest = null;
            throw error;
        });

    return pendingRequest;
}

export function preloadNotesLibrary() {
    void loadNotesLibrary().catch(() => {
        // The Notes app can retry normally when opened.
    });
}
