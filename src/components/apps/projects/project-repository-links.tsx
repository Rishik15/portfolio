import type { ProjectRepository } from "@/config/projects";

type ProjectRepositoryLinksProps = {
    repositories: readonly ProjectRepository[];
};

function GithubIcon() {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="currentColor"
            aria-hidden="true"
            className="size-3.5 shrink-0"
        >
            <path d="M12 .7a11.5 11.5 0 0 0-3.64 22.41c.58.1.79-.25.79-.56v-2.23c-3.22.7-3.9-1.37-3.9-1.37-.53-1.34-1.29-1.7-1.29-1.7-1.05-.72.08-.7.08-.7 1.17.08 1.78 1.2 1.78 1.2 1.04 1.78 2.72 1.27 3.38.97.1-.75.41-1.27.74-1.56-2.57-.29-5.27-1.28-5.27-5.68 0-1.25.45-2.28 1.19-3.08-.12-.29-.52-1.46.11-3.04 0 0 .97-.31 3.16 1.18a10.93 10.93 0 0 1 5.75 0c2.19-1.49 3.15-1.18 3.15-1.18.64 1.58.24 2.75.12 3.04.74.8 1.19 1.83 1.19 3.08 0 4.41-2.71 5.38-5.29 5.67.42.36.79 1.06.79 2.14v3.17c0 .31.21.67.8.56A11.5 11.5 0 0 0 12 .7Z" />
        </svg>
    );
}

function ExternalLinkIcon() {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
            className="size-3 shrink-0"
        >
            <path d="M15 4h5v5" />
            <path d="M10 14 20 4" />
            <path d="M20 13v6a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1h6" />
        </svg>
    );
}

export function ProjectRepositoryLinks({
    repositories,
}: ProjectRepositoryLinksProps) {
    if (repositories.length === 0) {
        return null;
    }

    return (
        <div className="flex shrink-0 items-center gap-1.5">
            {repositories.slice(0, 3).map((repository) => (
                <a
                    key={`${repository.label}-${repository.url}`}
                    href={repository.url}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={`Open ${repository.label} repository on GitHub`}
                    className="flex h-7 items-center gap-1.5 rounded-md border border-foreground/10 bg-foreground/[0.025] px-2.5 text-[10px] font-medium text-foreground/60 transition-colors duration-100 hover:bg-foreground/[0.06] hover:text-foreground"
                >
                    <GithubIcon />

                    <span>{repository.label}</span>

                    <ExternalLinkIcon />
                </a>
            ))}
        </div>
    );
}
