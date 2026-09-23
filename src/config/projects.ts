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

export type Project = {
    id: string;
    name: string;
    category: string;

    description: string;

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
        id: "wids-wildfire",
        name: "WiDS Global Datathon 2026",
        category: "Machine Learning · Survival Modeling",

        description:
            "A multi-horizon wildfire risk forecasting pipeline for predicting evacuation-zone threat at 12, 24, 48, and 72 hours, combining 87 engineered spatial, temporal, and fire-dynamics features with gradient-boosting and survival-model ensembles.",

        status: "Completed",
        year: "2026",
        role: "Machine Learning Engineer",

        technologies: [
            "Python",
            "LightGBM",
            "XGBoost",
            "CatBoost",
            "Scikit-learn",
            "Pandas",
            "NumPy",
            "Survival Modeling",
        ],

        repositories: [
            {
                label: "GitHub",
                url: "https://github.com/Rishik15/WiDs",
            },
            {
                label: "Kaggle",
                url: "https://www.kaggle.com/competitions/WiDSWorldWide_GlobalDathon26/writeups/wids-global-datathon-2026-solution-btt-heatwave",
            },
        ],

        languages: [
            {
                name: "Python",
                percentage: 100,
            },
        ],

        highlights: [
            {
                label: "Feature Space",
                value: "87 Engineered",
            },
            {
                label: "Modeling",
                value: "GBM + Survival",
            },
            {
                label: "Forecast Horizons",
                value: "12–72 Hours",
            },
        ],
    },

    {
        id: "betafit",
        name: "BetaFit",
        category: "Full Stack · Fitness",

        description:
            "A containerized three-tier fitness platform with a React frontend, Flask/Gunicorn application layer, and MySQL persistence, integrating SQLAlchemy data access, OAuth authentication, Socket.IO real-time communication, media storage, and automated backend testing.",

        status: "Completed",
        year: "2026",
        role: "Full-Stack Developer",

        technologies: [
            "Python",
            "TypeScript",
            "React",
            "Flask",
            "SQLAlchemy",
            "MySQL",
            "Socket.IO",
            "Docker",
            "Google OAuth",
            "Cloudinary",
            "Pytest",
        ],

        repositories: [
            {
                label: "Frontend",
                url: "https://github.com/Rishik15/groupProject-frontend",
            },
            {
                label: "Backend",
                url: "https://github.com/Rishik15/groupProject-backend",
            },
        ],

        languages: [
            {
                name: "Python",
                percentage: 50,
            },
            {
                name: "TypeScript",
                percentage: 46,
            },
            {
                name: "CSS",
                percentage: 4,
            },
        ],

        highlights: [
            {
                label: "Deployment",
                value: "Docker Compose",
            },
            {
                label: "Persistence",
                value: "MySQL + ORM",
            },
            {
                label: "Realtime Layer",
                value: "Socket.IO",
            },
        ],
    },

    {
        id: "erica",
        name: "Erica",
        category: "AI · Knowledge Graph",

        description:
            "A GraphRAG-based tutoring system that extracts concepts and relationships into Neo4j, traverses the resulting knowledge graph for retrieval, and synthesizes grounded instructional responses through hosted or locally served LLMs in a Dockerized Chainlit application.",

        status: "Completed",
        year: "2026",
        role: "Lead Developer",

        technologies: [
            "Python",
            "LangChain",
            "Neo4j",
            "GraphRAG",
            "Ollama",
            "Qwen2.5",
            "Chainlit",
            "Docker",
        ],

        repositories: [
            {
                label: "GitHub",
                url: "https://github.com/Rishik15/erica",
            },
        ],

        languages: [
            {
                name: "Python",
                percentage: 100,
            },
        ],

        highlights: [
            {
                label: "Retrieval",
                value: "GraphRAG",
            },
            {
                label: "Knowledge Store",
                value: "Neo4j",
            },
            {
                label: "LLM Runtime",
                value: "API + Ollama",
            },
        ],
    },

    {
        id: "fork-it",
        name: "ForkIt",
        category: "Machine Learning · Recommendation",

        description:
            "A hybrid group recommendation system that vectorizes free-text preferences with TF-IDF, one-hot encodes categorical attributes, aggregates individual representations through weighted averaging, and ranks restaurant candidates using cosine similarity behind a Flask REST API.",

        status: "Completed",
        year: "2025",
        role: "Machine Learning Engineer",

        technologies: [
            "Python",
            "Scikit-learn",
            "Pandas",
            "NumPy",
            "Flask",
            "BeautifulSoup",
            "TF-IDF",
            "Cosine Similarity",
        ],

        repositories: [
            {
                label: "GitHub",
                url: "https://github.com/Rishik15/ForkIt",
            },
        ],

        languages: [
            {
                name: "Python",
                percentage: 90,
            },
            {
                name: "JavaScript",
                percentage: 7,
            },
            {
                name: "CSS",
                percentage: 3,
            },
        ],

        highlights: [
            {
                label: "Text Encoding",
                value: "TF-IDF",
            },
            {
                label: "Group Modeling",
                value: "Weighted Vectors",
            },
            {
                label: "Ranking",
                value: "Cosine Similarity",
            },
        ],
    },

    {
        id: "quickdraw",
        name: "QuickDraw",
        category: "Deep Learning · Full Stack",

        description:
            "A full-stack sketch classification system that couples an interactive React drawing client with a Flask inference service, a TensorFlow model-training pipeline, and MongoDB persistence to perform real-time prediction on user-generated drawings.",

        status: "Completed",
        year: "2025",
        role: "Full-Stack ML Engineer",

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
                label: "GitHub",
                url: "https://github.com/Rishik15/quickdraw",
            },
        ],

        languages: [
            {
                name: "Python",
                percentage: 58,
            },
            {
                name: "JavaScript",
                percentage: 35,
            },
            {
                name: "CSS",
                percentage: 7,
            },
        ],

        highlights: [
            {
                label: "Model Training",
                value: "TensorFlow",
            },
            {
                label: "Model Serving",
                value: "Flask REST",
            },
            {
                label: "Application State",
                value: "MongoDB",
            },
        ],
    },

    {
        id: "thread-insight",
        name: "ThreadInsight",
        category: "Data Analytics · NLP",

        description:
            "A Reddit analytics pipeline that ingests subreddit posts and comments through PRAW, transforms activity data with Pandas, computes engagement and contributor metrics, and exposes temporal, distributional, and keyword analyses through an interactive Streamlit dashboard.",

        status: "Completed",
        year: "2024",
        role: "Data Application Developer",

        technologies: [
            "Python",
            "Streamlit",
            "PRAW",
            "Pandas",
            "Plotly",
            "Matplotlib",
            "Scikit-learn",
            "WordCloud",
        ],

        repositories: [
            {
                label: "GitHub",
                url: "https://github.com/Rishik15/ThreadInsight",
            },
            {
                label: "Live Demo",
                url: "https://threadinsight.streamlit.app/",
            },
        ],

        languages: [
            {
                name: "Python",
                percentage: 100,
            },
        ],

        highlights: [
            {
                label: "Data Ingestion",
                value: "Reddit API",
            },
            {
                label: "Aggregation",
                value: "Posts + Comments",
            },
            {
                label: "Visualization",
                value: "Plotly + Streamlit",
            },
        ],
    },
];
