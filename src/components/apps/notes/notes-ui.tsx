export type NotesPaneWidths = {
    sidebar: number;
    list: number;
};

type NotesPaneRange = {
    preferred: number;
    min: number;
    max: number;
};

export type NotesPaneProfile = {
    minWindowWidth: number;
    sidebar: NotesPaneRange;
    list: NotesPaneRange;
    viewerMin: number;
};

export const NOTES_PANE_PROFILES: readonly NotesPaneProfile[] = [
    {
        minWindowWidth: 0,

        sidebar: {
            preferred: 108,
            min: 96,
            max: 132,
        },

        list: {
            preferred: 148,
            min: 138,
            max: 175,
        },

        viewerMin: 250,
    },

    {
        minWindowWidth: 620,

        sidebar: {
            preferred: 125,
            min: 105,
            max: 150,
        },

        list: {
            preferred: 165,
            min: 145,
            max: 205,
        },

        viewerMin: 280,
    },

    {
        minWindowWidth: 720,

        sidebar: {
            preferred: 150,
            min: 120,
            max: 190,
        },

        list: {
            preferred: 190,
            min: 170,
            max: 260,
        },

        viewerMin: 330,
    },

    {
        minWindowWidth: 960,

        sidebar: {
            preferred: 165,
            min: 130,
            max: 205,
        },

        list: {
            preferred: 215,
            min: 180,
            max: 290,
        },

        viewerMin: 400,
    },

    {
        minWindowWidth: 1200,

        sidebar: {
            preferred: 180,
            min: 140,
            max: 215,
        },

        list: {
            preferred: 235,
            min: 190,
            max: 310,
        },

        viewerMin: 500,
    },

    {
        minWindowWidth: 1440,

        sidebar: {
            preferred: 190,
            min: 145,
            max: 225,
        },

        list: {
            preferred: 255,
            min: 200,
            max: 330,
        },

        viewerMin: 620,
    },
];

export const NOTES_LAYOUT = {
    fallbackContainerWidth: 820,
    resizerWidth: 1,
} as const;

export function getNotesPaneProfile(containerWidth: number): NotesPaneProfile {
    for (let index = NOTES_PANE_PROFILES.length - 1; index >= 0; index -= 1) {
        const profile = NOTES_PANE_PROFILES[index];

        if (containerWidth >= profile.minWindowWidth) {
            return profile;
        }
    }

    return NOTES_PANE_PROFILES[0];
}

export function getNotesPreferredPaneWidths(
    containerWidth: number,
): NotesPaneWidths {
    const profile = getNotesPaneProfile(containerWidth);

    return {
        sidebar: profile.sidebar.preferred,
        list: profile.list.preferred,
    };
}

