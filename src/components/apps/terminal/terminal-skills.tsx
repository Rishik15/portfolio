import { TERMINAL_UI } from "@/components/apps/terminal/terminal-ui";
import { SKILL_GROUPS } from "@/config/skills";

export function TerminalSkills() {
    return (
        <div className={TERMINAL_UI.skills.root}>
            <div className={TERMINAL_UI.skills.body}>
                {SKILL_GROUPS.map((group) => (
                    <div
                        key={group.category}
                        className={TERMINAL_UI.skills.row}
                    >
                        <div className={TERMINAL_UI.skills.categoryWrapper}>
                            <span
                                aria-hidden="true"
                                className={TERMINAL_UI.skills.dot}
                            />

                            <span className={TERMINAL_UI.skills.category}>
                                {group.category}
                            </span>
                        </div>

                        <div className={TERMINAL_UI.skills.skillList}>
                            {group.skills.map((skill, index) => (
                                <div
                                    key={skill}
                                    className={TERMINAL_UI.skills.skillWrapper}
                                >
                                    {index > 0 && (
                                        <span
                                            aria-hidden="true"
                                            className={
                                                TERMINAL_UI.skills.separator
                                            }
                                        >
                                            ·
                                        </span>
                                    )}

                                    <span className={TERMINAL_UI.skills.skill}>
                                        {skill}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
