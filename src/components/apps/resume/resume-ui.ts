export const RESUME_ASSET = {
    imageSrc: "/resume/resume.webp",
    pdfSrc: "/resume/resume.pdf",
    alt: "Rishik's Resume",
    downloadName: "Rishik-Resume.pdf",
    width: 1582,
    height: 2048,
    aspectRatio: "8.5 / 11",
} as const;

export const RESUME_ZOOM = {
    min: 50,
    max: 200,
    step: 25,
    default: 100,
} as const;

export const RESUME_UI = {
    root: `
        @container/resume
        relative
        h-full
        w-full
        overflow-hidden
        bg-foreground/4
    `,

    scroller: `
        h-full
        w-full
        overflow-auto

        p-3
        pb-18

        @2xl/resume:p-4
        @2xl/resume:pb-20

        @4xl/resume:p-5
        @4xl/resume:pb-22

        @6xl/resume:p-6
        @6xl/resume:pb-24

        @7xl/resume:p-8
        @7xl/resume:pb-28
    `,

    document: `
        relative
        mx-auto
        overflow-hidden
        bg-white
        shadow-sm
    `,

    loading: {
        wrapper: `
            absolute
            inset-0
            flex
            items-center
            justify-center
            gap-2
            bg-white
            font-medium
            text-black/35
        `,

        text: `
            text-[10px]

            @2xl/resume:text-[11px]

            @4xl/resume:text-[12px]

            @6xl/resume:text-[13px]

            @7xl/resume:text-[14px]
        `,

        spinner: `
            size-3.5
            shrink-0
            animate-spin
            rounded-full
            border-2
            border-black/10
            border-t-black/40

            motion-reduce:animate-none

            @4xl/resume:size-4

            @7xl/resume:size-[18px]
        `,
    },

    image: `
        absolute
        inset-0
        h-full
        w-full
        object-contain

        transition-opacity
        duration-175
        ease-out

        motion-reduce:transition-none
    `,

    controls: {
        position: `
            absolute
            z-10

            bottom-3
            left-3

            @2xl/resume:bottom-4
            @2xl/resume:left-4

            @6xl/resume:bottom-5
            @6xl/resume:left-5

            @7xl/resume:bottom-6
            @7xl/resume:left-6
        `,

        panel: `
            flex
            items-center
            overflow-hidden
            rounded-xl
            border
            border-foreground/10
            bg-background/95
            shadow-lg
        `,

        iconButton: `
            flex
            size-9
            items-center
            justify-center

            text-[17px]
            text-foreground/70

            transition-colors
            duration-100

            hover:bg-foreground/6
            hover:text-foreground

            disabled:pointer-events-none
            disabled:opacity-30

            @2xl/resume:size-10
            @2xl/resume:text-lg

            @6xl/resume:size-11
            @6xl/resume:text-[20px]

            @7xl/resume:size-12
            @7xl/resume:text-[21px]
        `,

        percentageButton: `
            h-9
            min-w-13
            border-x
            border-foreground/10
            px-2

            text-[10px]
            font-medium
            text-foreground/65

            transition-colors
            duration-100

            hover:bg-foreground/6
            hover:text-foreground

            @2xl/resume:h-10
            @2xl/resume:min-w-16
            @2xl/resume:px-3
            @2xl/resume:text-xs

            @6xl/resume:h-11
            @6xl/resume:min-w-18
            @6xl/resume:text-[13px]

            @7xl/resume:h-12
            @7xl/resume:min-w-20
            @7xl/resume:text-[14px]
        `,
    },

    download: {
        position: `
            absolute
            z-10

            right-3
            bottom-3

            @2xl/resume:right-4
            @2xl/resume:bottom-4

            @6xl/resume:right-5
            @6xl/resume:bottom-5

            @7xl/resume:right-6
            @7xl/resume:bottom-6
        `,

        button: `
            flex
            size-9
            items-center
            justify-center
            rounded-xl

            bg-foreground
            text-background
            shadow-lg

            transition-transform
            duration-150

            hover:scale-[1.03]
            active:scale-[0.98]

            @2xl/resume:h-10
            @2xl/resume:w-auto
            @2xl/resume:gap-2
            @2xl/resume:px-3.5

            @6xl/resume:h-11
            @6xl/resume:px-4

            @7xl/resume:h-12
            @7xl/resume:gap-2.5
            @7xl/resume:px-5
        `,

        icon: `
            size-4
            shrink-0

            @6xl/resume:size-4.5

            @7xl/resume:size-5
        `,

        label: `
            hidden
            whitespace-nowrap
            font-medium

            @2xl/resume:inline
            @2xl/resume:text-[11px]

            @4xl/resume:text-xs

            @6xl/resume:text-[13px]

            @7xl/resume:text-[14px]
        `,
    },
} as const;
