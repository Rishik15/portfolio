import type { AppWindowConfig } from "@/components/windows/window-manager";

export const WINDOW_IDS = {
    welcome: "welcome",
    terminal: "terminal",
    about: "about",
    notes: "notes",
    images: "images",
    resume: "resume",
    projects: "projects",
    experience: "experience",
} as const;

export type WindowId = (typeof WINDOW_IDS)[keyof typeof WINDOW_IDS];

export const WINDOW_CONFIGS = [
    {
        id: WINDOW_IDS.welcome,
        title: "Welcome",

        sizing: {
            width: {
                defaultFraction: 0.43,
                minFraction: 0.25,
                maxFraction: 1,
                contentFloor: 400,
            },
            height: {
                defaultFraction: 0.5,
                minFraction: 0.35,
                maxFraction: 1,
                contentFloor: 350,
            },
        },

        initialPlacement: {
            x: 0.5,
            y: 0.5,
        },

        canMinimize: true,
        canMaximize: true,
        canResize: true,

        hideTitleBar: false,
        openMaximized: false,
    },

    {
        id: WINDOW_IDS.terminal,
        title: "Terminal",

        sizing: {
            width: {
                defaultFraction: 0.5,
                minFraction: 0.25,
                maxFraction: 1,
                contentFloor: 620,
            },
            height: {
                defaultFraction: 0.73,
                minFraction: 0.35,
                maxFraction: 1,
                contentFloor: 400,
            },
        },

        initialPlacement: {
            x: 0.5,
            y: 0.4,
        },

        canMinimize: true,
        canMaximize: true,
        canResize: true,

        hideTitleBar: false,
        openMaximized: false,
    },

    {
        id: WINDOW_IDS.about,
        title: "About Me",

        sizing: {
            width: {
                defaultFraction: 0.38,
                minFraction: 0.25,
                maxFraction: 1,
                contentFloor: 380,
            },
            height: {
                defaultFraction: 0.59,
                minFraction: 0.35,
                maxFraction: 1,
                contentFloor: 340,
            },
        },

        initialPlacement: {
            x: 0.06,
            y: 0.8,
        },

        canMinimize: true,
        canMaximize: true,
        canResize: true,

        hideTitleBar: false,
        openMaximized: false,
    },

    {
        id: WINDOW_IDS.notes,
        title: "Notes",

        sizing: {
            width: {
                defaultFraction: 0.6,
                minFraction: 0.25,
                maxFraction: 1,
                contentFloor: 540,
            },
            height: {
                defaultFraction: 0.73,
                minFraction: 0.35,
                maxFraction: 1,
                contentFloor: 420,
            },
        },

        initialPlacement: {
            x: 0.95,
            y: 0.08,
        },

        canMinimize: true,
        canMaximize: true,
        canResize: true,

        hideTitleBar: false,
        openMaximized: false,
    },

    {
        id: WINDOW_IDS.resume,
        title: "Resume",

        sizing: {
            width: {
                defaultFraction: 0.56,
                minFraction: 0.25,
                maxFraction: 1,
                contentFloor: 500,
            },
            height: {
                defaultFraction: 0.79,
                minFraction: 0.35,
                maxFraction: 1,
                contentFloor: 420,
            },
        },

        initialPlacement: {
            x: 0.5,
            y: 0.45,
        },

        canMinimize: true,
        canMaximize: true,
        canResize: true,

        closeOnMinimize: true,

        hideTitleBar: false,
        openMaximized: false,
    },

    {
        id: WINDOW_IDS.projects,
        title: "Projects",

        sizing: {
            width: {
                defaultFraction: 0.76,
                minFraction: 0.25,
                maxFraction: 1,
                contentFloor: 680,
            },
            height: {
                defaultFraction: 0.79,
                minFraction: 0.35,
                maxFraction: 1,
                contentFloor: 480,
            },
        },

        initialPlacement: {
            x: 0.7,
            y: 0.65,
        },

        canMinimize: true,
        canMaximize: true,
        canResize: true,

        closeOnMinimize: true,

        hideTitleBar: false,
        openMaximized: false,
    },

    {
        id: WINDOW_IDS.experience,
        title: "Experience",

        sizing: {
            width: {
                defaultFraction: 0.7,
                minFraction: 0.25,
                maxFraction: 1,
                contentFloor: 640,
            },
            height: {
                defaultFraction: 0.75,
                minFraction: 0.35,
                maxFraction: 1,
                contentFloor: 460,
            },
        },

        initialPlacement: {
            x: 0.1,
            y: 0.2,
        },

        canMinimize: true,
        canMaximize: true,
        canResize: true,

        closeOnMinimize: true,

        hideTitleBar: false,
        openMaximized: false,
    },
] satisfies readonly AppWindowConfig[];
