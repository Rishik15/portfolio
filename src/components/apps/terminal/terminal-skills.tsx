import { SKILL_GROUPS } from "@/config/skills";

const SKILL_COUNT = SKILL_GROUPS.reduce(
    (total, group) => total + group.skills.length,
    0,
);

export function TerminalSkills() {
    return (
        <div
            className="
                w-full
                border
                border-foreground/25
                bg-background/20
            "
        >
            <div className="px-2 pb-2 pt-2">
                {SKILL_GROUPS.map((group) => (
                    <div
                        key={group.category}
                        className="
                            grid
                            grid-cols-[10.5rem_minmax(0,1fr)]
                            items-start
                            gap-4
                            px-2
                            py-2
                            transition-colors
                            hover:bg-foreground/[0.035]
                        "
                    >
                        <div className="flex items-center gap-2">
                            <span
                                aria-hidden="true"
                                className="
                                    h-1.5
                                    w-1.5
                                    shrink-0
                                    bg-blue-500/75
                                    dark:bg-blue-400/75
                                "
                            />

                            <span
                                className="
                                    text-xs
                                    font-medium
                                    text-blue-600/85
                                    dark:text-blue-400/85
                                "
                            >
                                {group.category}
                            </span>
                        </div>

                        <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                            {group.skills.map((skill, index) => (
                                <div
                                    key={skill}
                                    className="flex items-center gap-2"
                                >
                                    {index > 0 && (
                                        <span
                                            aria-hidden="true"
                                            className="
                                                text-[10px]
                                                text-foreground/25
                                            "
                                        >
                                            ·
                                        </span>
                                    )}

                                    <span
                                        className="
                                            text-sm
                                            text-foreground/80
                                        "
                                    >
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
