export type TerminalResult =
    | {
          type: "help";
      }
    | {
          type: "skills";
      }
    | {
          type: "certificates";
      }
    | {
          type: "text";
          lines: readonly string[];
      };

export type TerminalEntry = {
    command: string;
    result: TerminalResult;
};
