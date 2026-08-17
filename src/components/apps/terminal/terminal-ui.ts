export const TERMINAL_UI = {
    root: `
        @container/terminal

        h-full
        w-full

        cursor-text

        overflow-x-hidden
        overflow-y-auto

        p-3

        font-mono
        text-[12px]
        leading-5
        text-foreground

        selection:bg-foreground/15

        @min-[760px]/terminal:p-4
        @min-[760px]/terminal:text-[13px]

        @min-[1200px]/terminal:p-5
        @min-[1200px]/terminal:text-[14px]

        @min-[1440px]/terminal:p-6
        @min-[1440px]/terminal:text-[15px]
        @min-[1440px]/terminal:leading-6

        @min-[1680px]/terminal:text-[16px]
    `,

    output: {
        root: `
            w-full
        `,

        textResult: `
            text-foreground/55
        `,

        entry: `
            w-full
        `,

        commandRow: `
            flex
            min-w-0
            items-center

            gap-1.5

            @min-[760px]/terminal:gap-2

            @min-[1440px]/terminal:gap-2.5
        `,

        result: `
            mt-2
            w-full

            @min-[1440px]/terminal:mt-2.5
        `,

        entriesWithWelcome: `
            mt-2
            space-y-2

            @min-[1440px]/terminal:mt-3
            @min-[1440px]/terminal:space-y-3
        `,

        entries: `
            space-y-2

            @min-[1440px]/terminal:space-y-3
        `,

        inputWithContent: `
            mt-2
            w-full

            @min-[1440px]/terminal:mt-3
        `,

        input: `
            w-full
        `,
    },

    prompt: {
        root: `
            flex
            shrink-0
            items-center
            whitespace-nowrap
        `,

        user: `
            font-medium
            text-red-400

            dark:text-red-400
        `,

        symbol: `
            ml-1
            text-foreground/90
        `,
    },

    input: {
        root: `
            w-full
        `,

        form: `
            flex
            w-full
            min-w-0
            items-center

            gap-1.5

            @min-[760px]/terminal:gap-2

            @min-[1440px]/terminal:gap-2.5
        `,

        fieldWrapper: `
            relative
            min-w-0
            flex-1
        `,

        field: `
            w-full
            min-w-0

            bg-transparent
            p-0

            font-[inherit]
            text-inherit
            text-foreground

            caret-transparent

            outline-none
        `,

        caret: `
            pointer-events-none

            absolute
            top-1/2

            h-[1.25em]
            w-[0.85ch]

            -translate-y-1/2

            bg-foreground/60
            text-background

            leading-[1.25em]
        `,
    },

    suggestions: {
        root: `
            mt-2
            w-full

            border-y
            border-foreground/15

            py-1

            @min-[1440px]/terminal:mt-3
            @min-[1440px]/terminal:py-1.5
        `,

        row: `
            grid
            w-full
            min-w-0

            grid-cols-[7.5rem_minmax(0,1fr)]

            gap-3

            px-2.5
            py-1.5

            text-left

            transition-colors
            duration-100

            @min-[760px]/terminal:grid-cols-[10rem_minmax(0,1fr)]
            @min-[760px]/terminal:gap-4
            @min-[760px]/terminal:px-3

            @min-[1200px]/terminal:grid-cols-[12rem_minmax(0,1fr)]
            @min-[1200px]/terminal:px-4
            @min-[1200px]/terminal:py-2

            @min-[1440px]/terminal:grid-cols-[13rem_minmax(0,1fr)]

            @min-[1680px]/terminal:grid-cols-[14rem_minmax(0,1fr)]
        `,

        command: `
            min-w-0
            font-medium
        `,

        description: `
            min-w-0
            text-foreground/55
        `,

        active: `
            bg-foreground/8
            text-foreground
        `,

        inactive: `
            text-foreground/55

            hover:bg-foreground/4
        `,

        hint: `
            border-t
            border-foreground/10

            px-2.5
            pt-1.5

            text-[10px]
            text-foreground/50

            @min-[760px]/terminal:px-3
            @min-[760px]/terminal:text-[11px]

            @min-[1200px]/terminal:px-4
            @min-[1200px]/terminal:pt-2
            @min-[1200px]/terminal:text-[12px]

            @min-[1440px]/terminal:text-[13px]

            @min-[1680px]/terminal:text-[14px]
        `,
    },

    welcome: {
        root: `
            w-full

            border
            border-foreground/25
        `,

        body: `
            px-3
            py-2.5

            @min-[760px]/terminal:px-4
            @min-[760px]/terminal:py-3

            @min-[1200px]/terminal:px-5
            @min-[1200px]/terminal:py-3.5

            @min-[1440px]/terminal:px-6
            @min-[1440px]/terminal:py-4
        `,

        title: `
            text-[13px]
            font-medium
            text-foreground/90

            @min-[760px]/terminal:text-[14px]

            @min-[1200px]/terminal:text-[15px]

            @min-[1440px]/terminal:text-[16px]

            @min-[1680px]/terminal:text-[17px]
        `,

        helpRow: `
            border-t
            border-foreground/10

            px-3
            py-2

            @min-[760px]/terminal:px-4

            @min-[1200px]/terminal:px-5

            @min-[1440px]/terminal:px-6
            @min-[1440px]/terminal:py-2.5
        `,

        muted: `
            text-foreground/65
        `,

        command: `
            mx-1.5
            font-semibold
            text-foreground/90

            @min-[1440px]/terminal:mx-2
        `,
    },

    help: {
        root: `
            w-full

            border
            border-foreground/25

            bg-background/20
        `,

        header: `
            grid

            grid-cols-[7.5rem_minmax(0,1fr)]

            gap-3

            border-b
            border-foreground/15

            px-3
            py-1.5

            text-[9px]
            uppercase
            tracking-[0.14em]
            text-foreground/55

            @min-[760px]/terminal:grid-cols-[12rem_minmax(0,1fr)]
            @min-[760px]/terminal:gap-4
            @min-[760px]/terminal:px-4
            @min-[760px]/terminal:py-1
            @min-[760px]/terminal:text-[10px]
            @min-[760px]/terminal:tracking-[0.16em]

            @min-[1200px]/terminal:grid-cols-[13rem_minmax(0,1fr)]
            @min-[1200px]/terminal:px-5

            @min-[1440px]/terminal:grid-cols-[14rem_minmax(0,1fr)]
            @min-[1440px]/terminal:px-6
            @min-[1440px]/terminal:py-1.5
            @min-[1440px]/terminal:text-[11px]

            @min-[1680px]/terminal:grid-cols-[15rem_minmax(0,1fr)]
            @min-[1680px]/terminal:text-[12px]
        `,

        body: `
            mt-1

            px-1.5
            pb-1.5

            @min-[760px]/terminal:px-2
            @min-[760px]/terminal:pb-2

            @min-[1200px]/terminal:px-2.5
            @min-[1200px]/terminal:pb-2.5

            @min-[1440px]/terminal:mt-1.5
            @min-[1440px]/terminal:px-3
        `,

        row: `
            grid

            grid-cols-[7.5rem_minmax(0,1fr)]

            items-center
            gap-3

            px-2
            py-1.5

            @min-[760px]/terminal:grid-cols-[12rem_minmax(0,1fr)]
            @min-[760px]/terminal:gap-4

            @min-[1200px]/terminal:grid-cols-[13rem_minmax(0,1fr)]
            @min-[1200px]/terminal:px-2.5

            @min-[1440px]/terminal:grid-cols-[14rem_minmax(0,1fr)]
            @min-[1440px]/terminal:px-3
            @min-[1440px]/terminal:py-2

            @min-[1680px]/terminal:grid-cols-[15rem_minmax(0,1fr)]
        `,

        command: `
            min-w-0
            font-medium
            text-foreground/90
        `,

        description: `
            min-w-0
            text-foreground/50
        `,

        footer: `
            grid
            grid-cols-1

            gap-1.5

            border-t
            border-foreground/15

            px-3
            py-2

            text-[9px]
            text-foreground/35

            @min-[700px]/terminal:grid-cols-3
            @min-[700px]/terminal:gap-3

            @min-[760px]/terminal:px-4
            @min-[760px]/terminal:py-2.5
            @min-[760px]/terminal:text-[10px]

            @min-[1200px]/terminal:gap-4
            @min-[1200px]/terminal:px-5
            @min-[1200px]/terminal:text-[11px]

            @min-[1440px]/terminal:gap-5
            @min-[1440px]/terminal:px-6
            @min-[1440px]/terminal:py-3
            @min-[1440px]/terminal:text-[12px]

            @min-[1680px]/terminal:text-[13px]
        `,

        footerItem: `
            flex
            min-w-0
            items-center

            gap-2
        `,

        footerKey: `
            shrink-0
            text-foreground/60
        `,
    },

    skills: {
        root: `
            w-full

            border
            border-foreground/25

            bg-background/20
        `,

        body: `
            px-1.5
            py-1.5

            @min-[760px]/terminal:px-2
            @min-[760px]/terminal:py-2

            @min-[1200px]/terminal:px-2.5
            @min-[1200px]/terminal:py-2.5

            @min-[1440px]/terminal:px-3
            @min-[1440px]/terminal:py-3
        `,

        row: `
            grid

            grid-cols-[8rem_minmax(0,1fr)]

            items-start
            gap-3

            px-2
            py-1.5

            transition-colors
            duration-100

            hover:bg-foreground/[0.035]

            @min-[760px]/terminal:grid-cols-[10.5rem_minmax(0,1fr)]
            @min-[760px]/terminal:gap-4
            @min-[760px]/terminal:py-2

            @min-[1200px]/terminal:grid-cols-[11.5rem_minmax(0,1fr)]
            @min-[1200px]/terminal:px-2.5

            @min-[1440px]/terminal:grid-cols-[12.5rem_minmax(0,1fr)]
            @min-[1440px]/terminal:px-3
            @min-[1440px]/terminal:py-2.5

            @min-[1680px]/terminal:grid-cols-[13.5rem_minmax(0,1fr)]
        `,

        categoryWrapper: `
            flex
            min-w-0
            items-center

            gap-1.5

            @min-[760px]/terminal:gap-2

            @min-[1440px]/terminal:gap-2.5
        `,

        dot: `
            size-1.5
            shrink-0

            bg-blue-500/75

            dark:bg-blue-400/75

            @min-[1440px]/terminal:size-[7px]

            @min-[1680px]/terminal:size-2
        `,

        category: `
            min-w-0

            text-[10px]
            font-medium
            text-blue-600/85

            dark:text-blue-400/85

            @min-[760px]/terminal:text-[11px]

            @min-[1200px]/terminal:text-[12px]

            @min-[1440px]/terminal:text-[13px]

            @min-[1680px]/terminal:text-[14px]
        `,

        skillList: `
            flex
            min-w-0
            flex-wrap
            items-center

            gap-x-1.5
            gap-y-1

            @min-[760px]/terminal:gap-x-2

            @min-[1200px]/terminal:gap-x-2.5

            @min-[1440px]/terminal:gap-x-3
            @min-[1440px]/terminal:gap-y-1.5
        `,

        skillWrapper: `
            flex
            items-center

            gap-1.5

            @min-[760px]/terminal:gap-2
        `,

        separator: `
            text-[9px]
            text-foreground/25

            @min-[1200px]/terminal:text-[10px]

            @min-[1440px]/terminal:text-[11px]

            @min-[1680px]/terminal:text-[12px]
        `,

        skill: `
            text-foreground/80
        `,
    },

    certificates: {
        root: `
            w-full
            py-1

            font-mono
            leading-6

            @min-[1440px]/terminal:py-1.5

            @min-[1680px]/terminal:leading-7
        `,

        heading: `
            text-blue-500/80

            dark:text-blue-400/80
        `,

        certificateLine: `
            grid
            grid-cols-[4ch_minmax(0,1fr)]
        `,

        detailLine: `
            grid

            grid-cols-[7ch_5.75rem_minmax(0,1fr)]

            @min-[760px]/terminal:grid-cols-[7ch_7rem_minmax(0,1fr)]

            @min-[1200px]/terminal:grid-cols-[7ch_8rem_minmax(0,1fr)]

            @min-[1440px]/terminal:grid-cols-[7ch_9rem_minmax(0,1fr)]
        `,

        branch: `
            select-none
            whitespace-pre
            text-foreground/25
        `,

        certificateName: `
            min-w-0
            text-foreground/95
        `,

        detailLabel: `
            select-none
            text-foreground/55
        `,

        credentialLabel: `
            select-none
            text-foreground/35
        `,

        detailValue: `
            min-w-0
            text-foreground/75
        `,

        credentialLink: `
            w-fit

            text-blue-500/80

            transition-colors
            duration-100

            hover:text-blue-500

            dark:text-blue-400/80
            dark:hover:text-blue-400
        `,
    },
} as const;

export const TERMINAL_MOTION = {
    certificateLineDelaySeconds: 0.04,
    certificateLineDurationSeconds: 0.01,
} as const;
