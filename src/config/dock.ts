import { WINDOW_IDS, type WindowId } from "@/config/windows";

type DockItemBase = {
    readonly id: string;
    readonly label: string;
    readonly icon: string;
};

export type WindowDockItemConfig = DockItemBase & {
    readonly type: "window";
    readonly windowId: WindowId;
};

export type LinkDockItemConfig = DockItemBase & {
    readonly type: "link";
    readonly href: string;
};

export type EmailDockItemConfig = DockItemBase & {
    readonly type: "email";
    readonly email: string;
};

export type DockItemConfig =
    WindowDockItemConfig | LinkDockItemConfig | EmailDockItemConfig;

export const APP_DOCK_ITEMS = [
    {
        id: "about",
        type: "window",
        label: "About Me",
        icon: "/icons/about.webp",
        windowId: WINDOW_IDS.about,
    },
    {
        id: "notes",
        type: "window",
        label: "Notes",
        icon: "/icons/notes.webp",
        windowId: WINDOW_IDS.notes,
    },
    {
        id: "photos",
        type: "window",
        label: "Photos",
        icon: "/icons/photos.webp",
        windowId: WINDOW_IDS.images,
    },
] as const satisfies readonly DockItemConfig[];

export const CONTACT_DOCK_ITEMS = [
    {
        id: "github",
        type: "link",
        label: "GitHub",
        icon: "/icons/github.webp",
        href: "https://github.com/Rishik15",
    },
    {
        id: "linkedin",
        type: "link",
        label: "LinkedIn",
        icon: "/icons/linkedin.webp",
        href: "https://www.linkedin.com/in/rishikreddyyesgari/",
    },
    {
        id: "email",
        type: "email",
        label: "Email",
        icon: "/icons/email.webp",
        email: "rishikreddy.yesgari@gmail.com",
    },
] as const satisfies readonly DockItemConfig[];
