export type TerminalCommand = {
    name: string;
    description: string;
    visibleInHelp: boolean;
};

export const TERMINAL_PROMPT = {
    user: "rishik/portfolio",
    symbol: "❯",
} as const;

export const TERMINAL_WELCOME = {
    title: "Hello there. I'm Rishik, welcome to my portfolio.",
    description: "Explore the portfolio through the terminal.",
    help: {
        prefix: "Type",
        command: "/help",
        suffix: "and press Enter to see what's available.",
    },
} as const;

export const TERMINAL_COMMANDS: readonly TerminalCommand[] = [
    {
        name: "/help",
        description: "Show available commands",
        visibleInHelp: true,
    },
    {
        name: "/resume",
        description: "Open my resume",
        visibleInHelp: true,
    },
    {
        name: "/skills",
        description: "View my technical skills",
        visibleInHelp: true,
    },
    {
        name: "/certificates",
        description: "View my certifications",
        visibleInHelp: true,
    },
    {
        name: "/clear",
        description: "Clear terminal output",
        visibleInHelp: true,
    },
];
