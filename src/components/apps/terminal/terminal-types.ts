export type TerminalResult =
    | {
          type: "help";
      }
    | {
          type: "text";
          lines: readonly string[];
      };

export type TerminalEntry = {
    command: string;
    result: TerminalResult;
};
