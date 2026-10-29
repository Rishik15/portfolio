import { usePrintUnit } from "@/components/apps/terminal/terminal-print";
import { TERMINAL_UI } from "@/components/apps/terminal/terminal-ui";
import { HELP_COMMANDS } from "@/components/apps/terminal/terminal-units";

const FOOTER_ITEMS = [
  { key: "↑", text: "Up Arrow for previous command" },
  { key: "↓", text: "Down Arrow for next command" },
  { key: "Esc", text: "Clears current input" },
] as const;

function HelpUnit({
  index,
  className,
  children,
}: {
  index: number;
  className: string;
  children: React.ReactNode;
}) {
  return (
    <div {...usePrintUnit(index)} className={className}>
      {children}
    </div>
  );
}

export function TerminalHelp() {
  return (
    <div className={TERMINAL_UI.help.root}>
      <HelpUnit index={0} className={TERMINAL_UI.help.header}>
        <span>Command</span>
        <span>What it does</span>
      </HelpUnit>

      <div className={TERMINAL_UI.help.body}>
        {HELP_COMMANDS.map((command, index) => (
          <HelpUnit
            key={command.name}
            index={1 + index}
            className={TERMINAL_UI.help.row}
          >
            <span className={TERMINAL_UI.help.command}>{command.name}</span>

            <span className={TERMINAL_UI.help.description}>
              {command.description}
            </span>
          </HelpUnit>
        ))}
      </div>

      <div className={TERMINAL_UI.help.footer}>
        {FOOTER_ITEMS.map((item, index) => (
          <HelpUnit
            key={item.key}
            index={1 + HELP_COMMANDS.length + index}
            className={TERMINAL_UI.help.footerItem}
          >
            <span className={TERMINAL_UI.help.footerKey}>{item.key}</span>

            <span>{item.text}</span>
          </HelpUnit>
        ))}
      </div>
    </div>
  );
}
