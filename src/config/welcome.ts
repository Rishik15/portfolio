import { WINDOW_IDS, type WindowId } from "@/config/windows";

export type WelcomeAction =
    | { readonly label: string; readonly windowId: WindowId }
    | { readonly label: string; readonly href: string };

export const WELCOME = {
    eyebrow: "Welcome",
    name: "Rishik Yesgari",
    role: "Software engineer · CS senior at NJIT",
    intro: "Hey, thanks for stopping by.",

    outcomes: [{ title: "Full-stack" }, { title: "ML & AI" }],

    primary: { label: "About me", windowId: WINDOW_IDS.about },
    secondary: [
        { label: "Resume", windowId: WINDOW_IDS.resume },
        { label: "Contact", href: "mailto:rishikreddy.yesgari@gmail.com" },
    ],
} as const satisfies {
    eyebrow: string;
    name: string;
    role: string;
    intro: string;
    outcomes: readonly { title: string }[];
    primary: WelcomeAction;
    secondary: readonly WelcomeAction[];
};
