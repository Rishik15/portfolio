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
        <aside
            className="
                min-h-0
                min-w-0
                overflow-y-auto
                bg-[#f1f1f1]
                px-2.5
                py-4
                dark:bg-[#262626]
            "
        >
            <p
                className="
                    mb-2
                    px-2
                    text-[14px]
                    font-semibold
                    text-foreground/45
                "
            >
                Folders
            </p>

            <nav className="space-y-0.5">
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
                paddingLeft: 10 + depth * 14,
            }}
            className={`
                flex
                h-8
                w-full
                items-center
                gap-2
                rounded-lg
                pr-2
                text-left
                text-[13px]
                transition-colors
                duration-100

                ${
                    selected
                        ? "bg-black/[0.07] dark:bg-white/[0.08]"
                        : "hover:bg-black/[0.04] dark:hover:bg-white/[0.05]"
                }
            `}
        >
            <FolderIcon />

            <span
                className="
                    min-w-0
                    flex-1
                    truncate
                    font-medium
                "
            >
                {label}
            </span>

            <span
                className="
                    shrink-0
                    text-[11px]
                    tabular-nums
                    text-foreground/35
                "
            >
                {count}
            </span>
        </button>
    );
}

function FolderIcon() {
    return (
        <svg
            viewBox="0 0 24 24"
            aria-hidden="true"
            className="
                size-4
                shrink-0
                fill-[#f4bf3a]
                text-[#d9a729]
            "
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
