export const DOCK_CONFIG = {
    iconSize: 54,
    iconMagnification: 72,
    iconDistance: 130,
} as const;

export const DOCK_UI = {
    position: `
        pointer-events-none

        fixed
        inset-x-0
        bottom-12
        z-50

        flex
        justify-center

        px-4

        min-[1800px]:bottom-14

        min-[2400px]:bottom-16
    `,

    dock: `
        pointer-events-auto

        h-19

        origin-bottom

        gap-2.5

        rounded-[24px]

        px-3
        py-2.5

        bg-white/10!
        dark:bg-white/10!

        border!
        border-white/20!

        ring-1
        ring-white/10

        shadow-lg!
        shadow-black/10!

        transition-transform
        duration-150
        ease-out

        min-[1800px]:scale-[1.08]

        min-[2400px]:scale-[1.15]
    `,

    icon: `
        rounded-[15px]
    `,

    separator: `
        mx-0.75

        h-11
        w-[1.5px]

        shrink-0
        self-center

        bg-black

        dark:bg-white/90
    `,
} as const;