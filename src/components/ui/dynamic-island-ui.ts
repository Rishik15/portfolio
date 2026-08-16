export const DYNAMIC_ISLAND_UI = {
    position: `
        pointer-events-auto
        fixed
        left-1/2
        top-4
        z-200
        -translate-x-1/2

        min-[1800px]:top-5

        min-[2400px]:top-6
    `,

    island: `
        mx-auto
        w-fit
        min-w-25
        overflow-hidden

        rounded-[28px]

        bg-black
        dark:bg-white

        min-[1800px]:min-w-[108px]
        min-[1800px]:rounded-[30px]

        min-[2400px]:min-w-[116px]
        min-[2400px]:rounded-[32px]
    `,

    bars: {
        root: `
            flex
            items-center
            justify-center

            gap-1
            px-3
            py-2

            min-[1800px]:gap-[5px]
            min-[1800px]:px-3.5
            min-[1800px]:py-2.5

            min-[2400px]:px-4
            min-[2400px]:py-3
        `,

        bar: `
            h-4
            w-[3px]
            origin-center

            rounded-full
            bg-pink-500

            min-[1800px]:h-[18px]

            min-[2400px]:h-5
            min-[2400px]:w-[3.5px]
        `,
    },

    player: {
        root: `
            flex
            w-72
            items-center
            overflow-hidden

            gap-3
            px-4
            py-2

            text-white
            dark:text-black

            min-[1800px]:w-[304px]
            min-[1800px]:gap-3.5
            min-[1800px]:px-[18px]
            min-[1800px]:py-2.5

            min-[2400px]:w-[320px]
            min-[2400px]:gap-4
            min-[2400px]:px-5
            min-[2400px]:py-3
        `,

        musicIcon: `
            size-5
            shrink-0
            text-pink-500

            min-[1800px]:size-[21px]

            min-[2400px]:size-[22px]
        `,

        trackInfo: `
            min-w-0
            flex-1
        `,

        title: `
            pointer-events-none
            truncate

            text-sm
            font-medium

            text-white
            dark:text-black

            min-[1800px]:text-[15px]

            min-[2400px]:text-base
        `,

        artist: `
            pointer-events-none
            truncate

            text-xs

            text-white/70
            dark:text-black/60

            min-[1800px]:text-[13px]

            min-[2400px]:text-sm
        `,

        controlButton: `
            flex
            shrink-0
            items-center
            justify-center

            rounded-full
            p-1

            text-white

            transition-colors
            duration-100

            hover:bg-white/30

            disabled:cursor-default
            disabled:opacity-35

            dark:text-black
            dark:hover:bg-black/10

            min-[1800px]:p-1.5
        `,

        controlIcon: `
            size-4

            min-[1800px]:size-[17px]

            min-[2400px]:size-[18px]
        `,
    },
} as const;

export const DYNAMIC_ISLAND_MOTION = {
    bounce: {
        compactToMusic: 0.42,
        musicToCompact: 0.34,
        fallback: 0.4,
    },

    musicBarDelays: [0, 0.1, 0.2, 0.3] as const,

    autoCollapseDelayMs: 1000,

    islandMorphDurationSeconds: 0.25,
    contentMorphDurationSeconds: 0.23,

    exitToPillDelayMs: 130,
    exitShrinkDurationMs: 120,
} as const;
