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
            className="
                flex
                size-7
                shrink-0
                items-center
                justify-center
                rounded-md
                text-foreground/40
                transition-colors
                duration-100

                hover:bg-black/[0.05]
                hover:text-foreground/70

                dark:hover:bg-white/[0.06]
            "
        >
            <svg
                viewBox="0 0 20 20"
                aria-hidden="true"
                className="size-[17px]"
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
