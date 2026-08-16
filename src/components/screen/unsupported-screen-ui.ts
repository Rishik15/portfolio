export const UNSUPPORTED_SCREEN_UI = {
    root: `
        relative
        min-h-dvh
        w-full
        overflow-x-hidden
        bg-background
        font-sans
        text-foreground
    `,

    theme: {
        position: `
            absolute
            right-8
            top-8
            z-20

            sm:right-6
            sm:top-6
        `,

        wrapper: `
            pointer-events-auto

            flex
            size-9
            items-center
            justify-center

            rounded-full

            border
            border-foreground/10

            bg-background/80

            shadow-sm

            backdrop-blur-sm
        `,

        button: `
            flex
            size-9
            cursor-pointer
            items-center
            justify-center

            rounded-full

            border-0
            bg-transparent
            p-0

            text-foreground/70

            outline-none

            transition-colors
            duration-150

            hover:bg-foreground/[0.05]
            hover:text-foreground

            focus:outline-none
            focus-visible:outline-none

            [&_svg]:block
            [&_svg]:size-[17px]
        `,
    },

    layout: `
        mx-auto

        flex
        min-h-dvh
        w-full
        max-w-[680px]
        items-center
        justify-center

        px-5
        py-20

        min-[420px]:px-6

        min-[560px]:px-8
        min-[560px]:py-24
    `,

    content: `
        flex
        w-full
        flex-col
        items-center
        text-center
    `,

    hero: {
        iconWrapper: `
            flex
            size-14
            items-center
            justify-center

            rounded-2xl

            border
            border-foreground/10

            bg-foreground/[0.035]

            min-[420px]:size-16
        `,

        icon: `
            size-7
            text-foreground/75

            min-[420px]:size-8
        `,

        heading: `
            mt-5

            max-w-md

            text-[24px]
            font-semibold
            leading-tight
            tracking-[-0.025em]

            min-[420px]:mt-6
            min-[420px]:text-[26px]
        `,

        description: `
            mt-3

            max-w-[500px]

            text-[14px]
            leading-6
            text-foreground/60

            min-[420px]:mt-3.5
            min-[420px]:text-[15px]
            min-[420px]:leading-6
        `,
    },

    support: {
        section: `
            mt-8
            w-full

            min-[420px]:mt-9

            min-[560px]:mt-10
        `,

        label: `
            text-[10px]
            font-semibold
            uppercase
            tracking-[0.14em]
            text-foreground/35

            min-[420px]:text-[11px]
        `,

        grid: `
            mt-3

            grid
            w-full
            grid-cols-1
            gap-2

            min-[420px]:gap-2.5

            min-[560px]:mt-4
            min-[560px]:grid-cols-3
            min-[560px]:gap-3
        `,

        card: `
            flex
            min-w-0
            items-center

            gap-3

            rounded-xl

            border
            border-foreground/10

            bg-foreground/[0.025]

            px-3.5
            py-3

            text-left

            min-[420px]:px-4

            min-[560px]:flex-col
            min-[560px]:justify-center
            min-[560px]:gap-2.5
            min-[560px]:px-3
            min-[560px]:py-4
            min-[560px]:text-center
        `,

        iconWrapper: `
            flex
            size-9
            shrink-0
            items-center
            justify-center

            rounded-lg

            bg-foreground/[0.05]

            min-[560px]:size-10
        `,

        icon: `
            size-[18px]
            text-foreground/65

            min-[560px]:size-5
        `,

        info: `
            min-w-0
        `,

        device: `
            text-[13px]
            font-semibold
            text-foreground/85

            min-[560px]:text-[14px]
        `,

        size: `
            mt-0.5

            text-[11px]
            font-medium
            text-foreground/50

            min-[560px]:text-[12px]
        `,

        description: `
            mt-0.5

            text-[10px]
            leading-4
            text-foreground/35

            min-[560px]:mt-1
            min-[560px]:text-[11px]
        `,
    },

    footer: {
        root: `
            mt-6

            flex
            flex-col
            items-center

            gap-1

            text-[10px]
            leading-4
            text-foreground/35

            min-[420px]:mt-7
            min-[420px]:text-[11px]

            min-[560px]:mt-8
        `,

        minimum: `
            font-medium
            text-foreground/45
        `,
    },
} as const;
