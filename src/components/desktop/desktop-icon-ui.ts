export const DESKTOP_ICON_UI = {
    root: `
        group
        absolute
        z-10

        flex
        w-30
        select-none
        flex-col
        items-center

        outline-none

        min-[1800px]:w-32

        min-[2400px]:w-36
    `,

    responsiveScale: `
        origin-bottom

        transition-transform
        duration-150
        ease-out

        min-[1800px]:scale-[1.08]

        min-[2400px]:scale-[1.15]
    `,

    iconSurface: `
        flex
        h-fit
        w-fit
        flex-col
        items-center
        justify-center

        rounded-[18px]

        transition-[background-color,box-shadow,transform]
        duration-150
        ease-out

        group-hover:scale-[1.02]
    `,

    image: `
        pointer-events-none
        block
        shrink-0
        select-none
        object-contain

        drop-shadow-[0_5px_6px_rgba(0,0,0,0.16)]
    `,

    label: `
        whitespace-nowrap
        text-center

        text-[14px]
        font-bold
        leading-[22.4px]
        tracking-[-0.6px]

        text-black

        [text-shadow:0_1px_2px_rgba(255,255,255,0.65),0_1px_3px_rgba(0,0,0,0.12)]

        dark:text-[#f7f7f7]
        dark:[text-shadow:0_1px_3px_rgba(0,0,0,0.75)]

        min-[1800px]:text-[15px]
        min-[1800px]:leading-6

        min-[2400px]:text-[16px]
        min-[2400px]:leading-7
    `,

    dragArea: `
        pointer-events-none
        absolute
        inset-x-0
        bottom-28
        top-20
        z-10

        overflow-hidden

        min-[1800px]:bottom-32
        min-[1800px]:top-24

        min-[2400px]:bottom-36
        min-[2400px]:top-28
    `,
} as const;
