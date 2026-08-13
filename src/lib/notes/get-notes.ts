import "server-only";

import { readdir, readFile } from "node:fs/promises";
import path from "node:path";

import matter from "gray-matter";
import { marked } from "marked";

import type {
    NoteDocument,
    NoteFolder,
    NotesLibrary,
} from "@/lib/notes/notes-types";

const NOTES_ROOT = path.join(process.cwd(), "content", "notes");
const DESCRIPTION_LENGTH = 150;

export async function getNotesLibrary(): Promise<NotesLibrary> {
    const files = await findMarkdownFiles(NOTES_ROOT);
    const notes = await Promise.all(files.map(readNote));

    notes.sort(sortNotes);

    return {
        folders: buildFolders(notes),
        notes,
    };
}

async function findMarkdownFiles(directory: string): Promise<string[]> {
    try {
        const entries = await readdir(directory, { withFileTypes: true });

        const files = await Promise.all(
            entries
                .filter((entry) => !entry.name.startsWith("."))
                .sort((a, b) => a.name.localeCompare(b.name))
                .map(async (entry) => {
                    const entryPath = path.join(directory, entry.name);

                    if (entry.isDirectory()) {
                        return findMarkdownFiles(entryPath);
                    }

                    if (
                        entry.isFile() &&
                        entry.name.toLowerCase().endsWith(".md")
                    ) {
                        return [entryPath];
                    }

                    return [];
                }),
        );

        return files.flat();
    } catch (error) {
        if (isNodeError(error) && error.code === "ENOENT") {
            return [];
        }

        throw error;
    }
}

async function readNote(filePath: string): Promise<NoteDocument> {
    const source = await readFile(filePath, "utf8");
    const { data, content } = matter(source);

    const relativePath = toPosix(path.relative(NOTES_ROOT, filePath));
    const id = relativePath.replace(/\.md$/i, "");
    const lastSlash = id.lastIndexOf("/");

    const folderPath = lastSlash === -1 ? "" : id.slice(0, lastSlash);
    const filename = id.slice(lastSlash + 1);

    const title = getString(data.title) || prettifyName(filename);
    const date = normalizeDate(data.date);
    const description =
        getString(data.description) || createDescription(content);

    const html = await marked.parse(content, {
        gfm: true,
        breaks: false,
    });

    return {
        id,
        title,
        date,
        description,
        folderPath,
        html,
    };
}

function buildFolders(notes: readonly NoteDocument[]): NoteFolder[] {
    const paths = new Set<string>();

    for (const note of notes) {
        if (!note.folderPath) {
            continue;
        }

        const segments = note.folderPath.split("/");

        for (let index = 1; index <= segments.length; index += 1) {
            paths.add(segments.slice(0, index).join("/"));
        }
    }

    return [...paths]
        .sort((a, b) => a.localeCompare(b))
        .map((folderPath) => createFolder(folderPath, notes));
}

function createFolder(
    folderPath: string,
    notes: readonly NoteDocument[],
): NoteFolder {
    const segments = folderPath.split("/");
    const parentPath =
        segments.length > 1 ? segments.slice(0, -1).join("/") : null;

    const count = notes.filter(
        (note) =>
            note.folderPath === folderPath ||
            note.folderPath.startsWith(`${folderPath}/`),
    ).length;

    return {
        id: folderPath,
        name: prettifyName(segments.at(-1) ?? folderPath),
        path: folderPath,
        parentPath,
        depth: segments.length - 1,
        count,
    };
}

function sortNotes(a: NoteDocument, b: NoteDocument): number {
    if (a.date !== b.date) {
        return b.date.localeCompare(a.date);
    }

    return a.title.localeCompare(b.title);
}

function createDescription(markdown: string): string {
    const cleaned = markdown
        .replace(/```[\s\S]*?```/g, " ")
        .replace(/!\[[^\]]*]\([^)]*\)/g, " ")
        .replace(/\[([^\]]+)]\([^)]*\)/g, "$1")
        .replace(/^#{1,6}\s+/gm, "")
        .replace(/^>\s?/gm, "")
        .replace(/^\s*[-+*]\s+/gm, "")
        .replace(/[*_~`]/g, "")
        .replace(/\s+/g, " ")
        .trim();

    if (cleaned.length <= DESCRIPTION_LENGTH) {
        return cleaned;
    }

    return `${cleaned.slice(0, DESCRIPTION_LENGTH).trimEnd()}…`;
}

function normalizeDate(value: unknown): string {
    if (value instanceof Date && !Number.isNaN(value.getTime())) {
        return value.toISOString().slice(0, 10);
    }

    if (typeof value !== "string" && typeof value !== "number") {
        return "";
    }

    const rawDate = String(value).trim();

    if (/^\d{4}-\d{2}-\d{2}$/.test(rawDate)) {
        return rawDate;
    }

    const parsedDate = new Date(rawDate);

    if (Number.isNaN(parsedDate.getTime())) {
        return "";
    }

    return parsedDate.toISOString().slice(0, 10);
}

function getString(value: unknown): string {
    return typeof value === "string" ? value.trim() : "";
}

function prettifyName(value: string): string {
    return value
        .replace(/[-_]+/g, " ")
        .replace(/\b\p{L}/gu, (letter) => letter.toUpperCase());
}

function toPosix(value: string): string {
    return value.split(path.sep).join("/");
}

function isNodeError(error: unknown): error is NodeJS.ErrnoException {
    return error instanceof Error && "code" in error;
}
