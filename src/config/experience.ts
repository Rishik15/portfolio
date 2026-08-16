export type ExperienceType =
    | "Internship"
    | "Full-time"
    | "Part-time"
    | "Contract"
    | "Research"
    | "Other";

export type Experience = {
    id: string;
    year: number;

    role: string;
    company: string;
    type: ExperienceType;

    startDate: string;
    endDate: string;
    location: string;

    summary: string;
    highlights: readonly string[];
    technologies: readonly string[];

    companyUrl?: string;
};

export const EXPERIENCES: readonly Experience[] = [
    {
        id: "dimension-consulting-ai-engineering-intern",
        year: 2026,

        role: "AI Engineering Intern",
        company: "Dimension Consulting",
        type: "Internship",

        startDate: "June 2026",
        endDate: "Present",
        location: "Edison, NJ",

        summary:
            "Contributing to agentic AI and ERP automation systems while developing hands-on experience with NetSuite business workflows and AI-driven actions.",

        highlights: [
            "Developed proficiency in NetSuite ERP through implementation-focused training across procure-to-pay, order-to-cash, role-based accountability, and client ERP workflows.",
            "Contributed to agentic AI system components for NetSuite and ERP automation.",
            "Connected business workflows with AI-driven actions using Amazon Bedrock, Strands Agents, Python, AWS SDK, and React.",
        ],

        technologies: [
            "Python",
            "Amazon Bedrock",
            "Strands Agents",
            "AWS SDK",
            "React",
            "NetSuite ERP",
        ],
    },

    {
        id: "njit-undergraduate-research-assistant",
        year: 2025,

        role: "Undergraduate Research Assistant",
        company: "Department of Data Science, NJIT",
        type: "Research",

        startDate: "August 2025",
        endDate: "April 2026",
        location: "Newark, NJ",

        summary:
            "Worked on scalable machine learning experimentation for large-scale time-series datasets, with a focus on reusable data pipelines, automated evaluation, and faster model experimentation.",

        highlights: [
            "Built modular Python pipelines with Pandas and NumPy to ingest, clean, and prepare large-scale time-series data across more than 20 real-world datasets.",
            "Developed automated training and evaluation workflows across more than 10 models to improve repeatability and model comparison.",
            "Reduced end-to-end experimentation runtime by 75% by parallelizing training and evaluation workloads with multiprocessing.",
            "Presented the research at the NEBEC Conference through a technical talk on scalable time-series machine learning workflows and model evaluation.",
        ],

        technologies: [
            "Python",
            "Pandas",
            "NumPy",
            "Machine Learning",
            "Time-Series Data",
            "Multiprocessing",
            "Model Evaluation",
        ],
    },

    {
        id: "chambers-capital-ventures-ai-ml-intern",
        year: 2025,

        role: "AI and ML Intern",
        company:
            "Chambers Capital Ventures | Break Through Tech @ Cornell Tech",
        type: "Internship",

        startDate: "June 2025",
        endDate: "December 2025",
        location: "Remote",

        summary:
            "Developed a predictive machine learning workflow for evaluating founder grit from behavioral survey data and communicating model findings to investment stakeholders.",

        highlights: [
            "Developed a predictive machine learning pipeline using large-scale behavioral survey data to support data-driven investor decision-making.",
            "Performed feature analysis and selection to reduce more than 60 features to 15 meaningful features for downstream modeling.",
            "Presented model outputs and feature insights through a stakeholder-facing application to support discussion, comparison, and refinement of predictive findings.",
        ],

        technologies: [
            "Machine Learning",
            "Feature Engineering",
            "Feature Selection",
            "Model Evaluation",
            "Data Analysis",
        ],
    },
];
