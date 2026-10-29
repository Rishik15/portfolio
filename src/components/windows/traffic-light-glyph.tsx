const GLYPHS = {
    close: <path d="M3.6 3.6l4.8 4.8M8.4 3.6l-4.8 4.8" fill="none" />,
    minimize: <path d="M3.2 6h5.6" fill="none" />,
    maximize: (
        <path
            d="M3.6 3.6h3.3l-3.3 3.3zM8.4 8.4H5.1l3.3-3.3z"
            strokeWidth="0.5"
        />
    ),
} as const;

type TrafficLightGlyphProps = {
    kind: keyof typeof GLYPHS;
};

export function TrafficLightGlyph({ kind }: TrafficLightGlyphProps) {
    return (
        <svg
            viewBox="0 0 12 12"
            fill="currentColor"
            stroke="currentColor"
            strokeWidth="1.1"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
            className="
                pointer-events-none
                absolute
                inset-0
                size-3
                text-black/60
                opacity-0
                group-hover/dot:opacity-100
                group-disabled/dot:hidden
            "
        >
            {GLYPHS[kind]}
        </svg>
    );
}
