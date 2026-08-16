import { NOTES_UI } from "@/components/apps/notes/notes-ui";
import type { NoteFolder } from "@/lib/notes/notes-types";

type NotesSidebarProps = {
    folders: readonly NoteFolder[];
    totalCount: number;
    selectedFolder: string | null;
    onSelectFolder: (folderPath: string | null) => void;
};

export function NotesSidebar({
    folders,
    totalCount,
    selectedFolder,
    onSelectFolder,
}: NotesSidebarProps) {
    return (
        <aside className={NOTES_UI.sidebar.root}>
            <p className={NOTES_UI.sidebar.heading}>Folders</p>

            <nav className={NOTES_UI.sidebar.nav}>
                <FolderButton
                    label="All Notes"
                    count={totalCount}
                    selected={selectedFolder === null}
                    onClick={() => onSelectFolder(null)}
                />

                {folders.map((folder) => (
                    <FolderButton
                        key={folder.id}
                        label={folder.name}
                        count={folder.count}
                        depth={folder.depth}
                        selected={selectedFolder === folder.path}
                        onClick={() => onSelectFolder(folder.path)}
                    />
                ))}
            </nav>
        </aside>
    );
}

type FolderButtonProps = {
    label: string;
    count: number;
    depth?: number;
    selected: boolean;
    onClick: () => void;
};

function FolderButton({
    label,
    count,
    depth = 0,
    selected,
    onClick,
}: FolderButtonProps) {
    return (
        <button
            type="button"
            onClick={onClick}
            aria-pressed={selected}
            style={{
                paddingLeft:
                    NOTES_UI.sidebar.indentBase +
                    depth * NOTES_UI.sidebar.indentStep,
            }}
            className={`
                ${NOTES_UI.sidebar.button}

                ${
                    selected
                        ? "bg-black/[0.07] dark:bg-white/[0.08]"
                        : "hover:bg-black/[0.04] dark:hover:bg-white/[0.05]"
                }
            `}
        >
            <FolderIcon />

            <span className={NOTES_UI.sidebar.label}>{label}</span>

            <span className={NOTES_UI.sidebar.count}>{count}</span>
        </button>
    );
}

function FolderIcon() {
    return (
        <svg
            viewBox="0 0 24 24"
            aria-hidden="true"
            className={NOTES_UI.sidebar.icon}
        >
            <path
                d="
                    M3.75 5.5
                    A1.75 1.75 0 0 1 5.5 3.75
                    H9
                    L11 5.75
                    H18.5
                    A1.75 1.75 0 0 1 20.25 7.5
                    V17.5
                    A1.75 1.75 0 0 1 18.5 19.25
                    H5.5
                    A1.75 1.75 0 0 1 3.75 17.5
                    Z
                "
                stroke="currentColor"
                strokeWidth="1"
            />
        </svg>
    );
}
