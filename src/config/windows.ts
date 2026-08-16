import type { AppWindowConfig } from "@/components/windows/window-manager";

export const WINDOW_IDS = {
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
        id: WINDOW_IDS.terminal,
        title: "Terminal",

        width: "70vw",
        height: "68vh",

        minWidth: 620,
        minHeight: 400,

        maxWidth: 1360,
        maxHeight: 820,

        initialPlacement: {
            x: 0.5,
            y: 0.45,
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

        width: "36vw",
        height: "52vh",

        minWidth: 380,
        minHeight: 340,

        maxWidth: 600,
        maxHeight: 560,

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

        width: "58vw",
        height: "66vh",

        minWidth: 540,
        minHeight: 420,

        maxWidth: 1080,
        maxHeight: 760,

        initialPlacement: {
            x: 0.92,
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

        width: "54vw",
        height: "72vh",

        minWidth: 500,
        minHeight: 420,

        maxWidth: 920,
        maxHeight: 900,

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

        width: "74vw",
        height: "72vh",

        minWidth: 680,
        minHeight: 480,

        maxWidth: 1440,
        maxHeight: 900,

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

        width: "68vw",
        height: "68vh",

        minWidth: 640,
        minHeight: 460,

        maxWidth: 1280,
        maxHeight: 840,

        initialPlacement: {
            x: 0.10,
            y: 0.20,
        },

        canMinimize: true,
        canMaximize: true,
        canResize: true,

        closeOnMinimize: true,

        hideTitleBar: false,
        openMaximized: false,
    },
] satisfies readonly AppWindowConfig[];
