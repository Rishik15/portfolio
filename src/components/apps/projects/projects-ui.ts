export const PROJECTS_UI = {
    root: `
        @container/projects
        flex
        h-full
        min-h-0
        w-full
        min-w-0
        bg-background
        text-foreground
    `,

    chrome: {
        headerHeight: `
            h-14
            @6xl/projects:h-[60px]
            @7xl/projects:h-16
        `,

        statusHeight: `
            h-10
            @6xl/projects:h-11
            @7xl/projects:h-12
        `,
    },

    sidebar: {
        width: `
            w-[150px]
            @3xl/projects:w-[190px]
            @6xl/projects:w-[205px]
            @7xl/projects:w-[220px]
        `,

        headerPadding: `
            px-3
            @3xl/projects:px-4
            @6xl/projects:px-5
        `,

        headerText: `
            text-[11px]
            @3xl/projects:text-[12px]
            @6xl/projects:text-[13px]
            @7xl/projects:text-[14px]
        `,

        bodyPadding: `
            p-1.5
            @3xl/projects:p-2
            @6xl/projects:p-2.5
            @7xl/projects:p-3
        `,

        listGap: `
            space-y-1
            @7xl/projects:space-y-1.5
        `,

        itemPadding: `
            px-2
            py-2

            @3xl/projects:px-2.5

            @6xl/projects:px-3
            @6xl/projects:py-2.5

            @7xl/projects:py-3
        `,

        itemNameText: `
            text-[11px]
            @3xl/projects:text-[12px]
            @6xl/projects:text-[13px]
            @7xl/projects:text-[14px]
        `,

        itemCategoryText: `
            text-[9px]
            @3xl/projects:text-[10px]
            @6xl/projects:text-[11px]
            @7xl/projects:text-[12px]
        `,

        footerPadding: `
            px-3
            @3xl/projects:px-4
            @6xl/projects:px-5
        `,

        footerText: `
            text-[9px]
            @3xl/projects:text-[10px]
            @6xl/projects:text-[11px]
            @7xl/projects:text-[12px]
        `,

        emptyItemHeight: `
            h-9
            @3xl/projects:h-10
            @6xl/projects:h-11
            @7xl/projects:h-12
        `,
    },

    workspace: {
        headerPadding: `
            px-3
            @3xl/projects:px-5
            @6xl/projects:px-6
            @7xl/projects:px-7
        `,

        headerGap: `
            gap-2
            @3xl/projects:gap-4
            @6xl/projects:gap-5
        `,

        titleText: `
            text-[12px]
            @3xl/projects:text-[13px]
            @6xl/projects:text-[15px]
            @7xl/projects:text-[17px]
        `,

        categoryText: `
            text-[9px]
            @3xl/projects:text-[10px]
            @6xl/projects:text-[11px]
            @7xl/projects:text-[12px]
        `,

        contentPadding: `
            p-3
            @2xl/projects:p-4
            @3xl/projects:p-5
            @6xl/projects:p-6
            @7xl/projects:p-7
        `,

        sectionMargin: `
            mt-4
            @3xl/projects:mt-5
            @6xl/projects:mt-6
            @7xl/projects:mt-7
        `,

        sectionGrid: `
            grid-cols-1

            @4xl/projects:grid-cols-[minmax(0,1.45fr)_minmax(210px,0.8fr)]

            @6xl/projects:grid-cols-[minmax(0,1.5fr)_minmax(240px,0.78fr)]

            @7xl/projects:grid-cols-[minmax(0,1.55fr)_minmax(270px,0.75fr)]
        `,
    },

    repository: {
        wrapperGap: `
            gap-1
            @3xl/projects:gap-1.5
            @6xl/projects:gap-2
        `,

        button: `
            h-7
            gap-1.5
            px-2
            text-[9px]

            @3xl/projects:px-2.5
            @3xl/projects:text-[10px]

            @6xl/projects:h-8
            @6xl/projects:px-3
            @6xl/projects:text-[11px]

            @7xl/projects:h-9
            @7xl/projects:px-3.5
            @7xl/projects:text-[12px]
        `,

        label: `
            hidden
            @4xl/projects:inline
        `,

        githubIcon: `
            size-3.5
            @6xl/projects:size-4
        `,

        externalIcon: `
            size-3
            @6xl/projects:size-3.5
        `,
    },

    section: {
        paddingY: `
            py-4
            @3xl/projects:py-5
            @6xl/projects:py-6
            @7xl/projects:py-7
        `,

        titleMargin: `
            mb-3
            @3xl/projects:mb-4
            @7xl/projects:mb-5
        `,

        titleText: `
            text-[9px]
            @3xl/projects:text-[10px]
            @6xl/projects:text-[11px]
            @7xl/projects:text-[12px]
        `,

        overviewRightPadding: `
            @4xl/projects:pr-5
            @3xl/projects:pr-6
            @6xl/projects:pr-7
            @7xl/projects:pr-8
        `,

        detailsLeftPadding: `
            @4xl/projects:pl-5
            @3xl/projects:pl-6
            @6xl/projects:pl-7
            @7xl/projects:pl-8
        `,

        bodyText: `
            text-[12px]
            leading-5

            @3xl/projects:text-[13px]
            @3xl/projects:leading-6

            @6xl/projects:text-[14px]

            @7xl/projects:text-[16px]
            @7xl/projects:leading-7
        `,
    },

    highlights: {
        marginTop: `
            mt-5
            @3xl/projects:mt-6
            @6xl/projects:mt-7
            @7xl/projects:mt-8
        `,

        grid: `
            grid-cols-1
            @2xl/projects:grid-cols-2
            @4xl/projects:grid-cols-3
        `,

        gap: `
            gap-2.5
            @3xl/projects:gap-3
            @6xl/projects:gap-4
        `,

        card: `
            min-h-16
            px-3
            py-2.5

            @6xl/projects:min-h-[72px]
            @6xl/projects:px-4

            @7xl/projects:min-h-20
            @7xl/projects:px-5
        `,

        valueText: `
            text-[14px]
            @3xl/projects:text-[15px]
            @6xl/projects:text-[17px]
            @7xl/projects:text-[19px]
        `,

        labelText: `
            text-[8px]
            @3xl/projects:text-[9px]
            @6xl/projects:text-[10px]
            @7xl/projects:text-[11px]
        `,
    },

    details: {
        grid: `
            grid
            grid-cols-2
            gap-x-4
            gap-y-4

            @4xl/projects:block
            @4xl/projects:space-y-4

            @6xl/projects:space-y-5
            @7xl/projects:space-y-6
        `,

        labelText: `
            text-[8px]
            @3xl/projects:text-[9px]
            @6xl/projects:text-[10px]
            @7xl/projects:text-[11px]
        `,

        valueText: `
            text-[11px]
            @3xl/projects:text-[12px]
            @6xl/projects:text-[13px]
            @7xl/projects:text-[15px]
        `,

        technologyText: `
            text-[10px]
            leading-5

            @3xl/projects:text-[11px]

            @6xl/projects:text-[12px]
            @6xl/projects:leading-6

            @7xl/projects:text-[14px]
        `,
    },

    preview: {
        loadingText: `
            text-[10px]
            @3xl/projects:text-[11px]
            @6xl/projects:text-[12px]
            @7xl/projects:text-[13px]
        `,

        spinner: `
            size-3.5
            @6xl/projects:size-4
            @7xl/projects:size-[18px]
        `,
    },

    status: {
        padding: `
            px-3
            @3xl/projects:px-4
            @6xl/projects:px-5
        `,

        text: `
            text-[9px]
            @3xl/projects:text-[10px]
            @6xl/projects:text-[11px]
            @7xl/projects:text-[12px]
        `,

        gap: `
            gap-2
            @3xl/projects:gap-3
            @6xl/projects:gap-4
        `,

        languageBar: `
            h-1
            w-24

            @3xl/projects:w-44

            @6xl/projects:h-1.5
            @6xl/projects:w-48

            @7xl/projects:w-52
        `,

        languageList: `
            hidden
            @5xl/projects:flex
        `,

        languageGap: `
            gap-2.5
            @6xl/projects:gap-3
            @7xl/projects:gap-4
        `,
    },
} as const;

export const PROJECTS_MOTION = {
    duration: 0.13,
    enterY: 4,
    exitY: -2,
} as const;

export const PROJECTS_LIMITS = {
    repositories: 3,
    highlights: 3,
} as const;

export const PROJECT_PREVIEW_ASPECT_RATIO = "16 / 8.5";

export const PROJECT_LANGUAGE_COLORS: Readonly<Record<string, string>> = {
    Python: "#3572A5",
    TypeScript: "#5B5BD6",
    JavaScript: "#F1E05A",
    Java: "#B07219",
    "C++": "#F34B7D",
    C: "#555555",
    CSS: "#663399",
    HTML: "#E34C26",
    Shell: "#89E051",
    SQL: "#E38C00",
};

export const PROJECT_FALLBACK_LANGUAGE_COLORS = [
    "#8B949E",
    "#6E7681",
    "#57606A",
    "#AFB8C1",
] as const;
