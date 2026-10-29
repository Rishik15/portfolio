export const EXPERIENCE_SIDEBAR = {
    minWidth: 190,
    maxWidth: 420,

    getMinDetailWidth(windowWidth: number) {
        if (windowWidth >= 1440) {
            return 700;
        }

        if (windowWidth >= 1280) {
            return 650;
        }

        if (windowWidth >= 1150) {
            return 600;
        }

        if (windowWidth >= 900) {
            return 500;
        }

        if (windowWidth >= 760) {
            return 420;
        }

        return 360;
    },
} as const;

export const EXPERIENCE_UI = {
    root: `
        @container/experience
        flex
        h-full
        min-h-0
        w-full
        flex-col
        overflow-hidden
        bg-background
        text-foreground
    `,

    main: `
        flex
        min-h-0
        flex-1
        overflow-hidden
    `,

    sidebar: {
        root: `
            @container/experience-sidebar
            relative
            flex
            h-full
            min-w-[190px]
            shrink-0
            flex-col

            border-r
            border-foreground/10
            bg-foreground/[0.025]

            w-[210px]
            max-w-[calc(100%_-_360px)]

            @min-[760px]/experience:w-[240px]
            @min-[760px]/experience:max-w-[calc(100%_-_420px)]

            @min-[900px]/experience:w-[270px]
            @min-[900px]/experience:max-w-[calc(100%_-_500px)]

            @min-[1150px]/experience:w-[290px]
            @min-[1150px]/experience:max-w-[calc(100%_-_600px)]

            @min-[1280px]/experience:w-[310px]
            @min-[1280px]/experience:max-w-[calc(100%_-_650px)]

            @min-[1440px]/experience:w-[325px]
            @min-[1440px]/experience:max-w-[calc(100%_-_700px)]
        `,

        scroller: `
            min-h-0
            flex-1
            overflow-y-auto

            py-1.5

            @min-[280px]/experience-sidebar:py-2
            @min-[320px]/experience-sidebar:py-2.5
        `,

        content: `
            px-1.5

            @min-[240px]/experience-sidebar:px-2

            @min-[280px]/experience-sidebar:px-2.5

            @min-[320px]/experience-sidebar:px-3
        `,

        yearButton: `
            flex
            h-8
            w-full
            items-center

            gap-1.5
            rounded-md
            px-1.5

            text-left
            text-[12px]
            text-foreground/90

            transition-colors
            duration-100

            hover:bg-foreground/[0.055]
            hover:text-foreground

            @min-[240px]/experience-sidebar:text-[13px]

            @min-[280px]/experience-sidebar:h-9
            @min-[280px]/experience-sidebar:px-2
            @min-[280px]/experience-sidebar:text-[14px]

            @min-[320px]/experience-sidebar:h-10
            @min-[320px]/experience-sidebar:px-2.5
            @min-[320px]/experience-sidebar:text-[15px]
        `,

        chevron: `
            size-3.5
            shrink-0
            text-foreground/65

            transition-transform
            duration-150

            @min-[280px]/experience-sidebar:size-4

            @min-[320px]/experience-sidebar:size-[18px]
        `,

        folderIcon: `
            size-4
            shrink-0
            text-foreground/75

            @min-[280px]/experience-sidebar:size-[18px]

            @min-[320px]/experience-sidebar:size-5
        `,

        yearCount: `
            ml-auto
            shrink-0
            pr-1

            text-[9px]
            tabular-nums
            text-foreground/50

            @min-[240px]/experience-sidebar:text-[10px]

            @min-[280px]/experience-sidebar:text-[11px]

            @min-[320px]/experience-sidebar:text-[12px]
        `,

        experienceList: `
            flex
            flex-col
            gap-0.5
            pb-1
            pl-4

            @min-[240px]/experience-sidebar:gap-1
            @min-[240px]/experience-sidebar:pl-5

            @min-[280px]/experience-sidebar:pl-6

            @min-[320px]/experience-sidebar:gap-1.5
            @min-[320px]/experience-sidebar:pl-7
        `,

        experienceButton: `
            flex
            min-h-9
            w-full
            items-center

            rounded-md
            px-2.5
            py-1.5

            text-left

            transition-colors
            duration-100

            @min-[240px]/experience-sidebar:px-4
            @min-[240px]/experience-sidebar:py-2

            @min-[280px]/experience-sidebar:min-h-10

            @min-[320px]/experience-sidebar:min-h-11
            @min-[320px]/experience-sidebar:px-4.5
            @min-[320px]/experience-sidebar:py-2.5
        `,

        selectedExperience: `
            bg-foreground/10
            text-foreground
        `,

        inactiveExperience: `
            text-foreground/80

            hover:bg-foreground/[0.05]
            hover:text-foreground
        `,

        role: `
            truncate

            text-[11px]
            font-medium

            @min-[240px]/experience-sidebar:text-[12px]

            @min-[280px]/experience-sidebar:text-[13px]

            @min-[320px]/experience-sidebar:text-[14px]
        `,

        company: `
            truncate

            text-[10px]
            text-foreground/75

            @min-[240px]/experience-sidebar:text-[11px]

            @min-[280px]/experience-sidebar:text-[12px]

            @min-[320px]/experience-sidebar:text-[13px]
        `,

        empty: `
            px-2
            py-1
        `,

        emptyRow: `
            flex
            h-8
            items-center
            gap-2
            rounded-md
            px-2

            @min-[280px]/experience-sidebar:h-9

            @min-[320px]/experience-sidebar:h-10
        `,

        resizer: `
            group
            absolute
            right-[-3px]
            top-0
            z-20

            h-full
            w-[6px]

            cursor-col-resize
            touch-none
        `,

        resizerLine: `
            absolute
            right-[2px]
            top-0

            h-full
            w-px

            bg-transparent

            transition-colors
            duration-100

            group-hover:bg-foreground/20
            group-active:bg-foreground/30
        `,
    },

    detail: {
        root: `
            @container/experience-detail
            min-h-0
            min-w-0
            flex-1
            overflow-y-auto
        `,

        content: `
            mx-auto
            w-full
            max-w-[860px]

            px-4
            py-5

            @min-[420px]/experience-detail:px-5
            @min-[420px]/experience-detail:py-6

            @min-[560px]/experience-detail:px-8
            @min-[560px]/experience-detail:py-8

            @min-[760px]/experience-detail:max-w-[900px]
            @min-[760px]/experience-detail:px-10
            @min-[760px]/experience-detail:py-10

            @min-[900px]/experience-detail:max-w-[940px]
            @min-[900px]/experience-detail:px-12
            @min-[900px]/experience-detail:py-12

            @min-[1050px]/experience-detail:max-w-[980px]
            @min-[1050px]/experience-detail:px-14
            @min-[1050px]/experience-detail:py-14
        `,

        role: `
            text-[18px]
            font-semibold
            leading-tight
            tracking-[-0.02em]
            text-foreground

            @min-[420px]/experience-detail:text-[19px]

            @min-[560px]/experience-detail:text-[20px]

            @min-[760px]/experience-detail:text-[24px]

            @min-[900px]/experience-detail:text-[26px]

            @min-[1050px]/experience-detail:text-[28px]
        `,

        companyRow: `
            mt-1
            flex
            min-w-0
            items-center
            gap-1.5

            text-[11px]
            text-foreground/75

            @min-[420px]/experience-detail:text-[12px]

            @min-[560px]/experience-detail:text-[13px]

            @min-[760px]/experience-detail:mt-1.5
            @min-[760px]/experience-detail:text-[14px]

            @min-[900px]/experience-detail:text-[15px]

            @min-[1050px]/experience-detail:text-[16px]
        `,

        companyIcon: `
            size-3
            shrink-0

            @min-[560px]/experience-detail:size-3.5

            @min-[760px]/experience-detail:size-4

            @min-[1050px]/experience-detail:size-[18px]
        `,

        externalIcon: `
            size-2.5
            shrink-0

            @min-[560px]/experience-detail:size-3

            @min-[760px]/experience-detail:size-3.5

            @min-[1050px]/experience-detail:size-4
        `,

        metadata: `
            mt-6
            grid
            grid-cols-1

            gap-x-6
            gap-y-4

            border-t
            border-foreground/10

            pt-5

            @min-[420px]/experience-detail:grid-cols-2
            @min-[420px]/experience-detail:gap-x-8

            @min-[560px]/experience-detail:mt-8
            @min-[560px]/experience-detail:gap-x-10
            @min-[560px]/experience-detail:gap-y-5
            @min-[560px]/experience-detail:pt-6

            @min-[760px]/experience-detail:grid-cols-3
            @min-[760px]/experience-detail:gap-x-8

            @min-[900px]/experience-detail:mt-9
            @min-[900px]/experience-detail:gap-x-12
            @min-[900px]/experience-detail:pt-7

            @min-[1050px]/experience-detail:mt-10
            @min-[1050px]/experience-detail:gap-x-14
            @min-[1050px]/experience-detail:pt-8
        `,

        label: `
            mb-1.5

            text-[9px]
            font-medium
            tracking-[0.08em]
            text-foreground/55

            @min-[560px]/experience-detail:text-[10px]

            @min-[760px]/experience-detail:text-[11px]

            @min-[900px]/experience-detail:text-[12px]

            @min-[1050px]/experience-detail:text-[13px]
        `,

        metadataValue: `
            flex
            min-w-0
            items-center
            gap-1.5

            text-[11px]
            text-foreground/85

            @min-[560px]/experience-detail:text-[12px]

            @min-[760px]/experience-detail:text-[13px]

            @min-[900px]/experience-detail:text-[14px]

            @min-[1050px]/experience-detail:text-[15px]
        `,

        metadataIcon: `
            size-3
            shrink-0
            text-foreground/60

            @min-[560px]/experience-detail:size-3.5

            @min-[760px]/experience-detail:size-4

            @min-[1050px]/experience-detail:size-[18px]
        `,

        section: `
            mt-6

            border-t
            border-foreground/10

            pt-5

            @min-[560px]/experience-detail:mt-8
            @min-[560px]/experience-detail:pt-6

            @min-[760px]/experience-detail:mt-10
            @min-[760px]/experience-detail:pt-7

            @min-[900px]/experience-detail:mt-11
            @min-[900px]/experience-detail:pt-8

            @min-[1050px]/experience-detail:mt-12
            @min-[1050px]/experience-detail:pt-9
        `,

        sectionTitle: `
            mb-3

            text-[9px]
            font-medium
            tracking-[0.08em]
            text-foreground/55

            @min-[560px]/experience-detail:text-[10px]

            @min-[760px]/experience-detail:mb-4
            @min-[760px]/experience-detail:text-[11px]

            @min-[900px]/experience-detail:text-[12px]

            @min-[1050px]/experience-detail:mb-5
            @min-[1050px]/experience-detail:text-[13px]
        `,

        summary: `
            max-w-3xl

            text-[12px]
            leading-5
            text-foreground/85

            @min-[560px]/experience-detail:text-[13px]
            @min-[560px]/experience-detail:leading-6

            @min-[760px]/experience-detail:text-[15px]
            @min-[760px]/experience-detail:leading-7

            @min-[900px]/experience-detail:text-[17px]
            @min-[900px]/experience-detail:leading-7

            @min-[1050px]/experience-detail:text-[18px]
            @min-[1050px]/experience-detail:leading-8
        `,

        highlights: `
            space-y-2.5

            @min-[560px]/experience-detail:space-y-3

            @min-[760px]/experience-detail:space-y-4

            @min-[900px]/experience-detail:space-y-4.5

            @min-[1050px]/experience-detail:space-y-5
        `,

        highlightRow: `
            flex
            items-start
            gap-2.5

            @min-[560px]/experience-detail:gap-3

            @min-[760px]/experience-detail:gap-3.5

            @min-[900px]/experience-detail:gap-4
        `,

        highlightDot: `
            mt-[7px]
            size-1
            shrink-0
            rounded-full
            bg-foreground/55

            @min-[760px]/experience-detail:mt-[9px]
            @min-[760px]/experience-detail:size-[5px]

            @min-[900px]/experience-detail:mt-[10px]
            @min-[900px]/experience-detail:size-1.5

            @min-[1050px]/experience-detail:mt-[12px]
        `,

        highlightText: `
            text-[12px]
            leading-5
            text-foreground/85

            @min-[560px]/experience-detail:text-[13px]
            @min-[560px]/experience-detail:leading-6

            @min-[760px]/experience-detail:text-[15px]
            @min-[760px]/experience-detail:leading-7

            @min-[900px]/experience-detail:text-[17px]
            @min-[900px]/experience-detail:leading-7

            @min-[1050px]/experience-detail:text-[18px]
            @min-[1050px]/experience-detail:leading-8
        `,

        technologies: `
            text-[11px]
            leading-5
            text-foreground/80

            @min-[560px]/experience-detail:text-[12px]

            @min-[760px]/experience-detail:text-[14px]
            @min-[760px]/experience-detail:leading-6

            @min-[900px]/experience-detail:text-[15px]
            @min-[900px]/experience-detail:leading-7

            @min-[1050px]/experience-detail:text-[16px]
        `,

        emptyLine: `
            h-2.5
            rounded-sm
            bg-foreground/[0.085]

            @min-[760px]/experience-detail:h-3

            @min-[900px]/experience-detail:h-3.5
        `,
    },

    status: {
        root: `
            flex
            h-9
            shrink-0
            items-center
            justify-between

            gap-3

            border-t
            border-foreground/10

            px-4

            text-[10px]
            text-foreground/55

            @min-[900px]/experience:px-8
            @min-[900px]/experience:text-[11px]

            @min-[1150px]/experience:h-10
            @min-[1150px]/experience:px-10
            @min-[1150px]/experience:text-[12px]

            @min-[1280px]/experience:h-11
            @min-[1280px]/experience:px-12
            @min-[1280px]/experience:text-[13px]

            @min-[1440px]/experience:h-12
            @min-[1440px]/experience:px-14
            @min-[1440px]/experience:text-[14px]
        `,

        stats: `
            flex
            shrink-0
            items-center
            gap-2

            tabular-nums
            text-foreground/60

            @min-[1150px]/experience:gap-2.5

            @min-[1280px]/experience:gap-3
        `,
    },
} as const;
