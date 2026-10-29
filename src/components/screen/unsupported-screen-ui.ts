export const UNSUPPORTED_SCREEN_UI = {
    root: `
        relative
        h-dvh
        w-full
        overflow-hidden
        bg-background
        font-sans
        text-foreground
    `,

    theme: {
        position: `
            absolute
            right-5
            top-5
            z-20

            min-[420px]:right-6
            min-[420px]:top-6

            [@media(max-height:560px)]:right-4
            [@media(max-height:560px)]:top-4
        `,

        wrapper: `
            pointer-events-auto

            flex
            size-8
            items-center
            justify-center

            rounded-full

            border
            border-foreground/10

            bg-background/80

            shadow-sm

            backdrop-blur-sm

            [@media(max-height:560px)]:size-7
        `,

        button: `
            flex
            size-8
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
            [&_svg]:size-[14px]

            [@media(max-height:560px)]:size-7
            [@media(max-height:560px)]:[&_svg]:size-[13px]
        `,
    },

    layout: `
        mx-auto

        flex
        h-dvh
        min-h-0
        w-full
        max-w-[680px]
        items-center
        justify-center

        px-5
        py-8

        min-[420px]:px-6

        min-[560px]:px-8

        [@media(min-height:700px)]:py-12
        [@media(min-height:800px)]:py-16
        [@media(min-height:900px)]:py-20

        [@media(max-height:560px)]:py-3
    `,

    content: `
        flex
        max-h-full
        w-full
        flex-col
        items-center
        justify-center
        text-center
    `,

    hero: {
        iconWrapper: `
            flex
            size-12
            shrink-0
            items-center
            justify-center

            rounded-xl

            border
            border-foreground/10

            bg-foreground/[0.035]

            min-[420px]:size-14

            [@media(min-height:800px)]:size-16
            [@media(min-height:800px)]:rounded-2xl

            [@media(max-height:560px)]:size-10
            [@media(max-height:560px)]:rounded-lg
        `,

        icon: `
            size-6
            text-foreground/75

            min-[420px]:size-7

            [@media(min-height:800px)]:size-8

            [@media(max-height:560px)]:size-5
        `,

        heading: `
            mt-4

            max-w-md

            text-[22px]
            font-semibold
            leading-tight
            tracking-[-0.025em]

            min-[420px]:text-[24px]

            [@media(min-height:800px)]:mt-5
            [@media(min-height:800px)]:text-[26px]

            [@media(max-height:560px)]:mt-2.5
            [@media(max-height:560px)]:text-[20px]
        `,

        description: `
            mt-2.5

            max-w-[500px]

            text-[13px]
            leading-5
            text-foreground/60

            min-[420px]:text-[14px]

            [@media(min-height:800px)]:mt-3.5
            [@media(min-height:800px)]:text-[15px]
            [@media(min-height:800px)]:leading-6

            [@media(max-height:560px)]:mt-2
            [@media(max-height:560px)]:text-[12px]
            [@media(max-height:560px)]:leading-4
        `,
    },

    profile: {
        root: `
            mt-3
            mb-3
            text-center

            [@media(min-height:800px)]:mt-4
            [@media(min-height:800px)]:mb-5

            [@media(max-height:560px)]:mt-2
            [@media(max-height:560px)]:mb-2
        `,

        name: `
            text-[14px]
            font-semibold
            text-foreground

            min-[420px]:text-[15px]

            [@media(max-height:560px)]:text-[13px]
        `,

        role: `
            mt-0.5
            text-[11px]
            text-foreground/60

            min-[420px]:text-[12px]

            [@media(max-height:560px)]:text-[10px]
        `,
    },

    links: {
        nav: `
            mt-4

            flex
            items-center
            justify-center
            gap-2

            [@media(min-height:800px)]:mt-5

            [@media(max-height:560px)]:mt-2.5
        `,

        link: `
            inline-flex
            items-center

            rounded-lg

            border
            border-foreground/15

            px-3
            py-2

            text-[12px]
            font-medium
            text-foreground/75

            transition-colors
            duration-150

            hover:bg-foreground/5
            hover:text-foreground

            [@media(max-height:560px)]:px-2.5
            [@media(max-height:560px)]:py-1.5
            [@media(max-height:560px)]:text-[11px]
        `,
    },

    support: {
        section: `
            mt-6
            w-full

            [@media(min-height:700px)]:mt-7
            [@media(min-height:800px)]:mt-9
            [@media(min-height:900px)]:mt-10

            [@media(max-height:560px)]:mt-3
        `,

        label: `
            text-[10px]
            font-semibold
            uppercase
            tracking-[0.14em]
            text-foreground/35

            min-[420px]:text-[11px]

            [@media(max-height:560px)]:text-[9px]
        `,

        grid: `
            mt-3

            grid
            w-full
            grid-cols-1
            gap-2

            min-[420px]:gap-2.5

            min-[560px]:grid-cols-3
            min-[560px]:gap-3

            [@media(min-height:800px)]:mt-4

            [@media(max-height:560px)]:mt-2
            [@media(max-height:560px)]:gap-1.5
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

            px-3
            py-2.5

            text-left

            min-[420px]:px-3.5

            min-[560px]:flex-col
            min-[560px]:justify-center
            min-[560px]:gap-2
            min-[560px]:px-3
            min-[560px]:py-3
            min-[560px]:text-center

            [@media(min-height:800px)]:py-4

            [@media(max-height:560px)]:gap-2
            [@media(max-height:560px)]:px-2.5
            [@media(max-height:560px)]:py-2

            min-[560px]:[@media(max-height:560px)]:gap-1.5
            min-[560px]:[@media(max-height:560px)]:py-2
        `,

        iconWrapper: `
            flex
            size-8
            shrink-0
            items-center
            justify-center

            rounded-lg

            bg-foreground/[0.05]

            min-[560px]:size-9

            [@media(min-height:800px)]:size-10

            [@media(max-height:560px)]:size-7
        `,

        icon: `
            size-4
            text-foreground/65

            min-[560px]:size-[18px]

            [@media(min-height:800px)]:size-5

            [@media(max-height:560px)]:size-3.5
        `,

        info: `
            min-w-0
        `,

        device: `
            text-[12px]
            font-semibold
            text-foreground/85

            min-[560px]:text-[13px]

            [@media(min-height:800px)]:text-[14px]

            [@media(max-height:560px)]:text-[11px]
        `,

        size: `
            mt-0.5

            text-[10px]
            font-medium
            text-foreground/50

            min-[560px]:text-[11px]

            [@media(min-height:800px)]:text-[12px]

            [@media(max-height:560px)]:text-[9px]
        `,

        description: `
            mt-0.5

            text-[10px]
            leading-4
            text-foreground/35

            min-[560px]:mt-1
            min-[560px]:text-[11px]

            [@media(max-height:620px)]:hidden
        `,
    },

    footer: {
        root: `
            mt-4

            flex
            flex-col
            items-center

            gap-1

            text-[10px]
            leading-4
            text-foreground/35

            min-[420px]:text-[11px]

            [@media(min-height:700px)]:mt-6
            [@media(min-height:800px)]:mt-7
            [@media(min-height:900px)]:mt-8

            [@media(max-height:560px)]:mt-2
            [@media(max-height:480px)]:hidden

            [@media(max-height:620px)]:[&>span:last-child]:hidden
        `,

        minimum: `
            font-medium
            text-foreground/45

            [@media(max-height:560px)]:text-[9px]
        `,
    },
} as const;
