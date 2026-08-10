export type DockItemConfig = {
    readonly id: string;
    readonly label: string;
    readonly icon: string;
};

export const APP_DOCK_ITEMS = [
    {
        id: "about",
        label: "About Me",
        icon: "/icons/about.webp",
    },
    {
        id: "notes",
        label: "Notes",
        icon: "/icons/notes.webp",
    },
] as const satisfies readonly DockItemConfig[];

export const CONTACT_DOCK_ITEMS = [
    {
        id: "github",
        label: "GitHub",
        icon: "/icons/github.webp",
    },
    {
        id: "linkedin",
        label: "LinkedIn",
        icon: "/icons/linkedin.webp",
    },
    {
        id: "email",
        label: "Email",
        icon: "/icons/email.webp",
    },
] as const satisfies readonly DockItemConfig[];
