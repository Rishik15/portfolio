export const MUSIC_UI = {
    root: `
        @container/music
        grid
        h-full
        min-h-0
        grid-rows-[minmax(0,1fr)_auto]
        overflow-hidden

        bg-white
        text-foreground

        dark:bg-[#1c1c1c]
    `,

    body: `
        flex
        min-h-0
        flex-col

        @min-[640px]/music:flex-row
    `,

    sidebar: {
        root: `
            hidden
            shrink-0

            border-r
            border-black/8
            bg-[#f1f1f1]
            px-2.5
            py-4

            dark:border-white/10
            dark:bg-[#262626]

            @min-[640px]/music:block
            @min-[640px]/music:w-[168px]

            @min-[900px]/music:w-[200px]
        `,

        heading: `
            mb-2
            px-2

            text-[11px]
            font-medium
            uppercase
            tracking-[0.08em]
            text-neutral-600

            dark:text-neutral-400
        `,

        item: `
            flex
            h-11
            w-full
            items-center
            gap-2.5

            rounded-lg
            px-2
            text-left

            transition-colors
            duration-100

            hover:bg-black/5
            active:bg-black/10

            focus-visible:outline-none
            focus-visible:ring-2
            focus-visible:ring-ring

            dark:hover:bg-white/8
            dark:active:bg-white/15
        `,

        itemActive: `
            bg-black/8
            dark:bg-white/12
        `,

        thumb: `
            size-8
            shrink-0
            rounded-md
            bg-muted
            object-cover
        `,

        title: `
            truncate
            text-[13px]
            font-medium
        `,

        artist: `
            truncate
            text-[11px]
            text-neutral-600

            dark:text-neutral-400
        `,

        chips: `
            flex
            shrink-0
            gap-2
            overflow-x-auto
            px-4
            pt-3

            @min-[640px]/music:hidden
        `,

        chip: `
            shrink-0
            rounded-full
            border
            border-border
            px-3
            py-1

            text-[12px]
            font-medium

            focus-visible:outline-none
            focus-visible:ring-2
            focus-visible:ring-ring
        `,

        chipActive: `
            bg-foreground
            text-background
        `,
    },

    main: `
        min-h-0
        min-w-0
        flex-1
        overflow-y-auto
    `,

    header: {
        root: `
            flex
            gap-5
            px-6
            pt-6
            pb-4
        `,

        cover: `
            flex
            size-36
            shrink-0
            items-center
            justify-center

            rounded-xl
            border
            border-black/10
            bg-muted
            object-cover

            dark:border-white/10

            @min-[900px]/music:size-44
        `,

        info: `
            flex
            min-w-0
            flex-col
            justify-end
        `,

        eyebrow: `
            text-[11px]
            uppercase
            tracking-[0.08em]
            text-muted-foreground
        `,

        title: `
            line-clamp-2

            text-2xl
            font-semibold
            leading-tight
            tracking-tight

            @min-[900px]/music:text-3xl
        `,

        meta: `
            mt-1
            text-[13px]
            text-muted-foreground
        `,

        actions: `
            mt-3
            flex
            gap-2
        `,

        playButton: `
            flex
            h-9
            items-center
            gap-1.5

            rounded-full
            bg-foreground
            px-4

            text-[13px]
            font-medium
            text-background

            transition-opacity
            duration-100

            hover:opacity-85

            focus-visible:outline-none
            focus-visible:ring-2
            focus-visible:ring-ring
            focus-visible:ring-offset-2
        `,
    },

    iconButton: `
        flex
        size-8
        shrink-0
        items-center
        justify-center

        rounded-full
        transition-colors
        duration-100

        hover:bg-black/6
        active:bg-black/10
        disabled:cursor-default
        disabled:opacity-35

        focus-visible:outline-none
        focus-visible:ring-2
        focus-visible:ring-ring

        dark:hover:bg-white/10
        dark:active:bg-white/15
    `,

    iconButtonOn: `
        text-pink-600
        dark:text-pink-400
    `,

    stickyBar: `
        sticky
        top-0
        z-10

        bg-white

        dark:bg-[#1c1c1c]
    `,

    search: {
        root: `
            px-6
            py-2
        `,

        field: `
            relative
            max-w-[280px]
        `,

        input: `
            block
            h-9
            w-full

            rounded-full
            bg-black/5
            pr-8
            pl-9

            text-[13px]
            placeholder:text-muted-foreground

            focus-visible:outline-none
            focus-visible:ring-2
            focus-visible:ring-ring

            dark:bg-white/8
        `,

        icon: `
            pointer-events-none
            absolute
            top-1/2
            left-3
            size-4
            -translate-y-1/2
            text-muted-foreground
        `,

        clear: `
            absolute
            top-1/2
            right-2
            flex
            size-5
            -translate-y-1/2
            items-center
            justify-center

            rounded-full
            text-muted-foreground

            hover:text-foreground
        `,
    },

    table: {
        columns: `
            grid
            grid-cols-[32px_minmax(0,1fr)_48px]
            items-center
            gap-x-3

            @min-[640px]/music:grid-cols-[32px_minmax(0,2fr)_minmax(0,1.2fr)_56px]
        `,

        head: `
            h-8
            px-6

            border-b
            border-border

            text-[11px]
            uppercase
            tracking-[0.08em]
            text-muted-foreground
        `,

        row: `
            group
            mx-3
            h-12
            w-[calc(100%-1.5rem)]
            px-3

            rounded-lg
            text-left
            text-[13px]

            transition-colors
            duration-100

            hover:bg-black/4
            active:bg-black/8

            focus-visible:outline-none
            focus-visible:ring-2
            focus-visible:ring-inset
            focus-visible:ring-ring

            dark:hover:bg-white/6
            dark:active:bg-white/10
        `,

        currentText: `
            text-pink-600
            dark:text-pink-400
        `,

        number: `
            tabular-nums
            text-muted-foreground
        `,

        artist: `
            hidden
            truncate
            text-muted-foreground

            @min-[640px]/music:block
        `,

        subArtist: `
            truncate
            text-[11px]
            text-muted-foreground

            @min-[640px]/music:hidden
        `,

        duration: `
            text-right
            tabular-nums
            text-muted-foreground
        `,
    },

    bars: {
        root: `
            flex
            h-3
            items-end
            gap-[2px]
        `,

        bar: `
            h-3
            w-[2px]
            origin-bottom
            rounded-full
            bg-pink-600

            dark:bg-pink-400
        `,
    },

    state: {
        root: `
            flex
            flex-col
            items-center
            justify-center
            gap-2

            px-6
            py-16
            text-center
        `,

        icon: `
            size-8
            text-muted-foreground
        `,

        title: `
            text-[15px]
            font-medium
        `,

        text: `
            max-w-xs
            text-[13px]
            text-muted-foreground
        `,

        action: `
            mt-2
            h-9
            rounded-full
            border
            border-border
            px-4

            text-[13px]
            font-medium

            hover:bg-black/5

            focus-visible:outline-none
            focus-visible:ring-2
            focus-visible:ring-ring

            dark:hover:bg-white/10
        `,

        skeleton: `
            rounded
            bg-muted
            motion-safe:animate-pulse
        `,

        banner: `
            mx-6
            mb-2
            rounded-lg
            bg-amber-50
            px-3
            py-1.5

            text-[12px]
            text-amber-900

            dark:bg-amber-950
            dark:text-amber-200
        `,
    },

    nowPlaying: {
        root: `
            grid
            grid-cols-1
            items-center
            gap-2

            border-t
            border-black/10
            bg-[#f7f7f7]
            px-4
            py-3

            dark:border-white/10
            dark:bg-[#232323]

            @min-[640px]/music:h-[72px]
            @min-[640px]/music:grid-cols-[minmax(0,1fr)_minmax(0,2fr)_minmax(0,1fr)]
            @min-[640px]/music:gap-4
            @min-[640px]/music:py-0
        `,

        info: `
            flex
            min-w-0
            items-center
            gap-3
        `,

        cover: `
            flex
            size-11
            shrink-0
            items-center
            justify-center

            rounded-md
            bg-muted
            object-cover
        `,

        transport: `
            flex
            items-center
            justify-center
            gap-2
        `,

        center: `
            mx-auto
            flex
            w-full
            max-w-[520px]
            flex-col
            gap-1.5
        `,

        mainButton: `
            flex
            size-9
            items-center
            justify-center

            rounded-full
            bg-foreground
            text-background

            transition-opacity
            duration-100

            hover:opacity-85
            disabled:opacity-35

            focus-visible:outline-none
            focus-visible:ring-2
            focus-visible:ring-ring
            focus-visible:ring-offset-2
        `,

        seekRow: `
            flex
            h-3.5
            items-center
            gap-2
            leading-none

            text-[11px]
            tabular-nums
            text-neutral-600

            dark:text-neutral-400
        `,

        time: `
            w-9
            shrink-0
        `,

        volume: `
            hidden
            items-center
            justify-end
            gap-2
            pr-1.5

            @min-[640px]/music:flex
        `,
    },

    slider: `
        block
        h-1
        w-full
        cursor-pointer
        appearance-none
        rounded-full

        [&::-moz-range-thumb]:size-3
        [&::-moz-range-thumb]:rounded-full
        [&::-moz-range-thumb]:border-0
        [&::-moz-range-thumb]:bg-foreground

        [&::-webkit-slider-thumb]:size-3
        [&::-webkit-slider-thumb]:appearance-none
        [&::-webkit-slider-thumb]:rounded-full
        [&::-webkit-slider-thumb]:bg-foreground

        focus-visible:outline-none
        focus-visible:ring-2
        focus-visible:ring-ring
        focus-visible:ring-offset-4

        disabled:cursor-default
        disabled:opacity-35
    `,
} as const;