export const NOTES_UI = {
    root: `
        @container/notes
        grid
        h-full
        min-h-0
        w-full
        overflow-hidden

        bg-white
        font-sans
        text-foreground

        transition-[grid-template-columns]
        duration-150
        ease-out

        dark:bg-[#1c1c1c]
    `,

    sidebar: {
        root: `
            @container/folders

            min-h-0
            min-w-0
            overflow-y-auto

            bg-[#f1f1f1]

            px-1.5
            py-3

            @min-[120px]/folders:px-2

            @min-[145px]/folders:px-2.5
            @min-[145px]/folders:py-4

            @min-[180px]/folders:px-3

            dark:bg-[#262626]
        `,

        heading: `
            mb-2
            px-2

            text-[12px]
            font-semibold
            text-foreground/45

            @min-[120px]/folders:text-[13px]

            @min-[145px]/folders:text-[14px]

            @min-[180px]/folders:text-[15px]
        `,

        nav: `
            space-y-0.5

            @min-[180px]/folders:space-y-1
        `,

        button: `
            flex
            h-8
            w-full
            items-center

            gap-1.5
            rounded-lg
            pr-1.5

            text-left
            text-[11px]

            transition-colors
            duration-100

            @min-[120px]/folders:gap-2
            @min-[120px]/folders:pr-2
            @min-[120px]/folders:text-[12px]

            @min-[145px]/folders:text-[13px]

            @min-[180px]/folders:h-9
            @min-[180px]/folders:text-[14px]
        `,

        label: `
            min-w-0
            flex-1
            truncate
            font-medium
        `,

        count: `
            shrink-0

            text-[9px]
            tabular-nums
            text-foreground/35

            @min-[120px]/folders:text-[10px]

            @min-[145px]/folders:text-[11px]

            @min-[180px]/folders:text-[12px]
        `,

        icon: `
            size-3.5
            shrink-0

            fill-[#f4bf3a]
            text-[#d9a729]

            @min-[145px]/folders:size-4

            @min-[180px]/folders:size-[18px]
        `,

        indentBase: 10,
        indentStep: 14,
    },

    list: {
        root: `
            @container/note-list

            flex
            min-h-0
            min-w-0
            flex-col
            overflow-hidden

            bg-[#fafafa]

            dark:bg-[#202020]
        `,

        header: `
            shrink-0

            border-b
            border-black/8

            px-2.5
            py-2.5

            @min-[160px]/note-list:px-3

            @min-[185px]/note-list:px-4
            @min-[185px]/note-list:py-3

            @min-[215px]/note-list:px-4.5

            @min-[250px]/note-list:px-5

            dark:border-white/8
        `,

        headerRow: `
            flex
            min-w-0
            items-start
            justify-between
            gap-2
        `,

        titleWrapper: `
            min-w-0
            flex-1
            text-right
        `,

        title: `
            truncate

            text-[14px]
            font-semibold
            tracking-tight

            @min-[160px]/note-list:text-[16px]

            @min-[185px]/note-list:text-[17px]

            @min-[215px]/note-list:text-[18px]

            @min-[250px]/note-list:text-[19px]
        `,

        count: `
            mt-0.5

            text-[9px]
            text-foreground/40

            @min-[160px]/note-list:text-[10px]

            @min-[185px]/note-list:text-[11px]

            @min-[215px]/note-list:text-[12px]
        `,

        body: `
            min-h-0
            flex-1
            overflow-y-auto

            p-1.5

            @min-[185px]/note-list:p-2

            @min-[250px]/note-list:p-2.5
        `,

        message: `
            px-3
            py-4

            text-[11px]
            text-foreground/40

            @min-[160px]/note-list:text-[12px]

            @min-[185px]/note-list:text-[14px]

            @min-[250px]/note-list:text-[15px]
        `,

        item: `
            mb-1
            w-full

            rounded-xl

            px-2
            py-2

            text-left

            transition-colors
            duration-100

            @min-[160px]/note-list:px-2.5

            @min-[185px]/note-list:px-3
            @min-[185px]/note-list:py-2.5

            @min-[250px]/note-list:py-3
        `,

        itemTitle: `
            truncate

            text-[12px]
            font-semibold

            @min-[160px]/note-list:text-[13px]

            @min-[185px]/note-list:text-[14px]

            @min-[215px]/note-list:text-[15px]

            @min-[250px]/note-list:text-[16px]
        `,
    },

    viewer: {
        root: `
            @container/viewer

            flex
            min-h-0
            min-w-0
            flex-col
            overflow-hidden

            bg-white

            dark:bg-[#1c1c1c]
        `,

        toolbar: `
            flex
            h-11
            shrink-0
            items-center
            justify-between

            px-3

            @min-[340px]/viewer:h-12
            @min-[340px]/viewer:px-4

            @min-[440px]/viewer:px-5

            @min-[700px]/viewer:h-13
            @min-[700px]/viewer:px-6

            @min-[900px]/viewer:h-14
            @min-[900px]/viewer:px-7
        `,

        date: `
            text-right

            text-[10px]
            font-medium
            tabular-nums
            text-foreground/40

            @min-[340px]/viewer:text-[11px]

            @min-[440px]/viewer:text-[12px]

            @min-[700px]/viewer:text-[13px]

            @min-[900px]/viewer:text-[14px]
        `,

        scroller: `
            min-h-0
            flex-1
            overflow-y-auto
        `,

        article: `
            mx-auto
            w-full
            max-w-[780px]

            px-5
            pb-12
            pt-2

            @min-[340px]/viewer:px-7
            @min-[340px]/viewer:pb-14

            @min-[440px]/viewer:px-10
            @min-[440px]/viewer:pb-16

            @min-[700px]/viewer:px-12
            @min-[700px]/viewer:pb-20
            @min-[700px]/viewer:pt-3

            @min-[900px]/viewer:max-w-[820px]
            @min-[900px]/viewer:px-14
            @min-[900px]/viewer:pb-24
            @min-[900px]/viewer:pt-4
        `,

        title: `
            text-[24px]
            font-semibold
            leading-tight
            tracking-tight
            text-foreground

            @min-[340px]/viewer:text-[27px]

            @min-[440px]/viewer:text-[30px]

            @min-[700px]/viewer:text-[32px]

            @min-[900px]/viewer:text-[34px]
        `,

        message: `
            flex
            h-full
            items-center
            justify-center

            px-4
            text-center

            text-[12px]
            text-foreground/40

            @min-[340px]/viewer:text-[13px]

            @min-[440px]/viewer:text-[14px]

            @min-[700px]/viewer:text-[15px]
        `,
    },

    markdown: `
        mt-4

        text-[13px]
        leading-6
        text-foreground/80

        @min-[340px]/viewer:text-[14px]

        @min-[440px]/viewer:mt-5
        @min-[440px]/viewer:text-[15px]
        @min-[440px]/viewer:leading-7

        @min-[700px]/viewer:mt-6
        @min-[700px]/viewer:text-[16px]

        @min-[900px]/viewer:text-[17px]
        @min-[900px]/viewer:leading-8


        [&_h1]:mb-3
        [&_h1]:mt-7
        [&_h1]:text-[20px]
        [&_h1]:font-semibold
        [&_h1]:tracking-tight
        [&_h1]:text-foreground

        @min-[340px]/viewer:[&_h1]:text-[22px]

        @min-[440px]/viewer:[&_h1]:mt-8
        @min-[440px]/viewer:[&_h1]:text-2xl

        @min-[700px]/viewer:[&_h1]:text-[26px]

        @min-[900px]/viewer:[&_h1]:text-[28px]


        [&_h2]:mb-2
        [&_h2]:mt-6
        [&_h2]:text-[17px]
        [&_h2]:font-semibold
        [&_h2]:tracking-tight
        [&_h2]:text-foreground

        @min-[340px]/viewer:[&_h2]:text-[18px]

        @min-[440px]/viewer:[&_h2]:mt-8
        @min-[440px]/viewer:[&_h2]:text-xl

        @min-[700px]/viewer:[&_h2]:text-[22px]

        @min-[900px]/viewer:[&_h2]:text-2xl


        [&_h3]:mb-2
        [&_h3]:mt-5
        [&_h3]:text-[15px]
        [&_h3]:font-semibold
        [&_h3]:text-foreground

        @min-[340px]/viewer:[&_h3]:text-[16px]

        @min-[440px]/viewer:[&_h3]:mt-6
        @min-[440px]/viewer:[&_h3]:text-lg

        @min-[700px]/viewer:[&_h3]:text-xl

        @min-[900px]/viewer:[&_h3]:text-[21px]


        [&_p]:my-3

        @min-[440px]/viewer:[&_p]:my-4


        [&_strong]:font-semibold
        [&_strong]:text-foreground


        [&_a]:break-words
        [&_a]:underline
        [&_a]:decoration-foreground/25
        [&_a]:underline-offset-2
        [&_a]:transition-colors
        [&_a]:duration-100

        hover:[&_a]:decoration-foreground/70


        [&_ul]:my-3
        [&_ul]:list-disc
        [&_ul]:pl-5

        @min-[440px]/viewer:[&_ul]:my-4
        @min-[440px]/viewer:[&_ul]:pl-6


        [&_ol]:my-3
        [&_ol]:list-decimal
        [&_ol]:pl-5

        @min-[440px]/viewer:[&_ol]:my-4
        @min-[440px]/viewer:[&_ol]:pl-6


        [&_li]:my-1


        [&_blockquote]:my-4
        [&_blockquote]:border-l-2
        [&_blockquote]:border-[#e6b62f]
        [&_blockquote]:pl-3
        [&_blockquote]:italic
        [&_blockquote]:text-foreground/60

        @min-[440px]/viewer:[&_blockquote]:my-5
        @min-[440px]/viewer:[&_blockquote]:pl-4


        [&_hr]:my-6
        [&_hr]:border-black/10

        @min-[440px]/viewer:[&_hr]:my-8

        dark:[&_hr]:border-white/10


        [&_code]:rounded
        [&_code]:bg-black/[0.055]
        [&_code]:px-1.5
        [&_code]:py-0.5
        [&_code]:font-mono
        [&_code]:text-[0.9em]

        dark:[&_code]:bg-white/[0.07]


        [&_pre]:my-4
        [&_pre]:max-w-full
        [&_pre]:overflow-x-auto
        [&_pre]:rounded-lg
        [&_pre]:bg-black/[0.055]
        [&_pre]:p-3
        [&_pre]:leading-6

        @min-[440px]/viewer:[&_pre]:my-5
        @min-[440px]/viewer:[&_pre]:rounded-xl
        @min-[440px]/viewer:[&_pre]:p-4

        @min-[700px]/viewer:[&_pre]:p-5

        dark:[&_pre]:bg-white/[0.06]


        [&_pre_code]:bg-transparent
        [&_pre_code]:p-0


        [&_img]:my-5
        [&_img]:h-auto
        [&_img]:max-w-full
        [&_img]:rounded-lg

        @min-[440px]/viewer:[&_img]:my-6
        @min-[440px]/viewer:[&_img]:rounded-xl


        [&_table]:my-5
        [&_table]:w-full
        [&_table]:max-w-full
        [&_table]:border-collapse
        [&_table]:text-[12px]

        @min-[440px]/viewer:[&_table]:my-6
        @min-[440px]/viewer:[&_table]:text-sm

        @min-[700px]/viewer:[&_table]:text-[15px]

        @min-[900px]/viewer:[&_table]:text-[16px]


        [&_th]:border
        [&_th]:border-black/10
        [&_th]:bg-black/[0.025]
        [&_th]:px-2
        [&_th]:py-1.5
        [&_th]:text-left
        [&_th]:font-semibold

        @min-[440px]/viewer:[&_th]:px-3
        @min-[440px]/viewer:[&_th]:py-2

        dark:[&_th]:border-white/10
        dark:[&_th]:bg-white/[0.035]


        [&_td]:break-words
        [&_td]:border
        [&_td]:border-black/10
        [&_td]:px-2
        [&_td]:py-1.5

        @min-[440px]/viewer:[&_td]:px-3
        @min-[440px]/viewer:[&_td]:py-2

        dark:[&_td]:border-white/10
    `,

    toggle: {
        button: `
            flex
            size-7
            shrink-0
            items-center
            justify-center

            rounded-md

            text-foreground/40

            transition-colors
            duration-100

            hover:bg-black/[0.05]
            hover:text-foreground/70

            dark:hover:bg-white/[0.06]
        `,

        icon: `
            size-[17px]
        `,
    },

    resizer: {
        root: `
            group
            relative
            z-20

            h-full
            w-full

            cursor-col-resize
            touch-none
            select-none
            overflow-visible

            bg-black/10

            dark:bg-white/10
        `,

        hitArea: `
            absolute
            inset-y-0
            left-1/2

            w-3
            -translate-x-1/2

            cursor-col-resize

            group-hover:bg-black/[0.025]
            group-active:bg-black/[0.04]

            dark:group-hover:bg-white/[0.025]
            dark:group-active:bg-white/[0.04]
        `,
    },
} as const;
