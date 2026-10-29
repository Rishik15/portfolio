export type SkillGroup = {
    category: string;
    skills: readonly string[];
};

export const SKILL_GROUPS: readonly SkillGroup[] = [
    {
        category: "Languages",
        skills: [
            "Python",
            "TypeScript",
            "JavaScript",
            "SQL",
            "Java",
            "C",
            "Bash",
        ],
    },
    {
        category: "Web",
        skills: ["React", "Next.js", "Tailwind CSS", "Flask", "REST APIs"],
    },
    {
        category: "Software & Delivery",
        skills: [
            "CI/CD",
            "Git",
            "Docker",
            "Unit Testing",
            "Integration Testing",
            "Selenium",
            "SDLC",
        ],
    },
    {
        category: "Machine Learning",
        skills: ["scikit-learn", "Deep Learning", "PyTorch", "TensorFlow"],
    },
    {
        category: "AI",
        skills: [
            "LLMs",
            "RAG",
            "Agentic AI",
            "Strands",
            "LangChain",
            "Amazon Bedrock",
        ],
    },
    {
        category: "Data & Databases",
        skills: [
            "ETL Pipelines",
            "Pandas",
            "NumPy",
            "PostgreSQL",
            "MongoDB",
            "Neo4j",
            "Tableau",
        ],
    },
    {
        category: "Cloud & Tools",
        skills: ["AWS", "SageMaker", "Azure ML", "Linux"],
    },
];
