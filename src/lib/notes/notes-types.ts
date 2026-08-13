export type NoteDocument = {
    id: string;
    title: string;
    date: string;
    description: string;
    folderPath: string;
    html: string;
};

export type NoteFolder = {
    id: string;
    name: string;
    path: string;
    parentPath: string | null;
    depth: number;
    count: number;
};

export type NotesLibrary = {
    folders: NoteFolder[];
    notes: NoteDocument[];
};

export type NotesLoadStatus = "loading" | "ready" | "error";
