import type { AppWindowConfig } from "@/components/windows/window-manager";

export const WINDOW_IDS = {
    terminal: "terminal",
    about: "about",
    notes: "notes",
    images: "images",
    resume: "resume",
} as const;

export type WindowId = (typeof WINDOW_IDS)[keyof typeof WINDOW_IDS];

export const WINDOW_CONFIGS = [
    {
        id: WINDOW_IDS.terminal,
        title: "Terminal",

        width: "70vw",
        height: "68vh",

        minWidth: 760,
        minHeight: 440,

        initialX: 210,
        initialY: 100,

        canMinimize: true,
        canMaximize: true,
        canResize: true,

        hideTitleBar: false,
        openMaximized: false,
    },

    {
        id: WINDOW_IDS.about,
        title: "About Me",

        width: "520px",
        height: "470px",

        minWidth: 420,
        minHeight: 360,

        initialX: 120,
        initialY: 280,

        canMinimize: true,
        canMaximize: true,
        canResize: true,

        hideTitleBar: false,
        openMaximized: false,
    },

    {
        id: WINDOW_IDS.notes,
        title: "Notes",

        width: "760px",
        height: "600px",

        minWidth: 600,
        minHeight: 440,

        initialX: 650,
        initialY: 60,

        canMinimize: true,
        canMaximize: true,
        canResize: true,

        hideTitleBar: false,
        openMaximized: false,
    },

    {
        id: WINDOW_IDS.images,
        title: "Photos",

        width: "860px",
        height: "560px",

        minWidth: 640,
        minHeight: 420,

        initialX: 50,
        initialY: 50,

        canMinimize: true,
        canMaximize: true,
        canResize: true,

        hideTitleBar: false,
        openMaximized: false,
    },

    {
        id: WINDOW_IDS.resume,
        title: "Resume",

        width: "760px",
        height: "650px",

        minWidth: 560,
        minHeight: 420,

        initialX: 360,
        initialY: 70,

        canMinimize: true,
        canMaximize: true,
        canResize: true,

        closeOnMinimize: true,

        hideTitleBar: false,
        openMaximized: false,
    },
] satisfies readonly AppWindowConfig[];
