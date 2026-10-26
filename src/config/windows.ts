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

        width: "44vw",
        height: "62vh",

        minWidth: 460,
        minHeight: 400,

        maxWidth: 680,
        maxHeight: 520,

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

        width: "50vw",
        height: "73vh",

        minWidth: 620,
        minHeight: 400,

        maxWidth: 1420,
        maxHeight: 880,

        initialPlacement: {
            x: 0.5,
            y: 0.40,
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

        width: "38vw",
        height: "59vh",

        minWidth: 380,
        minHeight: 340,

        maxWidth: 660,
        maxHeight: 620,

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

        width: "60vw",
        height: "73vh",

        minWidth: 540,
        minHeight: 420,

        maxWidth: 1140,
        maxHeight: 820,

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

        width: "56vw",
        height: "79vh",

        minWidth: 500,
        minHeight: 420,

        maxWidth: 980,
        maxHeight: 960,

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

        width: "76vw",
        height: "79vh",

        minWidth: 680,
        minHeight: 480,

        maxWidth: 1500,
        maxHeight: 960,

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

        width: "70vw",
        height: "75vh",

        minWidth: 640,
        minHeight: 460,

        maxWidth: 1340,
        maxHeight: 900,

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
