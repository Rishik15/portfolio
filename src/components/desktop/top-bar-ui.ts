export const TOP_BAR_UI = {
    root: `
        pointer-events-none
        absolute
        inset-x-0
        top-0
        z-40

        flex
        items-start
        justify-between

        px-10
        py-8

        font-mono

        text-black
        dark:text-white

        min-[1800px]:px-12
        min-[1800px]:py-10

        min-[2400px]:px-16
        min-[2400px]:py-12
    `,

    identity: {
        name: `
            text-[20px]
            font-semibold
            uppercase
            leading-none
            tracking-tight

            min-[1800px]:text-[22px]

            min-[2400px]:text-[24px]
        `,

        role: `
            mt-2

            text-[14px]
            font-normal
            uppercase
            leading-none
            tracking-[0.12em]

            min-[1800px]:mt-2.5
            min-[1800px]:text-[15px]

            min-[2400px]:mt-3
            min-[2400px]:text-[16px]
        `,
    },

    right: {
        root: `
            flex
            items-center

            gap-4

            leading-none

            min-[1800px]:gap-5

            min-[2400px]:gap-6
        `,

        themeWrapper: `
            pointer-events-auto

            flex
            size-4.5
            shrink-0
            items-center
            justify-center

            min-[1800px]:size-5

            min-[2400px]:size-[22px]
        `,

        themeButton: `
            relative
            -top-px

            flex
            size-4.5
            cursor-pointer
            items-center
            justify-center

            border-0
            bg-transparent
            p-0

            outline-none

            focus:outline-none
            focus-visible:outline-none

            [&_svg]:block
            [&_svg]:size-4.5

            min-[1800px]:size-5
            min-[1800px]:[&_svg]:size-5

            min-[2400px]:size-[22px]
            min-[2400px]:[&_svg]:size-[22px]
        `,
    },

    clock: {
        root: `
            flex
            items-center

            gap-3

            whitespace-nowrap

            font-mono
            text-[12px]
            font-medium
            uppercase
            tracking-[0.12em]

            min-[1800px]:gap-3.5
            min-[1800px]:text-[13px]

            min-[2400px]:gap-4
            min-[2400px]:text-[14px]
        `,
    },
} as const;
