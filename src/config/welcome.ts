import { WINDOW_IDS, type WindowId } from "@/config/windows";

export type WelcomeAction =
    | { readonly label: string; readonly windowId: WindowId }
    | { readonly label: string; readonly href: string };

export const WELCOME = {
    name: "Hello, I'm Rishik",
    role: "Software Engineer · CS senior at NJIT",
    intro: "This is my portfolio, set up like a little desktop. Click any app in the dock to look around, or open the terminal and type /help.",

    outcomes: [{ title: "Full-stack" }, { title: "ML & AI" }],

    primary: { label: "About me", windowId: WINDOW_IDS.about },
    secondary: [
        { label: "Resume", windowId: WINDOW_IDS.resume },
        { label: "Contact", href: "mailto:rishikreddy.yesgari@gmail.com" },
    ],
} as const satisfies {
    name: "Hello, I'm Rishik";
    role: string;
    intro: string;
    outcomes: readonly { title: string }[];
    primary: WelcomeAction;
    secondary: readonly WelcomeAction[];
};
