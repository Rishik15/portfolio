export type ProjectFile = {
    name: string;
    content: string;
};

export type Project = {
    slug: string;
    name: string;
    description: string;
    files: ProjectFile[];
    githubUrl?: string;
};

export const PROJECTS: Project[] = [
    {
        slug: "nlp-to-sql",
        name: "NLP to SQL",
        description:
            "A read-only natural-language-to-SQL system built around deterministic agent routing, schema retrieval, validation, and AWS Bedrock.",
        files: [
            {
                name: "README.md",
                content: `NLP to SQL

A read-only natural-language-to-SQL system for querying large relational databases from plain English.

The pipeline includes:
- Security guardrails
- Intent interpretation
- Schema retrieval
- SQL generation
- Query execution
- SQL validation
- Response synthesis

The system uses deterministic routing and request-scoped state so each stage has a clear responsibility.`,
            },
            {
                name: "stack.txt",
                content: `Python
AWS Bedrock
PostgreSQL
Strands Agents
Pydantic
sqlglot
AWS Knowledge Bases`,
            },
            {
                name: "architecture.txt",
                content: `guardrail
    ↓
intent
    ↓
schema retrieval
    ↓
sql builder
    ↓
executor
    ↓
validator
    ↓
response synthesizer`,
            },
        ],
    },
    {
        slug: "applypilot",
        name: "ApplyPilot",
        description:
            "A local job discovery and application workflow focused on filtering realistic opportunities before expensive model scoring.",
        files: [
            {
                name: "README.md",
                content: `ApplyPilot

A job discovery and application workflow designed to reduce repetitive job-search work.

The system focuses on:
- Job discovery
- Early deterministic filtering
- Relevance scoring
- Application workflow automation
- Tracking application progress

The goal is to reject obviously incompatible roles before sending jobs into more expensive AI-based evaluation.`,
            },
            {
                name: "stack.txt",
                content: `Python
Playwright
Claude Code
AWS
Pydantic
JobSpy`,
            },
        ],
    },
    {
        slug: "recommendation-system",
        name: "Recommendation System",
        description:
            "A content-based recommendation system using TF-IDF features and cosine similarity.",
        files: [
            {
                name: "README.md",
                content: `Recommendation System

A content-based recommendation system that converts item metadata into TF-IDF vectors and compares them using cosine similarity.

The system returns items most similar to a selected item based on their textual features.`,
            },
            {
                name: "stack.txt",
                content: `Python
Pandas
scikit-learn
TF-IDF
Cosine Similarity`,
            },
        ],
    },
    {
        slug: "wids-2026",
        name: "WiDS Datathon 2026",
        description:
            "A machine-learning competition solution using an ensemble of gradient-boosted models with monotonic survival predictions.",
        files: [
            {
                name: "README.md",
                content: `WiDS Datathon 2026

Competition machine-learning pipeline created for the WiDS Datathon 2026.

Result:
3rd place

Final score:
0.97250

The solution blended multiple gradient-boosted models and enforced monotonic predictions across forecast horizons.`,
            },
            {
                name: "stack.txt",
                content: `Python
LightGBM
XGBoost
CatBoost
Pandas
NumPy
scikit-learn`,
            },
            {
                name: "result.txt",
                content: `Placement: 3rd
Score: 0.97250`,
            },
        ],
    },
];

export function findProject(value: string) {
    const normalized = value.trim().replace(/\/$/, "").toLowerCase();

    return PROJECTS.find(
        (project) =>
            project.slug.toLowerCase() === normalized ||
            project.name.toLowerCase() === normalized,
    );
}

export function getProjectBySlug(slug: string) {
    return PROJECTS.find((project) => project.slug === slug);
}
