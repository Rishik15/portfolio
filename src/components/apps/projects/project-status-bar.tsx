import {
    PROJECT_FALLBACK_LANGUAGE_COLORS,
    PROJECT_LANGUAGE_COLORS,
    PROJECTS_UI,
} from "@/components/apps/projects/projects-ui";
import type { Project, ProjectLanguage } from "@/config/projects";

type ProjectStatusBarProps = {
    project: Project;
};

function getLanguageColor(language: ProjectLanguage, index: number) {
    return (
        PROJECT_LANGUAGE_COLORS[language.name] ??
        PROJECT_FALLBACK_LANGUAGE_COLORS[
            index % PROJECT_FALLBACK_LANGUAGE_COLORS.length
        ]
    );
}

export function ProjectStatusBar({ project }: ProjectStatusBarProps) {
    const repositoryCount = project.repositories.length;

    const languageSummary = project.languages
        .map((language) => `${language.name} ${language.percentage}%`)
        .join(", ");

    return (
        <footer
            className={`
                flex
                shrink-0
                items-center
                justify-between
                border-t
                border-foreground/10
                text-foreground/45

                ${PROJECTS_UI.chrome.statusHeight}
                ${PROJECTS_UI.status.padding}
                ${PROJECTS_UI.status.text}
                ${PROJECTS_UI.status.gap}
            `}
        >
            <div
                className={`
                    flex
                    min-w-0
                    items-center
                    ${PROJECTS_UI.status.gap}
                `}
            >
                {project.languages.length > 0 && (
                    <>
                        <span className="sr-only">{languageSummary}</span>

                        <div
                            className={`
                                flex
                                shrink-0
                                overflow-hidden
                                rounded-full
                                bg-foreground/8
                                ${PROJECTS_UI.status.languageBar}
                            `}
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
                            className={`
                                min-w-0
                                items-center
                                overflow-hidden

                                ${PROJECTS_UI.status.languageList}
                                ${PROJECTS_UI.status.languageGap}
                            `}
                            aria-hidden="true"
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
                                        className="
                                            size-1.5
                                            rounded-full
                                            @7xl/projects:size-2
                                        "
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

            <div className="shrink-0 whitespace-nowrap text-foreground/40">
                {repositoryCount}{" "}
                {repositoryCount === 1 ? "repository" : "repositories"}
            </div>
        </footer>
    );
}
