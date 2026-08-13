export type TerminalCommand = {
    name: string;
    description: string;
    visibleInHelp: boolean;
};

export const TERMINAL_PROMPT = {
    user: "rishik / portfolio",
    symbol: "❯",
} as const;

export const TERMINAL_WELCOME = {
    title: "Hello there. I'm Rishik, welcome to my portfolio.",
    hint: "Type /help to see the list of available commands.",
} as const;

export const TERMINAL_COMMANDS: readonly TerminalCommand[] = [
    {
        name: "/help",
        description: "Show available commands",
        visibleInHelp: true,
    },
    {
        name: "/clear",
        description: "Clear terminal output",
        visibleInHelp: true,
    },
];
