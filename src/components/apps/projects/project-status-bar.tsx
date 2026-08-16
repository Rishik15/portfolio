import type { Project, ProjectLanguage } from "@/config/projects";

type ProjectStatusBarProps = {
    project: Project;
};

const LANGUAGE_COLORS: Readonly<Record<string, string>> = {
    Python: "#3572A5",
    TypeScript: "#5B5BD6",
    JavaScript: "#F1E05A",
    Java: "#B07219",
    "C++": "#F34B7D",
    C: "#555555",
    CSS: "#663399",
    HTML: "#E34C26",
    Shell: "#89E051",
    SQL: "#E38C00",
};

const FALLBACK_LANGUAGE_COLORS = [
    "#8B949E",
    "#6E7681",
    "#57606A",
    "#AFB8C1",
] as const;

function getLanguageColor(language: ProjectLanguage, index: number) {
    return (
        LANGUAGE_COLORS[language.name] ??
        FALLBACK_LANGUAGE_COLORS[index % FALLBACK_LANGUAGE_COLORS.length]
    );
}

export function ProjectStatusBar({ project }: ProjectStatusBarProps) {
    const repositoryCount = project.repositories.length;

    return (
        <footer
            className="
                flex
                h-10
                shrink-0
                items-center
                justify-between
                gap-4
                border-t
                border-foreground/10
                px-4
                text-[10px]
                text-foreground/45
            "
        >
            <div className="flex min-w-0 items-center gap-3">
                {project.languages.length > 0 && (
                    <>
                        <div
                            className="
                                flex
                                h-1
                                w-44
                                shrink-0
                                overflow-hidden
                                rounded-full
                                bg-foreground/8
                            "
                            aria-hidden="true"
                        >
                            {project.languages.map((language, index) => (
                                <div
                                    key={language.name}
                                    style={{
                                        width: `${Math.max(
                                            0,
                                            Math.min(language.percentage, 100),
                                        )}%`,
                                        backgroundColor: getLanguageColor(
                                            language,
                                            index,
                                        ),
                                    }}
                                />
                            ))}
                        </div>

                        <div
                            className="
                                flex
                                min-w-0
                                items-center
                                gap-3
                                overflow-hidden
                            "
                        >
                            {project.languages.map((language, index) => (
                                <div
                                    key={language.name}
                                    className="
                                        flex
                                        shrink-0
                                        items-center
                                        gap-1.5
                                    "
                                >
                                    <span
                                        className="size-1.5 rounded-full"
                                        style={{
                                            backgroundColor: getLanguageColor(
                                                language,
                                                index,
                                            ),
                                        }}
                                    />

                                    <span>{language.name}</span>

                                    <span className="text-foreground/30">
                                        {language.percentage}%
                                    </span>
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </div>

            <div className="shrink-0 text-foreground/40">
                {repositoryCount}{" "}
                {repositoryCount === 1 ? "repository" : "repositories"}
            </div>
        </footer>
    );
}
