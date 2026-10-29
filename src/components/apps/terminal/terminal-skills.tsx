import { usePrintUnit } from "@/components/apps/terminal/terminal-print";
import { TERMINAL_UI } from "@/components/apps/terminal/terminal-ui";
import { SKILL_GROUPS, type SkillGroup } from "@/config/skills";

function SkillRow({ group, index }: { group: SkillGroup; index: number }) {
    return (
        <tr {...usePrintUnit(index)} className={TERMINAL_UI.skills.row}>
            <th scope="row" className={TERMINAL_UI.skills.category}>
                <span className={TERMINAL_UI.skills.categoryLabel}>
                    <span
                        aria-hidden="true"
                        className={TERMINAL_UI.skills.dot}
                    />

                    {group.category}
                </span>
            </th>

            <td className={TERMINAL_UI.skills.cell}>
                <ul className={TERMINAL_UI.skills.skillList}>
                    {group.skills.map((skill) => (
                        <li key={skill} className={TERMINAL_UI.skills.skill}>
                            {skill}
                        </li>
                    ))}
                </ul>
            </td>
        </tr>
    );
}

export function TerminalSkills() {
    return (
        <div className={TERMINAL_UI.skills.root}>
            <table className={TERMINAL_UI.skills.table}>
                <caption className="sr-only">Skills</caption>

                <tbody>
                    {SKILL_GROUPS.map((group, index) => (
                        <SkillRow
                            key={group.category}
                            group={group}
                            index={index}
                        />
                    ))}
                </tbody>
            </table>
        </div>
    );
}
