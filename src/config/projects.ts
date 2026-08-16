export type ProjectRepository = {
    label: string;
    url: string;
};

export type ProjectLanguage = {
    name: string;
    percentage: number;
};

export type ProjectHighlight = {
    label: string;
    value: string;
};

export type ProjectImage = {
    src: string;
    alt: string;
};

export type Project = {
    id: string;
    name: string;
    category: string;

    description: string;

    image: ProjectImage;

    status: string;
    year: string;
    role: string;

    technologies: readonly string[];

    repositories: readonly ProjectRepository[];

    languages: readonly ProjectLanguage[];

    highlights: readonly ProjectHighlight[];
};

export const PROJECTS: readonly Project[] = [
    {
        id: "nlp-to-sql",
        name: "NLP-to-SQL",
        category: "Agentic AI · Data",

        description:
            "A read-only natural-language-to-SQL system that converts database questions into validated SQL using an agentic workflow, schema retrieval, semantic caching, deterministic execution, and response synthesis.",

        image: {
            src: "/projects/nlp-to-sql.webp",
            alt: "NLP-to-SQL project interface",
        },

        status: "Active",
        year: "2026",
        role: "AI Engineer",

        technologies: [
            "Python",
            "Amazon Bedrock",
            "PostgreSQL",
            "Strands Agents",
            "Psycopg2",
            "SQLGlot",
        ],

        repositories: [
            {
                label: "Frontend",
                url: "https://github.com/Rishik15",
            },
            {
                label: "Backend",
                url: "https://github.com/Rishik15",
            },
            {
                label: "Database",
                url: "https://github.com/Rishik15",
            },
        ],

        languages: [
            {
                name: "Python",
                percentage: 76,
            },
            {
                name: "TypeScript",
                percentage: 16,
            },
            {
                name: "SQL",
                percentage: 8,
            },
        ],

        highlights: [
            {
                label: "Workflow",
                value: "7 Agents",
            },
            {
                label: "Mode",
                value: "Read Only",
            },
            {
                label: "Cache",
                value: "Semantic",
            },
        ],
    },

    {
        id: "erica",
        name: "Erica",
        category: "AI · Knowledge Graph",

        description:
            "An AI tutoring system that combines retrieval-augmented generation with entity extraction, relationship modeling, knowledge graphs, graph traversal, and citation grounding to produce explainable responses.",

        image: {
            src: "/projects/erica.webp",
            alt: "Erica AI tutor project interface",
        },

        status: "Completed",
        year: "2026",
        role: "AI Engineer",

        technologies: [
            "Python",
            "LangChain",
            "Neo4j",
            "Ollama",
            "Qwen",
            "Docker",
        ],

        repositories: [
            {
                label: "GitHub",
                url: "https://github.com/Rishik15",
            },
        ],

        languages: [
            {
                name: "Python",
                percentage: 88,
            },
            {
                name: "JavaScript",
                percentage: 8,
            },
            {
                name: "CSS",
                percentage: 4,
            },
        ],

        highlights: [
            {
                label: "Architecture",
                value: "RAG",
            },
            {
                label: "Graph",
                value: "Neo4j",
            },
            {
                label: "Runtime",
                value: "Docker",
            },
        ],
    },

    {
        id: "quickdraw",
        name: "QuickDraw",
        category: "Machine Learning · Web",

        description:
            "A real-time sketch recognition application that serves a TensorFlow model through a Flask REST API and connects it to a React frontend for low-latency drawing classification.",

        image: {
            src: "/projects/quickdraw.webp",
            alt: "QuickDraw sketch recognition project interface",
        },

        status: "Completed",
        year: "2026",
        role: "ML Engineer",

        technologies: [
            "Python",
            "TensorFlow",
            "Flask",
            "React",
            "REST APIs",
            "MongoDB",
        ],

        repositories: [
            {
                label: "Frontend",
                url: "https://github.com/Rishik15",
            },
            {
                label: "Backend",
                url: "https://github.com/Rishik15",
            },
        ],

        languages: [
            {
                name: "Python",
                percentage: 55,
            },
            {
                name: "JavaScript",
                percentage: 38,
            },
            {
                name: "CSS",
                percentage: 7,
            },
        ],

        highlights: [
            {
                label: "Model",
                value: "TensorFlow",
            },
            {
                label: "Inference",
                value: "Real Time",
            },
            {
                label: "API",
                value: "REST",
            },
        ],
    },
];
