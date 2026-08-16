export const ABOUT_UI = {
    root: `
        @container/about
        min-h-full
        bg-transparent
        px-5
        py-5
        font-sans

        @min-[768px]/about:px-6
        @min-[768px]/about:py-6

        @min-[960px]/about:px-8
        @min-[960px]/about:py-8
    `,

    content: `
        mx-auto
        max-w-3xl
        space-y-5

        @min-[768px]/about:space-y-6

        @min-[960px]/about:space-y-8
    `,

    copy: {
        heading: `
            text-[24px]
            font-semibold
            tracking-tight
            text-foreground

            @min-[768px]/about:text-[28px]

            @min-[960px]/about:text-[30px]
        `,

        body: `
            mt-4
            max-w-2xl
            space-y-3

            text-[14px]
            leading-6
            text-foreground/75

            @min-[768px]/about:mt-5
            @min-[768px]/about:space-y-3.5
            @min-[768px]/about:text-[17px]
            @min-[768px]/about:leading-7

            @min-[960px]/about:mt-6
            @min-[960px]/about:space-y-4
            @min-[960px]/about:text-[18px]
            @min-[960px]/about:leading-7
        `,

        greeting: `
            font-medium
            text-foreground/90
        `,
    },

    map: {
        section: `
            border-t
            border-foreground/10
            pt-4

            @min-[768px]/about:pt-5

            @min-[960px]/about:pt-6
        `,

        header: `
            mb-3

            @min-[768px]/about:mb-4

            @min-[960px]/about:mb-5
        `,

        title: `
            text-[18px]
            font-semibold
            text-foreground

            @min-[768px]/about:text-[20px]

            @min-[960px]/about:text-[22px]
        `,

        location: `
            mt-1
            text-[14px]
            text-foreground/55

            @min-[768px]/about:text-[15px]

            @min-[960px]/about:text-[16px]
        `,

        frame: `
            h-59
            overflow-hidden
            rounded-xl
            border
            border-foreground/10

            @min-[768px]/about:h-[270px]

            @min-[960px]/about:h-[310px]
        `,
    },
} as const;
