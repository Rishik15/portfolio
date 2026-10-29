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

export type TerminalDraft = {
  command: string;
  result: TerminalResult;
};

export type TerminalEntry = TerminalDraft & {
  id: number;
};
