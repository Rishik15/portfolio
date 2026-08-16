import { NOTES_UI } from "@/components/apps/notes/notes-ui";

type NotesPaneToggleProps = {
    direction: "left" | "right";
    label: string;
    onClick: () => void;
};

export function NotesPaneToggle({
    direction,
    label,
    onClick,
}: NotesPaneToggleProps) {
    return (
        <button
            type="button"
            onClick={onClick}
            aria-label={label}
            title={label}
            className={NOTES_UI.toggle.button}
        >
            <svg
                viewBox="0 0 20 20"
                aria-hidden="true"
                className={NOTES_UI.toggle.icon}
                fill="none"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
                strokeLinejoin="round"
            >
                {direction === "left" ? (
                    <path d="M12.25 5.5 7.75 10l4.5 4.5" />
                ) : (
                    <path d="M7.75 5.5 12.25 10l-4.5 4.5" />
                )}
            </svg>
        </button>
    );
}
